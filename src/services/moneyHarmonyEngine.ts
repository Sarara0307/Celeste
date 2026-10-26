/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HarmonyMember,
  HarmonySettlement,
  HarmonySplitMode,
  HarmonySplitResult,
} from '../types/finance';
import { formatPaise } from '../utils/formatters';

export class MoneyHarmonyEngine {
  /**
   * Calculates dynamic contribution shares and minimum transaction settlements.
   * Proportional Formula:
   *   User Contribution = Total Bill * (User Income / Total Combined Income)
   */
  public static calculateSplit(
    totalBillPaise: number,
    members: HarmonyMember[],
    splitMode: HarmonySplitMode = 'proportional'
  ): HarmonySplitResult {
    if (members.length === 0 || totalBillPaise <= 0) {
      return {
        totalBillPaise,
        splitMode,
        memberShares: [],
        settlements: [],
      };
    }

    const totalIncomePaise = members.reduce(
      (sum, m) => sum + Math.max(1, m.monthlyIncomePaise),
      0
    );

    // 1. Calculate each member's exact fair share
    let allocatedTotalPaise = 0;
    const memberShares = members.map((member, index) => {
      let sharePaise = 0;
      let incomePercentage = 0;

      if (splitMode === 'equal') {
        incomePercentage = Math.round(100 / members.length);
        sharePaise = Math.round(totalBillPaise / members.length);
      } else {
        // Proportional Income Split
        const ratio = Math.max(1, member.monthlyIncomePaise) / totalIncomePaise;
        incomePercentage = Math.round(ratio * 100);
        sharePaise = Math.round(totalBillPaise * ratio);
      }

      // Handle penny/paise rounding error on the last member
      if (index === members.length - 1) {
        sharePaise = Math.max(0, totalBillPaise - allocatedTotalPaise);
      } else {
        allocatedTotalPaise += sharePaise;
      }

      // Net balance: paid - fair share
      // Positive: Paid more than share, owed money by the group
      // Negative: Paid less than share, owes money to the group
      const netPaise = (member.paidPaise || 0) - sharePaise;

      return {
        memberId: member.id,
        name: member.name,
        incomePaise: member.monthlyIncomePaise,
        incomePercentage,
        sharePaise,
        paidPaise: member.paidPaise || 0,
        netPaise,
      };
    });

    // 2. Minimal Transaction Settlement Algorithm (Greedy Graph Resolver)
    // Matches the biggest debtor with the biggest creditor to minimize transactions
    interface BalanceEntry {
      memberId: string;
      name: string;
      balance: number;
    }

    const debtors: BalanceEntry[] = [];
    const creditors: BalanceEntry[] = [];

    memberShares.forEach((share) => {
      if (share.netPaise < -50) {
        // Owes money (threshold 50 paise to avoid floating noise)
        debtors.push({
          memberId: share.memberId,
          name: share.name,
          balance: -share.netPaise, // positive debt amount
        });
      } else if (share.netPaise > 50) {
        // Is owed money
        creditors.push({
          memberId: share.memberId,
          name: share.name,
          balance: share.netPaise,
        });
      }
    });

    // Sort descending by debt / credit amount
    debtors.sort((a, b) => b.balance - a.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    const settlements: HarmonySettlement[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const settleAmount = Math.min(debtor.balance, creditor.balance);

      if (settleAmount > 0) {
        settlements.push({
          id: `settle-${debtor.memberId}-${creditor.memberId}-${Date.now()}-${settlements.length}`,
          fromMemberId: debtor.memberId,
          fromName: debtor.name,
          toMemberId: creditor.memberId,
          toName: creditor.name,
          amountPaise: settleAmount,
          note: `Fair split settlement for shared expense`,
        });

        debtor.balance -= settleAmount;
        creditor.balance -= settleAmount;
      }

      if (debtor.balance <= 50) dIdx++;
      if (creditor.balance <= 50) cIdx++;
    }

    return {
      totalBillPaise,
      splitMode,
      memberShares,
      settlements,
    };
  }

  /**
   * Generates frictionless, polite, zero-awkwardness AI nudge copy
   */
  public static generateNudges(
    fromName: string,
    toName: string,
    amountPaise: number,
    billTitle: string = 'shared expenses',
    paymentLink?: string
  ): {
    id: string;
    style: 'lighthearted' | 'casual' | 'polite' | 'direct';
    label: string;
    text: string;
  }[] {
    const formattedAmount = formatPaise(amountPaise);
    const linkStr = paymentLink ? ` 📲 Pay link: ${paymentLink}` : '';

    return [
      {
        id: 'lighthearted',
        style: 'lighthearted',
        label: '⚡ Quick & Lighthearted',
        text: `Hey ${toName}! Quick micro-settle of ${formattedAmount} for ${billTitle} when you get a chance ⚡ No rush at all!${linkStr}`,
      },
      {
        id: 'casual',
        style: 'casual',
        label: '☕ Warm & Casual',
        text: `Hey ${toName}, hope you're having an awesome week! Whenever you have a second, here's the ${formattedAmount} share for ${billTitle} 🍕${linkStr}`,
      },
      {
        id: 'polite',
        style: 'polite',
        label: '🏠 Thoughtful Roomie',
        text: `Hi ${toName}! Just balanced our ${billTitle}. Your fair portion comes out to ${formattedAmount}. Let me know if everything looks good!${linkStr}`,
      },
      {
        id: 'direct',
        style: 'direct',
        label: '✨ Clean & Direct',
        text: `SaveSense Split: ${toName} ➔ ${fromName}: ${formattedAmount} for ${billTitle}.${linkStr}`,
      },
    ];
  }
}
