import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Asset } from '../../types/cmms';

interface MeterReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onUpdateMeter: (assetId: string, newHM: number, newKM: number) => void;
}

export const MeterReadingModal: React.FC<MeterReadingModalProps> = ({
  isOpen,
  onClose,
  assets,
  onUpdateMeter
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [hmValue, setHmValue] = useState<number>(assets[0]?.currentHM || 0);
  const [kmValue, setKmValue] = useState<number>(assets[0]?.currentKM || 0);

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleAssetChange = (id: string) => {
    setSelectedAssetId(id);
    const ast = assets.find((a) => a.id === id);
    if (ast) {
      setHmValue(ast.currentHM);
      setKmValue(ast.currentKM);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;
    onUpdateMeter(selectedAssetId, hmValue, kmValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-md shadow-[4px_4px_0px_#141414]">
        
        {/* Header */}
        <div className="bg-[#141414] text-[#E4E3E0] p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>Log Meter Harian (HM / KM)</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs font-semibold">
          <div>
            <span className="serif-label block">Pilih Equipment</span>
            <select
              value={selectedAssetId}
              onChange={(e) => handleAssetChange(e.target.value)}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.equipmentCode} - {a.equipmentName} ({a.currentHM} HM)
                </option>
              ))}
            </select>
          </div>

          <div className="p-2 border border-[#141414] bg-[#E4E3E0] space-y-1">
            <span className="serif-label block">Last PM HM: {currentAsset?.lastPMHM} HM</span>
            <span className="serif-label block">Accumulated Since Last PM: {Math.max(0, hmValue - (currentAsset?.lastPMHM || 0))} HM</span>
          </div>

          <div>
            <span className="serif-label block">Current Hour Meter (HM)</span>
            <input
              type="number"
              required
              min={currentAsset?.currentHM || 0}
              value={hmValue}
              onChange={(e) => setHmValue(Number(e.target.value))}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value text-sm"
            />
          </div>

          <div>
            <span className="serif-label block">Current Odometer (KM)</span>
            <input
              type="number"
              value={kmValue}
              onChange={(e) => setKmValue(Number(e.target.value))}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 mono-value text-sm"
            />
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
              Update Meter
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
