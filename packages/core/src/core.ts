export const defaultNormalizer = (text: string | Span[]): Span[] => {
  if (Array.isArray(text)) {
    return text;
  }

  return Array.from(new Intl.Segmenter().segment(text)).map(({ segment }) => ({
    text: segment,
    length: 1,
  }));
};

export interface EllipsisOptions {
  /**
   * the value to represent clipped text
   * @default "…"
   */
  clippedTextReplacer?: string | Span[];
  /**
   * max length of head text
   */
  maxHeadLength?: number;
  /**
   * max length of tail text
   */
  maxTailLength?: number;
  /**
   * the function to normalize text
   */
  normalizer?: (text: string | Span[]) => Span[];
}

export interface Span {
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
  const {
    clippedTextReplacer = "…",
    maxHeadLength: maxHeadLengthOption,
    maxTailLength: maxTailLengthOption,
    normalizer = defaultNormalizer,
  } = options;

  if (maxLength < 0) {
    throw new Error("maxLength must be greater than or equal to 0");
  }

  if (typeof maxHeadLengthOption === "number" && maxHeadLengthOption < 0) {
    throw new Error("maxHeadLength must be greater than or equal to 0");
  }

  if (typeof maxTailLengthOption === "number" && maxTailLengthOption < 0) {
    throw new Error("maxTailLength must be greater than or equal to 0");
  }

  const fit = (
    space: number,
    text: Span[],
    options: {
      /**
       * @default false
       */
      reverse?: boolean;
    } = {}
  ): Span[] => {
    const { reverse = false } = options;

    let length = 0;
    let result: Span[] = [];

    for (const span of reverse ? text.toReversed() : text) {
      if (length + span.length <= space) {
        length += span.length;

        if (reverse) {
          result = [span].concat(result);
        } else {
          result.push(span);
        }
      } else {
        break;
      }
    }

    return result;
  };

  const getLength = (text: string | Span[]): number =>
    normalizer(text).reduce((sum, span) => sum + span.length, 0);

  const normalizedText = normalizer(text);
  const textLength = getLength(normalizedText);
  const normalizedClippedTextReplacer = normalizer(clippedTextReplacer);
  const clippedTextReplacerLength = getLength(normalizedClippedTextReplacer);

  if (maxLength <= clippedTextReplacerLength) {
    const ellipsisText = fit(maxLength, normalizedClippedTextReplacer);

    return (
      typeof text === "string"
        ? ellipsisText.map((span) => span.text).join("")
        : ellipsisText
    ) as T;
  }

  if (textLength <= maxLength) {
    return text as T;
  }

  let head: Span[] = [];
  let tail: Span[] = [];

  const maxHeadTailLength = (): [number, number] => {
    const remainder = maxLength - clippedTextReplacerLength;

    if (
      maxHeadLengthOption === undefined &&
      maxTailLengthOption === undefined
    ) {
      const maxHeadLength = Math.ceil(remainder / 2);

      return [maxHeadLength, remainder - maxHeadLength];
    }

    if (
      typeof maxHeadLengthOption === "number" &&
      maxTailLengthOption === undefined
    ) {
      const maxHeadLength = Math.min(maxHeadLengthOption, remainder);

      return [maxHeadLength, remainder - maxHeadLength];
    }

    if (
      typeof maxTailLengthOption === "number" &&
      maxHeadLengthOption === undefined
    ) {
      const maxTailLength = Math.min(maxTailLengthOption, remainder);

      return [remainder - maxTailLength, maxTailLength];
    }

    if (
      typeof maxHeadLengthOption === "number" &&
      typeof maxTailLengthOption === "number"
    ) {
      if (maxHeadLengthOption + maxTailLengthOption > remainder) {
        const overflowLength =
          maxHeadLengthOption + maxTailLengthOption - remainder;
        const halfOverflowLength = Math.ceil(overflowLength / 2);

        return [
          maxHeadLengthOption - halfOverflowLength,
          maxTailLengthOption - (overflowLength - halfOverflowLength),
        ];
      }

      return [maxHeadLengthOption, maxTailLengthOption];
    }

    return undefined as never;
  };

  const [maxHeadLength, maxTailLength] = maxHeadTailLength();

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
    fit(maxTailLength, tail, { reverse: true })
  );

  return (
    typeof text === "string"
      ? ellipsisText.map((span) => span.text).join("")
      : ellipsisText
  ) as T;
};
