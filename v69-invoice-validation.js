/* FOOD COST V6.9 — finalisation Factures V1
   Validation manuelle assistée, contrôle quantité × PU = total,
   aucune écriture avant validation finale. */
(function(){
"use strict";
const euro=n=>Number.isFinite(+n)?(+n).toFixed(2).replace(".",",")+" €":"—";
const close=(a,b)=>Math.abs(a-b)<=Math.max(.02,Math.abs(b)*.01);

function enhanceInvoiceDialog(){
  const dlg=document.getElementById("invoiceDialog");
  const rows=document.getElementById("invoiceRows");
  if(!dlg||!rows)return;

  function refresh(){
    const cards=[...rows.children];
    cards.forEach(card=>{
      const inputs=[...card.querySelectorAll("input")];
      if(!inputs.length)return;

      // Detect numeric fields from labels/placeholders/names without changing V6.0 data model.
      const field=(rx)=>inputs.find(i=>rx.test(
        ((i.name||"")+" "+(i.id||"")+" "+(i.placeholder||"")+" "+
        (i.closest("label")?.textContent||"")).toLowerCase()
      ));
      const q=field(/quant|qt[eé]?|qty/);
      const p=field(/prix|pu|unit/);
      const t=field(/total/);
      if(!q||!p)return;

      let box=card.querySelector(".v69-check");
      if(!box){box=document.createElement("div");box.className="v69-check";box.style.cssText="margin-top:8px;padding:8px 10px;border-radius:10px;font-size:13px;font-weight:700";card.appendChild(box)}

      const qv=Number(String(q.value).replace(",",".")), pv=Number(String(p.value).replace(",","."));
      const calc=qv>0&&pv>=0?qv*pv:null;
      const tv=t?Number(String(t.value).replace(",",".")):null;

      if(calc===null){box.textContent="À compléter : quantité et prix unitaire.";box.style.background="#fff3cd";return}
      if(t && Number.isFinite(tv) && tv>0){
        if(close(calc,tv)){box.textContent="✓ Cohérent : "+euro(calc);box.style.background="#dff5e5"}
        else{box.textContent="⚠ Incohérent : Qté × PU = "+euro(calc)+" mais total saisi = "+euro(tv);box.style.background="#ffdfe1"}
      }else{
        box.textContent="Calcul : "+euro(calc)+" — à vérifier avant validation.";box.style.background="#e8f0ff";
      }
    });
  }

  rows.addEventListener("input",refresh);
  new MutationObserver(()=>setTimeout(refresh,0)).observe(rows,{childList:true,subtree:true});
  dlg.addEventListener("toggle",refresh);
  setTimeout(refresh,200);

  // Guard final submit when an explicit total exists and arithmetic is inconsistent.
  const form=document.getElementById("invoiceForm");
  if(form && !form.dataset.v69){
    form.dataset.v69="1";
    form.addEventListener("submit",function(e){
      let bad=false;
      [...rows.children].forEach(card=>{
        const ins=[...card.querySelectorAll("input")];
        const get=rx=>ins.find(i=>rx.test((((i.name||"")+" "+(i.id||"")+" "+(i.placeholder||"")+" "+(i.closest("label")?.textContent||"")).toLowerCase())));
        const q=get(/quant|qt[eé]?|qty/),p=get(/prix|pu|unit/),t=get(/total/);
        if(q&&p&&t){
          let qv=Number(String(q.value).replace(",",".")),pv=Number(String(p.value).replace(",",".")),tv=Number(String(t.value).replace(",","."));
          if(qv>0&&pv>=0&&tv>0&&!close(qv*pv,tv))bad=true;
        }
      });
      if(bad){
        e.preventDefault();e.stopImmediatePropagation();
        alert("Une ligne est incohérente : quantité × prix unitaire ne correspond pas au total. Corrige-la avant de valider la facture.");
      }
    },true);
  }
}
function install(){
  enhanceInvoiceDialog();
  const btn=document.getElementById("newInvoiceBtn");
  if(btn && !btn.dataset.v69){
    btn.dataset.v69="1";
    btn.addEventListener("click",()=>setTimeout(enhanceInvoiceDialog,100));
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();