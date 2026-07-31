import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Gauge,
  LineChart,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Truck,
  Wrench
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { Asset, BreakdownReport, ReliabilityKpiSummary, WorkOrder, SparePart } from '../../types/cmms';
import { formatCurrencyIDR } from '../../utils/kpiCalculator';

interface DashboardModuleProps {
  kpis: ReliabilityKpiSummary;
  assets: Asset[];
  workOrders: WorkOrder[];
  breakdowns: BreakdownReport[];
  spareParts: SparePart[];
  onOpenNewWO: () => void;
  onOpenNewBreakdown: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  kpis,
  assets,
  workOrders,
  breakdowns,
  spareParts,
  onOpenNewWO,
  onOpenNewBreakdown
}) => {
  // Breakdown & Availability Trend Data
  const trendData = [
    { month: 'Jan', availability: 91.2, downtimeHours: 65, costMillion: 120, pmCompliance: 88 },
    { month: 'Feb', availability: 93.5, downtimeHours: 48, costMillion: 95, pmCompliance: 92 },
    { month: 'Mar', availability: 89.8, downtimeHours: 82, costMillion: 140, pmCompliance: 85 },
    { month: 'Apr', availability: 94.1, downtimeHours: 40, costMillion: 88, pmCompliance: 95 },
    { month: 'May', availability: 92.8, downtimeHours: 52, costMillion: 110, pmCompliance: 90 },
    { month: 'Jun', availability: 95.2, downtimeHours: 35, costMillion: 75, pmCompliance: 98 },
    { month: 'Jul', availability: kpis.pa, downtimeHours: kpis.totalDowntimeHours, costMillion: Math.round(kpis.totalMaintenanceCost / 1000000), pmCompliance: kpis.pmCompliance }
  ];

  // Top Breakdown Units
  const topBreakdownUnits = assets
    .map((ast) => {
      const astBreakdowns = breakdowns.filter((b) => b.assetId === ast.id);
      const totalDt = astBreakdowns.reduce((sum, b) => sum + (b.repairTimeHours || 0), 0);
      return {
        code: ast.equipmentCode,
        name: ast.equipmentName,
        category: ast.category,
        breakdownCount: astBreakdowns.length,
        downtimeHours: totalDt,
        status: ast.currentStatus
      };
    })
    .sort((a, b) => b.downtimeHours - a.downtimeHours);

  // Top Consumed Spareparts
  const topSpareparts = spareParts
    .map((p) => ({
      partNumber: p.partNumber,
      partName: p.partName,
      stock: p.currentStock,
      reorderPoint: p.reorderPoint,
      consumptionRate: p.monthlyConsumptionRate,
      totalCost: p.monthlyConsumptionRate * p.unitPrice
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  return (
    <div className="space-y-5">
      
      {/* Page Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#141414]" />
            <span>Modul 1: Dashboard Performa Maintenance & Reliability</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Monitoring kondisi unit real-time, ketersediaan fisik (PA, MA, UA), MTBF, MTTR & kontrol biaya
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenNewBreakdown}
            className="px-3 py-1.5 bg-[#FF4444] text-white border border-[#141414] font-bold text-xs uppercase hover:bg-red-700 transition-colors flex items-center space-x-1 shadow-[1px_1px_0px_#141414]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>+ Lapor Breakdown</span>
          </button>
          <button
            onClick={onOpenNewWO}
            className="px-3 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-bold text-xs uppercase hover:bg-black transition-colors flex items-center space-x-1 shadow-[1px_1px_0px_#141414]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>+ Work Order</span>
          </button>
        </div>
      </div>

      {/* Primary High-Density Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        
        {/* Unit Status */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Unit Aktif</span>
          <div className="text-xl mono-value text-[#141414]">
            {assets.filter((a) => a.currentStatus === 'Running').length} / {assets.length}
          </div>
          <span className="status-chip bg-[#141414] text-white block text-center">
            RUNNING NORMAL
          </span>
        </div>

        {/* Total Breakdown Hari Ini */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Breakdown Active</span>
          <div className="text-xl mono-value text-[#FF4444]">
            {assets.filter((a) => a.currentStatus === 'Breakdown').length} Unit
          </div>
          <span className="status-chip bg-[#FF4444] text-white block text-center">
            {kpis.totalBreakdowns} INCIDENTS
          </span>
        </div>

        {/* Physical Availability PA */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Physical Avail. (PA)</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.pa}%
          </div>
          <div className="w-full h-1 bg-[#141414]/20">
            <div className="h-full bg-[#141414]" style={{ width: `${Math.min(100, kpis.pa)}%` }}></div>
          </div>
        </div>

        {/* MA & UA */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Mech. Avail. (MA)</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.ma}%
          </div>
          <p className="text-[10px] font-bold text-[#141414]">
            UA: <span className="mono-value">{kpis.ua}%</span>
          </p>
        </div>

        {/* MTBF */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Reliability (MTBF)</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.mtbf} <span className="text-xs">HRS</span>
          </div>
          <p className="text-[9px] font-bold text-green-700">ISO 14224 CALC</p>
        </div>

        {/* MTTR */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Maintainability (MTTR)</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.mttr} <span className="text-xs">HRS</span>
          </div>
          <p className="text-[9px] font-bold text-red-600">REPAIR DURATION</p>
        </div>

        {/* PM Compliance */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">PM Compliance</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.pmCompliance}%
          </div>
          <p className="text-[9px] font-bold uppercase">{kpis.totalPmCompleted}/{kpis.totalPmScheduled} DONE</p>
        </div>

        {/* Schedule Compliance */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Sched. Compliance</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.scheduleCompliance}%
          </div>
          <p className="text-[9px] font-bold uppercase">WO ON-TIME</p>
        </div>

        {/* Backlog Maintenance */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Backlog WO</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.backlogWoCount} <span className="text-xs">WO</span>
          </div>
          <p className="text-[9px] font-bold text-amber-600 uppercase">PENDING JOBS</p>
        </div>

        {/* Total Cost YTD */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Total Maint. Cost</span>
          <div className="text-sm mono-value text-[#141414] truncate">
            {formatCurrencyIDR(kpis.totalMaintenanceCost)}
          </div>
          <p className="text-[9px] font-bold uppercase">PARTS + LABOR + VENDOR</p>
        </div>

        {/* Low Stock Alert */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Stok Kritis</span>
          <div className="text-xl mono-value text-[#FF4444]">
            {kpis.lowStockPartsCount} <span className="text-xs">ITEMS</span>
          </div>
          <span className="status-chip bg-yellow-400 text-black block text-center">BELOW ROP</span>
        </div>

        {/* Active Work Orders */}
        <div className="p-3 bg-white border border-[#141414] space-y-1">
          <span className="serif-label block">Open WO Total</span>
          <div className="text-xl mono-value text-[#141414]">
            {kpis.openWorkOrdersCount} <span className="text-xs">WO</span>
          </div>
          <span className="status-chip bg-[#141414] text-white block text-center">IN PROGRESS</span>
        </div>

      </div>

      {/* Main Analytical Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Downtime Trend & Cost Analysis */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Availability & Downtime Trend Chart */}
          <div className="bg-white border border-[#141414] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#141414] pb-2">
              <h3 className="text-xs font-black uppercase tracking-tight text-[#141414] flex items-center space-x-2">
                <LineChart className="w-4 h-4 text-[#141414]" />
                <span>Tren Ketersediaan Fisik (PA %) & Jam Downtime YTD</span>
              </h3>
              <span className="status-chip bg-white text-[#141414]">MONTHLY PERFORMANCE</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#141414" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#141414" fontSize={11} fontWeight="bold" />
                  <YAxis stroke="#141414" fontSize={11} fontWeight="bold" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141414',
                      color: '#E4E3E0',
                      border: '1px solid #141414',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area type="monotone" dataKey="availability" name="Availability PA (%)" stroke="#141414" fill="#141414" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="downtimeHours" name="Downtime (Jam)" stroke="#FF4444" fill="#FF4444" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Breakdown Equipment Table */}
          <div className="bg-white border border-[#141414] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#141414] pb-2">
              <h3 className="text-xs font-black uppercase tracking-tight text-[#141414] flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#141414]" />
                <span>Equipment dengan Jam Downtime Tertinggi</span>
              </h3>
              <span className="serif-label">Pareto Analysis</span>
            </div>

            <div className="overflow-x-auto border border-[#141414]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-2 border-r border-[#E4E3E0]/20">Kode Unit</th>
                    <th className="p-2 border-r border-[#E4E3E0]/20">Equipment Name</th>
                    <th className="p-2 border-r border-[#E4E3E0]/20">Insiden</th>
                    <th className="p-2 border-r border-[#E4E3E0]/20 text-right">Downtime (Jam)</th>
                    <th className="p-2 text-center">Status Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414] text-[#141414] font-semibold">
                  {topBreakdownUnits.slice(0, 5).map((unit, idx) => (
                    <tr key={idx} className="hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
                      <td className="p-2 border-r border-[#141414] mono-value">{unit.code}</td>
                      <td className="p-2 border-r border-[#141414] uppercase">{unit.name}</td>
                      <td className="p-2 border-r border-[#141414] mono-value">{unit.breakdownCount}x</td>
                      <td className="p-2 border-r border-[#141414] text-right mono-value text-red-600 font-extrabold">
                        {unit.downtimeHours} HRS
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`status-chip ${
                            unit.status === 'Running'
                              ? 'bg-green-100 text-green-900 border-green-800'
                              : unit.status === 'Breakdown'
                              ? 'bg-[#FF4444] text-white'
                              : 'bg-yellow-400 text-black'
                          }`}
                        >
                          {unit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Active Work Orders Feed & Inventory Alerts */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Work Orders Feed */}
          <div className="bg-white border border-[#141414] flex flex-col">
            <div className="p-3 bg-[#141414] text-[#E4E3E0] flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">Active Work Orders</h3>
              <span className="text-[10px] mono-value">{workOrders.length} TOTAL</span>
            </div>

            <div className="p-2 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {workOrders.slice(0, 5).map((wo) => {
                const isCritical = wo.priority === 'Critical' || wo.woType === 'Breakdown';
                return (
                  <div
                    key={wo.id}
                    className="border border-[#141414] p-2 bg-white hover:bg-[#E4E3E0] transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] mono-value">{wo.woNumber}</span>
                      <span
                        className={`status-chip text-[9px] ${
                          isCritical ? 'bg-[#FF4444] text-white' : 'bg-[#141414] text-white'
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold uppercase leading-tight mt-1 text-[#141414]">
                      {wo.description}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#141414]/70 mt-1">
                      <span>Status: {wo.status}</span>
                      <span className="mono-value">{wo.scheduleStart}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inventory Critical Stock Alerts */}
          <div className="bg-white border border-[#141414] p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-[#141414] pb-1">
              <h3 className="text-xs font-black uppercase tracking-tight text-[#141414]">Inventory Alerts</h3>
              <span className="status-chip bg-yellow-400 text-black">MIN STOCK</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {topSpareparts.slice(0, 4).map((part, idx) => (
                <div key={idx} className="p-2 border border-[#141414] bg-[#F9F9F9] flex justify-between items-center text-xs">
                  <div>
                    <span className="mono-value block text-[10px] text-[#141414]">{part.partNumber}</span>
                    <span className="font-extrabold uppercase text-[#141414] line-clamp-1">{part.partName}</span>
                  </div>
                  <div className="text-right">
                    <span className={`mono-value block text-xs ${part.stock <= part.reorderPoint ? 'text-red-600' : 'text-[#141414]'}`}>
                      {part.stock} UNIT
                    </span>
                    <span className="text-[9px] font-bold text-[#141414]/60">ROP: {part.reorderPoint}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
