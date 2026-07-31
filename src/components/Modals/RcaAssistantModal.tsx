import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Asset, BreakdownReport, RcaAnalysis } from '../../types/cmms';

interface RcaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: BreakdownReport | null;
  asset: Asset | null;
  onSaveRca: (rca: RcaAnalysis) => void;
}

export const RcaAssistantModal: React.FC<RcaAssistantModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  asset,
  onSaveRca
}) => {
  const [fiveWhys, setFiveWhys] = useState<string[]>([
    'Unit mengalami penurunan performa mendadak saat pengoperasian.',
    'Suhu komponen melebihi ambang batas normal.',
    'Sistem pendingin tidak mentransfer panas secara optimal.',
    'Terdapat akumulasi kerak/debu pada bagian radiator.',
    'Pemeriksaan kebersihan radiator tidak tercakup secara spesifik di PM harian.'
  ]);

  const [correctiveAction, setCorrectiveAction] = useState<string>(
    'Pembersihan total radiator dan penggantian komponen yang aus.'
  );
  const [preventiveAction, setPreventiveAction] = useState<string>(
    'Tambahkan checklist kebersihan radiator pada daftar inspeksi PM 250 HM.'
  );

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  if (!isOpen || !breakdown) return null;

  const handleGenerateAiDiagnosis = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetName: asset?.equipmentName || 'Heavy Machinery',
          component: breakdown.componentFailure,
          failureCode: breakdown.failureCode,
          problemDescription: breakdown.problemDescription,
          hm: breakdown.currentHM
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        const { fiveWhySteps, correctiveActions, preventiveActions } = data.analysis;
        if (Array.isArray(fiveWhySteps) && fiveWhySteps.length > 0) {
          setFiveWhys(fiveWhySteps);
        }
        if (Array.isArray(correctiveActions) && correctiveActions.length > 0) {
          setCorrectiveAction(correctiveActions.join('; '));
        }
        if (Array.isArray(preventiveActions) && preventiveActions.length > 0) {
          setPreventiveAction(preventiveActions.join('; '));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSave = () => {
    const newRca: RcaAnalysis = {
      id: `RCA-${Date.now().toString().slice(-4)}`,
      breakdownId: breakdown.id,
      assetId: breakdown.assetId,
      date: new Date().toISOString().slice(0, 10),
      title: `RCA 5-Why Analysis: ${breakdown.breakdownNumber}`,
      fiveWhys,
      fishbone: {
        manpower: ['Operator training required'],
        machine: ['Wear and tear on radiator core'],
        method: ['PM checklist update needed'],
        material: ['OEM coolant spec required'],
        environment: ['Dusty mining site environment'],
        measurement: ['Pressure sensor check']
      },
      correctiveAction,
      preventiveAction,
      pic: 'Sr. Reliability Engineer',
      targetDate: new Date().toISOString().slice(0, 10),
      verificationStatus: 'Pending'
    };

    onSaveRca(newRca);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/80 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#141414] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#141414]">
        
        {/* Header */}
        <div className="bg-[#141414] text-[#E4E3E0] p-3 flex justify-between items-center font-black text-xs uppercase">
          <span>AI Auto-RCA Assistant (5-Why Method)</span>
          <button onClick={onClose} className="hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 text-xs font-semibold">
          <div className="p-2 border border-[#141414] bg-[#E4E3E0]">
            <span className="serif-label block">Target Breakdown</span>
            <p className="font-extrabold uppercase text-[#141414]">{breakdown.breakdownNumber} - {asset?.equipmentCode}</p>
            <p className="text-[10px] text-[#141414]/80">{breakdown.problemDescription}</p>
          </div>

          <button
            type="button"
            onClick={handleGenerateAiDiagnosis}
            disabled={isLoadingAi}
            className="w-full py-2 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black flex items-center justify-center space-x-2"
          >
            {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoadingAi ? 'Memproses Diagnosis Gemini AI...' : 'Jalankan Diagnosis Otomatis Gemini AI'}</span>
          </button>

          <div className="space-y-2 pt-2 border-t border-[#141414]">
            <span className="serif-label block">Langkah Analisis 5-Why</span>
            {fiveWhys.map((why, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="mono-value text-[#141414] font-bold">W#{idx + 1}:</span>
                <input
                  type="text"
                  value={why}
                  onChange={(e) => {
                    const updated = [...fiveWhys];
                    updated[idx] = e.target.value;
                    setFiveWhys(updated);
                  }}
                  className="flex-1 bg-[#E4E3E0] border border-[#141414] p-1 font-bold text-xs uppercase"
                />
              </div>
            ))}
          </div>

          <div>
            <span className="serif-label block">Tindakan Korektif (Corrective Action)</span>
            <input
              type="text"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase text-xs"
            />
          </div>

          <div>
            <span className="serif-label block">Tindakan Pencegahan (Preventive Action)</span>
            <input
              type="text"
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              className="w-full bg-[#E4E3E0] border border-[#141414] p-1.5 font-bold uppercase text-xs"
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
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase hover:bg-black"
            >
              Simpan Dokumen RCA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
