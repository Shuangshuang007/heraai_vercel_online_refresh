// ---- enums & labels ----
export type AUWorkingRightsCode =
  | 'AU_CITIZEN'
  | 'AU_PR'
  | 'TEMP_FULL'
  | 'STUDENT_LIMITED'
  | 'NO_RIGHTS'
  | 'UNKNOWN';

export const AU_WR_LABEL: Record<AUWorkingRightsCode, string> = {
  AU_CITIZEN: 'Australian Citizen',
  AU_PR: 'Australian Permanent Resident',
  TEMP_FULL: 'Temporary Work Visa (with full work rights)',
  STUDENT_LIMITED: 'Student Visa (limited work rights)',
  NO_RIGHTS: 'No work rights in Australia',
  UNKNOWN: 'Unknown',
};

// ---- normalize from any string to enum ----
export function normalizeWorkingRightsAU(input?: string): AUWorkingRightsCode {
  const s = (input || '').toLowerCase().trim();
  if (!s) return 'UNKNOWN';
  if (/(australian|australia).*(citizen|citizenship)/.test(s)) return 'AU_CITIZEN';
  if (/permanent\s*resident|\bpr\b/.test(s)) return 'AU_PR';
  if (/temporary|temp/.test(s) && /full.*work\s*rights/.test(s)) return 'TEMP_FULL';
  if (/student/.test(s) && /(limited|20|24)\s*hours?|limited.*work\s*rights/.test(s)) return 'STUDENT_LIMITED';
  if (/no.*work\s*rights|not.*authori[sz]ed.*work/.test(s)) return 'NO_RIGHTS';
  // also accept exact UI labels
  if (s === 'australian citizen') return 'AU_CITIZEN';
  if (s === 'australian permanent resident') return 'AU_PR';
  if (s.startsWith('temporary work') && s.includes('full work rights')) return 'TEMP_FULL';
  if (s.startsWith('student visa')) return 'STUDENT_LIMITED';
  if (s.startsWith('no work rights')) return 'NO_RIGHTS';
  return 'UNKNOWN';
}

// ---- JD requirement matching ----
export function meetsWorkingRightsRequirement(jdText: string, userWRRaw?: string): boolean {
  const text = (jdText || '').toLowerCase();
  const needCitizen = /citizen(ship)?|澳大利亚.*公民/.test(text);
  const needPR      = /\bpr\b|permanent\s*resident|永居/.test(text);
  const needFull    = /full.*work\s*rights|完全.*工作权利/.test(text);
  const forbidNo    = /work\s*rights.*(required|must|necessary)/.test(text);

  const code = normalizeWorkingRightsAU(userWRRaw);

  if (needCitizen) return code === 'AU_CITIZEN';
  if (needPR)      return code === 'AU_PR' || code === 'AU_CITIZEN';
  if (needFull)    return code === 'TEMP_FULL' || code === 'AU_PR' || code === 'AU_CITIZEN';
  if (forbidNo)    return code !== 'NO_RIGHTS' && code !== 'UNKNOWN';
  return true; // JD 未提及 → 视为满足
}
