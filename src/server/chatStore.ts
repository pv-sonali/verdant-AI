import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import { ChatThread } from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

// In-memory cache of chat threads
let chatsCache: ChatThread[] = [];
let mongoDb: Db | null = null;

// Seed initial representative threads like in ChatGPT
const SEED_THREADS: ChatThread[] = [
  {
    id: 'thread_seed_1',
    title: 'Tomato Early Blight Fungicide Timing',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString(),
    cropContext: 'Tomato',
    diseaseContext: 'Early Blight',
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        text: 'What is the best spray interval for Mancozeb 75% WP on tomatoes showing early blight?',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg_2',
        sender: 'agronomist',
        text: `**Mancozeb 75% WP Application Guidelines for Tomato Early Blight:**

1. **Dosage:** Mix **2.0 to 2.5 grams** per liter of clean water (approx. 500-600g per 200L drum/acre).
2. **Spray Interval:** Apply at **7 to 10 day intervals** during overcast, humid weather; extend to 12-14 days during dry periods.
3. **Application Timing:** Spray early morning (before 9:30 AM) or late afternoon after dew evaporates. Ensure thorough coverage of both upper and lower leaf surfaces.
4. **Pre-Harvest Interval (PHI):** Strictly observe a **7-day waiting period** before harvesting fruit.
5. **Safety Warning:** Always wear chemical-resistant nitrile gloves, eye goggles, and a particle respirator mask. Do not spray if rain is forecast within 4 hours.`,
        timestamp: '10:16 AM'
      },
      {
        id: 'msg_3',
        sender: 'user',
        text: 'Can I alternate with Azoxystrobin to prevent resistance?',
        timestamp: '10:18 AM'
      },
      {
        id: 'msg_4',
        sender: 'agronomist',
        text: `Yes, excellent practice! Rotating fungicide chemical classes (FRAC groups) is essential:

• **Mancozeb** is a multi-site protectant (FRAC Group M03) with very low resistance risk.
• **Azoxystrobin** (e.g., Amistar 23% SC at 1.0 ml/L) is a systemic strobilurin (FRAC Group 11).

**Recommended Rotation:**
Apply Mancozeb first as a protectant, then alternate with Azoxystrobin after 10-12 days. Never apply Azoxystrobin more than 2 consecutive times in a season.`,
        timestamp: '10:19 AM'
      }
    ]
  },
  {
    id: 'thread_seed_2',
    title: 'Organic 0.5% Neem Seed Oil Preparation',
    createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 35).toISOString(),
    cropContext: 'General Crop',
    diseaseContext: 'Fungal & Sucking Pests',
    messages: [
      {
        id: 'msg_5',
        sender: 'user',
        text: 'How do I prepare a 0.5% neem seed oil spray using household soap as an emulsifier?',
        timestamp: 'Yesterday 3:30 PM'
      },
      {
        id: 'msg_6',
        sender: 'agronomist',
        text: `**Standard Preparation for 0.5% Pure Cold-Pressed Neem Oil Spray (for 10 Liters of Water):**

• **Ingredients:**
  - Pure cold-pressed Neem Oil: **50 ml** (5 ml per liter)
  - Mild liquid soap or liquid detergent (emulsifier): **10 ml** (1 ml per liter)
  - Clean water: **10 Liters**

• **Step-by-Step Method:**
  1. Pour 50ml neem oil into a clean container.
  2. Add 10ml liquid soap and stir vigorously until the oil and soap form a uniform emulsion.
  3. Gradually add 1 liter of lukewarm water while stirring until the mixture turns milky white with no floating oil droplets.
  4. Pour the concentrate into the sprayer tank and top up with remaining 9 liters of water.
  5. Agitate the tank well before spraying.

• **Best Practice:** Use within 6 hours of preparation. Apply in the late evening to prevent UV degradation and protect foraging bees.`,
        timestamp: 'Yesterday 3:32 PM'
      }
    ]
  }
];

function loadLocalChats(): void {
  try {
    if (fs.existsSync(CHATS_FILE)) {
      const raw = fs.readFileSync(CHATS_FILE, 'utf-8');
      chatsCache = JSON.parse(raw);
    } else {
      chatsCache = [...SEED_THREADS];
      saveToDisk();
    }
  } catch (err) {
    console.error('Failed reading chats file, using seeds:', err);
    chatsCache = [...SEED_THREADS];
  }
}

function saveToDisk(): void {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chatsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save chats to disk:', err);
  }
}

// Connect to MongoDB Atlas if MONGODB_URI is provided
async function initMongoConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const dbName = process.env.DATABASE_NAME || 'verdant_ai';
    mongoDb = client.db(dbName);
    console.log(`🌱 Connected to MongoDB Atlas [${dbName}.chats] successfully!`);

    const collection = mongoDb.collection<ChatThread>('chats');
    const count = await collection.countDocuments();
    if (count > 0) {
      const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
      chatsCache = docs;
      saveToDisk();
    } else {
      await collection.insertMany(chatsCache as any);
    }
  } catch (err: any) {
    console.warn('⚠️ Could not connect chats to MongoDB Atlas, falling back to local file store:', err.message);
    mongoDb = null;
  }
}

// Initial load
loadLocalChats();
initMongoConnection().catch(() => {});

export function getAllChatThreads(): ChatThread[] {
  return [...chatsCache].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getChatThreadById(id: string): ChatThread | undefined {
  return chatsCache.find(t => t.id === id);
}

export function saveChatThread(thread: ChatThread): ChatThread {
  const existingIdx = chatsCache.findIndex(t => t.id === thread.id);
  const updated: ChatThread = {
    ...thread,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    chatsCache[existingIdx] = updated;
  } else {
    chatsCache.unshift(updated);
  }
  saveToDisk();

  // Async sync to MongoDB
  if (mongoDb) {
    mongoDb.collection('chats').replaceOne({ id: updated.id } as any, updated as any, { upsert: true }).catch(err => {
      console.warn('Failed to update chat thread in MongoDB:', err);
    });
  }

  return updated;
}

export function deleteChatThreadById(id: string): boolean {
  const initLen = chatsCache.length;
  chatsCache = chatsCache.filter(t => t.id !== id);
  if (chatsCache.length !== initLen) {
    saveToDisk();

    // Async delete from MongoDB
    if (mongoDb) {
      mongoDb.collection('chats').deleteOne({ id } as any).catch(err => {
        console.warn('Failed to delete chat thread from MongoDB:', err);
      });
    }

    return true;
  }
  return false;
}

export function clearAllChatThreads(): void {
  chatsCache = [];
  saveToDisk();

  if (mongoDb) {
    mongoDb.collection('chats').deleteMany({}).catch(err => {
      console.warn('Failed to clear chats in MongoDB:', err);
    });
  }
}
