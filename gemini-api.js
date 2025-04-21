// Gemini API Utility Script
// This file provides a simple way to test the Gemini API connection

const GEMINI_API_KEY = "AIzaSyDKmfBvGUhL2J4WsZhjCotBxxxYDztf9TM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Tests the connection to the Gemini API and displays results in the console
 * @param {string} testQuery - The query to test with
 * @returns {Promise<Object>} - The raw API response
 */
async function testGeminiConnection(testQuery = "Hello, what can you tell me about product lifespans?") {
    try {
        console.log("%cTesting Gemini API connection...", "color: blue; font-weight: bold");
        console.log("API Key:", GEMINI_API_KEY.substring(0, 8) + "..." + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4));
        console.log("API URL:", GEMINI_API_URL);
        console.log("Test Query:", testQuery);
        
        console.log("%cSending request...", "color: orange");
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: testQuery }]
                }]
            })
        });
        
        console.log("Response Status:", response.status, response.statusText);
        
        if (!response.ok) {
            console.error("%cAPI response not OK:", "color: red; font-weight: bold", response.status, response.statusText);
            
            // Try to get more information about the error
            try {
                const errorData = await response.json();
                console.error("Error details:", errorData);
            } catch (e) {
                console.error("Could not parse error response");
            }
            
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("%cAPI Connection successful!", "color: green; font-weight: bold");
        
        // Check response structure
        if (!data.candidates || !data.candidates.length) {
            console.warn("%cWarning: No candidates in response", "color: orange");
        }
        
        // Extract the text from the response
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0] && 
            data.candidates[0].content.parts[0].text) {
            
            const responseText = data.candidates[0].content.parts[0].text;
            console.log("%cResponse text:", "color: green", responseText);
        } else {
            console.warn("%cResponse format is unexpected:", "color: orange", data);
        }
        
        return data;
    } catch (error) {
        console.error("%cError testing Gemini API:", "color: red; font-weight: bold", error);
        console.error("Check that:");
        console.error("1. Your API key is valid");
        console.error("2. You have internet connection");
        console.error("3. The API endpoint is correct");
        console.error("4. You haven't exceeded quota limits");
        throw error;
    }
}

/**
 * Simple query function for the Gemini API
 * @param {string} query - The query to send to the API
 * @returns {Promise<string>} - The text response from the API
 */
async function queryGemini(query) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: query }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }
        
        const data = await response.json();
        
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0]) {
            
            return data.candidates[0].content.parts[0].text;
        }
        
        return "Couldn't parse API response";
    } catch (error) {
        console.error("Error querying Gemini API:", error);
        return `Error: ${error.message}`;
    }
}

// Usage examples:
// To test the connection, open the browser console and run:
// testGeminiConnection()
//
// To query with a specific question:
// queryGemini("How long does a refrigerator last?").then(response => console.log(response)) 