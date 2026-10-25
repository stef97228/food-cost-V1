/* FOOD COST V7.6 — carte Poivre & Sel + allergènes
   Les allergènes préremplis sont des PROPOSITIONS à valider, basées uniquement
   sur les ingrédients explicitement visibles sur la carte photographiée. */
(()=>{
const MENU=[{"category": "Entrées", "name": "Tartare de poissons coco citron basilic", "salePrice": 11.0, "description": "Poissons selon la pêche, marinade au citron, lait de coco, basilic, huile d'olive", "allergens": ["Poissons"]}, {"category": "Entrées", "name": "Arancini à la truffe, guanciale et mozzarella", "salePrice": 12.5, "description": "Croquettes de risotto à la crème de truffe, guanciale et mozzarella", "allergens": ["Lait"]}, {"category": "Entrées", "name": "Salade de stracciatella & tomates confites mangues", "salePrice": 12.0, "description": "Stracciatella, cœur crémeux de burrata, tomates confites, roquette, basilic, croûtons de pain aillé, dés de mangue", "allergens": ["Lait", "Gluten"]}, {"category": "Entrées", "name": "Mozzarella fondante", "salePrice": 10.0, "description": "Mozzarella, crème, ail et fines herbes, cuite au four", "allergens": ["Lait"]}, {"category": "Entrées", "name": "Os à moelle rôti au four", "salePrice": 14.5, "description": "Servi bien chaud avec ses croûtons grillés", "allergens": ["Gluten"]}, {"category": "Entrées", "name": "La planche italienne", "salePrice": 13.0, "description": "Composition à compléter d'après le dressage réel", "allergens": []}, {"category": "Plats", "name": "Pavé de poisson mi-cuit à la plancha", "salePrice": 25.5, "description": "Poisson de la pêche et inspiration du moment", "allergens": ["Poissons"]}, {"category": "Plats", "name": "Tartare de bœuf à l'italienne", "salePrice": 22.5, "description": "Basilic, câpres, Grana Padano, oignons, tomates confites, frites maison et salade", "allergens": ["Lait"]}, {"category": "Plats", "name": "Poulet al Capone", "salePrice": 25.0, "description": "Poulet pané, jambon italien, sauce gorgonzola, pasta ail et Grana Padano", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Plats", "name": "Polpo à l'ail, huile d'olive, spianata", "salePrice": 27.0, "description": "Poulpe, ail, huile d'olive, sauce tomate, spianata italienne légèrement relevée", "allergens": ["Mollusques"]}, {"category": "Plats", "name": "Salade César", "salePrice": 20.0, "description": "Poulet, lard rôti, croûtons, sauce César, tomates, Grana Padano", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Plats", "name": "Bœuf braisé de la Mamma", "salePrice": 28.0, "description": "Bœuf mijoté 5 h, sauce à l'ancienne, croûtes de parmesan, légumes et gnocchis de pomme de terre", "allergens": ["Lait"]}, {"category": "Plats", "name": "Burger italien", "salePrice": 23.0, "description": "Steak haché de bavette d'aloyau, parmesan, lard, oignons, sauce Alfredo et pesto de basilic", "allergens": ["Lait"]}, {"category": "Pâtes", "name": "Rigatoni aux champignons et prosciutto", "salePrice": 20.0, "description": "Champignons poêlés à l'ail, crème et jambon italien", "allergens": ["Gluten", "Lait"]}, {"category": "Pâtes", "name": "Paccheri al gorgonzola et pollo", "salePrice": 20.0, "description": "Sauce crème au mascarpone, gorgonzola et poulet", "allergens": ["Gluten", "Lait"]}, {"category": "Pâtes", "name": "Linguine al frutti di mare", "salePrice": 22.0, "description": "Crevettes, moules sautées à l'ail, crème, tomate", "allergens": ["Gluten", "Crustacés", "Mollusques", "Lait"]}, {"category": "Pâtes", "name": "Penne pesto rosso et burrata et guanciale", "salePrice": 23.0, "description": "Composition à compléter d'après le dressage réel", "allergens": ["Gluten", "Lait"]}, {"category": "Pâtes", "name": "Raviole al ragu (bolognaise)", "salePrice": 21.0, "description": "Ragu : soffrito, bœuf et salsiccia ; raviole farcie au bœuf", "allergens": ["Gluten"]}, {"category": "Pierrades", "name": "Pierrade bœuf (bavette d'aloyau)", "salePrice": 23.0, "description": "Frites, salade verte ; sauce au choix : poivre, gorgonzola ou moutarde", "allergens": []}, {"category": "Pierrades", "name": "Pierrade poulet", "salePrice": 20.0, "description": "Frites, salade verte ; sauce au choix : poivre, gorgonzola ou moutarde", "allergens": []}, {"category": "Pierrades", "name": "Pierrade canard", "salePrice": 24.0, "description": "Frites, salade verte ; sauce au choix : poivre, gorgonzola ou moutarde", "allergens": []}, {"category": "Pierrades", "name": "Pierrade la mer", "salePrice": 22.0, "description": "Poisson du jour, crevettes ; frites, salade verte ; sauce au choix", "allergens": ["Poissons", "Crustacés"]}, {"category": "Pierrades", "name": "Pierrade le trio", "salePrice": 23.0, "description": "Bœuf, poulet, canard ; frites, salade verte ; sauce au choix", "allergens": []}, {"category": "Pizzas · Classiques", "name": "Margherita", "salePrice": 14.0, "description": "Sauce tomate, basilic, mozzarella, olives", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Régina", "salePrice": 16.0, "description": "Sauce tomate, mozzarella, jambon blanc cuit supérieur, olives", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Sicilienne", "salePrice": 15.0, "description": "Sauce tomate, olives, mozzarella, anchois, câpres", "allergens": ["Gluten", "Lait", "Poissons"]}, {"category": "Pizzas · Classiques", "name": "Reine", "salePrice": 17.0, "description": "Sauce tomate, mozzarella, jambon blanc cuit supérieur, champignons, olives, œuf", "allergens": ["Gluten", "Lait", "Œufs"]}, {"category": "Pizzas · Classiques", "name": "Orientale", "salePrice": 18.0, "description": "Sauce tomate, mozzarella, merguez, poivrons, oignons, olives", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Quattro Formaggi", "salePrice": 18.0, "description": "Sauce tomate, mozzarella, chèvre, gorgonzola, parmesan, olives", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Calzone", "salePrice": 18.0, "description": "Sauce tomate, mozzarella, jambon supérieur, champignons frais, œuf, olives", "allergens": ["Gluten", "Lait", "Œufs"]}, {"category": "Pizzas · Classiques", "name": "Végétarienne", "salePrice": 17.0, "description": "Sauce tomate, mozzarella, poivrons, oignons, champignons frais, artichaut, olives, roquette", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "4 saisons", "salePrice": 18.0, "description": "Sauce tomate, mozzarella, poivrons, jambon supérieur, champignons frais, artichaut, olives", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Poivre & Sel", "salePrice": 19.0, "description": "Sauce tomate, mozzarella, jambon supérieur, olives, merguez, lard, chorizo, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Classiques", "name": "Chèvre miel", "salePrice": 17.0, "description": "Sauce tomate, mozzarella, chèvre, miel pays, roquette", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Base crème", "name": "Magret de canard", "salePrice": 22.0, "description": "Crème, mozzarella, champignons, magret de canard, persillade, roquette, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Base crème", "name": "Frutti di mare", "salePrice": 22.0, "description": "Crème, mozzarella, sauce à l'ail, moules, crevettes, gambas, citron, roquette", "allergens": ["Gluten", "Lait", "Crustacés", "Mollusques"]}, {"category": "Pizzas · Base crème", "name": "Alfredo", "salePrice": 20.0, "description": "Crème, parmesan, mozzarella, lard, poulet, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Base crème", "name": "Raclette", "salePrice": 20.0, "description": "Crème, mozzarella, jambon, lard, pommes de terre, reblochon, prosciutto di Parma, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "Al Salmone", "salePrice": 22.0, "description": "Crème, mozzarella, artichaut, saumon fumé, aneth, citron", "allergens": ["Gluten", "Lait", "Poissons"]}, {"category": "Pizzas · Créations", "name": "Italienne", "salePrice": 20.0, "description": "Crème pesto, mozzarella, prosciutto di Parma, roquette, parmesan, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "Deliziosa", "salePrice": 20.0, "description": "Crème, mozzarella, gorgonzola, coppa, tomates, roquette, oignons, parmesan", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "Truffe", "salePrice": 22.0, "description": "Base Alfredo, mozzarella, champignons, truffe, huile de truffe, roquette, Grana Padano", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "Buratta", "salePrice": 23.0, "description": "Sauce tomate, mozzarella, burrata, basilic, jambon italien", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "La Scampi", "salePrice": 20.0, "description": "Base crème pesto rosso, crevette, spianata, aneth, citron", "allergens": ["Gluten", "Lait", "Crustacés"]}, {"category": "Pizzas · Créations", "name": "Suprême BBQ", "salePrice": 22.0, "description": "Sauce BBQ, mozzarella, bœuf, cheddar, bacon, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Pizzas · Créations", "name": "Pasturo", "salePrice": 20.0, "description": "Base crème de gorgonzola, viande hachée, oignons", "allergens": ["Gluten", "Lait"]}, {"category": "Desserts", "name": "Brioche perdue", "salePrice": 9.5, "description": "Caramel et glace au beurre salé", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Desserts", "name": "Tiramisu traditionnel", "salePrice": 7.0, "description": "Un moment de légèreté", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Desserts", "name": "Crème brûlée coco rhum vieux", "salePrice": 8.0, "description": "Composition détaillée à compléter", "allergens": ["Œufs", "Lait"]}, {"category": "Desserts", "name": "Soupe & tartare de mangue et menthe fraîche", "salePrice": 7.5, "description": "Dessert frais et léger", "allergens": []}, {"category": "Desserts", "name": "Gâteau au chocolat maison fondant", "salePrice": 8.5, "description": "Servi avec glace vanille", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Desserts", "name": "Profiterolles de la Mère Adeline", "salePrice": 10.0, "description": "Composition détaillée à compléter", "allergens": ["Gluten", "Œufs", "Lait"]}, {"category": "Desserts", "name": "West Indies Coffee", "salePrice": 11.0, "description": "Café, rhum vieux et chantilly", "allergens": ["Lait"]}, {"category": "Coupes glacées", "name": "La Bounty", "salePrice": 11.5, "description": "Glace coco, chocolat chaud, croustillant au manioc, chantilly", "allergens": ["Lait"]}, {"category": "Coupes glacées", "name": "Affogato", "salePrice": 11.5, "description": "Glace vanille noyée dans un café, éclats d'amande", "allergens": ["Lait", "Fruits à coque"]}, {"category": "Coupes glacées", "name": "La Snikers", "salePrice": 11.5, "description": "Glace vanille pacane, caramel beurre salé maison", "allergens": ["Lait", "Fruits à coque"]}, {"category": "Coupes glacées", "name": "Colonel", "salePrice": 11.5, "description": "Citron, vodka", "allergens": []}, {"category": "Coupes glacées", "name": "La Dame Blanche", "salePrice": 11.5, "description": "Glace vanille, chocolat chaud, chantilly", "allergens": ["Lait"]}];
const ALLERGENS=["Gluten", "Crustacés", "Œufs", "Poissons", "Arachides", "Soja", "Lait", "Fruits à coque", "Céleri", "Moutarde", "Graines de sésame", "Sulfites", "Lupin", "Mollusques"];
const RK="foodCostRecipesV3";
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const aliases=new Set(["poulet al capone","escalope de poulet caponne","escalope de poulet capone"]);
function load(){try{return JSON.parse(localStorage.getItem(RK)||"[]")||[]}catch{return[]}}
function save(a){localStorage.setItem(RK,JSON.stringify(a))}
function mergeMenu(){
  let recipes=load(), changed=false;
  for(const m of MENU){
    let r=null;
    if(norm(m.name)==="poulet al capone") r=recipes.find(x=>aliases.has(norm(x.name)));
    else r=recipes.find(x=>norm(x.name)===norm(m.name));
    if(!r){
      recipes.push({
        id:"menu-"+norm(m.name).replace(/ /g,"-"),
        name:m.name,salePrice:m.salePrice,
        notes:`[${m.category}] ${m.description}`,
        category:m.category,allergens:m.allergens,allergensValidated:false,ingredients:[]
      });
      changed=true;
    } else {
      let next={...r};
      if(!(Number(next.salePrice)>0)) next.salePrice=m.salePrice;
      if(!next.category) next.category=m.category;
      if(!Array.isArray(next.allergens)||!next.allergens.length) next.allergens=m.allergens;
      if(next.allergensValidated==null) next.allergensValidated=false;
      if(!String(next.notes||"").includes(m.description)){
        next.notes=(String(next.notes||"").trim()+`\n[Carte · ${m.category}] ${m.description}`).trim();
      }
      if(JSON.stringify(next)!==JSON.stringify(r)){
        recipes[recipes.indexOf(r)]=next; changed=true;
      }
    }
  }
  if(changed) save(recipes);
}
function addStyles(){
 const s=document.createElement("style");
 s.textContent=`
 .menu-tools{margin:14px 0} .menu-filter{display:flex;gap:8px;overflow:auto;padding-bottom:8px}
 .menu-filter button{white-space:nowrap} .menu-card{border-left:4px solid #e87524}
 .menu-card h3{margin:.1rem 0} .menu-meta{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
 .allergen-chip{display:inline-block;padding:4px 8px;border-radius:999px;background:#fff1e8;margin:2px;font-size:.78rem}
 .allergen-warn{font-size:.78rem;color:#8a4b16} .allergen-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
 .allergen-grid label{display:flex;gap:7px;align-items:center;border:1px solid #ddd;border-radius:10px;padding:8px}
 `;
 document.head.appendChild(s);
}
function installMenuTab(){
 const nav=document.querySelector("nav"), main=document.querySelector("main");
 if(!nav||!main||document.getElementById("menu"))return;
 const b=document.createElement("button"); b.dataset.tab="menu"; b.textContent="🍽️ Carte";
 nav.appendChild(b);
 const sec=document.createElement("section");sec.id="menu";sec.className="panel";
 sec.innerHTML=`<div class="sectionhead"><h2>Carte Poivre & Sel</h2><span class="pill">${MENU.length} fiches</span></div>
 <p class="muted small">Prix et compositions pré-rentrés depuis la carte. Allergènes proposés à valider sur chaque fiche technique.</p>
 <div class="menu-tools"><div class="menu-filter" id="menuFilters"></div></div><div id="menuCatalog"></div>`;
 main.appendChild(sec);
 const cats=["Toutes",...new Set(MENU.map(x=>x.category))];
 const filters=sec.querySelector("#menuFilters");
 cats.forEach((c,i)=>{let x=document.createElement("button");x.textContent=c;x.className=i===0?"primary":"";x.onclick=()=>{[...filters.children].forEach(y=>y.classList.remove("primary"));x.classList.add("primary");renderCatalog(c)};filters.appendChild(x)});
 function renderCatalog(cat="Toutes"){
  let recipes=load();
  let arr=MENU.filter(x=>cat==="Toutes"||x.category===cat);
  sec.querySelector("#menuCatalog").innerHTML=arr.map(m=>{
   let r=recipes.find(x=>norm(x.name)===norm(m.name)||(norm(m.name)==="poulet al capone"&&aliases.has(norm(x.name))));
   let al=(r?.allergens||m.allergens||[]);
   return `<div class="card menu-card"><h3>${m.name}</h3><div class="menu-meta"><span class="pill">${m.category}</span><b>${m.salePrice.toFixed(2).replace(".",",")} €</b></div>
   <p>${m.description}</p><div>${al.map(a=>`<span class="allergen-chip">${a}</span>`).join("")||'<span class="muted small">Aucun allergène proposé depuis la carte</span>'}</div>
   <p class="allergen-warn">${r?.allergensValidated?"✅ Allergènes validés":"⚠️ Allergènes à valider"}</p></div>`;
  }).join("");
 }
 renderCatalog();
 b.addEventListener("click",()=>setTimeout(()=>renderCatalog(),0));
}
function installAllergenEditor(){
 const form=document.getElementById("editForm"), actions=form?.querySelector(".actions");
 if(!form||!actions||document.getElementById("allergenEditor"))return;
 const box=document.createElement("div");box.id="allergenEditor";
 box.innerHTML=`<h3>Allergènes</h3><p class="muted small">Coche uniquement après vérification de la fiche technique.</p><div class="allergen-grid">${ALLERGENS.map(a=>`<label><input type="checkbox" value="${a}"> ${a}</label>`).join("")}</div><label><input id="allergensValidated" type="checkbox"> Allergènes vérifiés et validés</label>`;
 form.insertBefore(box,actions);
 const dialog=document.getElementById("editDialog");
 const obs=new MutationObserver(()=>{
   if(!dialog.open)return;
   let id=document.getElementById("editId")?.value, r=load().find(x=>x.id===id);
   if(!r)return;
   box.querySelectorAll('input[type="checkbox"][value]').forEach(c=>c.checked=(r.allergens||[]).includes(c.value));
   document.getElementById("allergensValidated").checked=!!r.allergensValidated;
 });
 obs.observe(dialog,{attributes:true,attributeFilter:["open"]});
 form.addEventListener("submit",()=>{
   let id=document.getElementById("editId")?.value, recipes=load(), i=recipes.findIndex(x=>x.id===id);
   if(i<0)return;
   recipes[i].allergens=[...box.querySelectorAll('input[type="checkbox"][value]:checked')].map(x=>x.value);
   recipes[i].allergensValidated=document.getElementById("allergensValidated").checked;
   save(recipes);
 },true);
}
mergeMenu();
addStyles();
installMenuTab();
installAllergenEditor();
setTimeout(()=>{ try{renderRecipes?.();renderPlateRecipeOptions?.()}catch(e){} },100);
})();
