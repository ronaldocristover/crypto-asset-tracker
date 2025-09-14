<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Add Assets</h1>
      <p class="text-gray-600 mt-2">
        Track your crypto investments from different exchanges
      </p>
    </div>

    <!-- Toggle between Single and Bulk Import -->
    <div class="mb-6">
      <div class="flex space-x-4">
        <button
          @click="importMode = 'single'"
          class="btn"
          :class="importMode === 'single' ? 'btn-primary' : 'btn-secondary'"
        >
          Single Asset
        </button>
        <button
          @click="importMode = 'bulk'"
          class="btn"
          :class="importMode === 'bulk' ? 'btn-primary' : 'btn-secondary'"
        >
          Bulk Import
        </button>
      </div>
    </div>

    <!-- Single Asset Form -->
    <div v-if="importMode === 'single'" class="max-w-2xl">
      <Card title="Add New Asset" subtitle="Enter your crypto asset details">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Exchange Selection -->
          <div>
            <label for="exchange-select" class="label">Exchange</label>
            <select
              id="exchange-select"
              v-model="form.exchange"
              class="input"
              required
            >
              <option value="">Select an exchange</option>
              <option
                v-for="exchange in exchanges"
                :key="exchange"
                :value="exchange"
              >
                {{ exchange }}
              </option>
            </select>
          </div>

          <!-- Existing Amount -->
          <div>
            <label for="existing-amount-input" class="label"
              >Existing Amount (USD)</label
            >
            <input
              id="existing-amount-input"
              v-model.number="form.existingAmount"
              type="number"
              step="0.01"
              min="0"
              class="input"
              placeholder="0.00"
              required
            />
            <p class="text-sm text-gray-500 mt-1">
              Current value of your assets on this exchange
            </p>
          </div>

          <!-- Purchase Date -->
          <div>
            <label for="purchase-date-input" class="label">Purchase Date</label>
            <input
              id="purchase-date-input"
              v-model="form.purchaseDate"
              type="date"
              class="input"
              required
            />
          </div>

          <!-- Preview Section -->
          <div v-if="showPreview" class="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 class="font-medium text-gray-900">Preview</h4>
            <div class="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Exchange:</span>
                <span class="font-medium ml-2">{{ form.exchange }}</span>
              </div>
              <div>
                <span class="text-gray-500">Existing Amount:</span>
                <span class="font-medium ml-2">
                  ${{ form.existingAmount.toLocaleString() }}
                </span>
              </div>
              <div>
                <span class="text-gray-500">Purchase Date:</span>
                <span class="font-medium ml-2">{{ form.purchaseDate }}</span>
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
              <span v-else>Add Asset</span>
            </button>
          </div>
        </form>
      </Card>
    </div>

    <!-- Bulk Import Form -->
    <div v-if="importMode === 'bulk'" class="max-w-4xl">
      <Card
        title="Bulk Import Assets"
        subtitle="Import multiple assets from CSV or add them manually"
      >
        <div class="space-y-6">
          <!-- CSV Upload Section -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-4">
                <label for="csv-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    Upload CSV file
                  </span>
                  <span class="mt-1 block text-sm text-gray-500">
                    or drag and drop your CSV file here
                  </span>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  @change="handleCsvUpload"
                  class="sr-only"
                />
              </div>
              <p class="mt-2 text-xs text-gray-500">
                CSV format: Exchange, Existing Amount (USD), Purchase Date
              </p>
            </div>
          </div>

          <!-- Manual Bulk Entry -->
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-4">Manual Entry</h4>
            <div class="space-y-4">
              <div
                v-for="(bulkItem, index) in bulkAssets"
                :key="index"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <label class="label">Exchange</label>
                  <select v-model="bulkItem.exchange" class="input" required>
                    <option value="">Select exchange</option>
                    <option
                      v-for="exchange in exchanges"
                      :key="exchange"
                      :value="exchange"
                    >
                      {{ exchange }}
                    </option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="label">Existing Amount (USD)</label>
                  <input
                    v-model.number="bulkItem.existingAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="input"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div class="flex-1">
                  <label class="label">Purchase Date</label>
                  <input
                    v-model="bulkItem.purchaseDate"
                    type="date"
                    class="input"
                    required
                  />
                </div>
                <button
                  @click="removeBulkItem(index)"
                  class="p-2 text-danger-600 hover:text-danger-800"
                  :disabled="bulkAssets.length === 1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button @click="addBulkItem" class="mt-4 btn btn-secondary">
              Add Another Asset
            </button>
          </div>

          <!-- Bulk Submit Button -->
          <div class="flex justify-end space-x-4">
            <button @click="resetBulkForm" class="btn btn-secondary">
              Reset All
            </button>
            <button
              @click="handleBulkSubmit"
              :disabled="bulkSubmitting || !isBulkFormValid"
              class="btn btn-primary"
              :class="{
                'opacity-50 cursor-not-allowed':
                  bulkSubmitting || !isBulkFormValid,
              }"
            >
              <span v-if="bulkSubmitting" class="flex items-center">
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
                Importing...
              </span>
              <span v-else>Import {{ bulkAssets.length }} Assets</span>
            </button>
          </div>
        </div>
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
          Asset Added Successfully!
        </h3>
        <p class="text-sm text-gray-500 text-center mb-4">
          {{
            importMode === "bulk"
              ? `${bulkAssets.length} assets have been added`
              : "Your asset has been added"
          }}
          to your portfolio.
        </p>
        <div class="flex space-x-3">
          <button @click="showSuccess = false" class="flex-1 btn btn-secondary">
            Add Another
          </button>
          <button @click="goToGrowth" class="flex-1 btn btn-primary">
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Assets -->
  <div v-if="recentAssets.length > 0" class="mt-8">
    <Card title="Recent Assets" subtitle="Your recently added assets">
      <div class="space-y-4">
        <div
          v-for="asset in recentAssets"
          :key="asset.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <span class="text-sm font-medium text-primary-600">{{
                asset.symbol
              }}</span>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ asset.name }}</h4>
              <p class="text-sm text-gray-500">
                {{ asset.exchange }} • {{ asset.amount }} {{ asset.symbol }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-gray-900">
              ${{ asset.totalValue.toLocaleString() }}
            </p>
            <p
              class="text-sm"
              :class="
                asset.profitLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              "
            >
              {{ asset.profitLoss >= 0 ? "+" : "" }}$
              {{ asset.profitLoss.toLocaleString() }}
              ({{ asset.profitLossPercentage >= 0 ? "+" : ""
              }}{{ asset.profitLossPercentage.toFixed(2) }}%)
            </p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";
import Card from "../components/Card.vue";

export default {
  name: "AssetInput",
  components: {
    Card,
  },
  setup() {
    const router = useRouter();
    const submitting = ref(false);
    const bulkSubmitting = ref(false);
    const showSuccess = ref(false);
    const showPreview = ref(false);
    const importMode = ref("single");
    const exchanges = ref([]);
    const recentAssets = ref([]);

    const form = ref({
      exchange: "",
      existingAmount: "",
      purchaseDate: "",
    });

    const bulkAssets = ref([
      {
        exchange: "",
        existingAmount: "",
        purchaseDate: "",
      },
    ]);

    const isBulkFormValid = computed(() => {
      return bulkAssets.value.every(
        (asset) => asset.exchange && asset.existingAmount && asset.purchaseDate
      );
    });

    const loadData = async () => {
      try {
        const [exchangeData, assetsData] = await Promise.all([
          api.getExchanges(),
          api.getAssets(),
        ]);

        exchanges.value = exchangeData;
        recentAssets.value = assetsData.slice(-3).reverse(); // Show last 3 assets
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    const updatePreview = () => {
      showPreview.value =
        form.value.exchange &&
        form.value.existingAmount &&
        form.value.purchaseDate;
    };

    const handleSubmit = async () => {
      if (
        !form.value.exchange ||
        !form.value.existingAmount ||
        !form.value.purchaseDate
      ) {
        return;
      }

      try {
        submitting.value = true;

        const assetData = {
          symbol: "ASSET",
          name: `${form.value.exchange} Portfolio`,
          amount: 1,
          exchange: form.value.exchange,
          purchasePrice: parseFloat(form.value.existingAmount),
          currentPrice: parseFloat(form.value.existingAmount),
          purchaseDate: form.value.purchaseDate,
        };

        await api.addAsset(assetData);

        showSuccess.value = true;
        resetForm();
        loadData(); // Reload recent assets
      } catch (error) {
        console.error("Error adding asset:", error);
        alert("Error adding asset. Please try again.");
      } finally {
        submitting.value = false;
      }
    };

    const handleBulkSubmit = async () => {
      if (!isBulkFormValid.value) {
        return;
      }

      try {
        bulkSubmitting.value = true;

        const assetPromises = bulkAssets.value.map((asset) => {
          const assetData = {
            symbol: "ASSET",
            name: `${asset.exchange} Portfolio`,
            amount: 1,
            exchange: asset.exchange,
            purchasePrice: parseFloat(asset.existingAmount),
            currentPrice: parseFloat(asset.existingAmount),
            purchaseDate: asset.purchaseDate,
          };
          return api.addAsset(assetData);
        });

        await Promise.all(assetPromises);

        showSuccess.value = true;
        resetBulkForm();
        loadData(); // Reload recent assets
      } catch (error) {
        console.error("Error adding bulk assets:", error);
        alert("Error adding assets. Please try again.");
      } finally {
        bulkSubmitting.value = false;
      }
    };

    const handleCsvUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split("\n").filter((line) => line.trim());

        const newAssets = lines
          .slice(1)
          .map((line) => {
            // Skip header
            const [exchange, existingAmount, purchaseDate] = line
              .split(",")
              .map((item) => item.trim());
            return {
              exchange: exchange || "",
              existingAmount: existingAmount || "",
              purchaseDate: purchaseDate || "",
            };
          })
          .filter(
            (asset) =>
              asset.exchange && asset.existingAmount && asset.purchaseDate
          );

        if (newAssets.length > 0) {
          bulkAssets.value = newAssets;
        }
      };
      reader.readAsText(file);
    };

    const addBulkItem = () => {
      bulkAssets.value.push({
        exchange: "",
        existingAmount: "",
        purchaseDate: "",
      });
    };

    const removeBulkItem = (index) => {
      if (bulkAssets.value.length > 1) {
        bulkAssets.value.splice(index, 1);
      }
    };

    const resetForm = () => {
      form.value = {
        exchange: "",
        existingAmount: "",
        purchaseDate: "",
      };
      showPreview.value = false;
    };

    const resetBulkForm = () => {
      bulkAssets.value = [
        {
          exchange: "",
          existingAmount: "",
          purchaseDate: "",
        },
      ];
    };

    const goToGrowth = () => {
      showSuccess.value = false;
      router.push("/growth");
    };

    // Watch for form changes to update preview
    watch(() => form.value.exchange, updatePreview);
    watch(() => form.value.existingAmount, updatePreview);
    watch(() => form.value.purchaseDate, updatePreview);

    onMounted(() => {
      loadData();
    });

    return {
      form,
      submitting,
      bulkSubmitting,
      showSuccess,
      showPreview,
      importMode,
      exchanges,
      recentAssets,
      bulkAssets,
      isBulkFormValid,
      updatePreview,
      handleSubmit,
      handleBulkSubmit,
      handleCsvUpload,
      addBulkItem,
      removeBulkItem,
      resetForm,
      resetBulkForm,
      goToGrowth,
    };
  },
};
</script>
