<template>
  <canvas ref="my-chart"></canvas>
</template>

<script setup lang="ts">
import {
  Chart,
  type ChartItem,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);
const props = defineProps<{ alacak: number; borc: number }>();

let canvas = useTemplateRef<HTMLCanvasElement>("my-chart");
let chart: Chart<"bar"> | undefined;

onMounted(() => {
  chart = new Chart(canvas.value! as ChartItem, {
    type: "bar",
    data: {
      labels: ["Alacak", "Ödeme"],
      datasets: [
        {
          data: [props.alacak, props.borc],
          backgroundColor: [
            "rgba(255, 99, 132, 0.4)",
            "rgba(54, 162, 235, 0.4)",
          ],
          borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${Number(ctx.parsed.y).toLocaleString("tr-TR")} ₺`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

watch(
  () => [props.alacak, props.borc],
  ([alacak, borc]) => {
    if (!chart) return;
    chart.data.datasets[0].data = [alacak, borc];
    chart.update();
  },
);

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>

<style scoped></style>
