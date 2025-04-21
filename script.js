// Add Gemini API key
const GEMINI_API_KEY = "AIzaSyDKmfBvGUhL2J4WsZhjCotBxxxYDztf9TM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Check if ApexCharts is loaded
if (typeof ApexCharts === 'undefined') {
    console.error("ApexCharts is not loaded! Check script order in HTML file.");
} else {
    console.log("ApexCharts is loaded successfully");
}

// Global chart variable
let lifecycleChart = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - script.js initialization starting");
    
    try {
        // Check if the chart element exists
        const chartElement = document.getElementById('productLifecycleChart');
        if (!chartElement) {
            console.error("Chart element not found!");
        } else {
            console.log("Chart element found:", chartElement);
        }
        
        // Chatbot elements
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        const closeChat = document.querySelector('.close-chat');
        const chatMessages = document.querySelector('.chatbot-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        // Debug element existence
        console.log("Chatbot toggle exists:", !!chatbotToggle);
        console.log("Chatbot container exists:", !!chatbotContainer);
        console.log("Close chat button exists:", !!closeChat);
        console.log("Chat messages container exists:", !!chatMessages);
        console.log("User input exists:", !!userInput);
        console.log("Send button exists:", !!sendBtn);
        
        if (!sendBtn) {
            console.error("CRITICAL: Send button not found in DOM");
            // Try to find it by class or other attributes
            const sendBtnByClass = document.querySelector('button[id="send-btn"]');
            console.log("Found by direct query:", !!sendBtnByClass);
        }
        
        // Chart elements
        const productLifecycleChart = document.getElementById('productLifecycleChart');
        
        // FAQ elements
        const faqItems = document.querySelectorAll('.faq-item');
        
        // Create initial empty chart
        initializeChart();

        // Chatbot Toggle
        chatbotToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Chatbot toggle clicked");
            document.querySelector('.chatbot-container').classList.add('active');
            
            // Focus the input field when chatbot opens
            setTimeout(() => {
                document.getElementById('user-input').focus();
            }, 300);
        });

        // Improved chatbot close button functionality
        if (closeChat && chatbotContainer) {
            closeChat.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Close chat button clicked - direct handler");
                
                // Direct class removal
                chatbotContainer.classList.remove('active');
                
                // Fallback mechanism
                setTimeout(() => {
                    if (chatbotContainer.classList.contains('active')) {
                        console.log("Fallback: force removing active class");
                        chatbotContainer.className = chatbotContainer.className.replace(/\bactive\b/, '');
                    }
                }, 100);
                
                return false;
            };
        }

        // Also close chatbot when clicking outside (optional)
        document.addEventListener('click', (e) => {
            const container = document.querySelector('.chatbot-container');
            const toggle = document.querySelector('.chatbot-toggle');
            if (container && toggle && 
                !container.contains(e.target) && 
                e.target !== toggle && 
                !toggle.contains(e.target) && 
                container.classList.contains('active')) {
                container.classList.remove('active');
            }
        });

        // Send message when clicking send button
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Send button clicked");
            sendMessage();
        });

        // Send message when pressing Enter key
        userInput.addEventListener('keypress', function(e) {
            console.log("Key pressed in input:", e.key);
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log("Enter key pressed, sending message");
                sendMessage();
            }
        });

        // Add direct function for manual sending from debug console
        window.sendChatMessage = function() {
            const input = document.getElementById('user-input');
            if (input && input.value.trim() !== '') {
                console.log("Manually sending message:", input.value);
                sendMessage();
                return "Message sent!";
            } else if (input) {
                return "Error: Input is empty";
            } else {
                return "Error: Input element not found";
            }
        };

        // FAQ Accordion - completely rewritten for robustness
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('FAQ question clicked - direct event handler');
                    
                    // Get all FAQ items
                    const allFaqItems = document.querySelectorAll('.faq-item');
                    
                    // Close all other items
                    allFaqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item with direct class manipulation
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                };
            }
        });

        // Initialize the Chart with ApexCharts
        function initializeChart() {
            const options = {
                series: [{
                    name: 'Product Performance',
                    data: [100, 95, 90, 85, 75, 65, 55, 45, 35, 25, 15]
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    fontFamily: 'Segoe UI, sans-serif',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    },
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                colors: ['#3498db'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3,
                        stops: [0, 90, 100]
                    }
                },
                markers: {
                    size: 5,
                    colors: ['#3498db'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                    hover: {
                        size: 8
                    }
                },
                xaxis: {
                    categories: ['Purchase', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
                    title: {
                        text: 'Time (Years)',
                        style: {
                            fontSize: '12px',
                            fontWeight: 600
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Performance (%)',
                        style: {
                            fontSize: '12px',
                            fontWeight: 600
                        }
                    },
                    min: 0,
                    max: 100
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5
                },
                title: {
                    text: 'Product Lifecycle',
                    align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333'
                    }
                },
                subtitle: {
                    text: 'Performance over time',
                    align: 'left',
                    style: {
                        fontSize: '12px',
                        color: '#666'
                    }
                },
                grid: {
                    borderColor: '#f1f1f1',
                    row: {
                        colors: ['transparent', 'transparent'],
                        opacity: 0.5
                    }
                }
            };

            // Create the chart
            lifecycleChart = new ApexCharts(document.querySelector("#productLifecycleChart"), options);
            lifecycleChart.render();
            
            // Show a demo chart with refrigerator lifecycle data on initial load
            setTimeout(() => {
                // Generate sample lifecycle data for refrigerator
                const demoRefrigeratorData = generateLifecycleData('Refrigerator', 13);
                
                // Update chart with the demo data
                updateChart(demoRefrigeratorData);
                
                // Add a demo message in the chart section
                const graphDemoText = document.querySelector('.graph-demo p');
                if (graphDemoText) {
                    graphDemoText.innerHTML = 'This graph shows the lifecycle of a <strong>Refrigerator</strong> over 13 years. Ask our AI about other products to see their lifecycle data!';
                }
                
                // Add a demo indicator
                const graphContainer = document.querySelector('.graph-container');
                if (graphContainer && !document.querySelector('.demo-label')) {
                    const demoLabel = document.createElement('div');
                    demoLabel.className = 'demo-label';
                    demoLabel.textContent = 'DEMO';
                    graphContainer.appendChild(demoLabel);
                }
                
                // Mark the Refrigerator button as active
                const refrigeratorButton = document.querySelector('.graph-demo-button[data-product="Refrigerator"]');
                if (refrigeratorButton) {
                    refrigeratorButton.classList.add('active');
                }
            }, 500);
        }

        // Function to update chart with product lifecycle data
        function updateChart(lifecycleData) {
            console.log("Updating chart with data:", lifecycleData);
            
            // Ensure the chart is initialized
            if (!lifecycleChart) {
                console.error("Chart not initialized yet");
                return;
            }
            
            // Set appropriate title based on product type
            const timeUnit = lifecycleData.timeUnit || 'Years';
            const metricName = timeUnit === 'days' ? 'Freshness (%)' : 'Performance (%)';
            
            // Define colors for different product types
            const productColors = {
                // Food products
                'Milk': '#e0e0e0',
                'Cheese': '#ffd700',
                'Yogurt': '#fff0c0',
                'Butter': '#ffff99',
                'Eggs': '#ffdfb3',
                'Bread': '#d2b48c',
                'Apples': '#ff4500',
                'Bananas': '#ffff00',
                'Meat (Refrigerated)': '#bc8f8f',
                'Fish (Refrigerated)': '#b0e0e6',
                
                // Electronics
                'Refrigerator': '#3498db',
                'Washing Machine': '#9b59b6',
                'Dishwasher': '#2ecc71',
                'Microwave': '#f1c40f',
                'Television': '#e74c3c',
                'Laptop': '#34495e',
                'Smartphone': '#e67e22',
                'Water Heater': '#1abc9c',
                'Furnace': '#d35400',
                'Air Conditioner': '#2980b9'
            };
            
            // Get color for current product (default to blue if not defined)
            const productColor = productColors[lifecycleData.productName] || '#3498db';
            
            // Update chart data and options
            lifecycleChart.updateOptions({
                series: [{
                    name: lifecycleData.productName,
                    data: lifecycleData.performance
                }],
                xaxis: {
                    categories: lifecycleData.labels,
                    title: {
                        text: `Time (${timeUnit})`
                    }
                },
                yaxis: {
                    title: {
                        text: metricName
                    }
                },
                colors: [productColor],
                title: {
                    text: `${lifecycleData.productName} Lifecycle`
                },
                subtitle: {
                    text: `${metricName} over time`
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3,
                        stops: [0, 90, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: productColor,
                                opacity: 0.7
                            },
                            {
                                offset: 100,
                                color: productColor,
                                opacity: 0.3
                            }
                        ]
                    }
                },
                markers: {
                    colors: [productColor]
                }
            }, true, true);
            
            // Make sure the chart container is visible
            const graphContainer = document.querySelector('.graph-container');
            if (graphContainer) {
                graphContainer.style.display = 'block';
            }
            
            // Scroll to chart section
            document.getElementById('graph-demo').scrollIntoView({ behavior: 'smooth' });
        }

        // Function to generate lifecycle data for food products (short lifespan in days)
        function generateFoodLifecycleData(productName, maxDays, timeUnit) {
            // For food, we'll use a different approach with shorter timeframes
            
            // Create days array
            const timePoints = ['Purchase'];
            
            // For food items, we need to show a more rapid decline
            const intervals = Math.min(maxDays, 10); // Limit to 10 data points max
            const step = Math.max(1, Math.floor(maxDays / intervals));
            
            for (let i = step; i <= maxDays; i += step) {
                timePoints.push(`Day ${i}`);
            }
            
            // Create quality/freshness degradation curve (starting at 100%, ending at 0%)
            const freshness = [100];
            
            // Food quality usually degrades in a non-linear fashion
            // For simplicity, we'll use a slightly accelerating degradation
            for (let i = step; i <= maxDays; i += step) {
                // Non-linear degradation formula (faster decline as time passes)
                const ratio = i / maxDays;
                const decay = 100 * (1 - Math.pow(ratio, 1.2));
                
                // Add some small randomization
                const randomFactor = Math.random() * 5 - 2.5; // -2.5 to +2.5
                const dayFreshness = 100 - decay + randomFactor;
                
                // Ensure freshness doesn't go below 0 or above 100
                freshness.push(Math.min(Math.max(Math.round(dayFreshness), 0), 100));
            }
            
            // Return formatted data for chart
            return {
                productName: productName,
                labels: timePoints,
                performance: freshness,
                timeUnit: timeUnit || 'days'
            };
        }

        // Function to generate lifecycle data for a product (electronics and appliances)
        function generateLifecycleData(productName, lifespan) {
            // Create years array up to lifespan
            const years = ['Purchase'];
            for (let i = 1; i <= lifespan; i++) {
                years.push(`Year ${i}`);
            }
            
            // Create product degradation curve (starting at 100%, ending at 15%)
            const performance = [100];
            const endPerformance = 15;
            const degradationRate = (100 - endPerformance) / lifespan;
            
            for (let i = 1; i <= lifespan; i++) {
                // Slight randomization for realism
                const randomFactor = Math.random() * 5 - 2.5; // -2.5 to +2.5
                const yearPerformance = Math.round(100 - (degradationRate * i) + randomFactor);
                
                // Ensure performance doesn't go below end value or above start value
                performance.push(Math.min(Math.max(yearPerformance, endPerformance), 100));
            }
            
            // Return formatted data for chart
            return {
                productName: productName,
                labels: years,
                performance: performance,
                timeUnit: 'Years'
            };
        }

        // Function to send user message and get bot response
        async function sendMessage() {
            console.log("sendMessage function called");
            const userInputElement = document.getElementById('user-input');
            if (!userInputElement) {
                console.error("User input element not found");
                return;
            }
            
            const message = userInputElement.value.trim();
            console.log("Message content:", message);
            
            // Don't send empty messages
            if (message === '') {
                console.log("Message is empty, not sending");
                return;
            }
            
            // Add user message to chat
            addMessageToChat('user', message);
            
            // Clear input field
            userInputElement.value = '';
            
            // Add a "thinking" message
            const thinkingMsgElement = document.createElement('div');
            thinkingMsgElement.classList.add('bot-message', 'thinking-message');
            const thinkingText = document.createElement('p');
            thinkingText.textContent = "Thinking...";
            thinkingMsgElement.appendChild(thinkingText);
            chatMessages.appendChild(thinkingMsgElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                // First check if it's a product lifecycle query we can handle locally
                const localResponse = processUserMessage(message);
                
                if (localResponse.message !== "I'm not sure about that. Could you ask something about product lifespans or maintenance?") {
                    // Remove the thinking message
                    chatMessages.removeChild(thinkingMsgElement);
                    
                    // Add bot response to chat
                    addMessageToChat('bot', localResponse.message);
                    
                    // Update chart if product lifecycle data is available
                    if (localResponse.hasLifecycleData) {
                        updateChart(localResponse.lifecycleData);
                    }
                } else {
                    // If no local match, use Gemini API
                    const geminiResponse = await queryGeminiAPI(message);
                    
                    // Remove the thinking message
                    chatMessages.removeChild(thinkingMsgElement);
                    
                    // Add Gemini response to chat
                    addMessageToChat('bot', geminiResponse);
                }
            } catch (error) {
                // Remove the thinking message
                chatMessages.removeChild(thinkingMsgElement);
                
                // Show error message
                addMessageToChat('bot', "I'm having trouble connecting right now. Let me provide a basic answer instead.");
                
                // Fallback to local response
                const fallbackResponse = processUserMessage(message);
                setTimeout(() => {
                    addMessageToChat('bot', fallbackResponse.message);
                    
                    if (fallbackResponse.hasLifecycleData) {
                        updateChart(fallbackResponse.lifecycleData);
                    }
                }, 1000);
            }
        }
        
        // Expose sendMessage to global scope
        window.sendMessage = sendMessage;

        // Function to query the Gemini API
        async function queryGeminiAPI(message) {
            // Create a prompt that allows for general knowledge questions
            const fullPrompt = `You are a helpful AI assistant specializing in product lifecycle information, but you can also answer general knowledge questions. 
For product-related questions, provide information on lifespans, maintenance tips, and replacement advice.
For general knowledge questions (like "who is Modi" or "what is climate change"), provide accurate factual information.
Keep your responses concise and informative, with a maximum of 3-4 sentences.
If you're not sure about specific information, say so rather than making up details.

User query: ${message}`;
            
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get response from Gemini API');
            }
            
            const data = await response.json();
            
            // Extract the text from the response
            if (data.candidates && 
                data.candidates[0] && 
                data.candidates[0].content && 
                data.candidates[0].content.parts && 
                data.candidates[0].content.parts[0] && 
                data.candidates[0].content.parts[0].text) {
                
                const responseText = data.candidates[0].content.parts[0].text;
                // Clean up the response by removing any references to being an AI assistant
                return responseText
                    .replace(/^(As an AI assistant|As an AI|As a language model|As an assistant|I'm an AI|I am an AI).*?\./i, '')
                    .replace(/^(I'm sorry|I am sorry|Sorry)[,.].*?\./i, '')
                    .trim();
            }
            
            return "I couldn't generate a proper response. Could you try asking in a different way?";
        }

        // Function to add message to the chat
        function addMessageToChat(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
            
            const messageText = document.createElement('p');
            messageText.textContent = message;
            
            messageElement.appendChild(messageText);
            chatMessages.appendChild(messageElement);
            
            // Scroll to bottom of messages
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Function to process user message and generate a response
        function processUserMessage(message) {
            // Convert message to lowercase for easier matching
            const lowerMessage = message.toLowerCase();
            
            // Default response object
            let response = {
                message: "I'm not sure about that. Could you ask something about product lifespans or maintenance?",
                hasLifecycleData: false,
                lifecycleData: null
            };
            
            // Handle general knowledge questions
            if (lowerMessage.match(/who is|who was|what is|what are|tell me about|when was|define|explain/i)) {
                // Handle various general knowledge questions
                if (lowerMessage.includes('modi')) {
                    response.message = "Narendra Modi is the Prime Minister of India since 2014. He was previously the Chief Minister of Gujarat from 2001 to 2014. While I'm primarily designed to help with product lifecycle information, I can provide brief answers to general questions as well.";
                    return response;
                } 
                else if (lowerMessage.includes('biden')) {
                    response.message = "Joe Biden is the 46th President of the United States, taking office in January 2021. I primarily focus on product lifecycle information, but I can answer some general knowledge questions too.";
                    return response;
                }
                else if (lowerMessage.includes('trump')) {
                    response.message = "Donald Trump is a businessman and politician who served as the 45th President of the United States from 2017 to 2021. While I specialize in product lifecycle information, I can provide basic information on other topics.";
                    return response;
                }
                else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
                    response.message = "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These include learning, reasoning, problem-solving, perception, and language understanding. I'm a simple AI assistant focused on product lifecycle information.";
                    return response;
                }
                else {
                    response.message = "I'm primarily designed to answer questions about product lifecycles, maintenance, and replacements. For detailed information about people, events, or other topics, you might want to use a general search engine. Could I help you with information about a product instead?";
                    return response;
                }
            }
            
            // Check for product lifespan related queries
            if (lowerMessage.includes('how long') || lowerMessage.includes('lifespan') || lowerMessage.includes('lifetime') || lowerMessage.includes('last') || lowerMessage.includes('life') || lowerMessage.includes('time') || lowerMessage.includes('old') || lowerMessage.includes('years')) {
                
                // Check for specific foods and dairy products
                if (lowerMessage.includes('milk') || lowerMessage.includes('dairy milk')) {
                    response.message = "Fresh milk typically lasts 5-7 days when refrigerated. Ultra-pasteurized milk can last up to 2-3 weeks unopened in the refrigerator.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Milk', 7, 'days');
                }
                else if (lowerMessage.includes('cheese') || lowerMessage.includes('cheddar')) {
                    response.message = "Hard cheeses like cheddar can last 3-4 weeks when properly refrigerated. Soft cheeses have a shorter lifespan of about 1-2 weeks.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Cheese', 28, 'days');
                }
                else if (lowerMessage.includes('yogurt') || lowerMessage.includes('yoghurt')) {
                    response.message = "Unopened yogurt typically lasts 2-3 weeks refrigerated. Once opened, it's best consumed within 7-10 days.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Yogurt', 21, 'days');
                }
                else if (lowerMessage.includes('butter')) {
                    response.message = "Refrigerated butter can last about 1-3 months. Butter can be frozen for up to a year while maintaining quality.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Butter', 90, 'days');
                }
                else if (lowerMessage.includes('eggs')) {
                    response.message = "Fresh eggs typically last 3-5 weeks in the refrigerator. The 'sell by' date is usually a good indicator of freshness.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Eggs', 35, 'days');
                } 
                else if (lowerMessage.includes('bread') || lowerMessage.includes('loaf')) {
                    response.message = "Store-bought bread typically lasts 5-7 days at room temperature, or up to 2 weeks when refrigerated. Homemade bread tends to have a shorter lifespan of 3-4 days.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Bread', 7, 'days');
                }
                else if (lowerMessage.includes('apple') || lowerMessage.includes('apples')) {
                    response.message = "Apples can last 1-2 months when refrigerated. At room temperature, they typically stay fresh for about 1-2 weeks.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Apples', 60, 'days');
                }
                else if (lowerMessage.includes('banana') || lowerMessage.includes('bananas')) {
                    response.message = "Bananas last about 2-5 days once ripe at room temperature. Refrigerating ripe bananas can extend their life by a few days, though the peels will blacken.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Bananas', 5, 'days');
                }
                else if (lowerMessage.includes('meat') || lowerMessage.includes('beef') || lowerMessage.includes('chicken')) {
                    response.message = "Raw meat should be used within 1-3 days when refrigerated. Frozen meat can last 3-12 months depending on the type. Cooked meat lasts 3-4 days in the refrigerator.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Meat (Refrigerated)', 3, 'days');
                }
                else if (lowerMessage.includes('fish') || lowerMessage.includes('seafood')) {
                    response.message = "Fresh fish should be consumed within 1-2 days of purchase when refrigerated. Frozen fish can maintain quality for 3-8 months depending on the type.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateFoodLifecycleData('Fish (Refrigerated)', 2, 'days');
                }
                // Check for specific electronics
                else if (lowerMessage.includes('refrigerator') || lowerMessage.includes('fridge')) {
                    response.message = "A typical refrigerator lasts about 10-13 years. Regular cleaning of coils and proper temperature settings can extend its life.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Refrigerator', 13);
                } 
                else if (lowerMessage.includes('washing machine') || lowerMessage.includes('washer')) {
                    response.message = "Washing machines generally last about 8-12 years. Front-loaders tend to last longer than top-loaders.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Washing Machine', 10);
                }
                else if (lowerMessage.includes('dishwasher')) {
                    response.message = "A dishwasher typically lasts 8-10 years. Regular cleaning and using proper detergent can help maintain it.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Dishwasher', 9);
                }
                else if (lowerMessage.includes('microwave')) {
                    response.message = "Microwaves usually last around 7-9 years depending on usage and quality.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Microwave', 8);
                }
                else if (lowerMessage.includes('tv') || lowerMessage.includes('television')) {
                    response.message = "Modern LED/LCD TVs typically last 7-10 years with regular use. OLED TVs might have shorter lifespans due to pixel degradation.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Television', 9);
                }
                else if (lowerMessage.includes('laptop') || lowerMessage.includes('computer')) {
                    response.message = "Laptops generally last 3-5 years for regular users, though they can last longer with care and possible upgrades.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Laptop', 5);
                }
                else if (lowerMessage.includes('smartphone') || lowerMessage.includes('phone')) {
                    response.message = "Smartphones typically last 2-3 years before significant performance degradation, though with care they can function longer.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Smartphone', 3);
                }
                else if (lowerMessage.includes('water heater')) {
                    response.message = "Tank water heaters last about 8-12 years, while tankless models can last up to 20 years with proper maintenance.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Water Heater', 10);
                }
                else if (lowerMessage.includes('furnace') || lowerMessage.includes('hvac')) {
                    response.message = "Furnaces typically last 15-20 years, but regular maintenance is key to reaching the upper end of that range.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Furnace', 18);
                }
                else if (lowerMessage.includes('air conditioner') || lowerMessage.includes('ac')) {
                    response.message = "Central air conditioners usually last 12-15 years if properly maintained with regular filter changes and inspections.";
                    response.hasLifecycleData = true;
                    response.lifecycleData = generateLifecycleData('Air Conditioner', 15);
                }
                else {
                    response.message = "I don't have specific data on that product's lifespan. Most home appliances last 8-15 years, electronics typically last 3-7 years, and refrigerated food items last a few days to weeks. Could you ask about a specific product?";
                }
            }
            // Check for maintenance questions
            else if (lowerMessage.includes('maintain') || lowerMessage.includes('maintenance') || lowerMessage.includes('care') || lowerMessage.includes('extend') || lowerMessage.includes('keep') || lowerMessage.includes('preserve')) {
                if (lowerMessage.includes('refrigerator') || lowerMessage.includes('fridge')) {
                    response.message = "To maintain your refrigerator: 1) Clean the coils every 6 months, 2) Check and clean door seals regularly, 3) Keep it at optimal temperature (35-38°F), 4) Don't overload it, 5) Defrost regularly if needed.";
                }
                else if (lowerMessage.includes('washing machine') || lowerMessage.includes('washer')) {
                    response.message = "To maintain your washing machine: 1) Don't overload, 2) Use the right amount of detergent, 3) Leave the door open after use to prevent mold, 4) Clean the dispenser drawer regularly, 5) Run a hot empty cycle monthly with vinegar to clean.";
                }
                else if (lowerMessage.includes('dishwasher')) {
                    response.message = "For dishwasher maintenance: 1) Clean the filter monthly, 2) Check and clean spray arms, 3) Use rinse aid, 4) Run hot water in sink before starting, 5) Clean door seals periodically.";
                }
                else if (lowerMessage.includes('smartphone') || lowerMessage.includes('phone')) {
                    response.message = "To extend smartphone life: 1) Use a protective case and screen protector, 2) Don't charge to 100% or let it drop below 20% regularly, 3) Keep it away from extreme temperatures, 4) Clean ports carefully, 5) Update software regularly.";
                }
                else {
                    response.message = "General maintenance tips: 1) Follow manufacturer guidelines, 2) Clean regularly, 3) Handle with care, 4) Address issues promptly, 5) Schedule professional maintenance when recommended.";
                }
            }
            // Check for replacement questions
            else if (lowerMessage.includes('replace') || lowerMessage.includes('replacement') || lowerMessage.includes('new') || lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('upgrade')) {
                response.message = "It's typically time to replace a product when: 1) It's reached 75% of its expected lifespan AND showing problems, 2) Repairs would cost more than 50% of a new unit, 3) It's energy efficiency is significantly lower than newer models, 4) Parts are no longer available.";
            }
            // General greeting
            else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('greetings') || lowerMessage.includes('howdy')) {
                response.message = "Hello! I'm your Product Lifecycle Assistant. How can I help you today? You can ask me about how long products last, maintenance tips, or when you should consider a replacement.";
            }
            // Handle "thank you" messages
            else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciated') || lowerMessage.includes('helpful')) {
                response.message = "You're welcome! I'm glad I could help. Feel free to ask if you have any other questions about product lifecycles.";
            }
            // Handle questions about the website or service
            else if (lowerMessage.includes('what can you') || lowerMessage.includes('how do you') || lowerMessage.includes('what do you') || lowerMessage.includes('help me')) {
                response.message = "I can help you with information about product lifespans, maintenance tips, and when to consider replacing various household items and electronics. Try asking about specific products like 'How long does a refrigerator last?' or 'How can I maintain my smartphone?'";
            }
            
            return response;
        }

        // Add smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // CTA Button click event
        document.querySelector('.cta-button').addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            userInput.focus();
        });
        
        // Set up demo buttons for the graph section
        document.querySelectorAll('.graph-demo-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const product = this.getAttribute('data-product');
                const lifespan = parseInt(this.getAttribute('data-lifespan'));
                const timeUnit = this.getAttribute('data-unit') || 'Years';
                
                console.log(`Demo button clicked: ${product}, ${lifespan}, ${timeUnit}`);
                
                // Generate the appropriate lifecycle data
                let lifecycleData;
                if (timeUnit.toLowerCase() === 'days') {
                    console.log(`Generating food lifecycle data for ${product}`);
                    lifecycleData = generateFoodLifecycleData(product, lifespan, timeUnit);
                } else {
                    console.log(`Generating electronic lifecycle data for ${product}`);
                    lifecycleData = generateLifecycleData(product, lifespan);
                }
                
                console.log("Generated lifecycle data:", lifecycleData);
                
                // Check if chart exists
                if (!lifecycleChart) {
                    console.error("Chart not initialized, trying to initialize now");
                    initializeChart();
                    setTimeout(() => {
                        updateChart(lifecycleData);
                    }, 100);
                } else {
                    // Update chart with the demo data
                    console.log("Updating chart with lifecycle data");
                    updateChart(lifecycleData);
                }
                
                // Update the description text
                const graphDemoText = document.querySelector('.graph-demo p');
                if (graphDemoText) {
                    if (timeUnit.toLowerCase() === 'days') {
                        graphDemoText.innerHTML = `This graph shows the freshness of <strong>${product}</strong> over ${lifespan} days. Try different products or ask our AI chatbot!`;
                    } else {
                        graphDemoText.innerHTML = `This graph shows the lifecycle of a <strong>${product}</strong> over ${lifespan} years. Try different products or ask our AI chatbot!`;
                    }
                }
                
                // Highlight the active button
                document.querySelectorAll('.graph-demo-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    } catch (error) {
        console.error("Error in script.js initialization:", error);
    }
});

// Add redundant event listeners for critical UI elements
window.addEventListener('load', function() {
    console.log("Applying redundant event listeners for critical UI elements");
    
    // Fix for FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                console.log("FAQ question clicked (redundant handler)");
                item.classList.toggle('active');
            });
        }
    });
    
    // Fix for chatbot close button
    const closeChat = document.querySelector('.close-chat');
    const chatbotContainer = document.querySelector('.chatbot-container');
    if (closeChat && chatbotContainer) {
        closeChat.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Close chat button clicked (redundant handler)");
            chatbotContainer.classList.remove('active');
        });
    }
}); 