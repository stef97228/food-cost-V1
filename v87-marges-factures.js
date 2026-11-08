/* Assiette Cost — v8.7 : ajout non destructif ; données locales uniquement. */
(()=>{
'use strict';
const docs=[{"supplier":"Pro à Pro","date":"2026-10-28","ref":"31-26-3010075","totalTTC":null,"type":"facture","notes":"Montant incomplet sur la photo","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-28","ref":"31-26-3010007","totalTTC":237.0,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"VODELYS","date":"2026-10-28","ref":"80866","totalTTC":655.71,"type":"bon de livraison","notes":"Montant provisoire, facture définitive nécessaire","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"POMAL","date":"2026-10-26","ref":"F6025497","totalTTC":114.32,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Boniteau Viandes","date":"2026-10-22","ref":"FA20268604","totalTTC":537.5,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"POMAL","date":"2026-10-15","ref":"F6024719","totalTTC":87.89,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Sofrima / DSAC","date":"2026-10-15","ref":"303801","totalTTC":477.5,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-14","ref":"31-26-2870044","totalTTC":1315.73,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"L’Épicerie / Edomshop","date":"2026-10-14","ref":"36132","totalTTC":291.25,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Sofrima / DSAC","date":"2026-10-23","ref":"307358","totalTTC":1084.07,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-23","ref":"31-26-2960016","totalTTC":377.71,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-23","ref":"31-26-2960024","totalTTC":244.27,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"A&M Martinique","date":"2026-10-12","ref":"AMM263081408","totalTTC":232.57,"type":"facture","notes":"Photo répétée dans la deuxième série, importée une seule fois","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Marché Caraïbes","date":"2026-10-20","ref":"262981","totalTTC":258.11,"type":"facture","notes":"Montant TTC reconstitué depuis HT et TVA; à confirmer","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"VODELYS","date":"2026-10-21","ref":"BL80745","totalTTC":760.99,"type":"bon de livraison","notes":"Montant provisoire, facture définitive nécessaire","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-21","ref":"31-26-2940028","totalTTC":286.31,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-21","ref":"31-26-2940042","totalTTC":808.69,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Marché Caraïbes","date":"2026-10-14","ref":"262936","totalTTC":117.42,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"A&M Martinique","date":"2026-10-12","ref":"AMM263081561","totalTTC":63.1,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Boniteau Viandes","date":"2026-10-14","ref":"FA20268378","totalTTC":345.67,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"West Indies Trade","date":"2026-10-13","ref":"BL-2026-101376","totalTTC":564.94,"type":"bon de livraison","notes":"Vérifier facture correspondante","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"VODELYS","date":"2026-10-14","ref":"BL80614","totalTTC":710.99,"type":"bon de livraison","notes":"Montant provisoire, facture définitive nécessaire","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Trois Rivières / Duquesne","date":"2026-10-16","ref":"10413418","totalTTC":155.51,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Prévotéau","date":"2026-10-15","ref":"202638086","totalTTC":119.91,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"A&M Martinique","date":"2026-10-26","ref":"AMM263085240","totalTTC":382.75,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-30","ref":"31-26-3030022","totalTTC":277.19,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Boniteau Viandes","date":"2026-10-30","ref":"FA20268804","totalTTC":70.14,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Marché Caraïbes","date":"2026-10-27","ref":"263042","totalTTC":553.38,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Trois Rivières / Duquesne","date":"2026-10-30","ref":"10413942","totalTTC":null,"type":"facture","notes":"Montant masqué, à confirmer","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]},{"supplier":"Pro à Pro","date":"2026-10-30","ref":"31-26-3030026","totalTTC":304.41,"type":"facture","notes":"","source":"Photos transmises dans la conversation, octobre 2026","status":"À vérifier","lines":[]}];
const KEY='foodCostInvoicesV5', RK='foodCostRecipesV3', PK='foodCostProductsV5';
const safe=(k, fallback)=>{try {return JSON.parse(localStorage.getItem(k)||'null')??fallback}catch{return fallback}};
const store=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const euro=v=>Number(v).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const imported=safe(KEY,[]);
let added=0;
// Documents d'octobre ajoutés comme pièces À VÉRIFIER, sans inventer des lignes produits.
for(const x of docs){
  const exists=imported.some(y=>normalize(y.ref)===normalize(x.ref)&&y.date===x.date);
  if(exists)continue;
  imported.unshift({id:'historique-oct26-'+normalize(x.ref),supplier:x.supplier,date:x.date,ref:x.ref,fileName:'Photo de facture transmise dans ChatGPT (original à conserver)',lines:[],totalTTC:x.totalTTC,documentType:x.type,verificationStatus:'À vérifier',importNotes:x.notes});
  added++;
}
if(added)try{store(KEY,imported); if(typeof renderAll==='function')renderAll()}catch(e){console.warn('Import documentaire non effectué',e)}
// La marge des fiches utilise le montant TTC saisi, ramené HT selon la TVA applicable.
// En Martinique, le taux réduit restauration est généralement de 2,1 %.
const TVAKEY='assietteCostVatForFood';
const savedTva=localStorage.getItem(TVAKEY)===null?NaN:Number(localStorage.getItem(TVAKEY));
const foodVat=(Number.isFinite(savedTva)&&savedTva>=0&&savedTva<=30)?savedTva:2.1;
const controls=document.createElement('div');controls.className='ac87tax';
controls.innerHTML='<label style="font-size:.9rem;display:block">TVA restauration (%) <input id="ac87vat" type="number" min="0" max="30" step="0.1" style="max-width:90px" value="'+foodVat+'"></label><small>2,1 % pour la restauration en Martinique (hors exceptions). À adapter si nécessaire.</small>';
document.querySelector('#recipes')?.insertBefore(controls,document.querySelector('#recipeList'));
controls.querySelector('input').addEventListener('change',e=>{const v=Number(e.target.value);if(v>=0&&v<=30){localStorage.setItem(TVAKEY,String(v));refreshMargins()}});
const vat=()=>Number(localStorage.getItem(TVAKEY)??2.1);
function costOfIngredient(i,prods){
 const qty=Number(i.qty);if(!(qty>=0))return null;
 // Prefer original app formula (incl. sous-recettes) to avoid divergent calculations.
 if(typeof ingredientCost==='function')return ingredientCost(i);
 const p=prods.find(x=>x.id===i.productId),price=p?Number(p.price):Number(i.manualPrice);
 const pu=p?.unit||(['ml','cl','L'].includes(i.unit)?'L':'kg');
 if(!(price>0))return null;
 if(pu==='kg'&&i.unit==='g'||pu==='L'&&i.unit==='ml')return qty*price/1000;
 if(pu==='L'&&i.unit==='cl')return qty*price/100;
 if(pu===i.unit)return qty*price;
 return null;
}
const marginHtml=r=>{
 const sale=Number(r.salePrice), ins=r.ingredients||[],prods=safe(PK,[]);
 if(!(sale>0)||!ins.length)return '<span class="ac87muted">Marge brute : à compléter (prix de vente ou ingrédients manquants)</span>';
 let total=0;for(const i of ins){const c=costOfIngredient(i,prods);if(c===null||!Number.isFinite(c))return '<span class="ac87muted">Marge brute : ingrédients/prix à vérifier</span>';total+=c}
 const ht=sale/(1+vat()/100),profit=ht-total,margin=ht>0?100*profit/ht:0,food=ht>0?100*total/ht:0;
 return '<div class="ac87margin"><b>Marge brute : '+margin.toFixed(1).replace('.',',')+' %</b><span>'+euro(profit)+' / plat · Food cost '+food.toFixed(1).replace('.',',')+' %</span><small>Vente HT : '+euro(ht)+' · Matières HT : '+euro(total)+'</small></div>';
};
let busy=false;
function refreshMargins(){if(busy)return;busy=true;try{
 const cards=[...document.querySelectorAll('#recipeList article.recipe')],rs=safe(RK,[]);
 cards.forEach((card,i)=>{const r=rs[i];if(!r)return;let slot=card.querySelector('.ac87marginWrap');if(!slot){slot=document.createElement('div');slot.className='ac87marginWrap';card.insertBefore(slot,card.querySelector('button.openRecipe')||null)}const html=marginHtml(r);if(slot.innerHTML!==html)slot.innerHTML=html});
 const edit=document.querySelector('#editDialog[open] #liveMetrics');if(edit){const id=document.querySelector('#editId')?.value,r=rs.find(x=>x.id===id);if(r){let tmp={...r,salePrice:Number(document.querySelector('#editSale')?.value)||null};const el=edit.querySelector('.ac87marginWrap')||document.createElement('div');el.className='ac87marginWrap';el.innerHTML=marginHtml(tmp);if(!el.parentNode)edit.appendChild(el)}}
}finally{busy=false}}
const obsTarget=document.getElementById('recipeList');if(obsTarget)new MutationObserver(()=>refreshMargins()).observe(obsTarget,{childList:true});
refreshMargins();
// Une prise de photo déclenche immédiatement l'OCR existant : plus besoin de cliquer sur "Lire".
for(const id of ['invoiceCamera','invoiceInput']){const inp=document.getElementById(id);if(!inp)continue;inp.addEventListener('change',()=>{const f=inp.files?.[0];if(!f?.type.startsWith('image/'))return;queueMicrotask(()=>{const btn=document.getElementById('ocrInvoiceBtn');if(btn&&!btn.disabled)btn.click()})})}
// La lecture OCR n'écrase JAMAIS les prix du catalogue sans validation explicite.
// Documents importés = métadonnées à vérifier, non pièces comptables certifiées.
const s=document.createElement('p');s.className='ac87note';s.textContent='Import octobre 2026 : '+docs.length+' documents distincts référencés depuis les photos du chat. Pièces et lignes produits à vérifier avant comptabilité. Les prix du catalogue n’ont pas été modifiés.';
document.querySelector('#invoices .sectionhead')?.before(s);
// Le bouton existant ne doit plus présenter toutes les factures comme des tests.
function renameButtons(){document.querySelectorAll('.deleteInvoice').forEach(b=>{if(b.textContent.includes('facture test'))b.textContent='Supprimer de l’historique'})}
const invList=document.getElementById('invoiceList');if(invList)new MutationObserver(renameButtons).observe(invList,{childList:true});renameButtons();
const style=document.createElement('style');style.textContent='.ac87margin{margin:9px 0;padding:11px 12px;background:#edf8f0;color:#183f29;border:1px solid #aed9be;border-radius:12px;display:flex;flex-direction:column;gap:3px}.ac87margin b{font-size:1.15rem}.ac87margin small{opacity:.78}.ac87muted,.ac87note{display:block;margin:9px 0;font-size:.84rem;opacity:.8}.ac87tax{background:#f3f5f8;padding:10px;border-radius:12px;margin:8px 0}.ac87tax small{font-size:.74rem}';document.head.appendChild(style);
})();
