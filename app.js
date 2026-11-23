(function(){
'use strict';
var PAGE=24, WA='https://wa.me/5575998028600?text=';
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(id){return document.getElementById(id);};
var all=[], shown=[], pos=0;
var $q=$('q'), $cat=$('cat'), $g=$('grid'), $c=$('cnt'), $m=$('more');

var yr=$('ano'); if(yr)yr.textContent=new Date().getFullYear();

/* ---------- utilidades ---------- */
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- transicao entre paginas ---------- */
window.addEventListener('pageshow',function(){document.body.classList.remove('leaving');});
document.addEventListener('click',function(e){
  if(RM||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
  var a=e.target.closest&&e.target.closest('a[href]');
  if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:)/i.test(h))return;
  if(a.pathname===location.pathname&&a.search===location.search)return;
  e.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(function(){location.href=a.href;},260);
});

/* ---------- topo: encolhe ao rolar ---------- */
var hd=$('hd'), ticking=false;
function onScroll(){hd.classList.toggle('sc',window.scrollY>30);ticking=false;}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
onScroll();

/* ---------- menu hamburguer ---------- */
var burger=$('burger'), nav=$('nav');
function menu(open){
  nav.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',open?'true':'false');
  burger.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
}
burger.addEventListener('click',function(){menu(!nav.classList.contains('open'));});
nav.addEventListener('click',function(e){if(e.target.closest('a'))menu(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false);});

/* ---------- bolhas ---------- */
document.querySelectorAll('.bubbles').forEach(function(box){
  var h='';
  for(var i=0;i<14;i++){
    var s=10+((i*37)%46), l=(i*53+7)%96, d=9+((i*29)%12), dl=-((i*41)%14);
    h+='<i style="width:'+s+'px;height:'+s+'px;left:'+l+'%;animation-duration:'+d+'s;animation-delay:'+dl+'s"></i>';
  }
  box.innerHTML=h;
});

/* ---------- slideshow do hero ---------- */
var hero=$('hero');
if(hero){
  var slides=Array.prototype.slice.call(document.querySelectorAll('.slide')),
      dotsBox=$('dots'), cur=0, timer=null, DUR=6500, paused=false;
  slides.forEach(function(s,i){
    var b=document.createElement('button');
    b.type='button'; b.className='dot'+(i===0?' on':'');
    b.setAttribute('aria-label','Ir para o slide '+(i+1));
    b.addEventListener('click',function(){go(i);});
    dotsBox.appendChild(b);
  });
  var dots=Array.prototype.slice.call(dotsBox.children);
  var restartProgress=function(){hero.classList.remove('run');void hero.offsetWidth;if(!RM)hero.classList.add('run');};
  var schedule=function(){
    clearTimeout(timer);
    if(RM)return;
    hero.style.setProperty('--dur',DUR+'ms');
    restartProgress();
    timer=setTimeout(function(){go(cur+1);},DUR);
  };
  var go=function(n){
    n=(n+slides.length)%slides.length;
    slides[cur].classList.remove('on');slides[cur].setAttribute('aria-hidden','true');
    dots[cur].classList.remove('on');
    cur=n;
    slides[cur].classList.add('on');slides[cur].removeAttribute('aria-hidden');
    dots[cur].classList.add('on');
    if(!paused)schedule();
  };
  var pause=function(){paused=true;clearTimeout(timer);hero.classList.add('paused');};
  var resume=function(){paused=false;hero.classList.remove('paused');schedule();};
  hero.addEventListener('mouseenter',pause);
  hero.addEventListener('mouseleave',resume);
  hero.addEventListener('focusin',pause);
  hero.addEventListener('focusout',resume);
  document.addEventListener('visibilitychange',function(){if(document.hidden)pause();else if(!hero.matches(':hover'))resume();});
  $('prev').addEventListener('click',function(){go(cur-1);});
  $('next').addEventListener('click',function(){go(cur+1);});
  hero.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')go(cur-1);else if(e.key==='ArrowRight')go(cur+1);
  });
  var tx0=null,ty0=0;
  $('slides').addEventListener('touchstart',function(e){tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;pause();},{passive:true});
  $('slides').addEventListener('touchend',function(e){
    if(tx0===null)return;
    var dx=e.changedTouches[0].clientX-tx0, dy=e.changedTouches[0].clientY-ty0;
    tx0=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){go(dx<0?cur+1:cur-1);}
    setTimeout(resume,1500);
  },{passive:true});
  schedule();
}

/* ---------- revelar ao rolar ---------- */
var io=null;
if('IntersectionObserver' in window){
  io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){var t=e.target;t.classList.add('in');io.unobserve(t);setTimeout(function(){t.classList.add('done');},1800);}
    });
  },{threshold:.15,rootMargin:'0px 0px -6% 0px'});
}
function reveal(list){
  Array.prototype.forEach.call(list,function(el){
    if(io)io.observe(el);else el.classList.add('in');
  });
}
reveal(document.querySelectorAll('.rv'));
var tl=$('tl');
if(tl){if(io)io.observe(tl);else tl.classList.add('in');}

/* ---------- contadores ---------- */
function count(el){
  var to=parseInt(el.getAttribute('data-count'),10), t0=null, D=1500;
  var pre=el.getAttribute('data-prefix')||'';
  function fmt(v){return pre+v.toLocaleString('pt-BR');}
  if(RM||!to){el.textContent=fmt(to);return;}
  function step(t){
    if(t0===null)t0=t;
    var p=Math.min((t-t0)/D,1), v=1-Math.pow(1-p,3);
    el.textContent=fmt(Math.round(to*v));
    if(p<1)requestAnimationFrame(step);
  }
  el.textContent=fmt(0);
  requestAnimationFrame(step);
}
var cio=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target);}});
},{threshold:.6}):null;
document.querySelectorAll('[data-count]').forEach(function(el){if(cio)cio.observe(el);});

/* ---------- catalogo ---------- */
var ICONS={
  'Cuidado com as roupas':'🧺',
  'Perfume de ambiente e banheiro':'🌸',
  'Limpeza de pisos e ambientes':'🧹',
  'Cozinha e louça':'🍽️',
  'Utensílios':'🪣',
  'Descartáveis e papel':'🧻',
  'Velas':'🕯️',
  'Higiene pessoal':'🧼',
  'Álcool, antissépticos e EPI':'🧪',
  'Piscinas':'🏊',
  'Linha profissional e industrial':'🏭',
  'Pet':'🐾'
};
var FAMOUS=['Ypê','Omo','Downy','Veja','Scotch-Brite','Vanish','Cif','Glade','Pinho Sol','Ariel','Comfort','Bombril','Mr Músculo','Lysoform','Ajax','Assolan','Qboa','Pato'];
var LOGOS={"Candeias":"candeias.png","Risqué":"risque.png","Teiú":"teiu.png","Maran":"maran.png","Ypê":"ype.png","Absoluto":"absoluto.png","Alkin":"alklin.png","Amacitel":"amacitel.png","Ariel":"ariel.png","Assolan":"assolan.png","Atol":"atol.png","Bem-te-vi":"bem-te-vi.png","Brilhante":"brilhante.png","Bombril":"bombril.svg","Bulnez":"bulnez.png","Cif":"cif.png","Clorito":"clorito.png","Coala":"coala.png","Comfort":"comfort.png","Coquel":"coquel.png","Downy":"downy.png","Dragão":"dragao.png","Esfrelux":"esfrelux.png","Fofo":"fofo.png","Glade":"glade.png","Guarani":"guarani.png","Ingleza":"ingleza.png","Invicto":"invicto.png","King":"king.png","Leve Brisa":"levebrisa.png","Limpol":"limpol.png","Limppano":"limppano.png","Lysoform":"lysoform.png","Mon Bijou":"monbijou.png","Mr Músculo":"mr-musculo.png","Naft":"naft.png","Omo":"omo.png","Pura Magia":"pura-magia.png","Qboa":"qboa.png","Sonho":"sonho.png","Tixan":"tixan.png","Uau":"uau.png","Pato":"pato.png","Pinho Bril":"pinhobril.png","Pinho Sol":"pinho-sol.png","Puro Ar":"puroar.png","Radium":"radium.png","Scotch-Brite":"scotch-brite.svg","Secar":"secar.png","Urca":"urca.png","Vanish":"vanish.png","Veja":"veja.png","Vida Macia":"vida-macia.png","Asseptgel":"asseptgel.png","Aquapool":"aquapool.png","Galeno":"galeno.png","Start":"start.png","Gelalcool":"gelalcool.png","Indy Cryl":"indy-cryl.png","Indy":"indy.png","Maximoom":"maximoom.png","Only":"only.png","Pedrex":"pedrex.png","StartPro":"startpro.png","Tuff":"tuff.png","Vorel":"vorel.png","Free Pet":"free-pet.png","Casa & Perfume":"casa-e-perfume.png"};
var FEAT=['1217','1268','1129','1356','1316','1351','1197','1236','1312','1149','1213','1260'];
function card(p,i){
  var msg=encodeURIComponent('Olá! Quero o produto '+p.n+' (cód. '+p.c+')');
  var im=p.f?'<img src="img/p/'+esc(p.c)+'.jpg" alt="'+esc(p.n)+'" loading="lazy" decoding="async" width="300" height="300">':'<span class="nf" aria-hidden="true">&#129524;</span>';
  return '<article class="p" style="--i:'+i+'"><div class="im">'+im+'</div><div class="bd"><h3>'+esc(p.n)+'</h3><small>'+esc(p.m)+' &middot; '+esc(p.e)+'</small>'+
    '<a class="btn sm" href="'+WA+msg+'" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#wa"/></svg>Pedir no WhatsApp</a></div></article>';
}
function imgsLoaded(){
  Array.prototype.forEach.call(document.querySelectorAll('#grid img:not(.ld),#fgrid img:not(.ld)'),function(im){
    if(im.complete&&im.naturalWidth)im.classList.add('ld');
  });
}
[$g,$('fgrid')].forEach(function(box){
  if(!box)return;
  box.addEventListener('load',function(e){if(e.target.tagName==='IMG')e.target.classList.add('ld');},true);
  box.addEventListener('error',function(e){if(e.target.tagName==='IMG')e.target.classList.add('ld');},true);
});
function more(){
  var end=Math.min(pos+PAGE,shown.length), h='';
  for(var i=pos;i<end;i++)h+=card(shown[i],i-pos);
  $g.insertAdjacentHTML('beforeend',h); pos=end;
  $m.hidden=pos>=shown.length;
  imgsLoaded();
}
/* marcas famosas primeiro, intercaladas (uma de cada marca por rodada) */
function famousFirst(list){
  var by={}, rest=[];
  list.forEach(function(p){
    if(FAMOUS.indexOf(p.m)>-1){(by[p.m]=by[p.m]||[]).push(p);}else rest.push(p);
  });
  var out=[], more=true, i=0;
  while(more){
    more=false;
    FAMOUS.forEach(function(b){if(by[b]&&by[b][i]){out.push(by[b][i]);more=true;}});
    i++;
  }
  return out.concat(rest);
}
function render(){
  var t=norm($q.value.trim()), k=$cat.value;
  shown=all.filter(function(p){return (!k||p.k===k)&&(!t||p._s.indexOf(t)>-1);});
  if(!t)shown=famousFirst(shown);
  $g.innerHTML=''; pos=0;
  $c.textContent=shown.length?shown.length+(shown.length===1?' produto encontrado':' produtos encontrados'):'';
  if(!shown.length){
    $g.innerHTML='<p class="empty" style="grid-column:1/-1">Não achou? Chame no WhatsApp: trabalhamos com muito mais itens sob encomenda.</p>';
    $m.hidden=true;return;
  }
  more();
}
var swap=null;
function apply(){
  if(RM||!$g.children.length){render();return;}
  clearTimeout(swap);
  $g.classList.add('out');
  swap=setTimeout(function(){render();$g.classList.remove('out');},200);
}
if($g){
  $m.addEventListener('click',more);
  var tm; $q.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(apply,200);});
  $cat.addEventListener('change',apply);
}

/* categorias (carrossel), destaques e marcas (faixa rolante) */
function buildCats(){
  var box=$('cats'); if(!box)return;
  var counts={}, order=[];
  all.forEach(function(p){if(!counts[p.k]){counts[p.k]=0;order.push(p.k);}counts[p.k]++;});
  order.sort(function(a,b){return counts[b]-counts[a];});
  box.innerHTML=order.map(function(k){
    return '<a class="cat" href="catalogo.html?cat='+encodeURIComponent(k)+'"><span class="ci" aria-hidden="true">'+(ICONS[k]||'🧽')+'</span><b>'+esc(k)+'</b><small>'+counts[k]+' itens</small></a>';
  }).join('');
  var view=$('cview'), dotsEl=$('cdots'), cards=Array.prototype.slice.call(box.children);
  var idx=0, per=5, max=0, timer=null, hov=false;
  function calc(){
    var w=window.innerWidth;
    per=w>=1000?5:(w>=700?3:2);
    box.style.setProperty('--n',per);
    max=Math.max(0,cards.length-per);
    if(idx>max)idx=max;
    dotsEl.innerHTML='';
    for(var i=0;i<=max;i++){
      var d=document.createElement('button');d.type='button';d.className='cdot'+(i===idx?' on':'');
      d.setAttribute('aria-label','Mostrar categorias a partir da '+(i+1));
      (function(n){d.addEventListener('click',function(){show(n,true);});})(i);
      dotsEl.appendChild(d);
    }
    show(idx,false);
  }
  function show(n,user){
    idx=n;
    var step=cards[0].offsetWidth+16;
    box.style.transform='translateX('+(-idx*step)+'px)';
    Array.prototype.forEach.call(dotsEl.children,function(d,i){d.classList.toggle('on',i===idx);});
    if(user)start();
  }
  function next(){show(idx>=max?0:idx+1,false);}
  function start(){clearTimeout(timer);if(RM||hov)return;timer=setTimeout(function(){next();start();},3000);}
  $('cprev').addEventListener('click',function(){show(idx<=0?max:idx-1,true);});
  $('cnext').addEventListener('click',function(){show(idx>=max?0:idx+1,true);});
  var sec=$('categorias');
  sec.addEventListener('mouseenter',function(){hov=true;clearTimeout(timer);});
  sec.addEventListener('mouseleave',function(){hov=false;start();});
  sec.addEventListener('focusin',function(){hov=true;clearTimeout(timer);});
  sec.addEventListener('focusout',function(){hov=false;start();});
  view.addEventListener('scroll',function(){view.scrollLeft=0;});
  var sx=null;
  view.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;hov=true;clearTimeout(timer);},{passive:true});
  view.addEventListener('touchend',function(e){
    if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;
    if(Math.abs(dx)>40)show(dx<0?(idx>=max?0:idx+1):(idx<=0?max:idx-1),false);
    hov=false;start();
  },{passive:true});
  window.addEventListener('resize',calc);
  calc();start();
}
function buildFeat(){
  var fg=$('fgrid'); if(!fg)return;
  var h='';
  FEAT.forEach(function(c,i){
    var p=all.filter(function(x){return x.c===c;})[0];
    if(p&&p.f)h+=card(p,i);
  });
  fg.innerHTML=h; imgsLoaded();
}
function buildBrands(){
  var tr=$('track'); if(!tr)return;
  var n={}; all.forEach(function(p){if(p.m&&LOGOS[p.m])n[p.m]=(n[p.m]||0)+1;});
  var fam=FAMOUS.filter(function(b){return n[b];});
  var rest=Object.keys(n).filter(function(b){return FAMOUS.indexOf(b)<0;}).sort(function(a,b){return n[b]-n[a]||a.localeCompare(b,'pt');});
  var total=fam.length+rest.length, half=Math.ceil(total/2);
  var take=Math.max(0,half-fam.length);
  var row1=fam.concat(rest.slice(0,take)), row2=rest.slice(take);
  function html(list,d){
    return list.map(function(b){
      return '<span class="lg'+(d?' dup':'')+'"><img src="img/marcas/'+LOGOS[b]+'" alt="'+esc(b)+'" loading="lazy" decoding="async"></span>';
    }).join('');
  }
  function fill(el,list,speed){
    el.innerHTML=html(list,false)+html(list,true);
    /* velocidade constante e suave */
    var w=el.scrollWidth/2;
    el.style.animationDuration=Math.max(60,Math.round(w/speed))+'s';
  }
  fill(tr,row1,80);
  var t2=$('track2'); if(t2)fill(t2,row2,68);
}
function init(d){
  all=d; var c={};
  all.forEach(function(p){p._s=norm(p.n+' '+p.m+' '+p.k);c[p.k]=1;});
  if($cat){
    Object.keys(c).sort(function(a,b){return a.localeCompare(b,'pt');}).forEach(function(k){
      var o=document.createElement('option');o.value=k;o.textContent=k;$cat.appendChild(o);});
    try{
      var sp=new URLSearchParams(location.search), k=sp.get('cat'), qq=sp.get('q');
      if(k&&c[k])$cat.value=k;
      if(qq)$q.value=qq;
    }catch(e){}
  }
  buildCats(); buildBrands(); buildFeat();
  if($g)render();
}
if($g||$('cats')||$('fgrid')||$('track')){
  if(window.PRODUTOS&&window.PRODUTOS.length){init(window.PRODUTOS);}
  else{
    fetch('produtos.json').then(function(r){return r.json();}).then(init).catch(function(){
      if($c)$c.innerHTML='Não foi possível carregar o catálogo agora. <a href="'+WA+'" target="_blank" rel="noopener">Chame no WhatsApp</a>.';
    });
  }
}
})();
