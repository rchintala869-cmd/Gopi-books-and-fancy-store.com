/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { X, Camera, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import { Product } from "../types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, "id">) => void;
}

const PRESET_IMAGES = [
  {
    name: "A4 Notebook",
    url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Novels Pile",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Luxury Pen",
    url: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Fancy Toy",
    url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&q=80&w=400",
  },
];

export default function ProductForm({ isOpen, onClose, onAddProduct }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Stationery");
  const [customCategory, setCustomCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [photoSource, setPhotoSource] = useState<"upload" | "preset">("preset");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
        setPreviewSrc(base64String);
        setPhotoSource("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (url: string) => {
    setPhoto(url);
    setPreviewSrc(url);
    setPhotoSource("preset");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || (!photo && !previewSrc)) {
      alert("Please fill out all fields and select a product photo.");
      return;
    }

    const resolvedCategory = category === "Custom" ? customCategory.trim() || "Fancy Items" : category;
    
    onAddProduct({
      name: name.trim(),
      price: parseFloat(price) || 0,
      description: description.trim(),
      photo: photo || previewSrc,
      category: resolvedCategory,
      isCustom: true,
    });

    // Reset Form
    setName("");
    setPrice("");
    setDescription("");
    setCategory("Stationery");
    setCustomCategory("");
    setPhoto("");
    setPreviewSrc("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">Add New Product</h3>
              <p className="text-xs text-slate-400">Expand store catalogs & set custom prices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Premium Fountain Pen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Price & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Stationery">Stationery</option>
                <option value="Books">Books</option>
                <option value="Fancy Items">Fancy Items</option>
                <option value="Custom">Custom Category...</option>
              </select>
            </div>
          </div>

          {/* Custom Category Input */}
          {category === "Custom" && (
            <div className="animate-in slide-in-from-top-1 duration-150">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Custom Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Toys, Giftware"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Product Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail specs, paper weight, dimension, colors..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Photo upload / Camera or Preset options */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Product Photo *
            </label>
            
            {/* Direct Connect to Mobile Camera / Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all text-xs font-bold cursor-pointer"
              >
                <Camera className="w-4 h-4 text-indigo-500" />
                <span>Upload / Take Photo</span>
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment" // Forces back camera on mobile phones
                className="hidden"
              />

              <div className="text-center sm:text-left flex items-center justify-center sm:justify-start text-[11px] text-slate-400 italic font-mono leading-relaxed px-2">
                *Tapping "Upload" on mobile directly requests Camera permissions to instantly click photos.
              </div>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Or choose a beautiful cover preset:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => selectPreset(preset.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      photoSource === "preset" && previewSrc === preset.url
                        ? "border-indigo-600 ring-2 ring-indigo-500/25 scale-95"
                        : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[8px] text-white py-0.5 truncate text-center">
                      {preset.name}
                    </span>
                    {photoSource === "preset" && previewSrc === preset.url && (
                      <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview Container */}
            {previewSrc && (
              <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50 flex items-center gap-4 animate-in fade-in duration-150">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-xs flex-shrink-0">
                  <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 truncate">Photo selected successfully</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">
                    Source: {photoSource === "upload" ? "Device Camera / Storage" : "Asset Preset"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto("");
                    setPreviewSrc("");
                  }}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg"
            >
              Add to Catalog
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
