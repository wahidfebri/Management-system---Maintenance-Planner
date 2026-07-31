import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AuditLog } from '../../types/cmms';

interface AuditTrailModuleProps {
  auditLogs: AuditLog[];
}

export const AuditTrailModule: React.FC<AuditTrailModuleProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#141414]" />
            <span>Audit Trail & Internal Audit Compliance Log</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pencatatan riwayat perubahan data, akses pengguna & verifikasi integritas sistem CMMS
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-[#141414] bg-white">
        <table className="w-full text-left text-xs font-semibold">
          <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
            <tr>
              <th className="p-2 border-r border-[#E4E3E0]/20">Timestamp</th>
              <th className="p-2 border-r border-[#E4E3E0]/20">User & Role</th>
              <th className="p-2 border-r border-[#E4E3E0]/20">Action</th>
              <th className="p-2 border-r border-[#E4E3E0]/20">Modul</th>
              <th className="p-2">Deskripsi Perubahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#E4E3E0]">
                <td className="p-2 border-r border-[#141414] mono-value">{log.timestamp}</td>
                <td className="p-2 border-r border-[#141414]">
                  <span className="font-extrabold uppercase block">{log.user}</span>
                  <span className="serif-label">{log.userRole}</span>
                </td>
                <td className="p-2 border-r border-[#141414]">
                  <span className="status-chip bg-white text-black">{log.action}</span>
                </td>
                <td className="p-2 border-r border-[#141414] mono-value">{log.module}</td>
                <td className="p-2 uppercase text-[11px]">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
