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

const backendUrl = "http://localhost:3000";

signInBtn.addEventListener("click", () => {
  nameField.style.maxHeight = "0";
  title.innerHTML = "Sign In";
  text.innerHTML = "Lost Password";
  signUpBtn.classList.add("disable");
  signInBtn.classList.remove("disable");
  underline.style.transform = "translateX(35px)";
});

signUpBtn.addEventListener("click", () => {
  nameField.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  text.innerHTML = "Password Suggestions";
  signUpBtn.classList.remove("disable");
  signInBtn.classList.add("disable");
  underline.style.transform = "translateX(0)";
});

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

togglePassword.addEventListener("click", () => {
  let type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

signUpBtn.addEventListener("click", async () => {
  if (title.innerHTML == "Sign Up") {
    const name = document.querySelector(".namefield input").value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const res = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON response:", text);
        alert("Unexpected response from server. Check backend logs.");
        return;
      }

      console.log("Signup response data:", data);

      if (res.ok && data.success) {
        alert(data.message || "Sign-up successful!");
        window.location.href = `/index.html?user=${encodeURIComponent(
          data.name
        )}`;
      } else {
        alert(data.message || "Sign-up failed");
      }
    } catch (err) {
      alert("Error signing up.");
      console.error(err);
    }
  }
});

signInBtn.addEventListener("click", async () => {
  if (title.innerHTML == "Sign In") {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const res = await fetch(`${backendUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON response:", text);
        alert("Unexpected response from server. Check backend logs.");
        return;
      }

      console.log("Signin response data:", data);

      if (res.ok && data.success) {
        alert(data.message || "Sign-in successful!");
        window.location.href = `/index.html?user=${encodeURIComponent(
          data.name
        )}`;
      } else {
        alert(data.message || "Sign-in failed. Please check your credentials.");
      }
    } catch (err) {
      alert("Error signing in.");
      console.error(err);
    }
  }
});
