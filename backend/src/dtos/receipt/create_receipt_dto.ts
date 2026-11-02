export interface CreateReceiptDto {
  receipt_id: string;
  customer_id: string;
  created_at: string;
  price: number;
  description?: string;
  receipt_type: number;
}
