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

const activateSliderNumber = function (curSlide) {
  const heroSlides = document.querySelectorAll(".hero-slide");
  const slideButtons = document.querySelectorAll(".slider-nav__button");

  heroSlides.forEach((slide) => {
    slide.classList.remove("hero-slide--active");

    if (Number(slide.dataset.slide) === curSlide) {
      slide.classList.add("hero-slide--active");
    }
  });

  slideButtons.forEach((button) => {
    button.classList.remove("slider-nav__button--active");

    if (Number(button.dataset.slide) === curSlide) {
      button.classList.add("slider-nav__button--active");
    }
  });
};

const gotoSlide = function (curSlide) {
  heroSlides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
  });
};

sliderNavContainer.addEventListener("click", (e) => {
  console.log("target", e.target);
  const sliderNumber = e.target.closest(".slider-nav__button");

  if (!sliderNumber) return;

  curSlide = +sliderNumber.dataset.slide;

  gotoSlide(curSlide);
  activateSliderNumber(curSlide);
});

setTimeout(() => {
  const sliderContainer = document.querySelector(".hero__list");

  if (sliderContainer) {
    sliderContainer.classList.remove("hero__list--no-transition");
  }
}, TRANSITION_SHIELD_MS);
