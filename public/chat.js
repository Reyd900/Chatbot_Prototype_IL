const messagesEl = document.getElementById('messages');
const controlsEl = document.getElementById('controls');

let state = { step: 'init', userType: null, answers: {} };

function addMessage(text, from='bot'){
  const div = document.createElement('div');
  div.className = 'msg ' + (from==='bot' ? 'bot' : 'user');
  const b = document.createElement('div');
  b.className = 'bubble ' + (from==='bot' ? 'bot' : 'user');
  b.innerText = text;
  div.appendChild(b);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setControls(htmlEl){
  controlsEl.innerHTML = '';
  controlsEl.appendChild(htmlEl);
}

function button(text, onClick, className='btn'){
  const b = document.createElement('button');
  b.className = className;
  b.innerText = text;
  b.onclick = onClick;
  return b;
}

function inputField(placeholder, onEnter){
  const input = document.createElement('input');
  input.className = 'input';
  input.placeholder = placeholder;
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') onEnter(input.value);
  });
  return input;
}

function startFlow(){
  addMessage('Hi 👋 I\'m Wiz, the assistant for WizKlub. Are you a Parent or a School representing team?');
  const wrap = document.createElement('div');
  wrap.appendChild(button('Parent', ()=>selectType('Parent')));
  wrap.appendChild(button('School', ()=>selectType('School')));
  setControls(wrap);
}

function selectType(t){
  state.userType = t;
  addMessage(t, 'user');
  if(t==='Parent') parentFlowIntro(); else schoolFlowIntro();
}

function parentFlowIntro(){
  addMessage('Awesome — I\'ll ask a few quick questions to recommend the right program and help book a demo. First, what\'s your name?');
  const input = inputField('Your full name', v=>{ if(!v) return; addMessage(v,'user'); state.answers.name = v; askParentEmail(); });
  setControls(input);
  input.focus();
}

function askParentEmail(){
  addMessage('Great. What\'s the best email to reach you?');
  const input = inputField('Email', v=>{ if(!v) return; addMessage(v,'user'); state.answers.email = v; askParentPhone(); });
  setControls(input);
  input.focus();
}

function askParentPhone(){
  addMessage('Phone number (for quick demo booking)');
  const input = inputField('Phone', v=>{ if(!v) return; addMessage(v,'user'); state.answers.phone = v; askChildAge(); });
  setControls(input);
  input.focus();
}

function askChildAge(){
  addMessage('How old is your child?');
  const wrap = document.createElement('div');
  [3,4,5,6,7,8,9,10,11,12,'13+'].forEach(a=>{
    wrap.appendChild(button(String(a), ()=>{ addMessage(String(a),'user'); state.answers.childAge = a==='13+'?13:parseInt(a); askBudget(); } , 'btn'));
  });
  setControls(wrap);
}

function askBudget(){
  addMessage('What budget range are you considering for extracurricular STEM classes?');
  const wrap = document.createElement('div');
  ['Low','Medium','High'].forEach(b=>wrap.appendChild(button(b, ()=>{ addMessage(b,'user'); state.answers.budget = b; finishLead('Parent'); })));
  setControls(wrap);
}

function schoolFlowIntro(){
  addMessage('Great — tell me your name and role at the school (e.g., Principal, Coordinator).');
  const input = inputField('Name and role', v=>{ if(!v) return; addMessage(v,'user'); state.answers.name = v; askSchoolEmail(); });
  setControls(input);
  input.focus();
}

function askSchoolEmail(){
  addMessage('School email?');
  const input = inputField('Email', v=>{ if(!v) return; addMessage(v,'user'); state.answers.email = v; askSchoolPhone(); });
  setControls(input);
  input.focus();
}

function askSchoolPhone(){
  addMessage('Phone number for follow-up');
  const input = inputField('Phone', v=>{ if(!v) return; addMessage(v,'user'); state.answers.phone = v; askStudentsCount(); });
  setControls(input);
  input.focus();
}

function askStudentsCount(){
  addMessage('Approximately how many students are in the school?');
  const wrap = document.createElement('div');
  ['<100','100-300','300+'].forEach(t=>wrap.appendChild(button(t, ()=>{ addMessage(t,'user'); const n = t==='300+'?400:(t==='100-300'?200:80); state.answers.students = n; askPartnerInterest(); })));
  setControls(wrap);
}

function askPartnerInterest(){
  addMessage('Are you interested in a full school partnership or pilot programs?');
  const wrap = document.createElement('div');
  ['Yes','No','Maybe'].forEach(x=>wrap.appendChild(button(x, ()=>{ addMessage(x,'user'); state.answers.partnerInterest = x; finishLead('School'); })));
  setControls(wrap);
}

function finishLead(type){
  state.answers.userType = type;
  addMessage('Thanks! Do you want me to request a demo slot with our team?');
  const wrap = document.createElement('div');
  wrap.appendChild(button('Book a demo', ()=>submitLead(true),'btn'));
  wrap.appendChild(button('Save & contact me', ()=>submitLead(false),'link-like'));
  setControls(wrap);
}

async function submitLead(bookDemo){
  addMessage(bookDemo ? 'Book a demo' : 'Save & contact me', 'user');
  const payload = { ...state.answers };
  payload.bookDemo = !!bookDemo;
  try{
    const res = await fetch('/submit', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload)});
    const j = await res.json();
    if(j.ok){
      addMessage('Got it — our team will reach out shortly. Demo booking ID: ' + j.id);
      addMessage('Lead score: ' + j.score, 'bot');
      setControls(document.createTextNode(''));
      // CTA to calendar (placeholder)
      const wrap = document.createElement('div');
      wrap.appendChild(button('Open demo calendar (placeholder)', ()=>window.open('https://calendly.com', '_blank')));
      setControls(wrap);
    } else throw new Error(j.error||'submit failed');
  }catch(e){
    addMessage('Sorry, could not submit now. You can email hello@wizklub.com','bot');
  }
}

// Kick off
startFlow();
