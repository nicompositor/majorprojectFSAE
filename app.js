(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; };
  const byId = id => document.getElementById(id);
  function parseMedia(value, kind) {
    if (!value) return null;
    try {
      const u = new URL(value); if (u.protocol !== 'https:') return false;
      const host = u.hostname.toLowerCase();
      if (kind === 'soundcloud') return ['soundcloud.com', 'www.soundcloud.com'].includes(host) && u.pathname.split('/').filter(Boolean).length >= 2 ? u : false;
      let id;
      if (host === 'youtu.be') id = u.pathname.slice(1);
      else if (['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)) id = u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? { url: u, id } : false;
    } catch { return false; }
  }
  function media(container, kind, value, title, options = {}) {
    const parsed = parseMedia(value, kind);
    if (!parsed) {
      if (parsed === false) { container.append(el('p','error','This media link needs updating.')); return; }
      if (kind === 'youtube') { container.append(el('span','play-placeholder','▷'),el('span','visual-caption','FILM PREVIEW FORTHCOMING')); }
      else { const box=el('div','media-pending'); const copy=el('div');copy.append(el('strong','','Recording forthcoming'),el('small','','SoundCloud · This movement will be available here.'));box.append(el('span','pending-icon','◌'),copy);container.append(box); }
      return;
    }
    if (kind === 'soundcloud') {
      const frame=el('iframe','embed soundcloud-embed');
      frame.title=title;frame.allow='encrypted-media';frame.referrerPolicy='strict-origin-when-cross-origin';
      frame.src=`https://w.soundcloud.com/player/?url=${encodeURIComponent(parsed.href)}&color=%232f493a&auto_play=false&hide_related=true&show_comments=false`;
      const external=el('a','external-link','Open on SoundCloud ↗');external.href=parsed.href;external.target='_blank';external.rel='noopener noreferrer';
      container.append(frame,external,el('p','load-note','SoundCloud may use cookies. Playback starts only when you press Play.'));
      return;
    }
    const load=el('button','media-load','▷  Watch film');load.type='button';
    const note=el('p','load-note',`Loading connects to ${kind === 'youtube' ? 'YouTube' : 'SoundCloud'}, which may use cookies.`);
    const external=el('a','external-link',`Open on ${kind === 'youtube' ? 'YouTube' : 'SoundCloud'} ↗`);external.href=(parsed.url || parsed).href;external.target='_blank';external.rel='noopener noreferrer';
    load.addEventListener('click',()=>{ const frame=el('iframe',`embed ${kind}-embed`);frame.title=title;frame.allow='encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.src=kind==='youtube'?`https://www.youtube-nocookie.com/embed/${parsed.id}?rel=0`:`https://w.soundcloud.com/player/?url=${encodeURIComponent(parsed.href)}&color=%232f493a&auto_play=false&hide_related=true&show_comments=false`;load.remove();note.remove();container.append(frame); });
    container.append(load,note);
    (options.externalTarget || container).append(external);
  }
  function selectCue(cue, focus=false) {
    document.querySelectorAll('.cue-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cue === cue.id)));
    byId('cue-art-code').textContent=cue.code;byId('cue-concept').textContent=cue.concept;byId('cue-title').textContent=cue.title;byId('cue-brief').textContent=cue.brief;byId('cue-description').textContent=cue.description;
    byId('cue-player').replaceChildren();media(byId('cue-player'),'soundcloud',cue.url,`${cue.code} — ${cue.title}`);
    if(focus) {byId('cue-title').tabIndex=-1;byId('cue-title').focus({preventScroll:true});if(matchMedia('(max-width:640px)').matches)byId('cue-panel').scrollIntoView({block:'start'});}
  }
  data.cues.forEach(cue=>{const b=el('button','cue-button');b.type='button';b.dataset.cue=cue.id;b.setAttribute('aria-controls','cue-panel');b.setAttribute('aria-label',`${cue.code}: ${cue.title}`);b.append(el('span','cue-code',cue.code),el('span','cue-name',cue.title),el('span','cue-arrow','↗'));b.addEventListener('click',()=>selectCue(cue,true));byId('cue-list').append(b);});
  if(data.cues.length)selectCue(data.cues[0]);
  data.films.forEach(film=>{
    const article=el('article','film');article.id=film.id;
    const group=el('div','film-media');
    const visual=el('div',`film-visual ${film.treatment}`);
    visual.append(el('span','visual-title',film.id==='pedacito'?'MEMORY / WATER / VOICE':film.id==='warhammer'?'BREATH / METAL / HUMANITY':'PAPER / PLAY / IMAGINATION'));
    group.append(visual);
    const copy=el('div','film-copy');
    copy.append(el('p','eyebrow',film.category),el('h3','',film.title),el('p','film-label',film.label),el('p','description',film.description),el('p','palette',film.palette),el('p','film-credit',film.credit));
    article.append(group,copy);byId('film-list').append(article);
    media(visual,'youtube',film.url,film.title,{externalTarget:copy});
  });
  if(data.people.length)data.people.forEach(p=>{const row=el('div','person');row.append(el('strong','',p.name),el('span','',p.role));byId('people').append(row);});else byId('people').append(el('p','small','Full author and performer credits will accompany the final release.'));
  const thesis=data.thesis.url;
  if(!thesis)byId('thesis-actions').append(el('span','status','Final thesis forthcoming'));
  else {
    let url;
    try{url=new URL(thesis,location.href);if(!['https:','http:'].includes(url.protocol)||(!/^https:\/\//.test(thesis)&&url.origin!==location.origin))throw Error();}
    catch{byId('thesis-actions').append(el('p','error','The thesis link needs updating.'));return;}
    const read=el('button','button','Read the thesis ↗');read.type='button';read.setAttribute('aria-expanded','false');read.setAttribute('aria-controls','pdf-container');
    read.addEventListener('click',()=>{const box=byId('pdf-container');box.hidden=!box.hidden;read.setAttribute('aria-expanded',String(!box.hidden));read.textContent=box.hidden?'Read the thesis ↗':'Close reader ×';if(!box.childElementCount){const frame=el('iframe');frame.title='Final thesis PDF';frame.src=url.href;box.append(frame);}if(!box.hidden)box.scrollIntoView({block:'start'});});
    const download=el('a','button','Download PDF ↓');download.href=url.href;download.download=data.thesis.filename;const open=el('a','external-link','Open PDF in a new tab ↗');open.href=url.href;open.target='_blank';open.rel='noopener';byId('thesis-actions').append(read,download,open);
  }
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.header nav a').forEach(a=>{if(a.hash===`#${e.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main>section').forEach(s=>observer.observe(s));}
})();
