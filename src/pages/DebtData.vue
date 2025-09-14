<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Debt Data</h1>
      <p class="text-gray-600 mt-2">Track your debts and liabilities</p>
    </div>

    <!-- Single Debt Form -->
    <div class="max-w-2xl">
      <Card title="Add New Debt" subtitle="Enter your debt details">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Debt Description -->
          <div>
            <label for="debt-description-input" class="label"
              >Debt Description</label
            >
            <input
              id="debt-description-input"
              v-model="form.description"
              type="text"
              class="input"
              placeholder="e.g., Credit Card, Personal Loan, Mortgage"
              required
            />
            <p class="text-sm text-gray-500 mt-1">
              Brief description of the debt
            </p>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount-input" class="label">Amount</label>
            <input
              id="amount-input"
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              class="input"
              placeholder="0.00"
              required
            />
            <p class="text-sm text-gray-500 mt-1">Total debt amount</p>
          </div>

          <!-- Currency Selection -->
          <div>
            <label for="currency-select" class="label">Currency</label>
            <select
              id="currency-select"
              v-model="form.currency"
              class="input"
              required
            >
              <option value="">Select currency</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="IDR">IDR (Indonesian Rupiah)</option>
            </select>
          </div>

          <!-- Preview Section -->
          <div v-if="showPreview" class="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 class="font-medium text-gray-900">Preview</h4>
            <div class="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Description:</span>
                <span class="font-medium ml-2">{{ form.description }}</span>
              </div>
              <div>
                <span class="text-gray-500">Amount:</span>
                <span class="font-medium ml-2">
                  {{ form.currency === "IDR" ? "Rp" : "$"
                  }}{{ form.amount.toLocaleString() }}
                </span>
              </div>
              <div>
                <span class="text-gray-500">Currency:</span>
                <span class="font-medium ml-2">{{ form.currency }}</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Reset
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="btn btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': submitting }"
            >
              <span v-if="submitting" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
              <span v-else>Add Debt</span>
            </button>
          </div>
        </form>
      </Card>
    </div>

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showSuccess = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4" @click.stop>
        <div
          class="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-full mb-4"
        >
          <svg
            class="w-6 h-6 text-success-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
          Debt Added Successfully!
        </h3>
        <p class="text-sm text-gray-500 text-center mb-4">
          Your debt has been added to your records.
        </p>
        <div class="flex space-x-3">
          <button @click="showSuccess = false" class="flex-1 btn btn-secondary">
            Add Another
          </button>
          <button @click="goToGrowth" class="flex-1 btn btn-primary">
            View Dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Debts -->
    <div v-if="recentDebts.length > 0" class="mt-8">
      <Card title="Recent Debts" subtitle="Your recently added debts">
        <div class="space-y-4">
          <div
            v-for="debt in recentDebts"
            :key="debt.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-danger-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">
                  {{ debt.description }}
                </h4>
                <p class="text-sm text-gray-500">{{ debt.submitDate }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">
                {{ debt.currency === "IDR" ? "Rp" : "$"
                }}{{ debt.amount.toLocaleString() }}
              </p>
              <p class="text-sm text-danger-600">
                {{ debt.currency }}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";
import Card from "../components/Card.vue";

export default {
  name: "DebtData",
  components: {
    Card,
  },
  setup() {
    const router = useRouter();
    const submitting = ref(false);
    const showSuccess = ref(false);
    const showPreview = ref(false);
    const recentDebts = ref([]);

    const form = ref({
      description: "",
      amount: "",
      currency: "",
    });

    const loadData = async () => {
      try {
        const debtsData = await api.getDebts();
        recentDebts.value = debtsData.slice(-3).reverse(); // Show last 3 debts
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    const updatePreview = () => {
      showPreview.value =
        form.value.description && form.value.amount && form.value.currency;
    };

    const handleSubmit = async () => {
      if (
        !form.value.description ||
        !form.value.amount ||
        !form.value.currency
      ) {
        return;
      }

      try {
        submitting.value = true;

        const debtData = {
          description: form.value.description,
          amount: parseFloat(form.value.amount),
          currency: form.value.currency,
          submitDate: new Date().toISOString().split("T")[0],
        };

        await api.addDebt(debtData);

        showSuccess.value = true;
        resetForm();
        loadData(); // Reload recent debts
      } catch (error) {
        console.error("Error adding debt:", error);
        alert("Error adding debt. Please try again.");
      } finally {
        submitting.value = false;
      }
    };

    const resetForm = () => {
      form.value = {
        description: "",
        amount: "",
        currency: "",
      };
      showPreview.value = false;
    };

    const goToGrowth = () => {
      showSuccess.value = false;
      router.push("/growth");
    };

    // Watch for form changes to update preview
    watch(() => form.value.description, updatePreview);
    watch(() => form.value.amount, updatePreview);
    watch(() => form.value.currency, updatePreview);

    onMounted(() => {
      loadData();
    });

    return {
      form,
      submitting,
      showSuccess,
      showPreview,
      recentDebts,
      updatePreview,
      handleSubmit,
      resetForm,
      goToGrowth,
    };
  },
};
</script>
