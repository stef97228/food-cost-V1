const CACHE='food-cost-v750-production';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{let h=await r.text();h=h.replace(/<script src="\.\/v74-finition\.js[^>]*><\/script>/g,'');if(!h.includes('v75-production.js'))h=h.replace('</body>','<script src="./v75-production.js?v=750"></script></body>');return new Response(h,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}).catch(()=>caches.match(e.request)));return;
 }
 e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));
});
