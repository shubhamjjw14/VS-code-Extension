import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from .env file
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually specify the path to your .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const apiKey = process.env.GEMINI_API_KEY;  // Retrieve the API key from environment variables

console.log('🔑 Loaded API Key:', apiKey);

if (!apiKey) {
  console.error('❌ API key not found! Make sure your .env file has GEMINI_API_KEY=your_key_here');
  process.exit(1);  // Exit if API key is not found
}

const errorMessage = 'Cannot read property "foo" of undefined';  // The error message you want to explain

// Function to fetch explanation from Gemini API
async function fetchExplanation(errorMessage: string): Promise<string | undefined> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `Explain the following error in simple terms:\n\n${errorMessage}`
          }
        ]
      }
    ]
  });

  try {
    // Perform the API request to Gemini
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      console.error('❌ Error from Gemini API:', await response.text());
      return undefined;
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Access the explanation text from the response
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (explanation) {
      return explanation;
    } else {
      console.error('❌ No explanation found in the API response.');
      return undefined;
    }
  } catch (error) {
    console.error('❌ Error during fetch operation:', error);
    return undefined;
  }
}

// Run the fetch explanation function
fetchExplanation(errorMessage)
  .then((explanation) => {
    if (explanation) {
      console.log('Explanation:', explanation);
    } else {
      console.error('❌ No explanation received.');
    }
  })
  .catch((error) => {
    console.error('❌ Error:', error);
  });
