export type AssetStatus = 'Running' | 'Standby' | 'Breakdown' | 'PM' | 'Overhaul';
export type CriticalityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AssetCategory = 'Excavator' | 'Dump Truck' | 'Bulldozer' | 'Genset' | 'Conveyor' | 'Crusher' | 'Drill Rig' | 'Wheel Loader';

export interface LocationInfo {
  site: string;
  plant: string;
  workshop: string;
  warehouse: string;
  department: string;
  area: string;
  gpsCoordinate?: string;
}

export interface AssetSpecs {
  power: string;
  capacity: string;
  voltage: string;
  pressure: string;
  fuelType: string;
  lubricantType: string;
  oilCapacity: string;
  hydraulicCapacity: string;
}

export interface AssetDocument {
  id: string;
  title: string;
  type: 'Manual Book' | 'Drawing' | 'Part Book' | 'Warranty' | 'Photo Unit';
  url: string;
}

export interface Asset {
  id: string; // Asset ID (e.g. AST-001)
  equipmentCode: string; // e.g. EX-2001
  equipmentName: string;
  category: AssetCategory;
  manufacturer: string;
  model: string;
  serialNumber: string;
  engineNumber: string;
  frameNumber: string;
  purchaseDate: string;
  commissioningDate: string;
  usefulLifeYears: number;
  currentStatus: AssetStatus;
  criticality: CriticalityLevel;
  location: LocationInfo;
  currentHM: number; // Hour Meter
  currentKM: number; // Kilometer
  runningHours: number;
  lastPMHM: number;
  lastPMDate: string;
  specs: AssetSpecs;
  documents: AssetDocument[];
  healthIndexScore: number; // 0 - 100%
  photoUrl?: string;
}

export type PmIntervalType = 'Daily' | 'Weekly' | 'Monthly' | '250 HM' | '500 HM' | '1000 HM' | '2000 HM' | 'Overhaul' | 'Inspection' | 'Lubrication' | 'Calibration' | 'Predictive';
export type PmTriggerType = 'By Date' | 'By HM' | 'By KM' | 'By Cycle';

export interface PmChecklistItem {
  id: string;
  taskName: string;
  category: string;
  status?: 'Pass' | 'Need Repair' | 'Need Replacement' | 'Observation';
  notes?: string;
}

export interface PmSchedule {
  id: string;
  pmCode: string;
  title: string;
  assetId: string;
  intervalType: PmIntervalType;
  triggerType: PmTriggerType;
  targetIntervalHM: number;
  targetIntervalDays: number;
  lastExecutedHM: number;
  lastExecutedDate: string;
  nextDueHM: number;
  nextDueDate: string;
  checklists: PmChecklistItem[];
  estimatedHours: number;
  status: 'Scheduled' | 'Overdue' | 'In Progress' | 'Completed';
}

export type WoType = 'PM' | 'CM' | 'Emergency' | 'Breakdown' | 'Inspection' | 'Calibration' | 'Shutdown';
export type WoPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type WoStatus = 'Open' | 'Assigned' | 'Waiting Part' | 'In Progress' | 'Completed' | 'Closed' | 'Cancelled';

export interface WoPartConsumption {
  partId: string;
  partNumber: string;
  partName: string;
  quantityPlanned: number;
  quantityUsed: number;
  unitPrice: number;
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  woDate: string;
  woType: WoType;
  priority: WoPriority;
  status: WoStatus;
  assetId: string;
  requester: string;
  planner: string;
  supervisor: string;
  assignedMechanics: string[]; // mechanic IDs
  description: string;
  scheduleStart: string;
  scheduleFinish: string;
  actualStart?: string;
  actualFinish?: string;
  estimatedHours: number;
  actualHours?: number;
  downtimeHours?: number;
  partsConsumed: WoPartConsumption[];
  laborCost: number;
  materialCost: number;
  vendorCost: number;
  oilConsumableCost: number;
  totalCost: number;
  breakdownReportId?: string;
}

export type FailureCode = 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Pneumatic' | 'Engine' | 'Transmission' | 'Cooling' | 'Fuel' | 'Control System' | 'Sensor' | 'Operator Error' | 'External';

export interface BreakdownReport {
  id: string;
  breakdownNumber: string;
  date: string;
  time: string;
  assetId: string;
  currentHM: number;
  operatorName: string;
  shift: 'Shift 1' | 'Shift 2' | 'Shift 3';
  location: string;
  problemDescription: string;
  failureCode: FailureCode;
  failureMode: string;
  failureCause: string;
  componentFailure: string;
  temporaryAction: string;
  permanentAction: string;
  downtimeStart: string;
  downtimeFinish?: string;
  repairTimeHours: number;
  status: 'Reported' | 'In Repair' | 'Waiting RCA' | 'Resolved';
}

export interface SparePart {
  id: string;
  partNumber: string;
  partName: string;
  category: string;
  oem: string;
  supplier: string;
  warehouseLocation: string;
  unitOfMeasure?: string;
  minimumStock: number;
  maximumStock: number;
  safetyStock: number;
  currentStock: number;
  leadTimeDays: number;
  unitPrice: number;
  lastPurchaseDate: string;
  abcClassification: 'A' | 'B' | 'C';
  isCriticalSpare: boolean;
  reorderPoint: number;
  eoq: number; // Economic Order Quantity
  monthlyConsumptionRate: number;
}

export interface InventoryTransaction {
  id: string;
  partId: string;
  date: string;
  type: 'Issue' | 'Return' | 'Purchase' | 'Transfer' | 'Adjustment' | 'Stock Opname';
  quantity: number;
  referenceNo: string; // WO number or PO number
  user: string;
  unitPrice: number;
  notes: string;
}

export interface Mechanic {
  id: string;
  employeeId: string;
  name: string;
  skills: string[]; // e.g. Engine, Hydraulic, Electrical
  certifications: string[];
  shift: string;
  workingHoursPerDay: number;
  efficiencyPercent: number;
  hourlyRate: number;
  status: 'Available' | 'On Task' | 'Off Shift' | 'Leave';
}

export interface DowntimeLog {
  id: string;
  assetId: string;
  breakdownId?: string;
  woId?: string;
  downtimeStart: string;
  downtimeEnd: string;
  totalDurationHours: number;
  repairCategory: 'Repair Time' | 'Waiting Part' | 'Waiting Mechanic' | 'Waiting Approval' | 'Testing' | 'Production Delay';
  failureType: FailureCode;
  rootCause: string;
}

export interface RcaAnalysis {
  id: string;
  breakdownId: string;
  assetId: string;
  title: string;
  date: string;
  fiveWhys: string[]; // 5 why answers
  fishbone: {
    manpower: string[];
    machine: string[];
    method: string[];
    material: string[];
    environment: string[];
    measurement: string[];
  };
  correctiveAction: string;
  preventiveAction: string;
  pic: string;
  targetDate: string;
  verificationStatus: 'Pending' | 'In Progress' | 'Verified' | 'Closed';
}

export interface ReliabilityKpiSummary {
  calendarTimeHours: number;
  operatingHours: number;
  totalDowntimeHours: number;
  maintenanceDowntimeHours: number;
  repairHours: number;
  waitingDowntimeHours: number;
  totalBreakdowns: number;
  totalWoScheduled: number;
  totalWoCompleted: number;
  totalWoOnTime: number;
  totalPmScheduled: number;
  totalPmCompleted: number;
  backlogWoCount: number;
  totalMaintenanceCost: number;
  
  // Calculated KPIs
  pa: number; // Physical Availability %
  ma: number; // Mechanical Availability %
  ua: number; // Utilization Availability %
  eu: number; // Effective Utilization %
  mttr: number; // Mean Time To Repair (hours)
  mtbf: number; // Mean Time Between Failure (hours)
  failureRate: number; // Failures per Operating Hour
  pmCompliance: number; // %
  scheduleCompliance: number; // %
  costPerHM: number;
  costPerBreakdown: number;
}

export type UserRole = 
  | 'Admin'
  | 'Maintenance Planner'
  | 'Maintenance Supervisor'
  | 'Mechanic'
  | 'Warehouse'
  | 'Purchasing'
  | 'Production/Operation'
  | 'Manager'
  | 'Auditor';

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  user?: string;
  module: string;
  action: string;
  details: string;
}

export type CmmsModuleId = 
  | 'dashboard'
  | 'assets'
  | 'pm'
  | 'work_orders'
  | 'breakdown'
  | 'spareparts'
  | 'manpower'
  | 'downtime_rca'
  | 'cost'
  | 'scheduler'
  | 'kpi_analytics'
  | 'analytics_pareto'
  | 'reports'
  | 'audit_trail';
