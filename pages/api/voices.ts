import type { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsVoice } from '../../types/elevenlabs';

interface VoicesResponse {
  success: boolean;
  voices?: ElevenLabsVoice[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VoicesResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!elevenLabsApiKey) {
      return res.status(500).json({
        success: false,
        error: 'ElevenLabs API key not configured'
      });
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    const voices: ElevenLabsVoice[] = data.voices || [];

    res.status(200).json({
      success: true,
      voices,
    });

  } catch (error) {
    console.error('Voices API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch voices' 
    });
  }
} 