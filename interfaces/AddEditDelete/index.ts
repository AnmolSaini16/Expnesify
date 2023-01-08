export interface AddExpense {
  amount: number;
  account: string;
  category: string;
  dateTime: string | Date;
  note: string;
  paymentType: string;
}

export interface Expenses {
  amount: number;
  account: string;
  category: string;
  dateTime: string;
  note: string;
  paymentType: string;
  totalBalance: number;
}

export interface FirstTimePopup {
  account1: string;
  account2: string;
  account1Balance: number;
  account2Balance: number;
  cash: number;
}

export interface AccountsData {
  account1: string;
  account2: string;
  account1Balance: number;
  account2Balance: number;
  cash: number;
  email: string;
  isFirstTime: boolean;
  totalBalance: number;
}
