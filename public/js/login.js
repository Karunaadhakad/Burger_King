document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
  
    loginForm.addEventListener("submit", (event) => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      let isValid = true;
      let errorMessage = "";
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage += "Enter a valid email address.\n";
      }
  
      // Password validation
      if (password.length < 6) {
        isValid = false;
        errorMessage += "Password must be at least 6 characters long.\n";
      }
  
      if (!isValid) {
        event.preventDefault(); // Prevent form submission
        alert(errorMessage); // Display error messages
      }
    });
  });
  