/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, Truck, CheckCircle, RotateCcw, ShieldCheck, AlertCircle, ShoppingBag } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderHistoryViewProps {
  orders: Order[];
  onRequestReturn: (orderId: string) => void;
  onClose: () => void;
}

export default function OrderHistoryView({
  orders,
  onRequestReturn,
  onClose,
}: OrderHistoryViewProps) {
  
  // Sort orders with newest first
  const sortedOrders = [...orders].reverse();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>My Purchase History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track shipping progress and file simple refund or exchange requests</p>
        </div>
        <button
          onClick={onClose}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
        >
          Close History
        </button>
      </div>

      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
          <Clock className="w-8 h-8 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-600 text-sm">No orders yet</h4>
          <p className="text-xs text-slate-400 max-w-[220px] mt-1">
            Once you check out items from your shopping cart, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedOrders.map((order) => {
            // Setup status style mappings
            const statusConfig = {
              [OrderStatus.Pending]: {
                label: "Awaiting Shipping",
                color: "text-amber-600 bg-amber-50 border-amber-100",
                icon: Clock,
                step: 1,
              },
              [OrderStatus.Shipped]: {
                label: "Shipped & In Transit",
                color: "text-sky-600 bg-sky-50 border-sky-100",
                icon: Truck,
                step: 2,
              },
              [OrderStatus.Delivered]: {
                label: "Delivered Successfully",
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                icon: CheckCircle,
                step: 3,
              },
              [OrderStatus.Returned]: {
                label: "Refund / Return Requested",
                color: "text-rose-600 bg-rose-50 border-rose-100",
                icon: RotateCcw,
                step: 4,
              },
              [OrderStatus.Refunded]: {
                label: "Refund Approved",
                color: "text-slate-500 bg-slate-100 border-slate-200",
                icon: ShieldCheck,
                step: 5,
              },
            };

            const currentStatus = statusConfig[order.status];
            const StatusIcon = currentStatus.icon;

            return (
              <div
                key={order.id}
                className="border border-slate-100 rounded-2xl p-4 md:p-5 space-y-4 hover:border-slate-200/80 transition-all animate-in fade-in duration-200"
              >
                {/* Order Top Summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-700">{order.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-white shadow-3xs">
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className={currentStatus.color.split(" ")[0]}>{currentStatus.label}</span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                {order.status !== OrderStatus.Returned && order.status !== OrderStatus.Refunded && (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between max-w-xs mx-auto">
                      {/* Progress Line Background */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded-full" />
                      {/* Active Progress Line */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-500 rounded-full"
                        style={{
                          width: `${currentStatus.step === 1 ? "10%" : currentStatus.step === 2 ? "50%" : "100%"}`,
                        }}
                      />

                      {/* Step 1: Pending */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all ${
                            currentStatus.step >= 1
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          1
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Order</span>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all ${
                            currentStatus.step >= 2
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          2
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Shipped</span>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all ${
                            currentStatus.step >= 3
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          3
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Receive</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Summary list */}
                <div className="space-y-2 border-b border-slate-50 pb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-600 font-sans">
                      <span className="truncate max-w-[200px] font-medium">
                        {item.productName} <span className="text-[10px] text-slate-400 font-mono">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-slate-700">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer totals and action return buttons */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-1">
                  <div className="text-xs text-slate-500">
                    Total Payment: <span className="font-bold text-slate-800 font-mono">₹{order.total.toFixed(2)}</span> via{" "}
                    <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                  </div>

                  {/* Return Button conditional */}
                  {order.status === OrderStatus.Delivered && (
                    <button
                      onClick={() => onRequestReturn(order.id)}
                      className="flex items-center gap-1 text-rose-600 hover:text-rose-700 border border-rose-100 bg-rose-50/30 hover:bg-rose-50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-3xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return / Refund</span>
                    </button>
                  )}

                  {order.status === OrderStatus.Returned && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold bg-rose-50/50 border border-rose-100/50 px-3 py-1 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Awaiting Owner Review</span>
                    </div>
                  )}

                  {order.status === OrderStatus.Refunded && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold bg-emerald-50/50 border border-emerald-100/50 px-3 py-1 rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Refund Cleared</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
