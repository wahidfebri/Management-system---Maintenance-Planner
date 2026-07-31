import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetCategory, AssetStatus, CriticalityLevel } from '../../types/cmms';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  existingAsset?: Asset | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingAsset
}) => {
  const [formData, setFormData] = useState<Partial<Asset>>(
    existingAsset || {
      equipmentCode: '',
      equipmentName: '',
      category: 'Excavator',
      manufacturer: '',
      model: '',
      serialNumber: '',
      engineNumber: '',
      frameNumber: '',
      purchaseDate: new Date().toISOString().slice(0, 10),
      commissioningDate: new Date().toISOString().slice(0, 10),
      usefulLifeYears: 10,
      currentStatus: 'Running',
      criticality: 'High',
      location: {
        site: 'Site Pit Alpha',
        plant: 'Pit Alpha',
        workshop: 'Main Workshop A',
        warehouse: 'Central Warehouse WH-01',
        department: 'Operations',
        area: 'Mining Area'
      },
      currentHM: 1000,
      currentKM: 0,
      runningHours: 1000,
      lastPMHM: 750,
      lastPMDate: new Date().toISOString().slice(0, 10),
      specs: {
        power: '500 kW',
        capacity: '5 m3',
        voltage: '24V',
        pressure: '20 MPa',
        fuelType: 'Diesel B35',
        lubricantType: 'SAE 15W-40',
        oilCapacity: '100 L',
        hydraulicCapacity: '400 L'
      },
      documents: [],
      healthIndexScore: 90
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: existingAsset?.id || `AST-${Date.now().toString().slice(-4)}`,
      equipmentCode: formData.equipmentCode || 'EX-NEW',
      equipmentName: formData.equipmentName || 'New Machine Unit',
      category: (formData.category as AssetCategory) || 'Excavator',
      manufacturer: formData.manufacturer || 'OEM',
      model: formData.model || 'Model X',
      serialNumber: formData.serialNumber || 'SN-000',
      engineNumber: formData.engineNumber || 'ENG-000',
      frameNumber: formData.frameNumber || 'FRM-000',
      purchaseDate: formData.purchaseDate || new Date().toISOString().slice(0, 10),
      commissioningDate: formData.commissioningDate || new Date().toISOString().slice(0, 10),
      usefulLifeYears: Number(formData.usefulLifeYears) || 10,
      currentStatus: (formData.currentStatus as AssetStatus) || 'Running',
      criticality: (formData.criticality as CriticalityLevel) || 'High',
      location: formData.location || {
        site: 'Site Pit Alpha',
        plant: 'Pit Alpha',
        workshop: 'Workshop A',
        warehouse: 'WH-01',
        department: 'Mining',
        area: 'Loading'
      },
      currentHM: Number(formData.currentHM) || 0,
      currentKM: Number(formData.currentKM) || 0,
      runningHours: Number(formData.currentHM) || 0,
      lastPMHM: Number(formData.lastPMHM) || 0,
      lastPMDate: formData.lastPMDate || new Date().toISOString().slice(0, 10),
      specs: formData.specs || {
        power: '400 kW',
        capacity: '4 m3',
        voltage: '24V',
        pressure: '20 MPa',
        fuelType: 'Diesel B35',
        lubricantType: 'SAE 15W-40',
        oilCapacity: '100 L',
        hydraulicCapacity: '400 L'
      },
      documents: formData.documents || [],
      healthIndexScore: Number(formData.healthIndexScore) || 90
    };

    onSave(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#141414]">
        
        {/* Modal Header */}
        <div className="bg-[#141414] text-[#E4E3E0] p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>{existingAsset ? 'Edit Asset Unit' : 'Tambah Asset Unit Baru'}</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="serif-label block">Kode Equipment</span>
              <input
                type="text"
                value={formData.equipmentCode || ''}
                onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value uppercase"
                required
              />
            </div>

            <div>
              <span className="serif-label block">Nama Equipment</span>
              <input
                type="text"
                value={formData.equipmentName || ''}
                onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
                required
              />
            </div>

            <div>
              <span className="serif-label block">Kategori</span>
              <select
                value={formData.category || 'Excavator'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Excavator">Excavator</option>
                <option value="Dump Truck">Dump Truck</option>
                <option value="Bulldozer">Bulldozer</option>
                <option value="Wheel Loader">Wheel Loader</option>
                <option value="Motor Grader">Motor Grader</option>
                <option value="Genset">Genset</option>
                <option value="Conveyor">Conveyor</option>
              </select>
            </div>

            <div>
              <span className="serif-label block">Status Operasional</span>
              <select
                value={formData.currentStatus || 'Running'}
                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Running">Running</option>
                <option value="Standby">Standby</option>
                <option value="Breakdown">Breakdown</option>
                <option value="PM">PM</option>
                <option value="Overhaul">Overhaul</option>
              </select>
            </div>

            <div>
              <span className="serif-label block">Current Meter (HM)</span>
              <input
                type="number"
                value={formData.currentHM || 0}
                onChange={(e) => setFormData({ ...formData, currentHM: Number(e.target.value) })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value"
              />
            </div>

            <div>
              <span className="serif-label block">Kritikalitas</span>
              <select
                value={formData.criticality || 'High'}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value as any })}
                className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#141414] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-[#141414] text-[#141414] font-bold text-xs uppercase"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
            >
              Simpan Asset
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
