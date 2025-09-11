document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("helpForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill all the fields.");
            return;
        }

        // In real app, here you would send data to server
        alert(`Thank you ${name}! Your message has been received. We will contact you at ${email}.`);

        // Reset form
        form.reset();
    });
});
