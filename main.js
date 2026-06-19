const hamburgerMenu = document.querySelector(".header__menu-toggle");
const navigationMenuList = document.querySelector(".navigation-wrapper");

// Constants
const NAVIGATION_MENU_TRANSITION_MS = 400;

// Toggling the mobile menu navigation
hamburgerMenu.addEventListener("click", function () {
  if (!navigationMenuList.classList.contains("open")) {
    hamburgerMenu.setAttribute("aria-expanded", true);
    navigationMenuList.classList.remove("not-open");
    navigationMenuList.classList.remove("close");
    navigationMenuList.classList.add("open");
  } else {
    hamburgerMenu.setAttribute("aria-expanded", false);
    navigationMenuList.classList.remove("open");
    navigationMenuList.classList.add("close");

    setTimeout(() => {
      navigationMenuList.classList.remove("close");
      navigationMenuList.classList.add("not-open");
    }, NAVIGATION_MENU_TRANSITION_MS);
  }
});
