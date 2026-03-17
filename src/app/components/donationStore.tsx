import { projectId, publicAnonKey } from "/utils/supabase/info";

const STORAGE_KEY = "donation_account";
const KV_KEY = "donation_account";

export interface DonationAccount {
  text: string; // 후원계좌 텍스트 (전체 한 줄로 표시)
}

const defaultData: DonationAccount = {
  text: "농협 351-1307-9421-53 동북지회",
};

// localStorage 읽기
function loadFromLocalStorage(): DonationAccount {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load donation account from localStorage:", e);
  }
  return defaultData;
}

// localStorage 저장
function saveToLocalStorage(data: DonationAccount): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save donation account to localStorage:", e);
  }
}

// Supabase KV 저장
async function saveToSupabase(data: DonationAccount): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c8f2251b/kv/set`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ key: KV_KEY, value: data }),
      }
    );
    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to save donation account to Supabase:", error);
    }
  } catch (e) {
    console.error("Failed to save donation account to Supabase:", e);
  }
}

// Supabase KV에서 불러오기
export async function loadFromSupabase(): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c8f2251b/kv/get?key=${KV_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      if (result) {
        saveToLocalStorage(result);
      }
    }
  } catch (e) {
    console.error("Failed to load donation account from Supabase:", e);
  }
}

// 데이터 읽기
export function getDonationAccount(): DonationAccount {
  return loadFromLocalStorage();
}

// 데이터 저장 (localStorage + Supabase 이중 저장)
export function saveDonationAccount(data: DonationAccount): void {
  saveToLocalStorage(data);
  saveToSupabase(data);
}