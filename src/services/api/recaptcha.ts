interface RecaptchaResponse {
  success: boolean;
  score?: number;
  message?: string;
}

export const verifyRecaptchaToken = async (token: string): Promise<RecaptchaResponse> => {
  // Bypass en développement local
  if (window.location.hostname === 'localhost') {
    console.log('🔧 Mode développement local : ReCAPTCHA bypassed');
    return { success: true, score: 1.0 };
  }

  // Vérification réelle sur Vercel
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification ReCAPTCHA:', error);
    return {
      success: false,
      message: 'Erreur de connexion au serveur',
    };
  }
};