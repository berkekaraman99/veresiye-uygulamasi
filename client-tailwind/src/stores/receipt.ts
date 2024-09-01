import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";

export const useReceiptStore = defineStore("receipt", () => {
  //STATES
  const receipt = ref<IReceipt>();
  const receipts = ref<Array<IReceipt>>([]);
  const report = ref<Array<IReport>>([]);
  const statusCode = ref<number>(0);

  //ACTIONS
  const createReceipt = async (receiptForm: any) => {
    try {
      const res = await instance.post("/receipt/create-receipt", receiptForm);
      // console.log(res.data);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const deleteReceipt = async (receipt_id: string) => {
    try {
      const res = await instance.post("/receipt/delete-receipt", { receipt_id });
      // console.log(res.data);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const updateReceipt = async (receiptForm: any) => {
    try {
      const res = await instance.post("/receipt/update-receipt", receiptForm);
      // console.log(res.data);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const fetchReceipts = async () => {
    try {
      const res = await instance.get("/receipt/get-receipts");
      // console.log(res.data);
      receipts.value = res.data.data;
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getReceiptById = async (id: string) => {
    try {
      const res = await instance.get(`/receipt/get-receipt-by-id?receipt_id=${id}`);
      // console.log(res.data);
      receipt.value = res.data.data;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getReceiptReport = async () => {
    try {
      const res = await instance.get("/receipt/report");
      // console.log(res.data);
      report.value = res.data.data;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const downloadReceipt = async () => {
    try {
      // const res = await instance.get("/receipt/download-report");
      const url = instance.defaults.baseURL + "/receipt/download-report";
      return url;
      // console.log(res);
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  return {
    receipt,
    receipts,
    statusCode,
    report,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    fetchReceipts,
    getReceiptById,
    getReceiptReport,
    downloadReceipt,
  };
});
