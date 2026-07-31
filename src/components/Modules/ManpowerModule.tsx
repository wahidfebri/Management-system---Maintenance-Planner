import React from 'react';
import { User } from 'lucide-react';
import { Mechanic, WorkOrder } from '../../types/cmms';
import { formatCurrencyIDR } from '../../utils/kpiCalculator';

interface ManpowerModuleProps {
  mechanics: Mechanic[];
  workOrders: WorkOrder[];
}

export const ManpowerModule: React.FC<ManpowerModuleProps> = ({ mechanics, workOrders }) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <User className="w-5 h-5 text-[#141414]" />
            <span>Modul 7: Controlling Manpower, Skill Matrix & Hourly Rate</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pencatatan keahlian mekanik, alokasi jam kerja efektif, sertifikasi & perhitungan labor cost per jam
          </p>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mechanics.map((mec) => {
          const mecWOs = workOrders.filter((w) => w.assignedMechanics.includes(mec.id) && w.status !== 'Closed');

          return (
            <div key={mec.id} className="bg-white border border-[#141414] p-4 space-y-3">
              <div className="flex items-start justify-between border-b border-[#141414] pb-2">
                <div>
                  <h4 className="font-black text-xs uppercase text-[#141414]">{mec.name}</h4>
                  <p className="text-[10px] font-bold text-[#141414]/70">{mec.shift} • NIK: {mec.employeeId}</p>
                </div>
                <span className={`status-chip ${mec.status === 'Available' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-black'}`}>
                  {mec.status}
                </span>
              </div>

              <div className="space-y-1">
                <span className="serif-label block">Skill Matrix</span>
                <div className="flex flex-wrap gap-1">
                  {mec.skills.map((s, idx) => (
                    <span key={idx} className="status-chip bg-[#E4E3E0] text-black">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#E4E3E0] p-2 border border-[#141414] text-xs">
                <div>
                  <span className="serif-label block">Sertifikasi</span>
                  <span className="mono-value text-xs text-[#141414]">{mec.certifications[0] || 'L1'}</span>
                </div>
                <div>
                  <span className="serif-label block">Hourly Rate</span>
                  <span className="mono-value text-xs text-[#141414]">{formatCurrencyIDR(mec.hourlyRate)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="serif-label block">Assigned Work Orders ({mecWOs.length})</span>
                <div className="space-y-1">
                  {mecWOs.map((w) => (
                    <div key={w.id} className="p-1 border border-[#141414] text-[10px] mono-value flex justify-between font-bold">
                      <span>{w.woNumber}</span>
                      <span>{w.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
