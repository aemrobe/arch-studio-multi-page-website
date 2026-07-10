//Form Elements
const form = document.querySelector(".connect-with-us__form");
const successMessage = document.querySelector(
  ".connect-with-us__success-message",
);
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const messageInput = document.getElementById("message-input");

// Map Elements
const mapContainer = document.getElementById("map");
const contactDetailsSection = document.querySelector(".contact-details");

// Validator functions
const validateRequired = function (value) {
  return value === "" ? "Can't be empty" : null;
};

const validateEmail = function (value) {
  return /^([a-zA-Z\d'.-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/.test(
    value,
  )
    ? null
    : "Please use a valid email address";
};

function validateFields(validators, value) {
  for (const validator of validators) {
    const error = validator(value);

    if (error) return error;
  }

  return null;
}

//Showing and hiding error messages
const showErrorMessage = function (field, error) {
  field.classList.add("error");
  field.setAttribute("aria-invalid", true);

  const showErrorTextElement = field.nextElementSibling;

  field.setAttribute("aria-describedby", showErrorTextElement.id);

  showErrorTextElement.textContent = error;
};

const hideErrorMessage = function (field) {
  field.classList.remove("error");
  field.setAttribute("aria-invalid", false);
  field.removeAttribute("aria-describedby");

  const showErrorTextElement = field.nextElementSibling;

  showErrorTextElement.textContent = "";
};

// Clear the success status when the user starts typing again
const clearStatusOnInteraction = () => {
  if (successMessage.textContent) successMessage.textContent = "";
};

const fields = [
  {
    element: nameInput,
    validators: [validateRequired],
  },
  {
    element: emailInput,
    validators: [validateRequired, validateEmail],
  },
  { element: messageInput, validators: [validateRequired] },
];

[nameInput, emailInput, messageInput].forEach((el) =>
  el.addEventListener("input", clearStatusOnInteraction),
);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let firstErrorField = null;

  for (const field of fields) {
    const formError = validateFields(field.validators, field.element.value);

    if (formError) {
      showErrorMessage(field.element, formError);

      if (!firstErrorField) {
        firstErrorField = field.element;
      }
    } else {
      hideErrorMessage(field.element);
    }
  }

  if (firstErrorField) {
    firstErrorField.focus();
  } else {
    successMessage.textContent = "Your form successfully submitted!";

    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
  }
});

// Map
try {
  if (typeof L === "undefined") {
    throw new Error("Leaflet script failed to load");
  }

  const mapContainer = document.getElementById("map");

  // Keep interactive controls skipped during standard page tabbing by default
  const centralUSCoords = [33.5, -92.0];
  const map = L.map("map", { keyboard: false }).setView(centralUSCoords, 4);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a class="map-link" href="https://www.openstreetmap.org/copyright" tabindex="-1">OpenStreetMap</a> contributors &copy; <a class="map-link" href="https://carto.com/attributions" tabindex="-1">CARTO</a>',
    },
  ).addTo(map);

  // Added descriptive alt titles so screen readers read the office name instead of "marker graphics"
  const officeOneCoords = [36.1627, -86.7816];
  const markerOne = L.marker(officeOneCoords, {
    keyboard: false,
    alt: "Arch Studio Main Office Location Marker",
  }).addTo(map);
  markerOne
    .bindPopup("<b>Arch Studio Main Office</b><br>1892 Chenoweth Drive, TN")
    .openPopup();

  const officeTwoCoords = [30.2672, -97.7431];
  const markerTwo = L.marker(officeTwoCoords, {
    keyboard: false,
    alt: "Arch Studio Office II Location Marker",
  }).addTo(map);
  markerTwo.bindPopup("<b>Arch Studio Office II</b><br>3399 Wines Lane, TX");

  // Helper function to turn map elements on/off for keyboard users
  const toggleMapInteraction = (enable) => {
    const tabValue = enable ? "0" : "-1";

    // Toggle internal Leaflet controls
    const controls = mapContainer.querySelectorAll(
      ".leaflet-control-zoom-in, .leaflet-control-zoom-out, .leaflet-control-attribution a, .leaflet-popup-close-button",
    );
    controls.forEach((el) => el.setAttribute("tabindex", tabValue));

    // Toggle markers
    if (markerOne._icon) markerOne._icon.setAttribute("tabindex", tabValue);
    if (markerTwo._icon) markerTwo._icon.setAttribute("tabindex", tabValue);

    if (enable) {
      map.keyboard.enable();
    } else {
      map.keyboard.disable();
    }
  };

  if (mapContainer) {
    mapContainer.setAttribute("role", "application");
    mapContainer.setAttribute(
      "aria-label",
      "Interactive map displaying Arch Studio branch locations. Press Escape to leave the map.",
    );

    // Initial pass to ensure layout elements are hidden from tab order
    toggleMapInteraction(false);

    // Activate interaction when navigating from "View on Map" links
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#map") {
        toggleMapInteraction(true);
        mapContainer.focus({ preventScroll: true });
      }
    });

    // Let the user exit the map using the Escape key
    mapContainer.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggleMapInteraction(false);

        // Remove native browser focus from the map wrapper entirely
        mapContainer.blur();

        // Remove the #map hash from the URL so the hashchange event fires next time
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search,
        );

        // Return focus smoothly back to the contact details links
        const returnLink = document.querySelector(
          ".contact-details__list-link",
        );
        if (returnLink) returnLink.focus();
      }
    });

    // Deactivate map interaction if a user tabs away naturally past the boundary elements
    mapContainer.addEventListener("focusout", (e) => {
      if (!mapContainer.contains(e.relatedTarget)) {
        toggleMapInteraction(false);

        // Clear native wrapper focus on clean exit
        mapContainer.blur();

        // Remove the #map hash from the URL when tabbing away completely
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    });
  }
} catch (error) {
  console.error("Map Initialization failed:", error.message);
  const contactDetailsSection = document.querySelector(".contact-details");
  if (contactDetailsSection) {
    contactDetailsSection.classList.add("contact-details--map-failed");
  }
}
