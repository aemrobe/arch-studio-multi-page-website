//Form Elements
const form = document.querySelector(".connect-with-us__form");
const successMessage = document.querySelector(
  ".connect-with-us__success-message",
);
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const messageInput = document.getElementById("message-input");

// Constants
const FORM_SUCCESS_REDIRECT_MS = 200;

// Validator functions
const validateRequired = function (value) {
  return value === "" ? "Can't be empty" : null;
};

const validateEmail = function (value) {
  return /^([a-zA-Z\d'.-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/.test(
    value,
  )
    ? null
    : "Invalid email address";
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let firstErrorField = null;

  for (const field of fields) {
    const formError = validateFields(field.validators, field.element.value);

    console.log(formError);

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
    successMessage.textContent = "Your form Succesfully submitted!";

    setTimeout(() => {
      successMessage.textContent = "";
    }, FORM_SUCCESS_REDIRECT_MS);
    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
  }
});
