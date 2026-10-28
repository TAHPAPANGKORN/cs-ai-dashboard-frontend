"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Shield, RefreshCw, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SecuritySummary } from '@/app/types/security';
import { fetchSecuritySummary, triggerScan } from '@/app/lib/api';
import StatCard from '@/app/components/StatCard';
import ThreatBadge from '@/app/components/ThreatBadge';
import AISummary from '@/app/components/AISummary';
import AttackTable from '@/app/components/AttackTable';
import { TopIPsChart, CountryChart, DeviceChart } from '@/app/components/Charts';

export default function Dashboard() {
  const [data, setData] = useState<SecuritySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const fetching = useRef(false);
  const scanInFlight = useRef(false);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const loadData = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    try {
      const result = await fetchSecuritySummary();
      if (!mounted.current) return;
      setData(result);
      setLastFetch(new Date());
      setError(null);
    } catch {
      if (mounted.current) setError('ไม่สามารถโหลดข้อมูลล่าสุดได้ กรุณาตรวจสอบการเชื่อมต่อแล้วกด Refresh อีกครั้ง');
    } finally {
      fetching.current = false;
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadData();
    const timer = setInterval(loadData, 30_000);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, [loadData]);

  const handleScanNow = async () => {
    if (scanInFlight.current) return;
    scanInFlight.current = true;
    setScanning(true);
    setScanError(null);
    setScanMessage(null);
    try {
      await triggerScan();
      if (!mounted.current) return;
      setScanMessage('ส่งคำขอสแกนแล้ว ระบบจะอัปเดตข้อมูลโดยอัตโนมัติ');
      scanTimer.current = setTimeout(() => {
        loadData();
        scanInFlight.current = false;
        setScanning(false);
      }, 2000);
    } catch {
      scanInFlight.current = false;
      if (mounted.current) {
        setScanError('ส่งคำขอสแกนไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลอง Scan Now อีกครั้ง');
        setScanning(false);
      }
    }
  };

  return <div className="dashboard">
    <a href="#main-content" className="skip-link">ข้ามไปยังเนื้อหา</a>
    <div className="dashboard-inner">
      <header className="header">
        <div className="header-left">
          <Shield className="header-icon" size={28} strokeWidth={1.75} aria-hidden="true" />
          <div><h1>Dashboard</h1><div className="header-subtitle">Real-time Security Intelligence Dashboard</div></div>
        </div>
        <div className="header-right">
          {lastFetch && <span className="last-updated">{error ? 'ข้อมูลล่าสุดที่โหลดสำเร็จ' : 'อัปเดตล่าสุด'} <time dateTime={lastFetch.toISOString()}>{lastFetch.toLocaleTimeString('th-TH')}</time></span>}
          <button className="btn btn-ghost" id="btn-refresh" onClick={loadData} disabled={loading} aria-busy={loading}>
            {loading ? <span className="spinner" aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}{loading ? 'กำลังโหลด…' : 'Refresh'}
          </button>
          <button className="btn btn-primary" id="btn-scan-now" onClick={handleScanNow} disabled={scanning} aria-busy={scanning}>
            {scanning ? <span className="spinner" aria-hidden="true" /> : <Search size={16} aria-hidden="true" />}{scanning ? 'กำลังส่งคำขอ…' : 'Scan Now'}
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {error && <div className="error-banner" role="alert"><AlertCircle size={18} aria-hidden="true" /><span>{error}{data && ' ข้อมูลด้านล่างอาจไม่ใช่ข้อมูลล่าสุด'}</span></div>}
        {scanError && <div className="error-banner" role="alert"><AlertCircle size={18} aria-hidden="true" /><span>{scanError}</span></div>}
        {scanMessage && <div className="success-banner" role="status"><CheckCircle2 size={18} aria-hidden="true" /><span>{scanMessage}</span></div>}
        {loading && !data && <div className="loading-state" role="status"><span className="spinner" aria-hidden="true" /><p>กำลังโหลดข้อมูลความปลอดภัย…</p></div>}
        {!loading && !data && <div className="empty-state"><h2>ยังแสดงข้อมูลความปลอดภัยไม่ได้</h2><p>กด Refresh เพื่อลองโหลดข้อมูลอีกครั้ง</p></div>}
        {data && <>
          <section className="stats-grid" aria-label="ภาพรวมความปลอดภัย">
            <StatCard label="Total Requests" value={data.total_requests.toLocaleString()} />
            <StatCard label="Threat Level" value={<ThreatBadge level={data.threat_level} />} />
            <StatCard label="Detected Attacks" value={data.detected_attacks?.length ?? 0} />
            <StatCard label="Last Scanned" value={<span className="stat-value-small">{data.last_updated || 'ยังไม่มีข้อมูล'}</span>} />
          </section>
          <AISummary summary={data.ai_summary} />
          <section className="charts-grid" aria-label="สถิติการเข้าถึง">
            <section className="chart-card" aria-labelledby="ips-heading"><h2 className="card-title" id="ips-heading">Top IP Addresses</h2><div className="chart-body" role="region" aria-labelledby="ips-heading" tabIndex={0}><TopIPsChart data={data.charts?.top_ips} /></div></section>
            <section className="chart-card" aria-labelledby="country-heading"><h2 className="card-title" id="country-heading">Traffic by Country</h2><div className="chart-body" role="region" aria-labelledby="country-heading" tabIndex={0}><CountryChart data={data.charts?.traffic_by_country} /></div></section>
            <section className="chart-card" aria-labelledby="device-heading"><h2 className="card-title" id="device-heading">Traffic by Device</h2><div className="chart-body" role="region" aria-labelledby="device-heading" tabIndex={0}><DeviceChart data={data.charts?.traffic_by_device} /></div></section>
          </section>
          <section className="attacks-card" aria-labelledby="attacks-heading"><h2 className="card-title" id="attacks-heading">Detected Attacks<span className="attack-count">{data.detected_attacks?.length ?? 0} found</span></h2><AttackTable attacks={data.detected_attacks ?? []} /></section>
        </>}
      </main>
      <footer className="footer">CS AI Scanner v2.0.0 · Powered by Gemini AI · Auto-refreshes every 30s</footer>
    </div>
  </div>;
}
