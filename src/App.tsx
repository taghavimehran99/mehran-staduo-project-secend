import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ChevronLeft 
} from "lucide-react";

import { PRODUCTS, CATEGORIES, PROMO_CODES } from "./data";
import { Product, CartItem, Order, CustomerInfo } from "./types";
import { formatToman, toPersianDigits } from "./utils";

// Import modular reusable components
import { HomeBanner } from "./components/HomeBanner";
import { CategorySlider } from "./components/CategorySlider";
import { ProductCard } from "./components/ProductCard";
import { CartListItem } from "./components/CartListItem";
import { PromoSection } from "./components/PromoSection";
import { OrderCard } from "./components/OrderCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CheckoutForm } from "./components/CheckoutForm";

export default function App() {
  // Mobile app navigation tabs: 'home' | 'categories' | 'cart' | 'profile'
  const [activeTab, setActiveTab] = useState<"home" | "categories" | "cart" | "profile">("home");
  
  // Selected category filtering
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Live search query filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Sorting options: 'popular' | 'cheap' | 'expensive'
  const [sortBy, setSortBy] = useState<"popular" | "cheap" | "expensive">("popular");
  
  // State for product detail bottom-sheet modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalColor, setModalColor] = useState<string>("");
  const [modalQty, setModalQty] = useState<number>(1);
  
  // Wishlist/Saved state persists automatically
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("mehran_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("mehran_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Promo Code input variables
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>("");
  const [promoSuccess, setPromoSuccess] = useState<string>("");

  // Orders listing state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("mehran_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // Checkout shipping forms state logic
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    address: "",
    postalCode: ""
  });
  const [checkoutErrors, setCheckoutErrors] = useState<{ [key: string]: string }>({});
  const [orderJustPlaced, setOrderJustPlaced] = useState<string | null>(null);

  // Active home banner slider index
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Home slider banner details
  const banners = [
    {
      title: "اکوسیستم کهکشانی سامسونگ",
      desc: "پرچمدار جدید Galaxy S24 Ultra با تخفیف ویژه ۵ درصدی و گارانتی ۱۸ ماهه هم‌اکنون موجود است.",
      badge: "پیشنهاد ویژه",
      bgGradient: "from-blue-600 to-indigo-900",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
      targetId: "p1"
    },
    {
      title: "دنیای بی حد و مرز صوتی",
      desc: "با هدفون WF-1000XM5 سونی نویز محیط را برای همیشه خاموش کنید و از اوج هنر موسیقی آگاه شوید.",
      badge: "جدیدترین",
      bgGradient: "from-amber-600 to-neutral-900",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
      targetId: "p6"
    }
  ];

  // Auto rotate banner carousel every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Sync state variables to LocalStorage safely
  useEffect(() => {
    localStorage.setItem("mehran_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("mehran_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("mehran_orders", JSON.stringify(orders));
  }, [orders]);

  // Wishlist addition toggle trigger
  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    );
  };

  // Add items cart handler
  const addToCart = (product: Product, color: string, qty: number) => {
    const compositeId = `${product.id}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) => 
          item.id === compositeId 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      } else {
        return [...prev, { id: compositeId, product, quantity: qty, selectedColor: color }];
      }
    });

    setSelectedProduct(null);
    setModalQty(1);
    setActiveTab("cart");
  };

  // Cart quantity update delta tracker
  const updateCartQty = (compositeId: string, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === compositeId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  // Apply matched verification coupons
  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const matched = PROMO_CODES.find(p => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (matched) {
      setAppliedPromo({ code: matched.code, percent: matched.discountPercent });
      setPromoSuccess(`کد تخفیف ${matched.discountPercent}٪ با موفقیت روی سبد خرید اعمال شد.`);
    } else {
      setPromoError("کد وارد شده نامعتبر یا منقضی شده است.");
    }
  };

  // Live order status progressive simulation sequence handler
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let nextStat: Order["status"] = "pending";
          if (ord.status === "pending") nextStat = "preparing";
          else if (ord.status === "preparing") nextStat = "shipped";
          else if (ord.status === "shipped") nextStat = "delivered";
          else return ord;

          return { ...ord, status: nextStat };
        }
        return ord;
      })
    );
  };

  // Bottom drawer detail trigger
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalColor(product.colors[0]);
    setModalQty(1);
  };

  // Calculate cart cost stats
  const totals = useMemo(() => {
    const rawSubtotal = cart.reduce((acc, item) => {
      const currentPrice = item.product.price;
      const discount = item.product.discountPercentage || 0;
      const discountedPrice = currentPrice * (1 - discount / 100);
      return acc + (discountedPrice * item.quantity);
    }, 0);

    const discountAmount = appliedPromo ? (rawSubtotal * (appliedPromo.percent / 100)) : 0;
    const deliveryFee = rawSubtotal > 50000000 ? 0 : 75000;
    const finalTotal = rawSubtotal - discountAmount + deliveryFee;

    return {
      subtotal: Math.round(rawSubtotal),
      discount: Math.round(discountAmount),
      delivery: deliveryFee,
      total: Math.round(finalTotal)
    };
  }, [cart, appliedPromo]);

  // Catalog queries layout filter and sorter
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== "all") {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.titleEn.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort evaluation
    if (sortBy === "popular") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "cheap") {
      result.sort((a, b) => {
        const finalA = a.price * (1 - (a.discountPercentage || 0) / 100);
        const finalB = b.price * (1 - (b.discountPercentage || 0) / 100);
        return finalA - finalB;
      });
    } else if (sortBy === "expensive") {
      result.sort((a, b) => {
        const finalA = a.price * (1 - (a.discountPercentage || 0) / 100);
        const finalB = b.price * (1 - (b.discountPercentage || 0) / 100);
        return finalB - finalA;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // On Checkout form validation details submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!checkoutForm.fullName.trim()) errors.fullName = "وارد کردن نام و نام خانوادگی الزامی است";
    if (!checkoutForm.phone.trim()) errors.phone = "شماره موبایل وارد نشده است";
    else if (!/^09\d{9}$/.test(checkoutForm.phone.trim())) {
      errors.phone = "فرمت شماره موبایل نامعتبر است (مثال: 09123456789)";
    }
    if (!checkoutForm.address.trim()) errors.address = "آدرس پستی را وارد کنید";
    if (!checkoutForm.postalCode.trim()) errors.postalCode = "کد پستی را وارد کنید";
    else if (!/^\d{10}$/.test(checkoutForm.postalCode.trim())) {
      errors.postalCode = "کد پستی باید دقیقا ۱۰ رقم باشد";
    }

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      return;
    }

    // Order Simulation registration
    const trackingCode = `MEH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      items: [...cart],
      date: new Date().toLocaleDateString("fa-IR"),
      totalAmount: totals.total,
      discountApplied: totals.discount,
      status: "pending",
      customerInfo: { ...checkoutForm },
      trackingNumber: trackingCode
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedPromo(null);
    setPromoCodeInput("");
    setIsCheckingOut(false);
    setOrderJustPlaced(newOrder.id);
    setActiveTab("profile");
    
    // Reset inputs
    setCheckoutForm({
      fullName: "",
      phone: "",
      address: "",
      postalCode: ""
    });
    setCheckoutErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-900 md:py-6 flex justify-center items-center font-sans tracking-tight" dir="rtl">
      
      {/* Device wrapper mockup container */}
      <div className="relative w-full max-w-md bg-[#f8fafc] md:rounded-[40px] md:shadow-2xl md:border-8 md:border-slate-800 h-screen md:h-[880px] overflow-hidden flex flex-col justify-between">
        
        {/* Status bar graphic for mobile-experience fidelity */}
        <div className="hidden md:flex bg-slate-900 text-slate-400 text-xs px-6 py-2.5 items-center justify-between font-mono font-medium border-b border-slate-800 shrink-0">
          <div>MehranStore 5G</div>
          <div className="flex gap-1.5 items-center select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>بخش دمو مهران</span>
          </div>
          <div>۱۳:۴۵</div>
        </div>

        {/* Brand App header navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 select-none">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-sm font-bold text-slate-800 leading-none">مهران استور</h1>
              <span className="text-[10px] text-slate-400 font-medium">فروشگاه موبایل و تکنولوژی</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("cart")}
              className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-all duration-300 cursor-pointer"
              id="header-cart-button"
            >
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-fuchsia-600 text-white font-semibold font-mono text-[10px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic page tab rendering with transitions */}
        <main className="flex-1 overflow-y-auto pb-4">
          <AnimatePresence mode="wait">
            
            {/* 1. HOME TAB */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5 px-4 pt-3"
              >
                {/* Search Bar section */}
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="جستجوی آسان در محصولات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white leading-normal pl-4 pr-11 py-3.5 rounded-2xl border border-slate-100 text-slate-705 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-right text-slate-800"
                    id="search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Hero billboard banner slider */}
                {searchQuery === "" && (
                  <HomeBanner
                    banners={banners}
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                    openProductDetails={openProductDetails}
                  />
                )}

                {/* Categories Slider Filter carousel track */}
                <CategorySlider
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setActiveTab={setActiveTab}
                />

                {/* Product listing cards grid */}
                <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-slate-800 text-right">
                      {searchQuery ? "نتایج جستجو" : "جدیدترین محصولات"}
                    </h3>

                    {/* Quick sorting selectors */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      {(["popular", "cheap", "expensive"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSortBy(mode)}
                          className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            sortBy === mode
                              ? "bg-white text-slate-800 font-bold shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {mode === "popular"
                            ? "محبوب‌ترین"
                            : mode === "cheap"
                            ? "ارزان‌ترین"
                            : "گران‌ترین"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                      <AlertCircle className="w-11 h-11 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700">درحال حاضر محصولی پیدا نشد</p>
                      <p className="text-xs text-slate-400 mt-1">لطفاً عبارت دیگری را جستجو کنید.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3.5">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onOpenDetails={openProductDetails}
                          isSaved={wishlist.includes(p.id)}
                          toggleWishlist={toggleWishlist}
                          categoryTitle={CATEGORIES.find((c) => c.id === p.categoryId)?.title || ""}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. CATEGORIES GRID TAB */}
            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4 px-4 pt-3"
              >
                <div className="bg-gradient-to-tr from-indigo-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 text-right">
                  <h2 className="text-base font-extrabold">دسته‌بندی‌های مهران استور</h2>
                  <p className="text-xs text-white/80 mt-1">دسته‌بندی مورد نظر خود را انتخاب کرده و بر اساس آن خرید کنید.</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {CATEGORIES.map((cat) => {
                    const count = cat.id === "all" 
                      ? PRODUCTS.length 
                      : PRODUCTS.filter(p => p.categoryId === cat.id).length;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setActiveTab("home");
                        }}
                        className={`p-5 rounded-3xl border text-right cursor-pointer shadow-sm hover:shadow-md transition-all ${
                          selectedCategory === cat.id
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-white border-slate-100 text-slate-600"
                        }`}
                        id={`category-full-${cat.slug}`}
                      >
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-slate-50 text-slate-600">
                          <ChevronLeft className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{cat.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono font-medium block mt-1.5">
                          {toPersianDigits(count)} محصول موجود
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. SHOPPING CART TAB */}
            {activeTab === "cart" && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4 px-4 pt-3"
              >
                <h2 className="text-base font-extrabold text-slate-800 px-1 text-right">سبد خرید شما</h2>

                {cart.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">سبد خرید شما خالی است</p>
                      <p className="text-xs text-slate-400 mt-1">همین حالا می‌توانید از صفحه محصولات، سفارش خود را تکمیل کنید.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("home")}
                      className="bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition`colors cursor-pointer"
                    >
                      شروع خرید از مهران استور
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart list row rendering */}
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <CartListItem
                          key={item.id}
                          item={item}
                          updateCartQty={updateCartQty}
                        />
                      ))}
                    </div>

                    {/* Integrated Promo Coupon Section */}
                    <PromoSection
                      promoCodeInput={promoCodeInput}
                      setPromoCodeInput={setPromoCodeInput}
                      handleApplyPromo={handleApplyPromo}
                      promoError={promoError}
                      promoSuccess={promoSuccess}
                    />

                    {/* Cost check spreadsheet totals */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-50 shadow-sm space-y-3.5 text-right">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>جمع اقلام سبد خرید</span>
                        <span className="font-mono">{toPersianDigits(totals.subtotal.toLocaleString())} تومان</span>
                      </div>
                      
                      {totals.discount > 0 && (
                        <div className="flex justify-between items-center text-xs text-emerald-550 font-medium text-emerald-600">
                          <span>میزان تخفیف اعمال شده</span>
                          <span className="font-mono">-{toPersianDigits(totals.discount.toLocaleString())} تومان</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>هزینه بسته‌بندی و ارسال پست</span>
                        <span className="font-mono text-slate-600">
                          {totals.delivery === 0 ? "رایگان (خرید بالای ۵۰ میلیون)" : `${toPersianDigits(totals.delivery.toLocaleString())} تومان`}
                        </span>
                      </div>

                      <div className="h-[1px] bg-slate-100 my-2" />

                      <div className="flex justify-between items-center text-sm font-extrabold text-slate-800">
                        <span>مبلغ قابل پرداخت نهایی</span>
                        <span className="text-base text-indigo-600 font-mono">{formatToman(totals.total)}</span>
                      </div>
                    </div>

                    {/* Checkout activation button */}
                    {!isCheckingOut ? (
                      <button
                        onClick={() => setIsCheckingOut(true)}
                        className="w-full bg-indigo-600 text-white py-4 px-4 rounded-3xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors cursor-pointer"
                        id="start-checkout-button"
                      >
                        <Check className="w-4 h-4" />
                        ثبت نهایی و تکمیل اطلاعات پستی
                      </button>
                    ) : (
                      /* Shipping forms components */
                      <CheckoutForm
                        checkoutForm={checkoutForm}
                        setCheckoutForm={setCheckoutForm}
                        checkoutErrors={checkoutErrors}
                        handleCheckoutSubmit={handleCheckoutSubmit}
                        setIsCheckingOut={setIsCheckingOut}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* 4. PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5 px-4 pt-3"
              >
                {/* Placed successfully banner notification */}
                {orderJustPlaced && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 text-right relative overflow-hidden"
                  >
                    <div className="absolute -left-4 -bottom-4 text-emerald-100 pointer-events-none">
                      <Sparkles className="w-24 h-24 stroke-[4]" />
                    </div>
                    <div className="z-10 relative space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 justify-start">
                        <div className="w-7 h-7 bg-emerald-101 bg-emerald-200/50 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-emerald-800">سفارش شما با موفقیت ثبت شد!</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pr-9 pl-4">
                        سفارش گرانبهای شما با کد پیگیری <strong className="font-mono text-indigo-600">{toPersianDigits(orders.find(o => o.id === orderJustPlaced)?.trackingNumber || "")}</strong> با موفقیت ثبت شد. تبریک می‌گوییم!
                      </p>
                      <div className="pt-2 pr-9">
                        <button 
                          onClick={() => setOrderJustPlaced(null)}
                          className="text-[11px] font-extrabold text-indigo-600 underline hover:text-indigo-700 cursor-pointer"
                        >
                          تایید و بستن اعلان طلایی
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Profile card metadata details */}
                <div className="bg-white rounded-3xl p-5 border border-slate-50 shadow-sm text-right space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-lg font-bold">
                      م
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">مشتری مهمان (مهران عزیز)</h3>
                      <span className="text-[10px] text-slate-400 font-mono font-medium block mt-0.5">کاربر مهران استور</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-50">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-medium">کدهای تخفیف در دسترس</span>
                      <strong className="text-xs text-indigo-600 font-mono block">MEHRAN2026</strong>
                    </div>
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] text-slate-400 block font-medium">نسخه اپلیکیشن</span>
                      <strong className="text-xs text-slate-600 font-mono block">v2.4.0-Beta</strong>
                    </div>
                  </div>
                </div>

                {/* Progressive Order card simulator stepper list */}
                <div className="space-y-3.5 text-right">
                  <h3 className="text-sm font-bold text-slate-800">سفارشات اخیر و پیگیری مرسوله‌ها</h3>
                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400">تاکنون سفارشی از سمت شما ثبت نشده است.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <OrderCard
                          key={ord.id}
                          order={ord}
                          advanceOrderStatus={advanceOrderStatus}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Dynamic bottom-sheet specification modal */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              modalColor={modalColor}
              setModalColor={setModalColor}
              modalQty={modalQty}
              setModalQty={setModalQty}
              addToCart={addToCart}
            />
          )}
        </AnimatePresence>

        {/* App-like persistent Bottom navigation bar */}
        <nav className="bg-white border-t border-slate-100 py-3.5 px-6 flex justify-between items-center shrink-0 z-20">
          {[
            { id: "home", label: "خانه", tabId: "home" },
            { id: "categories", label: "دسته‌ها", tabId: "categories" },
            { id: "cart", label: "سبد خرید", tabId: "cart" },
            { id: "profile", label: "پیگیری", tabId: "profile" }
          ].map((navItem) => {
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => {
                  setActiveTab(navItem.id as any);
                  setOrderJustPlaced(null); // Clear placement toast when navigating
                }}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  isActive ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
                id={`nav-${navItem.id}-tab`}
              >
                <div
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    isActive ? "bg-indigo-50 font-bold" : ""
                  }`}
                >
                  <span className="text-xs font-bold font-sans">{navItem.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
