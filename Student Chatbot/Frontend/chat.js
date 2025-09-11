// Updated chat.js
$(document).ready(function () {
    const API_URL = "http://127.0.0.1:5000/chat";
    const SESSION_ID = generateSessionId();

    // Load chat history from local storage or start with an empty array
    let chatHistory = JSON.parse(localStorage.getItem("HackStreetChatHistory")) || [];

    // Render any saved chat history on page load
    renderChatHistory();

    // Send message on button click
    $(".send_btn").on("click", function () {
        sendMessage();
    });

    // Send message on Enter key
    $(".type_msg").on("keypress", function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Renders chat messages from chatHistory array
    function renderChatHistory() {
        chatHistory.forEach(message => {
            if (message.role === "user") {
                let msgHtml = `
                    <div class="d-flex justify-content-end mb-4">
                        <div class="msg_cotainer_send">
                            ${escapeHtml(message.parts[0].text)}
                            <span class="msg_time_send">${getCurrentTime()}</span>
                        </div>
                        <div class="img_cont_msg">
                            <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                        </div>
                    </div>
                `;
                $(".msg_card_body").append(msgHtml);
            } else {
                let replyHtml = `
                    <div class="d-flex justify-content-start mb-4">
                        <div class="img_cont_msg">
                            <img src="97e6f81c-6da9-4848-9fa3-d70de7ace3e1.jpeg" class="rounded-circle user_img_msg">
                        </div>
                        <div class="msg_cotainer">
                            ${escapeHtml(message.parts[0].text)}
                            <span class="msg_time">${getCurrentTime()}</span>
                        </div>
                    </div>
                `;
                $(".msg_card_body").append(replyHtml);
            }
        });
        scrollToBottom();
    }

    async function sendMessage() {
        let msg = $(".type_msg").val().trim();
        if (msg === "") return;

        let time = getCurrentTime();

        // User message HTML
        let msgHtml = `
            <div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${escapeHtml(msg)}
                    <span class="msg_time_send">${time}</span>
                </div>
                <div class="img_cont_msg">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                </div>
            </div>
        `;
        $(".msg_card_body").append(msgHtml);
        scrollToBottom();
        $(".type_msg").val("");

        // Add user message to history and save
        chatHistory.push({ role: "user", parts: [{ text: msg }] });
        saveChatHistory();

        showTyping();

        try {
            // Send message and history to Flask API
            let response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: msg,
                    session_id: SESSION_ID,
                    history: chatHistory // Send the full conversation history
                })
            });

            let data = await response.json();
            hideTyping();
            botReply(data.answer);
            
            // Add bot reply to history and save
            chatHistory.push({ role: "model", parts: [{ text: data.answer }] });
            saveChatHistory();

        } catch (error) {
            hideTyping();
            botReply("⚠️ Error connecting to server.");
        }
    }

    function botReply(reply) {
        let time = getCurrentTime();

        let replyHtml = `
            <div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="97e6f81c-6da9-4848-9fa3-d70de7ace3e1.jpeg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    ${escapeHtml(reply)}
                    <span class="msg_time">${time}</span>
                </div>
            </div>
        `;
        $(".msg_card_body").append(replyHtml);
        scrollToBottom();
    }

    // New function to save chat history to local storage
    function saveChatHistory() {
        localStorage.setItem("HackStreetChatHistory", JSON.stringify(chatHistory));
    }

    function showTyping() {
        let typingHtml = `
            <div class="typing-indicator d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="97e6f81c-6da9-4848-9fa3-d70de7ace3e1.jpeg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    <span class="typing-dots">Bot is typing...</span>
                </div>
            </div>
        `;
        $(".msg_card_body").append(typingHtml);
        scrollToBottom();
    }

    function hideTyping() {
        $(".typing-indicator").remove();
    }

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        if (minutes < 10) minutes = "0" + minutes;
        return `${hours}:${minutes}`;
    }

    function scrollToBottom() {
        $(".msg_card_body").scrollTop($(".msg_card_body")[0].scrollHeight);
    }

    function escapeHtml(text) {
        return text.replace(/[\"&'\/<>]/g, function (char) {
            return {
                '"': "&quot;",
                "&": "&amp;",
                "'": "&#39;",
                "/": "&#47;",
                "<": "&lt;",
                ">": "&gt;"
            }[char];
        });
    }

    function generateSessionId() {
        return "session_" + Math.random().toString(36).substr(2, 9);
    }
});