import z from 'zod';
import type { Completion, HabitItem } from '@/types';

/**
 * Export and restore of the entire habit log.
 *
 * This exists because the app is local-first: everything a user has ever built
 * lives in one browser's localStorage, which is *evictable*. Safari clears it
 * for non-installed sites after roughly a week of no interaction, and clearing
 * site data anywhere wipes it instantly. For an app whose whole emotional
 * payload is an accumulated streak, silently losing a year of history with no
 * recovery path is the failure most likely to lose a user permanently.
 *
 * A file the user holds is the honest answer to that while there is no server:
 * it costs no infrastructure, keeps the privacy promise intact, and doubles as
 * the only way to move between devices today.
 */

/**
 * Bump when the payload shape changes incompatibly. Restores check this, so an
 * older app build refuses a newer file rather than silently importing fields
 * it will drop on the next write.
 */
export const BACKUP_VERSION = 1;

const prayerSchema = z.enum(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);
const weekDaySchema = z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

const habitSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  anchorPrayer: prayerSchema,
  minimalVersion: z.string(),
  days: z.array(weekDaySchema),
  createdAt: z.string().min(1),
  paused: z.boolean(),
});

const completionSchema = z.object({
  id: z.string().min(1),
  habitId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completedAt: z.string().min(1),
});

export const backupSchema = z.object({
  app: z.literal('wirdstack'),
  version: z.number().int().positive(),
  exportedAt: z.string(),
  habits: z.array(habitSchema),
  completions: z.array(completionSchema),
});

export type Backup = z.infer<typeof backupSchema>;

export function buildBackup(habits: HabitItem[], completions: Completion[]): Backup {
  return {
    app: 'wirdstack',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    habits,
    completions,
  };
}

/** `wirdstack-backup-2026-09-02.json` — sorts chronologically in a downloads folder. */
export function backupFilename(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `wirdstack-backup-${y}-${m}-${d}.json`;
}

/** Hands the file to the browser's download flow. */
export function downloadBackup(backup: Backup, filename = backupFilename()) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  // Revoking immediately can cancel the download in some browsers; one tick is enough.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ParseResult =
  | { ok: true; backup: Backup }
  | { ok: false; reason: 'malformed' | 'not-wirdstack' | 'too-new' };

/**
 * Validates an uploaded file before it is allowed anywhere near the store.
 *
 * The three failure modes are kept distinct because they need different
 * messages: a corrupt file, someone else's JSON, and a backup from a newer
 * version of the app are three different problems for the user to act on.
 */
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success) {
    // A well-formed JSON file that isn't ours at all vs. one that is ours but
    // corrupt — the `app` marker is what separates them.
    const looksLikeOurs =
      typeof raw === 'object' && raw !== null && (raw as { app?: unknown }).app === 'wirdstack';
    return { ok: false, reason: looksLikeOurs ? 'malformed' : 'not-wirdstack' };
  }

  if (parsed.data.version > BACKUP_VERSION) return { ok: false, reason: 'too-new' };

  return { ok: true, backup: parsed.data };
}
