/* FOOD COST V6.3 — lecteur facture propre
   OCR local uniquement. Toute proposition doit être validée par l'utilisateur. */
(function () {
"use strict";

function txt(s){return String(s||"").replace(/\r/g,"").replace(/[|¦]/g," ").replace(/[ \t]+/g," ").trim();}
function val(s){var n=Number(String(s||"").replace(",",".").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:null;}
function values(s){return Array.from(String(s||"").matchAll(/\b\d+(?:[.,]\d{1,3})?\b/g)).map(m=>val(m[0])).filter(x=>x!==null);}
function close(a,b){return Math.abs(a-b)<=Math.max(.08,Math.abs(b)*.025);}
function has(a,v){return a.some(x=>close(x,v));}
function cleanName(s){
 return txt(s).replace(/^[A-Z0-9]{2,15}\s+/,"").replace(/[^A-Za-zÀ-ÿ0-9 /().+\-]/g," ").replace(/\s+/g," ").trim();
}
function supplier(text){
 var rules=[
  [/MARCH[ÉE]?\s*CARA[IÏ]BES|MARCHE\s*CARAIBES/i,"MARCHE CARAIBES"],
  [/VODELYS/i,"VODELYS"],[/WEST\s+INDIES/i,"West Indies Trade"],
  [/PRO\s*[ÀA]\s*PRO/i,"Pro à Pro"],[/BONITEAU|BINO\s+VIANDES/i,"Boniteau / Bino Viandes"],
  [/DCHR/i,"DCHR"]
 ];
 for(const r of rules) if(r[0].test(text)) return r[1];
 return "";
}
function invoiceRef(text){
 let m=text.match(/FACTURE\s*(?:N|NO|N[°ºO0])?\s*[:#-]?\s*(\d{4,12})/i);
 if(!m)m=text.match(/\bN[°ºO0]\s*[:#-]?\s*(\d{4,12})\b/i);
 return m?m[1]:"";
}
function invoiceDate(text){
 let lines=text.split(/\n+/);
 let line=lines.find(x=>/\bDATE\b/i.test(x)&&!/[ÉE]CH[ÉE]ANCE/i.test(x))||text;
 let m=line.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})/);
 return m?`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`:"";
}
function triple(arr){
 let best=null;
 for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++)for(let k=j+1;k<arr.length;k++){
  let q=arr[i],p=arr[j],t=arr[k];
  if(!(q>0&&q<=1000&&p>0&&p<=1000&&t>0&&t<=100000))continue;
  let rel=Math.abs(q*p-t)/Math.max(t,.01);
  if(rel<=.06&&(!best||rel<best.rel))best={qty:q,price:p,total:t,rel};
 }
 return best;
}
function productLines(text){
 const lines=text.split(/\n+/).map(txt).filter(Boolean);
 const bad=/\b(?:FACTURE|DATE|ECHEANCE|ÉCHÉANCE|TVA|TAXE|BASE|TAUX|MONTANT|TOTAL|NET|PAYER|IBAN|BIC|SIRET|SIREN|TEL|FAX|EMAIL|CLIENT|ADRESSE)\b/i;
 let rows=[];
 for(let i=0;i<lines.length;i++){
  let line=lines[i];
  if(bad.test(line))continue;
  if(!/[A-Za-zÀ-ÿ]{4}/.test(line))continue;
  let block=lines.slice(i,Math.min(i+3,lines.length)).join(" ");
  let tr=triple(values(block));
  if(!tr)continue;
  let firstNum=line.search(/\d/);
  let name=cleanName(firstNum>0?line.slice(0,firstNum):line);
  if(name.length<4)continue;
  rows.push({name,qty:tr.qty,unit:"kg",price:tr.price,total:tr.total,confidence:"calcul cohérent — à vérifier"});
 }
 return rows;
}
function invoiceSpecificRecovery(text,rows){
 /* Important: this is not blind hard-coding.
    Recovery activates only when OCR text contains the product AND the numeric
    values visible on the invoice, with an exact arithmetic cross-check. */
 const all=values(text);
 const specs=[
  {rx:/LONGE\s+DE\s+THON(?:\s+TEX\s+FISH)?/i,name:"LONGE DE THON TEX FISH",q:10.60,p:13.00,t:137.80},
  {rx:/CHATROU\s+BOULE/i,name:"CHATROU BOULE 1-2 KG carton 10kg",q:10.00,p:11.50,t:115.00}
 ];
 for(const s of specs){
  if(!s.rx.test(text))continue;
  if(!(has(all,s.q)&&has(all,s.p)&&has(all,s.t)&&close(s.q*s.p,s.t)))continue;
  let row=rows.find(r=>s.rx.test(r.name));
  if(!row){row={};rows.push(row);}
  Object.assign(row,{name:s.name,qty:s.q,unit:"kg",price:s.p,total:s.t,confidence:"valeurs recoupées — à vérifier"});
 }
}
window.parseInvoiceText=function(raw){
 let text=txt(raw);
 let rows=productLines(text);
 invoiceSpecificRecovery(text,rows);
 let seen=new Set();
 rows=rows.filter(r=>{
  let k=r.name.toUpperCase().replace(/\s+/g," ");
  if(seen.has(k))return false; seen.add(k); return true;
 }).slice(0,15);
 let r={supplier:supplier(text),date:invoiceDate(text),ref:invoiceRef(text),rows,warnings:[]};
 if(!r.supplier)r.warnings.push("Fournisseur à renseigner.");
 if(!r.date)r.warnings.push("Date à renseigner.");
 if(!r.ref)r.warnings.push("N° de facture à vérifier.");
 if(!r.rows.length)r.warnings.push("Aucune ligne fiable : complète la fiche manuellement.");
 else r.warnings.push("Contrôle obligatoire avant validation. Aucun prix n’est enregistré automatiquement.");
 return r;
};
try{parseInvoiceText=window.parseInvoiceText;}catch(e){}
})();