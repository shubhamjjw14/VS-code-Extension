/// <reference lib="esnext" /> // This will exclude DOM types

const dotenv = require('dotenv');
const vscode = require('vscode');
const nodeFetch = require('node-fetch');   // Make sure to import fetch for making API calls
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const apiKey = process.env.GEMINI_API_KEY; // Use the GEMINI_API_KEY from your .env file
console.log("Loaded API Key:", apiKey);


if (!apiKey) {
  console.error('❌ API key not found! Make sure your .env file has GEMINI_API_KEY=your_key_here');
}

// Command to explain error from context menu
async function activate(context) {
  console.log('✅ Error Explainer Extension is now active!');

  // Log the extension path and current working directory
  console.log('Extension Path:', context.extensionPath);
  console.log('Current Working Directory:', process.cwd());

  let disposable = vscode.commands.registerCommand('extension.explainError', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor detected.');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText.trim()) {
      vscode.window.showInformationMessage('Please select an error message to explain.');
      return;
    }

    // Show a loading notification while the explanation is being fetched
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '🔍 Generating explanation...',
        cancellable: false,
      },
      async () => {
        try {
          const explanation = await fetchExplanation(selectedText);

          if (explanation) {
            vscode.window.showInformationMessage(`🧠 ${explanation}`);
          } else {
            vscode.window.showErrorMessage('No explanation received from Gemini API.');
          }
        } catch (error) {
          console.error('❌ Error fetching explanation:', error);
          vscode.window.showErrorMessage('Failed to fetch explanation.');
        }
      }
    );
  });

  // Register the command to be used in the context menu
  context.subscriptions.push(disposable);
}

// Function to deactivate the extension (clean-up, if necessary)
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

// Define an interface for the response data structure
/**
 * @typedef {Object} GeminiApiResponse
 * @property {Array<{ content: { parts: Array<{ text: string }> } }> } candidates
 */

// Fetch explanation from Gemini API
async function fetchExplanation(errorMessage) {
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
    const response = await nodeFetch(url, {
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

    // Cast the response to GeminiApiResponse
    const data = await response.json();
    console.log("🔥 Gemini API Raw Response:", JSON.stringify(data, null, 2));


    // Log the raw response for debugging
    console.log('API Response:', data);

    // Safely access the 'text' property
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (explanation) {
      console.log('Explanation:', explanation);  // Log the explanation for debugging
    }

    return explanation;

  } catch (error) {
    console.error('❌ Error during fetch operation:', error);
    return undefined;
  }
}
