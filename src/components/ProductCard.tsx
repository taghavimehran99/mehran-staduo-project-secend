import React from "react";
import { Star, Heart } from "lucide-react";
import { Product } from "../types";
import { toPersianDigits, formatToman } from "../utils";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  isSaved: boolean;
  toggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  categoryTitle: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  isSaved,
  toggleWishlist,
  categoryTitle,
}) => {
  const finalPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const hasDiscount = !!product.discountPercentage;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="bg-white rounded-3xl p-3.5 flex flex-col justify-between border border-slate-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative"
      id={`product-card-${product.id}`}
    >
      {/* Favorite badge & Discount details */}
      <div className="flex justify-between items-center absolute top-2.5 inset-x-2.5 z-10 select-none">
        {hasDiscount ? (
          <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-1 rounded-full font-sans">
            {toPersianDigits(product.discountPercentage!)}٪-
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={(e) => toggleWishlist(product.id, e)}
          className={`p-1.5 rounded-full backdrop-blur-md border cursor-pointer transition-colors ${
            isSaved
              ? "bg-rose-50 border-rose-100 text-rose-500"
              : "bg-white/80 border-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Product Image */}
      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mt-2">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover rounded-xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info */}
      <div className="mt-3.5 space-y-1.5 text-right">
        <span className="text-[9px] text-indigo-505 bg-indigo-50 font-bold px-2 py-0.5 rounded-md inline-block text-indigo-600">
          {categoryTitle}
        </span>
        <h4
          className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed min-h-[36px]"
          title={product.title}
        >
          {product.title}
        </h4>

        {/* Star rating info */}
        <div className="flex items-center gap-1 justify-start">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-bold text-slate-650 font-mono text-slate-500">
            {toPersianDigits(product.rating)}
          </span>
        </div>

        {/* Price */}
        <div className="pt-2">
          {hasDiscount && (
            <span className="text-[10px] text-slate-400 line-through block font-mono">
              {toPersianDigits(product.price.toLocaleString())}
            </span>
          )}
          <span className="text-xs font-extrabold text-indigo-600 font-mono">
            {formatToman(finalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
