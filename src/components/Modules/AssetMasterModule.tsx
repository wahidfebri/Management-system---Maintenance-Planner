import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Clock,
  Edit2
} from 'lucide-react';
import { Asset, WorkOrder, BreakdownReport } from '../../types/cmms';

interface AssetMasterModuleProps {
  assets: Asset[];
  workOrders: WorkOrder[];
  breakdowns: BreakdownReport[];
  onAddAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onUpdateMeter: (assetId: string) => void;
  searchQuery: string;
}

export const AssetMasterModule: React.FC<AssetMasterModuleProps> = ({
  assets,
  workOrders,
  breakdowns,
  onAddAsset,
  onEditAsset,
  onUpdateMeter,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);

  // Filter Assets
  const filteredAssets = assets.filter((ast) => {
    const matchesSearch =
      ast.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || ast.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || ast.currentStatus === selectedStatus;
    const matchesCriticality = selectedCriticality === 'ALL' || ast.criticality === selectedCriticality;

    return matchesSearch && matchesCategory && matchesStatus && matchesCriticality;
  });

  const activeAsset = selectedAsset || filteredAssets[0] || assets[0];

  const assetWorkOrders = workOrders.filter((w) => w.assetId === activeAsset?.id);
  const assetBreakdowns = breakdowns.filter((b) => b.assetId === activeAsset?.id);

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#141414]" />
            <span>Modul 2: Master Data Asset & Equipment</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pondasi database unit, spesifikasi teknis, HM/KM meter, status operasional, lokasi & dokumen
          </p>
        </div>

        <button
          onClick={onAddAsset}
          className="px-3.5 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-bold text-xs uppercase hover:bg-black transition-colors flex items-center space-x-1 shadow-[1px_1px_0px_#141414]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Asset</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#141414] p-3 flex flex-wrap items-center gap-3 text-xs font-bold">
        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Excavator">Excavator</option>
            <option value="Dump Truck">Dump Truck</option>
            <option value="Bulldozer">Bulldozer</option>
            <option value="Genset">Genset</option>
            <option value="Conveyor">Conveyor</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Status Unit:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="Running">Running</option>
            <option value="Standby">Standby</option>
            <option value="Breakdown">Breakdown</option>
            <option value="PM">PM</option>
            <option value="Overhaul">Overhaul</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Kritikalitas:</span>
          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Kritikalitas</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="text-[#141414] ml-auto mono-value text-xs uppercase">
          RESULT: {filteredAssets.length} UNITS
        </div>
      </div>

      {/* Main Grid: Catalog List + Asset Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Asset Catalog List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredAssets.map((ast) => {
              const isSelected = activeAsset?.id === ast.id;
              return (
                <div
                  key={ast.id}
                  onClick={() => setSelectedAsset(ast)}
                  className={`p-3 border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-[1px_1px_0px_#141414]'
                      : 'bg-white text-[#141414] border-[#141414] hover:bg-[#E4E3E0]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="mono-value text-sm">{ast.equipmentCode}</span>
                        <span className={`status-chip text-[9px] ${
                          ast.currentStatus === 'Running' ? 'bg-green-600 text-white' :
                          ast.currentStatus === 'Breakdown' ? 'bg-[#FF4444] text-white' :
                          'bg-yellow-400 text-black'
                        }`}>
                          {ast.currentStatus}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs uppercase mt-1">{ast.equipmentName}</h4>
                      <p className="text-[10px] font-semibold opacity-70">{ast.manufacturer} {ast.model} • SN: {ast.serialNumber}</p>
                    </div>

                    <div className="text-right">
                      <span className="mono-value text-xs">{ast.currentHM} HM</span>
                      <p className="text-[9px] font-bold opacity-70 uppercase">{ast.location.site}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Asset Card */}
        {activeAsset && (
          <div className="lg:col-span-7 bg-white border border-[#141414] p-5 space-y-5">
            
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#141414] pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="mono-value text-lg text-[#141414]">{activeAsset.equipmentCode}</span>
                  <span className={`status-chip ${
                    activeAsset.currentStatus === 'Running' ? 'bg-green-600 text-white' :
                    activeAsset.currentStatus === 'Breakdown' ? 'bg-[#FF4444] text-white' :
                    'bg-yellow-400 text-black'
                  }`}>
                    {activeAsset.currentStatus}
                  </span>
                  <span className="status-chip bg-white text-[#141414]">
                    {activeAsset.criticality} CRITICALITY
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase text-[#141414] mt-1">{activeAsset.equipmentName}</h3>
                <p className="text-xs font-semibold text-[#141414]/70">
                  {activeAsset.manufacturer} {activeAsset.model} • SN: {activeAsset.serialNumber} • ENG: {activeAsset.engineNumber}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateMeter(activeAsset.id)}
                  className="px-2.5 py-1 bg-white border border-[#141414] text-[#141414] text-xs font-bold uppercase hover:bg-[#E4E3E0]"
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  <span>HM/KM</span>
                </button>
                <button
                  onClick={() => onEditAsset(activeAsset)}
                  className="px-2.5 py-1 bg-[#141414] text-[#E4E3E0] border border-[#141414] text-xs font-bold uppercase hover:bg-black"
                >
                  <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#E4E3E0] p-3 border border-[#141414]">
              <div>
                <span className="serif-label block">Health Index</span>
                <span className="mono-value text-lg text-[#141414]">{activeAsset.healthIndexScore}%</span>
              </div>
              <div>
                <span className="serif-label block">Current Meter</span>
                <span className="mono-value text-lg text-[#141414]">{activeAsset.currentHM} HM</span>
              </div>
              <div>
                <span className="serif-label block">Current Distance</span>
                <span className="mono-value text-lg text-[#141414]">{activeAsset.currentKM} KM</span>
              </div>
              <div>
                <span className="serif-label block">Site Location</span>
                <span className="mono-value text-sm text-[#141414] uppercase">{activeAsset.location.site}</span>
              </div>
            </div>

            {/* History WO Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-tight text-[#141414] border-b border-[#141414] pb-1">
                Histori Work Order Unit ({assetWorkOrders.length})
              </h4>
              <div className="overflow-x-auto border border-[#141414]">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
                    <tr>
                      <th className="p-2 border-r border-[#E4E3E0]/20">WO Number</th>
                      <th className="p-2 border-r border-[#E4E3E0]/20">Tipe</th>
                      <th className="p-2 border-r border-[#E4E3E0]/20">Deskripsi</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141414]">
                    {assetWorkOrders.slice(0, 4).map((wo) => (
                      <tr key={wo.id} className="hover:bg-[#E4E3E0]">
                        <td className="p-2 border-r border-[#141414] mono-value">{wo.woNumber}</td>
                        <td className="p-2 border-r border-[#141414] font-bold">{wo.woType}</td>
                        <td className="p-2 border-r border-[#141414] uppercase text-[11px]">{wo.description}</td>
                        <td className="p-2 text-center">
                          <span className="status-chip bg-white text-black">{wo.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
