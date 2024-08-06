export const reformatReceiptType = (receipt_type: number) => {
    return receipt_type === 1 ? "Alacak" : "Ödeme";
  };
