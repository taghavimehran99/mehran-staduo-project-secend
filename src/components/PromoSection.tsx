import React from "react";
import { Tag, AlertCircle, Check } from "lucide-react";

interface PromoSectionProps {
  promoCodeInput: string;
  setPromoCodeInput: (val: string) => void;
  handleApplyPromo: () => void;
  promoError: string;
  promoSuccess: string;
}

export const PromoSection: React.FC<PromoSectionProps> = ({
  promoCodeInput,
  setPromoCodeInput,
  handleApplyPromo,
  promoError,
  promoSuccess,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-50 shadow-sm space-y-2.5 text-right">
      <div className="flex justify-between items-center px-1">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 justify-end">
          <Tag className="w-4 h-4 text-indigo-600" />
          <span>کد تخفیف داری؟</span>
        </label>
        <span className="text-[9px] text-slate-400 font-medium">
          امتحان کنید: <strong className="font-mono text-slate-600">MEHRAN2026</strong>
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="مثلاً: MEHRAN2026"
          value={promoCodeInput}
          onChange={(e) => setPromoCodeInput(e.target.value)}
          className="flex-1 bg-slate-50 pl-4 pr-4 py-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
          id="promo-input"
        />
        <button
          onClick={handleApplyPromo}
          className="bg-slate-900 text-white text-xs font-bold px-4 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          اعمال کد
        </button>
      </div>

      {/* Promo visual logs */}
      {promoError && (
        <p className="text-[10px] text-rose-500 flex items-center gap-1 font-medium bg-rose-50 px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{promoError}</span>
        </p>
      )}
      {promoSuccess && (
        <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{promoSuccess}</span>
        </p>
      )}
    </div>
  );
};
