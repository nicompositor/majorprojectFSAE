import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const content=readFileSync(new URL('../content.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
class Element {
  constructor(tag='div'){this.tag=tag;this.children=[];this.attributes={};this.events={};this.dataset={};this.hidden=true;}
  append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.events[k]=fn;}
  remove(){this.parentElement.children=this.parentElement.children.filter(x=>x!==this);}
  focus(){} scrollIntoView(){}
  get childElementCount(){return this.children.length;}
  querySelector(selector){return this.children.find(x=>x.className===selector.slice(1));}
}
function run(mutator=()=>{}){
  const ids={};const doc={createElement:t=>new Element(t),getElementById:id=>ids[id]??=new Element(),querySelectorAll:selector=>selector==='.cue-button'?(ids['cue-list']?.children||[]):[]};
  const context=vm.createContext({window:{},document:doc,URL,location:{href:'https://example.github.io/portfolio/',origin:'https://example.github.io'},matchMedia:()=>({matches:false})});
  vm.runInContext(content,context);mutator(context.window.PORTFOLIO);vm.runInContext(app,context);return ids;
}
let ids=run();assert.equal(ids['cue-list'].children.length,9);assert.equal(ids['film-list'].children.length,3);assert.equal(ids['thesis-actions'].children[0].textContent,'Read the thesis ↗');
for(const button of ids['cue-list'].children){button.events.click();assert.equal(button.attributes['aria-pressed'],'true');assert.equal(ids['cue-player'].children[0].tag,'button');assert.ok(!ids['cue-brief'].textContent.includes('?'));}
ids=run(d=>{d.cues[0].url='https://soundcloud.com/test/track';d.films[0].url='https://youtu.be/abcdefghijk';d.thesis.url='documents/thesis-final.pdf';});
ids['cue-player'].children[0].events.click();assert.match(ids['cue-player'].children.at(-1).src,/w.soundcloud.com\/player/);
let film=ids['film-list'].children[0];film.children[0].children[0].children.find(x=>x.tag==='button').events.click();assert.equal(film.children[0].children[0].children.at(-1).src,'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0');
ids['thesis-actions'].children[0].events.click();assert.equal(ids['pdf-container'].hidden,false);assert.equal(ids['pdf-container'].children[0].src,'https://example.github.io/portfolio/documents/thesis-final.pdf');ids['thesis-actions'].children[0].events.click();assert.equal(ids['pdf-container'].hidden,true);
ids=run(d=>{d.cues[0].url='javascript:alert(1)';d.films[0].url='https://youtube.com.evil.example/watch?v=abcdefghijk';d.thesis.url='javascript:alert(1)';});assert.equal(ids['cue-player'].children[0].className,'error');assert.equal(ids['film-list'].children[0].children[0].children[0].children.at(-1).className,'error');assert.equal(ids['thesis-actions'].children[0].className,'error');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');for(const [,id]of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),`Missing anchor ${id}`);
console.log('PASS: nine cues, three films, cue selection, empty/invalid links, SoundCloud/YouTube embed generation, PDF open/close, repository-relative PDF paths, navigation anchors.');

assert.equal(ids['film-list'].children[0].children[0].children.length,1);
ids=run();
assert.equal(ids['cue-title'].textContent,'Prologue (From the Exile)');
assert.equal(ids['cue-list'].children[0].dataset.cue,'m0');
const tracks = ["https://soundcloud.com/compositorio-mail/m0-prologue-from-the-exile-1","https://soundcloud.com/compositorio-mail/m1-territory-2","https://soundcloud.com/compositorio-mail/m2-presence-3","https://soundcloud.com/compositorio-mail/m3-threat-4","https://soundcloud.com/compositorio-mail/m4-uprootedness-5","https://soundcloud.com/compositorio-mail/m5-transit-7","https://soundcloud.com/compositorio-mail/m6-non-place-6","https://soundcloud.com/compositorio-mail/m7-memory-8","https://soundcloud.com/compositorio-mail/m8-inside-my-roots-resilience-9"];
ids['cue-list'].children.forEach((button,i)=>{
  button.events.click();
  assert.equal(ids['cue-player'].children.find(x=>x.tag==='a').href,tracks[i]);
  ids['cue-player'].children[0].events.click();
  assert.equal(new URL(ids['cue-player'].children.at(-1).src).searchParams.get('url'),tracks[i]);
});
assert.equal(ids['cue-title'].textContent,'Inside My Roots (Resilience)');
['r2nXxd1fjp8','9X4VsITBzaA','8thiwtwNMyo'].forEach((video,i)=>{
  const visual=ids['film-list'].children[i].children[0].children[0];
  assert.equal(visual.children.some(x=>x.tag==='iframe'),false);
  visual.children.find(x=>x.tag==='button').events.click();
  assert.equal(visual.children.at(-1).src,'https://www.youtube-nocookie.com/embed/'+video+'?rel=0');
});
ids=run(d=>{d.cues.forEach(c=>c.url='');});
assert.equal(ids['cue-player'].children[0].className,'media-pending');
assert.ok(html.includes('By: Nicolás Bedoya and Giuseppe Ramirez'));
assert.ok(html.includes('Supervisors: Daniel Velasco and Erica Acuña'));
assert.ok(!app.includes('film-audio'));
console.log('PASS: M0–M8 order, nine exact track mappings, narrative briefs, credits, three supplied videos, no film audio players.');
