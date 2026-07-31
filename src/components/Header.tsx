import React from 'react';
import {
  Wrench,
  PlusCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  Search,
  BellRing
} from 'lucide-react';
import { UserRole } from '../types/cmms';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewWO: () => void;
  onOpenNewBreakdown: () => void;
  onOpenMeterLog: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  breakdownCount: number;
  lowStockCount: number;
}

const rolesList: UserRole[] = [
  'Admin',
  'Maintenance Planner',
  'Maintenance Supervisor',
  'Mechanic',
  'Warehouse',
  'Purchasing',
  'Production/Operation',
  'Manager',
  'Auditor'
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenNewWO,
  onOpenNewBreakdown,
  onOpenMeterLog,
  searchQuery,
  onSearchChange,
  breakdownCount,
  lowStockCount
}) => {
  return (
    <header className="bg-white border-b-2 border-[#141414] text-[#141414] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand & Site Info */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#141414] text-[#87CEEB] flex items-center justify-center font-black">
              <Wrench className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none text-[#141414]">MPRMS CMMS</h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#141414]/70">MAINTENANCE & RELIABILITY</p>
            </div>
          </div>

          <div className="hidden lg:block h-7 w-[2px] bg-[#141414]"></div>

          <div className="hidden lg:flex flex-col">
            <span className="serif-label">Current Site</span>
            <span className="text-xs font-extrabold uppercase tracking-tight">PIT ALPHA - EAST KALIMANTAN</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <Search className="w-3.5 h-3.5 text-[#141414] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari asset, WO, sparepart..."
            className="w-full bg-[#E4E3E0]/50 border border-[#141414] rounded-none pl-8 pr-3 py-1 text-xs text-[#141414] font-semibold placeholder-[#141414]/50 focus:outline-none focus:bg-white transition-colors"
          />
        </div>

        {/* Quick Action Buttons & Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          
          <button
            onClick={onOpenNewBreakdown}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#FF4444] text-white border border-[#141414] text-[11px] font-bold uppercase hover:bg-red-700 transition-colors shadow-[1px_1px_0px_#141414]"
            title="Lapor Kerusakan Baru"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Breakdown</span>
          </button>

          <button
            onClick={onOpenNewWO}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] text-[11px] font-bold uppercase hover:bg-black transition-colors shadow-[1px_1px_0px_#141414]"
            title="Buat Work Order Baru"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buat WO</span>
          </button>

          <button
            onClick={onOpenMeterLog}
            className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-[#141414] text-[#141414] text-[11px] font-bold uppercase hover:bg-[#E4E3E0] transition-colors"
            title="Update Meter HM/KM"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Update HM</span>
          </button>

          {/* Notifications Badge */}
          <div className="relative flex items-center p-1.5 bg-white border border-[#141414] text-[#141414]">
            <BellRing className="w-3.5 h-3.5" />
            {(breakdownCount > 0 || lowStockCount > 0) && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-[#FF4444] border border-[#141414] text-[9px] font-black text-white">
                {breakdownCount + lowStockCount}
              </span>
            )}
          </div>

          {/* User Role Selector */}
          <div className="flex items-center space-x-1 bg-white border border-[#141414] px-2 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-[#141414]" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-[#141414] font-bold text-[11px] uppercase focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r} value={r} className="bg-white text-[#141414]">
                  {r}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
