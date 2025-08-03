interface EllipsisOptions {
  /**
   * @default "..."
   */
  clippedTextReplacer?: string | Span[];
}

interface Span {
  text: string;
  length: number;
}

export const ellipsis = <T extends string | Span[]>(
  text: T,
  /**
   * @default 16
   */
  maxLength: number = 16,
  options: EllipsisOptions = {}
): T => {
  const { clippedTextReplacer = "..." } = options;

  const normalize = (text: string | Span[]): Span[] => {
    if (typeof text === "string") {
      return Array.from(text).map((character) => ({
        text: character,
        length: character.length,
      }));
    }

    return text;
  };

  const getLength = (text: string | Span[]): number =>
    normalize(text).reduce((sum, span) => sum + span.length, 0);

  const normalizedText = normalize(text);
  const textLength = getLength(normalizedText);
  const normalizedClippedTextReplacer = normalize(clippedTextReplacer);
  const clippedTextReplacerLength = getLength(normalizedClippedTextReplacer);

  if (maxLength <= clippedTextReplacerLength) {
    throw new RangeError(
      "The length argument must be greater than the clipped text replacer length."
    );
  }

  if (textLength <= maxLength) {
    return text as T;
  }

  let head: Span[] = [];
  let tail: Span[] = [];
  const remainder = (maxLength - clippedTextReplacerLength) / 2;
  const maxHeadLength = Math.ceil(remainder);
  const maxTailLength = Math.floor(remainder);
  let currentLength = 0;
  for (const span of normalizedText) {
    if (currentLength < maxHeadLength) {
      head.push(span);
    } else {
      tail.push(span);
    }
    currentLength++;
  }

  const ellipsisText = head.concat(
    normalizedClippedTextReplacer,
    maxTailLength > 0 ? tail.slice(-maxTailLength) : []
  );

  return (
    typeof text === "string"
      ? ellipsisText.map((span) => span.text).join("")
      : ellipsisText
  ) as T;
};
