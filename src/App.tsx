import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Modals
import { AssetModal } from './components/Modals/AssetModal';
import { WorkOrderModal } from './components/Modals/WorkOrderModal';
import { BreakdownModal } from './components/Modals/BreakdownModal';
import { SparePartModal } from './components/Modals/SparePartModal';
import { MeterReadingModal } from './components/Modals/MeterReadingModal';
import { RcaAssistantModal } from './components/Modals/RcaAssistantModal';

// Modules
import { DashboardModule } from './components/Modules/DashboardModule';
import { AssetMasterModule } from './components/Modules/AssetMasterModule';
import { PreventiveMaintenanceModule } from './components/Modules/PreventiveMaintenanceModule';
import { WorkOrderModule } from './components/Modules/WorkOrderModule';
import { BreakdownReportModule } from './components/Modules/BreakdownReportModule';
import { SparePartModule } from './components/Modules/SparePartModule';
import { ManpowerModule } from './components/Modules/ManpowerModule';
import { DowntimeRcaModule } from './components/Modules/DowntimeRcaModule';
import { CostManagementModule } from './components/Modules/CostManagementModule';
import { SchedulerModule } from './components/Modules/SchedulerModule';
import { ReliabilityKpiModule } from './components/Modules/ReliabilityKpiModule';
import { AnalyticsDashboardModule } from './components/Modules/AnalyticsDashboardModule';
import { AutomatedReportsModule } from './components/Modules/AutomatedReportsModule';
import { AuditTrailModule } from './components/Modules/AuditTrailModule';

// Seed Mock Data & Calculator
import {
  initialAssets,
  initialWorkOrders,
  initialBreakdownReports,
  initialPmSchedules,
  initialSpareParts,
  initialInventoryTransactions,
  initialMechanics,
  initialRcaAnalyses,
  initialAuditLogs
} from './data/mockCmmsData';

import {
  Asset,
  WorkOrder,
  BreakdownReport,
  PmSchedule,
  SparePart,
  InventoryTransaction,
  RcaAnalysis,
  AuditLog,
  CmmsModuleId,
  WoStatus,
  PmChecklistItem
} from './types/cmms';

import { calculateReliabilityKPIs } from './utils/kpiCalculator';

export function App() {
  // Navigation State
  const [currentModule, setCurrentModule] = useState<CmmsModuleId>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Data State
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [breakdowns, setBreakdowns] = useState<BreakdownReport[]>(initialBreakdownReports);
  const [pmSchedules, setPmSchedules] = useState<PmSchedule[]>(initialPmSchedules);
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSpareParts);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(initialInventoryTransactions);
  const [mechanics, setMechanics] = useState(initialMechanics);
  const [rcaList, setRcaList] = useState<RcaAnalysis[]>(initialRcaAnalyses);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Modal Control States
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [isWoModalOpen, setIsWoModalOpen] = useState(false);
  const [editingWo, setEditingWo] = useState<WorkOrder | null>(null);

  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [partModalMode, setPartModalMode] = useState<'add' | 'edit' | 'transaction'>('add');

  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);

  const [isRcaModalOpen, setIsRcaModalOpen] = useState(false);
  const [selectedBreakdownForRca, setSelectedBreakdownForRca] = useState<BreakdownReport | null>(null);

  // Recalculate Live KPIs
  const kpis = useMemo(() => {
    return calculateReliabilityKPIs(assets, workOrders, breakdowns, pmSchedules);
  }, [assets, workOrders, breakdowns, pmSchedules]);

  // Logging Audit Trail
  const addAuditLog = (action: string, moduleName: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'Sr. Maintenance Planner',
      userRole: 'Auditor',
      action,
      module: moduleName,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers for Asset CRUD
  const handleSaveAsset = (savedAsset: Asset) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === savedAsset.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedAsset;
        return updated;
      }
      return [savedAsset, ...prev];
    });
    addAuditLog('SAVE_ASSET', 'Asset Master', `Menyimpan asset ${savedAsset.equipmentCode} - ${savedAsset.equipmentName}`);
  };

  // Handlers for Work Order CRUD
  const handleSaveWO = (savedWO: WorkOrder) => {
    setWorkOrders((prev) => {
      const idx = prev.findIndex((w) => w.id === savedWO.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedWO;
        return updated;
      }
      return [savedWO, ...prev];
    });

    // Automatically update asset status if breakdown WO
    if (savedWO.woType === 'Breakdown' || savedWO.priority === 'Critical') {
      setAssets((prev) =>
        prev.map((a) => (a.id === savedWO.assetId ? { ...a, currentStatus: 'Breakdown' } : a))
      );
    }
    addAuditLog('SAVE_WO', 'Work Order', `Menyimpan Work Order ${savedWO.woNumber}`);
  };

  const handleWoStatusChange = (woId: string, newStatus: WoStatus) => {
    setWorkOrders((prev) =>
      prev.map((w) => (w.id === woId ? { ...w, status: newStatus } : w))
    );
    addAuditLog('UPDATE_WO_STATUS', 'Work Order', `Mengubah status WO #${woId} menjadi ${newStatus}`);
  };

  // Handlers for Breakdown Incident
  const handleSaveBreakdown = (newReport: BreakdownReport, createWo: boolean) => {
    setBreakdowns((prev) => {
      const idx = prev.findIndex((b) => b.id === newReport.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newReport;
        return updated;
      }
      return [newReport, ...prev];
    });

    // Set asset to breakdown
    setAssets((prev) =>
      prev.map((a) => (a.id === newReport.assetId ? { ...a, currentStatus: 'Breakdown' } : a))
    );

    if (createWo) {
      const autoWo: WorkOrder = {
        id: `WO-${Date.now().toString().slice(-4)}`,
        woNumber: `WO-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`,
        woDate: new Date().toISOString().slice(0, 10),
        woType: 'Breakdown',
        priority: 'Critical',
        status: 'Open',
        assetId: newReport.assetId,
        requester: newReport.operatorName,
        planner: 'Auto System',
        supervisor: 'Field Supervisor',
        assignedMechanics: mechanics[0]?.id ? [mechanics[0].id] : [],
        description: `EMERGENCY BREAKDOWN: ${newReport.problemDescription}`,
        scheduleStart: `${newReport.date} ${newReport.time}`,
        scheduleFinish: `${newReport.date} 23:59`,
        estimatedHours: newReport.repairTimeHours || 4,
        actualHours: newReport.repairTimeHours || 0,
        downtimeHours: newReport.repairTimeHours || 0,
        partsConsumed: [],
        laborCost: 1500000,
        materialCost: 0,
        vendorCost: 0,
        oilConsumableCost: 500000,
        totalCost: 2000000
      };
      setWorkOrders((prev) => [autoWo, ...prev]);
    }

    addAuditLog('REPORT_BREAKDOWN', 'Breakdown Incident', `Insiden breakdown #${newReport.breakdownNumber}`);
  };

  // Handlers for Sparepart & Inventory
  const handleSaveSparePart = (savedPart: SparePart) => {
    setSpareParts((prev) => {
      const idx = prev.findIndex((p) => p.id === savedPart.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedPart;
        return updated;
      }
      return [savedPart, ...prev];
    });
    addAuditLog('SAVE_SPAREPART', 'Inventory', `Menyimpan part number ${savedPart.partNumber}`);
  };

  const handleSaveTransaction = (trx: InventoryTransaction) => {
    setInventoryTransactions((prev) => [trx, ...prev]);

    // Update stock in master
    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === trx.partId) {
          let newStock = p.currentStock;
          if (trx.type === 'Issue') newStock = Math.max(0, p.currentStock - trx.quantity);
          if (trx.type === 'Purchase' || trx.type === 'Return') newStock = p.currentStock + trx.quantity;
          return { ...p, currentStock: newStock };
        }
        return p;
      })
    );
    addAuditLog('STOCK_MUTATION', 'Inventory', `Mutasi stok ${trx.type} untuk part #${trx.partId}`);
  };

  // Handlers for Meter Reading Log
  const handleUpdateMeter = (assetId: string, newHM: number, newKM: number) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, currentHM: newHM, currentKM: newKM } : a))
    );
    addAuditLog('UPDATE_METER', 'Asset Master', `Update meter reading HM: ${newHM}`);
  };

  // Handlers for PM Checklist Execution
  const handleExecutePmChecklist = (pmId: string, updatedChecklists: PmChecklistItem[], autoCreateWo: boolean) => {
    setPmSchedules((prev) =>
      prev.map((p) => (p.id === pmId ? { ...p, checklists: updatedChecklists, status: 'Completed' } : p))
    );

    if (autoCreateWo) {
      const failedItems = updatedChecklists.filter(
        (c) => c.status === 'Need Repair' || c.status === 'Need Replacement'
      );
      const pmObj = pmSchedules.find((p) => p.id === pmId);

      const correctiveWo: WorkOrder = {
        id: `WO-${Date.now().toString().slice(-4)}`,
        woNumber: `WO-${new Date().toISOString().slice(2, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`,
        woDate: new Date().toISOString().slice(0, 10),
        woType: 'CM',
        priority: 'High',
        status: 'Open',
        assetId: pmObj?.assetId || assets[0].id,
        requester: 'PM Checklist Inspector',
        planner: 'Sr. Maintenance Planner',
        supervisor: 'Supervisor Field',
        assignedMechanics: mechanics[0]?.id ? [mechanics[0].id] : [],
        description: `PERBAIKAN DARI TEMUAN PM CHECKLIST: ${failedItems.map((f) => f.taskName).join(', ')}`,
        scheduleStart: new Date().toISOString().slice(0, 10),
        scheduleFinish: new Date().toISOString().slice(0, 10),
        estimatedHours: 4,
        actualHours: 0,
        downtimeHours: 0,
        partsConsumed: [],
        laborCost: 1000000,
        materialCost: 0,
        vendorCost: 0,
        oilConsumableCost: 0,
        totalCost: 1000000
      };
      setWorkOrders((prev) => [correctiveWo, ...prev]);
    }

    addAuditLog('EXECUTE_PM', 'Preventive Maintenance', `Eksekusi checklist PM #${pmId}`);
  };

  // Handlers for RCA Save
  const handleSaveRca = (rcaObj: RcaAnalysis) => {
    setRcaList((prev) => [rcaObj, ...prev]);
    addAuditLog('SAVE_RCA', 'Root Cause Analysis', `Analisis RCA 5-Why: ${rcaObj.title}`);
  };

  return (
    <div className="min-h-screen bg-[#87CEEB] text-[#141414] flex flex-col font-sans selection:bg-[#141414] selection:text-[#87CEEB]">
      
      {/* Navigation Header */}
      <Header
        activeModule={currentModule}
        onSelectModule={setCurrentModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        kpis={kpis}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <Sidebar
          activeModule={currentModule}
          onSelectModule={setCurrentModule}
          kpis={kpis}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full">
          {currentModule === 'dashboard' && (
            <DashboardModule
              kpis={kpis}
              assets={assets}
              workOrders={workOrders}
              breakdowns={breakdowns}
              spareParts={spareParts}
              onOpenNewWO={() => {
                setEditingWo(null);
                setIsWoModalOpen(true);
              }}
              onOpenNewBreakdown={() => setIsBreakdownModalOpen(true)}
            />
          )}

          {currentModule === 'assets' && (
            <AssetMasterModule
              assets={assets}
              workOrders={workOrders}
              breakdowns={breakdowns}
              onAddAsset={() => {
                setEditingAsset(null);
                setIsAssetModalOpen(true);
              }}
              onEditAsset={(ast) => {
                setEditingAsset(ast);
                setIsAssetModalOpen(true);
              }}
              onUpdateMeter={(assetId) => setIsMeterModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {currentModule === 'pm' && (
            <PreventiveMaintenanceModule
              pmSchedules={pmSchedules}
              assets={assets}
              onExecutePmChecklist={handleExecutePmChecklist}
            />
          )}

          {currentModule === 'work_orders' && (
            <WorkOrderModule
              workOrders={workOrders}
              assets={assets}
              mechanics={mechanics}
              spareParts={spareParts}
              onOpenNewWO={() => {
                setEditingWo(null);
                setIsWoModalOpen(true);
              }}
              onEditWO={(wo) => {
                setEditingWo(wo);
                setIsWoModalOpen(true);
              }}
              onStatusChange={handleWoStatusChange}
              searchQuery={searchQuery}
            />
          )}

          {currentModule === 'breakdown' && (
            <BreakdownReportModule
              breakdowns={breakdowns}
              assets={assets}
              onOpenNewBreakdown={() => setIsBreakdownModalOpen(true)}
              onOpenRcaModal={(brk) => {
                setSelectedBreakdownForRca(brk);
                setIsRcaModalOpen(true);
              }}
              onCreateEmergencyWO={(brk) => {
                handleSaveBreakdown(brk, true);
                setCurrentModule('work_orders');
              }}
            />
          )}

          {currentModule === 'spareparts' && (
            <SparePartModule
              spareParts={spareParts}
              inventoryTransactions={inventoryTransactions}
              onOpenAddPart={() => {
                setEditingPart(null);
                setPartModalMode('add');
                setIsPartModalOpen(true);
              }}
              onOpenStockTrx={(part) => {
                setEditingPart(part);
                setPartModalMode('transaction');
                setIsPartModalOpen(true);
              }}
              searchQuery={searchQuery}
            />
          )}

          {currentModule === 'manpower' && (
            <ManpowerModule mechanics={mechanics} workOrders={workOrders} />
          )}

          {currentModule === 'downtime_rca' && (
            <DowntimeRcaModule
              rcaList={rcaList}
              breakdowns={breakdowns}
              assets={assets}
              onOpenRcaForBreakdown={(brk) => {
                setSelectedBreakdownForRca(brk);
                setIsRcaModalOpen(true);
              }}
            />
          )}

          {currentModule === 'cost' && (
            <CostManagementModule workOrders={workOrders} assets={assets} kpis={kpis} />
          )}

          {currentModule === 'scheduler' && (
            <SchedulerModule pmSchedules={pmSchedules} workOrders={workOrders} assets={assets} />
          )}

          {currentModule === 'kpi_analytics' && (
            <ReliabilityKpiModule kpis={kpis} />
          )}

          {currentModule === 'analytics_pareto' && (
            <AnalyticsDashboardModule assets={assets} breakdowns={breakdowns} spareParts={spareParts} />
          )}

          {currentModule === 'reports' && (
            <AutomatedReportsModule
              assets={assets}
              workOrders={workOrders}
              breakdowns={breakdowns}
              spareParts={spareParts}
              kpis={kpis}
            />
          )}

          {currentModule === 'audit_trail' && (
            <AuditTrailModule auditLogs={auditLogs} />
          )}
        </main>

      </div>

      {/* Global Action Modals */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSave={handleSaveAsset}
        existingAsset={editingAsset}
      />

      <WorkOrderModal
        isOpen={isWoModalOpen}
        onClose={() => setIsWoModalOpen(false)}
        onSave={handleSaveWO}
        assets={assets}
        mechanics={mechanics}
        spareParts={spareParts}
        existingWO={editingWo}
      />

      <BreakdownModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        onSave={handleSaveBreakdown}
        assets={assets}
      />

      <SparePartModal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        onSavePart={handleSaveSparePart}
        onSaveTransaction={handleSaveTransaction}
        existingPart={editingPart}
        mode={partModalMode}
      />

      <MeterReadingModal
        isOpen={isMeterModalOpen}
        onClose={() => setIsMeterModalOpen(false)}
        assets={assets}
        onUpdateMeter={handleUpdateMeter}
      />

      <RcaAssistantModal
        isOpen={isRcaModalOpen}
        onClose={() => setIsRcaModalOpen(false)}
        breakdown={selectedBreakdownForRca}
        asset={assets.find((a) => a.id === selectedBreakdownForRca?.assetId) || null}
        onSaveRca={handleSaveRca}
      />

    </div>
  );
}

export default App;
