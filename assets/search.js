const form = document.querySelector('form[data-search]');
const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ja').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s+/g,' ').trim();
if (form) {
  const field = form.querySelector('[name=q]'), category = form.querySelector('[name=category]'), sort = form.querySelector('[name=sort]');
  const cards = [...document.querySelectorAll('[data-product]')], count = document.querySelector('[data-result-count]'), empty = document.querySelector('[data-empty]');
  const baseCategory = form.dataset.category || '';
  function apply(sync=true) {
    const tokens = normalize(field.value).split(' ').filter(Boolean), cat = category ? category.value : baseCategory;
    let visible = 0;
    for (const card of cards) {
      const haystack = normalize(card.dataset.search);
      const show = (!cat || cat===card.dataset.category) && tokens.every(token=>haystack.includes(token));
      card.hidden = !show; if(show) visible++;
    }
    if(sort) cards.sort((a,b)=>sort.value==='price-asc' ? Number(a.dataset.price)-Number(b.dataset.price) : sort.value==='price-desc' ? Number(b.dataset.price)-Number(a.dataset.price) : Number(a.dataset.index)-Number(b.dataset.index)).forEach(card=>card.parentElement.append(card));
    count.textContent = `${visible} 件のコスメ`; empty.hidden = visible!==0;
    if(sync) {const url=new URL(location.href);for(const [k,v] of [['q',field.value],['category',category?.value||''],['sort',sort?.value||'']]) { if(v) url.searchParams.set(k,v);else url.searchParams.delete(k); }history.replaceState(null,'',url);}
  }
  function readURL() {const q=new URLSearchParams(location.search); field.value=q.get('q')||'';if(category)category.value=q.get('category')||'';if(sort)sort.value=q.get('sort')||'';apply(false);}
  form.addEventListener('submit',e=>{e.preventDefault();apply();});
  form.addEventListener('input',()=>apply());form.addEventListener('change',()=>apply());
  document.querySelector('[data-reset]')?.addEventListener('click',()=>{form.reset();field.value='';if(category)category.value='';apply();field.focus();});
  window.addEventListener('popstate',readURL);readURL();
}
const menu=document.querySelector('[data-menu]'), nav=document.querySelector('[data-nav]');
if(menu && nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});}
