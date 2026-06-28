/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  TrendingUp,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle,
  Trash2,
  Phone,
  AlertTriangle,
  User,
  ShoppingBag,
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface ManageOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export default function ManageOrdersView({
  orders,
  onUpdateOrderStatus,
  onClearHistory,
  onClose,
}: ManageOrdersViewProps) {
  const [filterTab, setFilterTab] = useState<"All" | OrderStatus>("All");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Stats calculation
  const totalSales = orders
    .filter((o) => o.status !== OrderStatus.Returned && o.status !== OrderStatus.Refunded)
    .reduce((acc, o) => acc + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === OrderStatus.Pending).length;
  const shippedCount = orders.filter((o) => o.status === OrderStatus.Shipped).length;
  const refundRequestsCount = orders.filter((o) => o.status === OrderStatus.Returned).length;

  const filteredOrders = orders.filter((order) => {
    if (filterTab === "All") return true;
    return order.status === filterTab;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Owner's Order Desk</span>
            <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full font-mono">
              Live Console
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage shipping states, deliveries, and instant refund triggers</p>
        </div>

        {/* Clear History button with safe inline confirmation */}
        <div className="flex items-center gap-3">
          {showClearConfirm ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 p-1.5 rounded-xl animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold text-red-600 px-2">Clear all orders?</span>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 border border-red-100 hover:bg-red-50 text-red-600 hover:text-red-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>

      {/* Stats Bento Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <h4 className="text-lg font-bold font-mono text-slate-800">₹{totalSales.toFixed(2)}</h4>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Excludes refunds</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-amber-50/50 border border-amber-100/60 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <h4 className="text-lg font-bold font-mono text-slate-800">{pendingCount}</h4>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Awaiting shipment</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-sky-50/50 border border-sky-100/60 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">In Transit</span>
            <Truck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <h4 className="text-lg font-bold font-mono text-slate-800">{shippedCount}</h4>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Out for delivery</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-rose-50/50 border border-rose-100/60 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Refund Requests</span>
            <RotateCcw className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <h4 className="text-lg font-bold font-mono text-slate-800">{refundRequestsCount}</h4>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">Need attention</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-xl">
        {(["All", OrderStatus.Pending, OrderStatus.Shipped, OrderStatus.Delivered, OrderStatus.Returned, OrderStatus.Refunded] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === tab
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            {tab === "All" ? "All Orders" : tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
          <ShoppingBag className="w-8 h-8 text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-700 text-sm">No orders found</h4>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Orders in state "{filterTab}" will appear here once placed by customers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            // Compute status classes
            const statusColors = {
              [OrderStatus.Pending]: "bg-amber-50 border-amber-100 text-amber-700",
              [OrderStatus.Shipped]: "bg-sky-50 border-sky-100 text-sky-700",
              [OrderStatus.Delivered]: "bg-emerald-50 border-emerald-100 text-emerald-700",
              [OrderStatus.Returned]: "bg-rose-50 border-rose-100 text-rose-700",
              [OrderStatus.Refunded]: "bg-slate-50 border-slate-100 text-slate-500",
            };

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-100/80 hover:border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 transition-all animate-in fade-in duration-200"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-700">{order.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-3">{order.date}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer Block */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.phone}</span>
                    </div>
                  </div>

                  {/* Fulfillment Block */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment</p>
                    <p className="font-semibold text-slate-700">{order.fulfillment}</p>
                    <p className="text-slate-500 leading-relaxed truncate max-w-[200px]" title={order.address}>
                      {order.address}
                    </p>
                  </div>

                  {/* Items Summary & Total */}
                  <div className="space-y-1.5 text-xs md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment & Total</p>
                    <p className="font-semibold text-slate-700">{order.paymentMethod}</p>
                    <p className="font-bold text-sm text-indigo-700 font-mono">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Ordered Items details */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 font-medium">
                      <span>
                        {item.productName} <span className="text-[10px] text-slate-400 font-mono">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Manage Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-50">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Modify Delivery Phase:
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === OrderStatus.Pending && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.Shipped)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === OrderStatus.Shipped && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.Delivered)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark as Delivered
                      </button>
                    )}

                    {order.status === OrderStatus.Returned && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.Refunded)}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Approve Refund & Close
                      </button>
                    )}

                    {order.status === OrderStatus.Delivered && (
                      <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Delivered & Completed
                      </span>
                    )}

                    {order.status === OrderStatus.Refunded && (
                      <span className="text-[11px] text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        Refunded / Returned
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
