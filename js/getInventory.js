
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

new gridjs.Grid({
  search: true,
  sort: true,
  pagination: true,
  fixedHeader: true,
  height: "90%",
  columns: [
    { name: "id", width: "100px" },
    { name: "jartype", width: "100px" },
    { name: "location_id", width: "100px" },
    { name: "status_id", width: "100px" },
    { name: "quantity", width: "100px" },
  ],

  server: {
    url: "https://localhost:8009/api/v1/inventory",
    then: (data) => {
      data.sort((a, b) => b.id - a.id);
      return data.map((jar) => [
        jar.id,
        jar.jartype,
        jar.location_id,
        jar.status_id,
        jar.quantity,
      ]);
    },
  },
}).render(document.getElementById("table"));