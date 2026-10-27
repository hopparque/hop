const DAYS=['2026-12-23','2026-12-24','2026-12-25','2026-12-26'];
const KEY='hop_events_draft';
const fmt=(d,o)=>new Intl.DateTimeFormat('pt-PT',Object.assign({timeZone:'UTC'},o)).format(new Date(d+'T00:00:00Z'));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sortEv=a=>[...a].sort((x,y)=>(x.date+(x.time||'')).localeCompare(y.date+(y.time||'')));
async function loadEvents(){
  try{const d=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(d))return{events:d,draft:true}}catch(e){}
  try{const r=await fetch('data/events.json',{cache:'no-cache'});return{events:await r.json(),draft:false}}
  catch(e){return{events:[],draft:false,error:true}}
}
function evHTML(e){
  return '<article class="ev"><div class="t">'+esc(e.time)+'</div><div><h3>'+esc(e.title)+
  (e.category?'<span class="chip">'+esc(e.category)+'</span>':'')+'</h3>'+
  (e.place?'<div class="meta">'+esc(e.place)+'</div>':'')+(e.desc?'<p>'+esc(e.desc)+'</p>':'')+'</div></article>';
}
function draftBar(on){
  if(!on||document.querySelector('.draftbar'))return;
  const b=document.createElement('div');b.className='draftbar';
  b.innerHTML='Estás a ver um rascunho guardado neste navegador. Os visitantes só veem o que estiver em data/events.json. <a href="admin">Abrir gestão</a>';
  document.body.prepend(b);
}
function countdown(el){
  if(!el)return;
  const start=new Date(2026,11,23),end=new Date(2026,11,27);
  const tick=()=>{
    const now=new Date();
    if(now>=end){el.innerHTML='<p>Obrigado por passares o Natal no Hop!</p>';return}
    if(now>=start){el.innerHTML='<p>O Natal Hop! está a decorrer. Vem!</p>';return}
    let s=Math.floor((start-now)/1000);
    const v=[[Math.floor(s/86400),'dias'],[Math.floor(s%86400/3600),'horas'],[Math.floor(s%3600/60),'min'],[s%60,'seg']];
    el.innerHTML=v.map(x=>'<div><b>'+x[0]+'</b>'+x[1]+'</div>').join('');
  };
  tick();setInterval(tick,1000);
}
