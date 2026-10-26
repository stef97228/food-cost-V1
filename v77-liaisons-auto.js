/* FOOD COST V7.7 — liaisons automatiques Recettes ↔ Produits fournisseurs */
(()=>{
const RK="foodCostRecipesV3", PK="foodCostProductsV5";
const get=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch{return d}};
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
 .replace(/\b(de|du|des|la|le|les|a|au|aux|et|d|l)\b/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
const words=s=>new Set(norm(s).split(" ").filter(x=>x.length>2));
const aliases=[
 ["poulet","cuisse poulet cuisse de poulet"],["jambon cru","prosciutto jambon italien prosciutto nazionale"],
 ["parmesan","parmesan grana padano parm regg parmigiano"],["mozzarella","mozzarella"],
 ["creme","creme uht"],["chapelure","chapelure"],["moule","moule"],
 ["crevette","crevette gambas"],["stracciatella","stracciatella"],["mangue","mangue"],
 ["bavette","bavette aloyau"],["spianata","spianata"],["champignon","champignon"],
 ["saumon","saumon"],["thon","thon longe"],["chatrou","chatrou poulpe polpo"]
];
function expanded(s){let n=norm(s);for(const [a,b] of aliases)if(n.includes(a))n+=" "+b;return n}
function score(a,b){
 let A=words(expanded(a)),B=words(expanded(b)),hit=0;
 A.forEach(x=>{if(B.has(x))hit++});
 if(!A.size||!B.size)return 0;
 return hit/Math.max(1,Math.min(A.size,B.size));
}
function candidates(name){
 const n=norm(name);
 return get(PK).map(p=>{
   let sc=score(name,p.name), pn=norm(p.name), ps=norm(p.supplier);
   // Métier: une découpe précise ne doit jamais être remplacée par une autre.
   if(n.includes("cuisse") && pn.includes("cuisse")) sc+=1.2;
   if(n.includes("cuisse") && pn.includes("filet")) sc-=2;
   if(n.includes("filet") && pn.includes("filet")) sc+=1.2;
   if(n.includes("filet") && pn.includes("cuisse")) sc-=2;
   // Correspondances déjà connues/validées pour le Poulet al Capone.
   if(n.includes("cuisse") && pn.includes("cuisse") && pn.includes("poulet") && ps.includes("martinique")) sc+=1.5;
   return {...p,_score:sc};
  })
  .filter(p=>p._score>=.45).sort((a,b)=>b._score-a._score).slice(0,4);
}
function money(n){return Number(n||0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}
function unitCost(i,p){
 let q=Number(i.qty)||0;if(!p||!q)return null;
 if(p.unit==="kg"&&i.unit==="g")return q/1000*p.price;
 if(p.unit==="kg"&&i.unit==="kg")return q*p.price;
 if(p.unit==="L"&&i.unit==="ml")return q/1000*p.price;
 if(p.unit==="L"&&i.unit==="cl")return q/100*p.price;
 if(p.unit==="L"&&i.unit==="L")return q*p.price;
 if(p.unit==="piece"&&i.unit==="piece")return q*p.price;
 return null;
}
const css=document.createElement("style");
css.textContent=`
.auto-link-box{margin:12px 0;padding:12px;border:1px solid #e2e5ea;border-radius:14px;background:#fafbfc}
.auto-link-head{display:flex;justify-content:space-between;gap:8px;align-items:center}
.auto-link-row{padding:10px 0;border-top:1px solid #eceef2}.auto-link-row:first-of-type{border-top:0}
.auto-link-row select{width:100%;margin-top:6px}.auto-link-ok{color:#176b3a;font-weight:700}.auto-link-warn{color:#8a4b16;font-weight:700}
.auto-link-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
`;
document.head.appendChild(css);

const form=document.getElementById("editForm");
if(!form)return;
const actions=form.querySelector(".actions");
if(document.getElementById("autoLinkBox"))return;
const box=document.createElement("div");box.id="autoLinkBox";box.className="auto-link-box";
box.innerHTML=`<div class="auto-link-head"><b>🔗 Prix fournisseurs · V7.7.2</b><button type="button" id="autoSuggestBtn">Proposer</button></div>
<p class="muted small">FOOD COST rapproche les ingrédients des produits validés des factures. Rien n'est lié sans ta validation.</p>
<div id="autoLinkRows"></div>
<div class="auto-link-actions"><button type="button" id="autoApplyBtn">Valider les liaisons</button><button type="button" id="autoClearBtn">Effacer propositions</button></div>`;
actions ? form.insertBefore(box,actions) : form.appendChild(box);
let proposed={};

function currentRecipe(){
 const id=document.getElementById("editId")?.value;
 return get(RK).find(r=>r.id===id);
}
function render(){
 const r=currentRecipe(),host=document.getElementById("autoLinkRows");if(!r){host.innerHTML="";return}
 proposed={};
 host.innerHTML=(r.ingredients||[]).map((i,idx)=>{
   if(i.subrecipeId)return `<div class="auto-link-row"><b>${i.name}</b><div class="auto-link-ok">Sous-recette liée</div></div>`;
   const products=get(PK),linked=products.find(p=>p.id===i.productId),c=candidates(i.name);
   const iname=norm(i.name);
   const safeC=(iname.includes("cuisse") ? c.filter(p=>norm(p.name).includes("cuisse")) :
                iname.includes("filet") ? c.filter(p=>norm(p.name).includes("filet")) : c);
   if(linked){
    const cost=unitCost(i,linked);
    return `<div class="auto-link-row"><b>${i.name}</b><div class="auto-link-ok">✓ ${linked.name} · ${money(linked.price)}/${linked.unit}${cost!=null?" · "+money(cost):""}</div></div>`;
   }
   if(!safeC.length)return `<div class="auto-link-row"><b>${i.name}</b><div class="auto-link-warn">Aucun produit sûr trouvé</div></div>`;
   proposed[idx]=safeC[0].id;
   return `<div class="auto-link-row"><b>${i.name}</b><select data-i="${idx}"><option value="">Ne pas lier</option>${safeC.map((p,j)=>`<option value="${p.id}" ${j===0?"selected":""}>${p.name} — ${money(p.price)}/${p.unit}</option>`).join("")}</select></div>`;
 }).join("");
 host.querySelectorAll("select").forEach(s=>s.onchange=()=>proposed[Number(s.dataset.i)]=s.value);
}
document.getElementById("autoSuggestBtn").onclick=render;
document.getElementById("autoClearBtn").onclick=()=>{proposed={};document.getElementById("autoLinkRows").innerHTML=""};
document.getElementById("autoApplyBtn").onclick=()=>{
 const id=document.getElementById("editId")?.value,a=get(RK),ri=a.findIndex(r=>r.id===id);if(ri<0)return;
 Object.entries(proposed).forEach(([idx,pid])=>{if(pid)a[ri].ingredients[Number(idx)].productId=pid});
 put(RK,a);
 // Keep visible ingredient dropdowns in sync so the normal Save also preserves links.
 [...document.querySelectorAll("#ingredientRows .ingrow")].forEach((row,idx)=>{
   const pid=proposed[idx];if(!pid)return;
   const sel=row.querySelector(".iProduct");if(sel){sel.value=pid;sel.dispatchEvent(new Event("input",{bubbles:true}))}
 });
 render();
};
const dialog=document.getElementById("editDialog");
new MutationObserver(()=>{if(dialog.open)setTimeout(render,60)}).observe(dialog,{attributes:true,attributeFilter:["open"]});

// One-time confirmed real data: Poulet al Capone quantities + confirmed A&M chicken product.
// Only updates the Caponne recipe; it never overwrites a user-validated product link.
const MIG="foodCostV77CaponeMigrated";
if(!localStorage.getItem(MIG)){
 let a=get(RK),r=a.find(x=>x.id==="caponne"||norm(x.name)==="poulet al capone"||norm(x.name).includes("poulet caponne"));
 if(r){
  r.name="Poulet al Capone";r.salePrice=25;
  r.notes=(r.notes||"")+" · Grammages cuisine confirmés le 25/10/2026";
  const spec=[
   ["Cuisse de poulet désossée",190,"g"],["Farine",10,"g"],["Chapelure",10,"g"],["Œuf",1,"piece"],
   ["Jambon cru",80,"g"],["Sauce gorgonzola",15,"cl"],["Penne sèches",90,"g"],
   ["Crème",10,"cl"],["Parmesan pâtes",30,"g"],["Ail",8,"g"],["Parmesan finition",10,"g"]
  ];
  const old=r.ingredients||[];
  r.ingredients=spec.map(([name,qty,unit])=>{
    let o=old.find(i=>score(name,i.name)>=.65)||{};
    return {...o,name,qty,unit,status:"grammage confirmé"};
  });
  // Find confirmed A&M chicken price if invoice validation already created it.
  const chicken=get(PK).filter(p=>norm(p.supplier).includes("martinique")&&norm(p.name).includes("cuisse")&&norm(p.name).includes("poulet")).sort((x,y)=>(y.priceDate||"").localeCompare(x.priceDate||""))[0];
  if(chicken)r.ingredients[0].productId=chicken.id;
  put(RK,a);
 }
 localStorage.setItem(MIG,"1");
}
})();