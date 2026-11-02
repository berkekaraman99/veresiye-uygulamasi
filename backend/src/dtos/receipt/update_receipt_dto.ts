export interface UpdateReceiptDto {
  receipt_id: string;
  price: number;
  description?: string;
  receipt_type: number;
}
