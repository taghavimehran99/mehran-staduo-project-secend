import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "../types";
import { toPersianDigits, formatToman } from "../utils";

interface CartListItemProps {
  item: CartItem;
  updateCartQty: (compositeId: string, delta: number) => void;
}

export const CartListItem: React.FC<CartListItemProps> = ({ item, updateCartQty }) => {
  const finalPrice = item.product.price * (1 - (item.product.discountPercentage || 0) / 100);

  return (
    <div
      className="bg-white rounded-3xl p-3.5 border border-slate-50 flex gap-3.5 items-center justify-between shadow-sm"
      id={`cart-row-${item.id}`}
    >
      <img
        src={item.product.image}
        alt={item.product.title}
        className="w-16 h-16 object-cover rounded-xl bg-slate-50"
        referrerPolicy="no-referrer"
      />

      <div className="flex-1 min-w-0 space-y-1 text-right">
        <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.title}</h4>
        <p className="text-[10px] text-slate-400 font-medium">
          رنگ انتخابی: <span className="font-bold text-slate-650 text-slate-500">{item.selectedColor}</span>
        </p>

        <span className="text-xs font-extrabold text-indigo-600 block font-mono">
          {formatToman(finalPrice * item.quantity)}
        </span>
      </div>

      {/* Quantity Adjusters */}
      <div className="flex flex-col items-center gap-1.5 min-w-[32px]">
        <button
          onClick={() => updateCartQty(item.id, 1)}
          className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 active:bg-indigo-100 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs font-extrabold text-slate-700 font-mono">
          {toPersianDigits(item.quantity)}
        </span>

        <button
          onClick={() => updateCartQty(item.id, -1)}
          className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 active:bg-rose-100 cursor-pointer"
        >
          {item.quantity === 1 ? (
            <Trash2 className="w-3.5 h-3.5" />
          ) : (
            <Minus className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
