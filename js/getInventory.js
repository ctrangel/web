document.addEventListener("DOMContentLoaded", function () {
  const queryTypeElement = document.getElementById("queryType");
  const parameterInputElement = document.getElementById("parameterInput");
  const fetchDataButton = document.getElementById("fetchData");
  const dataResultsElement = document.getElementById("dataResults");

  queryTypeElement.addEventListener("change", function () {
    const selectedValue = this.value;

    // Show or hide the parameter input field based on selection
    if (selectedValue && selectedValue !== "/complete-report") {
      parameterInputElement.style.display = "block";
      parameterInputElement.placeholder = `Enter ${
        this.options[this.selectedIndex].text
      }`;
    } else {
      parameterInputElement.style.display = "none";
    }
  });

  fetchDataButton.addEventListener("click", function () {
    const queryType = queryTypeElement.value;
    const parameterValue = parameterInputElement.value;
    let url = `https://inventory-b7qi.onrender.com/api/v1/inventory`;

    // Adjust URL construction based on the query type and parameter value
    if (queryType === "/:id") {
      url += `/${parameterValue}`; // For ID
    } else if (queryType !== "/complete-report") {
      const path = queryType.replace("/", "");
      url += `${path}${parameterValue}`;
    } else {
      // Handle the case for "/complete-report" without additional parameters
      url += queryType.replace(":", "");
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Clear previous results
        dataResultsElement.innerHTML = "";

        // Create and display the table if data is not empty
        if (Array.isArray(data) && data.length > 0) {
          const table = document.createElement("table");
          table.className = "table table-striped"; // Bootstrap classes for styling
          const thead = table.createTHead();
          const tbody = table.createTBody();
          const headerRow = thead.insertRow();

          // Create table headers from the first data item's keys
          Object.keys(data[0]).forEach((key) => {
            const th = document.createElement("th");
            th.textContent = key.replace(/_/g, " ").toUpperCase();
            headerRow.appendChild(th);
          });

          // Fill table body with data
          data.forEach((item) => {
            const row = tbody.insertRow();
            Object.values(item).forEach((value) => {
              const cell = row.insertCell();
              cell.textContent = value;
            });
          });

          dataResultsElement.appendChild(table);
        } else {
          dataResultsElement.textContent = "No data found.";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dataResultsElement.textContent = "Failed to fetch data.";
      });
  });
});
