/* FOOD COST V6.6 — OCR spatial par colonnes
   Exploite les coordonnées des mots Tesseract. Aucune validation automatique. */
(function(){
"use strict";
const S=s=>String(s||"").trim();
const num=s=>{let n=Number(S(s).replace(",",".").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:null};

function wordsFrom(result){
  const d=result && result.data ? result.data : result;
  if(d && Array.isArray(d.words)) return d.words.filter(w=>w && S(w.text));
  return [];
}
function cx(w){return ((w.bbox?.x0||0)+(w.bbox?.x1||0))/2}
function cy(w){return ((w.bbox?.y0||0)+(w.bbox?.y1||0))/2}
function lineGroups(words){
  const a=[...words].sort((u,v)=>cy(u)-cy(v)||cx(u)-cx(v)), lines=[];
  for(const w of a){
    let h=Math.max(8,(w.bbox?.y1||0)-(w.bbox?.y0||0)), y=cy(w);
    let L=lines.find(l=>Math.abs(l.y-y)<=Math.max(9,h*.65));
    if(!L){L={y,words:[]};lines.push(L)}
    L.words.push(w); L.y=(L.y*(L.words.length-1)+y)/L.words.length;
  }
  return lines.map(l=>({y:l.y,words:l.words.sort((a,b)=>cx(a)-cx(b)),
    text:l.words.sort((a,b)=>cx(a)-cx(b)).map(w=>S(w.text)).join(" ")}));
}
function detectHeader(lines){
  for(const l of lines){
    if(/D[ÉE]SIGNATION/i.test(l.text) && /(QT|QTE|QTÉ|PU|P\.?U)/i.test(l.text)){
      let des=l.words.find(w=>/D[ÉE]SIGNATION/i.test(w.text));
      let q=l.words.find(w=>/QT|QTE|QTÉ/i.test(w.text));
      let pu=l.words.find(w=>/^P\.?U|PU$/i.test(w.text));
      let total=l.words.find(w=>/TOTAL/i.test(w.text));
      if(q&&pu) return {y:l.y, des:des?cx(des):0, q:cx(q), pu:cx(pu), total:total?cx(total):Infinity};
    }
  }
  return null;
}
function spatialRows(words){
  const lines=lineGroups(words), h=detectHeader(lines);
  if(!h)return [];
  const candidates=lines.filter(l=>l.y>h.y && l.y<h.y+Math.max(500,h.y*1.2));
  const rows=[];
  for(const l of candidates){
    if(!/[A-Za-zÀ-ÿ]{4}/.test(l.text))continue;
    if(/\b(TVA|TAXE|BASE|MONTANT|TOTAL|NET|PAYER)\b/i.test(l.text))continue;

    const nameWords=l.words.filter(w=>cx(w)<h.q-8);
    const qWords=l.words.filter(w=>cx(w)>=h.q-20 && cx(w)<h.pu-20);
    const pWords=l.words.filter(w=>cx(w)>=h.pu-20 && cx(w)<h.total-15);
    const tWords=Number.isFinite(h.total)?l.words.filter(w=>cx(w)>=h.total-20):[];

    const name=S(nameWords.map(w=>w.text).join(" ")).replace(/^[A-Z0-9]{3,15}\s+/,"");
    const q=qWords.map(w=>num(w.text)).find(v=>v>0&&v<1000);
    const p=pWords.map(w=>num(w.text)).find(v=>v>0&&v<1000);
    const t=tWords.map(w=>num(w.text)).find(v=>v>0&&v<100000);

    if(name.length>=4 && q && p){
      rows.push({name,qty:q,unit:"kg",price:p,total:t||q*p,
        confidence:t && Math.abs(q*p-t)<=Math.max(.15,t*.04)?"colonnes + total recoupés — à vérifier":"colonnes OCR — à vérifier"});
    }
  }
  return rows.slice(0,15);
}
function metaFromWords(words){
  const lines=lineGroups(words), all=lines.map(l=>l.text).join("\n");
  let supplier="";
  if(/MARCH[ÉE]?\s*CARA[IÏ]BES|MARCHE\s*CARAIBES/i.test(all))supplier="MARCHE CARAIBES";
  else if(/VODELYS/i.test(all))supplier="VODELYS";
  else if(/WEST\s+INDIES/i.test(all))supplier="West Indies Trade";
  else if(/PRO\s*[ÀA]\s*PRO/i.test(all))supplier="Pro à Pro";

  let ref="",m=all.match(/FACTURE\s*(?:N|NO|N[°ºO0])?\s*[:#-]?\s*(\d{4,12})/i); if(m)ref=m[1];
  let date="";
  for(const l of lines){
    let d=l.text.match(/\bDATE\s*[:.-]?\s*(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})/i);
    if(d){date=`${d[3]}-${d[2].padStart(2,"0")}-${d[1].padStart(2,"0")}`;break}
  }
  return {supplier,date,ref};
}

/* Capture Tesseract's full result without changing the existing OCR UI. */
function wrapTesseract(){
  if(!window.Tesseract || typeof window.Tesseract.recognize!=="function" || window.Tesseract.__v66)return;
  const old=window.Tesseract.recognize.bind(window.Tesseract);
  window.Tesseract.recognize=async function(){
    const r=await old.apply(null,arguments);
    try{
      const words=wordsFrom(r);
      window.__foodCostSpatialOCR={words,rows:spatialRows(words),meta:metaFromWords(words)};
    }catch(e){console.warn("Spatial OCR V6.6",e)}
    return r;
  };
  window.Tesseract.__v66=true;
}

/* Merge spatial data into the existing V6.5 parser output.
   Spatial rows win only when we actually detected usable table columns. */
const previous=window.parseInvoiceText;
window.parseInvoiceText=function(raw){
  let r=typeof previous==="function"?previous(raw):{supplier:"",date:"",ref:"",rows:[],warnings:[]};
  const sp=window.__foodCostSpatialOCR;
  if(sp){
    if(sp.meta.supplier)r.supplier=sp.meta.supplier;
    if(sp.meta.date)r.date=sp.meta.date;
    if(sp.meta.ref)r.ref=sp.meta.ref;
    if(sp.rows && sp.rows.length){
      r.rows=sp.rows;
      r.warnings=(r.warnings||[]).filter(x=>!/ligne/i.test(x));
      r.warnings.push("Lecture par colonnes de la facture. Contrôle obligatoire avant validation.");
    }
  }
  return r;
};
try{parseInvoiceText=window.parseInvoiceText}catch(e){}

function install(){wrapTesseract()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(install,200));
else setTimeout(install,200);
})();