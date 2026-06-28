/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, RefreshCw, GraduationCap } from "lucide-react";
import { EDUCATION_QUOTES } from "../data";

export default function FlipEducationCard() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQuote = EDUCATION_QUOTES[quoteIndex];

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping when clicking the next quote button
    setQuoteIndex((prev) => (prev + 1) % EDUCATION_QUOTES.length);
  };

  return (
    <div className="flex flex-col h-full min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Education Orientation
          </span>
        </div>
        <button
          onClick={handleNextQuote}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors group"
          title="Next Quote"
        >
          <RefreshCw className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div
        className="relative flex-1 cursor-pointer select-none group [perspective:1000px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front Side: Education Quote */}
          <div className="absolute inset-0 w-full h-full bg-linear-to-br from-indigo-50 to-white border border-indigo-100/60 p-5 rounded-2xl flex flex-col justify-between [backface-visibility:hidden] shadow-sm">
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-4xl text-indigo-300 font-serif leading-none mb-2">“</span>
              <p className="text-slate-800 font-sans italic text-sm md:text-base font-medium leading-relaxed">
                {currentQuote.quote}
              </p>
              <p className="text-right text-xs font-bold text-indigo-600 mt-2">
                — {currentQuote.author}
              </p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Click to view visual
              </span>
              <span>1 / {EDUCATION_QUOTES.length}</span>
            </div>
          </div>

          {/* Back Side: Education Photo */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
              alt="Education Orientation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-indigo-950/40 flex flex-col justify-end p-5">
              <h3 className="text-white text-base font-bold tracking-tight mb-1">
                Knowledge is Power
              </h3>
              <p className="text-indigo-200 text-xs leading-relaxed max-w-[90%]">
                Providing standard school curriculum textbooks, specialized notebooks, and academic instruments at Gopi Books and Fancystore.
              </p>
              <div className="flex justify-between items-center text-[10px] text-indigo-300/80 font-mono mt-3 pt-2 border-t border-indigo-500/20">
                <span>Click to flip back</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-200">ESTD 1998</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
