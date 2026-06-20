/**
 * ============================================================================
 * ANTARDRISHTI MIND - CORE APPLICATION STATE & ROUTING
 * ============================================================================
 */

// Global state variables
let activeTab = 'home';
let appLanguage = 'en';
let calmModeActive = false;
let dyslexiaFontActive = false;
let profileData = null;
let moodChartRef = null;
let performanceChartRef = null;
let mockChartRef = null;

// Chat usage tracker
let chatUsageCount = 0;
const CHAT_USAGE_MAX = 15;

// Voice recognition state
let journalRecognition = null;
let chatRecognition = null;
let isJournalListening = false;
let isChatListening = false;

// Pranayama timer variables
let breathingInterval = null;
let breathingActive = false;
let breathingTimer = 4;
let breathingPhase = 'Inhale';
let breathingStyle = 'anulom';

// Pomodoro Focus variables
let pomoInterval = null;
let pomoTimeLeft = 1500;
let pomoActive = false;
let pomoMode = 'study';

// Static Exam Target Dates Database
const EXAM_DATES_DATABASE = {
  JEE: [
    { label: "JEE Main Session 1", date: "Jan 24 - Feb 1, 2026", status: "Completed" },
    { label: "JEE Main Session 2", date: "Apr 3 - Apr 12, 2026", status: "Completed" },
    { label: "JEE Advanced Exam", date: "May 24, 2026", status: "Upcoming" }
  ],
  NEET: [
    { label: "NEET UG Registration", date: "Feb 9 - Mar 16, 2026", status: "Completed" },
    { label: "NEET UG Admit Card", date: "Late April 2026", status: "Released" },
    { label: "NEET UG Main Exam", date: "May 3, 2026", status: "Upcoming" }
  ],
  UPSC: [
    { label: "UPSC CSE Notification", date: "Feb 11, 2026", status: "Released" },
    { label: "UPSC Civil Services Prelims", date: "May 31, 2026", status: "Upcoming" },
    { label: "UPSC CSE Mains Exam", date: "Sep 18, 2026", status: "Upcoming" }
  ],
  GATE: [
    { label: "GATE Admit Card Download", date: "Jan 3, 2026", status: "Completed" },
    { label: "GATE Main CBT Examinations", date: "Feb 1 - Feb 15, 2026", status: "Completed" },
    { label: "GATE Official Score Card", date: "Mar 21, 2026", status: "Available" }
  ],
  CAT: [
    { label: "CAT Exam Registration", date: "Aug - Sep 2026", status: "Upcoming" },
    { label: "CAT Admit Card Download", date: "Nov 4, 2026", status: "Upcoming" },
    { label: "CAT National Examination", date: "Nov 29, 2026", status: "Upcoming" }
  ]
};

// ============================================================================
// 1. PAGE ROUTING & NAVIGATION
// ============================================================================
function switchTab(tabId) {
  activeTab = tabId;
  
  // Hide all panels
  document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
  // Reveal active panel
  const activePage = document.getElementById(`page-${tabId}`);
  if (activePage) activePage.classList.remove('hidden');

  // Sidebar Nav active styling
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('text-brand-sage', 'bg-brand-sage-light/50');
    btn.classList.add('text-brand-slate', 'hover:bg-brand-sage-light/20');
  });
  const activeBtn = document.getElementById(`nav-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-brand-slate', 'hover:bg-brand-sage-light/20');
    activeBtn.classList.add('text-brand-sage', 'bg-brand-sage-light/50');
  }

  // Mobile Bottom bar nav active styling
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.remove('text-brand-sage');
    btn.classList.add('text-brand-slate/70');
  });
  const activeMobileBtn = document.getElementById(`m-nav-${tabId}`);
  if (activeMobileBtn) {
    activeMobileBtn.classList.remove('text-brand-slate/70');
    activeMobileBtn.classList.add('text-brand-sage');
  }

  // Bind tab loaders
  if (tabId === 'home') loadDashboard();
  if (tabId === 'mind') loadMindSpace();
  if (tabId === 'body') loadBodyBrainPage();
  if (tabId === 'exam') loadExamPathPage();
  if (tabId === 'beyond') loadBeyondMarksPage();
  if (tabId === 'family') loadFamilyBridgePage();
  if (tabId === 'settings') loadSettingsPage();
}

// ============================================================================
// 2. TRANSLATION HELPERS
// ============================================================================
function translatePage() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const translation = translations[appLanguage]?.[key] || translations['en']?.[key] || key;
    
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.setAttribute('placeholder', translation);
    } else {
      el.innerText = translation;
    }
  });
}

// ============================================================================
// 3. ACCESSIBILITY OPTIONS
// ============================================================================
function toggleCalmMode() {
  calmModeActive = !calmModeActive;
  const thumb = document.getElementById('calm-toggle-thumb');
  const btn = document.getElementById('calm-toggle-btn');
  
  if (calmModeActive) {
    document.body.classList.add('calm-mode');
    thumb.classList.replace('translate-x-0', 'translate-x-6');
    btn.classList.replace('bg-brand-slate/20', 'bg-brand-sage');
  } else {
    document.body.classList.remove('calm-mode');
    thumb.classList.replace('translate-x-6', 'translate-x-0');
    btn.classList.replace('bg-brand-sage', 'bg-brand-slate/20');
  }
  
  if (profileData) {
    profileData.calmMode = calmModeActive;
    db.profile.put(profileData);
  }
}

function toggleDyslexiaMode() {
  dyslexiaFontActive = !dyslexiaFontActive;
  const thumb = document.getElementById('dyslexia-toggle-thumb');
  const btn = document.getElementById('dyslexia-toggle-btn');
  
  if (dyslexiaFontActive) {
    document.body.classList.add('dyslexia-font');
    thumb.classList.replace('translate-x-0', 'translate-x-6');
    btn.classList.replace('bg-brand-slate/20', 'bg-brand-sage');
  } else {
    document.body.classList.remove('dyslexia-font');
    thumb.classList.replace('translate-x-6', 'translate-x-0');
    btn.classList.replace('bg-brand-sage', 'bg-brand-slate/20');
  }
  
  if (profileData) {
    profileData.dyslexiaMode = dyslexiaFontActive;
    db.profile.put(profileData);
  }
}

function changeAppLang(lang) {
  appLanguage = lang;
  
  ['en', 'hi', 'ta'].forEach(l => {
    const check = document.getElementById(`lang-chk-${l}`);
    const btn = document.getElementById(`lang-btn-${l}`);
    if (l === lang) {
      check.classList.remove('hidden');
      btn.className = "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all bg-brand-sage/10 border-brand-sage text-brand-sage w-full";
    } else {
      check.classList.add('hidden');
      btn.className = "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all bg-brand-cream border-brand-sage/10 hover:bg-brand-sage-light/35 w-full";
    }
  });

  translatePage();

  if (profileData) {
    profileData.language = lang;
    db.profile.put(profileData);
  }
}

// ============================================================================
// 4. SOS EMERGENCY HELPLINES MODAL
// ============================================================================
function openSOSModal() {
  document.getElementById('sos-modal').classList.remove('hidden');
}
function closeSOSModal() {
  document.getElementById('sos-modal').classList.add('hidden');
}
function triggerSOS() {
  openSOSModal();
}

// ============================================================================
// 5. SOCRATIC DOUBT BUDDY CHAT PANEL
// ============================================================================
function openDoubtBuddyPanel() {
  document.getElementById('doubt-buddy-panel').classList.remove('hidden');
  renderChatMessages();
}
function closeDoubtBuddyPanel() {
  document.getElementById('doubt-buddy-panel').classList.add('hidden');
}

async function renderChatMessages() {
  const messages = await db.chatHistory.orderBy('timestamp').toArray();
  const container = document.getElementById('chat-list');
  const emptyState = document.getElementById('chat-empty-state');
  
  document.getElementById('chat-limit-counter').innerText = chatUsageCount;

  if (messages.length === 0) {
    emptyState.classList.remove('hidden');
    container.innerHTML = '';
    return;
  }
  emptyState.classList.add('hidden');

  container.innerHTML = messages.map(msg => `
    <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[85%] rounded-2xl p-4 shadow-sm font-sans text-xs ${
        msg.sender === 'user'
          ? 'bg-brand-sage text-brand-cream rounded-tr-none'
          : 'bg-white text-brand-slate border border-brand-sage/10 rounded-tl-none'
      }">
        <p class="whitespace-pre-wrap leading-relaxed">${msg.message}</p>
        ${msg.sources && msg.sources.length > 0 ? `
          <div class="mt-2 pt-2 border-t border-brand-sage/10 text-[9px] text-brand-sage/80 space-y-1">
            <p class="font-bold uppercase tracking-wider">Search Grounded Sources:</p>
            <ul class="list-disc pl-3">
              ${msg.sources.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
  
  const scroll = document.getElementById('chat-messages-container');
  scroll.scrollTop = scroll.scrollHeight;
}

async function submitChatMessage(e) {
  if (e) e.preventDefault();
  
  const input = document.getElementById('chat-input-text');
  const text = input.value.trim();
  if (!text) return;

  if (chatUsageCount >= CHAT_USAGE_MAX) {
    alert("Session limit reached (15 queries) to encourage screen rest.");
    return;
  }

  chatUsageCount++;
  
  // Save user message
  const userMsg = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    sender: 'user',
    message: text
  };
  await db.chatHistory.add(userMsg);
  input.value = '';
  await renderChatMessages();

  // Get AI answer
  const history = await db.chatHistory.orderBy('timestamp').toArray();
  const response = await getDoubtBuddySocraticResponse(text, history);

  let finalMsg = response.message;
  let isSOS = false;
  if (finalMsg.includes('[SOS_REDIRECT]')) {
    finalMsg = finalMsg.replace('[SOS_REDIRECT]', '').trim();
    isSOS = true;
  }

  const aiMsg = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    sender: 'ai',
    message: finalMsg,
    sources: response.sources
  };
  await db.chatHistory.add(aiMsg);
  await renderChatMessages();

  if (isSOS) {
    openSOSModal();
  }
}

async function clearChatHistory() {
  if (confirm("Clear chat?")) {
    await db.chatHistory.clear();
    chatUsageCount = 0;
    renderChatMessages();
  }
}

function toggleChatVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  if (isChatListening) {
    chatRecognition.stop();
    return;
  }

  chatRecognition = new SpeechRecognition();
  chatRecognition.continuous = false;
  chatRecognition.interimResults = false;
  chatRecognition.lang = appLanguage === 'hi' ? 'hi-IN' : appLanguage === 'ta' ? 'ta-IN' : 'en-IN';

  chatRecognition.onstart = () => {
    isChatListening = true;
    document.getElementById('chat-voice-btn').classList.add('bg-brand-amber', 'text-brand-cream', 'animate-pulse');
  };

  chatRecognition.onend = () => {
    isChatListening = false;
    document.getElementById('chat-voice-btn').classList.remove('bg-brand-amber', 'text-brand-cream', 'animate-pulse');
  };

  chatRecognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById('chat-input-text').value = text;
  };

  chatRecognition.start();
}

// ============================================================================
// 6. HOME DASHBOARD LOADER
// ============================================================================
async function loadDashboard() {
  document.getElementById('home-profile-name').innerText = profileData?.name || 'Aspirant';
  document.getElementById('home-profile-avatar').innerText = profileData?.avatar || '🌸';
  document.getElementById('home-exam-target').innerText = `Exam Target: ${profileData?.currentExam || 'JEE'}`;

  // Load fuel card
  const bodyLogs = await db.bodyBrain.orderBy('date').reverse().limit(1).toArray();
  const fuelScore = bodyLogs.length > 0 ? bodyLogs[0].brainFuelScore : 70;
  document.getElementById('fuel-card-val').innerText = `${fuelScore}%`;

  // Load resilience card
  const journals = await db.journal.count();
  const studies = await db.studySessions.count();
  const habits = await db.bodyBrain.count();
  const totalLogs = journals + studies + habits;
  const resilienceScore = Math.min(100, 50 + (totalLogs * 3));
  document.getElementById('resilience-card-val').innerText = `${resilienceScore}%`;

  // Load mind balance card
  const pastJournals = await db.journal.orderBy('timestamp').reverse().limit(1).toArray();
  const confidenceScore = pastJournals.length > 0 && pastJournals[0].analysis ? pastJournals[0].analysis.confidence : 65;
  document.getElementById('mind-card-val').innerText = `${confidenceScore}%`;

  // Descriptive Coach recommendations (Replaces the chatbot wellness coaching)
  const coachBox = document.getElementById('home-coach-recs');
  
  let rec1 = "Write down today's reflection. I will compile detailed mental focus advice for you.";
  let rec2 = "Hydrate: A minor 5% drop in cellular hydration decreases focus efficiency by 15%. Log 1.5L more water today.";

  if (pastJournals.length > 0 && pastJournals[0].analysis) {
    rec1 = pastJournals[0].analysis.recommendation;
    if (pastJournals[0].analysis.stress > 65) {
      rec2 = "Nervous De-excitation: Try doing 3 cycles of Bhramari (humming) breathing right now to reduce vascular adrenaline levels.";
    } else if (pastJournals[0].analysis.burnout > 50) {
      rec2 = "Physical Backlog: Avoid late-night study tables tonight. Your brain needs REM sleep to form clean synaptic connections for tomorrow's revision.";
    }
  }

  coachBox.innerHTML = `
    <div class="p-5 bg-white rounded-xl border border-brand-sage/10 shadow-sm flex flex-col justify-between">
      <div>
        <span class="text-[10px] font-bold text-brand-sage uppercase tracking-wider">Mind Focus Guide</span>
        <h4 class="font-bold text-sm text-brand-slate mt-1">Psychological Directive</h4>
        <p class="text-xs text-brand-slate/85 mt-2 leading-relaxed font-sans">${rec1}</p>
      </div>
      <span class="text-[10px] text-brand-sage/60 font-semibold mt-4">Psychologist Lens Recommendation</span>
    </div>
    <div class="p-5 bg-white rounded-xl border border-brand-sage/10 shadow-sm flex flex-col justify-between">
      <div>
        <span class="text-[10px] font-bold text-brand-lavender uppercase tracking-wider">Body Engine Calibration</span>
        <h4 class="font-bold text-sm text-brand-slate mt-1">Habit Optimization</h4>
        <p class="text-xs text-brand-slate/85 mt-2 leading-relaxed font-sans">${rec2}</p>
      </div>
      <span class="text-[10px] text-brand-lavender/60 font-semibold mt-4">Staff Engineer Physical Audit</span>
    </div>
  `;

  // Render chart
  const chartLogs = await db.journal.orderBy('timestamp').reverse().limit(7).toArray();
  const chronLogs = chartLogs.reverse();

  const labels = chronLogs.length > 0 ? chronLogs.map(l => new Date(l.timestamp).toLocaleDateString(undefined, { weekday: 'short' })) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stressData = chronLogs.length > 0 ? chronLogs.map(l => l.analysis?.stress || 40) : [50, 55, 45, 60, 48, 40, 35];
  const anxietyData = chronLogs.length > 0 ? chronLogs.map(l => l.analysis?.anxiety || 35) : [40, 45, 38, 50, 42, 35, 30];
  const confidenceData = chronLogs.length > 0 ? chronLogs.map(l => l.analysis?.confidence || 60) : [60, 62, 65, 58, 68, 72, 75];

  if (moodChartRef) moodChartRef.destroy();
  const ctx = document.getElementById('moodChart').getContext('2d');
  moodChartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Stress', data: stressData, borderColor: '#C68A4C', backgroundColor: 'rgba(198, 138, 76, 0.08)', fill: true, tension: 0.3 },
        { label: 'Anxiety', data: anxietyData, borderColor: '#6F5E7C', backgroundColor: 'rgba(111, 94, 124, 0.05)', fill: true, tension: 0.3 },
        { label: 'Confidence', data: confidenceData, borderColor: '#5F7D6D', backgroundColor: 'rgba(95, 125, 109, 0.08)', fill: true, tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100 }
      },
      plugins: {
        legend: { labels: { boxWidth: 10, fontSize: 11 } }
      }
    }
  });
}

// ============================================================================
// 7. MIND SPACE DIARY LOADER
// ============================================================================
async function loadMindSpace() {
  const list = await db.journal.orderBy('timestamp').reverse().toArray();
  const container = document.getElementById('past-reflections-list');
  
  if (list.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-xs text-brand-slate/50">Your reflective diary is empty. Log today's thoughts above.</div>`;
    document.getElementById('mind-analysis-panel').classList.add('hidden');
    return;
  }

  const latest = list[0];
  if (latest.analysis) {
    document.getElementById('mind-analysis-panel').classList.remove('hidden');
    document.getElementById('mind-analysis-sentiment').innerText = latest.analysis.sentiment;
    document.getElementById('g-stress-val').innerText = `${latest.analysis.stress}%`;
    document.getElementById('g-stress-bar').style.width = `${latest.analysis.stress}%`;
    document.getElementById('g-anxiety-val').innerText = `${latest.analysis.anxiety}%`;
    document.getElementById('g-anxiety-bar').style.width = `${latest.analysis.anxiety}%`;
    document.getElementById('g-burnout-val').innerText = `${latest.analysis.burnout}%`;
    document.getElementById('g-burnout-bar').style.width = `${latest.analysis.burnout}%`;
    document.getElementById('g-confidence-val').innerText = `${latest.analysis.confidence}%`;
    document.getElementById('g-confidence-bar').style.width = `${latest.analysis.confidence}%`;
    document.getElementById('g-motivation-val').innerText = `${latest.analysis.motivation}%`;
    document.getElementById('g-motivation-bar').style.width = `${latest.analysis.motivation}%`;

    document.getElementById('mind-coach-text').innerText = latest.analysis.recommendation;
  }

  // Compile triggers
  const triggers = list.slice(0, 5).flatMap(e => e.analysis?.triggers || []);
  const uniqueTriggers = [...new Set(triggers)];
  const triggersBox = document.getElementById('mind-triggers-box');
  if (uniqueTriggers.length === 0) {
    triggersBox.innerText = "No recurring triggers detected yet. Keep journaling to surface patterns.";
  } else {
    triggersBox.innerHTML = uniqueTriggers.map(tr => `
      <span class="px-2 py-1 bg-brand-cream border border-brand-sage/20 text-brand-sage font-bold rounded-lg">⚡ ${tr}</span>
    `).join('');
  }

  container.innerHTML = list.map(entry => `
    <div class="p-4 bg-white border border-brand-sage/10 rounded-xl flex justify-between items-start hover:border-brand-sage/35 transition-colors">
      <div class="space-y-1.5 flex-1 pr-4">
        <div class="flex items-center gap-3">
          <span class="text-[9px] text-brand-slate/60 font-mono">${new Date(entry.timestamp).toLocaleString()}</span>
          ${entry.analysis ? `<span class="px-2 py-0.5 bg-brand-cream border border-brand-sage/15 rounded text-[9px] font-bold text-brand-sage">${entry.analysis.sentiment}</span>` : ''}
        </div>
        <p class="text-xs text-brand-slate/85 leading-relaxed font-sans">${entry.text}</p>
      </div>
      <button onclick="deleteJournal('${entry.id}')" class="p-1 text-brand-slate/40 hover:text-brand-amber transition-colors rounded-lg" aria-label="Delete entry">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');
  lucide.createIcons();
}

async function submitJournal() {
  const area = document.getElementById('journal-text-area');
  const text = area.value.trim();
  if (!text) return;

  document.getElementById('journal-submit-btn').innerHTML = `<span>Analyzing...</span>`;
  
  try {
    const analysis = await analyzeJournalText(text);
    const newEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      text,
      analysis
    };
    await db.journal.add(newEntry);
    area.value = '';
    await loadMindSpace();
  } catch (e) {
    console.error(e);
  } finally {
    document.getElementById('journal-submit-btn').innerHTML = `<i data-lucide="book-open" class="w-4 h-4"></i><span>Reflect & Analyze</span>`;
    lucide.createIcons();
  }
}

async function deleteJournal(id) {
  if (confirm("Delete this journal entry?")) {
    await db.journal.delete(id);
    loadMindSpace();
  }
}

function toggleSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  if (isJournalListening) {
    journalRecognition.stop();
    return;
  }

  journalRecognition = new SpeechRecognition();
  journalRecognition.continuous = false;
  journalRecognition.interimResults = false;
  journalRecognition.lang = appLanguage === 'hi' ? 'hi-IN' : appLanguage === 'ta' ? 'ta-IN' : 'en-IN';

  journalRecognition.onstart = () => {
    isJournalListening = true;
    const btn = document.getElementById('journal-voice-btn');
    btn.innerHTML = `<i data-lucide="mic-off" class="w-3.5 h-3.5"></i><span>Listening...</span>`;
    btn.classList.add('bg-brand-amber', 'text-brand-cream', 'animate-pulse');
    lucide.createIcons();
  };

  journalRecognition.onend = () => {
    isJournalListening = false;
    const btn = document.getElementById('journal-voice-btn');
    btn.innerHTML = `<i data-lucide="mic" class="w-3.5 h-3.5"></i><span>Start Voice Input</span>`;
    btn.classList.remove('bg-brand-amber', 'text-brand-cream', 'animate-pulse');
    lucide.createIcons();
  };

  journalRecognition.onresult = (event) => {
    const resultText = event.results[0][0].transcript;
    const area = document.getElementById('journal-text-area');
    area.value = area.value ? area.value + ' ' + resultText : resultText;
  };

  journalRecognition.start();
}

// ============================================================================
// 8. PAGE MODULE: BODY & BRAIN LOGS
// ============================================================================
async function loadBodyBrainPage() {
  const todayStr = new Date().toISOString().split('T')[0];
  const log = await db.bodyBrain.get(todayStr);
  
  if (log) {
    document.getElementById('slider-sleep').value = log.sleepHours;
    document.getElementById('slider-water').value = log.waterMl;
    document.getElementById('slider-activity').value = log.activityMinutes;
    document.getElementById('slider-nutrition').value = log.nutritionQuality;
    document.getElementById('body-fuel-val-top').innerText = log.brainFuelScore;
  }
  updateHabitSliders();
}

function updateHabitSliders() {
  const sl = parseFloat(document.getElementById('slider-sleep').value);
  const wa = parseInt(document.getElementById('slider-water').value);
  const ac = parseInt(document.getElementById('slider-activity').value);
  const nu = parseInt(document.getElementById('slider-nutrition').value);

  document.getElementById('slider-sleep-label').innerText = `${sl} hrs`;
  document.getElementById('slider-water-label').innerText = `${wa} ml`;
  document.getElementById('slider-activity-label').innerText = `${ac} mins`;
  document.getElementById('slider-nutrition-label').innerText = `${nu}/10`;
}

async function saveHabitLogs() {
  const sl = parseFloat(document.getElementById('slider-sleep').value);
  const wa = parseInt(document.getElementById('slider-water').value);
  const ac = parseInt(document.getElementById('slider-activity').value);
  const nu = parseInt(document.getElementById('slider-nutrition').value);

  // Calculations
  const sleepScore = Math.max(0, 100 - Math.abs(sl - 8) * 20);
  const waterScore = Math.min(100, (wa / 3000) * 100);
  const activityScore = Math.min(100, (ac / 30) * 100);
  const nutritionScore = nu * 10;
  const composite = Math.round((sleepScore * 0.35) + (waterScore * 0.25) + (activityScore * 0.20) + (nutritionScore * 0.20));

  const todayStr = new Date().toISOString().split('T')[0];
  const log = {
    date: todayStr,
    sleepHours: sl,
    waterMl: wa,
    activityMinutes: ac,
    nutritionQuality: nu,
    brainFuelScore: composite
  };

  await db.bodyBrain.put(log);
  document.getElementById('body-fuel-val-top').innerText = composite;
  alert("Daily habits logged successfully!");
}

function startBreathing(style) {
  breathingStyle = style;
  breathingActive = true;
  breathingPhase = 'Inhale';
  breathingTimer = 4;
  
  document.getElementById('pranayama-select-box').classList.add('hidden');
  document.getElementById('pranayama-active-box').classList.remove('hidden');

  const countLabel = document.getElementById('breath-sec-count');
  const phaseLabel = document.getElementById('breath-phase-text');
  const descLabel = document.getElementById('breath-desc-text');
  const circle = document.getElementById('breath-circle');

  if (style === 'anulom') {
    descLabel.innerText = "Close nostril A, inhale. Hold. Open B, exhale.";
  } else {
    descLabel.innerText = "Close ears with thumbs, make a soft humming bee vibration sound on exhale.";
  }

  breathingInterval = setInterval(() => {
    breathingTimer--;
    countLabel.innerText = `${breathingTimer}s`;

    if (breathingTimer <= 0) {
      if (breathingPhase === 'Inhale') {
        breathingPhase = 'Hold';
        phaseLabel.innerText = "Hold...";
        circle.style.transform = 'scale(1.2)';
        breathingTimer = 4;
      } else if (breathingPhase === 'Hold') {
        breathingPhase = 'Exhale';
        phaseLabel.innerText = "Exhale...";
        circle.style.transform = 'scale(1.0)';
        breathingTimer = 4;
      } else {
        breathingPhase = 'Inhale';
        phaseLabel.innerText = "Inhale...";
        circle.style.transform = 'scale(1.1)';
        breathingTimer = 4;
      }
    }
  }, 1000);
}

function stopBreathing() {
  breathingActive = false;
  clearInterval(breathingInterval);
  document.getElementById('pranayama-active-box').classList.add('hidden');
  document.getElementById('pranayama-select-box').classList.remove('hidden');
}

function togglePomo() {
  const btn = document.getElementById('pomo-play-btn');
  if (pomoActive) {
    clearInterval(pomoInterval);
    pomoActive = false;
    btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i>`;
  } else {
    pomoActive = true;
    btn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i>`;
    pomoInterval = setInterval(() => {
      pomoTimeLeft--;
      renderPomoClock();
      if (pomoTimeLeft <= 0) {
        if (pomoMode === 'study') {
          pomoMode = 'break';
          pomoTimeLeft = 300; // 5 mins break
          alert("Study cycle completed! Rest your eyes and stand up.");
        } else {
          pomoMode = 'study';
          pomoTimeLeft = 1500; // 25 mins
          alert("Break complete. Let's return to focus mode.");
        }
        document.getElementById('pomo-status').innerText = pomoMode === 'study' ? 'Current: Deep Study' : 'Current: Mind Rest Break';
      }
    }, 1000);
  }
  lucide.createIcons();
}

function resetPomo() {
  clearInterval(pomoInterval);
  pomoActive = false;
  pomoMode = 'study';
  pomoTimeLeft = 1500;
  renderPomoClock();
  document.getElementById('pomo-status').innerText = 'Current: Deep Study';
  document.getElementById('pomo-play-btn').innerHTML = `<i data-lucide="play" class="w-4 h-4"></i>`;
  lucide.createIcons();
}

function renderPomoClock() {
  const mins = Math.floor(pomoTimeLeft / 60);
  const secs = pomoTimeLeft % 60;
  document.getElementById('pomo-clock').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// 9. PAGE MODULE: EXAM PATH (EXPANDED DATES & MOCK LOGS)
// ============================================================================
let examSyllabusTracker = [];

async function loadExamPathPage() {
  const exam = profileData?.currentExam || 'JEE';
  document.getElementById('exam-badge-label').innerText = `Target: ${exam}`;

  const intel = EXAM_RESOURCES[exam] || EXAM_RESOURCES.JEE;
  document.getElementById('exam-pattern-text').innerText = intel.pattern;
  document.getElementById('exam-marking-text').innerText = intel.marking;
  document.getElementById('exam-pyq-text').innerText = intel.pyq;

  // Load Dates timeline (Features expanded)
  const datesBox = document.getElementById('exam-dates-box');
  const timelines = EXAM_DATES_DATABASE[exam] || EXAM_DATES_DATABASE.JEE;
  datesBox.innerHTML = timelines.map(t => `
    <div class="flex items-center justify-between border-b border-brand-sage/10 pb-2">
      <div>
        <p class="font-bold text-[11px] text-brand-slate">${t.label}</p>
        <p class="text-[10px] text-brand-sage">${t.date}</p>
      </div>
      <span class="px-2 py-0.5 text-[9px] rounded font-bold ${
        t.status === 'Upcoming' ? 'bg-brand-amber-light text-brand-amber' : 'bg-brand-sage-light text-brand-sage'
      }">${t.status}</span>
    </div>
  `).join('');

  // Core resources
  const list = document.getElementById('exam-resources-list');
  list.innerHTML = intel.resources.map(res => `<li>${res}</li>`).join('');

  // Initialize syllabus tracker
  if (exam === 'JEE') {
    examSyllabusTracker = [
      { id: '1', topic: 'Electrodynamics & Gauss Law', priority: 'High', status: 'todo', difficulty: 'Hard' },
      { id: '2', topic: 'Rotational Mechanics & Rigid Body', priority: 'High', status: 'doing', difficulty: 'Hard' },
      { id: '3', topic: 'Chemical Bonding & Hybridization', priority: 'High', status: 'done', difficulty: 'Medium' },
      { id: '4', topic: 'Differential Calculus & Limits', priority: 'Medium', status: 'todo', difficulty: 'Easy' }
    ];
  } else if (exam === 'NEET') {
    examSyllabusTracker = [
      { id: '1', topic: 'Human Physiology (Circulatory)', priority: 'High', status: 'doing', difficulty: 'Hard' },
      { id: '2', topic: 'Genetics & Inheritance laws', priority: 'High', status: 'todo', difficulty: 'Hard' },
      { id: '3', topic: 'Ray Optics & Wave Physics', priority: 'Medium', status: 'done', difficulty: 'Medium' }
    ];
  } else {
    examSyllabusTracker = [
      { id: '1', topic: 'Indian Polity - Fundamental Rights', priority: 'High', status: 'doing', difficulty: 'Medium' },
      { id: '2', topic: 'Modern History (1857-1947)', priority: 'High', status: 'done', difficulty: 'Easy' },
      { id: '3', topic: 'Macroeconomics - Inflation', priority: 'Medium', status: 'todo', difficulty: 'Hard' }
    ];
  }
  renderSyllabusList();
  renderStudySessionsChart();
  renderMockScoresChart();
}

function renderSyllabusList() {
  const box = document.getElementById('syllabus-tracker-list');
  box.innerHTML = examSyllabusTracker.map(t => `
    <div onclick="toggleSyllabusStatus('${t.id}')" class="p-4 bg-white rounded-xl border border-brand-sage/10 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-sage/35 transition-colors">
      <div>
        <h4 class="font-bold text-sm text-brand-slate flex items-center gap-2">
          <span>${t.topic}</span>
          <span class="text-[9px] px-2 py-0.5 rounded-full ${t.difficulty === 'Hard' ? 'bg-brand-amber-light text-brand-amber' : t.difficulty === 'Medium' ? 'bg-brand-lavender-light text-brand-lavender' : 'bg-brand-sage-light text-brand-sage'}">${t.difficulty}</span>
        </h4>
        <div class="flex gap-3 text-[9px] text-brand-slate/60 mt-1 font-semibold">
          <span>Priority: ${t.priority}</span>
          <span>•</span>
          <span>Status: ${t.status.toUpperCase()}</span>
        </div>
      </div>
      <div>
        ${t.status === 'done' ? `<i data-lucide="check-circle-2" class="w-5 h-5 text-brand-sage"></i>` : t.status === 'doing' ? `<i data-lucide="clock" class="w-5 h-5 text-brand-lavender"></i>` : `<i data-lucide="alert-circle" class="w-5 h-5 text-brand-slate/30"></i>`}
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function toggleSyllabusStatus(id) {
  examSyllabusTracker = examSyllabusTracker.map(t => {
    if (t.id === id) {
      const next = { todo: 'doing', doing: 'done', done: 'todo' };
      return { ...t, status: next[t.status] };
    }
    return t;
  });
  renderSyllabusList();
}

async function saveStudySession() {
  const subj = document.getElementById('log-subject').value.trim();
  const mins = parseInt(document.getElementById('log-duration').value);
  const hr = parseInt(document.getElementById('log-hour').value);
  const eff = parseInt(document.getElementById('log-efficiency').value);

  if (!subj) {
    alert("Enter a subject topic.");
    return;
  }

  const session = {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    subject: subj,
    durationSeconds: mins * 60,
    efficiencyScore: eff,
    hourOfDay: hr
  };
  await db.studySessions.add(session);
  document.getElementById('log-subject').value = '';
  alert("Study session logged!");
  renderStudySessionsChart();
}

async function renderStudySessionsChart() {
  const sessions = await db.studySessions.toArray();
  const container = document.getElementById('performanceChart');

  // Compile data
  const subjectMap = {};
  sessions.forEach(s => {
    if (!subjectMap[s.subject]) {
      subjectMap[s.subject] = { mins: 0, sumEff: 0, count: 0 };
    }
    subjectMap[s.subject].mins += s.durationSeconds / 60;
    subjectMap[s.subject].sumEff += s.efficiencyScore;
    subjectMap[s.subject].count++;
  });

  const labels = Object.keys(subjectMap).length > 0 ? Object.keys(subjectMap) : ['Physics', 'Chemistry', 'Maths'];
  const minsData = Object.keys(subjectMap).length > 0 ? Object.values(subjectMap).map(v => Math.round(v.mins)) : [180, 120, 240];
  const effData = Object.keys(subjectMap).length > 0 ? Object.values(subjectMap).map(v => Number((v.sumEff / v.count).toFixed(1))) : [7.5, 8.0, 6.8];

  if (performanceChartRef) performanceChartRef.destroy();
  const ctx = container.getContext('2d');
  performanceChartRef = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Study Mins', data: minsData, backgroundColor: '#5F7D6D', borderRadius: 4 },
        { label: 'Avg Efficiency', data: effData, backgroundColor: '#6F5E7C', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0 }
      },
      plugins: {
        legend: { labels: { boxWidth: 10, fontSize: 10 } }
      }
    }
  });
}

// 9b. Mock Test score logger functions
async function saveMockTestScore() {
  const subj = document.getElementById('mock-subject').value.trim();
  const score = parseInt(document.getElementById('mock-score').value);
  const max = parseInt(document.getElementById('mock-max').value);

  if (!subj || isNaN(score) || isNaN(max) || max <= 0) {
    alert("Please enter a valid topic name, obtained score, and maximum score.");
    return;
  }

  const mock = {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    subject: subj,
    score,
    maxScore: max
  };
  await db.mockTests.add(mock);
  document.getElementById('mock-subject').value = '';
  document.getElementById('mock-score').value = '';
  alert("Mock Score card logged!");
  renderMockScoresChart();
}

async function renderMockScoresChart() {
  const logs = await db.mockTests.toArray();
  const container = document.getElementById('mockTestChart');

  const labels = logs.length > 0 ? logs.map(l => l.subject) : ['Diagnostic 1', 'Diagnostic 2', 'Full Mock 1'];
  const percentageData = logs.length > 0 ? logs.map(l => Math.round((l.score / l.maxScore) * 100)) : [55, 62, 59];

  if (mockChartRef) mockChartRef.destroy();
  const ctx = container.getContext('2d');
  mockChartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Accuracy %',
        data: percentageData,
        borderColor: '#6F5E7C',
        backgroundColor: 'rgba(111, 94, 124, 0.1)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100 }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ============================================================================
// 10. PAGE MODULE: BEYOND MARKS & SVG GROWTH TREE
// ============================================================================
async function loadBeyondMarksPage() {
  const p = await db.purpose.get('main');
  if (p) {
    document.getElementById('why-input').value = p.whyStatement;
    document.getElementById('future-input').value = p.futureSelfText;
  }

  const exam = profileData?.currentExam || 'JEE';
  const paths = {
    JEE: {
      clearTitle: "IIT/NIT Engineering Route",
      clearDesc: "B.Tech in computer science, electronics, or mechanical. Leads to core tech research, software architecture, or venture capital startups.",
      altTitle: "Creative Technology & Applied Science Route",
      altDesc: "BCA/MCA, BSc Data Science, or Interaction Design. Leads to open-source development, UI/UX engineering, data analytics, and digital product design."
    },
    NEET: {
      clearTitle: "MBBS/BDS Clinical Route",
      clearDesc: "Clinical practice, hospital operations, surgery, or medical research institutes.",
      altTitle: "Biotechnology & Allied Healthcare Route",
      altDesc: "B.Sc Biotechnology, Genetics, Bioinformatics, Psychology. Leads to genomics research, pharmaceutical design, or clinical research coordination."
    },
    UPSC: {
      clearTitle: "Administrative (IAS/IPS/IFS) Route",
      clearDesc: "Public administration, policymaking, diplomatic services, and state welfare governance.",
      altTitle: "Policy, NGOs, & International Relations Route",
      altDesc: "Masters in Public Policy, development studies. Leads to policy advisory at UN/World Bank, consulting, research analysts, and leadership roles in global NGOs."
    }
  };

  const select = paths[exam] || paths.JEE;
  document.getElementById('clear-path-title').innerText = select.clearTitle;
  document.getElementById('clear-path-desc').innerText = select.clearDesc;
  document.getElementById('alt-path-title').innerText = select.altTitle;
  document.getElementById('alt-path-desc').innerText = select.altDesc;

  // Render tree leaves dynamically
  const journals = await db.journal.count();
  const studies = await db.studySessions.count();
  const habits = await db.bodyBrain.count();
  const totalLogs = journals + studies + habits;

  const resilienceScore = Math.min(100, 50 + (totalLogs * 3));
  document.getElementById('beyond-resilience-val').innerText = `${resilienceScore}%`;

  const leavesCount = Math.min(25, Math.max(3, totalLogs));
  document.getElementById('beyond-leaves-msg').innerHTML = `🌱 Your tree has grown <strong>${leavesCount} leaves</strong>! Keep logging to grow a dense, protective canopy.`;

  const treeSvg = document.getElementById('growth-tree-svg');
  const oldLeaves = treeSvg.querySelectorAll('.growth-leaf');
  oldLeaves.forEach(l => l.remove());

  const radius = 45;
  const centerX = 100;
  const centerY = 60;
  
  for (let i = 0; i < leavesCount; i++) {
    const angle = (i / leavesCount) * 2 * Math.PI - Math.PI / 2;
    const leafX = centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 8;
    const leafY = centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 8;

    const leafCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    leafCircle.setAttribute('cx', leafX);
    leafCircle.setAttribute('cy', leafY);
    leafCircle.setAttribute('r', i % 2 === 0 ? "7" : "9");
    leafCircle.setAttribute('class', 'growth-leaf fill-[#5F7D6D] stroke-[#FAF8F5] stroke-1 animate-pulse');
    leafCircle.style.animationDuration = `${3 + (i % 3)}s`;
    treeSvg.appendChild(leafCircle);
  }
}

async function savePurposeLogs() {
  const why = document.getElementById('why-input').value.trim();
  const fut = document.getElementById('future-input').value.trim();

  const log = {
    id: 'main',
    whyStatement: why,
    futureSelfText: fut
  };
  await db.purpose.put(log);
  alert("Purpose statements logged successfully!");
  loadBeyondMarksPage();
}

// ============================================================================
// 11. PAGE MODULE: FAMILY BRIDGE
// ============================================================================
async function loadFamilyBridgePage() {
  document.getElementById('parent-summary-output-box').classList.add('hidden');
  document.getElementById('parent-summary-text').innerText = '';
  loadDiscussionScript(null);
}

async function buildParentSummary() {
  const btn = document.getElementById('summary-gen-btn');
  btn.innerHTML = `<span>Generating summary...</span>`;

  try {
    const journals = await db.journal.orderBy('timestamp').reverse().limit(3).toArray();
    const combinedTexts = journals.map(j => j.text);

    const res = await generateCounselorParentSummary(combinedTexts);
    document.getElementById('parent-summary-text').innerText = res;
    document.getElementById('parent-summary-output-box').classList.remove('hidden');
  } catch (e) {
    console.error(e);
  } finally {
    btn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i><span data-t="generateSummary">Generate Parent Summary</span>`;
    lucide.createIcons();
  }
}

function copyParentSummary() {
  const text = document.getElementById('parent-summary-text').innerText;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('copy-summary-btn');
  btn.innerText = "✓ Copied!";
  setTimeout(() => btn.innerText = "Copy Summary Text", 3000);
}

const SCRIPTS_DATABASE = {
  burnout: {
    title: "Discussing Physical Burnout & Needing Rest",
    initiator: "Mom/Dad, I've been studying 10 hours a day and my brain is feeling extremely exhausted. I'm struggling to retain information. I need to take tomorrow off to rest and sleep so I can return to focus next week.",
    parent: "But you have a mock test next week, if you rest you will fall behind the competition!",
    steer: "I understand mock exams are important, but studying with a fatigued brain is causing my scores to slip. Taking a structured 1-day break is a proven strategy to boost long-term memory. It's an investment, not slacking off.",
    tip: "Avoid shouting. Use facts about brain science and assure them you are committed to the long-run preparation."
  },
  scores: {
    title: "Discussing Drop in Mock Test Scores",
    initiator: "Dad/Mom, I wanted to share that my mock test score dropped today. I'm disappointed too. I've analyzed my errors; they are mostly in Calculus. I need your support while I work on this backlog rather than feeling reprimanded.",
    parent: "With these marks, how will you clear the main cutoff? You need to study more!",
    steer: "Mock tests are diagnostic guides designed to expose errors. It is better to fail now and fix the gap than fail in the final exam. I need encouragement and a calm environment to fix my weak chapters.",
    tip: "Explain that mock tests are meant to be hard and reveal weak spots, not to serve as final results."
  },
  alternatives: {
    title: "Discussing Career Alternatives (Parallel Paths)",
    initiator: "Mom/Dad, I am preparing my best for the exam. But I also want us to talk about alternative pathways like B.Sc Data Science or BCA, just in case. Knowing we have a backup plan reduces my daily pressure and helps me study better.",
    parent: "Are you giving up already? If you think of alternatives, you won't focus on the main exam!",
    steer: "I'm not giving up; I'm studying hard. But stress rises when there's only one door open. Knowing there's another valid door makes me feel safe, which actually increases my focus and performance on the exam.",
    tip: "Frame the backup plan as a psychological safety net that optimizes exam performance."
  }
};

function loadDiscussionScript(scriptId) {
  document.querySelectorAll('.scr-btn').forEach(btn => {
    btn.className = "scr-btn px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white border-brand-sage/10 hover:border-brand-sage/40 transition-colors";
  });

  if (!scriptId) {
    document.getElementById('script-placeholder').classList.remove('hidden');
    document.getElementById('script-content-box').classList.add('hidden');
    return;
  }

  document.getElementById('script-placeholder').classList.add('hidden');
  document.getElementById('script-content-box').classList.remove('hidden');

  const activeBtn = document.getElementById(`scr-btn-${scriptId}`);
  activeBtn.className = "scr-btn px-3 py-1.5 rounded-lg text-xs font-semibold border bg-brand-sage text-brand-cream border-brand-sage transition-colors";

  const script = SCRIPTS_DATABASE[scriptId];
  document.getElementById('script-initiator').innerText = `"${script.initiator}"`;
  document.getElementById('script-concern').innerText = `"${script.parent}"`;
  document.getElementById('script-steering').innerText = `"${script.steer}"`;
  document.getElementById('script-tip').innerHTML = `<strong>Advice:</strong> ${script.tip}`;
}

// ============================================================================
// 12. PAGE MODULE: SETTINGS LOADER
// ============================================================================
function loadSettingsPage() {
  document.getElementById('settings-profile-uuid').innerText = `Profile ID: ${profileData?.id || 'Generating...'}`;
  document.getElementById('settings-nickname').value = profileData?.name || 'Aspirant';
  document.getElementById('settings-exam').value = profileData?.currentExam || 'JEE';
  document.getElementById('settings-api-key').value = localStorage.getItem('VITE_GEMINI_API_KEY') || '';

  const avatars = ['🌸', '☀️', '🌱', '🦉', '🎓', '🦁', '🐬', '🍀'];
  const container = document.getElementById('avatar-select-list');
  
  container.innerHTML = avatars.map(av => `
    <button type="button" onclick="selectSettingsAvatar('${av}')" id="av-btn-${av}" class="w-12 h-12 text-2xl flex items-center justify-center rounded-xl transition-all ${profileData?.avatar === av ? 'bg-brand-sage/20 border-2 border-brand-sage scale-110 shadow-sm' : 'bg-brand-cream hover:bg-brand-sage-light/30 border border-brand-sage/10'}">
      ${av}
    </button>
  `).join('');
}

function selectSettingsAvatar(av) {
  if (profileData) {
    profileData.avatar = av;
    loadSettingsPage();
  }
}

async function saveProfileChanges(e) {
  if (e) e.preventDefault();

  const nick = document.getElementById('settings-nickname').value.trim();
  const targetExam = document.getElementById('settings-exam').value;
  const apiKey = document.getElementById('settings-api-key').value.trim();

  if (profileData) {
    profileData.name = nick || 'Aspirant';
    profileData.currentExam = targetExam;
    await db.profile.put(profileData);
  }

  if (apiKey) {
    localStorage.setItem('VITE_GEMINI_API_KEY', apiKey);
  } else {
    localStorage.removeItem('VITE_GEMINI_API_KEY');
  }

  const success = document.getElementById('settings-save-success');
  success.classList.remove('hidden');
  setTimeout(() => success.classList.add('hidden'), 3000);
}

async function wipeDatabase() {
  if (confirm("Are you absolutely sure? This will delete all local reflections, study schedules, and habits.")) {
    await resetIndexedDB();
    localStorage.clear();
    alert("All local browser data wiped out successfully.");
    window.location.reload();
  }
}

// ============================================================================
// 13. INITIALIZATION & ENGINE KICKSTART
// ============================================================================
const EXAM_RESOURCES = {
  JEE: {
    pattern: "3 Hours CBT. Math, Physics, Chemistry. 90 Questions.",
    marking: "+4 Correct, -1 Incorrect. Total: 300 Marks.",
    pyq: "Calculus in math, Electrodynamics in physics, and Organic Chemistry carry 55% weight.",
    resources: ["HC Verma Physics Vol 1 & 2", "NCERT Chemistry Texts", "Cengage Math Series", "NPTEL Video Lectures"]
  },
  NEET: {
    pattern: "3 Hours 20 Mins. Physics, Chemistry, Biology. 200 Questions.",
    marking: "+4 Correct, -1 Incorrect. Total: 720 Marks.",
    pyq: "Human Physiology, Genetics, Plant Anatomy, Mole Concept dominate PYQ chapters.",
    resources: ["NCERT Biology Textbook", "Concepts of Physics by H.C. Verma", "Chemistry Fingerprints", "Physics Wallah Playlists"]
  },
  UPSC: {
    pattern: "GS Prelims (MCQs), CSAT (Qualifying), Mains Written Papers + Optionals.",
    marking: "-0.66 marks for Prelims incorrect. CSAT requires 33% to pass.",
    pyq: "Modern Indian History, Laxmikanth Polity, Geography account for 50%+ pre-syllabus.",
    resources: ["Indian Polity by M. Laxmikanth", "A Brief History of Modern India", "Union Economic Survey", "VisionIAS Bulletins"]
  },
  GATE: {
    pattern: "3 Hours CBT. core stream engineering + maths + general aptitude.",
    marking: "-1/3 for 1-mark MCQ, -2/3 for 2-mark MCQ. NAT/MSQ has no negative marks.",
    pyq: "Engineering Math & General Aptitude make up 28% marks across all branches.",
    resources: ["Standard Stream Textbooks", "MadeEasy GATE Guides", "NPTEL Online Core Lectures"]
  },
  CAT: {
    pattern: "2 Hours CBT. VARC, DILR, QA sections.",
    marking: "+3 Correct, -1 MCQ Incorrect. TITA has no negative marks.",
    pyq: "Arithmetic & Algebra cover 60% QA problems; VARC is dominated by Reading Comprehension.",
    resources: ["Arun Sharma QA preparations", "Word Power Made Easy", "TIME mock practice modules"]
  }
};

async function initApplication() {
  const allProfiles = await db.profile.toArray();
  if (allProfiles.length > 0) {
    profileData = allProfiles[0];
  } else {
    profileData = {
      id: crypto.randomUUID(),
      name: `Aspirant-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: '🌸',
      currentExam: 'JEE',
      dyslexiaMode: false,
      calmMode: false,
      language: 'en'
    };
    await db.profile.put(profileData);
  }

  appLanguage = profileData.language || 'en';
  calmModeActive = profileData.calmMode || false;
  dyslexiaFontActive = profileData.dyslexiaMode || false;

  if (calmModeActive) {
    document.body.classList.add('calm-mode');
    document.getElementById('calm-toggle-thumb').classList.replace('translate-x-0', 'translate-x-6');
    document.getElementById('calm-toggle-btn').classList.replace('bg-brand-slate/20', 'bg-brand-sage');
  }
  if (dyslexiaFontActive) {
    document.body.classList.add('dyslexia-font');
    document.getElementById('dyslexia-toggle-thumb').classList.replace('translate-x-0', 'translate-x-6');
    document.getElementById('dyslexia-toggle-btn').classList.replace('bg-brand-slate/20', 'bg-brand-sage');
  }

  changeAppLang(appLanguage);
  switchTab('home');
  lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', initApplication);
