const PRODUCTS=[
{id:"mozzarella",supplier:"West Indies Trade",name:"Mozzarella Bella Stella 6×2 kg",price:7.85,unit:"kg"},
{id:"semola",supplier:"West Indies Trade",name:"Semola Caputo 25 kg",price:2.756,unit:"kg"},
{id:"prosciutto",supplier:"West Indies Trade",name:"Prosciutto Nazionale 6 kg",price:22.95,unit:"kg"},
{id:"spianata",supplier:"West Indies Trade",name:"Spianata picante entière",price:22.90,unit:"kg"},
{id:"bavette",supplier:"VODELYS",name:"Bavette d’aloyau boule",price:18.85,unit:"kg"},
{id:"mangue",supplier:"VODELYS",name:"Mangue cubes",price:8.05,unit:"kg"},
{id:"os",supplier:"VODELYS",name:"Os gouttière",price:9.75,unit:"kg"},
{id:"crevette",supplier:"VODELYS",name:"Crevette entière crue sauvage 10/20",price:16.75,unit:"kg"},
{id:"moule",supplier:"VODELYS",name:"Moule entière cuite 80/100",price:6.33,unit:"kg"},
{id:"stracciatella",supplier:"VODELYS",name:"Stracciatella 100 g",price:25.00,unit:"kg"},
{id:"jambon",supplier:"Boniteau / Bino Viandes",name:"Jambon blanc supérieur DD",price:11.50,unit:"kg"},
{id:"filet",supplier:"Pro à Pro",name:"Filet de poulet UE 120/160 g",price:9.176,unit:"kg"}
];
const CAP_DEFAULT={id:"caponne",name:"Escalope de poulet Caponne",salePrice:null,notes:"Cuisse de poulet désossée · 190 g cru",ingredients:[
{name:"Cuisse de poulet désossée",qty:190,unit:"g",productId:"",manualPrice:null,status:"confirmé",note:"Prix manquant. Ne pas utiliser le prix du filet."},
{name:"Farine",qty:15,unit:"g",productId:"",manualPrice:null,status:"à valider"},
{name:"Œuf",qty:25,unit:"g",productId:"",manualPrice:null,status:"à valider"},
{name:"Chapelure",qty:30,unit:"g",productId:"",manualPrice:null,status:"à valider"},
{name:"Sauce gorgonzola",qty:60,unit:"g",productId:"",manualPrice:null,status:"sous-recette à valider"},
{name:"Mozzarella",qty:50,unit:"g",productId:"mozzarella",manualPrice:null,status:"grammage à valider"},
{name:"Penne sèches",qty:100,unit:"g",productId:"",manualPrice:null,status:"à valider"},
{name:"Crème parmesan-ail",qty:93,unit:"g",productId:"",manualPrice:null,status:"sous-recette à valider"},
{name:"Copeaux de parmesan",qty:10,unit:"g",productId:"",manualPrice:null,status:"à valider"},
{name:"Persil",qty:2,unit:"g",productId:"",manualPrice:null,status:"à valider"}]};
const K="foodCostRecipesV3",K2="foodCostRecipesV2",OLD="foodCostRecipes";
const clone=x=>JSON.parse(JSON.stringify(x));
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function euro(n){return Number(n).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}
function product(id){return PRODUCTS.find(p=>p.id===id)}
function migrateIngredient(i){let pid=i.productId||"";if(!pid&&i.name==="Mozzarella")pid="mozzarella";return{name:i.name||"",qty:Number(i.qty)||0,unit:i.unit||"g",productId:pid,manualPrice:i.manualPrice??(pid?"":i.price??null),status:i.status||"",note:i.note||""}}
function initialData(){
 let prior=[];try{prior=JSON.parse(localStorage.getItem(K2)||"[]")}catch{}
 if(!Array.isArray(prior)||!prior.length){try{prior=JSON.parse(localStorage.getItem(OLD)||"[]")}catch{}}
 let cap=clone(CAP_DEFAULT), users=[];
 for(const r of (Array.isArray(prior)?prior:[])){
   if(!r||!r.name)continue;
   if(r.id==="caponne"||r.name===CAP_DEFAULT.name){cap={...cap,...r,id:"caponne",ingredients:(r.ingredients||cap.ingredients).map(migrateIngredient)}}
   else users.push({id:r.id||"r"+Date.now()+Math.random(),name:r.name,salePrice:r.salePrice||null,notes:r.notes||"",ingredients:(r.ingredients||[]).map(migrateIngredient)})
 }
 return [cap,...users]
}
function load(){try{let a=JSON.parse(localStorage.getItem(K)||"null");if(Array.isArray(a)&&a.length)return a}catch{};let a=initialData();save(a);return a}
function save(a){localStorage.setItem(K,JSON.stringify(a))}
function unitPrice(i){let p=product(i.productId);if(p)return p.price;let m=Number(i.manualPrice);return m>0?m:null}
function ingredientCost(i){let p=unitPrice(i),q=Number(i.qty);if(!(p>0)||!(q>=0))return null;if(i.unit==="g"||i.unit==="ml")return q/1000*p;if(i.unit==="kg"||i.unit==="L"||i.unit==="piece")return q*p;return null}
function metrics(r){let total=0,missing=false;if(!(r.ingredients||[]).length)missing=true;for(const i of r.ingredients||[]){let c=ingredientCost(i);if(c==null)missing=true;else total+=c}let cost=missing?null:total,s=Number(r.salePrice);if(!(cost>0&&s>0))return{cost,coef:null,ratio:null,color:"yellow",label:"À chiffrer"};let k=s/cost,ratio=cost/s*100,color=k>=4?"green":k>=3?"yellow":"red";return{cost,coef:k,ratio,color,label:(color==="green"?"🟢":color==="yellow"?"🟡":"🔴")+" Coef. "+k.toFixed(2)}}
function render(){let rs=load();document.querySelector("#recipeCount").textContent=rs.length;document.querySelector("#alertCount").textContent=rs.filter(r=>metrics(r).color==="red").length;document.querySelector("#recipeList").innerHTML=rs.map(r=>{let m=metrics(r);let warn=r.id==="caponne"?`<p class="warning">Le prix de la cuisse de poulet n’est pas encore renseigné. Aucun prix de filet de poulet ne sera substitué.</p>`:"";return `<article class="recipe"><div class="recipe-head"><h3>${esc(r.name)}</h3><span class="badge ${m.color}">${m.label}</span></div><p class="muted">${esc(r.notes||"")}</p>${warn}<div class="costline"><span>Coût matière</span><b>${m.cost==null?"À compléter":euro(m.cost)}</b></div>${m.ratio==null?"":`<div class="costline"><span>Ratio matière</span><b>${m.ratio.toFixed(1)} %</b></div>`}<button class="openRecipe" data-id="${esc(r.id)}">Ouvrir / modifier la fiche</button></article>`}).join("");document.querySelectorAll(".openRecipe").forEach(b=>b.onclick=()=>openEdit(b.dataset.id))}
function options(selected){return `<option value="">Prix manuel / non lié</option>`+PRODUCTS.map(p=>`<option value="${p.id}" ${selected===p.id?"selected":""}>${esc(p.name)} — ${euro(p.price)}/kg</option>`).join("")}
function row(i={name:"",qty:"",unit:"g",productId:"",manualPrice:"",status:""}){
 let div=document.createElement("div");div.className="ingrow";div.innerHTML=`<input class="iName" placeholder="Ingrédient" value="${esc(i.name)}"><div class="inggrid"><input class="iQty" type="number" min="0" step=".01" placeholder="Qté" value="${i.qty??""}"><select class="iUnit"><option ${i.unit==="g"?"selected":""}>g</option><option ${i.unit==="kg"?"selected":""}>kg</option><option ${i.unit==="ml"?"selected":""}>ml</option><option ${i.unit==="L"?"selected":""}>L</option><option ${i.unit==="piece"?"selected":""}>piece</option></select></div><select class="iProduct">${options(i.productId||"")}</select><label class="mini">Prix manuel €/kg, €/L ou €/pièce<input class="iPrice" type="number" min="0" step=".001" value="${i.manualPrice??""}" ${i.productId?"disabled":""}></label><input class="iStatus" placeholder="Statut (ex. à valider)" value="${esc(i.status||"")}"><div class="rowfoot"><span class="iCost">—</span><button type="button" class="remove">Supprimer</button></div>`;div.querySelector(".remove").onclick=()=>{div.remove();live()};div.querySelectorAll("input,select").forEach(x=>x.addEventListener("input",()=>{if(x.classList.contains("iProduct"))div.querySelector(".iPrice").disabled=!!x.value;live()}));return div
}
function readRows(){return[...document.querySelectorAll(".ingrow")].map(d=>({name:d.querySelector(".iName").value.trim(),qty:Number(d.querySelector(".iQty").value)||0,unit:d.querySelector(".iUnit").value,productId:d.querySelector(".iProduct").value,manualPrice:d.querySelector(".iPrice").value?Number(d.querySelector(".iPrice").value):null,status:d.querySelector(".iStatus").value.trim()})).filter(i=>i.name)}
function live(){let r={salePrice:Number(document.querySelector("#editSale").value)||null,ingredients:readRows()},m=metrics(r);[...document.querySelectorAll(".ingrow")].forEach((d,n)=>{let i=r.ingredients[n],c=i?ingredientCost(i):null;d.querySelector(".iCost").textContent=c==null?"Prix manquant":euro(c)});document.querySelector("#liveMetrics").innerHTML=`<b>Calcul automatique</b><span>Coût matière : ${m.cost==null?"incomplet":euro(m.cost)}</span><span>Coefficient : ${m.coef==null?"—":m.coef.toFixed(2)}</span><span>Ratio matière : ${m.ratio==null?"—":m.ratio.toFixed(1)+" %"}</span>`}
const editDlg=document.querySelector("#editDialog");
function openEdit(id){let r=load().find(x=>x.id===id);if(!r)return;document.querySelector("#editId").value=r.id;document.querySelector("#editName").value=r.name;document.querySelector("#editSale").value=r.salePrice??"";document.querySelector("#editNotes").value=r.notes||"";let box=document.querySelector("#ingredientRows");box.innerHTML="";(r.ingredients||[]).forEach(i=>box.appendChild(row(i)));live();editDlg.showModal()}
document.querySelector("#addIngredient").onclick=()=>{document.querySelector("#ingredientRows").appendChild(row());live()}
document.querySelector("#cancelEdit").onclick=()=>editDlg.close();
document.querySelector("#editSale").addEventListener("input",live);
document.querySelector("#editForm").onsubmit=e=>{e.preventDefault();let a=load(),id=document.querySelector("#editId").value,idx=a.findIndex(x=>x.id===id);if(idx<0)return;a[idx]={...a[idx],name:document.querySelector("#editName").value.trim(),salePrice:Number(document.querySelector("#editSale").value)||null,notes:document.querySelector("#editNotes").value.trim(),ingredients:readRows()};save(a);editDlg.close();render()}
document.querySelector("#productCount").textContent=PRODUCTS.length;document.querySelector("#productList").innerHTML=PRODUCTS.map(p=>`<article class="product"><b>${esc(p.name)}</b><span>${esc(p.supplier)}</span><strong>${euro(p.price)}/kg</strong></article>`).join("");
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector("#"+b.dataset.tab).classList.add("active")});
const dlg=document.querySelector("#recipeDialog");document.querySelector("#addRecipeBtn").onclick=()=>dlg.showModal();document.querySelector("#cancelRecipe").onclick=()=>dlg.close();document.querySelector("#recipeForm").onsubmit=e=>{e.preventDefault();let n=document.querySelector("#rName").value.trim();if(!n)return;let a=load();a.push({id:"r"+Date.now(),name:n,salePrice:Number(document.querySelector("#rSale").value)||null,notes:document.querySelector("#rNotes").value.trim(),ingredients:[]});save(a);e.target.reset();dlg.close();render()};
function fileStatus(i,s,label){if(i)i.onchange=()=>s.textContent=i.files?.[0]?`${label} sélectionné : ${i.files[0].name}`:""}
fileStatus(document.querySelector("#invoiceInput"),document.querySelector("#invoiceStatus"),"Fichier");fileStatus(document.querySelector("#plateInput"),document.querySelector("#plateStatus"),"Photo");
render();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});