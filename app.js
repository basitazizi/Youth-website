
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const toggleBtn=$('.mobile-toggle');const navLinks=$('.nav-links');
if(toggleBtn){toggleBtn.addEventListener('click',()=>{if(navLinks.style.display==='flex'){navLinks.style.display='none'}else{navLinks.style.display='flex';navLinks.style.flexDirection='column';navLinks.style.gap='8px'}});}
const revealEls=$$('.reveal');const onScroll=()=>{const t=window.innerHeight*.9;revealEls.forEach(el=>{if(el.getBoundingClientRect().top<t)el.classList.add('visible');});};document.addEventListener('scroll',onScroll);window.addEventListener('load',onScroll);
$$('.btn').forEach(btn=>{btn.addEventListener('click',e=>{const r=document.createElement('span');r.style.position='absolute';r.style.inset='0';r.style.borderRadius='inherit';r.style.background=`radial-gradient(220px 220px at ${e.offsetX}px ${e.offsetY}px, rgba(255,255,255,.25), transparent 40%)`;r.style.pointerEvents='none';btn.appendChild(r);setTimeout(()=>r.remove(),350);});});
