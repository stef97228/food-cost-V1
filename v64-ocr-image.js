/* FOOD COST V6.4 — prétraitement image OCR local */
(function(){
"use strict";

async function preprocessInvoiceFile(file){
  if(!file || !/^image\//.test(file.type||"")) return file;
  const bmp = await createImageBitmap(file);
  const maxW = 2600;
  const scale = Math.min(3, Math.max(1.7, maxW / Math.max(1,bmp.width)));
  const w = Math.round(bmp.width*scale), h = Math.round(bmp.height*scale);
  const c=document.createElement("canvas"); c.width=w; c.height=h;
  const x=c.getContext("2d",{willReadFrequently:true});
  x.imageSmoothingEnabled=true; x.imageSmoothingQuality="high";
  x.drawImage(bmp,0,0,w,h);
  const im=x.getImageData(0,0,w,h), d=im.data;

  // grayscale + local-friendly contrast. Avoid hard binarization that erases thin invoice type.
  for(let i=0;i<d.length;i+=4){
    let y=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
    y=(y-128)*1.65+148;
    y=Math.max(0,Math.min(255,y));
    d[i]=d[i+1]=d[i+2]=y;
  }
  x.putImageData(im,0,0);

  const blob=await new Promise(res=>c.toBlob(res,"image/jpeg",.96));
  return new File([blob], "facture-ocr-v64.jpg", {type:"image/jpeg"});
}

function install(){
  const ids=["invoiceCamera","invoiceInput"];
  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(!el || el.dataset.v64) return;
    el.dataset.v64="1";
    el.addEventListener("change", async function(ev){
      const original=this.files && this.files[0];
      if(!original || !/^image\//.test(original.type||"")) return;
      try{
        const processed=await preprocessInvoiceFile(original);
        window.__foodCostOCRProcessedFile=processed;
        const status=document.getElementById("ocrStatus");
        if(status) status.textContent="Photo optimisée pour la lecture locale (agrandissement + contraste).";
      }catch(e){ console.warn("Prétraitement OCR V6.4",e); }
    }, true);
  });

  // Wrap Tesseract.recognize so existing V6.0 code automatically receives the optimized image.
  if(window.Tesseract && typeof window.Tesseract.recognize==="function" && !window.Tesseract.__v64){
    const old=window.Tesseract.recognize.bind(window.Tesseract);
    window.Tesseract.recognize=async function(image, lang, opts){
      const p=window.__foodCostOCRProcessedFile;
      if(p) image=p;
      return old(image, lang, opts);
    };
    window.Tesseract.__v64=true;
  }
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(install,100));
else setTimeout(install,100);
})();