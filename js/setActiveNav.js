document.addEventListener("DOMContentLoaded", function () {
  // Get current page URL
  var currentLocation = window.location.pathname;

  // Select all nav links
  var navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Loop through all nav links
  navLinks.forEach(function (link) {
    // Get the href attribute of the nav link
    var linkPath = link.getAttribute("href");

    // Check if the linkPath matches the currentLocation
    if (currentLocation.includes(linkPath)) {
      // Add active class to the parent li element
      link.parentElement.classList.add("active");
    } else {
      // Remove active class from the parent li element
      link.parentElement.classList.remove("active");
    }
  });
});
