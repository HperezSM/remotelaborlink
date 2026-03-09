// Login attempt lockout utility
// Tracks failed attempts in localStorage per email
// After 5 failed attempts: lock for 15 minutes

const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface LockoutData {
  count: number;
  locked_until: number | null;
}

function getKey(email: string) {
  return `rl_login_attempts_${email.toLowerCase().trim()}`;
}

function getData(email: string): LockoutData {
  try {
    const raw = localStorage.getItem(getKey(email));
    if (!raw) return { count: 0, locked_until: null };
    return JSON.parse(raw);
  } catch {
    return { count: 0, locked_until: null };
  }
}

function setData(email: string, data: LockoutData) {
  localStorage.setItem(getKey(email), JSON.stringify(data));
}

export function isLockedOut(email: string): { locked: boolean; remainingMs: number } {
  const data = getData(email);
  if (data.locked_until && Date.now() < data.locked_until) {
    return { locked: true, remainingMs: data.locked_until - Date.now() };
  }
  // If lockout expired, reset
  if (data.locked_until && Date.now() >= data.locked_until) {
    setData(email, { count: 0, locked_until: null });
  }
  return { locked: false, remainingMs: 0 };
}

export function recordFailedAttempt(email: string): { locked: boolean; attemptsRemaining: number; remainingMs: number } {
  let data = getData(email);
  // Reset if previous lockout expired
  if (data.locked_until && Date.now() >= data.locked_until) {
    data = { count: 0, locked_until: null };
  }
  data.count += 1;
  if (data.count >= MAX_ATTEMPTS) {
    data.locked_until = Date.now() + LOCKOUT_DURATION_MS;
    setData(email, data);
    return { locked: true, attemptsRemaining: 0, remainingMs: LOCKOUT_DURATION_MS };
  }
  setData(email, data);
  return { locked: false, attemptsRemaining: MAX_ATTEMPTS - data.count, remainingMs: 0 };
}

export function resetAttempts(email: string) {
  localStorage.removeItem(getKey(email));
}

export function formatLockoutTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
