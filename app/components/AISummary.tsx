
export default function AISummary({ summary }: { summary: string }) {
  return <section className="ai-summary-card" aria-labelledby="ai-heading">
    <div className="ai-summary-header"><h2 id="ai-heading">Gemini AI Analysis</h2></div>
    <p className="ai-summary-text">{summary || 'ยังไม่มีข้อมูลการวิเคราะห์'}</p>
  </section>;
}
