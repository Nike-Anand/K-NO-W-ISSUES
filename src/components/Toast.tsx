/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-neutral-900 text-white p-3.5 rounded-xl shadow-xl border border-neutral-800 flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : t.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs text-neutral-200 leading-snug font-medium">
            {t.message}
          </div>

          <button
            onClick={() => dismissToast(t.id)}
            className="text-neutral-400 hover:text-white p-0.5 -mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
