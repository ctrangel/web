async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch error: ", error);
    return [];
  }
}
const endpoint =
  "https://inventory-b7qi.onrender.com/api/v1/inventory/complete-report"; //https:localhost:8003/api/v1/inventory/ for local db
fetchData(endpoint)
  .then((data) => initializeGrid(data))
  .catch((error) => console.error("Initialization error: ", error));
// Function to initialize Grid.js with fetched data
function initializeGrid(data) {
  new gridjs.Grid({
    columns: [
      "ID",
      "Jar Type",
      {
        name: "Quantity",
        formatter: (
          cell // gotta keep and eye on them quantities
        ) =>
          gridjs.html(
            `<span style="color: ${cell > 5 ? "green" : "red"}">${cell}</span>`
          ),
      },
      "Location Name",
      {
        name: "Status",
        formatter: (
          cell // I like it green when available its cool
        ) =>
          gridjs.html(
            `<span style="color: ${
              cell === "In Stock"
                ? "green"
                : cell === "Out of Stock" || cell === "Damaged"
                ? "red"
                : "black"
            }">${cell}</span>`
          ),
      },
    ],

    data: data.map((item) => [
      item.id,
      item.jartype,
      item.quantity,
      item.location_name,
      item.status,
    ]),
    search: true,
    pagination: {
      enabled: true,
      limit: 10,
    },
    sort: true,
  }).render(document.getElementById("jarTable"));
}

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

      const selectedJartype = document.getElementById("jarTypeInput").value;
      const itemId = jarTypeToIdMap.get(selectedJartype); 

      const formData = {
        id: itemId,
        jartype: document.getElementById("jarTypeInput").value,
        location_id: translateLocation(),
        status_id: translateStatus(),
        quantity: parseInt(document.getElementById("quantityInput").value, 10),
      };

      console.log(formData);
      fetch("https://inventory-b7qi.onrender.com/api/v1/inventory/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          console.log("Update successful", data);
          // Trigger the modal to show success message
          $("#successModal").on("hidden.bs.modal", function () {
            // This will be executed after the modal is closed
            location.reload(); // Refreshes the page
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});

let jarTypeToIdMap = new Map(); // Create a mapping of jartype to id

async function fetchAndPopulateJarTypes() {
  const endpoint =
    "https://inventory-b7qi.onrender.com/api/v1/inventory/complete-report";
  const data = await fetchData(endpoint);
  const jarTypeSelect = document.getElementById("jarTypeInput");

  data.forEach((item) => {
    // Store jartype to id mapping
    jarTypeToIdMap.set(item.jartype, item.id);

    // Check if this jartype is already in the dropdown to avoid duplicates
    if (
      !Array.from(jarTypeSelect.options).some(
        (option) => option.text === item.jartype
      )
    ) {
      const option = new Option(item.jartype, item.jartype); // Use jartype as both text and value
      jarTypeSelect.add(option);
    }
  });
}

// Ensure this function is called when the document is ready
document.addEventListener("DOMContentLoaded", fetchAndPopulateJarTypes);


// Call the function to populate jar types on page load
document.addEventListener("DOMContentLoaded", fetchAndPopulateJarTypes);

function populateFieldsBasedOnJarType(inventoryData, selectedJarType) {
  const selectedData = inventoryData.filter(item => item.jartype === selectedJarType)[0];

  if (selectedData) {
    // Assuming you have elements with these IDs to show the selected jar's details
    document.getElementById('quantityInput').value = selectedData.quantity;
    document.getElementById('locationSelect').value = selectedData.location_name;
    document.getElementById('statusSelect').value = selectedData.status;
  }
}

// Add event listener to the jartype dropdown to update other fields on change
document.getElementById('jarTypeInput').addEventListener('change', function() {
  const selectedJarType = this.value;
  fetchData("https://inventory-b7qi.onrender.com/api/v1/inventory/complete-report")
    .then(data => populateFieldsBasedOnJarType(data, selectedJarType));
});
