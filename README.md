# Antardrishti Mind — 🌸

> **Beyond Marks. Beyond Stress. Towards Growth.**
> An AI-powered student growth and mental resilience ecosystem for competitive-exam aspirants (JEE, NEET, UPSC, GATE, CAT, CUET).

---

## 📖 The Problem

Millions of Indian students preparing for competitive exams experience chronic stress, anxiety, burnout, and fear of failure. Existing prep apps ignore emotional health, wellness apps ignore exam load, and parents are often locked out of constructive communication. 

**Antardrishti Mind** treats the student as a whole person — mind, body, habits, relationships, and purpose — not a score to optimize. Every feature in this ecosystem is traceable directly to these gaps. For a detailed breakdown, please see our **[Problem-to-Feature Map (PROBLEM_MAP.md)](file:///c:/Users/Thanusha%20A%20Patel/OneDrive/Desktop/Prompt%20wars%20main%20challenge/PROBLEM_MAP.md)**.

---

## 🔒 Identity Model: No Login by Design

There is no signup, login, or password screen in this app. On first launch, a local, anonymous **Student Profile ID** (UUID) is generated and stored locally in your browser's **IndexedDB**. 

### Rationale:
Treat this explicitly as a structural security decision:
1. **No credential leakages:** No password hashes stored, no authentication tokens transmitted, and zero account takeover surface.
2. **Absolute data ownership:** All journal reflections, study logs, and habits remain strictly on-device.

### Honest Trade-offs:
- **No Cross-Device Sync:** Your data is restricted to this browser. It does not sync across devices.
- **Data Loss on Cache Wipe:** Clearing your browser cache will erase database contents.
- **Roadmap:** Cross-device encrypted syncing is planned as a *Phase 2: optional cloud sync* roadmap item.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4, Lucide React
- **Data Visualizations:** Recharts (Mood trends & Focus efficiency)
- **Persistence:** IndexedDB (via Dexie) for structured local storage
- **AI Integrations:** Google Gemini API (with robust Socratic local mocks if no key is configured)
- **Voice Recognition:** Web Speech API for voice journal and academic inputs
- **Testing:** Vitest for scoring calculations and safety-routing unit tests

---

## 🚀 Setup & Launch

### 1. Install Dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Copy the `.env.example` file and create a `.env` file:
```bash
cp .env.example .env
```
Add your Google Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```
*Note: If this key is omitted, the app runs local Socratic mocks for journal and academic doubt analyses.*

### 3. Run Development Server:
```bash
npm run dev
```

### 4. Run Test Suite:
```bash
npm run test
```

### 5. Build for Production:
```bash
npm run build
```

---

## 🗺️ Phase 2 Roadmap
- [ ] End-to-end encrypted optional cloud sync using Web3 / Decentralized identities.
- [ ] Offline-first service worker cache for complete network independence.
- [ ] Optional opt-in teacher workspace view for mentoring reviews.
