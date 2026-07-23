(() => {
    "use strict";

    const header = document.getElementById("siteHeader");
    const menuButton = document.getElementById("menuButton");
    const siteNavigation = document.getElementById("siteNavigation");
    const restrictedButton = document.getElementById("restrictedButton");
    const restrictedMessage = document.getElementById("restrictedMessage");

    const centurySlider = document.getElementById("centurySlider");
    const selectedCentury = document.getElementById("selectedCentury");
    const futureRecords = document.getElementById("futureRecords");
    const twentiethCenturyRecords = document.getElementById("twentiethCenturyRecords");

    function updateHeaderState() {
        if (!header) {
            return;
        }

        header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    function closeMenu() {
        if (!menuButton || !siteNavigation) {
            return;
        }

        menuButton.classList.remove("is-open");
        siteNavigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
    }

    function initializeMenu() {
        if (!menuButton || !siteNavigation) {
            return;
        }

        menuButton.addEventListener("click", () => {
            const isOpen = siteNavigation.classList.toggle("is-open");

            menuButton.classList.toggle("is-open", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
        });

        siteNavigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            const clickedInsideNavigation = siteNavigation.contains(event.target);
            const clickedMenuButton = menuButton.contains(event.target);

            if (!clickedInsideNavigation && !clickedMenuButton) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    function initializeRevealAnimation() {
        const revealElements = document.querySelectorAll(".reveal");

        if (revealElements.length === 0) {
            return;
        }

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -12% 0px",
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    function initializeRestrictedRecord() {
        if (!restrictedButton || !restrictedMessage) {
            return;
        }

        restrictedButton.addEventListener("click", () => {
            restrictedMessage.textContent = "접근 권한이 부족합니다. 기록 열람이 거부되었습니다.";

            restrictedButton.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(-5px)" },
                    { transform: "translateX(5px)" },
                    { transform: "translateX(-3px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 320,
                    easing: "ease-out"
                }
            );
        });
    }

    function updateCenturyArchive() {
        if (
            !centurySlider ||
            !selectedCentury ||
            !futureRecords ||
            !twentiethCenturyRecords
        ) {
            return;
        }

        const selectedValue = centurySlider.value;
        const showingFuture = selectedValue === "0";

        selectedCentury.textContent = showingFuture ? "<추후 공지>" : "20세기 기록";
        futureRecords.hidden = !showingFuture;
        twentiethCenturyRecords.hidden = showingFuture;
    }

    function initializeCenturySlider() {
        if (!centurySlider) {
            return;
        }

        centurySlider.addEventListener("input", updateCenturyArchive);
        updateCenturyArchive();
    }

    updateHeaderState();

    window.addEventListener("scroll", updateHeaderState, {
        passive: true
    });

    initializeMenu();
    initializeRevealAnimation();
    initializeRestrictedRecord();
    initializeCenturySlider();
})();
