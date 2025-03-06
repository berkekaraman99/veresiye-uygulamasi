interface ICustomerReceipt {
  receipt_id: string;
  description: string;
  price: number;
  receipt_type: number;
  created_at?: string;
  updated_at?: string;
}
