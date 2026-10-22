const PRODUCTS=[
{id:"mozzarella",supplier:"West Indies Trade",name:"Mozzarella Bella Stella 6×2 kg",price:7.85},
{id:"semola",supplier:"West Indies Trade",name:"Semola Caputo 25 kg",price:2.756},
{id:"prosciutto",supplier:"West Indies Trade",name:"Prosciutto Nazionale 6 kg",price:22.95},
{id:"spianata",supplier:"West Indies Trade",name:"Spianata picante entière",price:22.90},
{id:"bavette",supplier:"VODELYS",name:"Bavette d’aloyau boule",price:18.85},
{id:"mangue",supplier:"VODELYS",name:"Mangue cubes",price:8.05},
{id:"os",supplier:"VODELYS",name:"Os gouttière",price:9.75},
{id:"crevette",supplier:"VODELYS",name:"Crevette entière crue sauvage 10/20",price:16.75},
{id:"moule",supplier:"VODELYS",name:"Moule entière cuite 80/100",price:6.33},
{id:"stracciatella",supplier:"VODELYS",name:"Stracciatella 100 g",price:25.00},
{id:"jambon",supplier:"Boniteau / Bino Viandes",name:"Jambon blanc supérieur DD",price:11.50},
{id:"filet",supplier:"Pro à Pro",name:"Filet de poulet UE 120/160 g",price:9.176}
];
const CAP={id:"caponne",name:"Escalope de poulet Caponne",salePrice:null,notes:"Cuisse de poulet désossée · 190 g cru",ingredients:[
{name:"Cuisse de poulet désossée",qty:190,price:null,status:"confirmé",note:"Prix manquant. Ne pas utiliser le prix du filet."},
{name:"Farine",qty:15,price:null,status:"à valider"},{name:"Œuf",qty:25,price:null,status:"à valider"},
{name:"Chapelure",qty:30,price:null,status:"à valider"},{name:"Sauce gorgonzola",qty:60,price:null,status:"sous-recette à valider"},
{name:"Mozzarella",qty:50,price:7.85,status:"grammage à valider"},{name:"Penne sèches",qty:100,price:null,status:"à valider"},
{name:"Crème parmesan-ail",qty:93,price:null,status:"sous-recette à valider"},{name:"Copeaux de parmesan",qty:10,price:null,status:"à valider"},
{name:"Persil",qty:2,price:null,status:"à valider"}]};
const K="foodCostRecipesV2",OLD="foodCostRecipes";
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function load(){try{let a=JSON.parse(localStorage.getItem(K)||"null");if(Array.isArray(a))return a}catch{};let a=[];try{a=JSON.parse(localStorage.getItem(OLD)||"[]")}catch{};a=a.filter(x=>x&&x.name&&x.name!==CAP.name).map((x,i)=>({id:x.id||"m"+i,name:x.name,salePrice:x.salePrice||null,notes:x.notes||"",ingredients:[]}));localStorage.setItem(K,JSON.stringify(a));return a}
function save(a){localStorage.setItem(K,JSON.stringify(a))}
function all(){return[CAP,...load()]}
function euro(n){return Number(n).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}
function cost(r){let t=0;if(!(r.ingredients||[]).length)return null;for(const i of r.ingredients){if(i.price==null)return null;t+=i.qty/1000*i.price}return t}
function met(r){let c=cost(r),s=Number(r.salePrice);if(!(c>0&&s>0))return{c,coef:null,ratio:null,label:"À chiffrer"};let k=s/c;return{c,coef:k,ratio:c/s*100,label:(k>=4?"🟢":k>=3?"🟡":"🔴")+" Coef. "+k.toFixed(2)}}
function render(){let rs=all();document.querySelector("#recipeCount").textContent=rs.length;document.querySelector("#recipeList").innerHTML=rs.map(r=>{let m=met(r);return `<article class="recipe"><div class="recipe-head"><h3>${esc(r.name)}</h3><span class="badge">${m.label}</span></div><p class="muted">${esc(r.notes||"")}</p><p><b>Coût matière :</b> ${m.c==null?"À compléter":euro(m.c)}</p>${m.ratio==null?"":`<p><b>Ratio matière :</b> ${m.ratio.toFixed(1)} %</p>`}<button class="openRecipe" data-id="${esc(r.id)}">Ouvrir la fiche</button></article>`}).join("");document.querySelectorAll(".openRecipe").forEach(b=>b.onclick=()=>detail(b.dataset.id))}
function detail(id){let r=all().find(x=>x.id===id),m=met(r),d=document.querySelector("#recipeDetail");d.innerHTML=`<article class="card"><h2>${esc(r.name)}</h2><p><b>Prix de vente :</b> ${r.salePrice?euro(r.salePrice):"Non renseigné"}</p><p><b>Coefficient :</b> ${m.coef?m.coef.toFixed(2):"—"} · <b>Ratio :</b> ${m.ratio?m.ratio.toFixed(1)+" %":"—"}</p><h3>Ingrédients</h3>${(r.ingredients||[]).map(i=>`<p><b>${esc(i.name)}</b> — ${i.qty} g — ${i.price==null?"prix manquant":euro(i.qty/1000*i.price)} <small>(${esc(i.status)})</small></p>`).join("")||"<p>Aucun ingrédient renseigné.</p>"}<p class="warning">Les grammages marqués « à valider » sont des estimations de travail.</p></article>`;d.scrollIntoView({behavior:"smooth"})}
document.querySelector("#productCount").textContent=PRODUCTS.length;document.querySelector("#products").innerHTML=PRODUCTS.map(p=>`<article class="product"><b>${esc(p.name)}</b><span>${esc(p.supplier)}</span><strong>${euro(p.price)}/kg</strong></article>`).join("");
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector("#"+b.dataset.tab).classList.add("active")});
const dlg=document.querySelector("#recipeDialog");document.querySelector("#addRecipeBtn").onclick=()=>dlg.showModal();document.querySelector("#cancelRecipe").onclick=()=>dlg.close();document.querySelector("#recipeForm").onsubmit=e=>{e.preventDefault();let n=document.querySelector("#rName").value.trim();if(!n)return;let a=load();a.push({id:"r"+Date.now(),name:n,salePrice:parseFloat(document.querySelector("#rSale").value)||null,notes:document.querySelector("#rNotes").value.trim(),ingredients:[]});save(a);e.target.reset();dlg.close();render()};render();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});