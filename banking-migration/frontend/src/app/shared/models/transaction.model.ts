export interface Transaction {
  transactionId: number;
  transactionDate: string;
  accountNumber: string;
  amount: number;
  chequeNo: string;
  transactionType: string;
}

export interface CreateTransaction {
  transactionType: string;
  amount: number;
  chequeNo: string;
}
