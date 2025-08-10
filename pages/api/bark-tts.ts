import type { NextApiRequest, NextApiResponse } from 'next';
import { BarkTTSRequest, BarkTTSResponse, BarkSettings } from '../../types/bark';

interface BarkRequest {
  text: string;
  voice_id?: string;
  language?: string;
  settings?: BarkSettings;
}

interface BarkResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  useBrowserFallback?: boolean;
  text?: string;
  language?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BarkResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      text, 
      voice_id = 'v2/ru_speaker_0', 
      language = 'ru',
      settings 
    }: BarkRequest = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    console.log('Bark TTS Request:', { text, voice_id, language, settings });

    // Используем бесплатный API Bark через Hugging Face
    const barkApiUrl = 'https://api-inference.huggingface.co/models/suno/bark';
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      // Возвращаем специальный флаг для использования браузерного SpeechSynthesis
      console.log('HuggingFace API key not configured, using browser fallback');
      
      return res.status(200).json({
        success: true,
        useBrowserFallback: true,
        text: text,
        language: language,
      });
    }

    const barkRequest: BarkTTSRequest = {
      text,
      voice_id,
      language,
      speed: settings?.speed || 1.0,
      temperature: settings?.temperature || 0.3,
      top_k: settings?.top_k || 20,
      top_p: settings?.top_p || 0.8,
      waveform_temp: settings?.waveform_temp || 0.4,
    };

    try {
      const response = await fetch(barkApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(barkRequest),
      });

      if (!response.ok) {
        throw new Error(`Bark API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;

      res.status(200).json({
        success: true,
        audioUrl,
      });

    } catch (error) {
      console.error('Bark API Error:', error);
      
      // Fallback к локальному Bark (если настроен)
      try {
        const localBarkUrl = process.env.LOCAL_BARK_URL || 'http://localhost:8000/generate';
        
        const localResponse = await fetch(localBarkUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(barkRequest),
        });

        if (localResponse.ok) {
          const audioBuffer = await localResponse.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString('base64');
          const audioUrl = `data:audio/wav;base64,${base64Audio}`;

          res.status(200).json({
            success: true,
            audioUrl,
          });
        } else {
          throw new Error('Local Bark API failed');
        }
      } catch (localError) {
        console.error('Local Bark Error:', localError);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate audio with Bark'
        });
      }
    }

  } catch (error) {
    console.error('Bark TTS API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 