import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { Asset, PmSchedule, PmChecklistItem } from '../../types/cmms';

interface PreventiveMaintenanceModuleProps {
  pmSchedules: PmSchedule[];
  assets: Asset[];
  onExecutePmChecklist: (pmId: string, updatedChecklists: PmChecklistItem[], autoCreateWo: boolean) => void;
}

export const PreventiveMaintenanceModule: React.FC<PreventiveMaintenanceModuleProps> = ({
  pmSchedules,
  assets,
  onExecutePmChecklist
}) => {
  const [selectedPmId, setSelectedPmId] = useState<string>(pmSchedules[0]?.id || '');
  const activePm = pmSchedules.find((p) => p.id === selectedPmId) || pmSchedules[0];
  const activeAsset = assets.find((a) => a.id === activePm?.assetId);

  const [activeChecklists, setActiveChecklists] = useState<PmChecklistItem[]>(
    activePm?.checklists || []
  );

  const handleSelectPm = (pm: PmSchedule) => {
    setSelectedPmId(pm.id);
    setActiveChecklists(pm.checklists);
  };

  const handleChecklistStatusChange = (
    itemIdx: number,
    newStatus: 'Pass' | 'Need Repair' | 'Need Replacement' | 'Observation',
    notes?: string
  ) => {
    const updated = [...activeChecklists];
    updated[itemIdx] = {
      ...updated[itemIdx],
      status: newStatus,
      notes: notes !== undefined ? notes : updated[itemIdx].notes
    };
    setActiveChecklists(updated);
  };

  const handleSaveExecution = () => {
    if (!activePm) return;
    const hasIssues = activeChecklists.some(
      (c) => c.status === 'Need Repair' || c.status === 'Need Replacement'
    );
    onExecutePmChecklist(activePm.id, activeChecklists, hasIssues);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-[#141414]" />
            <span>Modul 3: Preventive Maintenance (PM System)</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Penjadwalan PM berkala (HM/KM/Date), eksekusi checklist dinamis, dan pemeliharaan terencana
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* PM Master Schedules List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="p-2 bg-[#141414] text-[#E4E3E0] font-black text-xs uppercase">
            Master PM Schedule ({pmSchedules.length})
          </div>

          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {pmSchedules.map((pm) => {
              const ast = assets.find((a) => a.id === pm.assetId);
              const isSelected = activePm?.id === pm.id;

              return (
                <div
                  key={pm.id}
                  onClick={() => handleSelectPm(pm)}
                  className={`p-3 border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-[1px_1px_0px_#141414]'
                      : 'bg-white text-[#141414] border-[#141414] hover:bg-[#E4E3E0]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="mono-value text-xs">{pm.pmCode}</span>
                        <span className="status-chip bg-white text-black">{pm.intervalType}</span>
                      </div>
                      <h4 className="font-extrabold text-xs uppercase mt-1">{pm.title}</h4>
                      <p className="text-[10px] font-semibold opacity-70">Unit: {ast?.equipmentCode} - {ast?.equipmentName}</p>
                    </div>

                    <div className="text-right">
                      <span className="status-chip bg-[#FF4444] text-white">{pm.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PM Checklist Executor */}
        {activePm && (
          <div className="lg:col-span-7 bg-white border border-[#141414] p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#141414] pb-3">
              <div>
                <span className="mono-value text-xs text-[#141414]">{activePm.pmCode}</span>
                <h3 className="text-base font-black uppercase text-[#141414]">{activePm.title}</h3>
                <p className="text-xs font-bold text-[#141414]/70">Unit Target: {activeAsset?.equipmentCode} • {activeAsset?.equipmentName}</p>
              </div>

              <button
                onClick={handleSaveExecution}
                className="px-4 py-2 bg-[#141414] text-[#E4E3E0] border border-[#141414] text-xs font-black uppercase hover:bg-black shadow-[1px_1px_0px_#141414]"
              >
                Simpan & Selesaikan PM
              </button>
            </div>

            {/* Checklist items table */}
            <div className="overflow-x-auto border border-[#141414]">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
                  <tr>
                    <th className="p-2 border-r border-[#E4E3E0]/20">No</th>
                    <th className="p-2 border-r border-[#E4E3E0]/20">Kategori</th>
                    <th className="p-2 border-r border-[#E4E3E0]/20">Task Standard</th>
                    <th className="p-2 text-center">Status Checklist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]">
                  {activeChecklists.map((chk, idx) => (
                    <tr key={chk.id || idx} className="hover:bg-[#E4E3E0]">
                      <td className="p-2 border-r border-[#141414] mono-value text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-[#141414] font-bold uppercase">{chk.category}</td>
                      <td className="p-2 border-r border-[#141414] text-[11px]">{chk.taskName}</td>
                      <td className="p-2 text-center">
                        <select
                          value={chk.status}
                          onChange={(e) => handleChecklistStatusChange(idx, e.target.value as any)}
                          className="bg-white border border-[#141414] text-[11px] font-bold uppercase p-1"
                        >
                          <option value="Pass">Pass</option>
                          <option value="Need Repair">Need Repair</option>
                          <option value="Need Replacement">Need Replacement</option>
                          <option value="Observation">Observation</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
