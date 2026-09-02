/**
 * Bidirectional-text isolation for user-supplied strings.
 *
 * A habit title is whatever the user typed — "Read Qur'an", "قراءة القرآن",
 * or "1 verse" — and it gets interpolated into translated sentences that may
 * run the other way. Left alone, the Unicode bidi algorithm resolves the whole
 * line as one run and reorders the embedded text against its neighbours: in an
 * Arabic sentence, the Latin "1 verse" comes out as "verse 1", and "$1" as
 * "1$". The text isn't corrupted, it's just displayed in the wrong order.
 *
 * FSI (First Strong Isolate) opens a span whose direction is detected from its
 * own first strong character and, crucially, which is *isolated* — the text
 * inside cannot reorder against the text outside. PDI closes it. This is the
 * plain-string equivalent of wrapping the value in <bdi>, and it is what to
 * use when the value goes through `t()` into a message rather than into its
 * own element.
 */
const FSI = '⁨';
const PDI = '⁩';

export function isolate(value: string | undefined | null): string {
  if (!value) return '';
  return `${FSI}${value}${PDI}`;
}
