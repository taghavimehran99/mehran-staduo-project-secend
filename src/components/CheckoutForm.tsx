import React from "react";
import { CustomerInfo } from "../types";

interface CheckoutFormProps {
  checkoutForm: CustomerInfo;
  setCheckoutForm: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  checkoutErrors: { [key: string]: string };
  handleCheckoutSubmit: (e: React.FormEvent) => void;
  setIsCheckingOut: (val: boolean) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  checkoutForm,
  setCheckoutForm,
  checkoutErrors,
  handleCheckoutSubmit,
  setIsCheckingOut,
}) => {
  return (
    <form
      onSubmit={handleCheckoutSubmit}
      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          اطلاعات تحویل‌گیرنده
        </h3>
        <button
          type="button"
          onClick={() => setIsCheckingOut(false)}
          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          انصراف
        </button>
      </div>

      {/* Customer Full Name */}
      <div className="space-y-1.5 text-right">
        <label className="text-[11px] font-bold text-slate-500">
          نام و نام خانوادگی تحویل‌گیرنده *
        </label>
        <input
          type="text"
          value={checkoutForm.fullName}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
          placeholder="مثال: مهران نوری"
          className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 text-xs text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right text-slate-800"
        />
        {checkoutErrors.fullName && (
          <p className="text-[10px] text-rose-500">{checkoutErrors.fullName}</p>
        )}
      </div>

      {/* Contact Phone */}
      <div className="space-y-1.5 text-right">
        <label className="text-[11px] font-bold text-slate-500">شماره موبایل تماس *</label>
        <input
          type="tel"
          value={checkoutForm.phone}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
          placeholder="مثال: 09123456789"
          className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left font-mono text-slate-800"
        />
        {checkoutErrors.phone && (
          <p className="text-[10px] text-rose-500">{checkoutErrors.phone}</p>
        )}
      </div>

      {/* Postal Address */}
      <div className="space-y-1.5 text-right">
        <label className="text-[11px] font-bold text-slate-500">آدرس دقیق پستی *</label>
        <textarea
          rows={2}
          value={checkoutForm.address}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
          placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"
          className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right leading-relaxed text-slate-800"
        />
        {checkoutErrors.address && (
          <p className="text-[10px] text-rose-500">{checkoutErrors.address}</p>
        )}
      </div>

      {/* Postal code */}
      <div className="space-y-1.5 text-right">
        <label className="text-[11px] font-bold text-slate-500">کد پستی ده رقمی *</label>
        <input
          type="text"
          maxLength={10}
          value={checkoutForm.postalCode}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
          placeholder="کد پستی ۱۰ رقمی بدون خط تیره"
          className="w-full bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left font-mono text-slate-800"
        />
        {checkoutErrors.postalCode && (
          <p className="text-[10px] text-rose-500">{checkoutErrors.postalCode}</p>
        )}
      </div>

      {/* Checkout Submit Trigger button */}
      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
        id="submit-order-button"
      >
        پرداخت و سفارش نهایی (دمو شبیه‌ساز)
      </button>
    </form>
  );
};
