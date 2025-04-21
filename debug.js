// Chatbot Debugging Script
// This file helps debug issues with the chatbot functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Debug script loaded");
    
    // Check if elements exist
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    
    console.log("Chatbot toggle found:", !!chatbotToggle);
    console.log("Chatbot container found:", !!chatbotContainer);
    
    if (chatbotToggle) {
        console.log("Toggle styles:", window.getComputedStyle(chatbotToggle));
        
        // Add a guaranteed working click handler
        chatbotToggle.addEventListener('click', function(e) {
            console.log("Toggle clicked via debug script");
            e.preventDefault();
            e.stopPropagation();
            
            if (chatbotContainer) {
                console.log("Adding 'active' class to container");
                chatbotContainer.classList.add('active');
                
                // Check if class was added
                setTimeout(() => {
                    console.log("Container has 'active' class:", chatbotContainer.classList.contains('active'));
                    console.log("Container styles:", window.getComputedStyle(chatbotContainer));
                }, 100);
            } else {
                console.error("Chatbot container not found!");
            }
        }, true);
    } else {
        console.error("Chatbot toggle not found!");
    }
    
    // Add manual toggle function to window for testing from console
    window.toggleChatbot = function() {
        const container = document.querySelector('.chatbot-container');
        if (container) {
            console.log("Manual toggle activated");
            container.classList.toggle('active');
            return "Chatbot toggled. Active: " + container.classList.contains('active');
        } else {
            return "Error: Chatbot container not found";
        }
    };
    
    // Log instructions
    console.log("To manually toggle the chatbot, run: toggleChatbot()");

    // Debug the send button
    setTimeout(function() {
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            console.log('Found send button, attaching debug listener');
            sendBtn.addEventListener('click', function() {
                console.log('Send button clicked (from debug.js)');
            });
        } else {
            console.error('Send button not found in DOM');
        }
        
        // Debug user input
        const userInput = document.getElementById('user-input');
        if (userInput) {
            console.log('Found user input, attaching debug listener');
            userInput.addEventListener('keypress', function(e) {
                console.log('Key pressed in input:', e.key);
                if (e.key === 'Enter') {
                    console.log('Enter key pressed in user input (from debug.js)');
                }
            });
        } else {
            console.error('User input not found in DOM');
        }
    }, 1000); // Wait 1 second to ensure all elements are loaded
});

// Add a fallback direct function that doesn't depend on DOM ready
window.openChatbot = function() {
    const container = document.querySelector('.chatbot-container');
    if (container) {
        container.classList.add('active');
        return "Chatbot opened";
    } else {
        return "Error: Chatbot container not found";
    }
};

// Add chat input debug functionality
window.debugChatInput = function() {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    console.log("Chat input elements check:");
    console.log("- Input element exists:", !!input);
    console.log("- Send button exists:", !!sendBtn);
    
    if (input) {
        console.log("- Input value:", input.value);
        console.log("- Input attributes:", {
            type: input.getAttribute('type'),
            placeholder: input.getAttribute('placeholder'),
            id: input.id,
            disabled: input.disabled,
            readonly: input.readOnly
        });
        
        // Test setting a value
        input.value = "Test message";
        console.log("- Set test value:", input.value);
        
        // Test focus
        input.focus();
        console.log("- Input focused");
    }
    
    if (sendBtn) {
        console.log("- Send button attributes:", {
            type: sendBtn.getAttribute('type'),
            id: sendBtn.id,
            disabled: sendBtn.disabled
        });
        
        // Add test click handler
        sendBtn.addEventListener('click', function() {
            console.log("Send button click handler triggered via debug");
        });
        console.log("- Added test click handler to send button");
    }
    
    // Check event handling on input
    if (input) {
        input.addEventListener('keydown', function(e) {
            console.log("Debug keydown event on input:", e.key);
        });
        console.log("- Added test keydown handler to input");
    }
    
    return "Chat input debug complete";
};

// Format response text to display code blocks, lists, and links properly
function formatResponseText(text) {
    if (!text) return '';
    
    // Format code blocks with syntax highlighting (basic version)
    text = text.replace(/```([a-z]*)([\s\S]*?)```/g, function(match, language, code) {
        return '<pre class="code-block"><code class="language-' + (language || 'text') + '">' + 
               code.trim() + '</code></pre>';
    });
    
    // Format inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Format lists
    text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Format numbered lists
    text = text.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    text = text.replace(/(<li>.*<\/li>)/gs, function(match) {
        if (!match.includes('<ul>')) return '<ol>' + match + '</ol>';
        return match;
    });
    
    // Format links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Format paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map(p => {
        if (p.trim() === '') return '';
        if (p.includes('<pre') || p.includes('<ul') || p.includes('<ol')) return p;
        return '<p>' + p + '</p>';
    }).join('');
}

// Add sendChatMessage function directly to window object
window.sendChatMessage = function() {
    console.log("sendChatMessage called from debug.js");
    const input = document.getElementById('user-input');
    if (input && input.value.trim() !== '') {
        console.log("Sending message:", input.value);
        
        // Get chatbot messages container
        const chatMessages = document.querySelector('.chatbot-messages');
        
        // Add user message
        if (chatMessages) {
            // Create user message element
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('user-message');
            
            const messageText = document.createElement('p');
            messageText.textContent = input.value.trim();
            
            userMessageElement.appendChild(messageText);
            chatMessages.appendChild(userMessageElement);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Clear input
            const message = input.value.trim();
            input.value = '';
            
            // Add thinking message
            const thinkingElement = document.createElement('div');
            thinkingElement.classList.add('bot-message', 'thinking-message');
            
            const thinkingText = document.createElement('p');
            thinkingText.textContent = "Thinking";
            
            thinkingElement.appendChild(thinkingText);
            chatMessages.appendChild(thinkingElement);
            
            // Use Gemini API for all queries
            // Format the query to ensure it includes context
            const formattedQuery = `You are a helpful assistant that can answer questions about any topic, but you're especially knowledgeable about product lifespans and maintenance. Please provide a helpful, accurate, and concise answer to the following question: ${message}`;
            
            // Call the Gemini API using the utility function from gemini-api.js
            queryGemini(formattedQuery)
                .then(response => {
                    // Remove thinking message
                    chatMessages.removeChild(thinkingElement);
                    
                    // Add bot response
                    const botMessageElement = document.createElement('div');
                    botMessageElement.classList.add('bot-message');
                    
                    // Clean up the response by removing any leading AI assistant disclaimer
                    const cleanedResponse = response
                        .replace(/^(As an AI assistant|As an AI|As a language model|As an assistant|I'm an AI|I am an AI).*?\./i, '')
                        .replace(/^(I'm sorry|I am sorry|Sorry)[,.].*?\./i, '')
                        .trim();
                    
                    // Format the response with proper styling
                    botMessageElement.innerHTML = formatResponseText(cleanedResponse) || 
                        "<p>I couldn't generate a response for that query. Could you try asking something else?</p>";
                    
                    chatMessages.appendChild(botMessageElement);
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                })
                .catch(error => {
                    // Remove thinking message
                    chatMessages.removeChild(thinkingElement);
                    
                    // Add error response
                    const botMessageElement = document.createElement('div');
                    botMessageElement.classList.add('bot-message');
                    
                    const botText = document.createElement('p');
                    botText.textContent = "I'm having trouble connecting to my knowledge source right now. Please try again later.";
                    
                    botMessageElement.appendChild(botText);
                    chatMessages.appendChild(botMessageElement);
                    
                    // Log the error
                    console.error("Error querying Gemini API:", error);
                    
                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                });
            
            return "Message sent successfully!";
        } else {
            console.error("Chat messages container not found");
            return "Error: Chat messages container not found";
        }
    } else if (input) {
        console.log("Input is empty");
        return "Error: Please enter a message";
    } else {
        console.error("Input element not found");
        return "Error: Input element not found";
    }
}; 