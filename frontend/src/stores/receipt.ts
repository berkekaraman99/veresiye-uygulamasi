import { ref } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";
import type { IReport } from "@/models/report_model";
import type { IReceipt } from "@/models/receipt_model";
import type { CreateReceipt } from "@/models/create_receipt_model";
import type { UpdateReceipt } from "@/models/update_receipt_model";
import type { DashboardReceipt } from "@/models/dashboard_receipt_model";

export const useReceiptStore = defineStore("receipt", () => {
  //STATES
  const receipt = ref<IReceipt>();
  const receipts = ref<Array<IReceipt>>([]);
  const lastReceipts = ref<Array<DashboardReceipt>>([]);
  const debtReceivableResult = ref<{ alacak: number; odeme: number }>();
  const report = ref<Array<IReport>>([]);

  //ACTIONS
  const createReceipt = async (receiptForm: CreateReceipt) => {
    await instance.post("/receipt/create-receipt", receiptForm);
  };

  const deleteReceipt = async (receipt_id: string) => {
    await instance.post("/receipt/delete-receipt", {
      receipt_id,
    });
  };

  const updateReceipt = async (receiptForm: UpdateReceipt) => {
    await instance.post("/receipt/update-receipt", receiptForm);
  };

  const getReceiptById = async (id: string) => {
    const res = await instance.get("/receipt/get-receipt-by-id", {
      params: { receipt_id: id },
    });
    receipt.value = res.data.data;
  };

  const getReceiptReport = async () => {
    const res = await instance.get("/receipt/report");
    report.value = res.data.data;
  };

  const downloadReceipt = async () => {
    const res = await instance.get("/receipt/download-report", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Report.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLastReceipts = async () => {
    const res = await instance.get("/receipt/get-last-receipts");
    lastReceipts.value = res.data.data;
  };

  const getDebtAndReceivable = async () => {
    const res = await instance.get("/receipt/get-debt-and-receivable");
    debtReceivableResult.value = res.data.data[0];
  };

  return {
    receipt,
    receipts,
    lastReceipts,
    report,
    debtReceivableResult,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    getReceiptById,
    getReceiptReport,
    downloadReceipt,
    getLastReceipts,
    getDebtAndReceivable,
  };
});
