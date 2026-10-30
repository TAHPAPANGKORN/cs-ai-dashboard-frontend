'use client';

import { useState, type FormEvent } from 'react';
import { Shield } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
        return;
      }
      window.location.replace('/');
    } catch {
      setError('เชื่อมต่อไม่ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง');
    } finally { setBusy(false); }
  }

  return <main className="login-page">
    <div className="login-content">
      <Shield size={28} className="header-icon" aria-hidden="true" />
      <h1>เข้าสู่ CS AI Scanner</h1>
      <p>กรอกรหัสผ่านเพื่อดู Dashboard ความปลอดภัย</p>
      <form onSubmit={submit} className="login-form" aria-busy={busy}>
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={4096} value={password} onChange={event => setPassword(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} />
        {error && <p id="login-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'กำลังตรวจสอบ…' : 'เข้าสู่ Dashboard'}</button>
      </form>
    </div>
  </main>;
}
