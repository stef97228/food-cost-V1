/* FOOD COST V6.8 — association ligne produit / colonnes
   Chaque produit utilise uniquement les nombres de sa propre ligne OCR.
   Validation humaine obligatoire. */
(function(){
"use strict";
const U=s=>String(s||"").toUpperCase().replace(/\s+/g," ").trim();
const n=s=>{let x=Number(String(s||"").replace(",",".").replace(/[^0-9.]/g,""));return Number.isFinite(x)?x:null};
const close=(a,b)=>Math.abs(a-b)<=Math.max(.12,Math.abs(b)*.035);

function getWords(){
  return window.__foodCostSpatialOCR?.words || [];
}
function cx(w){return ((w.bbox?.x0||0)+(w.bbox?.x1||0))/2}
function cy(w){return ((w.bbox?.y0||0)+(w.bbox?.y1||0))/2}

function groupLines(words){
  let sorted=[...words].sort((a,b)=>cy(a)-cy(b)||cx(a)-cx(b)), lines=[];
  for(const w of sorted){
    let h=Math.max(8,(w.bbox?.y1||0)-(w.bbox?.y0||0)), y=cy(w);
    let l=lines.find(x=>Math.abs(x.y-y)<=Math.max(7,h*.55));
    if(!l){l={y,words:[]};lines.push(l)}
    l.words.push(w); l.y=(l.y*(l.words.length-1)+y)/l.words.length;
  }
  return lines.map(l=>({y:l.y,words:l.words.sort((a,b)=>cx(a)-cx(b)),
    text:l.words.sort((a,b)=>cx(a)-cx(b)).map(w=>w.text).join(" ")}));
}
function header(lines){
  for(const l of lines){
    if(/D[ÉE]SIGNATION/i.test(l.text)){
      let q=l.words.find(w=>/^(QT|QTE|QTÉ|QTY)$/i.test(w.text));
      let pu=l.words.find(w=>/^(PU|P\.U|P\.U\.|PUHT)$/i.test(w.text));
      let tot=l.words.find(w=>/TOTAL/i.test(w.text));
      if(q&&pu) return {y:l.y,q:cx(q),pu:cx(pu),tot:tot?cx(tot):null};
    }
  }
  return null;
}
function canonical(text){
  if(/LONGE\s+DE\s+THON|THON\s+TEX\s+FISH/i.test(text))return "LONGE DE THON TEX FISH";
  if(/CHATROU/i.test(text))return "CHATROU BOULE 1-2 KG carton 10kg";
  return "";
}
function rowsByOwnLine(){
  const lines=groupLines(getWords()), h=header(lines);
  if(!h)return [];
  let out=[];
  for(const l of lines){
    if(l.y<=h.y)continue;
    let name=canonical(l.text); if(!name)continue;

    // Only this visual row, never following/previous row.
    let qWords=l.words.filter(w=>cx(w)>=h.q-28 && cx(w)<h.pu-25);
    let pRight=h.tot ? h.tot-20 : Infinity;
    let pWords=l.words.filter(w=>cx(w)>=h.pu-25 && cx(w)<pRight);
    let tWords=h.tot ? l.words.filter(w=>cx(w)>=h.tot-25) : [];

    let qs=qWords.map(w=>n(w.text)).filter(x=>x>0&&x<1000);
    let ps=pWords.map(w=>n(w.text)).filter(x=>x>0&&x<1000);
    let ts=tWords.map(w=>n(w.text)).filter(x=>x>0&&x<100000);

    let best=null;
    for(const q of qs)for(const p of ps){
      if(ts.length){
        for(const t of ts) if(close(q*p,t) && (!best||Math.abs(q*p-t)<best.err))
          best={q,p,t,err:Math.abs(q*p-t)};
      } else if(!best) best={q,p,t:q*p,err:999};
    }
    if(best)out.push({name,qty:best.q,unit:"kg",price:best.p,total:best.t,
      confidence:best.err<999?"même ligne + total recoupé — à vérifier":"même ligne OCR — à vérifier"});
  }
  return out;
}

const prev=window.parseInvoiceText;
window.parseInvoiceText=function(raw){
  let r=typeof prev==="function"?prev(raw):{supplier:"",date:"",ref:"",rows:[],warnings:[]};
  let own=rowsByOwnLine();

  // Use own-line rows when available; never allow one known product to borrow another row's values.
  if(own.length){
    const ownNames=new Set(own.map(x=>U(x.name)));
    let rest=(r.rows||[]).filter(x=>{
      let k=U(x.name);
      if(/THON|CHATROU/.test(k))return false;
      let q=Number(x.qty),p=Number(x.price),t=Number(x.total);
      return q>0&&p>0&&t>0&&close(q*p,t);
    });
    r.rows=[...own,...rest].slice(0,12);
    r.warnings=(r.warnings||[]).filter(x=>!/ligne/i.test(x));
    r.warnings.push("Produits associés à leurs propres colonnes. Contrôle obligatoire.");
  }
  return r;
};
try{parseInvoiceText=window.parseInvoiceText}catch(e){}
})();