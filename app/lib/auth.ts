export const SESSION_COOKIE = 'dashboard_session';
export const SESSION_SECONDS = 8 * 60 * 60;

async function key() {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) throw new Error('DASHBOARD_PASSWORD is not configured');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  const signature = await crypto.subtle.sign('HMAC', await key(), new TextEncoder().encode(`dashboard:${expires}`));
  return `${expires}.${Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export async function validSession(token?: string) {
  if (!token || !process.env.DASHBOARD_PASSWORD) return false;
  const [expires, signature, extra] = token.split('.');
  if (extra || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(signature ?? '') || Number(expires) <= Date.now()) return false;
  return crypto.subtle.verify('HMAC', await key(), new Uint8Array(signature.match(/../g)!.map(byte => parseInt(byte, 16))), new TextEncoder().encode(`dashboard:${expires}`));
}
