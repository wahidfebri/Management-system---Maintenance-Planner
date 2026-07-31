import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Asset, BreakdownReport, SparePart } from '../../types/cmms';

interface AnalyticsDashboardModuleProps {
  assets: Asset[];
  breakdowns: BreakdownReport[];
  spareParts: SparePart[];
}

export const AnalyticsDashboardModule: React.FC<AnalyticsDashboardModuleProps> = ({
  assets,
  breakdowns
}) => {
  const assetDowntimePareto = assets
    .map((ast) => {
      const astBreakdowns = breakdowns.filter((b) => b.assetId === ast.id);
      const totalDt = astBreakdowns.reduce((sum, b) => sum + b.repairTimeHours, 0);
      return {
        code: ast.equipmentCode,
        downtimeHours: totalDt
      };
    })
    .sort((a, b) => b.downtimeHours - a.downtimeHours);

  const failureCodeCounts: Record<string, number> = {};
  breakdowns.forEach((b) => {
    failureCodeCounts[b.failureCode] = (failureCodeCounts[b.failureCode] || 0) + b.repairTimeHours;
  });

  const failureParetoData = Object.keys(failureCodeCounts).map((code) => ({
    failureCode: code,
    downtime: failureCodeCounts[code]
  })).sort((a, b) => b.downtime - a.downtime);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#141414]" />
            <span>Modul 15: Analytics Dashboard & Diagram Pareto 80/20</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Analisis diagram Pareto untuk mengidentifikasi 20% penyebab utama 80% downtime & pemborosan biaya
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        
        <div className="p-4 bg-white border border-[#141414] space-y-3">
          <h3 className="text-xs font-black uppercase text-[#141414] flex items-center justify-between">
            <span>Pareto Downtime (Jam) per Equipment</span>
            <span className="status-chip bg-white text-black">PRINSIP 80/20</span>
          </h3>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetDowntimePareto} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#141414" opacity={0.2} />
                <XAxis dataKey="code" stroke="#141414" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#141414" fontSize={11} fontWeight="bold" />
                <Tooltip contentStyle={{ backgroundColor: '#141414', color: '#E4E3E0', border: '1px solid #141414', fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="downtimeHours" name="Downtime (Jam)" fill="#141414" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#141414] space-y-3">
          <h3 className="text-xs font-black uppercase text-[#141414] flex items-center justify-between">
            <span>Pareto Downtime per Failure Code</span>
            <span className="status-chip bg-[#FF4444] text-white">AKAR MASALAH</span>
          </h3>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureParetoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#141414" opacity={0.2} />
                <XAxis dataKey="failureCode" stroke="#141414" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#141414" fontSize={11} fontWeight="bold" />
                <Tooltip contentStyle={{ backgroundColor: '#141414', color: '#E4E3E0', border: '1px solid #141414', fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="downtime" name="Jam Downtime" fill="#FF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
