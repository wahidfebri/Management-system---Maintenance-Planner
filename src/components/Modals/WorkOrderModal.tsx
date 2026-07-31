import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, Mechanic, SparePart, WorkOrder, WoStatus } from '../../types/cmms';

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (wo: WorkOrder) => void;
  assets: Asset[];
  mechanics: Mechanic[];
  spareParts: SparePart[];
  existingWO?: WorkOrder | null;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assets,
  mechanics,
  spareParts,
  existingWO
}) => {
  const [formData, setFormData] = useState<Partial<WorkOrder>>(
    existingWO || {
      woNumber: `WO-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`,
      woDate: new Date().toISOString().slice(0, 10),
      woType: 'Corrective',
      priority: 'Medium',
      status: 'Open',
      assetId: assets[0]?.id || '',
      requester: 'Planning Team',
      planner: 'Sr. Maintenance Planner',
      supervisor: 'Field Supervisor',
      assignedMechanics: mechanics[0]?.id ? [mechanics[0].id] : [],
      description: '',
      scheduleStart: new Date().toISOString().slice(0, 10) + ' 08:00',
      scheduleFinish: new Date().toISOString().slice(0, 10) + ' 17:00',
      estimatedHours: 8,
      actualHours: 0,
      downtimeHours: 0,
      partsConsumed: [],
      laborCost: 1500000,
      materialCost: 0,
      vendorCost: 0,
      oilConsumableCost: 500000,
      totalCost: 2000000
    }
  );

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [selectedPartQty, setSelectedPartQty] = useState<number>(1);

  if (!isOpen) return null;

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const partObj = spareParts.find((p) => p.id === selectedPartId);
    if (!partObj) return;

    const currentParts = formData.partsConsumed || [];
    setFormData({
      ...formData,
      partsConsumed: [
        ...currentParts,
        {
          partId: partObj.id,
          partNumber: partObj.partNumber,
          partName: partObj.partName,
          quantityPlanned: selectedPartQty,
          quantityUsed: selectedPartQty,
          unitPrice: partObj.unitPrice
        }
      ]
    });
    setSelectedPartId('');
    setSelectedPartQty(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calcMaterialCost = (formData.partsConsumed || []).reduce(
      (sum, p) => sum + p.quantityUsed * p.unitPrice,
      0
    );

    const labor = Number(formData.laborCost) || 1500000;
    const vendor = Number(formData.vendorCost) || 0;
    const oil = Number(formData.oilConsumableCost) || 0;
    const sumTotal = labor + calcMaterialCost + vendor + oil;

    const newWo: WorkOrder = {
      id: existingWO?.id || `WO-${Date.now().toString().slice(-4)}`,
      woNumber: formData.woNumber || 'WO-000',
      woDate: formData.woDate || new Date().toISOString().slice(0, 10),
      woType: (formData.woType as any) || 'Corrective',
      priority: (formData.priority as any) || 'Medium',
      status: (formData.status as WoStatus) || 'Open',
      assetId: formData.assetId || assets[0]?.id || '',
      requester: formData.requester || 'Operations',
      planner: formData.planner || 'Planner',
      supervisor: formData.supervisor || 'Supervisor',
      assignedMechanics: formData.assignedMechanics || [],
      description: formData.description || 'Pekerjaan Maintenance',
      scheduleStart: formData.scheduleStart || '',
      scheduleFinish: formData.scheduleFinish || '',
      estimatedHours: Number(formData.estimatedHours) || 8,
      actualHours: Number(formData.actualHours) || 0,
      downtimeHours: Number(formData.downtimeHours) || 0,
      partsConsumed: formData.partsConsumed || [],
      laborCost: labor,
      materialCost: calcMaterialCost,
      vendorCost: vendor,
      oilConsumableCost: oil,
      totalCost: sumTotal
    };

    onSave(newWo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#141414]">
        
        {/* Header */}
        <div className="bg-[#141414] text-[#E4E3E0] p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>{existingWO ? 'Edit Work Order' : 'Buat Work Order Baru'}</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="serif-label block">Nomor Work Order</span>
              <input
                type="text"
                value={formData.woNumber || ''}
                onChange={(e) => setFormData({ ...formData, woNumber: e.target.value })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
                required
              />
            </div>

            <div>
              <span className="serif-label block">Equipment Target</span>
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
              <span className="serif-label block">Tipe Pekerjaan</span>
              <select
                value={formData.woType || 'Corrective'}
                onChange={(e) => setFormData({ ...formData, woType: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Breakdown">Breakdown</option>
                <option value="Overhaul">Overhaul</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>

            <div>
              <span className="serif-label block">Prioritas</span>
              <select
                value={formData.priority || 'Medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <span className="serif-label block">Deskripsi Pekerjaan</span>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-2 font-bold uppercase text-xs"
              rows={2}
              required
            />
          </div>

          {/* Spare Parts Allocation */}
          <div className="space-y-2 border-t border-[#141414] pt-3">
            <span className="serif-label block">Alokasi Spare Part</span>
            <div className="flex gap-2">
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="flex-1 bg-[#E4E3E0] border border-[#141414] p-1 font-bold uppercase"
              >
                <option value="">Pilih Part Katalog...</option>
                {spareParts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.partNumber} - {p.partName} (Stok: {p.currentStock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={selectedPartQty}
                onChange={(e) => setSelectedPartQty(Number(e.target.value))}
                className="w-16 bg-[#E4E3E0] border border-[#141414] p-1 mono-value"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-3 py-1 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase"
              >
                + Part
              </button>
            </div>

            <div className="space-y-1">
              {(formData.partsConsumed || []).map((p, idx) => (
                <div key={idx} className="p-1 border border-[#141414] bg-[#E4E3E0] flex justify-between text-[11px] font-bold">
                  <span>{p.partNumber} - {p.partName}</span>
                  <span className="mono-value">{p.quantityUsed} QTY</span>
                </div>
              ))}
            </div>
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
              className="px-4 py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
            >
              Simpan WO
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
