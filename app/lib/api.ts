import { SecuritySummary } from "@/app/types/security";

// ใช้ relative path เพื่อให้ Next.js proxy ส่งต่อไปยัง Backend จริง
// (configured in next.config.ts via BACKEND_INTERNAL_URL env)
// ซึ่งช่วยหลีกเลี่ยงปัญหา CORS อีกด้วย
const API_BASE = "";

export async function fetchSecuritySummary(): Promise<SecuritySummary> {
  const res = await fetch(`${API_BASE}/api/v1/security/summary`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch security data");
  return res.json();
}

export async function triggerScan(): Promise<{ message: string; status: string }> {
  const res = await fetch(`${API_BASE}/api/v1/security/scan-now`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to trigger scan");
  return res.json();
}
