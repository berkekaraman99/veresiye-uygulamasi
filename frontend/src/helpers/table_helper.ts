export const sortTable = (n: number, table_id: string) => {
  let rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  const table: HTMLTableElement = document.getElementById(
    table_id,
  ) as HTMLTableElement;
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (
          x.textContent
            ?.trim()
            .toLowerCase()
            .localeCompare(y.innerHTML.toLowerCase(), "tr", { numeric: true }) >
          0
        ) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (
          y.textContent
            ?.trim()
            .toLowerCase()
            .localeCompare(x.innerHTML.toLowerCase(), "tr", { numeric: true }) >
          0
        ) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};
