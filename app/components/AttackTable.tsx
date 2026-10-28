"use client";

import { DetectedAttack } from "@/app/types/security";
import { ShieldCheck } from "lucide-react";
import ThreatBadge from "./ThreatBadge";

export default function AttackTable({ attacks }: { attacks: DetectedAttack[] }) {
  if (!attacks || attacks.length === 0) {
    return (
      <div className="empty-state">
        <ShieldCheck className="empty-icon" size={28} aria-hidden="true" />
        <div>ไม่พบการโจมตีในช่วงนี้</div>
        <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "var(--text-muted)" }}>
          Traffic looks clean
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper" role="region" aria-label="Detected attacks" tabIndex={0}>
      <table>
        <caption>รายละเอียดการโจมตีและคำแนะนำในการรับมือ</caption>
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Severity</th>
            <th scope="col">Source IP</th>
            <th scope="col">Target Path</th>
            <th scope="col">Description</th>
            <th scope="col">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {attacks.map((attack, i) => (
            <tr key={i}>
              <td>{attack.type}</td>
              <td><ThreatBadge level={attack.severity} /></td>
              <td className="td-ip">{attack.source_ip}</td>
              <td className="td-path" title={attack.target_path}>{attack.target_path}</td>
              <td className="td-description">{attack.description}</td>
              <td className="td-rec">{attack.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
