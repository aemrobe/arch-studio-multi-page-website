//Slider elements
const heroSlides = document.querySelectorAll(".hero-slide");
const sliderNavContainer = document.querySelector(".slider-nav");

// Constants
const TRANSITION_SHIELD_MS = 50;

// Initial value
let curSlide = 0;

const addEvent = function (eventName, callback) {
  window.addEventListener(eventName, callback);
};

const activateSliderNumber = function (activeIndex) {
  const heroSlides = document.querySelectorAll(".hero-slide");
  const slideButtons = document.querySelectorAll(".slider-nav__button");

  heroSlides.forEach((slide, index) => {
    const link = slide.querySelector(".hero-slide__link");

    if (index === activeIndex) {
      slide.removeAttribute("aria-hidden");
      slide.classList.add("hero-slide--active");

      if (link) link.setAttribute("tabIndex", 0);
    } else {
      slide.classList.remove("hero-slide--active");
      slide.setAttribute("aria-hidden", "true");

      if (link) link.setAttribute("tabindex", -1);
    }
  });

  slideButtons.forEach((button, index) => {
    button.classList.remove("slider-nav__button--active");

    if (index === activeIndex) {
      button.classList.add("slider-nav__button--active");
      button.setAttribute("aria-current", "true");
    } else {
      button.classList.remove("slider-nav__button--active");
      button.setAttribute("aria-current", "false");
    }
  });
};

const gotoSlide = function (curSlide) {
  heroSlides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
  });
};

sliderNavContainer.addEventListener("click", (e) => {
  const sliderNumber = e.target.closest(".slider-nav__button");

  if (!sliderNumber) return;

  curSlide = +sliderNumber.dataset.slide;

  gotoSlide(curSlide);
  activateSliderNumber(curSlide);
});

activateSliderNumber(curSlide);

setTimeout(() => {
  const sliderContainer = document.querySelector(".hero__list");

  if (sliderContainer) {
    sliderContainer.classList.remove("hero__list--no-transition");
  }
}, TRANSITION_SHIELD_MS);
