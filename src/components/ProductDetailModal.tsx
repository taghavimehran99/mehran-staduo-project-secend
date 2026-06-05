import React from "react";
import { motion } from "motion/react";
import { Star, X, Check, ShoppingCart, Plus, Minus } from "lucide-react";
import { Product } from "../types";
import { toPersianDigits, formatToman } from "../utils";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  modalColor: string;
  setModalColor: (color: string) => void;
  modalQty: number;
  setModalQty: React.Dispatch<React.SetStateAction<number>>;
  addToCart: (product: Product, color: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  modalColor,
  setModalColor,
  modalQty,
  setModalQty,
  addToCart,
}) => {
  if (!product) return null;

  const finalPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const hasDiscount = !!product.discountPercentage;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Material Design Side-Card sliding sheet bottom */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md bg-[#f8fafc] rounded-t-[32px] overflow-hidden shadow-2xl border-t border-slate-100 z-10 max-h-[85vh] flex flex-col"
      >
        {/* Pull Accent handle bar */}
        <div className="w-12 h-1 bg-slate-250 rounded-full mx-auto my-3 shrink-0 bg-slate-200" />

        {/* Close trigger button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal content body */}
        <div className="overflow-y-auto px-5 pb-8 space-y-5 text-right flex-1">
          {/* Cover & Brand layout */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-1 border border-slate-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1 mt-2">
              <span className="text-[9px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded-md inline-block">
                مهران استور دمو
              </span>
              <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed">
                {product.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono font-medium truncate">
                {product.titleEn}
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Pricing Info */}
          <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-50">
            <label className="text-[10px] text-slate-400 font-bold block">قیمت محصول</label>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {toPersianDigits(product.rating)} از ۵
                </span>
              </div>

              <div className="text-left font-mono">
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through block decoration-rose-500/30">
                    {toPersianDigits(product.price.toLocaleString())}
                  </span>
                )}
                <span className="text-base font-extrabold text-indigo-600 block">
                  {formatToman(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-slate-700">توضیحات معرفی کلی</h4>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">
              {product.description}
            </p>
          </div>

          {/* Features checkboard bullets */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-extrabold text-slate-700">ویژگی‌های برجسته محصول</h4>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5 text-indigo-600">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-slate-500 leading-normal">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colors Selection list */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-extrabold text-slate-700">انتخاب رنگ موجود</h4>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((col) => {
                const isActive = modalColor === col;
                return (
                  <button
                    key={col}
                    onClick={() => setModalColor(col)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-white" />}
                    <span>{col}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technical Full Specifications view */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-extrabold text-slate-700">مشخصات فنی و سخت‌افزاری</h4>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 text-xs leading-normal">
                    <span className="text-slate-405 font-medium text-slate-400">{key}</span>
                    <strong className="text-slate-700 font-medium">{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Quantity Counter & Action Purchase Buttons */}
          <div className="pt-2 flex items-center gap-4">
            {/* Quantity adjustment cluster */}
            <div className="flex items-center gap-3 bg-white px-3 py-2.5 rounded-2xl border border-slate-100">
              <button
                onClick={() => setModalQty((prev) => prev + 1)}
                className="w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 cursor-pointer active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <span className="text-sm font-extrabold text-slate-800 font-mono w-4 text-center">
                {toPersianDigits(modalQty)}
              </span>

              <button
                onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 cursor-pointer active:scale-95 transition-transform"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart submit */}
            <button
              onClick={() => addToCart(product, modalColor, modalQty)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
