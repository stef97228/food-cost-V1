/* FOOD COST V7.6.1 — suivi fiches techniques */
(()=>{
const RK="foodCostRecipesV3";
const load=()=>{try{return JSON.parse(localStorage.getItem(RK)||"[]")||[]}catch{return[]}};
const save=a=>localStorage.setItem(RK,JSON.stringify(a));
const state=r=>{
 if(r.technicalValidated)return "Validée";
 const a=r.ingredients||[];
 return a.length&&a.every(i=>Number(i.qty)>0)&&Number(r.salePrice)>0?"À valider":"À compléter";
};
const css=document.createElement("style");
css.textContent=".techbox{margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:12px}.techpill{display:inline-block;padding:4px 9px;border-radius:999px;background:#fff1e8;font-size:.8rem;font-weight:700}.techpill.ok{background:#e9f7ee;color:#176b3a}";
document.head.appendChild(css);

const form=document.getElementById("editForm"), actions=form?.querySelector(".actions"), dialog=document.getElementById("editDialog");
if(form&&actions&&dialog&&!document.getElementById("technicalBox")){
 const box=document.createElement("div"); box.id="technicalBox"; box.className="techbox";
 box.innerHTML='<b>Suivi fiche technique</b><p><span id="technicalState" class="techpill">À compléter</span> <span id="technicalWeights" class="muted small"></span></p><label><input id="technicalValidated" type="checkbox"> Fiche technique vérifiée et validée</label><p class="muted small">Valider après contrôle des ingrédients, grammages, allergènes et prix fournisseurs.</p>';
 form.insertBefore(box,actions);
 const refresh=()=>{
  if(!dialog.open)return;
  const id=document.getElementById("editId")?.value,r=load().find(x=>x.id===id); if(!r)return;
  const st=state(r), p=document.getElementById("technicalState");
  p.textContent=st; p.className="techpill"+(st==="Validée"?" ok":"");
  document.getElementById("technicalValidated").checked=!!r.technicalValidated;
  const a=r.ingredients||[],n=a.filter(i=>Number(i.qty)>0).length;
  document.getElementById("technicalWeights").textContent=a.length?`${n}/${a.length} grammages renseignés`:"Aucun grammage";
 };
 new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:["open"]});
 form.addEventListener("input",()=>{
  if(!dialog.open)return;
  const rows=[...document.querySelectorAll("#ingredientRows .ingrow")],n=rows.filter(x=>Number(x.querySelector(".iQty")?.value)>0).length;
  document.getElementById("technicalWeights").textContent=rows.length?`${n}/${rows.length} grammages renseignés`:"Aucun grammage";
 });
 form.addEventListener("submit",()=>{
  const id=document.getElementById("editId")?.value,a=load(),i=a.findIndex(x=>x.id===id); if(i<0)return;
  a[i].technicalValidated=document.getElementById("technicalValidated").checked; save(a);
 },true);
}
})();