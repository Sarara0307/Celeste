/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useFinance();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 bg-[#2C382E] text-[#F7F5EC] border border-[#49664D] px-4 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 className="w-4 h-4 text-[#B8CBB3] shrink-0" />
      <span className="text-xs font-medium">{toastMessage}</span>
    </div>
  );
};
