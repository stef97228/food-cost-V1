/* FOOD COST V6.5 — filtre OCR factures
   Conserve le prétraitement V6.4. Validation humaine obligatoire. */
(function(){
"use strict";
const T=s=>String(s||"").replace(/\r/g,"").replace(/[|¦]/g," ").replace(/[ \t]+/g," ").trim();
const N=s=>{let n=Number(String(s||"").replace(",",".").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:null};

function supplier(text){
  const r=[
    [/MARCH[ÉE]?\s*CARA[IÏ]BES|MARCHE\s*CARAIBES/i,"MARCHE CARAIBES"],
    [/VODELYS/i,"VODELYS"],[/WEST\s+INDIES/i,"West Indies Trade"],
    [/PRO\s*[ÀA]\s*PRO/i,"Pro à Pro"],[/BONITEAU|BINO\s+VIANDES/i,"Boniteau / Bino Viandes"]
  ];
  for(const x of r) if(x[0].test(text)) return x[1];
  return "";
}
function ref(text){
  let m=text.match(/FACTURE\s*(?:N|NO|N[°ºO0])?\s*[:#-]?\s*(\d{4,12})/i);
  return m?m[1]:"";
}
function date(text){
  // Priority: date immediately after "Date", explicitly not "Échéance".
  const lines=text.split(/\n+/);
  for(const line of lines){
    let m=line.match(/\bDATE\s*[:.-]?\s*(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})/i);
    if(m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  }
  // On one OCR line Date and Échéance can coexist; take the first date before Échéance.
  let m=text.match(/\bDATE\b[\s\S]{0,30}?(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})/i);
  return m?`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`:"";
}
function numbers(line){
  return Array.from(line.matchAll(/\b\d+(?:[.,]\d{1,3})?\b/g)).map(m=>N(m[0])).filter(x=>x!==null);
}
function rowFor(lines, rx, canonical){
  let i=lines.findIndex(l=>rx.test(l));
  if(i<0)return null;
  let block=lines.slice(i,Math.min(lines.length,i+3)).join(" ");
  let a=numbers(block), best=null;
  for(let x=0;x<a.length;x++)for(let y=x+1;y<a.length;y++)for(let z=y+1;z<a.length;z++){
    let q=a[x],p=a[y],tot=a[z];
    if(!(q>0&&q<=500&&p>0&&p<=500&&tot>0&&tot<=50000))continue;
    let rel=Math.abs(q*p-tot)/Math.max(tot,.01);
    if(rel<=.04&&(!best||rel<best.rel))best={qty:q,price:p,total:tot,rel};
  }
  // OCR may omit total while qty + PU are correctly read.
  if(!best){
    for(let x=0;x<a.length;x++)for(let y=x+1;y<a.length;y++){
      let q=a[x],p=a[y];
      if(q>0&&q<=500&&p>0&&p<=500) {
        // Prefer plausible restaurant invoice qty / unit price, not digits from description.
        if((q>=0.05&&q<=100)&&(p>=0.1&&p<=200)){best={qty:q,price:p,total:q*p,rel:.99};break;}
      }
    }
  }
  return best?{name:canonical,qty:best.qty,unit:"kg",price:best.price,total:best.total,
    confidence:best.rel<=.04?"calcul recoupé — à vérifier":"quantité/prix lus — à vérifier"}:null;
}

window.parseInvoiceText=function(raw){
  const text=T(raw), lines=text.split(/\n+/).map(T).filter(Boolean);
  let rows=[];
  const known=[
    [/LONGE\s+DE\s+THON(?:\s+TEX\s+FISH)?/i,"LONGE DE THON TEX FISH"],
    [/(?:AD)?CHATROU|CHATROU\s+BOULE/i,"CHATROU BOULE 1-2 KG carton 10kg"]
  ];
  for(const k of known){let r=rowFor(lines,k[0],k[1]);if(r)rows.push(r);}

  // For unknown suppliers/products, accept only lines with a strong arithmetic triple.
  const reject=/\b(?:D[ÉE]SIGNATION|FACTURE|DATE|ECHEANCE|ÉCHÉANCE|TVA|TAXE|BASE|TAUX|MONTANT|TOTAL|NET|PAYER|IBAN|BIC|SIRET|SIREN|TEL|FAX|EMAIL|CLIENT|ADRESSE|BANQUE)\b/i;
  for(const line of lines){
    if(reject.test(line)||!/[\p{L}]{4}/u.test(line))continue;
    if(known.some(k=>k[0].test(line)))continue;
    let a=numbers(line), best=null;
    for(let x=0;x<a.length;x++)for(let y=x+1;y<a.length;y++)for(let z=y+1;z<a.length;z++){
      let q=a[x],p=a[y],tot=a[z],rel=Math.abs(q*p-tot)/Math.max(tot,.01);
      if(q>0&&q<=500&&p>0&&p<=500&&tot>0&&rel<=.025) best={q,p,tot};
    }
    if(!best)continue;
    let pos=line.search(/\d/), name=T(pos>0?line.slice(0,pos):"");
    if(name.length<5)continue;
    rows.push({name,qty:best.q,unit:"kg",price:best.p,total:best.tot,confidence:"calcul recoupé — à vérifier"});
  }

  // Deduplicate and cap noisy OCR.
  const seen=new Set();
  rows=rows.filter(r=>{let k=r.name.toUpperCase();if(seen.has(k))return false;seen.add(k);return true;}).slice(0,12);

  let result={supplier:supplier(text),date:date(text),ref:ref(text),rows,warnings:[]};
  if(!result.supplier)result.warnings.push("Fournisseur à vérifier.");
  if(!result.date)result.warnings.push("Date à renseigner.");
  if(!result.ref)result.warnings.push("N° facture à vérifier.");
  if(!rows.length)result.warnings.push("Aucune ligne suffisamment fiable : complète la fiche manuellement.");
  else result.warnings.push("Lignes filtrées par cohérence. Contrôle obligatoire avant validation.");
  return result;
};
try{parseInvoiceText=window.parseInvoiceText;}catch(e){}
})();