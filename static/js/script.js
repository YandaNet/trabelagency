document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript повністю підключено та готовий до роботи.");


    const menuToggle = document.querySelector("#menu-toggle");
    const mainNav = document.querySelector("#main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("open");
        });
    }

 
    const searchInput = document.querySelector("#search-input");
    const priceInput = document.querySelector("#price-input");
    const tourCards = document.querySelectorAll(".tour-card");
    const noToursMessage = document.querySelector("#no-tours-found");

    function filterTours() {
        if (!tourCards.length) return;

        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const maxPrice = priceInput && priceInput.value !== "" ? Number(priceInput.value) : Infinity;

        let visibleCount = 0;

        tourCards.forEach(function (card) {
            const title = (card.getAttribute("data-title") || "").toLowerCase();
            const price = Number(card.getAttribute("data-price")) || 0;

            const matchesSearch = title.includes(searchText);
            const matchesPrice = price <= maxPrice;

            if (matchesSearch && matchesPrice) {
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });

        if (noToursMessage) {
            if (visibleCount === 0) {
                noToursMessage.classList.remove("hidden");
            } else {
                noToursMessage.classList.add("hidden");
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterTours);
    }
    if (priceInput) {
        priceInput.addEventListener("input", filterTours);
    }

   
    const addTourForm = document.querySelector("#add-tour-form");
    const errorBox = document.querySelector("#js-error-message");

    if (addTourForm) {
        addTourForm.addEventListener("submit", function (event) {
            const titleInput = document.querySelector("#title");
            const priceInputForm = document.querySelector("#price");
            const imageInput = document.querySelector("#image");

            const title = titleInput ? titleInput.value.trim() : "";
            const price = priceInputForm ? Number(priceInputForm.value) : 0;
            const image = imageInput ? imageInput.value.trim() : "";

            let errors = [];

            if (!title) {
                errors.push("Назва туру не може бути порожньою.");
            }
            if (isNaN(price) || price <= 0) {
                errors.push("Будь ласка, введіть додатну ціну.");
            }
            if (!image) {
                errors.push("Укажіть назву файлу зображення.");
            }

            if (errors.length > 0) {
                event.preventDefault(); // Зупиняємо відправку форми

                if (errorBox) {
                    errorBox.innerHTML = errors.map(err => `<p>${err}</p>`).join("");
                    errorBox.classList.remove("hidden");
                }
            } else if (errorBox) {
                errorBox.classList.add("hidden");
            }
        });
    }

    
    const galleryImages = document.querySelectorAll(".gallery-item img");
    const lightbox = document.querySelector("#lightbox");
    const lightboxImg = document.querySelector("#lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    if (galleryImages.length && lightbox && lightboxImg) {
        galleryImages.forEach(function (img) {
            img.addEventListener("click", function () {
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt || "Збільшене зображення";
                lightbox.style.display = "flex";
            });
        });

        const closeLightbox = function () {
            lightbox.style.display = "none";
            lightboxImg.src = "";
        };

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && lightbox.style.display === "flex") {
                closeLightbox();
            }
        });
    }
});