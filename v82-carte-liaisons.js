/* FOOD COST V8.2 — carte complète + liaisons fournisseurs sûres */
(()=>{const RK="foodCostRecipesV3",PK="foodCostProductsV5",MIG="foodCostV82MenuSeed";
const get=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch{return d}},put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/œ/g,"oe").replace(/[^a-z0-9]+/g," ").trim();
const vocab=[
 ["prosciutto di parma","Jambon cru"],["jambon italien","Jambon cru"],["jambon blanc cuit superieur","Jambon blanc supérieur"],["jambon superieur","Jambon blanc supérieur"],
 ["grana padano","Grana Padano"],["parmigiano","Parmigiano Reggiano"],["parmesan","Parmesan"],["spianata","Spianata"],["bavette d aloyau","Bavette d'aloyau"],
 ["steak hache","Steak haché"],["viande hachee","Viande hachée"],["saumon fume","Saumon fumé"],["stracciatella","Stracciatella"],["burrata","Burrata"],
 ["mozzarella","Mozzarella"],["merguez","Merguez"],["champignons","Champignons"],["champignon","Champignons"],["crevettes","Crevettes"],["crevette","Crevettes"],
 ["gambas","Gambas"],["moules","Moules"],["moule","Moules"],["poulpe","Poulpe"],["thon","Thon"],["poisson","Poisson"],["poulet","Poulet"],
 ["creme","Crème"],["mascarpone","Mascarpone"],["chapelure","Chapelure"],["basilic","Basilic"],["aneth","Aneth"],["persil","Persil"],["menthe","Menthe"],
 ["roquette","Roquette"],["mangue","Mangue"],["huile d olive","Huile d'olive"],["lait","Lait"],["beurre","Beurre"],["ail","Ail"],
 ["pesto","Pesto vert"],["paccheri","Paccheri"],["penne","Penne"],["rigatoni","Rigatoni"],["linguine","Linguine"],["oeuf","Œuf"],["oeufs","Œuf"]
];
const liquid=n=>["creme","huile d olive","lait"].some(x=>norm(n).includes(x))?"ml":"g";
function extract(m){let s=norm((m.name||"")+" "+(m.description||"")),out=[];for(const [needle,name] of vocab)if(s.includes(norm(needle))&&!out.includes(name))out.push(name);return out}
function seed(){
 if(localStorage.getItem(MIG))return;
 let menu=window.FOOD_COST_MENU_DATA||[],rs=get(RK),changed=false;
 for(const m of menu){let r=rs.find(x=>norm(x.name)===norm(m.name)||(norm(m.name)==="poulet al capone"&&norm(x.name).includes("capone")));if(!r||r.id==="caponne"||norm(r.name)==="poulet al capone")continue;
   if((r.ingredients||[]).length)continue;
   let names=extract(m);if(!names.length)continue;
   r.ingredients=names.map(name=>({name,qty:0,unit:liquid(name),productId:"",subrecipeId:"",manualPrice:null,status:"à confirmer"}));changed=true;
 }
 if(changed)put(RK,rs);localStorage.setItem(MIG,"1");
}
function rule(i,p){let n=norm(i.name),pn=norm(p.name),s=norm(p.supplier),score=0,amb=false;
 const hit=(a,b)=>n.includes(a)&&pn.includes(b);
 if(hit("jambon cru","prosciutto")||hit("jambon italien","prosciutto"))score=100;
 if(hit("jambon blanc","jambon blanc"))score=100;
 if(hit("spianata","spianata"))score=100;if(hit("bavette","bavette"))score=100;if(hit("merguez","merguez"))score=100;
 if(hit("saumon fume","saumon fume"))score=100;if(hit("grana padano","grana padano"))score=100;if(hit("parmigiano","parmigiano"))score=100;
 if(hit("chapelure","chapelure"))score=100;if(hit("creme","creme uht"))score=100;if(hit("mangue","mangue"))score=100;
 if(hit("crevette","crevette"))score=100;if(hit("moule","moule"))score=100;if(hit("thon","thon"))score=100;
 if(hit("basilic","basilic")||hit("aneth","aneth")||hit("persil","persil plat")||hit("menthe","menthe")||hit("roquette","roquette"))score=100;
 if(hit("huile d olive","huile olive"))score=100;if(hit("lait","lait demi"))score=100;if(hit("beurre","beurre doux"))score=100;
 if(hit("pesto vert","pesto vert"))score=100;if(hit("paccheri","paccheri"))score=100;
 if(hit("steak hache","steak hache"))score=100;if(hit("viande hachee","hache boeuf"))score=100;
 if(n==="poulet"||n==="mozzarella"||n==="parmesan"||n==="champignons"||n==="poulpe"){amb=true;score=0}
 if(n.includes("cuisse")&&pn.includes("cuisse")&&pn.includes("poulet"))score=100;
 return{score,amb};
}
function compatible(i,p){return(p.unit==="kg"&&["g","kg"].includes(i.unit))||(p.unit==="L"&&["ml","cl","L"].includes(i.unit))||(p.unit==="piece"&&i.unit==="piece")}
function proposal(i){if(i.productId||i.subrecipeId||Number(i.manualPrice)>0)return null;let a=get(PK).map(p=>({p,...rule(i,p)})).filter(x=>x.score>=100&&compatible(i,x.p));return a.length===1?a[0].p:null}
function stats(){let rs=get(RK),safe=0,amb=0,missing=0;for(const r of rs)for(const i of r.ingredients||[]){if(i.productId||i.subrecipeId||Number(i.manualPrice)>0)continue;if(proposal(i))safe++;else{let n=norm(i.name);if(["poulet","mozzarella","parmesan","champignons","poulpe"].some(x=>n===x||n.includes(x)))amb++;else missing++}}return{safe,amb,missing}}
function render(){
 let panel=document.getElementById("recipes");if(!panel)return;let old=document.getElementById("v82Links");if(old)old.remove();
 let box=document.createElement("div");box.id="v82Links";box.className="card";let s=stats();
 box.innerHTML=`<b>🔗 Liaisons fournisseurs · carte complète</b><p class="muted small">Les correspondances sûres sont préparées, jamais appliquées sans validation. Mozzarella, parmesan, poulet générique, champignons et poulpe restent à contrôler.</p><div class="v82grid"><span><strong>${s.safe}</strong><small>sûres à valider</small></span><span><strong>${s.amb}</strong><small>ambiguës</small></span><span><strong>${s.missing}</strong><small>sans prix trouvé</small></span></div><button type="button" id="v82Apply" class="primary">Valider toutes les liaisons sûres</button>`;
 let anchor=document.getElementById("v81Queue");(anchor||panel.querySelector("h2")).insertAdjacentElement("afterend",box);
 document.getElementById("v82Apply").onclick=()=>{let rs=get(RK),n=0;for(const r of rs)for(const i of r.ingredients||[]){let p=proposal(i);if(p){i.productId=p.id;i.manualPrice=null;i.status=(i.status||"")+" · prix lié";n++}}put(RK,rs);alert(`${n} liaison${n>1?"s":""} fournisseur validée${n>1?"s":""}. Les cas ambigus n'ont pas été modifiés.`);try{renderRecipes?.()}catch(e){}setTimeout(()=>{render();document.dispatchEvent(new Event("visibilitychange"))},100)};
}
let st=document.createElement("style");st.textContent=".v82grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}.v82grid span{padding:9px;border-radius:12px;background:#f4f6f9;display:flex;flex-direction:column}.v82grid strong{font-size:1.15rem}.v82grid small{font-size:.72rem;color:#697386}#v82Apply{width:100%;margin-top:4px}";document.head.appendChild(st);
seed();setTimeout(()=>{try{renderRecipes?.()}catch(e){}render()},650);
})();