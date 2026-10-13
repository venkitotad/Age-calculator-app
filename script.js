const form = document.getElementById("age-form");

const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

const yearsOutput = document.getElementById("years");
const monthsOutput = document.getElementById("months");
const daysOutput = document.getElementById("days");

const inputs = [dayInput, monthInput, yearInput];

function showError(input, message) {
  const group = input.closest(".input-group");
  group.querySelector(".error").textContent = message;
  group.querySelector("label").style.color = "hsl(0, 100%, 67%)";
  input.style.borderColor = "hsl(0, 100%, 67%)";
}

function clearError(input) {
  const group = input.closest(".input-group");
  group.querySelector(".error").textContent = "";
  group.querySelector("label").style.color = "";
  input.style.borderColor = "";
}

function isLeapYear(year) {
  return year % 400 === 0 ||
    (year % 4 === 0 && year % 100 !== 0);
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function validateDate(day, month, year) {
  let valid = true;

  inputs.forEach(clearError);

  if (dayInput.value.trim() === "") {
    showError(dayInput, "This field is required");
    valid = false;
  } else if (!Number.isInteger(day) || day < 1 || day > 31) {
    showError(dayInput, "Must be a valid day");
    valid = false;
  }

  if (monthInput.value.trim() === "") {
    showError(monthInput, "This field is required");
    valid = false;
  } else if (!Number.isInteger(month) || month < 1 || month > 12) {
    showError(monthInput, "Must be a valid month");
    valid = false;
  }

  const currentYear = new Date().getFullYear();

  if (yearInput.value.trim() === "") {
    showError(yearInput, "This field is required");
    valid = false;
  } else if (
    !Number.isInteger(year) ||
    year < 1 ||
    year > currentYear
  ) {
    showError(yearInput, "Must be in the past");
    valid = false;
  }

  if (!valid) return false;

  if (day > daysInMonth(month, year)) {
    showError(dayInput, "Must be a valid date");
    return false;
  }

  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  if (birthDate > today) {
    showError(dayInput, "Must be in the past");
    return false;
  }

  return true;
}

function calculateAge(day, month, year) {
  const today = new Date();

  let years = today.getFullYear() - year;
  let months = today.getMonth() + 1 - month;
  let days = today.getDate() - day;

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function animateNumber(element, target) {
  const duration = 500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const value = Math.floor(target * progress);
    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const day = Number(dayInput.value);
  const month = Number(monthInput.value);
  const year = Number(yearInput.value);

  if (!validateDate(day, month, year)) return;

  const age = calculateAge(day, month, year);

  animateNumber(yearsOutput, age.years);
  animateNumber(monthsOutput, age.months);
  animateNumber(daysOutput, age.days);
});

inputs.forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});
