// Updated login.js
function togglePassword(fieldId, eyeIcon) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
        eyeIcon.textContent = "🙈";
    } else {
        input.type = "password";
        eyeIcon.textContent = "👁️";
    }
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("loginPassword").value;

    const loginData = { email, password };

    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful!") {
            alert("Login successful! Redirecting to profile...");
            window.location.href = "profile.html";
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const signupLink = document.createElement("a");
    signupLink.href = "signup.html"; 
    signupLink.textContent = "Don't have any account? Sign up";
    signupLink.className = "login-link";

    signupLink.style.position = "absolute";
    signupLink.style.bottom = "15px";
    signupLink.style.left = "15px";
    signupLink.style.fontSize = "14px";
    signupLink.style.color = "#4cd137";
    signupLink.style.textDecoration = "none";
    signupLink.style.fontWeight = "500";

    signupLink.addEventListener("mouseover", () => signupLink.style.color = "#44bd32");
    signupLink.addEventListener("mouseout", () => signupLink.style.color = "#4cd137");

    document.body.appendChild(signupLink);
});