document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addJarForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      let translateLocation = () => {
        let location = document.getElementById("locationSelect").value;
        if (location === "Small Jars Section") {
          return 1;
        } else if (location === "Medium Jars Section") {
          return 2;
        } else if (location === "Large Jars Section") {
          return 3;
        } else if (location === "Extra Small Jars Section") {
          return 4;
        } else if (location === "Extra Large Jars Section") {
          return 5;
        } else if (location === "Fancy Jars Display") {
          return 6;
        } else if (location === "Bulk Storage") {
          return 7;
        } else {
          return 8;
        }
      };

      let translateStatus = () => {
        let status = document.getElementById("statusSelect").value;
        if (status === "In Stock") {
          return 1;
        } else if (status === "Out of Stock") {
          return 2;
        } else {
          return 3;
        }
      }

      const formData = {
        jarType: document.getElementById("jarTypeInput").value,
        quantity: parseInt(document.getElementById("quantityInput").value, 10),
        locationName: translateLocation(),
        status: translateStatus(),
      };

      console.log(formData);

    //   fetch("/api/v1/inventory/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log(data);
    //       $("#successModal").modal("show");
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });
     });
});


