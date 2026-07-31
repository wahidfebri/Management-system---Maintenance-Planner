import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  ListFilter,
  Kanban
} from 'lucide-react';
import { WorkOrder, Asset, Mechanic, SparePart, WoStatus } from '../../types/cmms';
import { formatCurrencyIDR } from '../../utils/kpiCalculator';

interface WorkOrderModuleProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  mechanics: Mechanic[];
  spareParts: SparePart[];
  onOpenNewWO: () => void;
  onEditWO: (wo: WorkOrder) => void;
  onStatusChange: (woId: string, newStatus: WoStatus) => void;
  searchQuery: string;
}

export const WorkOrderModule: React.FC<WorkOrderModuleProps> = ({
  workOrders,
  assets,
  mechanics,
  spareParts,
  onOpenNewWO,
  onEditWO,
  onStatusChange,
  searchQuery
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [activeWO, setActiveWO] = useState<WorkOrder | null>(workOrders[0] || null);

  const filteredWOs = workOrders.filter((wo) => {
    const ast = assets.find((a) => a.id === wo.assetId);
    const matchesSearch =
      wo.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast?.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast?.equipmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || wo.woType === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || wo.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const kanbanColumns: WoStatus[] = [
    'Open',
    'Assigned',
    'In Progress',
    'Waiting Part',
    'Completed',
    'Closed'
  ];

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#141414]" />
            <span>Modul 4: Control Work Order & Workflow Lifecycle</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Mengontrol penerbitan WO, alokasi mekanik, ketersediaan sparepart, jam kerja & biaya perbaikan
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-white border border-[#141414] p-0.5 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 uppercase ${viewMode === 'list' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
            >
              <ListFilter className="w-3.5 h-3.5 inline mr-1" />
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 uppercase ${viewMode === 'kanban' ? 'bg-[#141414] text-[#E4E3E0]' : 'text-[#141414]'}`}
            >
              <Kanban className="w-3.5 h-3.5 inline mr-1" />
              Kanban
            </button>
          </div>

          <button
            onClick={onOpenNewWO}
            className="px-3.5 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-bold text-xs uppercase hover:bg-black transition-colors shadow-[1px_1px_0px_#141414]"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            <span>+ Buat WO</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#141414] p-3 flex flex-wrap items-center gap-3 text-xs font-bold">
        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Tipe WO:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Tipe</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Overhaul">Overhaul</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Status</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting Part">Waiting Part</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#E4E3E0] px-2.5 py-1 border border-[#141414]">
          <span className="serif-label">Prioritas:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-transparent text-[#141414] font-bold focus:outline-none uppercase text-xs"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="text-[#141414] ml-auto mono-value text-xs uppercase">
          RESULT: {filteredWOs.length} WORK ORDERS
        </div>
      </div>

      {/* List Mode View */}
      {viewMode === 'list' ? (
        <div className="overflow-x-auto border border-[#141414] bg-white">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
              <tr>
                <th className="p-2 border-r border-[#E4E3E0]/20">WO Number</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Equipment</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Tipe</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Deskripsi Pekerejaan</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Prioritas</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Status</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-right">Est. Cost</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {filteredWOs.map((wo) => {
                const ast = assets.find((a) => a.id === wo.assetId);
                return (
                  <tr key={wo.id} className="hover:bg-[#E4E3E0]">
                    <td className="p-2 border-r border-[#141414] mono-value font-bold">{wo.woNumber}</td>
                    <td className="p-2 border-r border-[#141414] uppercase font-bold">{ast?.equipmentCode}</td>
                    <td className="p-2 border-r border-[#141414] uppercase">{wo.woType}</td>
                    <td className="p-2 border-r border-[#141414] uppercase text-[11px]">{wo.description}</td>
                    <td className="p-2 border-r border-[#141414]">
                      <span className={`status-chip ${
                        wo.priority === 'Critical' ? 'bg-[#FF4444] text-white' : 'bg-white text-black'
                      }`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#141414]">
                      <select
                        value={wo.status}
                        onChange={(e) => onStatusChange(wo.id, e.target.value as WoStatus)}
                        className="bg-white border border-[#141414] text-[10px] font-bold uppercase p-0.5"
                      >
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting Part">Waiting Part</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-2 border-r border-[#141414] text-right mono-value">
                      {formatCurrencyIDR(wo.totalCost)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => onEditWO(wo)}
                        className="px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-bold text-[10px] uppercase"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {kanbanColumns.map((colStatus) => {
            const colWos = filteredWOs.filter((w) => w.status === colStatus);
            return (
              <div key={colStatus} className="bg-white border border-[#141414] p-2 space-y-2">
                <div className="p-1.5 bg-[#141414] text-[#E4E3E0] flex justify-between items-center text-[10px] font-bold uppercase">
                  <span>{colStatus}</span>
                  <span className="mono-value">{colWos.length}</span>
                </div>

                <div className="space-y-1.5">
                  {colWos.map((wo) => {
                    const ast = assets.find((a) => a.id === wo.assetId);
                    return (
                      <div key={wo.id} className="p-2 border border-[#141414] bg-[#F9F9F9] text-xs font-semibold space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="mono-value text-[10px]">{wo.woNumber}</span>
                          <span className="status-chip text-[8px] bg-white text-black">{wo.priority}</span>
                        </div>
                        <p className="font-extrabold uppercase text-[11px] leading-tight text-[#141414]">{wo.description}</p>
                        <p className="text-[10px] font-bold text-[#141414]/70 uppercase">Unit: {ast?.equipmentCode}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
