/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Check, Copy, X, QrCode, ArrowUpRight, PhoneCall } from "lucide-react";

interface PhonePeModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

export default function PhonePeModal({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
}: PhonePeModalProps) {
  const [copied, setCopied] = useState(false);
  const upiId = "Q687116097@ybl";
  const payeeName = "Gopi Books and Fancystore";
  
  if (!isOpen) return null;

  // Generate real upi link
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Gopi Store Checkout")}`;
  
  // Use QR Code API to generate a scan-ready QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Block with PhonePe branding */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <QrCode className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">PhonePe Scanner</h3>
              <p className="text-xs text-purple-200">Secure UPI Payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/15 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Instruction */}
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Scan and Pay
            </span>
            <p className="text-slate-500 text-xs max-w-xs mt-1">
              Scan the QR code below using any UPI app (PhonePe, Google Pay, Paytm, etc.) to complete your payment of:
            </p>
          </div>

          {/* Amount Badge */}
          <div className="mb-5 bg-slate-50 border border-slate-100 px-6 py-2.5 rounded-2xl flex flex-col items-center">
            <span className="text-xs text-slate-400 font-mono">TOTAL AMOUNT</span>
            <span className="text-2xl font-bold text-slate-800">₹{amount.toFixed(2)}</span>
          </div>

          {/* QR Code Container */}
          <div className="relative p-4 bg-white border-2 border-purple-100 rounded-3xl shadow-xs mb-5 group">
            <div className="w-[180px] h-[180px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
              {payeeName}
            </div>
          </div>

          {/* UPI ID Action Row */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-5 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">UPI ID</p>
              <p className="font-mono text-sm font-semibold text-slate-700 truncate">{upiId}</p>
            </div>
            <button
              onClick={handleCopyUpi}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-50 border border-purple-100 shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy ID
                </>
              )}
            </button>
          </div>

          {/* Deep link Button for mobile browsers */}
          <a
            href={upiLink}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group mb-4"
          >
            <span>Pay Directly via UPI App</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <p className="text-[10px] text-slate-400 font-mono text-center mb-4">
            *Paying on mobile? The button above will open your default UPI payment app directly.
          </p>

          {/* Confirm Payment button */}
          <div className="w-full border-t border-slate-100 pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onPaymentSuccess}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md hover:shadow-lg"
            >
              Confirm I Have Paid
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
