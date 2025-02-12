document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.querySelector("form");
  
    registrationForm.addEventListener("submit", (event) => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const phone = document.getElementById("contact").value.trim();
      // const age = document.getElementById("age").value.trim();
      const address = document.getElementById("address").value.trim();
  
      let isValid = true;
      let errorMessage = "";
  
      // Name validation
      if (name.length < 3) {
        isValid = false;
        errorMessage += "Name must be at least 3 characters long.\n";
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage += "Enter a valid email address.\n";
      }
  
      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            isValid = false;
            errorMessage += " Password must contain \n 1. An uppercase character \n 2.a lowercase character \n 3. a special character \n 4. a number \n 5. must be atleast 8 character long";
        }
    
  
      // Phone number validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        isValid = false;
        errorMessage += "Phone number must be 10 digits long.\n";
      }
  
      // Age validation
      // if (isNaN(age) || age < 1 || age > 120) {
      //   isValid = false;
      //   errorMessage += "Enter a valid age between 1 and 120.\n";
      // }
  
      // Address validation
      if (address.length < 3) {
        isValid = false;
        errorMessage += "Address must be at least 4 characters long.\n";
      }
  
      if (!isValid) {
        event.preventDefault(); // Prevent form submission
        alert(errorMessage); // Display error messages
      }
    });
  });
  