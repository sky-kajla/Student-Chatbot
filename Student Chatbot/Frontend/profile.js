// Updated profile.js
const profileContainer = document.getElementById("profile-container");

// Load profile data on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
});

// Function to fetch profile data from the backend
async function fetchProfile() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/profile`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.message) {
            alert("Error: " + data.message);
            profileContainer.innerHTML = `<p>Error loading profile. Please <a href="login.html" style="color:#4cd137;">log in</a>.</p>`;
        } else {
            renderProfile(data, false);
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        profileContainer.innerHTML = `<p>Failed to connect to the server.</p>`;
    }
}

// Function to render profile view
function renderProfile(userData, isEditing = false) {
    if (isEditing) {
        profileContainer.innerHTML = `
      ${userData.photo_url ? `<img src="${userData.photo_url}" class="profile-photo" alt="Profile Photo">` : ""}
      <input type="text" id="editName" class="edit-input" value="${userData.fullname}" placeholder="Full Name">
      <input type="email" id="editEmail" class="edit-input" value="${userData.email}" placeholder="Email" readonly>
      <input type="tel" id="editPhone" class="edit-input" value="${userData.phone || ""}" placeholder="Phone">
      <button class="btn btn-save" onclick="saveProfile()">💾 Save</button>
      <button class="btn btn-cancel" onclick="cancelEdit()">❌ Cancel</button>
    `;
    } else {
        profileContainer.innerHTML = `
      ${userData.photo_url ? `<img src="${userData.photo_url}" class="profile-photo" alt="Profile Photo">` : ""}
      <p class="name">${userData.fullname}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Phone:</strong> ${userData.phone || "Not provided"}</p>
      <button class="btn btn-edit" onclick="editProfile()">✏️ Edit</button>
      <button class="btn btn-logout" onclick="logout()">Log Out</button>
    `;
    }
}

// Functions to handle profile actions
function editProfile() {
    // The fetchProfile function now gets the user from the backend
    fetchProfile();
}

function cancelEdit() {
    fetchProfile();
}

// Function to save profile data to the backend
async function saveProfile() {
    const newName = document.getElementById("editName").value.trim();
    const newPhone = document.getElementById("editPhone").value.trim();

    if (!newName) {
        alert("Name cannot be empty!");
        return;
    }

    const updatedData = {
        fullname: newName,
        phone: newPhone
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/profile/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData),
            credentials: 'include'
        });

        const data = await response.json();
        if (data.message === "Profile updated successfully.") {
            alert("Profile updated successfully!");
            fetchProfile(); // Re-fetch from the backend to ensure data is in sync
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to connect to the server.");
    }
}

// Function to handle photo upload (simplified)
async function handlePhotoUpload() {
    const fileInput = document.getElementById("photoInput");
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const photoDataUrl = e.target.result;
        const updateData = {
            photo_url: photoDataUrl
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.message === "Profile updated successfully.") {
                alert("Profile photo updated successfully!");
                fetchProfile(); // Re-fetch to display the new photo
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error updating photo:", error);
            alert("Failed to upload photo.");
        }
    };
    reader.readAsDataURL(file);
}

// Add this logout function
async function logout() {
    try {
        const response = await fetch("http://127.0.0.1:5000/logout", {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.message === "Logged out successfully.") {
            alert("You have been logged out.");
            window.location.href = "login.html"; // Redirect to the login page
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Failed to log out. Please try again.");
    }
}