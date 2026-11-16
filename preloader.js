(() => {
  'use strict';
  const root = document.documentElement;
  const el = document.getElementById('preloader');
  if (!el) return;
  if (!root.classList.contains('is-preloading')) {
    el.remove();
    window.dispatchEvent(new Event('site:ready'));
    return;
  }

  const tilesWrap = el.querySelector('.pl-tiles');
  const hexWrap = el.querySelector('.pl-hex');
  const cracksSvg = el.querySelector('.pl-cracks');
  const logEl = el.querySelector('.pl-log');
  const barFill = el.querySelector('.pl-bar span');
  const skipBtn = el.querySelector('.pl-skip');
  const portrait = el.querySelector('.pl-portrait');
  const COLS = 12, ROWS = 7, NS = 'http://www.w3.org/2000/svg';
  let done = false, hexTimer = null, sequenceTimer = null;
  const sleep = (ms) => new Promise(resolve => {
    sequenceTimer = setTimeout(resolve, ms);
  });

  // Build true image-slice tiles: every tile owns the matching crop of the portrait.
  const tiles = [];
  for (let i=0;i<COLS*ROWS;i++) {
    const col=i%COLS, row=Math.floor(i/COLS);
    const tile=document.createElement('i');
    tile.className='pl-tile';
    // Zoom the boot portrait out to 86%, keeping the sliced tiles aligned.
    const zoom=0.86;
    const x=COLS===1?50:((col-(COLS*(1-zoom)/2))/(COLS*zoom-1))*100;
    const y=ROWS===1?50:((row-(ROWS*(1-zoom)/2))/(ROWS*zoom-1))*100;
    tile.style.backgroundPosition='center, '+x.toFixed(2)+'% '+y.toFixed(2)+'%';
    tilesWrap.appendChild(tile);
    tiles.push(tile);
  }

  // Draw a controlled glass fracture from a single impact point.
  const path=(points)=>points.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const addCrack=(d,width,delay)=>{
    const p=document.createElementNS(NS,'path');
    p.setAttribute('d',d);p.setAttribute('pathLength','1');p.setAttribute('class','crack');
    p.setAttribute('stroke-width',width);p.style.setProperty('--d',delay+'s');cracksSvg.appendChild(p);
  };
  const cx=500,cy=312;
  for(let i=0;i<18;i++){
    const a=(i/18)*Math.PI*2, len=260+(i%4)*65, pts=[[cx,cy]];
    for(let s=1;s<=6;s++){
      const r=len*s/6, bend=Math.sin(i*7+s*2)*9;
      pts.push([cx+Math.cos(a)*r+Math.cos(a+Math.PI/2)*bend,cy+Math.sin(a)*r+Math.sin(a+Math.PI/2)*bend]);
    }
    addCrack(path(pts),i%3===0?1.8:1.1,i*.025);
    if(i%2===0){const q=pts[3];addCrack(path([q,[q[0]+Math.cos(a+.55)*75,q[1]+Math.sin(a+.55)*75],[q[0]+Math.cos(a+.55)*125,q[1]+Math.sin(a+.55)*125]]),.8,.18+i*.02);}
  }

  const setStatus=(message)=>{logEl.textContent=message;};
  const hexLine=()=>Array.from({length:28},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const startHex=()=>{hexTimer=setInterval(()=>{hexWrap.textContent=Array.from({length:10},hexLine).join('\n');},75);};
  const stopHex=()=>{clearInterval(hexTimer);hexWrap.textContent='0x49 0x44 0x45 0x4e 0x54 0x49 0x54 0x59\nDECODING PORTRAIT BUFFER...';};

  const finish=()=>{
    if(done)return;
    done=true;clearTimeout(sequenceTimer);stopHex();
    tiles.forEach(t=>t.classList.add('is-fixed'));
    barFill.style.width='100%';
    el.classList.remove('is-repair');el.classList.add('is-healed','is-exit');
    el.style.transition='opacity .55s ease .3s';el.style.opacity='0';
    setTimeout(()=>{
      root.classList.remove('is-preloading');el.remove();
      window.dispatchEvent(new Event('site:ready'));
    },900);
  };

  const run=async()=>{
    if(done)return;
    el.classList.add('is-boot');
    setStatus('DISPLAY ONLINE  /  GLASS FRACTURE DETECTED');
    await sleep(650);if(done)return;
    el.classList.add('is-crack');
    setStatus('RECOVERING IMAGE BUFFER  /  VERIFYING IDENTITY');
    await sleep(450);if(done)return;
    el.classList.add('is-repair');startHex();
    const order=tiles.map((_,i)=>i);
    // Centre-out reconstruction makes the face recognizable early.
    const centreX=(COLS-1)/2, centreY=(ROWS-1)/2;
    order.sort((a,b)=>{
      const da=Math.hypot((a%COLS)-centreX,Math.floor(a/COLS)-centreY);
      const db=Math.hypot((b%COLS)-centreX,Math.floor(b/COLS)-centreY);
      return da-db;
    });
    setStatus('DECODING HEX  /  RECONSTRUCTING PORTRAIT');
    for(let n=0;n<order.length;n+=3){
      if(done)return;
      for(let k=n;k<Math.min(n+3,order.length);k++){
        const tile=tiles[order[k]];
        tile.classList.add('is-flash');
        setTimeout(()=>{tile.classList.remove('is-flash');tile.classList.add('is-fixed');},190);
      }
      barFill.style.width=((Math.min(n+3,order.length)/order.length)*100)+'%';
      await sleep(48);
    }
    if(done)return;
    stopHex();el.classList.remove('is-repair');el.classList.add('is-healed');
    setStatus('IDENTITY VERIFIED  /  WELCOME, SUDHAKAR');
    await sleep(1050);if(!done)finish();
  };

  const start=()=>{
    if(done)return;
    if(portrait && portrait.decode) portrait.decode().catch(()=>{}).then(run);
    else run();
  };
  skipBtn.addEventListener('click',finish);
  window.addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
  start();
})();