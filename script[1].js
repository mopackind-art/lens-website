const projects=[['After Hours','ORIGINALS','A young-adult urban drama.','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'],['The Other Side','ORIGINALS','A documentary series exploring modern India.','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'],['Roommates','SOCIAL','A comedy about friendship, ambition and adulthood.','https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'],['Off Script','CREATORS','Real conversations with interesting people.','https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80'],['Pulse','BRAND','A culture-first product launch concept.','https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'],['North','BRAND','An entertainment-led social campaign.','https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80']];
function renderProjects(filter='ALL'){document.getElementById('projects').innerHTML=projects.map((p,i)=>[p,i]).filter(([p])=>filter==='ALL'||p[1]===filter).map(([p,i])=>`<article class="project" onclick="showProject(${i})"><div class="projectImage"><img src="${p[3]}" alt=""><span>VIEW CASE ↗</span></div><div class="projectMeta"><small>${p[1]} · CONCEPT</small><h3>${p[0]}</h3><p>${p[2]}</p></div></article>`).join('')}
function go(id){document.getElementById('mobileOverlay').style.display='none';document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}function toggleMenu(){const e=document.getElementById('mobileOverlay');e.style.display=e.style.display==='flex'?'none':'flex'}
function showProject(i){const p=projects[i];document.getElementById('modalImg').src=p[3];document.getElementById('modalType').textContent=p[1]+' · Concept';document.getElementById('modalTitle').textContent=p[0];document.getElementById('modalDesc').textContent=p[2];document.getElementById('modal').style.display='grid'}function hideModal(){document.getElementById('modal').style.display='none'}function closeModal(e){if(e.target.id==='modal')hideModal()}
function openContact(){document.getElementById('contact').style.display='grid';document.getElementById('mobileOverlay').style.display='none'}function hideContact(){document.getElementById('contact').style.display='none'}function closeContact(e){if(e.target.id==='contact')hideContact()}async function submitContact(e){
  e.preventDefault();
  const f=e.target;
  const btn=f.querySelector('button[type=submit]');
  const status=document.getElementById('contactStatus');
  const name=f[0].value.trim();
  const email=f[1].value.trim();
  const company=f[2].value.trim();
  const msg=f[3].value.trim();
  const originalText=btn.textContent;

  btn.textContent='SENDING…';
  btn.disabled=true;
  status.style.display='none';

  const payload={
    access_key:'8c511e85-b4cb-4a4c-97de-4855c9941c4e',
    subject:'New enquiry from LENS website',
    from_name:'LENS Website',
    name:name,
    email:email,
    replyto:email,
    company:company,
    message:msg,
    botcheck:''
  };

  try{
    const res=await fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify(payload)
    });

    const data=await res.json();

    if(!res.ok || !data.success){
      throw new Error(data.message || 'Web3Forms rejected the submission');
    }

    status.textContent='Thanks — your enquiry has been sent.';
    status.style.display='block';

    fetch('/api/auto-reply',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name,email:email})
    }).catch(err=>console.error('LENS auto-reply error:',err));

    f.reset();
    setTimeout(hideContact,2200);
  }catch(err){
    console.error('LENS contact form error:',err);
    const body=encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${msg}`
    );
    status.textContent='We could not send the enquiry automatically. Opening email instead…';
    status.style.display='block';
    window.location.href=
      `mailto:mopackind@gmail.com?subject=${encodeURIComponent('New enquiry from LENS website')}&body=${body}`;
  }finally{
    btn.textContent=originalText;
    btn.disabled=false;
  }
}
window.addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>30));document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProjects(b.dataset.filter)}));renderProjects();

if(new URLSearchParams(location.search).get('contact')){openContact();history.replaceState(null,'',location.pathname)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideModal();hideContact();document.getElementById('mobileOverlay').style.display='none'}});
