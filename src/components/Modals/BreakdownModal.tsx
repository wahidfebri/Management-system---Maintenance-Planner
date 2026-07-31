import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, BreakdownReport, FailureCode } from '../../types/cmms';

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (breakdown: BreakdownReport, createWo: boolean) => void;
  assets: Asset[];
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assets
}) => {
  const [formData, setFormData] = useState<Partial<BreakdownReport>>({
    breakdownNumber: `BRK-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(10 + Math.random() * 90)}`,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    assetId: assets[0]?.id || '',
    currentHM: assets[0]?.currentHM || 1000,
    operatorName: 'Operator Pit',
    shift: 'Shift 1',
    location: assets[0]?.location.area || 'Pit Area',
    problemDescription: '',
    failureCode: 'Mechanical',
    failureMode: 'Noise & Overheating',
    failureCause: 'Fatigue & Wear',
    componentFailure: 'Main Pump / Cylinder',
    temporaryAction: 'Isolated unit and towed to Workshop',
    permanentAction: 'Replace component and overhaul system',
    downtimeStart: `${new Date().toISOString().slice(0, 10)} ${new Date().toTimeString().slice(0, 5)}`,
    repairTimeHours: 4,
    status: 'Reported'
  });

  const [autoCreateWO, setAutoCreateWO] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: BreakdownReport = {
      id: `BRK-${Date.now().toString().slice(-4)}`,
      breakdownNumber: formData.breakdownNumber || `BRK-${Date.now()}`,
      date: formData.date || new Date().toISOString().slice(0, 10),
      time: formData.time || new Date().toTimeString().slice(0, 5),
      assetId: formData.assetId || assets[0]?.id || '',
      currentHM: Number(formData.currentHM) || 0,
      operatorName: formData.operatorName || 'Operator',
      shift: formData.shift || 'Shift 1',
      location: formData.location || 'Site Area',
      problemDescription: formData.problemDescription || 'Breakdown reported',
      failureCode: (formData.failureCode as FailureCode) || 'Mechanical',
      failureMode: formData.failureMode || 'Component Failure',
      failureCause: formData.failureCause || 'Under Investigation',
      componentFailure: formData.componentFailure || 'Unspecified Component',
      temporaryAction: formData.temporaryAction || 'Unit Stopped',
      permanentAction: formData.permanentAction || 'Work Order Dispatched',
      downtimeStart: formData.downtimeStart || new Date().toISOString().slice(0, 16),
      repairTimeHours: Number(formData.repairTimeHours) || 2,
      status: 'Reported'
    };

    onSave(newReport, autoCreateWO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#141414]">
        
        {/* Header */}
        <div className="bg-[#FF4444] text-white p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>Laporan Kerusakan Unit (Breakdown Incident)</span>
          <button onClick={onClose} className="hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="serif-label block">No Breakdown</span>
              <input
                type="text"
                value={formData.breakdownNumber || ''}
                onChange={(e) => setFormData({ ...formData, breakdownNumber: e.target.value })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
                required
              />
            </div>

            <div>
              <span className="serif-label block">Equipment Unit</span>
              <select
                value={formData.assetId || ''}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.equipmentCode} - {a.equipmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="serif-label block">Current Meter (HM)</span>
              <input
                type="number"
                value={formData.currentHM || 0}
                onChange={(e) => setFormData({ ...formData, currentHM: Number(e.target.value) })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
              />
            </div>

            <div>
              <span className="serif-label block">Taksonomi Failure Code</span>
              <select
                value={formData.failureCode || 'Mechanical'}
                onChange={(e) => setFormData({ ...formData, failureCode: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Hydraulic">Hydraulic</option>
                <option value="Pneumatic">Pneumatic</option>
                <option value="Engine">Engine</option>
                <option value="Transmission">Transmission</option>
                <option value="Structural">Structural</option>
                <option value="Tyre/Track">Tyre / Track</option>
              </select>
            </div>
          </div>

          <div>
            <span className="serif-label block">Deskripsi Masalah / Kerusakan</span>
            <textarea
              value={formData.problemDescription || ''}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-2 font-bold uppercase text-xs"
              rows={2}
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-[#141414]">
            <input
              type="checkbox"
              id="autoWO"
              checked={autoCreateWO}
              onChange={(e) => setAutoCreateWO(e.target.checked)}
              className="w-4 h-4 accent-[#141414]"
            />
            <label htmlFor="autoWO" className="serif-label cursor-pointer font-bold uppercase">
              Otomatis Terbitkan Emergency Work Order (WO)
            </label>
          </div>

          <div className="pt-3 border-t border-[#141414] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-[#141414] text-[#141414] font-bold text-xs uppercase"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#FF4444] text-white font-bold text-xs uppercase hover:bg-red-700"
            >
              Laporkan Breakdown
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
