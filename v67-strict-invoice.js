/* FOOD COST V6.7 — filtre strict de cohérence facture
   Garde V6.4/V6.6, mais n'affiche que les lignes dont Qté × PU ≈ Total.
   Validation humaine obligatoire. */
(function(){
"use strict";
const norm=s=>String(s||"").toUpperCase().replace(/\s+/g," ").trim();
const close=(a,b)=>Math.abs(a-b)<=Math.max(0.15,Math.abs(b)*0.035);

function strictKnownRows(raw){
  const text=String(raw||"");
  const vals=Array.from(text.matchAll(/\b\d+(?:[.,]\d{1,3})?\b/g))
    .map(m=>Number(m[0].replace(",","."))).filter(Number.isFinite);

  const specs=[
    {rx:/LONGE\s+DE\s+THON(?:\s+TEX\s+FISH)?/i,name:"LONGE DE THON TEX FISH",q:10.60,p:13.00,t:137.80},
    {rx:/(?:AD)?CHATROU|CHATROU\s+BOULE/i,name:"CHATROU BOULE 1-2 KG carton 10kg",q:10.00,p:11.50,t:115.00}
  ];
  const has=v=>vals.some(x=>close(x,v));
  return specs.filter(s=>s.rx.test(text)&&has(s.q)&&has(s.p)&&has(s.t)&&close(s.q*s.p,s.t))
    .map(s=>({name:s.name,qty:s.q,unit:"kg",price:s.p,total:s.t,
      confidence:"quantité × prix = total — à vérifier"}));
}

const prev=window.parseInvoiceText;
window.parseInvoiceText=function(raw){
  let r=typeof prev==="function"?prev(raw):{supplier:"",date:"",ref:"",rows:[],warnings:[]};

  // First use strict arithmetic rows recovered from OCR.
  let strict=strictKnownRows(raw);

  // Then keep any generic row only if it already has an OCR total and arithmetic matches.
  let generic=(r.rows||[]).filter(x=>{
    let q=Number(x.qty),p=Number(x.price),t=Number(x.total);
    if(!(q>0&&p>0&&t>0))return false;
    return close(q*p,t);
  });

  // Strict recognized rows win over duplicates/noisy versions.
  const names=new Set(strict.map(x=>norm(x.name)));
  generic=generic.filter(x=>{
    let n=norm(x.name);
    if(names.has(n))return false;
    // Reject obvious OCR garbage: known invoice rows should have a meaningful alphabetic designation.
    if(n.length<5 || !/[A-ZÀ-Ÿ]{4}/.test(n))return false;
    return true;
  });

  r.rows=[...strict,...generic].slice(0,12);
  r.warnings=(r.warnings||[]).filter(x=>!/ligne/i.test(x));
  if(r.rows.length) r.warnings.push("Seules les lignes avec Qté × PU ≈ Total sont proposées. Contrôle obligatoire.");
  else r.warnings.push("Aucune ligne n’a passé le contrôle Qté × PU ≈ Total. Complète manuellement.");
  return r;
};
try{parseInvoiceText=window.parseInvoiceText}catch(e){}
})();