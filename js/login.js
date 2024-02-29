// little animation for the login form
$(document).ready(function () {
  $(".message a").click(function (e) {
    e.preventDefault(); // Prevent the default anchor behavior
    $(".register-form, .login-form").animate(
      { height: "toggle", opacity: "toggle" },
      "slow"
    );
  });
});

// Logout function
function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/index.html";
}

// Check if the user is logged in
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a page that requires authentication
  const requiresAuth = ["/inventory.html", "/reports.html"]; // Add more protected routes as needed
  const path = window.location.pathname;

  if (requiresAuth.includes(path) && !localStorage.getItem("authToken")) {
    // Inform the user and redirect
    alert("Access Denied! Please login to access this page.");
    window.location.href = "/index.html"; // Redirect to the login page
  }
});

// Login function

$(document).ready(function () {
  $("#loginButton").click(function () {
    var username = $("#loginUsername").val();
    var password = $("#loginPassword").val();

    $("#loader").show();

    $.ajax({
      // url: "https://inventory-b7qi.onrender.com/api/v1/inventory/login",
      url: "http://localhost:8003/api/v1/inventory/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username: username, password: password }),
      success: function (response) {
        toastr.success("Your bluetooth device is paired successfully");
        localStorage.setItem("authToken", response.token);
        // Delay redirect to allow toastr message to be seen
        setTimeout(function () {
          window.location.href = "/inventory.html";
        }, 2000); 
      },
      error: function (xhr, status, error) {
        if (xhr.status == 404) {
          toastr.error("Login endpoint not found. Please check the URL.");
        } else if (xhr.status == 401) {
          toastr.error("username or password is incorrect. Please try again.");
        } else {
          toastr.error("Login failed: " + xhr.responseText || error);
        }
      },
      complete: function () {
        $("#loader").hide();
      },
    });
  });
});

// Register function
$(document).ready(function () {
  $("#registerButton").click(function () {
    var username = $("#registerUsername").val();
    var password = $("#registerPassword").val();

    $.ajax({
      url: "http://localhost:8003/api/v1/inventory/register",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username: username, password: password }),
      success: function (response) {
        toastr.success("Registration successful. Please log in.");
        // Optionally redirect to the login page or automatically log the user in
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 1000);
      },
      error: function (xhr, status, error) {
        toastr.error("Registration failed: " + xhr.responseText || error);
      },
    });
  });
});
