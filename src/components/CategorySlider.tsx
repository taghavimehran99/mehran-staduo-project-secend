import React from "react";
import { LayoutGrid, Smartphone, Watch, Headphones, Cable, ChevronLeft } from "lucide-react";
import { Category } from "../types";

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  setActiveTab?: (tab: "home" | "categories" | "cart" | "profile") => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setActiveTab,
}) => {
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 font-bold" };
    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid {...props} />;
      case "Smartphone":
        return <Smartphone {...props} />;
      case "Watch":
        return <Watch {...props} />;
      case "Headphones":
        return <Headphones {...props} />;
      case "Cable":
        return <Cable {...props} />;
      default:
        return <LayoutGrid {...props} />;
    }
  };

  return (
    <div className="space-y-2 text-right">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-slate-800">دسته‌بندی‌ها</h3>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab("categories")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 pointer-events-auto"
          >
            مشاهده همه
            <ChevronLeft className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100 shadow-sm"
            }`}
            id={`category-tab-${cat.slug}`}
          >
            {renderCategoryIcon(cat.iconName)}
            <span>{cat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
