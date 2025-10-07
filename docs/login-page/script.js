const BACKEND_URL = "https://focus-on-today-jioc.onrender.com";
const FRONTEND_URL = "https://adityaxletscode.github.io/Focus-On-Today/";

let signUpBtn = document.querySelector(".signupbtn");
let signInBtn = document.querySelector(".signinbtn");
let nameField = document.querySelector(".namefield");
let title = document.querySelector(".title");
let underline = document.querySelector(".underline");
let text = document.querySelector(".text");
let clickLink = document.getElementById("click-link");
let passwordField = document.querySelector('input[type="password"]');
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

// Switch to Sign In
signInBtn.addEventListener("click", () => {
  nameField.style.maxHeight = "0";
  title.innerHTML = "Sign In";
  text.innerHTML = "Lost Password";
  signUpBtn.classList.add("disable");
  signInBtn.classList.remove("disable");
  underline.style.transform = "translateX(35px)";
});

// Switch to Sign Up
signUpBtn.addEventListener("click", () => {
  nameField.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  text.innerHTML = "Password Suggestions";
  signUpBtn.classList.remove("disable");
  signInBtn.classList.add("disable");
  underline.style.transform = "translateX(0)";
});

// Password suggestion or reset link
clickLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (title.innerHTML == "Sign Up") {
    const suggestedPassword = generatePassword(8);
    alert("Suggested Password: " + suggestedPassword);
    passwordField.value = suggestedPassword;
  } else {
    const email = document.querySelector('input[type="email"]').value;
    if (email) {
      alert("Password reset link sent to your email: " + email);
    } else {
      alert("Please enter your email to receive a reset link.");
    }
  }
});

function generatePassword(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

// ✅ Sign Up functionality (POST to Render backend)
signUpBtn.addEventListener("click", async () => {
  if (title.innerHTML == "Sign Up") {
    const name = document.querySelector(".namefield input").value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Signup response data:", data);

      if (data.success) {
        alert(data.message || "Sign-up successful!");
        window.location.href = `${FRONTEND_URL}index.html?user=${encodeURIComponent(
          data.name
        )}`;
      } else {
        alert(data.message || "Sign-up failed");
      }
    } catch (err) {
      alert("Error signing up.");
      console.error("Signup error:", err);
    }
  }
});

// ✅ Sign In functionality (POST to Render backend)
signInBtn.addEventListener("click", async () => {
  if (title.innerHTML == "Sign In") {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const res = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Signin response data:", data);

      if (data.success) {
        alert(data.message || "Sign-in successful!");
        window.location.href = `${FRONTEND_URL}index.html?user=${encodeURIComponent(
          data.name
        )}`;
      } else {
        alert(data.message || "Sign-in failed. Please check your credentials");
      }
    } catch (err) {
      alert("Error signing in.");
      console.error("Signin error:", err);
    }
  }
});
