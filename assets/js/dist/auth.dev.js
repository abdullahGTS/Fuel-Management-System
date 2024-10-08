"use strict";

var Auth = {
  // Validation rules object
  validations: {
    username: {
      el: document.getElementById('username'),
      required: true,
      isEmail: false,
      // This flag can be toggled based on your need for email validation
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      // Email regex
      errorMessage: 'Please enter a valid email address',
      usernamePattern: /^[a-zA-Z0-9._-]{3,}$/,
      // Username regex, can be adjusted
      usernameErrorMessage: 'Username must be at least 3 characters long and contain only letters, numbers, dots, and underscores.',
      validate: function validate() {
        var value = this.el.value.trim();

        if (this.required && !value) {
          return 'Username is required';
        } else if (this.isEmail && !this.pattern.test(value)) {
          return this.errorMessage; // Only checks email pattern if isEmail is true
        } else if (!this.isEmail && !this.usernamePattern.test(value)) {
          return this.usernameErrorMessage; // Checks username pattern otherwise
        }

        return null; // No errors
      }
    },
    password: {
      el: document.getElementById('password'),
      required: true,
      minLength: 6,
      errorMessage: 'Password must be at least 6 characters long',
      validate: function validate() {
        var value = this.el.value.trim();

        if (this.required && !value) {
          return 'Password is required';
        } else if (value.length < this.minLength) {
          return this.errorMessage;
        }

        return null;
      }
    },
    validateForm: function validateForm() {
      var errors = []; // Validate each field

      var usernameError = this.username.validate();
      if (usernameError) errors.push({
        field: 'username',
        error: usernameError
      });
      var passwordError = this.password.validate();
      if (passwordError) errors.push({
        field: 'password',
        error: passwordError
      });
      return errors;
    }
  },
  // Function to toggle password visibility
  togglePasswordVisibility: function togglePasswordVisibility() {
    var toggleIcon = document.querySelector(".mat-password .material-symbols-sharp");
    var passwordInput = document.getElementById("password");

    if (toggleIcon && passwordInput) {
      toggleIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          toggleIcon.textContent = "visibility_off";
        } else {
          passwordInput.type = "password";
          toggleIcon.textContent = "visibility";
        }
      });
    }
  },
  // Function to update copyright year
  updateYear: function updateYear() {
    var currentYear = new Date().getFullYear();
    var yearSpan = document.getElementById('year');

    if (yearSpan) {
      yearSpan.textContent = currentYear;
    }
  },
  // Function to show validation errors with Toastr
  showValidationErrors: function showValidationErrors(errors) {
    document.querySelectorAll('.gts-field').forEach(function (field) {
      // field.querySelector('input').classList.remove('input-error');
      var inputElement = field.querySelector('input, textarea, select');

      if (inputElement) {
        inputElement.classList.remove('input-error');
      }
    });
    errors.forEach(function (error) {
      var field = document.getElementById(error.field);

      if (field) {
        // field.closest('.gts-field-wrapper').querySelector('input').classList.add('input-error');
        var inputElement = field.closest('.gts-field-wrapper').querySelector('input, textarea, select');

        if (inputElement) {
          inputElement.classList.add('input-error');
        }

        toastr.error(error.error, '', {
          "closeButton": true,
          "debug": false,
          "newestOnTop": true,
          "progressBar": true,
          "positionClass": "toast-top-right",
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000"
        });
      }
    });
  },
  // Demo for toast messages and form submission
  submit: function submit() {
    document.getElementById('submit').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent form submission for validation

      var validationErrors = Auth.validations.validateForm();

      if (validationErrors.length > 0) {
        Auth.showValidationErrors(validationErrors);
      } else {
        console.log('Form is valid, proceed with submission.');
        document.querySelectorAll('.gts-field').forEach(function (field) {
          // field.querySelector('input').classList.remove('input-error');
          var inputElement = field.querySelector('input, textarea, select');

          if (inputElement) {
            inputElement.classList.remove('input-error');
          }
        });
        var submitButton = document.getElementById('submit');
        submitButton.disabled = true; // Disable the button to prevent multiple clicks

        submitButton.innerHTML = 'Signing In <div class="loader"></div>'; // Change button text and show preloader (spinner)

        toastr.success('You have successfully signed in!', '', {
          "closeButton": false,
          "debug": false,
          "newestOnTop": true,
          "progressBar": true,
          "positionClass": "toast-bottom-left",
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000"
        });
        setTimeout(function () {
          // Redirect after 5 seconds
          window.location.href = '/pages/dashboard.html'; // Change this to your desired URL
        }, 5000); // Optionally submit the form
        // document.getElementById('login-form').submit();
      }
    });
  }
}; // Initialize when page is ready

pageReady(function () {
  Auth.togglePasswordVisibility();
  Auth.updateYear();
  Auth.submit();
});