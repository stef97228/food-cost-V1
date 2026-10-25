/* FOOD COST V7.5.1 — correctif iPhone, un seul traitement photo */
(()=>{
  const input=document.getElementById("plateInput");
  const gallery=document.getElementById("plateGallery");
  const preview=document.getElementById("platePreview");
  const status=document.getElementById("plateStatus");
  if(!input||!gallery||!preview)return;

  let previewUrl="";
  const say=(text)=>{if(status)status.textContent=text};

  function clearPreviewUrl(){
    if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=""}
  }

  async function compressForAI(file){
    const MAX=900, QUALITY=.62;
    if("createImageBitmap" in window){
      let bmp;
      try{
        bmp=await createImageBitmap(file);
        const scale=Math.min(1,MAX/Math.max(bmp.width,bmp.height));
        const w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale));
        const c=document.createElement("canvas"); c.width=w;c.height=h;
        c.getContext("2d",{alpha:false}).drawImage(bmp,0,0,w,h);
        if(bmp.close)bmp.close();
        return c.toDataURL("image/jpeg",QUALITY);
      }catch(e){if(bmp?.close)bmp.close()}
    }
    return await new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(file),im=new Image();
      im.onload=()=>{
        try{
          const scale=Math.min(1,MAX/Math.max(im.naturalWidth,im.naturalHeight));
          const w=Math.max(1,Math.round(im.naturalWidth*scale)),h=Math.max(1,Math.round(im.naturalHeight*scale));
          const c=document.createElement("canvas");c.width=w;c.height=h;
          c.getContext("2d",{alpha:false}).drawImage(im,0,0,w,h);
          URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg",QUALITY));
        }catch(e){URL.revokeObjectURL(url);reject(e)}
      };
      im.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Image illisible"))};
      im.src=url;
    });
  }

  function showLocalPreview(file){
    clearPreviewUrl(); previewUrl=URL.createObjectURL(file);
    preview.replaceChildren();
    const img=new Image();img.alt="Photo du plat";img.src=previewUrl;
    preview.appendChild(img);
  }

  async function handle(file){
    if(!file)return;
    showLocalPreview(file);
    say("Photo reçue. Préparation légère pour l’analyse…");
    try{
      const data=await compressForAI(file);
      /* app.js conserve cette variable pour l'enregistrement et son analyse IA */
      pendingPlatePhoto=data;
      plateBuilder?.classList.remove("hidden");
      renderPlateRecipeOptions?.();
      loadPlateRecipe?.();
      say("Analyse IA du plat en cours…");
      await analyzePlateWithAI();
    }catch(e){
      pendingPlatePhoto="";
      plateBuilder?.classList.remove("hidden");
      say("La photo reste visible, mais l’analyse automatique n’a pas pu démarrer. Tu peux continuer manuellement.");
    }
  }

  /* Remplace les anciens onchange de app.js : pas de double traitement. */
  input.onchange=()=>handle(input.files?.[0]);
  gallery.onchange=()=>handle(gallery.files?.[0]);

  window.addEventListener("pagehide",clearPreviewUrl,{once:true});
})();
