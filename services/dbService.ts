import { Transaction, Category } from '../types';

// IMPORTANT: This is a public, unsecured database for demonstration purposes only.
// Anyone with the link can read or write to it. 
// Do not use this service for sensitive data or in a production environment.
// This specific blob was initialized with: {"transactions":[],"budgets":{}}
const DB_URL = 'https://jsonblob.com/api/jsonBlob/1271108298715873280';

export interface AppData {
  transactions: Transaction[];
  budgets: Record<Category, number>;
}

export async function getAppData(): Promise<AppData> {
  try {
    const response = await fetch(DB_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Dates are stored as strings in JSON, so we need to convert them back to Date objects.
    const parsedTransactions = (data.transactions || []).map((t: any) => ({
        ...t,
        date: new Date(t.date),
    }));

    return { 
        transactions: parsedTransactions,
        budgets: data.budgets || {}
    };
  } catch (error) {
    console.error('Error fetching app data:', error);
    // Re-throw the error to be handled by the UI layer
    throw error;
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  try {
    const response = await fetch(DB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving app data:', error);
     // Re-throw the error to be handled by the UI layer
    throw error;
  }
}
