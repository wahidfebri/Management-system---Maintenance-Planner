import React from 'react';
import {
  LayoutDashboard,
  Truck,
  CalendarCheck,
  FileSpreadsheet,
  AlertOctagon,
  PackageCheck,
  Users,
  Timer,
  GitPullRequest,
  DollarSign,
  Calendar,
  LineChart,
  BarChart3,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { CmmsModuleId } from '../types/cmms';
import { ReliabilityKpiSummary } from '../types/cmms';

interface SidebarProps {
  activeModule: CmmsModuleId;
  onSelectModule: (module: CmmsModuleId) => void;
  kpis: ReliabilityKpiSummary;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  kpis
}) => {
  const menuItems: { id: CmmsModuleId; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeBg?: string }[] = [
    { id: 'dashboard', label: 'Modul 1: Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Modul 2: Master Asset', icon: Truck },
    { id: 'pm', label: 'Modul 3: Preventive Maint.', icon: CalendarCheck },
    {
      id: 'work_orders',
      label: 'Modul 4: Work Order',
      icon: FileSpreadsheet,
      badge: kpis.openWorkOrdersCount > 0 ? kpis.openWorkOrdersCount : undefined,
      badgeBg: 'bg-[#141414] text-white border border-[#141414]'
    },
    {
      id: 'breakdown',
      label: 'Modul 5: Breakdown Report',
      icon: AlertOctagon,
      badge: kpis.breakdownIncidentsCount > 0 ? kpis.breakdownIncidentsCount : undefined,
      badgeBg: 'bg-[#FF4444] text-white border border-[#141414]'
    },
    {
      id: 'spareparts',
      label: 'Modul 6: Sparepart & Stok',
      icon: PackageCheck,
      badge: kpis.lowStockPartsCount > 0 ? kpis.lowStockPartsCount : undefined,
      badgeBg: 'bg-yellow-400 text-black border border-[#141414]'
    },
    { id: 'manpower', label: 'Modul 7: Manpower & Mekanik', icon: Users },
    { id: 'downtime_rca', label: 'Modul 8-9: Downtime & RCA', icon: Timer },
    { id: 'cost', label: 'Modul 10: Cost Management', icon: DollarSign },
    { id: 'scheduler', label: 'Modul 11-12: Planning Calendar', icon: Calendar },
    { id: 'kpi_analytics', label: 'Modul 14: Reliability KPI Engine', icon: LineChart },
    { id: 'analytics_pareto', label: 'Modul 15: Analytics & Pareto', icon: BarChart3 },
    { id: 'reports', label: 'Modul 16: Laporan Otomatis', icon: FileText },
    { id: 'audit_trail', label: 'Audit Trail & Compliance', icon: ShieldAlert }
  ];

  return (
    <aside className="w-64 bg-white border-r-2 border-[#141414] text-[#141414] flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3 border-b border-[#141414] bg-[#87CEEB]/30 flex items-center justify-between">
        <span className="serif-label font-bold">Navigasi Modul CMMS</span>
        <span className="text-[10px] font-black uppercase px-1 bg-[#141414] text-[#87CEEB]">v4.2</span>
      </div>

      <nav className="flex-1 p-2 space-y-1.5 overflow-y-auto custom-scrollbar text-xs font-bold">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 transition-colors text-left uppercase text-[11px] tracking-tight ${
                isActive
                  ? 'bg-[#141414] text-[#87CEEB] border border-[#141414] shadow-[1px_1px_0px_#141414]'
                  : 'bg-white text-[#141414] border border-[#141414] hover:bg-[#141414] hover:text-[#87CEEB]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[9px] font-black px-1.5 py-0.2 shrink-0 ${item.badgeBg}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t-2 border-[#141414] bg-[#87CEEB]/30 text-[#141414] space-y-1 font-bold">
        <div className="flex items-center justify-between uppercase">
          <span className="serif-label">Compliance</span>
          <span className="mono-value text-xs text-[#141414]">ISO 55000</span>
        </div>
        <p className="text-[9px] uppercase opacity-80">Plant Maintenance & Reliability Platform</p>
      </div>
    </aside>
  );
};
