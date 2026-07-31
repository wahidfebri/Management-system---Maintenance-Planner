import {
  Asset,
  WorkOrder,
  BreakdownReport,
  PmSchedule,
  ReliabilityKpiSummary
} from '../types/cmms';

export function calculateReliabilityKPIs(
  assets: Asset[],
  workOrders: WorkOrder[],
  breakdowns: BreakdownReport[],
  pmSchedules: PmSchedule[],
  daysPeriod: number = 30
): ReliabilityKpiSummary {
  // Calendar time in hours for total fleet in the specified period (e.g. 30 days)
  const totalUnits = assets.length || 1;
  const calendarTimeHours = daysPeriod * 24 * totalUnits; // e.g. 30 * 24 * 5 = 3600 hours

  // Calculate total downtime from breakdowns and work orders
  let totalDowntimeHours = 0;
  let repairHours = 0;
  let waitingDowntimeHours = 0;

  workOrders.forEach((wo) => {
    if (wo.downtimeHours) {
      totalDowntimeHours += wo.downtimeHours;
    }
    if (wo.actualHours) {
      repairHours += wo.actualHours;
    }
  });

  breakdowns.forEach((brk) => {
    if (brk.repairTimeHours) {
      // Avoid double counting if already in WO, but add baseline if standalone
      if (!workOrders.some((w) => w.breakdownReportId === brk.id)) {
        totalDowntimeHours += brk.repairTimeHours;
        repairHours += brk.repairTimeHours;
      }
    }
  });

  waitingDowntimeHours = Math.max(0, totalDowntimeHours - repairHours);

  // Available Time = Calendar Time - Total Downtime
  const availableHours = Math.max(0, calendarTimeHours - totalDowntimeHours);

  // Operating Time: total estimated operating hours in this period across active fleet
  // Estimated operating ratio ~ 80% of available hours for running units
  const operatingHours = Math.min(availableHours, availableHours * 0.82);

  // Total Breakdowns count
  const totalBreakdowns = breakdowns.length || 1;

  // Work Orders metrics
  const totalWoScheduled = workOrders.length;
  const totalWoCompleted = workOrders.filter((w) => w.status === 'Completed' || w.status === 'Closed').length;
  const totalWoOnTime = workOrders.filter(
    (w) => (w.status === 'Completed' || w.status === 'Closed') && (w.actualHours ?? 0) <= w.estimatedHours
  ).length;
  const backlogWoCount = workOrders.filter(
    (w) => w.status === 'Open' || w.status === 'Assigned' || w.status === 'Waiting Part' || w.status === 'In Progress'
  ).length;

  // PM Compliance
  const totalPmScheduled = pmSchedules.length;
  const totalPmCompleted = pmSchedules.filter((p) => p.status === 'Completed').length;

  // Total Costs
  const totalMaintenanceCost = workOrders.reduce((sum, wo) => sum + (wo.totalCost || 0), 0);

  // Sum of total Operating HM accrued by assets
  const totalFleetHM = assets.reduce((sum, ast) => sum + (ast.currentHM || 1), 0);

  // KPI Calculations
  // 1. Physical Availability (PA %)
  const pa = (availableHours / calendarTimeHours) * 100;

  // 2. Mechanical Availability (MA %) = Operating / (Operating + Maintenance Downtime)
  const maintenanceDowntime = totalDowntimeHours;
  const ma = (operatingHours / (operatingHours + maintenanceDowntime)) * 100;

  // 3. Utilization Availability (UA %) = Operating / Available
  const ua = availableHours > 0 ? (operatingHours / availableHours) * 100 : 0;

  // 4. Effective Utilization (EU %) = Operating / Calendar Time
  const eu = (operatingHours / calendarTimeHours) * 100;

  // 5. MTTR = Total Repair Time / Number of Breakdowns
  const mttr = totalBreakdowns > 0 ? repairHours / totalBreakdowns : 0;

  // 6. MTBF = Total Operating Time / Number of Breakdowns
  const mtbf = totalBreakdowns > 0 ? operatingHours / totalBreakdowns : 0;

  // 7. Failure Rate = Total Failures / Operating Hours
  const failureRate = operatingHours > 0 ? totalBreakdowns / operatingHours : 0;

  // 8. PM Compliance %
  const pmCompliance = totalPmScheduled > 0 ? (totalPmCompleted / totalPmScheduled) * 100 : 100;

  // 9. Schedule Compliance %
  const scheduleCompliance = totalWoScheduled > 0 ? (totalWoOnTime / totalWoScheduled) * 100 : 100;

  // 12. Maintenance Cost per HM
  const costPerHM = totalFleetHM > 0 ? totalMaintenanceCost / totalFleetHM : 0;

  // 13. Cost per Breakdown
  const costPerBreakdown = totalBreakdowns > 0 ? totalMaintenanceCost / totalBreakdowns : 0;

  return {
    calendarTimeHours: Math.round(calendarTimeHours),
    operatingHours: Math.round(operatingHours),
    totalDowntimeHours: Math.round(totalDowntimeHours * 10) / 10,
    maintenanceDowntimeHours: Math.round(maintenanceDowntime * 10) / 10,
    repairHours: Math.round(repairHours * 10) / 10,
    waitingDowntimeHours: Math.round(waitingDowntimeHours * 10) / 10,
    totalBreakdowns,
    totalWoScheduled,
    totalWoCompleted,
    totalWoOnTime,
    totalPmScheduled,
    totalPmCompleted,
    backlogWoCount,
    totalMaintenanceCost,

    pa: Math.min(100, Math.round(pa * 100) / 100),
    ma: Math.min(100, Math.round(ma * 100) / 100),
    ua: Math.min(100, Math.round(ua * 100) / 100),
    eu: Math.min(100, Math.round(eu * 100) / 100),
    mttr: Math.round(mttr * 10) / 10,
    mtbf: Math.round(mtbf * 10) / 10,
    failureRate: Number(failureRate.toFixed(5)),
    pmCompliance: Math.min(100, Math.round(pmCompliance * 10) / 10),
    scheduleCompliance: Math.min(100, Math.round(scheduleCompliance * 10) / 10),
    costPerHM: Math.round(costPerHM),
    costPerBreakdown: Math.round(costPerBreakdown)
  };
}

export function formatCurrencyIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
