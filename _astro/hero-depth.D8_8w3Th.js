import{a as e,i as t,n,r,t as i}from"./Triangle.ngAs0F_3.js";var a=`attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,o=`precision highp float;
uniform sampler2D tPhoto;
uniform sampler2D tDepth;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uLook;
uniform float uDolly;
uniform float uRise;
varying vec2 vUv;
// «cover», как object-fit у постера, плюс запас 7 %: края не открываются при сдвигах.
vec2 cover(vec2 uv) {
  float r = uRes.x / uRes.y, i = uImg.x / uImg.y;
  vec2 s = r > i ? vec2(1.0, i / r) : vec2(r / i, 1.0);
  return (uv - 0.5) * s / 1.07 + 0.5;
}
void main() {
  vec2 uv = cover(vUv);
  vec2 c = vec2(0.5, 0.56);
  // Один отсчёт глубины в исходной точке: на резкой границе (табурет на фоне острова) картинка чуть тянется,
  // а не двоится. Въезд по прокрутке — в основном общий (0,82) и частью по глубине (0,18): ближние табуреты и остров
  // наезжают быстрее стены — заметный объём, а сдвиг остаётся уже размытой границы глубины, края не рвутся.
  float d = texture2D(tDepth, uv).r;
  float near = d - 0.45;
  float z = 1.0 + uDolly * (0.82 + d * 0.18);
  vec2 p = c + (uv - c) / z - uLook * near * 0.011 - vec2(0.0, uRise * near);
  gl_FragColor = texture2D(tPhoto, p);
}`,s=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});function c(c,l){let u=new t({canvas:c,dpr:Math.min(devicePixelRatio||1,2),alpha:!1,antialias:!1}),d=u.gl,f=new n(d,{generateMipmaps:!1,minFilter:d.LINEAR}),p=new n(d,{generateMipmaps:!1,minFilter:d.LINEAR}),m=new e(d,{vertex:a,fragment:o,uniforms:{tPhoto:{value:f},tDepth:{value:p},uRes:{value:[1,1]},uImg:{value:l.size},uLook:{value:[0,0]},uDolly:{value:0},uRise:{value:0}}}),h=new r(d,{geometry:new i(d),program:m}),g=matchMedia(`(prefers-reduced-motion: reduce)`).matches,_={dolly:0,rise:0},v={x:0,y:0,tx:0,ty:0},y=0,b=!0,x=!1,S=()=>{let e=c.parentElement.getBoundingClientRect();u.setSize(e.width,e.height),m.uniforms.uRes.value=[d.canvas.width,d.canvas.height]},C=e=>{if(y=0,!b||!x)return;let t=g?0:.35,n=Math.sin(e*31e-5)*t,r=Math.cos(e*23e-5)*t*.6;v.x+=(v.tx+n-v.x)*.06,v.y+=(v.ty+r-v.y)*.06,m.uniforms.uLook.value=[v.x,v.y],m.uniforms.uDolly.value=_.dolly,m.uniforms.uRise.value=_.rise,u.render({scene:h}),y=requestAnimationFrame(C)},w=()=>{!y&&b&&x&&(y=requestAnimationFrame(C))},T=e=>{e.pointerType===`mouse`&&(v.tx=e.clientX/innerWidth*2-1,v.ty=-(e.clientY/innerHeight*2-1),w())};l.pointer&&!g&&addEventListener(`pointermove`,T,{passive:!0});let E=new IntersectionObserver(([e])=>{b=e.isIntersecting,w()});E.observe(c);let D=new ResizeObserver(()=>{S(),w()});return D.observe(c.parentElement),{ready:Promise.all([s(l.photo),s(l.depth)]).then(([e,t])=>{f.image=e,p.image=t,S(),x=!0,u.render({scene:h}),w()}),set:e=>{e.dolly!==void 0&&(_.dolly=e.dolly),e.rise!==void 0&&(_.rise=e.rise),w()},dispose:()=>{cancelAnimationFrame(y),x=!1,removeEventListener(`pointermove`,T),E.disconnect(),D.disconnect(),d.getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{c as createHeroDepth};