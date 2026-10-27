/* FOOD COST V8.6.4 — Carte complète + photos recettes robustes */
(()=>{
const RK="foodCostRecipesV3",PLK="foodCostPlatePhotosV56";
const MENU=[{"category": "Entrées", "name": "Tartare de poissons coco citron basilic", "salePrice": 11}, {"category": "Entrées", "name": "Arancini à la truffe, guanciale et mozzarella", "salePrice": 12.5}, {"category": "Entrées", "name": "Salade de stracciatella & tomates confites mangues", "salePrice": 12}, {"category": "Entrées", "name": "Mozzarella fondante", "salePrice": 10}, {"category": "Entrées", "name": "Os à moelle rôti au four", "salePrice": 14.5}, {"category": "Entrées", "name": "La planche italienne", "salePrice": 13}, {"category": "Plats", "name": "Pavé de poisson mi-cuit à la plancha", "salePrice": 25.5}, {"category": "Plats", "name": "Tartare de bœuf à l'italienne", "salePrice": 22.5}, {"category": "Plats", "name": "Poulet al Capone", "salePrice": 25}, {"category": "Plats", "name": "Polpo à l'ail, huile d'olive, spianata", "salePrice": 27}, {"category": "Plats", "name": "Salade César", "salePrice": 20}, {"category": "Plats", "name": "Bœuf braisé de la Mamma", "salePrice": 28}, {"category": "Plats", "name": "Burger italien", "salePrice": 23}, {"category": "Pâtes", "name": "Rigatoni aux champignons et prosciutto", "salePrice": 20}, {"category": "Pâtes", "name": "Paccheri al gorgonzola et pollo", "salePrice": 20}, {"category": "Pâtes", "name": "Linguine al frutti di mare", "salePrice": 22}, {"category": "Pâtes", "name": "Penne pesto rosso et burrata et guanciale", "salePrice": 23}, {"category": "Pâtes", "name": "Raviole al ragu (bolognaise)", "salePrice": 21}, {"category": "Pierrades", "name": "Pierrade bœuf (bavette d'aloyau)", "salePrice": 23}, {"category": "Pierrades", "name": "Pierrade poulet", "salePrice": 20}, {"category": "Pierrades", "name": "Pierrade canard", "salePrice": 24}, {"category": "Pierrades", "name": "Pierrade la mer", "salePrice": 22}, {"category": "Pierrades", "name": "Pierrade le trio", "salePrice": 23}, {"category": "Pizzas · Classiques", "name": "Margherita", "salePrice": 14}, {"category": "Pizzas · Classiques", "name": "Régina", "salePrice": 16}, {"category": "Pizzas · Classiques", "name": "Sicilienne", "salePrice": 15}, {"category": "Pizzas · Classiques", "name": "Reine", "salePrice": 17}, {"category": "Pizzas · Classiques", "name": "Orientale", "salePrice": 18}, {"category": "Pizzas · Classiques", "name": "Quattro Formaggi", "salePrice": 18}, {"category": "Pizzas · Classiques", "name": "Calzone", "salePrice": 18}, {"category": "Pizzas · Classiques", "name": "Végétarienne", "salePrice": 17}, {"category": "Pizzas · Classiques", "name": "4 saisons", "salePrice": 18}, {"category": "Pizzas · Classiques", "name": "Poivre & Sel", "salePrice": 19}, {"category": "Pizzas · Classiques", "name": "Chèvre miel", "salePrice": 17}, {"category": "Pizzas · Base crème", "name": "Magret de canard", "salePrice": 22}, {"category": "Pizzas · Base crème", "name": "Frutti di mare", "salePrice": 22}, {"category": "Pizzas · Base crème", "name": "Alfredo", "salePrice": 20}, {"category": "Pizzas · Base crème", "name": "Raclette", "salePrice": 20}, {"category": "Pizzas · Créations", "name": "Al Salmone", "salePrice": 22}, {"category": "Pizzas · Créations", "name": "Italienne", "salePrice": 20}, {"category": "Pizzas · Créations", "name": "Deliziosa", "salePrice": 20}, {"category": "Pizzas · Créations", "name": "Truffe", "salePrice": 22}, {"category": "Pizzas · Créations", "name": "Buratta", "salePrice": 23}, {"category": "Pizzas · Créations", "name": "La Scampi", "salePrice": 20}, {"category": "Pizzas · Créations", "name": "Suprême BBQ", "salePrice": 22}, {"category": "Pizzas · Créations", "name": "Pasturo", "salePrice": 20}, {"category": "Desserts", "name": "Brioche perdue", "salePrice": 9.5}, {"category": "Desserts", "name": "Tiramisu traditionnel", "salePrice": 7}, {"category": "Desserts", "name": "Crème brûlée coco rhum vieux", "salePrice": 8}, {"category": "Desserts", "name": "Soupe & tartare de mangue et menthe fraîche", "salePrice": 7.5}, {"category": "Desserts", "name": "Gâteau au chocolat maison fondant", "salePrice": 8.5}, {"category": "Desserts", "name": "Profiterolles de la Mère Adeline", "salePrice": 10}, {"category": "Desserts", "name": "West Indies Coffee", "salePrice": 11}, {"category": "Coupes glacées", "name": "La Bounty", "salePrice": 11.5}, {"category": "Coupes glacées", "name": "Affogato", "salePrice": 11.5}, {"category": "Coupes glacées", "name": "La Snikers", "salePrice": 11.5}, {"category": "Coupes glacées", "name": "Colonel", "salePrice": 11.5}, {"category": "Coupes glacées", "name": "Dame Blanche", "salePrice": 11.5}];
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch{return d}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/œ/g,"oe").replace(/[^a-z0-9]+/g," ").trim();
function ver(){let x=document.querySelector("header>span:last-child");if(x)x.textContent="V8.6.4"}

function installMenu(){
 let main=document.querySelector("main"),nav=main?.querySelector("nav");if(!main||!nav)return;
 let btn=nav.querySelector('[data-tab="menu"]');
 if(!btn){btn=document.createElement("button");btn.dataset.tab="menu";btn.textContent="🍽️ Carte";nav.insertBefore(btn,nav.querySelector('[data-tab="recipes"]'));}
 let panel=document.getElementById("menu");
 if(!panel){panel=document.createElement("section");panel.id="menu";panel.className="panel";panel.innerHTML='<h2>Carte Poivre & Sel</h2><p class="muted">58 plats de la carte, classés par rubrique. Touche un plat pour retrouver sa recette.</p><div id="v864Menu"></div>';main.insertBefore(panel,document.getElementById("recipes"));}
 let box=document.getElementById("v864Menu");if(box&&!box.dataset.ready){
   let cats=[...new Set(MENU.map(x=>x.category))];
   box.innerHTML=cats.map(c=>`<div class="v864-menu-cat"><h3>${esc(c)}</h3>${MENU.filter(x=>x.category===c).map(x=>`<button type="button" class="v864-menu-row" data-name="${esc(x.name)}"><span><b>${esc(x.name)}</b><small>Ouvrir la fiche recette</small></span><strong>${Number(x.salePrice).toLocaleString("fr-FR",{minimumFractionDigits:0,maximumFractionDigits:2})} €</strong></button>`).join("")}</div>`).join("");
   box.dataset.ready="1";
   box.querySelectorAll(".v864-menu-row").forEach(b=>b.onclick=()=>openRecipeByName(b.dataset.name));
 }
 // remplace le gestionnaire ancien par un gestionnaire fiable incluant Carte
 [...nav.querySelectorAll("button")].forEach(b=>b.addEventListener("click",()=>{
   document.querySelectorAll("nav button,.panel").forEach(x=>x.classList.remove("active"));
   b.classList.add("active");document.getElementById(b.dataset.tab)?.classList.add("active");
 },true));
 // ordre
 ["scan","menu","recipes","subrecipes","suppliers","invoices","inventory"].forEach(id=>{let b=nav.querySelector(`[data-tab="${id}"]`);if(b)nav.appendChild(b)});
}

function openRecipeByName(name){
 let rs=get(RK,[]),r=rs.find(x=>norm(x.name)===norm(name));
 let rec=document.querySelector('[data-tab="recipes"]');rec?.click();
 setTimeout(()=>{
   let list=document.getElementById("recipeList");
   let card=[...list.querySelectorAll(":scope > *")].find(x=>norm(x.textContent).includes(norm(r?.name||name)));
   let edit=card?.querySelector("button");
   if(edit){edit.click();} else card?.scrollIntoView({behavior:"smooth",block:"center"});
 },150);
}

function recipeForCard(card,rs){
 let text=norm(card.textContent);
 return rs.find(r=>text.includes(norm(r.name)));
}
function decorate(){
 let list=document.getElementById("recipeList");if(!list)return;
 let rs=get(RK,[]),photos=get(PLK,{});
 [...list.children].forEach(card=>{
   if(card.querySelector(".v864-photo"))return;
   let r=recipeForCard(card,rs);if(!r)return;
   let ph=photos[r.id]?.dataUrl,wrap=document.createElement("div");wrap.className="v864-photo";
   wrap.innerHTML=ph?`<img src="${ph}" alt="Photo ${esc(r.name)}">`:`<div class="v864-empty">📷<b>Photo à ajouter</b><small>Scanne ce plat pour compléter la fiche</small></div>`;
   if(!(r.ingredients||[]).length||(r.ingredients||[]).some(i=>!(Number(i.qty)>0)))wrap.insertAdjacentHTML("beforeend",'<span class="v864-todo">À compléter</span>');
   card.prepend(wrap);
 });
}
let st=document.createElement("style");st.textContent=`
.v864-menu-cat{margin:14px 0 20px}.v864-menu-cat h3{position:sticky;top:0;background:#fff;padding:9px 0;margin:0;z-index:2}
.v864-menu-row{width:100%;display:flex;justify-content:space-between;gap:10px;align-items:center;text-align:left;padding:12px 4px;border:0;border-bottom:1px solid #e4e8ef;background:transparent;color:inherit}
.v864-menu-row span{display:flex;flex-direction:column;gap:3px}.v864-menu-row small{color:#687386}.v864-menu-row strong{white-space:nowrap;color:#e07a2f}
.v864-photo{position:relative;margin-bottom:10px;border-radius:12px;overflow:hidden;background:#f4f6f9}.v864-photo img{width:100%;height:180px;object-fit:cover;display:block}
.v864-empty{min-height:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#687386}.v864-empty b{color:#172033}.v864-empty small{font-size:.72rem}
.v864-todo{position:absolute;right:8px;top:8px;background:#fff6eb;border:1px solid #f0c28d;color:#9a571d;border-radius:999px;padding:5px 8px;font-size:.72rem;font-weight:700}
`;document.head.appendChild(st);
setTimeout(()=>{ver();installMenu();decorate()},1300);
setTimeout(()=>{ver();installMenu();decorate()},2400);
new MutationObserver(()=>{decorate();ver()}).observe(document.getElementById("recipeList")||document.body,{childList:true,subtree:true});
})();