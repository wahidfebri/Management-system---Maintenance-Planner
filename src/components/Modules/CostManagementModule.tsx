import React from 'react';
import { DollarSign, Truck } from 'lucide-react';
import { WorkOrder, Asset, ReliabilityKpiSummary } from '../../types/cmms';
import { formatCurrencyIDR } from '../../utils/kpiCalculator';

interface CostManagementModuleProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  kpis: ReliabilityKpiSummary;
}

export const CostManagementModule: React.FC<CostManagementModuleProps> = ({ workOrders, assets, kpis }) => {
  const totalLaborCost = workOrders.reduce((sum, w) => sum + w.laborCost, 0);
  const totalMaterialCost = workOrders.reduce((sum, w) => sum + w.materialCost, 0);
  const totalVendorCost = workOrders.reduce((sum, w) => sum + w.vendorCost, 0);
  const totalOilCost = workOrders.reduce((sum, w) => sum + w.oilConsumableCost, 0);

  const assetCostList = assets
    .map((ast) => {
      const astWOs = workOrders.filter((w) => w.assetId === ast.id);
      const sumCost = astWOs.reduce((sum, w) => sum + w.totalCost, 0);
      const costPerHm = ast.currentHM > 0 ? sumCost / ast.currentHM : 0;

      return {
        code: ast.equipmentCode,
        name: ast.equipmentName,
        category: ast.category,
        totalCost: sumCost,
        currentHM: ast.currentHM,
        costPerHm
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-[#141414]">
        <div>
          <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-[#141414]" />
            <span>Modul 10: Controlling Maintenance Cost & Financial Efficiency</span>
          </h2>
          <p className="text-xs text-[#141414]/70 font-semibold">
            Pengontrolan elemen biaya maintenance (Labor, Material, Vendor, Oil), Cost per HM/KM & variansi budget
          </p>
        </div>
      </div>

      {/* Cost Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Biaya Labor</span>
          <div className="text-base mono-value text-[#141414]">{formatCurrencyIDR(totalLaborCost)}</div>
        </div>

        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Biaya Material</span>
          <div className="text-base mono-value text-[#141414]">{formatCurrencyIDR(totalMaterialCost)}</div>
        </div>

        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Biaya Vendor</span>
          <div className="text-base mono-value text-[#141414]">{formatCurrencyIDR(totalVendorCost)}</div>
        </div>

        <div className="p-3 bg-white border border-[#141414]">
          <span className="serif-label block">Biaya Oli & Consumable</span>
          <div className="text-base mono-value text-[#141414]">{formatCurrencyIDR(totalOilCost)}</div>
        </div>
      </div>

      {/* Cost per Asset Table */}
      <div className="bg-white border border-[#141414] p-4 space-y-3">
        <h3 className="text-xs font-black uppercase text-[#141414] flex items-center space-x-2">
          <Truck className="w-4 h-4 text-[#141414]" />
          <span>Biaya Maintenance per Unit Equipment</span>
        </h3>

        <div className="overflow-x-auto border border-[#141414]">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-[#141414] text-[#E4E3E0] font-bold uppercase">
              <tr>
                <th className="p-2 border-r border-[#E4E3E0]/20">Equipment Code</th>
                <th className="p-2 border-r border-[#E4E3E0]/20">Equipment Name</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-right">Current HM</th>
                <th className="p-2 border-r border-[#E4E3E0]/20 text-right">Total Cost</th>
                <th className="p-2 text-right">Cost / HM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {assetCostList.map((ast, idx) => (
                <tr key={idx} className="hover:bg-[#E4E3E0]">
                  <td className="p-2 border-r border-[#141414] mono-value font-bold">{ast.code}</td>
                  <td className="p-2 border-r border-[#141414] uppercase">{ast.name}</td>
                  <td className="p-2 border-r border-[#141414] text-right mono-value">{ast.currentHM} HM</td>
                  <td className="p-2 border-r border-[#141414] text-right mono-value font-bold">{formatCurrencyIDR(ast.totalCost)}</td>
                  <td className="p-2 text-right mono-value">{formatCurrencyIDR(ast.costPerHm)} / HM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
