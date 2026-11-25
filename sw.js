// Med Reviewers offline helper. Version changes on every deploy (build_gh.py).
const V='mr-6c394bffad5e', FONTS='mr-fonts', CORE=['./','manifest.webmanifest','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
  await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
  if(!self.registration.active)await self.skipWaiting();})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())
  if(k.startsWith('mr-')&&k!==V&&k!==FONTS)await caches.delete(k);await self.clients.claim();})())});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(V);
      const hit=await c.match('./');if(hit)return hit;
      const res=await fetch(r);if(res.ok)c.put('./',res.clone());return res;})());return}
    if(u.pathname.endsWith('/sw.js'))return;
    e.respondWith((async()=>{const hit=await caches.match(r,{ignoreSearch:true});return hit||fetch(r)})());return}
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith((async()=>{const c=await caches.open(FONTS);const hit=await c.match(r);
      const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net;})())}
});
