const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const animatedItems = document.querySelectorAll(".fade-in");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

year.textContent = new Date().getFullYear();

const handleHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
};

handleHeader();
window.addEventListener("scroll", handleHeader, { passive: true });

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    animatedItems.forEach((item) => observer.observe(item));
} else {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
}

const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");
const snippets = ["<main>", "API", "SEO", "CTA", "deploy", "{ }", "99", "UX", "</>"];
let particles = [];
let width = 0;
let height = 0;

const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(68, Math.floor(width / 18)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        text: snippets[Math.floor(Math.random() * snippets.length)],
        size: 11 + Math.random() * 6,
        alpha: 0.18 + Math.random() * 0.28
    }));
};

const drawCanvas = () => {
    if (prefersReducedMotion) return;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "700 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -50) particle.x = width + 50;
        if (particle.x > width + 50) particle.x = -50;
        if (particle.y < -40) particle.y = height + 40;
        if (particle.y > height + 40) particle.y = -40;

        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = index % 3 === 0 ? "#14b8a6" : index % 3 === 1 ? "#fb923c" : "#dbeafe";
        ctx.font = `700 ${particle.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.fillText(particle.text, particle.x, particle.y);

        for (let i = index + 1; i < particles.length; i += 1) {
            const other = particles[i];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.globalAlpha = (1 - distance / 120) * 0.14;
                ctx.strokeStyle = "#dbeafe";
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawCanvas);
};

if (!prefersReducedMotion) {
    resizeCanvas();
    drawCanvas();
    window.addEventListener("resize", resizeCanvas);
}
