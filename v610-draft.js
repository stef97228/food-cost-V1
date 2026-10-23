/* FOOD COST V6.10 — sauvegarde automatique du brouillon de facture */
(function(){
"use strict";
const KEY="foodcost_invoice_draft_v610";

function el(id){return document.getElementById(id)}
function snapshot(){
  const dlg=el("invoiceDialog"), rows=el("invoiceRows");
  if(!dlg||!rows||!dlg.open)return;
  const data={
    supplier:el("invSupplier")?.value||"",
    date:el("invDate")?.value||"",
    ref:el("invRef")?.value||"",
    rowsHTML:rows.innerHTML,
    fields:[...rows.querySelectorAll("input,select,textarea")].map(x=>({
      tag:x.tagName,type:x.type||"",name:x.name||"",id:x.id||"",
      value:x.value,checked:!!x.checked
    })),
    savedAt:Date.now()
  };
  localStorage.setItem(KEY,JSON.stringify(data));
}
function applyFields(rows,data){
  const fs=[...rows.querySelectorAll("input,select,textarea")];
  (data.fields||[]).forEach((v,i)=>{
    const x=fs[i]; if(!x)return;
    if(v.type==="checkbox"||v.type==="radio") x.checked=!!v.checked;
    else x.value=v.value??"";
    x.dispatchEvent(new Event("input",{bubbles:true}));
    x.dispatchEvent(new Event("change",{bubbles:true}));
  });
}
function restore(){
  let data; try{data=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
  if(!data)return;
  const dlg=el("invoiceDialog"), rows=el("invoiceRows");
  if(!dlg||!rows)return;
  if(el("invSupplier"))el("invSupplier").value=data.supplier||"";
  if(el("invDate"))el("invDate").value=data.date||"";
  if(el("invRef"))el("invRef").value=data.ref||"";
  if(data.rowsHTML && !rows.children.length) rows.innerHTML=data.rowsHTML;
  applyFields(rows,data);
  if(!dlg.open && dlg.showModal) dlg.showModal();
  let note=dlg.querySelector(".v610-note");
  if(!note){
    note=document.createElement("div");
    note.className="v610-note";
    note.style.cssText="margin:10px 0;padding:10px 12px;border-radius:12px;background:#e8f0ff;font-weight:700";
    const h=dlg.querySelector("h2"); (h?.after(note));
  }
  note.textContent="✓ Brouillon restauré automatiquement — rien n’a été enregistré définitivement.";
}
function install(){
  const dlg=el("invoiceDialog");
  if(!dlg)return;
  dlg.addEventListener("input",()=>setTimeout(snapshot,0),true);
  dlg.addEventListener("change",()=>setTimeout(snapshot,0),true);
  document.addEventListener("visibilitychange",()=>{ if(document.hidden)snapshot(); else setTimeout(restore,100); });
  window.addEventListener("pagehide",snapshot);
  window.addEventListener("pageshow",()=>setTimeout(restore,150));

  const cancel=el("cancelInvoice");
  if(cancel) cancel.addEventListener("click",()=>localStorage.removeItem(KEY),true);

  const form=el("invoiceForm");
  if(form) form.addEventListener("submit",function(){
    // La suppression est différée : si un autre contrôle bloque la validation,
    // le brouillon reste disponible.
    setTimeout(()=>{ if(!dlg.open) localStorage.removeItem(KEY); else snapshot(); },300);
  },false);

  // Si iOS a rechargé la page pendant que l'utilisateur était ailleurs.
  setTimeout(restore,300);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();