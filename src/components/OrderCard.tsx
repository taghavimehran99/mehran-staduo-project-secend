import React from "react";
import { Clock, Box, Truck, Check, ChevronRight } from "lucide-react";
import { Order } from "../types";
import { toPersianDigits, formatToman } from "../utils";

interface OrderCardProps {
  order: Order;
  advanceOrderStatus: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, advanceOrderStatus }) => {
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "در حال بررسی";
      case "preparing":
        return "آماده‌سازی سفارش";
      case "shipped":
        return "تحویل به شرکت پست";
      case "delivered":
        return "تحویل شده";
      default:
        return "ثبت شده";
    }
  };

  const getStepProgress = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return 1;
      case "preparing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const step = getStepProgress(order.status);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-50 text-right space-y-4 shadow-sm">
      {/* Top Details bar */}
      <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
        <div>
          <span className="text-slate-400 font-medium">کد رهگیری:</span>{" "}
          <strong className="font-mono text-slate-700">{order.trackingNumber}</strong>
        </div>
        <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Cart thumbnail list */}
      <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth">
        {order.items.map((item) => (
          <div key={item.id} className="relative flex-shrink-0">
            <img
              src={item.product.image}
              alt={item.product.title}
              className="w-12 h-12 object-cover rounded-xl border border-slate-100 bg-slate-50"
            />
            <span className="absolute -top-1.5 -left-1.5 bg-slate-900 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {toPersianDigits(item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Progressive delivery steps indicator */}
      <div className="pt-2 text-center">
        <label className="text-[10px] text-slate-400 font-bold tracking-wide uppercase inline-block mb-3">
          پیگیری موقعیت مرسوله
        </label>

        <div className="flex justify-between items-center relative pr-4 pl-4 select-none">
          {/* Connector Horizontal Lines */}
          <div className="absolute top-[15px] left-8 right-8 h-[2px] bg-slate-100 -z-0" />
          <div
            className="absolute top-[15px] right-8 h-[2px] bg-indigo-500 transition-all duration-500 -z-0"
            style={{ width: `${((step - 1) / 3) * 80}%` }}
          />

          {/* Step 1: Pending */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                step >= 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-slate-600">ثبت</span>
          </div>

          {/* Step 2: Preparing */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 2 ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Box className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-slate-600">بسته‌بندی</span>
          </div>

          {/* Step 3: Shipped */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 3 ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-slate-600">ارسال پست</span>
          </div>

          {/* Step 4: Delivered */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 4 ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-slate-600">تحویل</span>
          </div>
        </div>
      </div>

      {/* Simulation Trigger button - only shown if not fully delivered */}
      {step < 4 && (
        <div className="pt-2">
          <button
            onClick={() => advanceOrderStatus(order.id)}
            className="w-full bg-slate-50 text-slate-600 hover:text-slate-800 text-[10px] font-bold py-2 px-3 rounded-xl border border-slate-100 transition-colors cursor-pointer"
          >
            شبیه‌سازی مرحله بعدی ارسال مرسوله
          </button>
        </div>
      )}

      {/* Expanded address view info */}
      <div className="pt-2 text-xs text-slate-500 border-t border-slate-50 space-y-1">
        <p>
          <span className="font-medium">گیرنده:</span> {order.customerInfo.fullName} (
          {toPersianDigits(order.customerInfo.phone)})
        </p>
        <p className="line-clamp-1">
          <span className="font-medium">آدرس:</span> {order.customerInfo.address}
        </p>
        <p>
          <span className="font-medium">مجموع پرداخت:</span>{" "}
          <strong className="text-indigo-600 font-mono">
            {formatToman(order.totalAmount)}
          </strong>
        </p>
      </div>
    </div>
  );
};
