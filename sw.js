const CACHE='food-cost-v740-finition';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.mode==='navigate'){e.respondWith(fetch(r).then(async resp=>{let html=await resp.text();if(!html.includes('v74-finition.js'))html=html.replace('</body>','<script src="./v74-finition.js?v=740"></script></body>');return new Response(html,{status:resp.status,statusText:resp.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}).catch(()=>caches.match(r)));return}e.respondWith(fetch(r).catch(()=>caches.match(r))) });
