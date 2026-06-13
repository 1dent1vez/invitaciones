export function getWeeklySalt(): string {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber}`;
}

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function getSessionHash(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? 'admin_super_secret';
  const salt = getWeeklySalt();
  return sha256(password + salt);
}

export async function verifySession(sessionCookie: string | undefined): Promise<boolean> {
  if (!sessionCookie) return false;
  const expectedHash = await getSessionHash();
  return sessionCookie === expectedHash;
}
