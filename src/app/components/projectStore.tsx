// ──────────────────────────────────────────────
// Our Ministry 프로젝트 저장소 (localStorage + 서버 동기화)
// ProjectsPage.tsx 와 ProjectAdminPage.tsx가 동일한 데이터를 참조합니다.
// ──────────────────────────────────────────────

import { serverSet } from "./dataSync";

export interface ProjectItem {
  id: string;
  year: string;
  title: string;
  date: string;
  description: string; // 줄바꿈(\n) 구분
  image: string;
  tag: string;
  pressUrl: string; // 보도자료 URL
  visible: boolean;
}

const STORAGE_KEY = "admin_projects";

const TAG_LIST = ["예배", "체육", "봉사", "교제", "말씀", "찬양", "수련회", "기타"];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    year: "2026",
    title: "동북시찰 체육대회",
    date: "2026. 03. 02",
    description:
      "구좌체육관에서 동북시찰 소속 교회 청년들이 한자리에 모여 체육대회를 개최했습니다.\n오전에는 레크리에이션을 통한 아이스 브레이킹으로 서로 친해지는 시간을 보냈고, 이후 농구·족구·피구 경기를 진행했습니다.\n서로 응원하며 땀 흘리는 가운데, 하나 된 공동체의 기쁨을 나누었습니다.",
    image:
      "https://images.unsplash.com/photo-1768842407056-6c64fe629c2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzcG9ydHMlMjBneW1uYXNpdW0lMjBiYXNrZXRiYWxsJTIwY291cnQlMjBldmVudHxlbnwxfHx8fDE3NzM2MjYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "체육",
    pressUrl: "",
    visible: true,
  },
  {
    id: "p2",
    year: "2025",
    title: "동북시찰 볼링대회",
    date: "2025. 10. 26",
    description:
      "삼화스톤엣지볼링장에서 동북시찰 소속 교회 청년들이 함께 볼링대회를 개최했습니다.\n교회별 팀을 이루어 즐거운 경쟁을 펼치며, 스트라이크와 환호 속에 하나 되는 시간을 보냈습니다.\n볼링을 통해 자연스럽게 교제하며, 서로의 거리를 좁히는 따뜻한 하루였습니다.",
    image:
      "https://images.unsplash.com/photo-1763819527452-f01bfb155013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3dsaW5nJTIwYWxsZXklMjBsYW5lcyUyMGluZG9vciUyMHJlY3JlYXRpb258ZW58MXx8fHwxNzczNjQ0NTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "체육",
    pressUrl: "",
    visible: true,
  },
  {
    id: "p3",
    year: "2023",
    title: "지역 봉사활동",
    date: "2023. 12. 21",
    description:
      "성탄절을 맞아 제주도 동북 지역 소외 이웃들에게 따뜻한 식사와 생필품을 전달하는 봉사활동을 진행했습니다.\n사랑을 나누는 귀한 시간이었습니다.",
    image:
      "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlJTIwY2hhcml0eSUyMGZvb2R8ZW58MXx8fHwxNzczNTY0NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "봉사",
    pressUrl: "",
    visible: true,
  },
  {
    id: "p4",
    year: "2023",
    title: "한라산 등반 교제",
    date: "2023. 10. 05",
    description:
      "가을을 맞아 청년들이 함께 한라산을 등반하며 교제하는 시간을 가졌습니다.\n자연 속에서 하나님의 창조를 느끼며 서로를 더 깊이 알아가는 시간이었습니다.",
    image:
      "https://images.unsplash.com/photo-1722410141874-5494d14deeca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwaGlraW5nJTIwZ3JvdXAlMjBtb3VudGFpbnxlbnwxfHx8fDE3NzM1NjQ0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "교제",
    pressUrl: "",
    visible: true,
  },
  {
    id: "p5",
    year: "2023",
    title: "연합 성경공부",
    date: "2023. 06. 01 - 07. 27",
    description:
      "8주간 매주 토요일 연합 성경공부를 진행했습니다.\n로마서를 함께 읽으며 말씀의 깊이를 나누고 삶에 적용하는 방법을 함께 고민했습니다.",
    image:
      "https://images.unsplash.com/photo-1631801752478-f45b08891d66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHN0dWR5JTIwcHJheWVyJTIwZ3JvdXB8ZW58MXx8fHwxNzczNTY0NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "말씀",
    pressUrl: "",
    visible: true,
  },
  {
    id: "p6",
    year: "2023",
    title: "성탄축하 연합예배",
    date: "2023. 12. 24",
    description:
      "성탄절을 축하하며 동북시찰 청년들이 모여 연합예배를 드렸습니다.\n특별찬양과 성극을 준비하여 예수님의 탄생을 함께 기뻐했습니다.",
    image:
      "https://images.unsplash.com/photo-1765828806085-8c30e0ea98f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjaHJpc3RtYXMlMjBjZWxlYnJhdGlvbiUyMGV2ZW50fGVufDF8fHx8MTc3MzU2NDQyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "예배",
    pressUrl: "",
    visible: true,
  },
];

/** localStorage에서 프로젝트 목록 읽기 */
export function getProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
}

/** localStorage에 프로젝트 목록 저장 + 서버 동기화 */
export function saveProjects(projects: ProjectItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  serverSet(STORAGE_KEY, projects);
}

/** 고유 ID 생성 */
export function generateProjectId(): string {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export { DEFAULT_PROJECTS, TAG_LIST };