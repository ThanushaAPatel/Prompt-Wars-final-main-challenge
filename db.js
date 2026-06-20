/**
 * ============================================================================
 * ANTARDRISHTI MIND - DEXIE DATABASE UTILITIES
 * ============================================================================
 */

// Initialize Dexie Database
const db = new Dexie('AntardrishtiDB');

// Define Schema
db.version(2).stores({
  profile: 'id',
  journal: 'id, timestamp',
  bodyBrain: 'date',
  studySessions: 'id, date, subject',
  mockTests: 'id, date, subject', // Added for mock test score logging
  purpose: 'id',
  chatHistory: 'id, timestamp'
});

// Helper: Clear all database tables
async function resetIndexedDB() {
  await db.profile.clear();
  await db.journal.clear();
  await db.bodyBrain.clear();
  await db.studySessions.clear();
  await db.mockTests.clear();
  await db.purpose.clear();
  await db.chatHistory.clear();
}
