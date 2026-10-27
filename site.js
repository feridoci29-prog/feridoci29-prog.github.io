(()=>{const toggle=document.querySelector(".menu"),links=document.querySelector(".navlinks");toggle?.addEventListener("click",()=>{const open=links.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"✕":"☰"});document.querySelectorAll(".navlinks a").forEach(a=>a.addEventListener("click",()=>{links?.classList.remove("open");if(toggle){toggle.textContent="☰";toggle.setAttribute("aria-expanded","false")}}));document.addEventListener("keydown",e=>{if(e.key==="Escape"){links?.classList.remove("open");if(toggle){toggle.textContent="☰";toggle.setAttribute("aria-expanded","false")}}});const els=document.querySelectorAll("[data-reveal]");if("IntersectionObserver"in window){const io=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add("shown");io.unobserve(item.target)}}),{threshold:.08});els.forEach(el=>io.observe(el))}else els.forEach(el=>el.classList.add("shown"));const canvas=document.getElementById("starfield");if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let ww=0,hh=0,stars=[],raf=0,seed=712451;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const reset=()=>{ww=innerWidth;hh=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(ww*dpr);canvas.height=Math.floor(hh*dpr);canvas.style.width=ww+"px";canvas.style.height=hh+"px";ctx.setTransform(dpr,0,0,dpr,0,0);seed=712451;stars=Array.from({length:Math.min(210,Math.max(95,Math.floor(ww*hh/6000)))},()=>({x:random()*ww,y:random()*hh,s:1.3+random()*5,a:.07+random()*.36,v:.03+random()*.18,phase:random()*6.28}))};let tick=0;const render=()=>{ctx.clearRect(0,0,ww,hh);for(const p of stars){const alpha=p.a*(.75+.25*Math.sin(tick*.009+p.phase));ctx.fillStyle="rgba(42,151,255,"+alpha+")";ctx.fillRect(p.x,p.y,p.s,p.s);if(p.s>4){ctx.shadowColor="#228cff";ctx.shadowBlur=12;ctx.fillRect(p.x,p.y,p.s*.5,p.s*.5);ctx.shadowBlur=0}if(!reduce){p.y-=p.v;p.x+=p.v*.16;if(p.y<0)p.y=hh+3;if(p.x>ww)p.x=0}}tick++;if(!reduce)raf=requestAnimationFrame(render)};reset();render();let resizeTimeout;addEventListener("resize",()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(()=>{cancelAnimationFrame(raf);reset();render()},120)})})();

/* FERID OCI - INTERACTION ENHANCEMENTS V1 */
(()=>{
"use strict";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const doc = document;
const bar = doc.createElement("div");
bar.id="fx-progress";
bar.setAttribute("aria-hidden","true");
doc.body.appendChild(bar);
let scheduled = false;
const paintProgress=()=>{
  const max=Math.max(0,doc.documentElement.scrollHeight-innerHeight);
  bar.style.transform="scaleX("+(max?Math.max(0,Math.min(1,scrollY/max)):0)+")";
  scheduled=false;
};
addEventListener("scroll",()=>{
  if(!scheduled){scheduled=true;requestAnimationFrame(paintProgress);}
},{passive:true});
addEventListener("resize",paintProgress,{passive:true});
paintProgress();
if(reduced)return;
doc.body.classList.add("fx-ready");
const revealTargets=Array.from(doc.querySelectorAll(".quickfacts .fact, .section .overline, .section h2, .section-lede, .contact-box, .page-hero h1, .info-table article"))
 .filter(el=>!el.hasAttribute("data-reveal"));
if("IntersectionObserver" in window){
  revealTargets.forEach((el,i)=>{
    el.classList.add("fx-reveal");
    el.style.setProperty("--fx-delay",((i%3)*80)+"ms");
  });
  const watcher=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("fx-in");watcher.unobserve(entry.target);}
    });
  },{threshold:0.06,rootMargin:"0px 0px -22px 0px"});
  revealTargets.forEach(el=>watcher.observe(el));
}
if(!fine)return;
const aura=doc.createElement("div");
aura.id="fx-aura";
aura.setAttribute("aria-hidden","true");
doc.body.appendChild(aura);
let x=-800,y=-800,targetX=-800,targetY=-800,animating=false,visible=false;
const animate=()=>{
  x+=(targetX-x)*0.18;
  y+=(targetY-y)*0.18;
  aura.style.transform="translate3d("+(x-205)+"px,"+(y-205)+"px,0)";
  if(Math.abs(targetX-x)>.5||Math.abs(targetY-y)>.5){
    requestAnimationFrame(animate);
  }else animating=false;
};
const move=e=>{
  if(e.pointerType&&e.pointerType!=="mouse")return;
  targetX=e.clientX;targetY=e.clientY;
  if(!visible){visible=true;aura.style.opacity="1";x=targetX;y=targetY;}
  if(!animating){animating=true;requestAnimationFrame(animate);}
};
doc.addEventListener("pointermove",move,{passive:true});
doc.addEventListener("pointerout",e=>{
  if(!e.relatedTarget){visible=false;aura.style.opacity="0";}
},{passive:true});
addEventListener("blur",()=>{visible=false;aura.style.opacity="0";});
doc.querySelectorAll(".card,.mile,.contact-box").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    const bounds=el.getBoundingClientRect();
    el.style.setProperty("--spot-x",(e.clientX-bounds.left)+"px");
    el.style.setProperty("--spot-y",(e.clientY-bounds.top)+"px");
  },{passive:true});
});
})();
