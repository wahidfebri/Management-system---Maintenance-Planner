import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SparePart, InventoryTransaction } from '../../types/cmms';

interface SparePartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePart: (part: SparePart) => void;
  onSaveTransaction: (trx: InventoryTransaction) => void;
  existingPart?: SparePart | null;
  mode: 'add' | 'edit' | 'transaction';
}

export const SparePartModal: React.FC<SparePartModalProps> = ({
  isOpen,
  onClose,
  onSavePart,
  onSaveTransaction,
  existingPart,
  mode
}) => {
  const [partData, setPartData] = useState<Partial<SparePart>>(
    existingPart || {
      partNumber: '',
      partName: '',
      category: 'General',
      oem: 'Caterpillar',
      supplier: 'PT Utama',
      warehouseLocation: 'WH-01-A1',
      unitOfMeasure: 'Pcs',
      minimumStock: 2,
      maximumStock: 10,
      safetyStock: 2,
      currentStock: 5,
      leadTimeDays: 14,
      unitPrice: 1500000,
      lastPurchaseDate: new Date().toISOString().slice(0, 10),
      abcClassification: 'A',
      isCriticalSpare: true,
      reorderPoint: 3,
      eoq: 5,
      monthlyConsumptionRate: 1
    }
  );

  const [trxType, setTrxType] = useState<InventoryTransaction['type']>('Issue');
  const [trxQty, setTrxQty] = useState<number>(1);
  const [trxRef, setTrxRef] = useState<string>('WO-MANUAL');

  if (!isOpen) return null;

  const handlePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPart: SparePart = {
      id: existingPart?.id || `PART-${Date.now().toString().slice(-4)}`,
      partNumber: partData.partNumber || 'PN-NEW',
      partName: partData.partName || 'New Sparepart Item',
      category: partData.category || 'General',
      oem: partData.oem || 'OEM Supplier',
      supplier: partData.supplier || 'Vendor Utama',
      warehouseLocation: partData.warehouseLocation || 'WH-01',
      unitOfMeasure: partData.unitOfMeasure || 'Pcs',
      minimumStock: Number(partData.minimumStock) || 1,
      maximumStock: Number(partData.maximumStock) || 10,
      safetyStock: Number(partData.safetyStock) || 1,
      currentStock: Number(partData.currentStock) || 5,
      leadTimeDays: Number(partData.leadTimeDays) || 7,
      unitPrice: Number(partData.unitPrice) || 500000,
      lastPurchaseDate: partData.lastPurchaseDate || new Date().toISOString().slice(0, 10),
      abcClassification: partData.abcClassification || 'B',
      isCriticalSpare: partData.isCriticalSpare ?? false,
      reorderPoint: Number(partData.reorderPoint) || 2,
      eoq: Number(partData.eoq) || 4,
      monthlyConsumptionRate: Number(partData.monthlyConsumptionRate) || 1
    };
    onSavePart(newPart);
    onClose();
  };

  const handleTrxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingPart) return;

    const newTrx: InventoryTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      partId: existingPart.id,
      date: new Date().toISOString().slice(0, 10),
      type: trxType,
      quantity: Number(trxQty),
      referenceNo: trxRef || 'MANUAL-ADJ',
      user: 'Warehouse Staff',
      unitPrice: existingPart.unitPrice,
      notes: 'Mutasi persediaan gudang'
    };

    onSaveTransaction(newTrx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#141414]">
        
        {/* Header */}
        <div className="bg-[#141414] text-[#E4E3E0] p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>{mode === 'transaction' ? 'Mutasi Stok Gudang' : 'Spare Part Master Item'}</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === 'transaction' ? (
          <form onSubmit={handleTrxSubmit} className="p-4 space-y-3 text-xs font-semibold">
            <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
              <span className="serif-label block">Target Part</span>
              <p className="font-extrabold uppercase text-[#141414]">{existingPart?.partNumber} - {existingPart?.partName}</p>
            </div>

            <div>
              <span className="serif-label block">Tipe Mutasi</span>
              <select
                value={trxType}
                onChange={(e) => setTrxType(e.target.value as any)}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Issue">Issue (Pengeluaran WO)</option>
                <option value="Return">Return (Pengembalian)</option>
                <option value="Purchase">Purchase (Penerimaan PO)</option>
                <option value="Transfer">Transfer</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Stock Opname">Stock Opname</option>
              </select>
            </div>

            <div>
              <span className="serif-label block">Jumlah / Quantity</span>
              <input
                type="number"
                min="1"
                value={trxQty}
                onChange={(e) => setTrxQty(Number(e.target.value))}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
                required
              />
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
                Simpan Mutasi
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePartSubmit} className="p-4 overflow-y-auto space-y-3 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="serif-label block">Part Number</span>
                <input
                  type="text"
                  value={partData.partNumber || ''}
                  onChange={(e) => setPartData({ ...partData, partNumber: e.target.value })}
                  className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value uppercase"
                  required
                />
              </div>

              <div>
                <span className="serif-label block">Nama Part</span>
                <input
                  type="text"
                  value={partData.partName || ''}
                  onChange={(e) => setPartData({ ...partData, partName: e.target.value })}
                  className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
                  required
                />
              </div>

              <div>
                <span className="serif-label block">Stok Saat Ini</span>
                <input
                  type="number"
                  value={partData.currentStock || 0}
                  onChange={(e) => setPartData({ ...partData, currentStock: Number(e.target.value) })}
                  className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
                />
              </div>

              <div>
                <span className="serif-label block">Reorder Point (ROP)</span>
                <input
                  type="number"
                  value={partData.reorderPoint || 0}
                  onChange={(e) => setPartData({ ...partData, reorderPoint: Number(e.target.value) })}
                  className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
                />
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
                Simpan Part
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
