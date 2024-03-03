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
      };

      let translateLocationBack = (locationId) => {
        // Define your mapping from location IDs to names
        const locationMap = {
          1: "Small Jars Section",
          2: "Medium Jars Section",
          3: "Large Jars Section",
          4: "Extra Small Jars Section",
          5: "Extra Large Jars Section",
          6: "Fancy Jars Display",
          7: "Bulk Storage",
          8: "Other",
        };
        return locationMap[locationId] || "Unknown Location";
      }

      let translateStatusBack = (statusId) => {
        // Define your mapping from status IDs to names
        const statusMap = {
          1: "In Stock",
          2: "Out of Stock",
          3: "Other Status",
        };
        return statusMap[statusId] || "Unknown Status";
      }

      const formData = {
        jartype: document.getElementById("jarTypeInput").value,
        location_id: translateLocation(),
        status_id: translateStatus(),
        quantity: parseInt(document.getElementById("quantityInput").value, 10),
      };

      console.log(formData); // to check translation, it works!

      fetch("https://inventory-b7qi.onrender.com/api/v1/inventory/", { //https:localhost:8003/api/v1/inventory/ for local db
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          // Translate IDs back to names
          const locationName = translateLocationBack(data.data.location_id);
          const statusName = translateStatusBack(data.data.status_id);

          // Construct a message with the jar details to display, using the translated names
          let message = `
    <p><strong>Jar Type:</strong> ${data.data.jartype}</p>
    <p><strong>Location:</strong> ${locationName}</p>
    <p><strong>Status:</strong> ${statusName}</p>
    <p><strong>Quantity:</strong> ${data.data.quantity}</p>
  `;

          // Update the modal body with the jar details
          document.querySelector("#successModal .modal-body").innerHTML =
            message;

          // Show the modal
          $("#successModal").modal("show");
        })

        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
