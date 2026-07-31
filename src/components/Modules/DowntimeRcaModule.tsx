import React from 'react';
import { GitPullRequest, AlertTriangle } from 'lucide-react';
import { RcaAnalysis, BreakdownReport, Asset } from '../../types/cmms';

interface DowntimeRcaModuleProps {
  rcaList: RcaAnalysis[];
  breakdowns: BreakdownReport[];
  assets: Asset[];
  onOpenRcaForBreakdown: (breakdown: BreakdownReport) => void;
}

export const DowntimeRcaModule: React.FC<DowntimeRcaModuleProps> = ({
  rcaList,
  breakdowns,
  assets,
  onOpenRcaForBreakdown
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-[#141414]" />
            <span>Modul 8 & 9: Controlling Downtime & Root Cause Analysis (RCA)</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pencatatan rincian durasi downtime (Repair, Waiting Part, Testing), 5-Why Method, Fishbone Diagram & CAPA
          </p>
        </div>
      </div>

      {/* Incidents needing RCA */}
      <div className="bg-white border border-[#141414] p-4 space-y-3">
        <h3 className="text-xs font-black uppercase text-[#FF4444] flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-[#FF4444]" />
          <span>Insiden Breakdown Membutuhkan RCA</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {breakdowns.map((brk) => {
            const ast = assets.find((a) => a.id === brk.assetId);

            return (
              <div key={brk.id} className="p-3 border border-[#141414] bg-[#F9F9F9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="mono-value text-xs text-[#141414]">{brk.breakdownNumber}</span>
                  <span className="mono-value text-xs text-[#FF4444]">{brk.repairTimeHours} HRS</span>
                </div>

                <h5 className="font-extrabold text-xs uppercase text-[#141414]">{ast?.equipmentCode} - {ast?.equipmentName}</h5>
                <p className="text-[10px] font-semibold text-[#141414]/70 line-clamp-1 uppercase">{brk.problemDescription}</p>

                <button
                  onClick={() => onOpenRcaForBreakdown(brk)}
                  className="w-full py-1 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
                >
                  Jalankan RCA 5-Why
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical RCA list */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-tight text-[#141414]">
          Arsip Dokumen RCA & Action Plan CAPA ({rcaList.length})
        </h3>

        <div className="space-y-3">
          {rcaList.map((rca) => {
            const ast = assets.find((a) => a.id === rca.assetId);

            return (
              <div key={rca.id} className="bg-white border border-[#141414] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-[#141414] pb-2">
                  <div>
                    <span className="mono-value text-xs text-[#141414]">{rca.id} • {rca.date}</span>
                    <h4 className="font-black text-xs uppercase text-[#141414]">{rca.title}</h4>
                    <p className="text-[10px] font-bold text-[#141414]/70">Unit: {ast?.equipmentCode} - {ast?.equipmentName}</p>
                  </div>

                  <span className="status-chip bg-white text-black">
                    CAPA: {rca.verificationStatus}
                  </span>
                </div>

                <div className="space-y-1 bg-[#E4E3E0] p-2 border border-[#141414]">
                  <span className="serif-label block">Hasil 5-Why Method</span>
                  <div className="space-y-1 text-xs">
                    {rca.fiveWhys.map((why, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[#141414] font-semibold">
                        <span className="mono-value text-[#141414] shrink-0">WHY #{idx + 1}:</span>
                        <span className="uppercase text-[11px]">{why}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 border border-[#141414] bg-white text-xs">
                  <span className="serif-label block">Root Cause Teridentifikasi</span>
                  <p className="font-extrabold uppercase text-[#141414]">{rca.rootCauseStatement}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
