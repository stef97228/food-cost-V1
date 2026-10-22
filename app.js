const DEFAULT_RECIPE={
  id:"caponne",
  name:"Escalope de poulet Caponne",
  notes:"Cuisse de poulet désossée · 190 g cru\n\nPanure anglaise, sauce gorgonzola, mozzarella, penne crème parmesan-ail, copeaux de parmesan, persil.",
  warning:"Le prix de la cuisse de poulet n’est pas encore renseigné. Aucun prix de filet de poulet ne sera substitué.",
  salePrice:null, cost:null
};

const PRODUCTS=[
 ["VODELYS","Bavette d’aloyau boule","18,85 €/kg"],
 ["VODELYS","Crevette déco crue Vietnam 21/25","17,50 € · unité à valider"],
 ["VODELYS","Mangue cubes","8,05 €/kg"],
 ["VODELYS","Os gouttière","9,75 €/kg"],
 ["VODELYS","Crevette entière crue sauvage 10/20","16,75 €/kg"],
 ["VODELYS","Moule entière cuite 80/100 jus sac 1 kg","6,33 €/kg"],
 ["VODELYS","Stracciatella 100 g","2,50 €/pièce · 25,00 €/kg"],
 ["West Indies Trade","Mozzarella Bella Stella 6×2 kg","7,85 €/kg"],
 ["West Indies Trade","Semola Caputo 25 kg","2,756 €/kg"],
 ["West Indies Trade","Prosciutto Nazionale 6 kg","22,95 €/kg"],
 ["Boniteau / Bino Viandes","Jambon blanc supérieur DD","11,50 €/kg"]
];

const KEY="foodCostRecipes";
function loadRecipes(){
  let saved=[];
  try{ saved=JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){}
  if(!Array.isArray(saved)) saved=[];
  // Compatibility with recipes created by the previous build.
  const cleaned=saved.filter(x=>x&&x.name).map(x=>({
    id:x.id||("r-"+Date.now()+"-"+Math.random()),
    name:x.name,
    notes:x.notes||"",
    salePrice:x.salePrice||null,
    cost:x.cost||null,
    createdAt:x.createdAt||new Date().toISOString()
  }));
  return [DEFAULT_RECIPE,...cleaned.filter(x=>x.name!==DEFAULT_RECIPE.name)];
}
function saveUserRecipes(recipes){
  localStorage.setItem(KEY,JSON.stringify(recipes.filter(x=>x.id!=="caponne")));
}
function euro(v){return Number(v).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});}
function badge(r){
  if(!(r.salePrice>0&&r.cost>0)) return '<span class="badge">À chiffrer</span>';
  const c=r.salePrice/r.cost, cls=c>=4?"🟢":c>=3?"🟡":"🔴";
  return `<span class="badge">${cls} Coef. ${c.toFixed(2)}</span>`;
}
function renderRecipes(){
  const recipes=loadRecipes();
  document.getElementById("recipeCount").textContent=recipes.length;
  document.getElementById("recipeList").innerHTML=recipes.map(r=>`
    <article class="recipe">
      <div class="recipe-head"><h3>${escapeHtml(r.name)}</h3>${badge(r)}</div>
      ${r.notes?`<p class="muted">${escapeHtml(r.notes).replace(/\n/g,"<br>")}</p>`:""}
      ${r.salePrice?`<p>Prix de vente : <b>${euro(r.salePrice)}</b></p>`:""}
      ${r.warning?`<p class="warning">${escapeHtml(r.warning)}</p>`:""}
    </article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProducts(){
  document.getElementById("productCount").textContent=PRODUCTS.length;
  document.getElementById("productList").innerHTML=PRODUCTS.map(p=>`<div class="product"><b>${escapeHtml(p[1])}</b><span>${escapeHtml(p[0])} · ${escapeHtml(p[2])}</span></div>`).join("");
}
document.querySelectorAll("nav button").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); document.getElementById(b.dataset.tab).classList.add("active");
}));
const dlg=document.getElementById("recipeDialog");
document.getElementById("addRecipeBtn").addEventListener("click",()=>dlg.showModal());
document.getElementById("cancelRecipe").addEventListener("click",()=>dlg.close());
document.getElementById("recipeForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("rName").value.trim();
  if(!name)return;
  const user=loadRecipes().filter(x=>x.id!=="caponne");
  user.push({id:"r-"+Date.now(),name,notes:document.getElementById("rNotes").value.trim(),salePrice:parseFloat(document.getElementById("rSale").value)||null,cost:null,createdAt:new Date().toISOString()});
  saveUserRecipes(user); e.target.reset(); dlg.close(); renderRecipes();
});
function selected(input,status,label){
  input.addEventListener("change",()=>{status.textContent=input.files?.[0]?`${label} sélectionné : ${input.files[0].name}`:"";});
}
selected(document.getElementById("invoiceInput"),document.getElementById("invoiceStatus"),"Fichier");
selected(document.getElementById("plateInput"),document.getElementById("plateStatus"),"Photo");
renderProducts(); renderRecipes();
if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(()=>{});}