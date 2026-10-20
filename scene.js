import * as THREE from './vendor/three.module.js';
const stage = document.querySelector('#stage');
const canvas = document.querySelector('#sculpture');
const toggle = document.querySelector('#motion-toggle');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.set(0, .3, 12);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xdee4ff, 0x11111d, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 5); key.position.set(-4, 7, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7586ff, 5); rim.position.set(6, 2, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 2); fill.position.set(3, -3, 4); scene.add(fill);
  // A locally generated studio environment keeps the sculpture independent of remote textures.
  const faces = Array.from({length:6}, (_, i) => {
    const face=document.createElement('canvas'); face.width=face.height=128;
    const c=face.getContext('2d'); const grad=c.createLinearGradient(0,0,128,128);
    grad.addColorStop(0, i===2?'#ffffff':'#596073'); grad.addColorStop(.45, '#c8cbd6'); grad.addColorStop(.55,'#272a35'); grad.addColorStop(1,'#141621');
    c.fillStyle=grad;c.fillRect(0,0,128,128); c.fillStyle=i%2?'#ffffff':'#acb4d5'; c.fillRect(18,6,18,112); return face;
  });
  const cube=new THREE.CubeTexture(faces);cube.needsUpdate=true;cube.colorSpace=THREE.SRGBColorSpace;
  const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromCubemap(cube);scene.environment=env.texture;cube.dispose();pmrem.dispose();
  const blue = new THREE.MeshPhysicalMaterial({color:0x1717eb,metalness:.43,roughness:.19,clearcoat:1,clearcoatRoughness:.14});
  const silver = new THREE.MeshPhysicalMaterial({color:0xd1d2df,metalness:.85,roughness:.2,clearcoat:.6});
  const dark = new THREE.MeshPhysicalMaterial({color:0x151620,metalness:.7,roughness:.16,clearcoat:1});
  const group=new THREE.Group();scene.add(group);
  const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.39,160,24,2,3),blue);
  knot.position.set(1.1,.3,.4);knot.rotation.set(.4,-.6,.3);group.add(knot);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.58,.29,24,100),silver);
  ring.position.set(-.65,.7,-.4);ring.rotation.set(.6,1.05,-.5);group.add(ring);
  const black=new THREE.Mesh(new THREE.TorusKnotGeometry(1.2,.38,140,20,2,3),dark);
  black.position.set(3.3,-.1,-.8);black.rotation.set(-.2,.7,-.4);group.add(black);
  const small=new THREE.Mesh(new THREE.TorusGeometry(.83,.29,20,80),silver);
  small.position.set(2,-1.4,1.2);small.rotation.set(1.15,.4,-.3);group.add(small);
  const satellite=new THREE.Mesh(new THREE.IcosahedronGeometry(.5,0),blue);satellite.position.set(-.5,-1.5,.4);satellite.rotation.set(.4,.7,.3);group.add(satellite);
  let paused=motion.matches, visible=true, pageVisible=!document.hidden, raf=0, previous=0, elapsed=0, targetX=0,targetY=0;
  let narrow=false;
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;narrow=w<600;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=narrow?40:36;camera.position.z=narrow?13:12;camera.updateProjectionMatrix();group.scale.setScalar(narrow?.73:1.15);group.position.set(narrow?-.65:.05,narrow?1.25:0,0);render();}
  function render(){renderer.render(scene,camera);}
  function syncToggle(){toggle.hidden=false;toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'播放动态 <span aria-hidden="true">▷</span>':'暂停动态 <span aria-hidden="true">Ⅱ</span>';}
  function animate(time){raf=0;if(paused||!visible||!pageVisible)return;const delta=previous?Math.min((time-previous)/1000,.05):0;previous=time;elapsed+=delta;
    group.rotation.y+=(targetX*.12-group.rotation.y)*.035;group.rotation.x+=(targetY*.06-group.rotation.x)*.035;
    knot.rotation.y=-.6+elapsed*.095;knot.rotation.z=.3+Math.sin(elapsed*.18)*.12;
    ring.rotation.z=-.5+elapsed*.055;black.rotation.x=-.2+elapsed*.06;small.rotation.y=.4+elapsed*.1;
    group.position.y=(narrow?1.25:0)+Math.sin(elapsed*.55)*.07;render();raf=requestAnimationFrame(animate);
  }
  function start(){if(!raf&&!paused&&visible&&pageVisible){previous=0;raf=requestAnimationFrame(animate);}}
  function stop(){cancelAnimationFrame(raf);raf=0;previous=0;}
  toggle.addEventListener('click',()=>{paused=!paused;syncToggle();if(paused)stop();else start();});
  motion.addEventListener('change',e=>{paused=e.matches;syncToggle();if(paused)stop();else start();});
  stage.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();targetX=(e.clientX-r.left)/r.width-.5;targetY=(e.clientY-r.top)/r.height-.5;});
  stage.addEventListener('pointerleave',()=>{targetX=targetY=0;});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:0});observer.observe(stage);
  document.addEventListener('visibilitychange',()=>{pageVisible=!document.hidden;if(pageVisible)start();else stop();});
  canvas.addEventListener('webglcontextlost', e=>{e.preventDefault();stop();stage.classList.remove('scene-ready');toggle.hidden=true;});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  new ResizeObserver(resize).observe(stage);resize();syncToggle();stage.classList.add('scene-ready');start();
} catch(error) {
  renderer?.dispose();canvas.hidden=true;toggle.hidden=true;
  console.warn('3D unavailable; displaying the static composition.');
}
