// Updated signup.js
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

function handleSignUp(event) {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match!");
        return;
    }

    const userData = {
        fullname,
        email,
        phone,
        password
    };

    fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Sign up successful!") {
            alert("Sign up successful! Redirecting to login...");
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
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.textContent = "Already have an account? Log in";
    loginLink.className = "login-link";

    loginLink.style.position = "absolute";
    loginLink.style.bottom = "15px";
    loginLink.style.left = "15px";
    loginLink.style.fontSize = "14px";
    loginLink.style.color = "#4cd137";
    loginLink.style.textDecoration = "none";

    document.body.appendChild(loginLink);
});