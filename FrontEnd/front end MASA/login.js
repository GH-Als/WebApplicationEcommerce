const apiBaseUrl = "http://localhost:8082/api/users";


const container = document.querySelector(".container"),
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  signUp = document.querySelector(".signup-link"),
  login = document.querySelector(".login-link");

// js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";

        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        });
      } else {
        pwField.type = "password";

        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        });
      }
    });
  });
});

// js code to appear signup and login form
signUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
});

login.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("active");
});



// Signup Form Submission
document.querySelector(".signup form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector(".signup input[placeholder='Enter your name']").value;
  const email = document.querySelector(".signup input[placeholder='Enter your email']").value;
  const password = document.querySelector(".signup input[placeholder='Create a password']").value;

  try {
    const response = await fetch(`${apiBaseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, email: email, password: password }),
    });

    if (response.ok) {
      alert("Signup successful! Redirecting to login...");
      document.querySelector(".container").classList.remove("active"); // Switch to login form
    } else {
      const error = await response.text();
      alert(`Signup failed: ${error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});


document.querySelector(".login form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector(".login input[placeholder='Enter your email']").value;
    const password = document.querySelector(".login input[placeholder='Enter your password']").value;
  
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Save token in localStorage
        localStorage.setItem("userEmail", data.email); // Save email in localStorage
        localStorage.setItem("isAdmin", data.isAdmin); // Save isAdmin flag in localStorage
  
        alert("Login successful! Redirecting to homepage...");
        window.location.href = "index.html"; // Redirect to homepage
      } else {
        const error = await response.text();
        alert(`Login failed: ${error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  