// Specialized proxy for Gemini generateContent API endpoint
// Using type definitions compatible with both local development and Vercel

export default async function handler(
  request: any,
  response: any
) {
  // CORS headers to allow requests from all origins during development
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-goog-api-key'
  );

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // Get the model from the request path
    const { model } = request.query;
    
    if (!model || Array.isArray(model)) {
      return response.status(400).json({ error: 'Invalid model parameter' });
    }

    // Extract API key from the request headers
    const apiKey = request.headers['x-goog-api-key'];
    if (!apiKey) {
      return response.status(400).json({ error: 'API key is required' });
    }

    // Construct the full URL to the Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    console.log(`Proxying request to: ${url}`);

    // Forward the request to Gemini API
    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': Array.isArray(apiKey) ? apiKey[0] : apiKey
      },
      body: JSON.stringify(request.body)
    });

    // Get the response data
    const data = await fetchResponse.json();

    // Return the proxied response
    return response.status(fetchResponse.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return response.status(500).json({ 
      error: 'Error proxying request to Gemini API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}