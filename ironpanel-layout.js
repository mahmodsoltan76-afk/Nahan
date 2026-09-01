
/*
 * Nahan / Zavali - IronPanel-style layout enhancer
 * This does not replace Nahan's API functions. It only reorganizes
 * the existing navigation and presentation layer.
 */
(function(){
  'use strict';

  const navOrder = [
    ['overview','Dashboard','نمای کلی'],
    ['info','Endpoints','اتصال‌ها'],
    ['network','Metrics','مانیتورینگ'],
    ['users','Clients','کاربران'],
    ['settings','System','سیستم'],
    ['advanced','Advanced','پیشرفته'],
    ['logs','Logs','گزارش‌ها']
  ];

  const groups = [
    {title:'MAIN', ids:['overview','info','network','users']},
    {title:'MANAGEMENT', ids:['settings','advanced']},
    {title:'AUDIT', ids:['logs']}
  ];

  function iconFor(id){
    const map={
      overview:'⌂', info:'⌁', network:'◫', users:'♙',
      settings:'⚙', advanced:'⌘', logs:'▤'
    };
    return map[id] || '•';
  }

  function makeSectionLabel(text){
    const el=document.createElement('div');
    el.className='ip-nav-section';
    el.textContent=text;
    return el;
  }

  function enhanceNav(){
    const aside=document.querySelector('#dash-box > aside');
    if(!aside) return;
    const nav=aside.querySelector('nav');
    if(!nav || nav.dataset.ipEnhanced==='1') return;

    const buttons={};
    nav.querySelectorAll('.nav-item').forEach(b=>{
      const m=(b.id||'').match(/^tab-(.+)$/);
      if(m) buttons[m[1]]=b;
    });

    if(!buttons.overview) return;

    nav.innerHTML='';
    groups.forEach((g,idx)=>{
      const label=makeSectionLabel(g.title);
      nav.appendChild(label);
      g.ids.forEach(id=>{
        const b=buttons[id];
        if(!b) return;
        const old= b.querySelector('svg');
        if(old) old.style.display='none';

        const mark=document.createElement('span');
        mark.className='ip-nav-icon';
        mark.textContent=iconFor(id);
        mark.setAttribute('aria-hidden','true');
        b.prepend(mark);

        nav.appendChild(b);
      });
    });

    nav.dataset.ipEnhanced='1';
  }

  function addQuickActions(){
    const header=document.querySelector('#dash-box main > header');
    if(!header || header.querySelector('.ip-header-actions')) return;

    const wrap=document.createElement('div');
    wrap.className='ip-header-actions';
    wrap.innerHTML=`
      <button type="button" class="ip-action" data-ip-action="overview">Overview</button>
      <button type="button" class="ip-action ip-action-primary" data-ip-action="users">+ Client</button>
    `;

    wrap.addEventListener('click',e=>{
      const btn=e.target.closest('[data-ip-action]');
      if(!btn) return;
      const tab=btn.dataset.ipAction;
      if(typeof window.switchTab==='function') window.switchTab(tab);
    });

    header.appendChild(wrap);
  }

  function addOverviewHero(){
    const view=document.getElementById('view-overview');
    if(!view || view.querySelector('.ip-hero')) return;

    const hero=document.createElement('section');
    hero.className='ip-hero';
    hero.innerHTML=`
      <div class="ip-hero-main">
        <div class="ip-eyebrow">IRONPANEL STYLE · NAHAN CORE</div>
        <h2>Gateway Control Center</h2>
        <p>مدیریت سریع کاربران، اتصال‌ها، وضعیت سرویس و تنظیمات نهان</p>
        <div class="ip-hero-actions">
          <button data-ip-hero="users">مدیریت کاربران</button>
          <button data-ip-hero="info">مشاهده Endpointها</button>
          <button data-ip-hero="settings">تنظیمات سیستم</button>
        </div>
      </div>
      <div class="ip-hero-status">
        <span class="ip-live-dot"></span>
        <b>ONLINE</b>
        <small>Nahan Gateway</small>
      </div>
    `;

    hero.addEventListener('click',e=>{
      const btn=e.target.closest('[data-ip-hero]');
      if(btn && typeof window.switchTab==='function') window.switchTab(btn.dataset.ipHero);
    });

    view.prepend(hero);
  }

  function addNavStyles(){
    if(document.getElementById('ip-inline-style')) return;
    const s=document.createElement('style');
    s.id='ip-inline-style';
    s.textContent=`
      .ip-nav-section{
        padding:12px 12px 6px;
        color:#5f6d84;
        font:800 9px/1.2 Inter,sans-serif;
        letter-spacing:.16em;
      }
      .ip-nav-section:first-child{padding-top:3px}
      .ip-nav-icon{
        width:30px;height:30px;
        display:inline-flex;align-items:center;justify-content:center;
        margin-inline-end:10px;
        border-radius:9px;
        background:rgba(99,102,241,.08);
        color:#9aa7ff;
        font-size:14px;
        flex:none;
      }
      .nav-item.active .ip-nav-icon{
        background:rgba(129,140,248,.18);
        color:#fff;
      }
      .ip-header-actions{
        display:flex;align-items:center;gap:8px;margin-inline-start:auto;
      }
      .ip-action{
        border:1px solid var(--ip-border);
        background:#131e30;
        color:#aebbd0;
        padding:8px 11px;
        border-radius:10px;
        font-size:11px;font-weight:800;
      }
      .ip-action-primary{
        color:#fff;
        border-color:rgba(129,140,248,.35);
        background:linear-gradient(135deg,#6366f1,#818cf8);
      }
      .ip-hero{
        display:flex;
        align-items:stretch;
        justify-content:space-between;
        gap:20px;
        padding:24px;
        margin-bottom:18px;
        border:1px solid #243249;
        border-radius:20px;
        background:
          radial-gradient(400px 180px at 100% 0%,rgba(129,140,248,.18),transparent 70%),
          linear-gradient(135deg,#121d30,#0c1422);
        box-shadow:0 18px 55px rgba(0,0,0,.22);
        animation:ipFade .25s ease;
      }
      .ip-hero-main{min-width:0}
      .ip-eyebrow{
        color:#818cf8;font-size:9px;font-weight:900;
        letter-spacing:.16em;margin-bottom:7px;
      }
      .ip-hero h2{
        margin:0;color:#fff;font-size:25px;font-weight:900;
        letter-spacing:-.035em;
      }
      .ip-hero p{
        margin:7px 0 16px;color:#91a0b7;font-size:12px;
      }
      .ip-hero-actions{display:flex;flex-wrap:wrap;gap:8px}
      .ip-hero-actions button{
        border:1px solid #2b3a54;
        background:#162238;color:#dbe5f5;
        padding:8px 12px;border-radius:10px;font-size:11px;font-weight:800;
      }
      .ip-hero-actions button:hover{border-color:#6975e9;color:#fff}
      .ip-hero-status{
        min-width:130px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        border-inline-start:1px solid #26354c;
        padding-inline-start:22px;
      }
      .ip-live-dot{
        width:12px;height:12px;border-radius:50%;background:#22c55e;
        box-shadow:0 0 0 6px rgba(34,197,94,.10),0 0 18px rgba(34,197,94,.55);
        margin-bottom:9px;
      }
      .ip-hero-status b{color:#d8ffe6;font-size:11px;letter-spacing:.12em}
      .ip-hero-status small{color:#71819a;font-size:9px;margin-top:4px}
      @media(max-width:767px){
        .ip-header-actions{display:none}
        .ip-hero{padding:18px;display:block}
        .ip-hero-status{
          border-inline-start:0;border-top:1px solid #26354c;
          margin-top:16px;padding:13px 0 0;flex-direction:row;gap:8px;
        }
        .ip-live-dot{margin:0}
      }
      html:not(.dark) .ip-nav-section{color:#94a3b8}
      html:not(.dark) .ip-action{background:#f8fafc;color:#475569;border-color:#dbe3ee}
      html:not(.dark) .ip-hero{
        background:linear-gradient(135deg,#fff,#f2f5fb);
        border-color:#dbe3ee;
      }
      html:not(.dark) .ip-hero h2{color:#172033}
      html:not(.dark) .ip-hero p{color:#64748b}
      html:not(.dark) .ip-hero-actions button{background:#f8fafc;color:#334155;border-color:#dbe3ee}
      html:not(.dark) .ip-hero-status{border-color:#dbe3ee}
    `;
    document.head.appendChild(s);
  }

  function init(){
    addNavStyles();
    enhanceNav();
    addQuickActions();
    addOverviewHero();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

  const observer=new MutationObserver(()=>{
    if(document.getElementById('dash-box') && !document.getElementById('ip-inline-style')) init();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
