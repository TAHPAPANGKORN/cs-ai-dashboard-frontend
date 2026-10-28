import { ShieldCheck, AlertTriangle, ShieldAlert, OctagonAlert } from 'lucide-react';

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
const icons = { LOW: ShieldCheck, MEDIUM: AlertTriangle, HIGH: ShieldAlert, CRITICAL: OctagonAlert };

export default function ThreatBadge({ level }: { level: Severity }) {
  const Icon = icons[level] ?? ShieldAlert;
  return <span className={`badge badge-${level}`}><Icon size={14} aria-hidden="true" />{level}</span>;
}
