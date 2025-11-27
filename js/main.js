const projects = await fetch('data/projects.json').then(r => r.json()).catch(()=>[])

function linkOrHash(url){return url?url:'#'}

function renderProjects(gridEl, projects){
  if(!projects || projects.length===0){
    gridEl.innerHTML = '<div class="muted">프로젝트가 없습니다 — sample projects.json 파일을 확인하세요.</div>'
    return
  }
  gridEl.innerHTML = ''
  for(const p of projects){
    const card = document.createElement('article')
    card.className = 'project-card'
    card.innerHTML = `
      <img src="${p.image || 'assets/project-placeholder.svg'}" alt="${p.title}" />
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="project-title">${p.title}</div>
          <div class="muted">${p.short || ''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.85rem;color:var(--muted)">${p.date || ''}</div>
        </div>
      </div>
      <div style="margin-top:8px">${p.description || ''}</div>
      <div style="margin-top:10px">${(p.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}</div>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn ghost" data-action="details">Details</button>
        <a class="btn ghost" href="${linkOrHash(p.demo)}" target="_blank">Demo</a>
        <a class="btn ghost" href="${linkOrHash(p.repo)}" target="_blank">Code</a>
      </div>`
    gridEl.appendChild(card)
  }
  // attach click handlers for details and card click
  for(const c of gridEl.querySelectorAll('.project-card')){
    const idx = Array.from(gridEl.children).indexOf(c)
    const pj = projects[idx]
    // clicking Details button
    const btn = c.querySelector('[data-action="details"]')
    if(btn){
      btn.addEventListener('click', ()=> openModal(pj))
    }
    // clicking card image/title opens details too
    c.addEventListener('click', (e)=>{
      // avoid opening when clicking links or buttons
      if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') return
      openModal(pj)
    })
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('projects-grid')
  renderProjects(grid, projects)

  // Tag filter UI
  const tagFilterEl = document.getElementById('tag-filter')
  const allTags = [...new Set((projects||[]).flatMap(p => p.tags || []))]
  function applyFilter({tag=null, query='' } = {}){
    let filtered = projects
    if(tag && tag !== 'All') filtered = filtered.filter(p => (p.tags||[]).includes(tag))
    if(query && query.trim().length>0){
      const q = query.toLowerCase()
      filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.tags||[]).join(' ').toLowerCase().includes(q))
    }
    renderProjects(grid, filtered)
  }

  // populate tag buttons
  const tags = ['All', ...allTags]
  tags.forEach(t => {
    const btn = document.createElement('button')
    btn.className = 'tag'
    btn.textContent = t
    btn.onclick = ()=>{
      // clear active look
      [...tagFilterEl.children].forEach(c=>c.classList.remove('tag-active'))
      btn.classList.add('tag-active')
      const q = document.getElementById('projectSearch').value || ''
      applyFilter({tag:t, query:q})
    }
    tagFilterEl.appendChild(btn)
  })

  // initial active tag
  if(tagFilterEl.firstChild) tagFilterEl.firstChild.classList.add('tag-active')

  const searchInput = document.getElementById('projectSearch')
  let searchTmr = null
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTmr)
    searchTmr = setTimeout(()=>{
      const currentTagBtn = [...tagFilterEl.children].find(c => c.classList.contains('tag-active'))
      const tag = currentTagBtn ? currentTagBtn.textContent : null
      applyFilter({tag, query: e.target.value})
    }, 160)
  })

  // Project modal logic
  const modalRoot = document.getElementById('projectModal')
  const modalTitle = document.getElementById('modalTitle')
  const modalMeta = document.getElementById('modalMeta')
  const modalLong = document.getElementById('modalLong')
  const modalImages = document.getElementById('modalImages')
  const modalTags = document.getElementById('modalTags')
  const modalDemo = document.getElementById('modalDemo')
  const modalRepo = document.getElementById('modalRepo')
  const modalReport = document.getElementById('modalReport')
  const modalNotebook = document.getElementById('modalNotebook')

  function clearChildren(el){while(el && el.firstChild) el.removeChild(el.firstChild)}

  function openModal(project){
    if(!project) return
    modalTitle.textContent = project.title || ''
    modalMeta.textContent = `${project.short || ''} · ${project.date || ''}`
    modalLong.textContent = project.long || project.description || ''

    clearChildren(modalImages)
    const images = project.screenshots || [project.image].filter(Boolean)
    images.forEach(src=>{
      const img = document.createElement('img')
      img.src = src || 'assets/profile-placeholder.svg'
      modalImages.appendChild(img)
    })

    clearChildren(modalTags)
    ;(project.tags||[]).forEach(t=>{
      const s = document.createElement('span')
      s.className = 'tag'
      s.textContent = t
      modalTags.appendChild(s)
    })

    modalDemo.href = project.demo || '#'
    modalRepo.href = project.repo || '#'
    modalReport.href = project.report || '#'
    modalNotebook.href = project.notebook || '#'

    modalRoot.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  function closeModal(){
    modalRoot.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  // close listeners
  modalRoot.querySelectorAll('[data-close]').forEach(n=>n.addEventListener('click', closeModal))
  modalRoot.querySelector('.modal-close').addEventListener('click', closeModal)
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal() })

  // Sample Chart: accuracy over epochs
  const ctx = document.getElementById('accuracyChart')
  if(ctx){
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10'],
        datasets: [{
          label: 'Validation Accuracy',
          data: [0.71,0.75,0.78,0.79,0.81,0.82,0.84,0.85,0.86,0.87],
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-2') || '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.12)',
          tension:0.25,
          fill: true
        }]
      },
      options: {scales:{y:{min:0.6,max:1}},plugins:{legend:{display:false}}}
    })
  }
})
