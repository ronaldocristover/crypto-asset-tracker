<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
        <div v-if="change !== undefined" class="flex items-center mt-1">
          <span
            class="text-sm font-medium"
            :class="change >= 0 ? 'text-success-600' : 'text-danger-600'"
          >
            {{ change >= 0 ? "+" : "" }}{{ formattedChange }}
          </span>
          <span
            v-if="changePercentage !== undefined"
            class="text-sm text-gray-500 ml-1"
          >
            ({{ changePercentage >= 0 ? "+" : ""
            }}{{ changePercentage.toFixed(2) }}%)
          </span>
        </div>
      </div>
      <div class="flex-shrink-0">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center"
          :class="iconBgClass"
        >
          <component :is="icon" class="w-6 h-6" :class="iconClass" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "StatCard",
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    change: {
      type: Number,
      default: undefined,
    },
    changePercentage: {
      type: Number,
      default: undefined,
    },
    icon: {
      type: [String, Object],
      required: true,
    },
    iconClass: {
      type: String,
      default: "text-primary-600",
    },
    iconBgClass: {
      type: String,
      default: "bg-primary-100",
    },
    format: {
      type: String,
      default: "currency", // currency, number, percentage
    },
  },
  setup(props) {
    const formattedValue = computed(() => {
      if (props.format === "currency") {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(props.value);
      } else if (props.format === "percentage") {
        return `${props.value.toFixed(2)}%`;
      } else {
        return new Intl.NumberFormat("en-US").format(props.value);
      }
    });

    const formattedChange = computed(() => {
      if (props.change === undefined) return "";
      if (props.format === "currency") {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(props.change);
      } else if (props.format === "percentage") {
        return `${props.change.toFixed(2)}%`;
      } else {
        return new Intl.NumberFormat("en-US").format(props.change);
      }
    });

    return {
      formattedValue,
      formattedChange,
    };
  },
};
</script>
