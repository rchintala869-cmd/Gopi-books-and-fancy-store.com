/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ShoppingCart, MessageSquare, Heart, Eye } from "lucide-react";
import { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isWatched: boolean;
  onToggleWatchlist: (productId: string) => void;
  helpline: string;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isWatched,
  onToggleWatchlist,
  helpline,
}: ProductDetailModalProps) {
  if (!product) return null;

  const handleWhatsAppInquiry = () => {
    const text = `Hello Gopi Store! I am interested in inquiring about this product:\n\n` +
      `*Product:* ${product.name}\n` +
      `*Category:* ${product.category}\n` +
      `*Price:* ₹${product.price}\n\n` +
      `Is this item currently in stock or available for pickup/delivery? Thanks!`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/91${helpline}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Product Image with Floating Badges */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[380px] bg-slate-50 flex-shrink-0">
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Quick toggle float buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2.5 rounded-full shadow-md transition-transform active:scale-95 ${
                isWishlisted
                  ? "bg-rose-500 text-white"
                  : "bg-white text-slate-400 hover:text-rose-500"
              }`}
              title="Add to Wishlist"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={() => onToggleWatchlist(product.id)}
              className={`p-2.5 rounded-full shadow-md transition-transform active:scale-95 ${
                isWatched
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-400 hover:text-indigo-600"
              }`}
              title="Add to Watch List"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Details Form */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:static md:self-end p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 mt-4 md:mt-2 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                Gopi Store Catalog
              </span>
              <h3 className="font-display font-extrabold text-lg md:text-xl text-slate-800 tracking-tight leading-snug">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-slate-800 font-mono">₹{product.price}</span>
              {product.isCustom && (
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  Owner Added
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Specs & Info</p>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-sans font-medium">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-slate-100 pt-5 mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </button>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
