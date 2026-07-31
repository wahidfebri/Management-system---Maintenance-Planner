import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import { Asset, WorkOrder, BreakdownReport, SparePart, ReliabilityKpiSummary } from '../../types/cmms';
import { exportToCsv, printReport } from '../../utils/exportUtils';

interface AutomatedReportsModuleProps {
  assets: Asset[];
  workOrders: WorkOrder[];
  breakdowns: BreakdownReport[];
  spareParts: SparePart[];
  kpis: ReliabilityKpiSummary;
}

export const AutomatedReportsModule: React.FC<AutomatedReportsModuleProps> = ({
  assets,
  workOrders,
  breakdowns,
  spareParts
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#141414]" />
            <span>Modul 16: Automated Reporting & Export Center (CSV / PDF)</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Penghasil laporan manajemen otomatis: Harian, Mingguan, Bulanan & Tahunan
          </p>
        </div>

        <button
          onClick={printReport}
          className="px-3.5 py-1.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-bold text-xs uppercase hover:bg-black transition-colors shadow-[1px_1px_0px_#141414]"
        >
          <Printer className="w-4 h-4 inline mr-1" />
          <span>Cetak PDF</span>
        </button>
      </div>

      {/* Available Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h4 className="font-extrabold text-xs uppercase text-[#141414]">Master Equipment Report</h4>
          <p className="text-[10px] font-semibold text-[#141414]/70">
            Data spesifikasi unit, lokasi, serial number, HM/KM running meter & status.
          </p>
          <button
            onClick={() => exportToCsv('Assets_Report', assets)}
            className="w-full py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
          >
            <Download className="w-3.5 h-3.5 inline mr-1" />
            Export CSV
          </button>
        </div>

        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h4 className="font-extrabold text-xs uppercase text-[#141414]">Work Order Report</h4>
          <p className="text-[10px] font-semibold text-[#141414]/70">
            Data histori WO PM, CM, Breakdown, jam mekanik & konsumsi biaya perbaikan.
          </p>
          <button
            onClick={() => exportToCsv('WorkOrders_Report', workOrders)}
            className="w-full py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
          >
            <Download className="w-3.5 h-3.5 inline mr-1" />
            Export CSV
          </button>
        </div>

        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h4 className="font-extrabold text-xs uppercase text-[#141414]">Breakdown Incident Report</h4>
          <p className="text-[10px] font-semibold text-[#141414]/70">
            Data rincian insiden breakdown, jam downtime & taksonomi failure code.
          </p>
          <button
            onClick={() => exportToCsv('Breakdowns_Report', breakdowns)}
            className="w-full py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
          >
            <Download className="w-3.5 h-3.5 inline mr-1" />
            Export CSV
          </button>
        </div>

        <div className="bg-white border border-[#141414] p-4 space-y-3">
          <h4 className="font-extrabold text-xs uppercase text-[#141414]">Spare Parts Report</h4>
          <p className="text-[10px] font-semibold text-[#141414]/70">
            Katalog stok gudang, nilai inventori, ROP & estimasi pemesanan.
          </p>
          <button
            onClick={() => exportToCsv('SpareParts_Report', spareParts)}
            className="w-full py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
          >
            <Download className="w-3.5 h-3.5 inline mr-1" />
            Export CSV
          </button>
        </div>

      </div>

    </div>
  );
};
