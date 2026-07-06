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

  const addisAbabaCityCoords = [9.0192, 38.7469];
  const map = L.map("map").setView(addisAbabaCityCoords, 13);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  ).addTo(map);

  const officeOneCoords = [9.008, 38.7469];
  const markerOne = L.marker(officeOneCoords).addTo(map);
  markerOne
    .bindPopup(
      "<b>Arch Studio Main Office</b> <br> Visit our primary design hub here.",
    )
    .openPopup();

  const officeTwoCoords = [8.991, 38.759];
  const markerTwo = L.marker(officeTwoCoords).addTo(map);
  markerTwo.bindPopup(
    "<b>Arch Studio Office II</b> <br> Discover our specialized workshop branch.",
  );

  mapContainer.setAttribute("role", "application");
  mapContainer.setAttribute(
    "aria-label",
    "Interactive map displaying Arch Studio branch locations in Addis Ababa, Ethiopia.",
  );
} catch (error) {
  console.error("Map Initalization failed:", error.message);

  if (contactDetailsSection) {
    contactDetailsSection.classList.add("contact-details--map-failed");
  }
}
