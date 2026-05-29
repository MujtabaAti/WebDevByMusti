// Language Handling Logic
document.addEventListener("DOMContentLoaded", () => {
    const langToggle = document.getElementById("lang-toggle");

    // Check local storage or default to 'de'
    let currentLang = "de";
    try {
        currentLang = localStorage.getItem("preferredLanguage") || "de";
    } catch (e) {
        console.warn("localStorage not available, defaulting to DE");
    }

    updateLanguage(currentLang);

    // Set toggle state
    if(langToggle) {
        langToggle.checked = currentLang === "en";

        langToggle.addEventListener("change", (e) => {
            currentLang = e.target.checked ? "en" : "de";
            updateLanguage(currentLang);
        });
    }

    function updateLanguage(lang) {
        try {
            localStorage.setItem("preferredLanguage", lang);
        } catch (e) {}

        document.documentElement.lang = lang;

        const elements = document.querySelectorAll("[data-i18n]");

        elements.forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                // If it's an input placeholder
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    el.placeholder = translations[lang][key];
                } else {
                    el.classList.add("is-translating");
                    setTimeout(() => {
                        el.textContent = translations[lang][key];
                        el.classList.remove("is-translating");
                    }, 150);
                }
            }
        });

        // Update toggle labels visually
        const labelDe = document.querySelector(".lang-lbl.de");
        const labelEn = document.querySelector(".lang-lbl.en");
        if(labelDe && labelEn) {
            if(lang === "de") {
                labelDe.classList.add("active");
                labelEn.classList.remove("active");
            } else {
                labelEn.classList.add("active");
                labelDe.classList.remove("active");
            }
        }
    }
});
