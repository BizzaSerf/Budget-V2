
export enum User {
  Wife = 'Wife',
  Husband = 'Husband',
}

export enum Category {
  Groceries = 'Groceries',
  DiningOut = 'Dining Out',
  Transport = 'Transport',
  Entertainment = 'Entertainment',
  Shopping = 'Shopping',
  Utilities = 'Utilities',
  Housing = 'Housing',
  Health = 'Health',
  Travel = 'Travel',
  Other = 'Other',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  paidBy: User;
  date: Date;
}
