import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // console.log('=== API CALLED ===');
  // console.log('Method:', req.method);
  // console.log('Has SECRET_KEY:', !!import.meta.env.RECAPTCHA_SECRET_KEY);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;
  // console.log('Token received:', !!token);

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token manquant' 
    });
  }

  try {
    const secret = import.meta.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      console.error('SECRET KEY IS MISSING!');
      return res.status(500).json({ 
        success: false, 
        message: 'Configuration serveur manquante' 
      });
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: 'POST' }
    );

    const data = await response.json();
    // console.log('ReCAPTCHA response:', data);

    if (data.success && (data.score ?? 0) >= 0.5) {
      return res.status(200).json({ 
        success: true, 
        score: data.score 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Vérification échouée',
        score: data.score
      });
    }
  } catch (error) {
    console.error('ReCAPTCHA error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: String(error)
    });
  }
}