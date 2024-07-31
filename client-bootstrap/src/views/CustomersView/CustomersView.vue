<template>
  <div>
    <h1 class="my-4 text-center">Müşteriler</h1>
    <div class="row">
      <div class="col">
        <table id="customersTable" class="table table-striped table-responsive border shadow" v-if="customers.length !== 0">
          <thead>
            <tr>
              <th class="col" @click="sortTable(0)">Müşteri</th>
              <th class="col" @click="sortTable(1)">Müşteri Adresi</th>
              <th class="col" @click="sortTable(2)">Oluşturulma Tarihi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" v-bind:key="customer">
              <td>{{}}</td>
              <td>{{}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";

const customerStore = useCustomerStore();

const { customers } = storeToRefs(customerStore);

const sortTable = (n: number) => {
  let table: HTMLTableElement,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("customersTable") as HTMLTableElement;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  border-collapse: separate;
  border-radius: 0.5rem;
  border-spacing: 0;
  margin-bottom: 0;
}

th {
  cursor: pointer;

  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
}

tr {
  &:last-child td {
    &:first-child {
      border-bottom-left-radius: 0.5rem;
    }
    &:last-child {
      border-bottom-right-radius: 0.5rem;
    }
  }
}

thead tr,
thead tr th {
  background-color: transparent;
}

thead {
  background-image: linear-gradient(90deg, red 0%, blue 100%);
}

th,
td {
  text-align: center;
}
</style>
