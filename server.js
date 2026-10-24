import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=fileURLToPath(new URL(".",import.meta.url));
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp"};

function send(res,status,obj){
  res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});
  res.end(JSON.stringify(obj));
}
function extractJson(text){
  const s=String(text||"").replace(/^```json\s*/i,"").replace(/```$/,"").trim();
  try{return JSON.parse(s)}catch{}
  const a=s.indexOf("{"),b=s.lastIndexOf("}");
  if(a>=0&&b>a){try{return JSON.parse(s.slice(a,b+1))}catch{}}
  return null;
}
async function body(req){
  let chunks=[],size=0;
  for await(const c of req){size+=c.length;if(size>8*1024*1024)throw new Error("too_large");chunks.push(c)}
  return JSON.parse(Buffer.concat(chunks).toString("utf8")||"{}");
}
async function ai(req,res){
  if(req.method==="GET") return send(res,200,{ready:Boolean(process.env.OPENAI_API_KEY),service:"FOOD COST AI"});
  if(req.method!=="POST") return send(res,405,{error:"Method not allowed"});
  if(!process.env.OPENAI_API_KEY) return send(res,503,{error:"OPENAI_API_KEY non configurée"});
  let data; try{data=await body(req)}catch{return send(res,400,{error:"Requête invalide"})}
  const {action,image}=data||{};
  if(action!=="analyze_plate"||typeof image!=="string"||!image.startsWith("data:image/")) return send(res,400,{error:"Image ou action invalide"});
  const prompt=`Tu aides un restaurateur à préparer une fiche technique à partir d'une photo de plat.
Identifie seulement ce qui est raisonnablement visible. Les poids sont des ESTIMATIONS à valider par l'humain.
N'invente jamais de prix fournisseur et n'affirme jamais qu'un grammage est exact.
Réponds uniquement en JSON valide:
{"recipe_name":"nom proposé","ingredients":[{"name":"ingrédient","qty":0,"unit":"g"}],"warning":"Grammages estimés à valider"}
Unités autorisées: g, kg, ml, cl, L, piece. Solides en g par défaut, sauces/liquides en ml.`;
  try{
    const r=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-6-luna",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image,detail:"low"}]}],max_output_tokens:1200})
    });
    const d=await r.json();
    if(!r.ok)return send(res,r.status,{error:d?.error?.message||"Erreur OpenAI"});
    const text=(d.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n")||d.output_text||"";
    const analysis=extractJson(text);
    if(!analysis)return send(res,502,{error:"Réponse IA non exploitable"});
    return send(res,200,{ok:true,analysis});
  }catch{return send(res,500,{error:"Erreur serveur IA"})}
}
async function staticFile(req,res){
  let p=new URL(req.url,"http://local").pathname;
  if(p==="/")p="/index.html";
  if(p.includes(".."))return res.end("Forbidden");
  try{
    const data=await readFile(join(root,p));
    res.writeHead(200,{"Content-Type":mime[extname(p)]||"application/octet-stream"});
    res.end(data);
  }catch{
    try{const data=await readFile(join(root,"index.html"));res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(data)}
    catch{res.writeHead(404);res.end("Not found")}
  }
}
const server=createServer(async(req,res)=>{
  const p=new URL(req.url,"http://local").pathname;
  if(p==="/api/food-cost-ai"||p==="/api/food-cost-ai/status")return ai(req,res);
  return staticFile(req,res);
});
server.listen(process.env.PORT||3000);
