/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum NewsStatus {
  REAL = 'real',
  FAKE = 'fake',
  SATIRE = 'satire',
  UNKNOWN = 'unknown',
}

export interface SuspiciousWord {
  word: string;
  reason: string;
}

export interface AnalysisResult {
  status: NewsStatus;
  confidence: number;
  explanation: string;
  suspiciousWords: SuspiciousWord[];
  checkedAt: string;
}

export interface NewsHistoryItem extends AnalysisResult {
  id: string;
  text: string;
}
