const ready = callback => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
};

ready(() => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
    const smoothAnchors = document.querySelectorAll("a[href^='#']:not([href='#'])");
    const sections = document.querySelectorAll("section[id]");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("is-open");
            navToggle.classList.toggle("is-open");
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("is-open");
                navToggle.classList.remove("is-open");
            });
        });
    }

    if (smoothAnchors.length) {
        smoothAnchors.forEach(anchor => {
            anchor.addEventListener("click", evt => {
                const targetId = anchor.getAttribute("href");
                if (!targetId || targetId === "#") {
                    return;
                }
                evt.preventDefault();
                document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
                if (targetId.length > 1) {
                    history.replaceState(null, "", targetId);
                }
            });
        });
    }

    if (navAnchors.length) {
        const highlightActiveLink = () => {
            const scrollPos = window.scrollY + 120;
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute("id");
                if (scrollPos >= top && scrollPos < bottom && id) {
                    navAnchors.forEach(link => {
                        link.removeAttribute("aria-current");
                        if (link.getAttribute("href") === `#${id}`) {
                            link.setAttribute("aria-current", "page");
                        }
                    });
                }
            });
        };

        highlightActiveLink();
        window.addEventListener("scroll", highlightActiveLink);
    }

    const animateOnScroll = document.querySelectorAll("[data-animate]");
    if ("IntersectionObserver" in window && animateOnScroll.length) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18,
            },
        );

        animateOnScroll.forEach(section => observer.observe(section));
    }

    const floatingInputs = document.querySelectorAll(".form-floating input, .form-floating textarea, .form-floating select");
    floatingInputs.forEach(field => {
        field.addEventListener("focus", () => field.classList.add("is-active"));
        field.addEventListener("blur", () => {
            if (!field.value) {
                field.classList.remove("is-active");
            }
        });
    });
});

