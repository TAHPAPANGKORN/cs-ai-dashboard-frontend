export interface DetectedAttack {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source_ip: string;
  target_path: string;
  description: string;
  recommendation: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface SecuritySummary {
  threat_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  total_requests: number;
  ai_summary: string;
  detected_attacks: DetectedAttack[];
  last_updated: string;
  charts: {
    traffic_by_country: ChartData;
    top_ips: ChartData;
    traffic_by_device: ChartData;
  };
}
