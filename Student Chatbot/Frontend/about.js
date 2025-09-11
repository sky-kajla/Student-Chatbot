document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling for navigation links (if href="#id")
  const navLinks = document.querySelectorAll("header nav ul li a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").split("#")[1];
      if (targetId) {
        e.preventDefault();
        const target = document.getElementById(targetId);
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Animate sections on scroll (fade in)
  const sections = document.querySelectorAll("section");
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));

  // Team member hover effect (scale)
  const teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach(member => {
    member.addEventListener("mouseenter", () => member.style.transform = "scale(1.05)");
    member.addEventListener("mouseleave", () => member.style.transform = "scale(1)");
  });

});
