<template>
  <div class="card">
    <div v-if="title" class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <div class="relative h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  name: "Chart",
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: "line",
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
        },
        y: {
          display: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    };

    const createChart = () => {
      if (chartCanvas.value && props.data) {
        const config = {
          type: props.type,
          data: props.data,
          options: { ...defaultOptions, ...props.options },
        };

        if (chartInstance) {
          chartInstance.destroy();
        }

        chartInstance = new ChartJS(chartCanvas.value, config);
      }
    };

    const updateChart = () => {
      if (chartInstance && props.data) {
        chartInstance.data = props.data;
        chartInstance.update();
      }
    };

    onMounted(() => {
      nextTick(() => {
        createChart();
      });
    });

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    watch(
      () => props.data,
      () => {
        updateChart();
      },
      { deep: true }
    );

    watch(
      () => props.options,
      () => {
        createChart();
      },
      { deep: true }
    );

    return {
      chartCanvas,
    };
  },
};
</script>
