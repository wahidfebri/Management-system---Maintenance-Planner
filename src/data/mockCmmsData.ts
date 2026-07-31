import {
  Asset,
  PmSchedule,
  WorkOrder,
  BreakdownReport,
  SparePart,
  InventoryTransaction,
  Mechanic,
  DowntimeLog,
  RcaAnalysis,
  AuditLog
} from '../types/cmms';

export const initialAssets: Asset[] = [
  {
    id: 'AST-101',
    equipmentCode: 'EX-2001',
    equipmentName: 'Komatsu PC2000-8 Hydraulic Excavator',
    category: 'Excavator',
    manufacturer: 'Komatsu',
    model: 'PC2000-8',
    serialNumber: 'KMT-EX2000-89102',
    engineNumber: 'SAA12V140E-3',
    frameNumber: 'FRM-2000-891',
    purchaseDate: '2021-03-15',
    commissioningDate: '2021-04-01',
    usefulLifeYears: 10,
    currentStatus: 'Running',
    criticality: 'Critical',
    location: {
      site: 'Site Batu Hijau Mining',
      plant: 'Pit Alpha',
      workshop: 'Main Workshop A',
      warehouse: 'Central Warehouse WH-01',
      department: 'Mining Operations',
      area: 'Loading Point 3',
      gpsCoordinate: '-8.8912, 116.7821'
    },
    currentHM: 12450,
    currentKM: 0,
    runningHours: 12450,
    lastPMHM: 12250,
    lastPMDate: '2026-07-10',
    specs: {
      power: '956 kW / 1280 HP',
      capacity: '12.0 m3 Bucket',
      voltage: '24V DC',
      pressure: '31.4 MPa',
      fuelType: 'B35 Industrial Diesel',
      lubricantType: 'SAE 15W-40 Heavy Duty',
      oilCapacity: '230 Liters',
      hydraulicCapacity: '1200 Liters'
    },
    documents: [
      { id: 'DOC-1', title: 'Komatsu PC2000-8 Shop Manual', type: 'Manual Book', url: '#' },
      { id: 'DOC-2', title: 'Hydraulic Piping Schematic Diagram', type: 'Drawing', url: '#' },
      { id: 'DOC-3', title: 'Part Catalog Book 2024', type: 'Part Book', url: '#' }
    ],
    healthIndexScore: 92,
    photoUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'AST-102',
    equipmentCode: 'DT-7771',
    equipmentName: 'Caterpillar 777G Off-Highway Dump Truck',
    category: 'Dump Truck',
    manufacturer: 'Caterpillar',
    model: '777G',
    serialNumber: 'CAT-0777G-98213',
    engineNumber: 'CAT-C32-ACERT',
    frameNumber: 'FRM-777G-441',
    purchaseDate: '2022-01-10',
    commissioningDate: '2022-02-01',
    usefulLifeYears: 8,
    currentStatus: 'Breakdown',
    criticality: 'Critical',
    location: {
      site: 'Site Batu Hijau Mining',
      plant: 'Haul Road B',
      workshop: 'Workshop Heavy Duty 2',
      warehouse: 'Central Warehouse WH-01',
      department: 'Hauling Fleet',
      area: 'Segment 4 Ramp'
    },
    currentHM: 15820,
    currentKM: 210500,
    runningHours: 15820,
    lastPMHM: 15500,
    lastPMDate: '2026-06-28',
    specs: {
      power: '765 kW / 1025 HP',
      capacity: '60.1 m3 Payload 100 Ton',
      voltage: '24V DC',
      pressure: '20.0 MPa',
      fuelType: 'B35 Industrial Diesel',
      lubricantType: 'CAT DEO 15W-40',
      oilCapacity: '132 Liters',
      hydraulicCapacity: '415 Liters'
    },
    documents: [
      { id: 'DOC-4', title: 'CAT 777G Operation Manual', type: 'Manual Book', url: '#' }
    ],
    healthIndexScore: 68,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'AST-103',
    equipmentCode: 'DZ-3751',
    equipmentName: 'Komatsu D375A-8 Crawler Dozer',
    category: 'Bulldozer',
    manufacturer: 'Komatsu',
    model: 'D375A-8',
    serialNumber: 'KMT-D375-30911',
    engineNumber: 'SAA6D170E-7',
    frameNumber: 'FRM-375A-019',
    purchaseDate: '2020-08-20',
    commissioningDate: '2020-09-01',
    usefulLifeYears: 10,
    currentStatus: 'PM',
    criticality: 'High',
    location: {
      site: 'Site Batu Hijau Mining',
      plant: 'Waste Dump Area C',
      workshop: 'Workshop Main A',
      warehouse: 'Central Warehouse WH-01',
      department: 'Civil & Support',
      area: 'Bench Level +120'
    },
    currentHM: 18400,
    currentKM: 0,
    runningHours: 18400,
    lastPMHM: 18000,
    lastPMDate: '2026-07-25',
    specs: {
      power: '455 kW / 610 HP',
      capacity: '18.5 m3 Semi-U Blade',
      voltage: '24V DC',
      pressure: '22.5 MPa',
      fuelType: 'Diesel B35',
      lubricantType: 'SAE 15W-40',
      oilCapacity: '87 Liters',
      hydraulicCapacity: '230 Liters'
    },
    documents: [],
    healthIndexScore: 84
  },
  {
    id: 'AST-104',
    equipmentCode: 'GEN-6001',
    equipmentName: 'Cummins QSK60 Power Generator Set 2000 kVA',
    category: 'Genset',
    manufacturer: 'Cummins',
    model: 'QSK60-G6',
    serialNumber: 'CUM-QSK60-77123',
    engineNumber: 'ENG-QSK60-9921',
    frameNumber: 'GEN-FRAME-2000',
    purchaseDate: '2019-11-05',
    commissioningDate: '2019-12-01',
    usefulLifeYears: 15,
    currentStatus: 'Running',
    criticality: 'Critical',
    location: {
      site: 'Power Plant Station',
      plant: 'Main Substation A',
      workshop: 'Electrical Power Workshop',
      warehouse: 'Electrical Warehouse WH-02',
      department: 'Infrastructure Power',
      area: 'Genset House Bay 2'
    },
    currentHM: 24150,
    currentKM: 0,
    runningHours: 24150,
    lastPMHM: 24000,
    lastPMDate: '2026-07-15',
    specs: {
      power: '1600 kW / 2000 kVA',
      capacity: '400V / 11kV Step Up',
      voltage: '3-Phase 400V/11kV',
      pressure: 'Normal',
      fuelType: 'Diesel B35',
      lubricantType: 'Cummins Premium Blue 15W-40',
      oilCapacity: '280 Liters',
      hydraulicCapacity: 'N/A'
    },
    documents: [],
    healthIndexScore: 95
  },
  {
    id: 'AST-105',
    equipmentCode: 'CV-0101',
    equipmentName: 'Heavy Duty Primary Crushing Overland Conveyor 1500 TPH',
    category: 'Conveyor',
    manufacturer: 'Metso Outotec',
    model: 'CV-1500-HD',
    serialNumber: 'METSO-CV1500-3321',
    engineNumber: 'N/A (3x 250kW Electric Motors)',
    frameNumber: 'CV-STRUCT-1500',
    purchaseDate: '2018-05-10',
    commissioningDate: '2018-06-01',
    usefulLifeYears: 20,
    currentStatus: 'Standby',
    criticality: 'High',
    location: {
      site: 'Processing Plant',
      plant: 'Crusher Line 1',
      workshop: 'Plant Maintenance Workshop',
      warehouse: 'Plant Warehouse WH-03',
      department: 'Processing Plant',
      area: 'Conveyor Gallery Line 1'
    },
    currentHM: 31200,
    currentKM: 0,
    runningHours: 31200,
    lastPMHM: 31000,
    lastPMDate: '2026-07-02',
    specs: {
      power: '750 kW Total Drive',
      capacity: '1500 Tons/Hour',
      voltage: '660V AC 50Hz',
      pressure: 'N/A',
      fuelType: 'Electrical Power',
      lubricantType: 'Gear Oil ISO VG 320',
      oilCapacity: '150 Liters (Gearbox)',
      hydraulicCapacity: '80 Liters (Take-up unit)'
    },
    documents: [],
    healthIndexScore: 88
  }
];

export const initialPmSchedules: PmSchedule[] = [
  {
    id: 'PM-250-101',
    pmCode: 'PM-EX-250',
    title: 'Preventive Maintenance 250 HM Service - Excavator EX-2001',
    assetId: 'AST-101',
    intervalType: '250 HM',
    triggerType: 'By HM',
    targetIntervalHM: 250,
    targetIntervalDays: 30,
    lastExecutedHM: 12250,
    lastExecutedDate: '2026-07-10',
    nextDueHM: 12500,
    nextDueDate: '2026-08-08',
    checklists: [
      { id: 'CK-1', taskName: 'Drain & Replace Engine Oil & Oil Filters', category: 'Lubrication', status: 'Pass' },
      { id: 'CK-2', taskName: 'Inspect Hydraulic Hoses & Main Valve Block', category: 'Hydraulic', status: 'Pass' },
      { id: 'CK-3', taskName: 'Check & Replenish Radiator Coolant Level', category: 'Cooling', status: 'Pass' },
      { id: 'CK-4', taskName: 'Inspect Track Chain Tension & Roller Wear', category: 'Undercarriage', status: 'Need Repair', notes: 'Left idler tension cylinder leaking' },
      { id: 'CK-5', taskName: 'Grease All Boom, Arm & Bucket Pivot Pins', category: 'Greasing', status: 'Pass' },
      { id: 'CK-6', taskName: 'Torque Check Swing Bearing Bolts', category: 'Mechanical', status: 'Pass' }
    ],
    estimatedHours: 4,
    status: 'Scheduled'
  },
  {
    id: 'PM-500-102',
    pmCode: 'PM-DT-500',
    title: 'Preventive Maintenance 500 HM Service - Dump Truck DT-7771',
    assetId: 'AST-102',
    intervalType: '500 HM',
    triggerType: 'By HM',
    targetIntervalHM: 500,
    targetIntervalDays: 45,
    lastExecutedHM: 15500,
    lastExecutedDate: '2026-06-28',
    nextDueHM: 16000,
    nextDueDate: '2026-08-12',
    checklists: [
      { id: 'CK-10', taskName: 'Replace Engine Oil, Fuel Water Separators & Filters', category: 'Engine' },
      { id: 'CK-11', taskName: 'Check Transmission Fluid & Magnetic Plugs', category: 'Transmission' },
      { id: 'CK-12', taskName: 'Inspect Suspension Struts & Nitrogen Pressure', category: 'Suspension' },
      { id: 'CK-13', taskName: 'Brake Disc Pressure Test & Retarder Check', category: 'Brake' },
      { id: 'CK-14', taskName: 'Tire Pressure & Tread Wear Inspection', category: 'Tires' }
    ],
    estimatedHours: 6,
    status: 'Overdue'
  },
  {
    id: 'PM-1000-103',
    pmCode: 'PM-DZ-1000',
    title: 'Preventive Maintenance 1000 HM Major Service - Dozer DZ-3751',
    assetId: 'AST-103',
    intervalType: '1000 HM',
    triggerType: 'By HM',
    targetIntervalHM: 1000,
    targetIntervalDays: 90,
    lastExecutedHM: 18000,
    lastExecutedDate: '2026-07-25',
    nextDueHM: 19000,
    nextDueDate: '2026-10-25',
    checklists: [
      { id: 'CK-20', taskName: 'Replace All Hydraulic Return & Pilot Filters', category: 'Hydraulic', status: 'Pass' },
      { id: 'CK-21', taskName: 'Change Final Drive Gear Oils', category: 'Drivetrain', status: 'Pass' },
      { id: 'CK-22', taskName: 'Inspect Dozer Blade Cylinder Seals & Pins', category: 'Attachement', status: 'Pass' }
    ],
    estimatedHours: 8,
    status: 'In Progress'
  }
];

export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'WO-2026-001',
    woNumber: 'WO-2607-001',
    woDate: '2026-07-29',
    woType: 'Breakdown',
    priority: 'Critical',
    status: 'In Progress',
    assetId: 'AST-102',
    requester: 'Heru Prasetyo (Shift Supervisor)',
    planner: 'Budi Santoso (Sr. Maintenance Planner)',
    supervisor: 'Bambang Wijaya (Field Supv)',
    assignedMechanics: ['MEC-01', 'MEC-03'],
    description: 'Transmission slipping and alarm warning CODE E-04 active on CAT 777G during haul climb. Hydraulic oil high temperature alert.',
    scheduleStart: '2026-07-29 08:30',
    scheduleFinish: '2026-07-30 16:00',
    actualStart: '2026-07-29 09:00',
    estimatedHours: 12,
    actualHours: 8.5,
    downtimeHours: 18,
    partsConsumed: [
      { partId: 'PART-101', partNumber: '3E-2021', partName: 'CAT Transmission Friction Disc Kit', quantityPlanned: 1, quantityUsed: 1, unitPrice: 45000000 },
      { partId: 'PART-102', partNumber: '1R-0716', partName: 'Engine High Efficiency Oil Filter', quantityPlanned: 2, quantityUsed: 2, unitPrice: 850000 }
    ],
    laborCost: 3500000,
    materialCost: 46700000,
    vendorCost: 0,
    oilConsumableCost: 4200000,
    totalCost: 54400000,
    breakdownReportId: 'BRK-2026-001'
  },
  {
    id: 'WO-2026-002',
    woNumber: 'WO-2607-002',
    woDate: '2026-07-28',
    woType: 'PM',
    priority: 'Medium',
    status: 'Completed',
    assetId: 'AST-101',
    requester: 'Budi Santoso (Planner)',
    planner: 'Budi Santoso',
    supervisor: 'Dedi Sutrisno',
    assignedMechanics: ['MEC-02'],
    description: 'Scheduled PM 250 HM service for Komatsu PC2000-8 Excavator.',
    scheduleStart: '2026-07-28 07:00',
    scheduleFinish: '2026-07-28 12:00',
    actualStart: '2026-07-28 07:15',
    actualFinish: '2026-07-28 11:30',
    estimatedHours: 5,
    actualHours: 4.25,
    downtimeHours: 4.25,
    partsConsumed: [
      { partId: 'PART-103', partNumber: '600-211-1340', partName: 'Komatsu Engine Fuel Filter Element', quantityPlanned: 2, quantityUsed: 2, unitPrice: 1200000 },
      { partId: 'PART-104', partNumber: 'OIL-15W40-DRUM', partName: 'SAE 15W-40 Heavy Duty Drum (200L)', quantityPlanned: 1, quantityUsed: 1, unitPrice: 9500000 }
    ],
    laborCost: 1800000,
    materialCost: 11900000,
    vendorCost: 0,
    oilConsumableCost: 1500000,
    totalCost: 15200000
  },
  {
    id: 'WO-2026-003',
    woNumber: 'WO-2607-003',
    woDate: '2026-07-26',
    woType: 'CM',
    priority: 'High',
    status: 'Waiting Part',
    assetId: 'AST-103',
    requester: 'Agus Subagyo (Dozer Op)',
    planner: 'Budi Santoso',
    supervisor: 'Bambang Wijaya',
    assignedMechanics: ['MEC-03'],
    description: 'Replace leaking left tilt cylinder seal kit on Dozer DZ-3751 found during inspection.',
    scheduleStart: '2026-07-27 08:00',
    scheduleFinish: '2026-07-27 15:00',
    estimatedHours: 7,
    downtimeHours: 0,
    partsConsumed: [],
    laborCost: 0,
    materialCost: 0,
    vendorCost: 0,
    oilConsumableCost: 0,
    totalCost: 0
  }
];

export const initialBreakdownReports: BreakdownReport[] = [
  {
    id: 'BRK-2026-001',
    breakdownNumber: 'BRK-2607-01',
    date: '2026-07-29',
    time: '08:15',
    assetId: 'AST-102',
    currentHM: 15820,
    operatorName: 'Slamet Widodo',
    shift: 'Shift 1',
    location: 'Segment 4 Ramp Haul Road',
    problemDescription: 'Truck lost momentum uphill with loud grinding noise in transmission box. Error Code E-04 displayed on dashboard.',
    failureCode: 'Transmission',
    failureMode: 'Slipping Clutch & Overheating',
    failureCause: 'Contaminated hydraulic oil & worn friction plates due to extended haul duty under high ambient temp',
    componentFailure: 'Transmission Clutch Pack 2 & Hydraulic Pressure Solenoid Valve',
    temporaryAction: 'Towed unit safely to Workshop Heavy Duty 2 bay using Tow Truck DT-01',
    permanentAction: 'Overhaul Transmission clutch pack, replace oil cooler core and flush transmission oil system',
    downtimeStart: '2026-07-29 08:15',
    repairTimeHours: 18,
    status: 'In Repair'
  },
  {
    id: 'BRK-2026-002',
    breakdownNumber: 'BRK-2607-02',
    date: '2026-07-20',
    time: '14:30',
    assetId: 'AST-105',
    currentHM: 31180,
    operatorName: 'Rudi Hartono (Plant Op)',
    shift: 'Shift 2',
    location: 'Crusher Line 1 Gallery',
    problemDescription: 'Overland Conveyor CV-01 stopped suddenly due to high drive motor vibration and bearing temperature trip.',
    failureCode: 'Mechanical',
    failureMode: 'Drive Pulley Bearing Seizure',
    failureCause: 'Inadequate grease replenishment due to clogged grease line',
    componentFailure: 'SKF 22230 Spherical Roller Bearing Drive Pulley',
    temporaryAction: 'Manual greasing and forced cooling applied',
    permanentAction: 'Replaced pulley pillow block bearing assembly and re-aligned drive coupling',
    downtimeStart: '2026-07-20 14:30',
    downtimeFinish: '2026-07-20 20:30',
    repairTimeHours: 6,
    status: 'Resolved'
  }
];

export const initialSpareParts: SparePart[] = [
  {
    id: 'PART-101',
    partNumber: '3E-2021',
    partName: 'CAT Transmission Friction Disc Kit 777G',
    category: 'Transmission',
    oem: 'Caterpillar',
    supplier: 'PT Trakindo Utama',
    warehouseLocation: 'WH-01-A2-14',
    minimumStock: 2,
    maximumStock: 6,
    safetyStock: 2,
    currentStock: 1, // Below Safety Stock -> Reorder Alert!
    leadTimeDays: 14,
    unitPrice: 45000000,
    lastPurchaseDate: '2026-05-12',
    abcClassification: 'A',
    isCriticalSpare: true,
    reorderPoint: 3,
    eoq: 4,
    monthlyConsumptionRate: 1.5
  },
  {
    id: 'PART-102',
    partNumber: '1R-0716',
    partName: 'CAT Engine High Efficiency Oil Filter',
    category: 'Filters',
    oem: 'Caterpillar',
    supplier: 'PT Trakindo Utama',
    warehouseLocation: 'WH-01-B1-02',
    minimumStock: 10,
    maximumStock: 40,
    safetyStock: 8,
    currentStock: 24,
    leadTimeDays: 5,
    unitPrice: 850000,
    lastPurchaseDate: '2026-07-01',
    abcClassification: 'C',
    isCriticalSpare: false,
    reorderPoint: 12,
    eoq: 20,
    monthlyConsumptionRate: 15
  },
  {
    id: 'PART-103',
    partNumber: '600-211-1340',
    partName: 'Komatsu Engine Fuel Filter Element',
    category: 'Filters',
    oem: 'Komatsu',
    supplier: 'PT United Tractors Tbk',
    warehouseLocation: 'WH-01-B1-09',
    minimumStock: 8,
    maximumStock: 30,
    safetyStock: 6,
    currentStock: 18,
    leadTimeDays: 7,
    unitPrice: 1200000,
    lastPurchaseDate: '2026-06-20',
    abcClassification: 'B',
    isCriticalSpare: false,
    reorderPoint: 10,
    eoq: 15,
    monthlyConsumptionRate: 8
  },
  {
    id: 'PART-104',
    partNumber: 'SKF-22230',
    partName: 'SKF 22230 CC/W33 Spherical Roller Bearing',
    category: 'Bearings',
    oem: 'SKF',
    supplier: 'PT Bearings Indonesia',
    warehouseLocation: 'WH-03-C4-01',
    minimumStock: 1,
    maximumStock: 4,
    safetyStock: 1,
    currentStock: 2,
    leadTimeDays: 21,
    unitPrice: 18500000,
    lastPurchaseDate: '2026-04-10',
    abcClassification: 'A',
    isCriticalSpare: true,
    reorderPoint: 2,
    eoq: 2,
    monthlyConsumptionRate: 0.5
  }
];

export const initialInventoryTransactions: InventoryTransaction[] = [
  {
    id: 'TRX-101',
    partId: 'PART-101',
    date: '2026-07-29 09:30',
    type: 'Issue',
    quantity: 1,
    referenceNo: 'WO-2607-001',
    user: 'Warehouse Admin - Yanto',
    unitPrice: 45000000,
    notes: 'Issued for Transmission Overhaul DT-7771'
  },
  {
    id: 'TRX-102',
    partId: 'PART-102',
    date: '2026-07-28 08:00',
    type: 'Issue',
    quantity: 2,
    referenceNo: 'WO-2607-002',
    user: 'Warehouse Admin - Yanto',
    unitPrice: 850000,
    notes: 'Issued for PM 250 EX-2001'
  }
];

export const initialMechanics: Mechanic[] = [
  {
    id: 'MEC-01',
    employeeId: 'EMP-M01',
    name: 'Andi Kurniawan',
    skills: ['Heavy Equipment Engine', 'CAT C32 Specialist', 'Troubleshooting'],
    certifications: ['CAT Certified Technician Level 3', 'K3 LH Heavy Equipment'],
    shift: 'Shift 1 (07:00 - 15:00)',
    workingHoursPerDay: 8,
    efficiencyPercent: 95,
    hourlyRate: 150000,
    status: 'On Task'
  },
  {
    id: 'MEC-02',
    employeeId: 'EMP-M02',
    name: 'Bambang Triyono',
    skills: ['Komatsu Excavator', 'Hydraulic System Diagnostics', 'Welding'],
    certifications: ['Komatsu Master Tech', 'Hydraulic Specialist'],
    shift: 'Shift 1 (07:00 - 15:00)',
    workingHoursPerDay: 8,
    efficiencyPercent: 90,
    hourlyRate: 140000,
    status: 'Available'
  },
  {
    id: 'MEC-03',
    employeeId: 'EMP-M03',
    name: 'Candra Gunawan',
    skills: ['Transmission Overhaul', 'Drivetrain', 'Pneumatics'],
    certifications: ['Powertrain Specialist'],
    shift: 'Shift 2 (15:00 - 23:00)',
    workingHoursPerDay: 8,
    efficiencyPercent: 88,
    hourlyRate: 135000,
    status: 'On Task'
  }
];

export const initialDowntimeLogs: DowntimeLog[] = [
  {
    id: 'DTL-01',
    assetId: 'AST-102',
    breakdownId: 'BRK-2026-001',
    woId: 'WO-2026-001',
    downtimeStart: '2026-07-29 08:15',
    downtimeEnd: '2026-07-29 12:00',
    totalDurationHours: 3.75,
    repairCategory: 'Waiting Part',
    failureType: 'Transmission',
    rootCause: 'Waiting for transmission kit release from central warehouse'
  },
  {
    id: 'DTL-02',
    assetId: 'AST-102',
    breakdownId: 'BRK-2026-001',
    woId: 'WO-2026-001',
    downtimeStart: '2026-07-29 12:00',
    downtimeEnd: '2026-07-30 02:00',
    totalDurationHours: 14.0,
    repairCategory: 'Repair Time',
    failureType: 'Transmission',
    rootCause: 'Active dismantling and clutch replacement work'
  }
];

export const initialRcaAnalyses: RcaAnalysis[] = [
  {
    id: 'RCA-101',
    breakdownId: 'BRK-2026-001',
    assetId: 'AST-102',
    title: '5-Why & Fishbone RCA: CAT 777G Transmission Slip & Overheat',
    date: '2026-07-29',
    fiveWhys: [
      'Why did Dump Truck DT-7771 lose power uphill? -> Transmission clutch was slipping.',
      'Why was the transmission clutch slipping? -> Hydraulic clutch pressure dropped below specification (18 bar vs 25 bar).',
      'Why did hydraulic pressure drop? -> Transmission oil filter clogged and proportional solenoid valve stuck.',
      'Why was filter clogged? -> High friction material debris accumulated in transmission fluid.',
      'Why did friction material degrade rapidly? -> Unit operated under continuous 12% incline overload without oil sampling analysis performed during previous PM.'
    ],
    fishbone: {
      manpower: ['Operator pushed truck in manual gear overload', 'PM mechanic missed oil sample oil sampling protocol'],
      machine: ['Clutch pack thermal fatigue', 'Cooler core partial blockage'],
      method: ['Oil sampling interval not strictly enforced in PM 250 check'],
      material: ['Non-OEM transmission oil blend batch used in May'],
      environment: ['Extreme ambient temperature (38°C) in pit haul road'],
      measurement: ['Pressure sensor calibration overdue by 1 month']
    },
    correctiveAction: 'Replace Transmission Clutch Pack, flush system, install new CAT OEM transmission oil filter & pressure sensor.',
    preventiveAction: 'Update PM checklist to mandate SOS oil sampling every 250 HM & calibrate transmission pressure sensors every 6 months.',
    pic: 'Budi Santoso (Sr. Planner)',
    targetDate: '2026-08-05',
    verificationStatus: 'In Progress'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-07-30 08:00:12',
    userRole: 'Maintenance Planner',
    module: 'Work Order',
    action: 'CREATE_WO',
    details: 'Created Work Order WO-2607-001 for DT-7771 Breakdown'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-07-29 09:30:00',
    userRole: 'Warehouse',
    module: 'Spare Part',
    action: 'STOCK_ISSUE',
    details: 'Issued 1 unit Part 3E-2021 to WO-2607-001'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-07-28 11:30:15',
    userRole: 'Mechanic',
    module: 'Preventive Maintenance',
    action: 'COMPLETE_PM',
    details: 'Completed PM 250 HM Service for EX-2001'
  }
];
