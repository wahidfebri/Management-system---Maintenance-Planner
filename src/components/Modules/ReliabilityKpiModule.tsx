import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { ReliabilityKpiSummary } from '../../types/cmms';

interface ReliabilityKpiModuleProps {
  kpis: ReliabilityKpiSummary;
}

export const ReliabilityKpiModule: React.FC<ReliabilityKpiModuleProps> = ({ kpis }) => {
  const [simCalHours, setSimCalHours] = useState<number>(720);
  const [simOpHours, setSimOpHours] = useState<number>(550);
  const [simStbyHours, setSimStbyHours] = useState<number>(110);
  const [simRepairHours, setSimRepairHours] = useState<number>(60);
  const [simBreakdowns, setSimBreakdowns] = useState<number>(4);

  const simPA = Number((((simCalHours - simRepairHours) / simCalHours) * 100).toFixed(1));
  const simMA = Number((((simOpHours + simStbyHours) / (simOpHours + simStbyHours + simRepairHours)) * 100).toFixed(1));
  const simUA = Number(((simOpHours / (simOpHours + simStbyHours)) * 100).toFixed(1));
  const simMTBF = Number((simOpHours / (simBreakdowns || 1)).toFixed(1));
  const simMTTR = Number((simRepairHours / (simBreakdowns || 1)).toFixed(1));

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-[#141414]" />
            <span>Modul 14: Engine Formulasi KPI Reliability Engineering & Simulator</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Transparansi rumus matematis ISO 14224 / World Class Maintenance KPI & simulator parameter interaktif
          </p>
        </div>
      </div>

      {/* KPI Formula Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">1. Physical Availability (PA)</span>
            <span className="mono-value text-base text-[#141414]">{kpis.pa}%</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            PA = [(Jam Kalender - Jam DT) / Jam Kalender] × 100%
          </div>
        </div>

        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">2. Mechanical Availability (MA)</span>
            <span className="mono-value text-base text-[#141414]">{kpis.ma}%</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            MA = [(Op + Stby) / (Op + Stby + Repair)] × 100%
          </div>
        </div>

        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">3. Use of Availability (UA)</span>
            <span className="mono-value text-base text-[#141414]">{kpis.ua}%</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            UA = [Op / (Op + Stby)] × 100%
          </div>
        </div>

        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">4. MTBF</span>
            <span className="mono-value text-base text-[#141414]">{kpis.mtbf} HRS</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            MTBF = Jam Operasi Total / Total Breakdown
          </div>
        </div>

        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">5. MTTR</span>
            <span className="mono-value text-base text-[#141414]">{kpis.mttr} HRS</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            MTTR = Total Jam Repair / Total Breakdown
          </div>
        </div>

        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <div className="flex justify-between items-center">
            <span className="serif-label font-bold">6. PM Compliance</span>
            <span className="mono-value text-base text-[#141414]">{kpis.pmCompliance}%</span>
          </div>
          <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[10px] mono-value text-[#141414]">
            PMC = (PM Selesai / PM Schedule) × 100%
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="bg-white border border-[#141414] p-4 space-y-3">
        <h3 className="text-xs font-black uppercase text-[#141414]">Simulator Parameter Interaktif</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div>
            <span className="serif-label block">Jam Kalender</span>
            <input type="number" value={simCalHours} onChange={(e) => setSimCalHours(Number(e.target.value))} className="w-full bg-[#E4E3E0] border border-[#141414] p-1 mono-value" />
          </div>
          <div>
            <span className="serif-label block">Jam Operasi</span>
            <input type="number" value={simOpHours} onChange={(e) => setSimOpHours(Number(e.target.value))} className="w-full bg-[#E4E3E0] border border-[#141414] p-1 mono-value" />
          </div>
          <div>
            <span className="serif-label block">Jam Standby</span>
            <input type="number" value={simStbyHours} onChange={(e) => setSimStbyHours(Number(e.target.value))} className="w-full bg-[#E4E3E0] border border-[#141414] p-1 mono-value" />
          </div>
          <div>
            <span className="serif-label block">Jam Repair</span>
            <input type="number" value={simRepairHours} onChange={(e) => setSimRepairHours(Number(e.target.value))} className="w-full bg-[#E4E3E0] border border-[#141414] p-1 mono-value" />
          </div>
          <div>
            <span className="serif-label block">Insiden Breakdown</span>
            <input type="number" value={simBreakdowns} onChange={(e) => setSimBreakdowns(Number(e.target.value))} className="w-full bg-[#E4E3E0] border border-[#141414] p-1 mono-value" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#141414] text-center font-bold">
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Sim PA</span>
            <span className="mono-value text-sm">{simPA}%</span>
          </div>
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Sim MA</span>
            <span className="mono-value text-sm">{simMA}%</span>
          </div>
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Sim UA</span>
            <span className="mono-value text-sm">{simUA}%</span>
          </div>
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Sim MTBF</span>
            <span className="mono-value text-sm">{simMTBF} HRS</span>
          </div>
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Sim MTTR</span>
            <span className="mono-value text-sm">{simMTTR} HRS</span>
          </div>
        </div>
      </div>

    </div>
  );
};
