const FRONTEND_URL = "https://adityaxletscode.github.io/Focus-On-Today/"; // GitHub Pages root

const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".goal-input");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const completed = document.querySelector(".progress-value > span > span");
const progressLabel = document.querySelector(".progress-label");
const deleteButton = document.querySelector(".delete-button");
const signInBtn = document.querySelector(".signIn");
const signUpBtn = document.querySelector(".signUp");
const header = document.querySelector(".header");
const welcome = document.getElementById("welcome-msg");
const loginNav = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (username) {
  localStorage.setItem("username", username);
}

const storedUser = localStorage.getItem("username");

if (storedUser) {
  welcome.innerHTML = `Welcome, ${storedUser}!`;
  header.style.display = "flex";
  loginNav.style.display = "none";
}

const allQuotes = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Just a step away, Keep going!",
  "Whoa! You just completed all the goals, time for chill :D",
];

const allGoals = JSON.parse(localStorage.getItem("allGoals")) || {
  first: { name: "", completed: false },
  second: { name: "", completed: false },
  third: { name: "", completed: false },
};

let completedGoalsCount = Object.values(allGoals).filter(
  (goal) => goal.completed
).length;

const updateProgressBar = () => {
  progressValue.style.width = `${(completedGoalsCount / 3) * 100}%`;
};

const updateCompleted = () => {
  completed.textContent = completedGoalsCount;
};

updateProgressBar();
updateCompleted();
progressLabel.innerText = allQuotes[completedGoalsCount];

checkBoxList.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    const allGoalsFilled = [...inputFields].every((input) => input.value);
    if (allGoalsFilled) {
      checkbox.parentElement.classList.toggle("completed");
      const inputId = checkbox.nextElementSibling.id;
      if (allGoals[inputId]) {
        allGoals[inputId].completed = !allGoals[inputId].completed;
        completedGoalsCount = Object.values(allGoals).filter(
          (goal) => goal.completed
        ).length;
        updateProgressBar();
        updateCompleted();
        progressLabel.innerText = allQuotes[completedGoalsCount];
        localStorage.setItem("allGoals", JSON.stringify(allGoals));
      }
    } else {
      progressBar.classList.add("show-error");
    }
  });
});

inputFields.forEach((input) => {
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].name;
    if (allGoals[input.id].completed) {
      input.parentElement.classList.add("completed");
    }
  }

  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", () => {
    if (allGoals[input.id].completed) {
      input.value = allGoals[input.id].name;
      return;
    }
    if (allGoals[input.id]) {
      allGoals[input.id].name = input.value;
    }
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });
});

deleteButton.addEventListener("click", () => {
  localStorage.removeItem("allGoals");
  window.location.reload();
});

// Login redirect to GitHub Pages login page
function login() {
  window.location.href = `${FRONTEND_URL}login-page/`;
}

// Logout functionality
function logout() {
  localStorage.removeItem("username");
  header.style.display = "none";
  loginNav.style.display = "flex";
  window.location.href = FRONTEND_URL;
}

logoutBtn.addEventListener("click", logout);
