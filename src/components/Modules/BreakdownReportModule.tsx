import React from 'react';
import { AlertTriangle, Plus, GitPullRequest, Wrench } from 'lucide-react';
import { BreakdownReport, Asset } from '../../types/cmms';

interface BreakdownReportModuleProps {
  breakdowns: BreakdownReport[];
  assets: Asset[];
  onOpenNewBreakdown: () => void;
  onOpenRcaModal: (breakdown: BreakdownReport) => void;
  onCreateEmergencyWO: (breakdown: BreakdownReport) => void;
}

export const BreakdownReportModule: React.FC<BreakdownReportModuleProps> = ({
  breakdowns,
  assets,
  onOpenNewBreakdown,
  onOpenRcaModal,
  onCreateEmergencyWO
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#FF4444]" />
            <span>Modul 5: Controlling Breakdown Incident & Taksonomi Kegagalan</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pencatatan insiden unit mati, jam mulai & selesai downtime, taksonomi failure code & konversi ke WO Emergency
          </p>
        </div>

        <button
          onClick={onOpenNewBreakdown}
          className="px-3.5 py-1.5 bg-[#FF4444] text-white border border-[#141414] font-bold text-xs uppercase hover:bg-red-700 transition-colors shadow-[1px_1px_0px_#141414]"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          <span>+ Lapor Breakdown</span>
        </button>
      </div>

      {/* Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {breakdowns.map((brk) => {
          const ast = assets.find((a) => a.id === brk.assetId);

          return (
            <div
              key={brk.id}
              className="bg-white border border-[#141414] p-4 space-y-3"
            >
              <div className="flex items-start justify-between border-b border-[#141414] pb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="mono-value text-xs text-[#141414]">{brk.breakdownNumber}</span>
                    <span className="status-chip bg-white text-black">{brk.shift}</span>
                  </div>
                  <h4 className="font-extrabold text-xs uppercase text-[#141414] mt-1">
                    {ast?.equipmentCode} - {ast?.equipmentName}
                  </h4>
                </div>

                <span className="status-chip bg-[#FF4444] text-white">
                  {brk.failureCode}
                </span>
              </div>

              <div className="space-y-1 text-xs font-semibold">
                <span className="serif-label block">Problem Description</span>
                <p className="p-2 border border-[#141414] bg-[#E4E3E0] text-[11px] uppercase font-bold text-[#141414]">
                  {brk.problemDescription}
                </p>
                <p className="text-[10px] font-extrabold text-[#141414]">
                  Komponen: <span className="uppercase">{brk.componentFailure}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#141414] flex items-center justify-between">
                <div>
                  <span className="serif-label block">Downtime</span>
                  <span className="mono-value text-sm text-[#FF4444]">{brk.repairTimeHours} HRS</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onOpenRcaModal(brk)}
                    className="px-2 py-1 bg-white border border-[#141414] text-[10px] font-bold uppercase hover:bg-[#E4E3E0]"
                  >
                    <GitPullRequest className="w-3 h-3 inline mr-1" />
                    RCA
                  </button>
                  <button
                    onClick={() => onCreateEmergencyWO(brk)}
                    className="px-2 py-1 bg-[#141414] text-[#E4E3E0] border border-[#141414] text-[10px] font-bold uppercase hover:bg-black"
                  >
                    <Wrench className="w-3 h-3 inline mr-1" />
                    WO Emergency
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
