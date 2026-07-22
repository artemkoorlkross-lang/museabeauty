const menuButton=document.querySelector('.menu-trigger');
const menu=document.querySelector('.menu-overlay');
const topButton=document.querySelector('.to-top');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

let closeFallback;
let lockedScrollY=0;
let pendingHash='';

function lockMenuScroll(){
  if(document.body.classList.contains('menu-open'))return;
  lockedScrollY=window.scrollY;
  const root=document.documentElement;
  const scrollbarWidth=Math.max(0,window.innerWidth-root.clientWidth);
  const widthBefore=root.clientWidth;
  document.body.classList.add('menu-open');
  const widthAfter=root.clientWidth;
  const compensation=Math.min(scrollbarWidth,Math.max(0,widthAfter-widthBefore));
  document.body.style.paddingRight=compensation?`${compensation}px`:'';
  root.style.setProperty('--scrollbar-compensation',`${compensation}px`);
}

function unlockMenuScroll(){
  document.body.classList.remove('menu-open');
  document.body.style.paddingRight='';
  document.documentElement.style.removeProperty('--scrollbar-compensation');
  window.scrollTo(0,lockedScrollY);
}

function finishMenuClose(){
  if(!menu.classList.contains('is-closing'))return;
  clearTimeout(closeFallback);
  menu.classList.remove('is-closing');
  unlockMenuScroll();
  menuButton.focus({preventScroll:true});
  if(pendingHash){
    const target=document.querySelector(pendingHash);
    if(target){target.scrollIntoView({behavior:reducedMotion?'auto':'smooth'});history.replaceState(null,'',pendingHash)}
    pendingHash='';
  }
}

function openMenu(){
  clearTimeout(closeFallback);pendingHash='';lockMenuScroll();
  menu.classList.remove('is-closing');
  requestAnimationFrame(()=>menu.classList.add('is-open'));
  menuButton.classList.add('active');menuButton.setAttribute('aria-expanded','true');
  menuButton.querySelector('span').textContent='ZAMKNIJ';menu.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>{if(menu.classList.contains('is-open'))menu.querySelector('a').focus()});
}

function closeMenu(){
  if(!menu.classList.contains('is-open'))return;
  menu.classList.remove('is-open');menu.classList.add('is-closing');
  menuButton.classList.remove('active');menuButton.setAttribute('aria-expanded','false');
  menuButton.querySelector('span').textContent='MENU';menu.setAttribute('aria-hidden','true');
  clearTimeout(closeFallback);closeFallback=setTimeout(finishMenuClose,750);
}

function toggleMenu(){menu.classList.contains('is-open')?closeMenu():openMenu()}
menuButton.addEventListener('click',toggleMenu);
menu.addEventListener('transitionend',event=>{if(event.target===menu&&(event.propertyName==='transform'||event.propertyName==='opacity'))finishMenuClose()});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();pendingHash=a.hash;closeMenu()}));
addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('is-open'))closeMenu()});
addEventListener('scroll',()=>topButton.classList.toggle('show',scrollY>innerHeight),{passive:true});

const services=[
 {name:'Paznokcie',word:'NAILS',color:'#efb69f',image:'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=88',alt:'Pastelowy manicure — usługa paznokci',desc:'Kolor, forma i detal dopasowane do Twojego stylu — od czystego minimalizmu po subtelny nail art.',items:[['Manicure hybrydowy','60 min · 110 zł'],['Przedłużanie paznokci','120 min · 170 zł'],['Uzupełnienie żelowe','90 min · 140 zł']]},
 {name:'Rzęsy',word:'LASHES',color:'#c9bee9',image:'assets/images/musea-editorial.png',alt:'Naturalna stylizacja rzęs',desc:'Lekkość zamiast ciężaru. Podkreślamy oko, zachowując naturalny ruch i proporcje.',items:[['Lifting rzęs','75 min · 150 zł'],['Przedłużanie rzęs','120 min · od 180 zł']]},
 {name:'Brwi',word:'BROWS',color:'#bfd0b9',image:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=88',alt:'Naturalna stylizacja brwi',desc:'Kształt wyprowadzony z Twoich rysów twarzy. Miękko, symetrycznie, bez przerysowania.',items:[['Laminacja brwi','60 min · 130 zł'],['Regulacja i henna','45 min · 80 zł']]},
 {name:'Makijaż',word:'MAKEUP',color:'#e9c5ce',image:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=88',alt:'Świeży makijaż okolicznościowy',desc:'Makijaż, który dobrze wygląda w świetle dziennym, na zdjęciach i przede wszystkim — na Tobie.',items:[['Makijaż okolicznościowy','90 min · 200 zł']]},
 {name:'Twarz',word:'SKIN',color:'#d9e791',image:'assets/images/musea-editorial.png',alt:'Pielęgnacja skóry twarzy',desc:'Świadoma pielęgnacja oparta na aktualnych potrzebach skóry, komforcie i odbudowie bariery.',items:[['Zabieg nawilżający','75 min · 220 zł'],['Oczyszczanie twarzy','90 min · 250 zł']]}
];
const serviceStage=document.querySelector('.service-stage'),serviceImage=document.querySelector('.service-visual img'),serviceWord=document.querySelector('.service-word'),serviceDetail=document.querySelector('.service-detail');
function selectService(index){
 const s=services[index];
 document.querySelectorAll('[data-service]').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-selected',String(i===index))});
 serviceStage.style.background=s.color;serviceWord.textContent=s.word;
 serviceDetail.innerHTML=`<span class="service-count">${String(index+1).padStart(2,'0')} / 05</span><h3>${s.name}</h3><p>${s.desc}</p><dl>${s.items.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl><a href="#rezerwacja">WYBIERAM TĘ USŁUGĘ ↗</a>`;
 serviceImage.parentElement.classList.add('changing');setTimeout(()=>{serviceImage.src=s.image;serviceImage.alt=s.alt;serviceImage.parentElement.classList.remove('changing')},220);
}
document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>selectService(Number(b.dataset.service))));

const lookTrack=document.querySelector('.look-track'),looks=[...document.querySelectorAll('.look')],lookProgress=document.querySelector('.look-progress i');let lookIndex=0,dragStart=0,dragX=0,dragging=false;
function showLook(index){lookIndex=(index+looks.length)%looks.length;lookTrack.classList.remove('no-transition');lookTrack.style.transform=`translateX(-${lookIndex*100}%)`;looks.forEach((l,i)=>l.classList.toggle('active',i===lookIndex));lookProgress.style.width=`${(lookIndex+1)/looks.length*100}%`}
document.querySelector('[data-look-prev]').onclick=()=>showLook(lookIndex-1);document.querySelector('[data-look-next]').onclick=()=>showLook(lookIndex+1);
const viewport=document.querySelector('.look-viewport');viewport.addEventListener('pointerdown',e=>{dragging=true;dragStart=e.clientX;dragX=0;viewport.classList.add('dragging');viewport.setPointerCapture(e.pointerId);lookTrack.classList.add('no-transition')});viewport.addEventListener('pointermove',e=>{if(!dragging)return;dragX=e.clientX-dragStart;lookTrack.style.transform=`translateX(calc(-${lookIndex*100}% + ${dragX}px))`});function endDrag(){if(!dragging)return;dragging=false;viewport.classList.remove('dragging');Math.abs(dragX)>60?showLook(lookIndex+(dragX<0?1:-1)):showLook(lookIndex)}viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);

const artists=[
 {first:'Natalia',last:'Lis',role:'STYLISTKA PAZNOKCI',photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1100&q=88',color:'#bfd0b9',text:'Minimalistyczne zdobienia, idealna linia światła i kolor dobrany do Ciebie, nie do algorytmu.'},
 {first:'Julia',last:'Wysocka',role:'STYLISTKA RZĘS',photo:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=88',color:'#c9bee9',text:'Lekkie stylizacje otwierające spojrzenie. Jej znak rozpoznawczy to efekt, którego nie trzeba tłumaczyć.'},
 {first:'Maja',last:'Pawlak',role:'BROW ARTIST',photo:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1100&q=88',color:'#efb69f',text:'Czyta architekturę twarzy i wydobywa naturalny kierunek brwi. Precyzyjna, spokojna, bez szablonów.'},
 {first:'Zofia',last:'Król',role:'KOSMETOLOG',photo:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=88',color:'#d9e791',text:'Łączy wiedzę o skórze z uważnością. Układa pielęgnację, która działa również poza gabinetem.'}
];let artistIndex=0;const artistStage=document.querySelector('.artist-stage'),artistImg=artistStage.querySelector('figure img'),artistSurname=document.querySelector('.artist-surname'),artistCard=artistStage.querySelector('article');function showArtist(index){artistIndex=(index+artists.length)%artists.length;const a=artists[artistIndex];artistImg.style.opacity=0;setTimeout(()=>{artistImg.src=a.photo;artistImg.alt=`${a.first} ${a.last}, ${a.role.toLowerCase()}`;artistImg.style.opacity=1},180);artistStage.style.background=a.color;artistSurname.textContent=a.last.toUpperCase();artistCard.innerHTML=`<span>${String(artistIndex+1).padStart(2,'0')} / 04</span><p>${a.role}</p><h3>${a.first}<br>${a.last}</h3><blockquote>${a.text}</blockquote><a href="#rezerwacja">UMÓW WIZYTĘ ↗</a>`}document.querySelector('[data-artist-prev]').onclick=()=>showArtist(artistIndex-1);document.querySelector('[data-artist-next]').onclick=()=>showArtist(artistIndex+1);

const reviews=[...document.querySelectorAll('.review-slider blockquote')],reviewBar=document.querySelector('.review-controls i');let reviewIndex=0;function showReview(index){reviewIndex=(index+reviews.length)%reviews.length;reviews.forEach((r,i)=>r.classList.toggle('active',i===reviewIndex));reviewBar.style.width=`${(reviewIndex+1)/reviews.length*100}%`}document.querySelector('[data-review-prev]').onclick=()=>showReview(reviewIndex-1);document.querySelector('[data-review-next]').onclick=()=>showReview(reviewIndex+1);

const form=document.querySelector('.step-form'),steps=[...form.querySelectorAll('.form-step')],progressNumbers=[...form.querySelectorAll('.step-progress>span')],progressBar=form.querySelector('.step-progress i b'),back=form.querySelector('.back'),forward=form.querySelector('.forward'),submit=form.querySelector('.submit'),stepText=form.querySelector('.form-nav span b'),dateInput=form.querySelector('[type=date]');let step=0;dateInput.min=new Date().toISOString().slice(0,10);
function validateStep(){const fields=[...steps[step].querySelectorAll('[required]')];for(const field of fields){if(!field.checkValidity()){field.reportValidity();return false}}return true}
function renderStep(){steps.forEach((s,i)=>s.classList.toggle('active',i===step));progressNumbers.forEach((n,i)=>n.classList.toggle('active',i<=step));progressBar.style.width=`${step/3*100}%`;back.disabled=step===0;forward.style.display=step===3?'none':'';submit.style.display=step===3?'block':'none';stepText.textContent=step+1;steps[step].querySelector('legend').focus?.()}
forward.onclick=()=>{if(validateStep()){step=Math.min(3,step+1);renderStep()}};back.onclick=()=>{step=Math.max(0,step-1);renderStep()};form.addEventListener('submit',e=>{e.preventDefault();if(!validateStep())return;form.reset();step=0;renderStep();const toast=document.querySelector('.toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4800)});

if(!reducedMotion){const orbit=document.querySelector('.orbit');addEventListener('pointermove',e=>{orbit.style.translate=`${(e.clientX/innerWidth-.5)*7}px ${(e.clientY/innerHeight-.5)*7}px`},{passive:true})}
