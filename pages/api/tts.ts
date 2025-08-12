import type { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsTTSRequest, ElevenLabsTTSResponse, VoiceSettings, PlaybackSettings } from '../../types/elevenlabs';

interface TTSRequest {
  text: string;
  language?: string;
  voice_id?: string;
  voice_settings?: VoiceSettings;
  playback_settings?: PlaybackSettings;
  use_elevenlabs?: boolean;
}

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TTSResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      text, 
      language = 'ru-RU', 
      voice_id, 
      voice_settings, 
      playback_settings,
      use_elevenlabs = false 
    }: TTSRequest = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    console.log('TTS Request:', { 
      text, 
      language, 
      voice_id, 
      voice_settings, 
      playback_settings,
      use_elevenlabs 
    });

    let audioUrl: string;

    if (use_elevenlabs && voice_id) {
      // Интеграция с ElevenLabs API
      const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
      
      if (!elevenLabsApiKey) {
        return res.status(500).json({
          success: false,
          error: 'ElevenLabs API key not configured'
        });
      }

      const elevenLabsRequest: ElevenLabsTTSRequest = {
        text,
        voice_id,
        voice_settings: voice_settings || {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      };

      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': elevenLabsApiKey,
            },
            body: JSON.stringify(elevenLabsRequest),
          }
        );

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

      } catch (error) {
        console.error('ElevenLabs API Error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate audio with ElevenLabs'
        });
      }
    } else {
      // Fallback к заглушке
      await new Promise(resolve => setTimeout(resolve, 1000));
      audioUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`;
    }

    res.status(200).json({
      success: true,
      audioUrl,
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 