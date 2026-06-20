/**
 * ============================================================================
 * ANTARDRISHTI MIND - BUILT-IN AI CONNECTOR (GEMINI)
 * ============================================================================
 */

// Built-in Gemini API Key for research/testing purposes
const BUILTIN_GEMINI_KEY = ""; // Kept blank to utilize secure local fallback and respect safe token transmission, but can be updated by the user/system.

// Basic input sanitization
function sanitizeInput(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

// Distress safety keyword check
function detectSafetyDistress(text) {
  const normalized = text.toLowerCase();
  const distressKeywords = [
    'suicide', 'self-harm', 'kill myself', 'end my life', 'want to die', 
    'die', 'harm myself', 'cannot live', 'give up my life', 'ending it all',
    'ending everything', 'no reason to live', 'depressed and want to die'
  ];
  return distressKeywords.some(keyword => normalized.includes(keyword));
}

// Global API caller
async function callGeminiAPI(systemPrompt, userPrompt) {
  const customKey = localStorage.getItem('VITE_GEMINI_API_KEY');
  const apiKey = customKey || BUILTIN_GEMINI_KEY;

  if (!apiKey) {
    return null; // Fallback to local Socratic mocks
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: systemPrompt.includes('JSON') ? 'application/json' : 'text/plain',
          temperature: 0.2,
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
      }
    }
  } catch (e) {
    console.warn("Gemini API call failed, using secure local Socratic mock instead.", e);
  }
  return null;
}

/**
 * 1. Analyze daily journal entry
 */
async function analyzeJournalText(text) {
  const sanitized = sanitizeInput(text);
  if (!sanitized) return null;

  const systemPrompt = `
    You are a warm child and adolescent psychologist supporting Indian competitive exam aspirants (JEE, NEET, UPSC, etc.).
    Analyze the student's entry and return a JSON object with:
    {
      "sentiment": "A brief 2-3 word description of the core emotion",
      "stress": <number 0-100 representing stress>,
      "anxiety": <number 0-100 representing anxiety>,
      "confidence": <number 0-100 representing confidence>,
      "burnout": <number 0-100 representing burnout>,
      "motivation": <number 0-100 representing motivation>,
      "triggers": ["Specific trigger patterns identified, e.g. Chemistry syllabus, mock test scores, parental comparison"],
      "recommendation": "A highly descriptive, practical, and comforting wellness recommendation. Offer a direct micro-action."
    }
    Tone: Grow and learn. Avoid clinical jargon or deficit descriptions.
  `;

  const response = await callGeminiAPI(systemPrompt, sanitized);
  if (response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse journal analysis JSON", e);
    }
  }

  // FALLBACK: Local Socratic Mock Analyzer
  return getLocalMockAnalysis(sanitized);
}

/**
 * 2. Socratic Doubt Buddy academic tutor
 */
async function getDoubtBuddySocraticResponse(message, history) {
  const sanitized = sanitizeInput(message);
  
  if (detectSafetyDistress(sanitized)) {
    return {
      message: "[SOS_REDIRECT] I'm really concerned about how you're feeling right now. Let's step away from exam preparation. Please check the SOS Help panel at the bottom right of your screen for immediate, compassionate helpline support."
    };
  }

  const systemPrompt = `
    You are a Socratic tutor for competitive exams (Physics, Chemistry, Maths, Biology, General Studies).
    Rule 1: Break down doubts step-by-step. Do not provide raw copy-paste answers. Guide the student using questions.
    Rule 2: If the user inputs distress, stop teaching and immediately output exactly '[SOS_REDIRECT]' followed by a redirection to the SOS panel.
  `;

  const context = history.map(h => `${h.sender === 'user' ? 'Student' : 'Doubt Buddy'}: ${h.message}`).join('\n');
  const response = await callGeminiAPI(systemPrompt, `Context:\n${context}\n\nStudent Doubt:\n${sanitized}`);

  if (response) {
    // Determine sources based on keyword matches
    const sources = [];
    if (sanitized.toLowerCase().includes('force') || sanitized.toLowerCase().includes('newton')) {
      sources.push("NCERT Physics Class 11 - Chapter 5: Laws of Motion");
    } else {
      sources.push("NCERT Core Reference Material (Academic Year 2025-2026)");
    }
    return { message: response, sources };
  }

  // FALLBACK: Socratic Mock Responses
  return getLocalSocraticMock(sanitized);
}

/**
 * 3. Parent summary generator (translates stress into constructive updates)
 */
async function generateCounselorParentSummary(entriesTextList) {
  const systemPrompt = `
    You are a compassionate student counselor speaking to an Indian parent.
    Summarize the emotional well-being of the student based on the logs provided.
    Rules:
    1. NEVER share the raw journal content, specific secrets, or private details.
    2. Translate anxiety and stress into constructive advice for parents (how they can help).
    3. Keep it brief (2-3 bullet points).
  `;

  const combined = entriesTextList.join('\n---\n');
  const response = await callGeminiAPI(systemPrompt, combined || "No data logged yet.");
  if (response) {
    return response;
  }

  // FALLBACK: Local mock summary
  const lower = combined.toLowerCase();
  let status = "is preparing steadily for their upcoming examinations.";
  let tip = "Encourage them to maintain standard study hours and avoid late-night cramming.";

  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('scared')) {
    status = "is currently experiencing heightened pressure regarding exam preparations, particularly around mock tests.";
    tip = "Help reassure them that mock scores are just feedback for learning, and their wellness is your top priority. Simply offering a warm cup of milk or a quiet walk can help.";
  } else if (lower.includes('tired') || lower.includes('sleep') || lower.includes('exhausted')) {
    status = "is showing signs of physical fatigue and sleep backlog from studying late.";
    tip = "Remind them gently that a rested brain retains information much better. Encourage a regular bedtime and help ensure they stay hydrated.";
  }

  return `• **Current State:** Your child ${status}\n• **How to Support:** ${tip}\n• **Suggested Action:** Ask them, "How can I help make your study desk more comfortable today?" rather than asking "How many chapters did you finish?"`;
}

// ============================================================================
// LOCAL LOGICAL FALLBACK ENGINES
// ============================================================================

function getLocalMockAnalysis(text) {
  const lower = text.toLowerCase();
  let stress = 35, anxiety = 30, confidence = 65, burnout = 25, motivation = 75;
  const triggers = [];

  if (lower.includes('physics') || lower.includes('chemistry') || lower.includes('math') || lower.includes('biology')) {
    triggers.push('Academic Subject Backlogs');
    stress += 15; anxiety += 10;
  }
  if (lower.includes('test') || lower.includes('mock') || lower.includes('exam') || lower.includes('marks')) {
    triggers.push('Mock Test Performance');
    stress += 20; anxiety += 20; confidence -= 15;
  }
  if (lower.includes('parent') || lower.includes('father') || lower.includes('mother') || lower.includes('expect')) {
    triggers.push('Family Expectations');
    anxiety += 15; stress += 10;
  }
  if (lower.includes('tired') || lower.includes('sleep') || lower.includes('exhausted')) {
    triggers.push('Physical Fatigue');
    burnout += 30; motivation -= 15;
  }

  let sentiment = 'Balanced & Preparing';
  if (stress > 60) sentiment = 'Overwhelmed & Anxious';
  else if (burnout > 50) sentiment = 'Physically Exhausted';
  else if (confidence < 45) sentiment = 'Doubtful & Stressed';

  let recommendation = "You are putting in hard work. Consider writing down one topic you feel comfortable with today, and taking a 5-minute screen-free break.";
  if (stress > 60) {
    recommendation = "Your stress levels are elevated. Try the 4-second Anulom Vilom breathing exercise in our Body & Brain section to reset your nervous system.";
  } else if (burnout > 50) {
    recommendation = "You've been studying hard, but your brain needs rest to form long-term memories. Prioritize 7-8 hours of sleep tonight.";
  } else if (triggers.includes('Family Expectations')) {
    recommendation = "Expectation pressure can feel heavy. Try generating a Parent Connect summary in the Family Bridge to help share your state gently.";
  }

  return {
    sentiment,
    stress: Math.min(100, stress),
    anxiety: Math.min(100, anxiety),
    confidence: Math.max(0, confidence),
    burnout: Math.min(100, burnout),
    motivation: Math.min(100, motivation),
    triggers,
    recommendation
  };
}

function getLocalSocraticMock(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('newton') || lower.includes('force') || lower.includes('law')) {
    return {
      message: `Let's work through Newton's Second Law together!
      
Newton's Second Law states that force is directly proportional to the rate of change of momentum. 

Before we jump into the formula \\(F = ma\\), let's answer this: If you push a light plastic ball and a heavy metal ball with the exact same amount of force, which one will accelerate faster? Why do you think that happens? Try writing your thoughts below!`,
      sources: ["NCERT Physics Class 11 - Laws of Motion", "HC Verma Concepts of Physics Vol 1"]
    };
  }

  if (lower.includes('organic') || lower.includes('carbon') || lower.includes('reaction') || lower.includes('chemistry')) {
    return {
      message: `Organic Chemistry is all about the flow of electrons!

To understand substitution or elimination reactions, we first need to look at the electrophile and nucleophile. 
Can you tell me which atom in a Chloromethane (\\(CH_3Cl\\)) molecule is more electronegative, and how that creates a positive charge center on the carbon? 

Let's start there!`,
      sources: ["NCERT Chemistry Class 12 - Haloalkanes and Haloarenes"]
    };
  }

  if (lower.includes('calculus') || lower.includes('integration') || lower.includes('derivative') || lower.includes('limit') || lower.includes('math')) {
    return {
      message: `Let's look at Calculus conceptually!
      
Integration represents finding the accumulated area under a curve, while a derivative represents the instantaneous rate of change at a single point.

If you have a function \\(y = x^2\\), its derivative is \\(2x\\). 
Can you explain in your own words what happens to the slope of this curve as \\(x\\) gets larger? Does the curve get steeper or flatter?`,
      sources: ["NCERT Mathematics Class 12 - Integrals & Derivatives", "RD Sharma Class 12 Mathematics"]
    };
  }

  if (lower.includes('cell') || lower.includes('gene') || lower.includes('blood') || lower.includes('heart') || lower.includes('biology') || lower.includes('neet')) {
    return {
      message: `Biology is best understood as an integrated system!

Let's look at the flow of genetics: DNA is transcribed into RNA, which is then translated into proteins. 

To help us dive in: What do you think would happen to a cell's protein synthesis if we introduced a molecule that blocks RNA Polymerase from binding to DNA? How would that affect the cell's survival?`,
      sources: ["NCERT Biology Class 12 - Molecular Basis of Inheritance", "Trueman's Elementary Biology Vol 2"]
    };
  }

  if (lower.includes('polity') || lower.includes('constitution') || lower.includes('history') || lower.includes('upsc') || lower.includes('gandhi')) {
    return {
      message: `UPSC preparation is about analyzing links between history, society, and governance!

Let's look at the Indian Constitution. Article 21 guarantees the Protection of Life and Personal Liberty. 

To explore this: Why do you think the Supreme Court has expanded the scope of Article 21 over the years to include rights like the 'Right to Clean Environment' and 'Right to Privacy'? What is the relationship between personal liberty and quality of life?`,
      sources: ["Indian Polity by M. Laxmikanth", "Introduction to the Constitution of India by D.D. Basu"]
    };
  }

  if (lower.includes('stressed') || lower.includes('burnout') || lower.includes('tired') || lower.includes('exhausted') || lower.includes('depressed') || lower.includes('scared') || lower.includes('fail')) {
    return {
      message: `I hear you, and it is completely normal to feel this way under exam pressure. Competitive exams in India carry high psychological stakes.

Socratic guidance isn't just for academic doubts; let's unpack this feeling:
1. When you think about 'failing' or 'falling behind', is it the actual study material that feels hard, or is it the weight of family expectations and comparison?
2. What is one small, screen-free action you can take right now (like having a glass of water, stretching, or stepping outside for 3 minutes) to bring your focus back to the present moment?

Your worth is far greater than any exam score. Let's take it one day, one breath at a time.`,
      sources: ["Antardrishti Mind - Wellness Guidelines", "National Institute of Mental Health and Neurosciences (NIMHANS) Student Wellness Guide"]
    };
  }

  if (lower.includes('syllabus') || lower.includes('weight') || lower.includes('jee') || lower.includes('neet')) {
    return {
      message: `For competitive exam strategy, we want to prioritize high-yield topics.
      
For example:
- **JEE Physics:** Modern Physics, Electrodynamics, and Mechanics make up over 55% of the exam.
- **NEET Biology:** Human Physiology and Genetics are extremely high weightage.

What subject are you currently studying? Let's check which topics you should cover first to reduce syllabus pressure.`,
      sources: ["NTA JEE Main Weightage Guidelines 2025", "NTA NEET Chapterwise Trends 2025"]
    };
  }

  // Default Socratic answer
  return {
    message: `That's an interesting question! Socratic tutoring works best when we tackle it step-by-step.

Could you share:
1. What formula or concept you think applies to this problem?
2. Where did you get stuck in your first attempt?

Let's break it down together!`,
    sources: ["NCERT Core Reference Guidelines"]
  };
}
