import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { PmSchedule, WorkOrder, Asset } from '../../types/cmms';

interface SchedulerModuleProps {
  pmSchedules: PmSchedule[];
  workOrders: WorkOrder[];
  assets: Asset[];
}

export const SchedulerModule: React.FC<SchedulerModuleProps> = ({ pmSchedules, assets }) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'shutdown'>('weekly');
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#141414]" />
            <span>Modul 11 & 12: Weekly/Monthly Scheduler & Major Shutdown Overhaul</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Penjadwalan mingguan terstruktur, alokasi manpower, serta manajemen shutdown major overhaul
          </p>
        </div>

        <div className="bg-white border border-[#141414] p-0.5 flex items-center text-xs font-bold">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-2.5 py-1 uppercase ${activeTab === 'weekly' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setActiveTab('shutdown')}
            className={`px-2.5 py-1 uppercase ${activeTab === 'shutdown' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
          >
            Major Shutdown
          </button>
        </div>
      </div>

      {activeTab === 'weekly' ? (
        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[#141414] pb-2">
            <h3 className="text-xs font-black uppercase text-[#141414]">Jadwal Pemeliharaan Mingguan</h3>
            <span className="mono-value text-xs text-[#141414]">WEEK 31 - 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => {
              const dayPms = pmSchedules.slice(idx % pmSchedules.length, (idx % pmSchedules.length) + 1);

              return (
                <div key={day} className="bg-[#E4E3E0] border border-[#141414] p-2 space-y-2 min-h-[160px]">
                  <span className="serif-label block border-b border-[#141414] pb-1 font-bold">
                    {day}
                  </span>

                  <div className="space-y-1">
                    {dayPms.map((pm) => {
                      const ast = assets.find((a) => a.id === pm.assetId);
                      return (
                        <div key={pm.id} className="p-1.5 bg-white border border-[#141414] text-[10px] space-y-0.5">
                          <span className="mono-value block font-bold text-[#141414]">{pm.pmCode}</span>
                          <p className="font-extrabold uppercase text-[#141414] truncate">{ast?.equipmentCode}</p>
                          <span className="status-chip text-[8px] bg-[#141414] text-white block text-center">{pm.intervalType}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h3 className="text-xs font-black uppercase text-[#141414]">Major Shutdown Overhaul Schedule</h3>
          <div className="p-3 border border-[#141414] bg-[#E4E3E0] space-y-2 text-xs">
            <span className="font-extrabold uppercase text-[#141414] block">PLANT OVERHAUL - Q3 2026</span>
            <p className="text-[11px] font-semibold text-[#141414]">Rencana mati total fasilitas produksi untuk penggantian komponen utama conveyor & engine overhaul excavator fleet.</p>
            <div className="flex gap-4 mono-value text-xs">
              <span>EST. DURATION: 72 HRS</span>
              <span>BUDGET: Rp 850.000.000</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
