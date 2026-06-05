import React from "react";
import { ChevronLeft } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface HomeBannerProps {
  banners: Array<{
    title: string;
    desc: string;
    badge: string;
    bgGradient: string;
    image: string;
    targetId: string;
  }>;
  currentSlide: number;
  setCurrentSlide: (idx: number) => void;
  openProductDetails: (product: Product) => void;
}

export const HomeBanner: React.FC<HomeBannerProps> = ({
  banners,
  currentSlide,
  setCurrentSlide,
  openProductDetails,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-slate-100 flex-shrink-0">
      <div
        className={`p-6 bg-gradient-to-tr ${banners[currentSlide].bgGradient} text-white flex flex-col justify-between min-h-[190px] relative transition-all duration-500`}
      >
        <div className="absolute top-0 left-0 w-2/5 h-full opacity-20 pointer-events-none">
          <img
            src={banners[currentSlide].image}
            alt="Banner decoration"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="z-10 space-y-2 text-right">
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wide">
            {banners[currentSlide].badge}
          </span>
          <h2 className="text-lg font-bold leading-snug">{banners[currentSlide].title}</h2>
          <p className="text-xs text-white/85 max-w-[70%] font-light line-clamp-2">
            {banners[currentSlide].desc}
          </p>
        </div>

        <div className="z-10 pt-4 flex justify-between items-center">
          <button
            onClick={() => {
              const p = PRODUCTS.find((prod) => prod.id === banners[currentSlide].targetId);
              if (p) openProductDetails(p);
            }}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-md shadow-black/10"
          >
            مشاهده و خرید
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Slide dots */}
          <div className="flex gap-1.5 scrollbar-none">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === idx ? "bg-white px-2" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
