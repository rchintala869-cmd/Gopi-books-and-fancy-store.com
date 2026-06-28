/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Trash2, ShoppingBag, MapPin, Store, CreditCard, DollarSign, Send, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { CartItem, FulfillmentType, PaymentMethod, Order, OrderStatus } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  onPhonePeTrigger: (amount: number, callback: () => void) => void;
  helpline: string;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onPhonePeTrigger,
  helpline,
}: CartSidebarProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "success">("cart");
  
  // Checkout form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>(FulfillmentType.StorePickup);
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.COD);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleNextStep = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep("details");
  };

  const handleBackToCart = () => {
    setCheckoutStep("cart");
  };

  const executeOrderSubmission = () => {
    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const finalOrderInfo = {
      customerName: name.trim() || "Guest Customer",
      phone: phone.trim() || helpline,
      address: fulfillment === FulfillmentType.HomeDelivery ? address.trim() : "Store Counter Pickup",
      items: orderItems,
      total: totalAmount,
      fulfillment,
      paymentMethod: payment,
    };

    // Callback on final order placement success
    const onSuccessfulPlacement = () => {
      // Mock placing order with temporary random id
      const orderId = `GP-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedOrder: Order = {
        ...finalOrderInfo,
        id: orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: OrderStatus.Pending,
      };

      setPlacedOrder(completedOrder);
      onPlaceOrder(finalOrderInfo);
      setCheckoutStep("success");
    };

    if (payment === PaymentMethod.PhonePe) {
      // Fire PhonePe trigger
      onPhonePeTrigger(totalAmount, onSuccessfulPlacement);
    } else {
      // COD directly places
      onSuccessfulPlacement();
    }
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide your name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (fulfillment === FulfillmentType.HomeDelivery && !address.trim()) {
      alert("Please specify a home delivery shipping address.");
      return;
    }

    executeOrderSubmission();
  };

  // Compile WhatsApp receipt message and open link
  const sendWhatsAppReceipt = () => {
    if (!placedOrder) return;

    let itemsStr = "";
    placedOrder.items.forEach((item, index) => {
      itemsStr += `${index + 1}. *${item.productName}* [x${item.quantity}] - ₹${item.price * item.quantity}\n`;
    });

    const receiptText = `*ORDER RECEIPT - GOPI BOOKS & FANCYSTORE*\n` +
      `----------------------------------------\n` +
      `*Order ID:* ${placedOrder.id}\n` +
      `*Date:* ${placedOrder.date}\n` +
      `*Customer:* ${placedOrder.customerName}\n` +
      `*Phone:* ${placedOrder.phone}\n` +
      `*Fulfillment:* ${placedOrder.fulfillment}\n` +
      `*Payment:* ${placedOrder.paymentMethod}\n` +
      `*Shipping Status:* ${placedOrder.status}\n` +
      `----------------------------------------\n` +
      `*ITEMS ORDERED:*\n${itemsStr}` +
      `----------------------------------------\n` +
      `*GRAND TOTAL:* ₹${placedOrder.total.toFixed(2)}\n\n` +
      `Thank you for shopping with Gopi Books & Fancystore! Please message us here to confirm your delivery details.`;

    const encodedText = encodeURIComponent(receiptText);
    const whatsappUrl = `https://wa.me/91${helpline}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const resetAll = () => {
    setCheckoutStep("cart");
    setName("");
    setPhone("");
    setAddress("");
    setFulfillment(FulfillmentType.StorePickup);
    setPayment(PaymentMethod.COD);
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {checkoutStep === "cart" ? "Shopping Cart" : checkoutStep === "details" ? "Secure Checkout" : "Order Confirmed!"}
          </h2>
          {cartItems.length > 0 && checkoutStep === "cart" && (
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {cartItems.length}
            </span>
          )}
        </div>
        <button
          onClick={checkoutStep === "success" ? resetAll : onClose}
          className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Views */}
      <div className="flex-1 overflow-y-auto p-5">
        
        {/* VIEW 1: CART ITEMS */}
        {checkoutStep === "cart" && (
          <div className="h-full flex flex-col justify-between">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="bg-slate-50 p-5 rounded-full border border-slate-100 mb-4">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 text-sm">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Browse products, click on items, and add them to your cart to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 animate-in fade-in duration-150"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.photo}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                        {item.product.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800 truncate mt-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">₹{item.product.price}</p>
                      
                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-5 h-5 bg-white border border-slate-200 text-slate-500 text-xs rounded flex items-center justify-center hover:bg-slate-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold font-mono text-slate-700 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-5 h-5 bg-white border border-slate-200 text-slate-500 text-xs rounded flex items-center justify-center hover:bg-slate-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Delete item */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-400 transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Total Block */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 pt-5 mt-5">
                <div className="flex items-center justify-between mb-4 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Cart Total</span>
                  <span className="text-lg font-bold text-indigo-700 font-mono">₹{totalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CHECKOUT DETAILS FORM */}
        {checkoutStep === "details" && (
          <form onSubmit={handleSubmitCheckout} className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100/60 rounded-2xl p-3 flex gap-3 items-center">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-[11px] text-indigo-800 leading-relaxed font-sans">
                  Choose your pickup preference and complete billing details. Payments are safe and fully encrypted.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Contact Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Fulfillment Option */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Delivery Preference *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillment(FulfillmentType.StorePickup)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      fulfillment === FulfillmentType.StorePickup
                        ? "border-indigo-600 bg-indigo-50/40 text-indigo-700"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    Take in Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillment(FulfillmentType.HomeDelivery)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      fulfillment === FulfillmentType.HomeDelivery
                        ? "border-indigo-600 bg-indigo-50/40 text-indigo-700"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Home Delivery
                  </button>
                </div>
              </div>

              {/* Address (conditional) */}
              {fulfillment === FulfillmentType.HomeDelivery && (
                <div className="animate-in slide-in-from-top-1 duration-150">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide full flat/house number, colony, city, pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayment(PaymentMethod.COD)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      payment === PaymentMethod.COD
                        ? "border-indigo-600 bg-indigo-50/40 text-indigo-700"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment(PaymentMethod.PhonePe)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      payment === PaymentMethod.PhonePe
                        ? "border-indigo-600 bg-indigo-50/40 text-indigo-700"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    PhonePe Scanner
                  </button>
                </div>
              </div>
            </div>

            {/* Total & Place Order Button */}
            <div className="border-t border-slate-100 pt-5 mt-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-500 font-bold">Checkout Total</span>
                <span className="text-base font-bold font-mono text-slate-800">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  {payment === PaymentMethod.PhonePe ? "Pay with PhonePe" : "Confirm Order (COD)"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* VIEW 3: SUCCESS CONFIRMATION & RECEIPT */}
        {checkoutStep === "success" && placedOrder && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-50 text-emerald-500 p-3.5 rounded-full border border-emerald-100 shadow-xs mb-3">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Receipt Compiled!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your order ID is <span className="font-mono font-bold text-slate-600">{placedOrder.id}</span>
              </p>
            </div>

            {/* High fidelity digital receipt mockup */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left space-y-3 font-sans">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-dashed border-slate-200">
                <span>Gopi Store Receipt</span>
                <span>{placedOrder.date.split(",")[0]}</span>
              </div>
              
              <div className="space-y-1.5 text-xs text-slate-600 border-b border-dashed border-slate-200 pb-2">
                <p><span className="font-bold text-slate-400">Customer:</span> {placedOrder.customerName}</p>
                <p><span className="font-bold text-slate-400">Fulfillment:</span> {placedOrder.fulfillment}</p>
                <p><span className="font-bold text-slate-400">Method:</span> {placedOrder.paymentMethod}</p>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {placedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-600 font-sans">
                    <span className="truncate max-w-[180px] font-medium">{item.productName} <span className="text-slate-400 text-[10px] font-mono">x{item.quantity}</span></span>
                    <span className="font-semibold text-slate-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200">
                <span className="text-xs font-bold text-slate-700">Grand Total</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">₹{placedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* WhatsApp receipt action */}
            <div className="space-y-3 pt-3">
              <button
                onClick={sendWhatsAppReceipt}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl text-xs font-bold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 fill-white text-emerald-500" />
                <span>Send Receipt via WhatsApp</span>
              </button>

              <button
                onClick={resetAll}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
