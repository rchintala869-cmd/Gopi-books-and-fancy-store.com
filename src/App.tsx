/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Eye,
  Plus,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ClipboardList,
  Store,
  User,
  PlusCircle,
  HelpCircle,
  PackageCheck
} from "lucide-react";
import { Product, CartItem, Order, OrderStatus } from "./types";
import { INITIAL_PRODUCTS, CATEGORIES } from "./data";
import FlipEducationCard from "./components/FlipEducationCard";
import PhonePeModal from "./components/PhonePeModal";
import ProductForm from "./components/ProductForm";
import CartSidebar from "./components/CartSidebar";
import ManageOrdersView from "./components/ManageOrdersView";
import OrderHistoryView from "./components/OrderHistoryView";
import ProductDetailModal from "./components/ProductDetailModal";

const HELPLINE_NUMBER = "9704329354";

export default function App() {
  // Local storage synchronized states
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Search and Category filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // UI Modal / View visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);

  // PhonePe Scanner execution states
  const [isPhonePeOpen, setIsPhonePeOpen] = useState(false);
  const [phonePeAmount, setPhonePeAmount] = useState(0);
  const [phonePeSuccessCallback, setPhonePeSuccessCallback] = useState<(() => void) | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const localProds = localStorage.getItem("gopi_products");
    if (localProds) {
      setProducts(JSON.parse(localProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("gopi_products", JSON.stringify(INITIAL_PRODUCTS));
    }

    const localCart = localStorage.getItem("gopi_cart");
    if (localCart) setCart(JSON.parse(localCart));

    const localOrders = localStorage.getItem("gopi_orders");
    if (localOrders) setOrders(JSON.parse(localOrders));

    const localWishlist = localStorage.getItem("gopi_wishlist");
    if (localWishlist) setWishlist(JSON.parse(localWishlist));

    const localWatchlist = localStorage.getItem("gopi_watchlist");
    if (localWatchlist) setWatchlist(JSON.parse(localWatchlist));
  }, []);

  // Sync state modifications to local storage
  const saveProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem("gopi_products", JSON.stringify(updatedProds));
  };

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("gopi_cart", JSON.stringify(updatedCart));
  };

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("gopi_orders", JSON.stringify(updatedOrders));
  };

  const saveWishlist = (updatedWishlist: string[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("gopi_wishlist", JSON.stringify(updatedWishlist));
  };

  const saveWatchlist = (updatedWatchlist: string[]) => {
    setWatchlist(updatedWatchlist);
    localStorage.setItem("gopi_watchlist", JSON.stringify(updatedWatchlist));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const nextCart = cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(nextCart);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    // Launch sidebar instantly to provide tactile feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const nextCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: nextQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(nextCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const nextCart = cart.filter((item) => item.product.id !== productId);
    saveCart(nextCart);
  };

  // Wishlist and Watch List toggles
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    saveWishlist(next);
  };

  const handleToggleWatchlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = watchlist.includes(productId)
      ? watchlist.filter((id) => id !== productId)
      : [...watchlist, productId];
    saveWatchlist(next);
  };

  // Owner action: Add custom product
  const handleAddProduct = (newProductData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  // Order submission
  const handlePlaceOrder = (newOrderInfo: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...newOrderInfo,
      id: `GP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: OrderStatus.Pending,
    };
    saveOrders([...orders, newOrder]);
    // Clear cart upon ordering
    saveCart([]);
  };

  // PhonePe scanning trigger
  const handlePhonePeTrigger = (amount: number, callback: () => void) => {
    setPhonePeAmount(amount);
    setPhonePeSuccessCallback(() => callback);
    setIsPhonePeOpen(true);
  };

  const handlePhonePeSuccess = () => {
    if (phonePeSuccessCallback) {
      phonePeSuccessCallback();
    }
    setIsPhonePeOpen(false);
    setPhonePeSuccessCallback(null);
  };

  // Manage Order States
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nextOrders = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(nextOrders);
  };

  const handleRequestReturn = (orderId: string) => {
    const nextOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: OrderStatus.Returned } : o
    );
    saveOrders(nextOrders);
    alert("Return & refund request filed! The owner has been notified.");
  };

  const handleClearHistory = () => {
    saveOrders([]);
  };

  // Filters catalog
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-16">
      
      {/* Dynamic Nav Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base md:text-lg tracking-tight text-slate-900 leading-none">
                Gopi Books
              </h1>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                & Fancystore
              </span>
            </div>
          </div>

          {/* Quick Helpline banner and links */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${HELPLINE_NUMBER}`}
              className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-xs font-bold text-slate-600"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Call Helpline: {HELPLINE_NUMBER}</span>
            </a>

            {/* Cart Button with bubble count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-indigo-700 transition-all cursor-pointer shadow-3xs"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white font-mono text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* BENTO ROW 1: Welcome Header block & Live Order Status Tracker Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Big brand intro dashboard & Help contacts (col-span-7) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#1E1B4B] via-slate-950 to-indigo-950 text-white p-6 md:p-8 rounded-[24px] border border-slate-800/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                ★ Premium Student Hub & Accessories
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight max-w-xl">
                Welcome to Gopi Books <br />
                <span className="text-indigo-400">& Fancystore</span>
              </h2>
              <p className="text-slate-300 text-xs md:text-sm max-w-lg leading-relaxed">
                Your one-stop academic and design center. We supply quality curriculum textbooks, luxury pens, spiral journals, fancy keychains, gifts, and ethnic ornaments.
              </p>
            </div>

            {/* Helpline Container inside Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="bg-indigo-600/25 p-2 rounded-xl text-indigo-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Helpline</p>
                  <a href={`tel:${HELPLINE_NUMBER}`} className="text-sm font-bold font-mono text-white hover:text-indigo-300">
                    {HELPLINE_NUMBER}
                  </a>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="bg-emerald-600/25 p-2 rounded-xl text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Inquiry</p>
                  <a
                    href={`https://wa.me/91${HELPLINE_NUMBER}?text=Hi%20Gopi%20Books%20and%20Fancystore!`}
                    target="_blank"
                    className="text-sm font-bold font-mono text-white hover:text-emerald-300"
                  >
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Live Order Status Tracker Card (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="text-slate-800 font-bold border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600" />
                  <span>Live Order Status</span>
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Real-time
                </span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-600">Pending Orders</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {orders.filter((o) => o.status === "Pending").length.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-slate-600">Shipped</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {orders.filter((o) => o.status === "Shipped").length.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-slate-600">Delivered</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {orders.filter((o) => o.status === "Delivered").length.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-slate-600">Refund Requested/Refunded</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {orders.filter((o) => o.status === "Refund Requested" || o.status === "Refunded / Returned" || o.status === "Refunded" || o.status === "Returned").length.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear order history?")) {
                  handleClearHistory();
                }
              }}
              disabled={orders.length === 0}
              className={`w-full mt-5 py-2.5 border border-dashed text-xs font-bold rounded-xl transition-all ${
                orders.length === 0
                  ? "border-slate-100 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 hover:bg-red-50/30 cursor-pointer"
              }`}
            >
              Clear Status History
            </button>
          </div>

        </div>

        {/* BENTO ROW 2: Orientation Flip card, Stats Summary Card, and Owner Dashboard Toggle Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Cell 3: Symmetric Inspiration Flip Card (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <FlipEducationCard />
          </div>

          {/* Bento Cell 4: Stats/Cart Summary Card (col-span-4) */}
          <div className="lg:col-span-4 bg-slate-50 border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-around">
            <div
              onClick={() => {
                const wishListElement = document.getElementById("saved-wishlist-container");
                if (wishListElement) wishListElement.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-center cursor-pointer group"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1 group-hover:text-rose-500 transition-colors">Wishlist</p>
              <p className="text-2xl font-black text-slate-700 font-mono group-hover:scale-105 transition-transform">{wishlist.length.toString().padStart(2, "0")}</p>
            </div>
            
            <div className="w-px h-10 bg-slate-200"></div>
            
            <div
              onClick={() => setIsCartOpen(true)}
              className="text-center cursor-pointer group"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1 group-hover:text-indigo-600 transition-colors">Cart</p>
              <p className="text-2xl font-black text-slate-700 font-mono group-hover:scale-105 transition-transform">
                {cart.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, "0")}
              </p>
            </div>
            
            <div className="w-px h-10 bg-slate-200"></div>
            
            <div
              onClick={() => {
                const watchListElement = document.getElementById("saved-watchlist-container");
                if (watchListElement) watchListElement.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-center cursor-pointer group"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1 group-hover:text-indigo-600 transition-colors">Watchlist</p>
              <p className="text-2xl font-black text-slate-700 font-mono group-hover:scale-105 transition-transform">{watchlist.length.toString().padStart(2, "0")}</p>
            </div>
          </div>

          {/* Bento Cell 5: Owner Portal / Manage Orders Toggle Card (col-span-3) */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] p-6 text-white rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-3">Owner Portal</p>
            
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  setIsOrdersOpen(!isOrdersOpen);
                  setIsHistoryOpen(false);
                }}
                className="w-full bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {isOrdersOpen ? "Close Orders Portal" : "Manage Orders"}
              </button>
              
              <button
                onClick={() => setIsProductFormOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer text-white active:scale-[0.98]"
              >
                Add New Product
              </button>
            </div>
          </div>

        </div>

        {/* Conditional Owner view or Customer view panels */}
        {isOrdersOpen && (
          <div className="animate-in fade-in duration-200">
            <ManageOrdersView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onClearHistory={handleClearHistory}
              onClose={() => setIsOrdersOpen(false)}
            />
          </div>
        )}

        {isHistoryOpen && (
          <div className="animate-in fade-in duration-200">
            <OrderHistoryView
              orders={orders}
              onRequestReturn={handleRequestReturn}
              onClose={() => setIsHistoryOpen(false)}
            />
          </div>
        )}

        {/* BENTO ROW 3: Explorer filters and search */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Title */}
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-800 tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Shop Handpicked Catalog</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore premium school supplies & fancy giftware</p>
            </div>

            {/* Direct Top Plus Button */}
            <button
              onClick={() => setIsProductFormOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search bar and Category pills */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center pt-2">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by title, category, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E2E8F0] text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all bg-[#F8FAFC]"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* BENTO ROW 4: Main Product Catalogue Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] p-12 text-center rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">No items found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Your search query did not yield any matches. Try selecting a different category or clearing the search text.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Add Product grid shortcut */}
              <div
                onClick={() => setIsProductFormOpen(true)}
                className="aspect-auto min-h-[280px] border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/40 p-6 rounded-[24px] flex flex-col items-center justify-center text-center group cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full group-hover:scale-110 transition-transform shadow-3xs">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-display font-bold text-sm text-slate-800 mt-4">Add New Product</h4>
                <p className="text-[11px] text-slate-400 max-w-[150px] mt-1.5 leading-relaxed">
                  Click to open catalog registration form and list new items
                </p>
              </div>

              {/* Product cards list */}
              {filteredProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                const isWatched = watchlist.includes(prod.id);

                return (
                  <div
                    key={prod.id}
                    onClick={() => setActiveProductDetail(prod)}
                    className="group relative bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer"
                  >
                    {/* Floating elements */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="bg-slate-950/85 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        {prod.category}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5 z-10 flex gap-1.5">
                      <button
                        onClick={(e) => handleToggleWishlist(prod.id, e)}
                        className={`p-2 rounded-full shadow-md backdrop-blur-xs transition-transform active:scale-95 ${
                          isWishlisted
                            ? "bg-rose-500 text-white"
                            : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => handleToggleWatchlist(prod.id, e)}
                        className={`p-2 rounded-full shadow-md backdrop-blur-xs transition-transform active:scale-95 ${
                          isWatched
                            ? "bg-indigo-600 text-white"
                            : "bg-white/90 text-slate-400 hover:text-indigo-600 hover:bg-white"
                        }`}
                        title="Add to Watch List"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="aspect-square bg-slate-50 overflow-hidden relative">
                      <img
                        src={prod.photo}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Buy Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <span className="font-mono font-bold text-slate-800 text-sm">₹{prod.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid opening the detail modal when adding to cart
                            handleAddToCart(prod);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          + Cart
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* BENTO ROW 5: Symmetric Saved Tab: Wishlist & Watchlist side-by-side columns */}
        {(wishlist.length > 0 || watchlist.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Wishlist Column */}
            <div id="saved-wishlist-container" className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-sm text-slate-800">Saved Wishlist ({wishlist.length})</h3>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No favorites added yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto">
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setActiveProductDetail(prod)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100/50 hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.photo}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                            {prod.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-800">₹{prod.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-lg text-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Watch List Column */}
            <div id="saved-watchlist-container" className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800">Live Watch List ({watchlist.length})</h3>
              </div>

              {watchlist.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No upcoming textbooks or fancy trackers.</p>
              ) : (
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto">
                  {products
                    .filter((p) => watchlist.includes(p.id))
                    .map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setActiveProductDetail(prod)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100/50 hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.photo}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                            {prod.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-800">₹{prod.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-lg text-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Floating Sidebars and Modals */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
        onPhonePeTrigger={handlePhonePeTrigger}
        helpline={HELPLINE_NUMBER}
      />

      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <PhonePeModal
        isOpen={isPhonePeOpen}
        onClose={() => setIsPhonePeOpen(false)}
        amount={phonePeAmount}
        onPaymentSuccess={handlePhonePeSuccess}
      />

      <ProductDetailModal
        product={activeProductDetail}
        onClose={() => setActiveProductDetail(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={activeProductDetail ? wishlist.includes(activeProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isWatched={activeProductDetail ? watchlist.includes(activeProductDetail.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        helpline={HELPLINE_NUMBER}
      />

    </div>
  );
}
