import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  Warehouse
} from 'lucide-react';
import { SparePart, InventoryTransaction } from '../../types/cmms';
import { formatCurrencyIDR } from '../../utils/kpiCalculator';

interface SparePartModuleProps {
  spareParts: SparePart[];
  inventoryTransactions: InventoryTransaction[];
  onOpenAddPart: () => void;
  onOpenStockTrx: (part: SparePart) => void;
  searchQuery: string;
}

export const SparePartModule: React.FC<SparePartModuleProps> = ({
  spareParts,
  inventoryTransactions,
  onOpenAddPart,
  onOpenStockTrx,
  searchQuery
}) => {
  const [activeTab, setActiveTab] = useState<'master' | 'transactions' | 'forecasting'>('master');

  const filteredParts = spareParts.filter((p) =>
    p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalInventoryValue = spareParts.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0);
  const lowStockCount = spareParts.filter((p) => p.currentStock <= p.reorderPoint).length;

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <Warehouse className="w-5 h-5 text-[#141414]" />
            <span>Modul 6 & 13: Controlling Spare Part, Material & Forecasting</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Manajemen persediaan gudang, ABC classification, Reorder Point (ROP), EOQ & analisis forecasting konsumsi
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-white border border-[#141414] p-0.5 flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('master')}
              className={`px-2.5 py-1 uppercase ${activeTab === 'master' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
            >
              Master Part
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-2.5 py-1 uppercase ${activeTab === 'transactions' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
            >
              Mutasi Stok
            </button>
            <button
              onClick={() => setActiveTab('forecasting')}
              className={`px-2.5 py-1 uppercase ${activeTab === 'forecasting' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
            >
              Forecasting
            </button>
          </div>

          <button
            onClick={onOpenAddPart}
            className="px-3.5 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-bold text-xs uppercase hover:bg-black transition-colors shadow-[1px_1px_0px_#141414]"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            <span>+ Sparepart</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Total Nilai Persediaan</span>
          <div className="text-lg mono-value text-[#141414]">{formatCurrencyIDR(totalInventoryValue)}</div>
        </div>
        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Part Kritis (Dibawah ROP)</span>
          <div className="text-lg mono-value text-[#FF4444]">{lowStockCount} ITEMS</div>
        </div>
        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Total SKU Katalog</span>
          <div className="text-lg mono-value text-[#141414]">{spareParts.length} ITEMS</div>
        </div>
      </div>

      {/* Content View Table */}
      {activeTab === 'master' && (
        <div className="overflow-x-auto border border-[#141414] bg-white">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
              <tr>
                <th className="p-2 border-r border-[#E4E3E0]/20">Part Number</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Nama Spare Part</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Kategori</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-center">Stok Saat Ini</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-center">ROP / Min Stock</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-right">Harga Satuan</th>
                <th className="p-2 text-center">Aksi Mutasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {filteredParts.map((part) => {
                const isBelowRop = part.currentStock <= part.reorderPoint;
                return (
                  <tr key={part.id} className="hover:bg-[#E4E3E0]">
                    <td className="p-2 border-r border-[#141414] mono-value font-bold">{part.partNumber}</td>
                    <td className="p-2 border-r border-[#141414] uppercase font-bold">{part.partName}</td>
                    <td className="p-2 border-r border-[#141414] uppercase">{part.category}</td>
                    <td className="p-2 border-r border-[#141414] text-center mono-value">
                      <span className={`status-chip ${isBelowRop ? 'bg-[#FF4444] text-white' : 'bg-white text-black'}`}>
                        {part.currentStock} {part.unitOfMeasure}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#141414] text-center mono-value">{part.reorderPoint}</td>
                    <td className="p-2 border-r border-[#141414] text-right mono-value">
                      {formatCurrencyIDR(part.unitPrice)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => onOpenStockTrx(part)}
                        className="px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-bold text-[10px] uppercase"
                      >
                        + Mutasi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="overflow-x-auto border border-[#141414] bg-white">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
              <tr>
                <th className="p-2 border-r border-[#E4E3E0]/20">Ref No</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Tipe Transaksi</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Part Name</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-center">Jumlah</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">WO Reference</th>
                <th className="p-2">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {inventoryTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#E4E3E0]">
                  <td className="p-2 border-r border-[#141414] mono-value">{trx.id}</td>
                  <td className="p-2 border-r border-[#141414]">
                    <span className={`status-chip ${trx.type === 'Purchase' || trx.type === 'Return' ? 'bg-green-600 text-white' : 'bg-[#FF4444] text-white'}`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="p-2 border-r border-[#141414] uppercase font-bold">{trx.partId}</td>
                  <td className="p-2 border-r border-[#141414] text-center mono-value">{trx.quantity}</td>
                  <td className="p-2 border-r border-[#141414] mono-value">{trx.referenceNo || '-'}</td>
                  <td className="p-2 uppercase">{trx.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'forecasting' && (
        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-tight text-[#141414]">Forecasting ROP & Order Point</h3>
          <p className="text-xs font-semibold text-[#141414]/70">
            Kalkulasi otomatis kebutuhan pemesanan berdasarkan konsumsi rata-rata bulanan dan lead time supplier.
          </p>
          <div className="overflow-x-auto border border-[#141414]">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
                <tr>
                  <th className="p-2 border-r border-[#E4E3E0]/20">Part Name</th>
                  <th className="p-2 border-r border-[#E4E3E0]/20">Lead Time (Hari)</th>
                  <th className="p-2 border-r border-[#E4E3E0]/20">Consumption Rate / Bln</th>
                  <th className="p-2 text-center">Rekomendasi Order (EOQ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {spareParts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#E4E3E0]">
                    <td className="p-2 border-r border-[#141414] font-bold uppercase">{p.partName}</td>
                    <td className="p-2 border-r border-[#141414] mono-value">{p.leadTimeDays} Hari</td>
                    <td className="p-2 border-r border-[#141414] mono-value">{p.monthlyConsumptionRate} Unit</td>
                    <td className="p-2 text-center mono-value text-[#141414]">
                      {p.monthlyConsumptionRate * 2} Unit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
