// Student progress is saved only in this browser (no accounts, no personal data).

const KEY = "reliq-progress";

export type Progress = {
  missions: Record<string, { best: number; total: number }>;
  partsSeen: Record<string, string[]>;
};

const empty: Progress = { missions: {}, partsSeen: {} };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(empty);
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { missions: parsed.missions ?? {}, partsSeen: parsed.partsSeen ?? {} };
  } catch {
    return structuredClone(empty);
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function saveMissionScore(roverId: string, score: number, total: number) {
  const p = loadProgress();
  const prev = p.missions[roverId]?.best ?? 0;
  p.missions[roverId] = { best: Math.max(prev, score), total };
  save(p);
}

export function markPartSeen(roverId: string, partId: string) {
  const p = loadProgress();
  const list = new Set(p.partsSeen[roverId] ?? []);
  list.add(partId);
  p.partsSeen[roverId] = [...list];
  save(p);
  return p.partsSeen[roverId];
}
