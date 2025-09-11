window.onload = function () {
  // Anime student extra parts
  const s = document.getElementById('animeStudent');
  if (s) {
    s.innerHTML = `
      <div class="tie"></div>
      <div class="hand"></div>
      <div class="hand right"></div>
      <div class="leg"></div>
      <div class="leg right"></div>
    `;

    // Initial animation
    s.style.opacity = 0;
    s.style.transform = "translateY(40px)";

    setTimeout(() => {
      s.style.transition = "all 1s cubic-bezier(.19,1,.22,1)";
      s.style.opacity = 1;
      s.style.transform = "translateY(0)";

      setTimeout(() => {
        const hand = s.querySelector('.hand');
        if (hand) {
          hand.style.transition = "transform 0.5s ease";
          hand.style.transform = "rotate(-22deg) scaleY(1.2)";
        }
      }, 800);

    }, 300);
  }

  // Typing effect for greeting
  const greetingTxt = "Hello, welcome to our HackStreet!";
  const greetingDiv = document.getElementById('greeting');
  if (greetingDiv) {
    greetingDiv.innerHTML = "";
    let i = 0;
    const speed = 24;

    function typing() {
      if (i < greetingTxt.length) {
        greetingDiv.innerHTML += greetingTxt.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    }

    setTimeout(typing, 1400);
  }
};

// Show chatbot
function startChat() {
  const chatbot = document.getElementById("chatbot");
  if (chatbot) {
    chatbot.style.display = "block";
  }
}

// Chat send button
document.getElementById("send-button")?.addEventListener("click", function () {
  const input = document.getElementById("user-input");
  const chatBody = document.getElementById("chat-body");
  if (!input || !chatBody) return;

  let userMsg = input.value.trim();
  if (userMsg === "") return;

  // Append user message
  chatBody.innerHTML += `<div class="message user">${userMsg}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot response simulation
  setTimeout(() => {
    let demoMsg = `This is a demo response for: ${userMsg}`;
    let botMsg = "";
    let j = 0;

    function botTyping() {
      if (j < demoMsg.length) {
        botMsg += demoMsg.charAt(j);
        // Remove previous typing span
        chatBody.querySelector('.message.bot:last-child')?.remove();
        chatBody.innerHTML += `<div class="message bot">${botMsg}<span class="typing">|</span></div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        j++;
        setTimeout(botTyping, 18);
      } else {
        // Remove the typing cursor after message finishes
        chatBody.querySelector('.typing')?.remove();
      }
    }

    // Add initial empty bot message
    chatBody.innerHTML += `<div class="message bot"></div>`;
    botTyping();
  }, 700);

  // Clear input
  input.value = "";
});

// Optional: Press Enter key to send
document.getElementById("user-input")?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("send-button")?.click();
  }
});
