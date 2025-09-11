import React, { useState, useEffect } from 'react';

// A simple function to simulate a chatbot response
const getChatbotResponse = async (message) => {
    // In a real application, this would be a fetch call to a backend server
    // that runs the Python script and returns a response.
    console.log(`Sending message to backend: ${message}`);
    // Simulate a delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
        "hi": "Hello! How can I help you?",
        "hello": "Hi there! What can I do for you today?",
        "how are you": "I'm doing great, thanks for asking!",
        "what can you do": "I can answer questions about college life, like admissions, courses, and campus services.",
        "thanks": "You're welcome!",
        "what is your name": "I am a chatbot, I don't have a name.",
        "bye": "Goodbye! Have a great day!"
    };

    const lowerCaseMessage = message.toLowerCase();
    for (const key in responses) {
        if (lowerCaseMessage.includes(key)) {
            return responses[key];
        }
    }

    return "Sorry, I don't understand that. Can you please rephrase?";
};

const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        // Add user message to chat
        const newUserMessage = { text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setInput('');

        // Get and add bot response to chat
        const botResponseText = await getChatbotResponse(input);
        const newBotMessage = { text: botResponseText, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, newBotMessage]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg flex flex-col h-[70vh]">
                <div className="p-4 border-b rounded-t-xl bg-gray-50 text-center font-bold text-gray-700">
                    Student Chatbot
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
