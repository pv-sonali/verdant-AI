import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import { ScanRecord } from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'scans.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

// In-memory cache of scans
let scansCache: ScanRecord[] = [];
let mongoDb: Db | null = null;

// Seed initial representative scans for demo and history inspection
const SEED_SCANS: ScanRecord[] = [
  {
    _id: '67a840e1b2f91a0014a9e101',
    crop: 'Tomato',
    predicted_class: 'Tomato___Early_blight',
    disease_name: 'Early Blight',
    confidence: 0.94,
    status: 'prediction_available',
    is_healthy: false,
    severity_stage: 'Moderate',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    weather_context: {
      temperature: 26.2,
      humidity: 82,
      condition: 'Overcast / High Humidity'
    },
    notes: 'Detected on lower third leaves of Field Block B. Foliage pruned.',
    recommendations: {
      prevention: [
        'Rotate with maize or legumes next season',
        'Install drip irrigation to prevent splashback'
      ],
      cultural_management: [
        'Prune bottom foliage up to 30cm',
        'Stake and trellis immediately'
      ],
      organic_biological_treatments: [
        'Apply Bacillus subtilis foliar spray weekly',
        'Neem oil 0.5% concentration'
      ],
      chemical_treatments: [
        {
          name: 'Mancozeb 75% WP',
          active_ingredient: 'Mancozeb',
          dosage: '2.5 g / liter',
          safety_period_days: 7,
          instructions: 'Apply protective cover spray.'
        }
      ],
      expert_review_recommended: false,
      urgent_action_required: true
    }
  },
  {
    _id: '67a840e1b2f91a0014a9e102',
    crop: 'Potato',
    predicted_class: 'Potato___Late_blight',
    disease_name: 'Late Blight',
    confidence: 0.91,
    status: 'prediction_available',
    is_healthy: false,
    severity_stage: 'Severe',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    weather_context: {
      temperature: 17.5,
      humidity: 94,
      condition: 'Rain Showers'
    },
    notes: 'Rapid blackening noticed after 3 days of fog. Urgent notification sent.',
    recommendations: {
      prevention: [
        'Hill tubers deeply to prevent spore infiltration',
        'Use certified blight-free seed tubers'
      ],
      cultural_management: [
        'Destroy infected cull piles',
        'Do not overhead irrigate'
      ],
      organic_biological_treatments: [
        'Bordeaux mixture 1% preventative spray'
      ],
      chemical_treatments: [
        {
          name: 'Cymoxanil + Mancozeb (Curzate)',
          active_ingredient: 'Cymoxanil 8% + Mancozeb 64%',
          dosage: '2.5 g / liter',
          safety_period_days: 7,
          instructions: 'Curative spray within 48h of outbreak.'
        }
      ],
      expert_review_recommended: true,
      urgent_action_required: true
    }
  },
  {
    _id: '67a840e1b2f91a0014a9e103',
    crop: 'Pepper (Capsicum)',
    predicted_class: 'Pepper__bell___healthy',
    disease_name: 'Healthy Foliage',
    confidence: 0.98,
    status: 'prediction_available',
    is_healthy: true,
    severity_stage: 'None',
    created_at: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    weather_context: {
      temperature: 27.0,
      humidity: 62,
      condition: 'Mainly Clear'
    },
    notes: 'Greenhouse Section 1 routine scouting. No pathogen lesions.'
  }
];

function loadLocalScans(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      scansCache = JSON.parse(raw);
    } else {
      scansCache = [...SEED_SCANS];
      saveToDisk();
    }
  } catch (err) {
    console.error('Failed reading scans file, using default seed:', err);
    scansCache = [...SEED_SCANS];
  }
}

function saveToDisk(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scansCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save scans to disk:', err);
  }
}

// Initialize MongoDB if MONGODB_URI is provided
async function initMongoConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('🍃 MONGODB_URI not set. Using persistent local JSON file store (data/scans.json).');
    return;
  }

  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const dbName = process.env.DATABASE_NAME || 'verdant_ai';
    mongoDb = client.db(dbName);
    console.log(`🌱 Connected to MongoDB Atlas [${dbName}.scans] successfully!`);

    // Fetch existing records from MongoDB collection
    const collection = mongoDb.collection<ScanRecord>('scans');
    const count = await collection.countDocuments();
    if (count > 0) {
      const docs = await collection.find({}).sort({ created_at: -1 }).toArray();
      scansCache = docs;
      saveToDisk();
    } else {
      // Seed initial scans into MongoDB
      await collection.insertMany(scansCache as any);
      console.log('🌱 Seeded initial scans into MongoDB collection.');
    }
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MongoDB Atlas, falling back to local file store:', err.message);
    mongoDb = null;
  }
}

// Initial load
loadLocalScans();
initMongoConnection().catch(() => {});

export function getAllScans(): ScanRecord[] {
  return [...scansCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getScanById(id: string): ScanRecord | undefined {
  return scansCache.find(s => s._id === id);
}

export function createScan(record: Omit<ScanRecord, '_id'>): ScanRecord {
  const _id = 'scan_' + Date.now().toString(16) + Math.random().toString(16).substring(2, 8);
  const newRecord: ScanRecord = {
    ...record,
    _id
  };
  scansCache.unshift(newRecord);
  saveToDisk();

  // If MongoDB is connected, persist asynchronously
  if (mongoDb) {
    mongoDb.collection('scans').insertOne(newRecord as any).catch(err => {
      console.warn('Failed to insert scan into MongoDB:', err);
    });
  }

  return newRecord;
}

export function deleteScanById(id: string): boolean {
  const initialLen = scansCache.length;
  scansCache = scansCache.filter(s => s._id !== id);
  if (scansCache.length !== initialLen) {
    saveToDisk();

    // If MongoDB is connected, delete asynchronously
    if (mongoDb) {
      mongoDb.collection('scans').deleteOne({ _id: id } as any).catch(err => {
        console.warn('Failed to delete scan in MongoDB:', err);
      });
    }

    return true;
  }
  return false;
}
