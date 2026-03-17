// ──────────────────────────────────────────────
// 공유 교회 저장소 (localStorage + 서버 동기화)
// ChurchesPage.tsx와 ChurchAdminPage.tsx가 동일한 데이터를 참조합니다.
// ──────────────────────────────────────────────

import { serverSet } from "./dataSync";

export interface ChurchItem {
  id: number;
  name: string;
  nameEn: string;
  address: string;
  image: string;
  pastor?: string;
  youthLeader?: string; // 청년부회장
  phone?: string; // 전화번호
  visible: boolean;
}

const STORAGE_KEY = "admin_churches";

// 기본 이미지들은 figma:asset이므로 런타임에 주입합니다.
let DEFAULT_CHURCHES: ChurchItem[] = [];

// 기본 교회 ID → figma:asset 이미지 매핑 (ChurchesPage에서 주입)
let DEFAULT_IMAGE_MAP: Record<number, string> = {};

export function setDefaultChurches(churches: ChurchItem[]) {
  DEFAULT_CHURCHES = churches;
  // 기본 이미지 맵 자동 구성
  DEFAULT_IMAGE_MAP = {};
  churches.forEach((c) => {
    DEFAULT_IMAGE_MAP[c.id] = c.image;
  });
}

/** 기본 교회의 figma:asset 이미지 맵 반환 */
export function getDefaultImageMap(): Record<number, string> {
  return DEFAULT_IMAGE_MAP;
}

/** 이미지가 사용자 업로드(base64)인지 판별 */
function isCustomImage(img: string): boolean {
  return img.startsWith("data:");
}

/** localStorage에서 교회 목록 읽기 */
export function getChurches(): ChurchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored: ChurchItem[] = JSON.parse(raw);
      // 기본 교회 목록과 병합 (새로 추가된 기본 교회 반영)
      const storedIds = new Set(stored.map((c) => c.id));
      const merged = [
        ...stored.map((c) => {
          // 기본 교회의 figma:asset 이미지가 깨질 수 있으므로,
          // 사용자가 직접 업로드(base64)한 게 아니면 기본 이미지로 복원
          if (DEFAULT_IMAGE_MAP[c.id] && !isCustomImage(c.image)) {
            return { ...c, image: DEFAULT_IMAGE_MAP[c.id] };
          }
          return c;
        }),
        ...DEFAULT_CHURCHES.filter((c) => !storedIds.has(c.id)),
      ];
      return merged;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_CHURCHES.map((c) => ({ ...c }));
}

/** localStorage에 교회 목록 저장 + 서버 동기화 */
export function saveChurches(churches: ChurchItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(churches));
  serverSet(STORAGE_KEY, churches);
}

/** 고유 ID 생성 */
export function generateChurchId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}