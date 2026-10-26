/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts integer paise to Indian Rupee formatted string
 * e.g., 1500000 paise -> "₹15,000" or with decimals if fractional
 */
export function formatPaise(
  paise: number,
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
    signDisplay?: 'auto' | 'always' | 'never';
  }
): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  if (options?.compact && rupees >= 100000) {
    // Format in Lakhs (L) or Crores (Cr)
    if (rupees >= 10000000) {
      const cr = (rupees / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${cr} Cr`;
    }
    const lakh = (rupees / 100000).toFixed(2);
    return `${isNegative ? '-' : ''}₹${lakh} L`;
  }

  const fractionDigits = options?.showDecimals ? 2 : (rupees % 1 === 0 ? 0 : 2);
  
  // Use Intl.NumberFormat with en-IN locale for standard Indian comma groupings (2,2,3)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  let formatted = formatter.format(rupees);
  // Replace negative formatted output if needed
  if (isNegative) {
    if (!formatted.startsWith('-')) {
      formatted = `-${formatted}`;
    }
  } else if (options?.signDisplay === 'always' && paise > 0) {
    formatted = `+${formatted}`;
  }

  return formatted;
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Format date nicely: '2026-10-25' -> '25 Oct 2026'
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get difference in calendar days between today and target date
 */
export function getDaysDiff(targetDateStr: string, fromDateStr?: string): number {
  const from = fromDateStr ? new Date(fromDateStr) : new Date();
  from.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns today's ISO date string 'YYYY-MM-DD'
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
