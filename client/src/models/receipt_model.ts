export interface IReceipt {
  receipt_id: string;
  customer_id: string;
  customer_name: string;
  created_at?: string;
  updated_at?: string;
  price: number;
  description: string;
  receipt_type: number;
}
