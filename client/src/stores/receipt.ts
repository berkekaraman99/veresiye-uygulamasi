import { ref } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";
import type { IReport } from "@/models/report_model";
import type { IReceipt } from "@/models/receipt_model";
import type { IDashboardReceipt } from "@/models/dashboard_receipt_model";

export const useReceiptStore = defineStore("receipt", () => {
  //STATES
  const receipt = ref<IReceipt>();
  const receipts = ref<Array<IReceipt>>([]);
  const lastReceipts = ref<Array<IDashboardReceipt>>([]);
  const debtReceivableResult = ref();
  const report = ref<Array<IReport>>([]);
  const statusCode = ref<number>(0);

  //ACTIONS
  const createReceipt = async (receiptForm: any) => {
    try {
      const res = await instance.post("/receipt/create-receipt", receiptForm);
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
      const url = instance.defaults.baseURL + "/receipt/download-report";
      return url;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getLastReceipts = async () => {
    try {
      const res = await instance.get("/receipt/get-last-receipts");
      statusCode.value = res.data.statusCode;

      lastReceipts.value = res.data.data;
      // console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const getDebtAndReceivable = async () => {
    try {
      const res = await instance.get("/receipt/get-debt-and-receivable");
      statusCode.value = res.data.statusCode;

      debtReceivableResult.value = res.data.data;
      console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  return {
    receipt,
    receipts,
    lastReceipts,
    statusCode,
    report,
    debtReceivableResult,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    fetchReceipts,
    getReceiptById,
    getReceiptReport,
    downloadReceipt,
    getLastReceipts,
    getDebtAndReceivable,
  };
});
