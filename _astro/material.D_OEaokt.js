import{n as e}from"./app.BKegynHu.js";import{C as t,D as n,E as r,O as i,S as a,a as o,b as s,d as c,f as l,i as u,k as d,n as f,v as p,w as m}from"./three.module.DhAAoWNF.js";var h={ash:{shine:48,spec:.3,bump:2.6},"oak-veneer":{shine:44,spec:.28,bump:2.4},walnut:{shine:96,spec:.14,bump:2.2},concrete:{shine:96,spec:.16,bump:1.2},"#7E8A78":{shine:10,spec:.1,bump:.25},"#1B1B1A":{shine:8,spec:.07,bump:.2}},g=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,_=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uA; uniform sampler2D uB;
uniform vec3 uColA; uniform vec3 uColB;
uniform float uTexA; uniform float uTexB;
uniform vec3 uSurfA; uniform vec3 uSurfB; // shine, spec, bump
uniform float uMix; uniform vec2 uLight; uniform vec2 uScale; uniform vec2 uTexel; uniform float uAspect;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Цвет и нормаль одной поверхности.
void surface(sampler2D t, float useTex, vec3 col, vec3 surf, vec2 uv, out vec3 albedo, out vec3 n) {
  vec2 tuv = (uv - 0.5) * uScale + 0.5;
  if (useTex > 0.5) {
    albedo = texture2D(t, tuv).rgb;
    float l = lum(albedo);
    float lx = lum(texture2D(t, tuv + vec2(uTexel.x, 0.0)).rgb) - lum(texture2D(t, tuv - vec2(uTexel.x, 0.0)).rgb);
    float ly = lum(texture2D(t, tuv + vec2(0.0, uTexel.y)).rgb) - lum(texture2D(t, tuv - vec2(0.0, uTexel.y)).rgb);
    // Тёмные поры — углубления: нормаль «смотрит» от тёмного к светлому.
    n = normalize(vec3(-lx * surf.z, -ly * surf.z, 1.0));
    albedo = mix(albedo, albedo * (0.86 + 0.28 * l), 0.5);
  } else {
    albedo = col;
    float g = noise(uv * vec2(420.0, 420.0 * uAspect)) - 0.5;
    n = normalize(vec3(g * surf.z, (noise(uv * 380.0 + 7.0) - 0.5) * surf.z, 1.0));
  }
}

void main() {
  vec3 aA, nA, aB, nB;
  surface(uA, uTexA, uColA, uSurfA, vUv, aA, nA);
  surface(uB, uTexB, uColB, uSurfB, vUv, aB, nB);
  // Перетекание: граница идёт по диагонали с неровным краем, как волокно.
  float edge = vUv.y * 0.7 + vUv.x * 0.3 + (noise(vUv * vec2(3.0, 18.0)) - 0.5) * 0.25;
  float m = smoothstep(uMix * 1.4 - 0.2, uMix * 1.4 - 0.05, edge);
  m = 1.0 - m;
  vec3 albedo = mix(aA, aB, m);
  vec3 n = normalize(mix(nA, nB, m));
  vec3 surf = mix(uSurfA, uSurfB, m);

  // Мягкий свет над фасадом: точка света в плоскости + высота.
  vec3 p = vec3(vUv.x * uAspect, vUv.y, 0.0);
  vec3 lp = vec3(uLight.x * uAspect, uLight.y, 0.42);
  vec3 L = normalize(lp - p);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float dist = length(lp.xy - p.xy);
  float fall = 1.0 / (1.0 + dist * dist * 4.0);
  float diff = max(dot(n, L), 0.0);
  // Блик сильнее на светлых волокнах и слабее в порах — так «проявляется» рисунок.
  float grain = 0.55 + 0.9 * lum(albedo);
  float spec = pow(max(dot(n, H), 0.0), surf.x) * surf.y * fall * grain;
  vec3 c = albedo * (0.66 + 0.42 * diff * fall) + vec3(1.0, 0.97, 0.92) * spec;

  // Микрофаска по краю фасада: тонкая светлая кромка сверху-слева, тень снизу-справа.
  float bx = min(vUv.x, 1.0 - vUv.x) * uAspect, by = min(vUv.y, 1.0 - vUv.y);
  float b = min(bx, by);
  float bevel = 1.0 - smoothstep(0.0, 0.006, b);
  float side = (vUv.x < 0.5 ? 1.0 : -0.6) * step(bx, by) + (vUv.y > 0.5 ? 1.0 : -0.6) * step(by, bx);
  c += bevel * side * 0.06;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}
`;async function v(v,y){let b;try{b=new f({canvas:v,antialias:!1,alpha:!1,powerPreference:`low-power`})}catch{return null}b.debug.checkShaderErrors=!1;let x=1024;b.setPixelRatio(Math.min(devicePixelRatio,2));let S=new t,C=new p(-1,1,1,-1,0,1),w=new n,T=new Map,E=t=>new Promise((n,r)=>{if(T.has(t))return n(T.get(t));w.load(e(`tex/${t}-${x}.jpg`),e=>{e.colorSpace=a,e.wrapS=e.wrapT=u,e.minFilter=c,e.anisotropy=b.capabilities.getMaxAnisotropy(),T.set(t,e),n(e)},void 0,r)}),D=new r,O=e=>{let t=h[e]||h.oak;return new d(t.shine,t.spec,t.bump)},k=e=>new o(e||`#000`).convertSRGBToLinear(),A=y.tex?await E(y.tex):D,j={uA:{value:A},uB:{value:A},uColA:{value:k(y.color)},uColB:{value:k(y.color)},uTexA:{value:+!!y.tex},uTexB:{value:+!!y.tex},uSurfA:{value:O(y.tex||y.color)},uSurfB:{value:O(y.tex||y.color)},uMix:{value:0},uLight:{value:new i(.35,.62)},uScale:{value:new i(1,1)},uTexel:{value:new i(1/x,1/x)},uAspect:{value:1}},M=new m({vertexShader:g,fragmentShader:_,uniforms:j});b.outputColorSpace=a;let N=new l(new s(2,2),M);S.add(N);let P=v.parentElement,F=()=>{let e=P.clientWidth,t=P.clientHeight;b.setSize(e,t,!1);let n=e/t;j.uAspect.value=n,j.uScale.value.set(n>1?1:n,n>1?1/n:1),I=!0},I=!0,L=new i(.35,.62),R=-1e9,z=!0,B=0,V=performance.now(),H=-1e9,U=()=>H=performance.now();addEventListener(`scroll`,U,{passive:!0});let W=e=>{if(B=requestAnimationFrame(W),!z||e-H<160)return;if(y.animate&&e-R>2e3){let t=(e-V)/1e3;L.set(.5+Math.sin(t*.35)*.3,.55+Math.sin(t*.23+1.3)*.28)}let t=j.uLight.value,n=L.x-t.x,r=L.y-t.y;Math.abs(n)+Math.abs(r)>5e-4&&(t.x+=n*.08,t.y+=r*.08,I=!0),I&&=(b.render(S,C),!1)},G=e=>{let t=v.getBoundingClientRect();L.set((e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height),R=performance.now()};P.addEventListener(`pointermove`,G),P.addEventListener(`pointerdown`,G);let K=new IntersectionObserver(e=>z=e[0].isIntersecting,{rootMargin:`10% 0px`});K.observe(P);let q=new ResizeObserver(F);q.observe(P),F();try{await b.compileAsync(S,C)}catch{}A!==D&&b.initTexture(A),await new Promise(e=>setTimeout(e,0));let J=e=>new Promise(t=>{let n=[],r=i=>{j.uLight.value.set(.3+n.length%10*.04,.6),b.render(S,C),n.push(i),n.length<=e?requestAnimationFrame(r):t(1e3/((n[n.length-1]-n[1])/(n.length-2)))};requestAnimationFrame(r)}),Y=await J(30);for(let e of[1.5,1]){if(Y>=52||devicePixelRatio<=e)break;b.setPixelRatio(Math.min(devicePixelRatio,e)),F(),Y=await J(24)}if(v.dataset.fps=String(Math.round(Y)),v.dataset.dpr=String(b.getPixelRatio()),Y<40)return K.disconnect(),q.disconnect(),P.removeEventListener(`pointermove`,G),P.removeEventListener(`pointerdown`,G),removeEventListener(`scroll`,U),T.forEach(e=>e.dispose()),M.dispose(),N.geometry.dispose(),b.dispose(),null;j.uLight.value.set(.35,.62),b.render(S,C),B=requestAnimationFrame(W);let X=0;return{swap:async(e,t)=>{let n=e?await E(e):D;if(j.uMix.value>.5&&(j.uA.value=j.uB.value,j.uColA.value=j.uColB.value,j.uTexA.value=j.uTexB.value,j.uSurfA.value=j.uSurfB.value),j.uB.value=n,j.uColB.value=k(t),j.uTexB.value=+!!e,j.uSurfB.value=O(e||t),cancelAnimationFrame(X),!y.animate){j.uMix.value=1,I=!0;return}let r=performance.now();j.uMix.value=0;let i=e=>{let t=Math.min(1,(e-r)/900);j.uMix.value=1-(1-t)**3,I=!0,t<1&&(X=requestAnimationFrame(i))};X=requestAnimationFrame(i)},dispose:()=>{cancelAnimationFrame(B),cancelAnimationFrame(X),K.disconnect(),q.disconnect(),P.removeEventListener(`pointermove`,G),P.removeEventListener(`pointerdown`,G),removeEventListener(`scroll`,U),T.forEach(e=>e.dispose()),M.dispose(),N.geometry.dispose(),b.dispose()}}}export{v as createMaterial};