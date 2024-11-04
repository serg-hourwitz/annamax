window.onload = function () {
    const burgerButton = document.querySelector(".header__burger-button");
    const burgerMenu = document.querySelector(".header__menu");
    const pageKey = document.querySelector("body").dataset.page;
    const page = document.querySelector("html");
    const catalog = document.querySelector(".catalog__grid")

    burgerButton.addEventListener("click", function () {
        this.classList.toggle("active");
        this.classList.toggle("not-active");

        burgerMenu.classList.toggle("active");
    });
    document.querySelectorAll(".header__menu-item").forEach(function (el) {
        if (!el.classList.contains("mobile__button-hide")) {
            el.addEventListener("click", function () {
                this.classList.add("not-active");
                burgerButton.classList.remove("active");

                burgerMenu.classList.remove("active");
            });
        }
    });
    document.querySelectorAll(".open__request-call").forEach(function (el) {
        el.addEventListener("click", function () {
            fadeIn(document.querySelector(".request__call"), 'block');
            page.style.overflowY = "hidden";
        });
    });
    document.querySelector(".request__call-close").addEventListener("click", function () {
        fadeOut(document.querySelector(".request__call"));
        page.style.overflowY = "scroll";
    });
    window.addEventListener("click", function (event) {
        let target = event.target;
        if (target.classList.contains("request__call")) {
            fadeOut(document.querySelector(".request__call"));
            page.style.overflowY = "scroll";
        }
    });

    document.querySelector(".request__call-form").addEventListener("submit", function (event) {
        event.preventDefault();
        let form = document.querySelector(".request__call-form");
        let requestFormTitle = document.querySelector('.request__call-title');
        let data = {
            page_key: pageKey,
            name: form.children[0].value,
            phone: form.children[1].value,
        };
        fetch("/core/callRequest.php", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            fadeOut(form);
            if (response.ok == true) {
                requestFormTitle.innerText = "Дякуємо! Найближчим часом з Вами сконтактує наш менеджер";
                fbq('track', 'Lead');
                if (pageKey == "Сладости") {
                    requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/xmZ3ki04' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                }
                if (pageKey == "Снеки") {
                    requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/j0y5z02D' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                }
                if (pageKey == "Кофе") {
                    requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/OxJC4FFd' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                }
            } else {
                requestFormTitle.innerText = "Виникла помилка, спробуйте пізніше!";
            }
            requestFormTitle.style.margin = 0;
            return response.json();
        });
    });
    document.querySelector(".discount_form").addEventListener("submit", function (event) {
        event.preventDefault();
        let form = document.querySelector(".discount_form");
        let data = {
            page_key: pageKey,
            name: form.children[0].value,
            phone: form.children[1].value,
        };
        fetch("/core/discountRequest.php", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            fadeOut(form);
            setTimeout(() => {
                if (response.ok == true) {
                    form.innerHTML = '<span class="discount__form-result discount__text-primary">Дякуємо! Найближчим часом з Вами сконтактує наш менеджер</span>'
                    fbq('track', 'Lead');
                    if (pageKey == "Сладости") {
                        requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/xmZ3ki04' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                    }
                    if (pageKey == "Снеки") {
                        requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/j0y5z02D' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                    }
                    if (pageKey == "Кофе") {
                        requestFormTitle.innerHTML = "<a class='page__text-color' href='https://annamax.customer.smartsender.eu/lp/OxJC4FFd' target='_blank'>Для отримання прайсу - прямо зараз натисніть на цей напис та перейдіть до нашого чат боту<a>";
                    }
                } else {
                    form.innerHTML = '<span class="discount__form-result discount__text-primary">Помилка, спробуйте пізніше будь ласка</span>'
                }
                fadeIn(form, 'flex');
            }, 450);
            return response.json();
        });
    });

    checkMoreProducts();
    document.querySelector(".catalog__more").addEventListener("click", function () {
        const hiddenProducts = document.querySelectorAll(".catalog__grid-item__hidden");
        hiddenProducts.forEach(function (hiddenProduct, index) {
            if (+index <= 3) {
                hiddenProduct.classList.remove("catalog__grid-item__hidden");
            }
        });
        checkMoreProducts();
    });

    document.querySelectorAll(".catalog__categories-item").forEach(function (el) {
        el.addEventListener('click', function () {
            category = el.dataset.category;
            fetch("/core/products.php", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    get_products_by_category: true,
                    category: category
                }),
            }).then((response) => {
                response.json().then(data => {
                    let products = "";
                    if (data.length > 0) {
                        data.forEach(function (product, index) {
                            if (index <= 3) {
                                products += `
                                    <div class="catalog__grid-item" data-category="${product.subcategory}" data-show="true">
                                        <div class="catalog__grid-item__image">
                                            <img src="${product.image}" alt="${product.title}" loading="lazy">
                                        </div>
                                        <div class="catalog__grid-item__title">${product.title}</div>
                                        <button class="catalog__grid-item__button main__button main__button-swap open__request-call">Детальніше</button>
                                    </div>`;
                            } else {
                                products += `
                                <div class="catalog__grid-item catalog__grid-item__hidden" data-category="${product.subcategory}" data-show="false">
                                    <div class="catalog__grid-item__image">
                                        <img src="${product.image}" alt="${product.title}">
                                    </div>
                                    <div class="catalog__grid-item__title">${product.title}</div>
                                    <button class="catalog__grid-item__button main__button main__button-swap open__request-call">Детальніше</button>
                                </div>`;
                            }
                        });
                        catalog.style.padding = '0 0 0';
                    } else {
                        products = '<p class="catalog__grid-no__items">К сожалению, в данной категории нет товаров</p>';
                        catalog.style.padding = '0 0 50px';
                    }
                    catalog.innerHTML = products;
                    checkMoreProducts();
                    document.querySelectorAll(".open__request-call").forEach(function (el) {
                        el.addEventListener("click", function () {
                            fadeIn(document.querySelector(".request__call"), 'block');
                            page.style.overflowY = "hidden";
                        });
                    });
                })
            });
        });
    });

    function checkMoreProducts() {
        if (document.querySelectorAll(".catalog__grid-item__hidden").length == 0) {
            document.querySelector(".catalog__more").style.display = "none";
        } else {
            document.querySelector(".catalog__more").style.display = "block";
        }
    }
    function fadeIn(el, display) {
        el.style.display = display;
        setTimeout(() => {
            el.classList.add("show");
            el.classList.remove("hide");
        }, 50);
    }
    function fadeOut(el) {
        el.classList.remove("show");
        el.classList.add("hide");
        setTimeout(() => {
            el.style.display = "none";
        }, 450);
    }
};