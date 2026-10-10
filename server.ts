import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeCropLeafImage, askAgronomist } from './src/server/geminiService.ts';
import { AGRICULTURAL_KNOWLEDGE_BASE, getDiseaseById, searchDiseases } from './src/server/knowledgeBase.ts';
import { getAllScans, getScanById, createScan, deleteScanById } from './src/server/scanStore.ts';
import { getAllChatThreads, getChatThreadById, saveChatThread, deleteChatThreadById, clearAllChatThreads } from './src/server/chatStore.ts';
import { fetchWeatherContext, evaluateWeatherDiseaseSynergy } from './src/server/weatherService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with generous limit for image base64 payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Verdant AI - Smart Crop Disease Detection Engine',
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// API: Disease Knowledge Base Search & Listing
app.get('/api/v1/diseases', (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const crop = (req.query.crop as string) || '';
  const results = searchDiseases(q, crop);
  res.json(results);
});

// API: Disease by ID
app.get('/api/v1/diseases/:id', (req: Request, res: Response) => {
  const disease = getDiseaseById(req.params.id);
  if (!disease) {
    return res.status(404).json({ error: 'Disease record not found in knowledge base' });
  }
  res.json(disease);
});

// API: Recommendations by Disease ID
app.get('/api/v1/recommendations/:id', (req: Request, res: Response) => {
  const disease = getDiseaseById(req.params.id);
  if (!disease) {
    return res.status(404).json({ error: 'Disease record not found' });
  }
  res.json({
    crop: disease.crop,
    disease_name: disease.disease_name,
    prevention: disease.prevention,
    cultural_practices: disease.cultural_practices,
    organic_biological_treatments: disease.organic_biological_treatments,
    chemical_treatments: disease.chemical_treatments,
    expert_guidance: disease.expert_guidance,
    references: disease.references,
  });
});

// API: Weather Context
app.get('/api/v1/weather', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 17.3850;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 78.4867;
    const city = (req.query.city as string) || 'Farm Location';

    const weather = await fetchWeatherContext(lat, lon, city);
    res.json(weather);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch weather data', details: err.message });
  }
});

// API: AI Crop Disease Prediction
app.post('/api/v1/predictions', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, cropHint, location, notes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 payload' });
    }

    // Run inference via Gemini 3.8 Flash
    const predictionData = await analyzeCropLeafImage(
      imageBase64,
      mimeType || 'image/jpeg',
      cropHint
    );

    // Weather risk integration
    let weatherData = null;
    let weatherRisk = undefined;

    try {
      const lat = location?.lat || 17.3850;
      const lon = location?.lon || 78.4867;
      const city = location?.name || 'Local Farm';
      weatherData = await fetchWeatherContext(lat, lon, city);
      weatherRisk = evaluateWeatherDiseaseSynergy(weatherData, predictionData.pathogen_type);
    } catch (e) {
      console.warn('Weather evaluation skipped:', e);
    }

    // Persist scan to MongoDB-compatible store
    // Use an optimized low-res thumbnail or data URI reference
    const thumbnailUri = imageBase64.startsWith('data:')
      ? (imageBase64.length > 500000 ? imageBase64.substring(0, 50000) + '...' : imageBase64)
      : `data:${mimeType || 'image/jpeg'};base64,${imageBase64.substring(0, 50000)}...`;

    const savedScan = createScan({
      crop: predictionData.crop,
      predicted_class: predictionData.predicted_class,
      confidence: predictionData.confidence,
      status: predictionData.status,
      created_at: new Date().toISOString(),
      disease_name: predictionData.disease_name,
      is_healthy: predictionData.is_healthy,
      severity_stage: predictionData.severity_stage,
      image_url: thumbnailUri,
      notes: notes || undefined,
      weather_context: weatherData ? {
        temperature: weatherData.temperature,
        humidity: weatherData.relative_humidity,
        condition: weatherData.condition_text,
      } : undefined,
      recommendations: predictionData.recommendations,
    });

    res.json({
      ...predictionData,
      scan_id: savedScan._id,
      created_at: savedScan.created_at,
      weather_risk: weatherRisk,
      image_url: thumbnailUri,
    });
  } catch (err: any) {
    console.error('Prediction API failure:', err);
    res.status(500).json({
      error: 'Inference failed',
      message: err.message || 'Error processing crop leaf image',
    });
  }
});

// API: Scan History List
app.get('/api/v1/scans', (_req: Request, res: Response) => {
  const scans = getAllScans();
  res.json(scans);
});

// API: Get Single Scan
app.get('/api/v1/scans/:id', (req: Request, res: Response) => {
  const scan = getScanById(req.params.id);
  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }
  res.json(scan);
});

// API: Delete Scan
app.delete('/api/v1/scans/:id', (req: Request, res: Response) => {
  const deleted = deleteScanById(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Scan not found or already deleted' });
  }
  res.json({ success: true, message: 'Scan record deleted successfully' });
});

// API: Chat Threads List (History like ChatGPT)
app.get('/api/v1/chats', (_req: Request, res: Response) => {
  const threads = getAllChatThreads();
  res.json(threads);
});

// API: Get Single Chat Thread
app.get('/api/v1/chats/:id', (req: Request, res: Response) => {
  const thread = getChatThreadById(req.params.id);
  if (!thread) {
    return res.status(404).json({ error: 'Chat thread not found' });
  }
  res.json(thread);
});

// API: Save / Update Chat Thread
app.post('/api/v1/chats', (req: Request, res: Response) => {
  const thread = req.body;
  if (!thread || !thread.id) {
    return res.status(400).json({ error: 'Thread data with id is required' });
  }
  const saved = saveChatThread(thread);
  res.json(saved);
});

// API: Delete Single Chat Thread
app.delete('/api/v1/chats/:id', (req: Request, res: Response) => {
  const deleted = deleteChatThreadById(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Chat thread not found or already deleted' });
  }
  res.json({ success: true, message: 'Chat thread deleted successfully' });
});

// API: Clear All Chat Threads
app.delete('/api/v1/chats', (_req: Request, res: Response) => {
  clearAllChatThreads();
  res.json({ success: true, message: 'All chat threads cleared' });
});

// API: Agronomist Expert Chat with Multi-Turn Memory & Auto-Title
app.post('/api/v1/agronomist-chat', async (req: Request, res: Response) => {
  try {
    const { query, context, history } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query text is required' });
    }

    const { answer, suggestedTitle } = await askAgronomist(query, context, history);
    res.json({ answer, suggestedTitle });
  } catch (err: any) {
    console.error('Agronomist chat error:', err);
    res.status(500).json({ error: 'Failed to consult agronomist', details: err.message });
  }
});

// Vite middleware for dev / static assets for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Verdant AI Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export default app;
