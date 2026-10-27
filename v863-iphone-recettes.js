/* FOOD COST V8.6.3 — iPhone quotidien : ordre navigation + photos recettes */
(()=>{
const RK="foodCostRecipesV3", PLK="foodCostPlatePhotosV56";
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch{return d}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// Version: les anciens modules réécrivent parfois le badge après le chargement.
function fixVersion(){let x=document.querySelector("header>span:last-child");if(x)x.textContent="V8.6.3"}

// Ordre de travail souhaité : Scan, Recettes, Sous-recettes, Fournisseurs, Factures, Inventaire.
function fixNav(){
 const nav=document.querySelector("main nav"); if(!nav)return;
 ["scan","recipes","subrecipes","suppliers","invoices","inventory"].forEach(id=>{
   let b=nav.querySelector(`[data-tab="${id}"]`); if(b)nav.appendChild(b);
 });
}

// Ajoute une photo/repère directement sur chaque carte recette.
// Les photos proviennent du Scan plat déjà sauvegardé dans foodCostPlatePhotosV56.
function decorateRecipes(){
 const list=document.getElementById("recipeList"); if(!list)return;
 const rs=get(RK,[]), photos=get(PLK,{});
 const cards=[...list.querySelectorAll("article")];
 cards.forEach(card=>{
   if(card.querySelector(".v863-recipe-photo"))return;
   let title=card.querySelector("h3")?.textContent?.trim();
   let r=rs.find(x=>x.name===title);
   if(!r)return;
   let ph=photos[r.id]?.dataUrl;
   let wrap=document.createElement("div");wrap.className="v863-recipe-photo";
   wrap.innerHTML=ph
     ? `<img src="${ph}" alt="Photo ${esc(r.name)}"><span>📷 Photo du plat</span>`
     : `<div class="v863-no-photo">📷<b>Photo à ajouter</b><small>Utilise Scan plat pour compléter cette fiche.</small></div>`;
   card.prepend(wrap);
   if(!(r.ingredients||[]).length || (r.ingredients||[]).some(i=>!(Number(i.qty)>0))){
     let badge=document.createElement("span");badge.className="v863-todo";badge.textContent="À compléter";wrap.appendChild(badge);
   }
 });
}

// Dans la fiche ouverte, affiche aussi le repère photo.
function decorateEdit(){
 const dlg=document.getElementById("editDialog"), form=document.getElementById("editForm");
 if(!dlg?.open||!form)return;
 document.getElementById("v863EditPhoto")?.remove();
 let id=document.getElementById("editId")?.value, r=get(RK,[]).find(x=>String(x.id)===String(id)), ph=get(PLK,{})[id]?.dataUrl;
 let box=document.createElement("div");box.id="v863EditPhoto";box.className="v863-edit-photo";
 box.innerHTML=ph?`<img src="${ph}" alt="Photo ${esc(r?.name||"du plat")}">`:`<div class="v863-no-photo">📷<b>Pas encore de photo</b><small>Scanne le plat depuis l’onglet Scan plat.</small></div>`;
 form.querySelector("h2")?.insertAdjacentElement("afterend",box);
}

let st=document.createElement("style");
st.textContent=`
.v863-recipe-photo{position:relative;margin:-2px -2px 12px;overflow:hidden;border-radius:12px;background:#f4f6f9}
.v863-recipe-photo img,.v863-edit-photo img{display:block;width:100%;max-height:230px;object-fit:cover;border-radius:12px}
.v863-recipe-photo>span:not(.v863-todo){display:block;padding:5px 9px;font-size:.72rem;color:#687386}
.v863-no-photo{min-height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#687386;text-align:center;padding:10px}
.v863-no-photo>b{color:#172033}.v863-no-photo small{font-size:.72rem}
.v863-todo{position:absolute;right:8px;top:8px;background:#fff6eb;color:#9a571d;border:1px solid #f0c28d;border-radius:999px;padding:5px 8px;font-size:.72rem;font-weight:700}
.v863-edit-photo{margin:8px 0 14px}
`;
document.head.appendChild(st);

setTimeout(()=>{fixVersion();fixNav();decorateRecipes();decorateEdit()},1200);
setTimeout(()=>{fixVersion();fixNav();decorateRecipes()},2200);
new MutationObserver(()=>{decorateEdit();decorateRecipes();fixVersion()}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["open","class"]});
})();