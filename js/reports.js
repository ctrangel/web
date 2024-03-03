// Assuming fetchData is a function that fetches data from your API endpoint
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
  }).render(document.getElementById("wrapper"));
}

// Fetch data and initialize grid
const endpoint =
  "https://inventory-b7qi.onrender.com/api/v1/inventory/complete-report";
fetchData(endpoint)
  .then((data) => initializeGrid(data))
  .catch((error) => console.error("Initialization error: ", error));
