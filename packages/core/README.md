# Ellipsis

A simple library to truncate text with an ellipsis.

## Installation

```bash
npm install @ellipsis/core
```

## Usage

```typescript
import { ellipsis } from '@ellipsis/core';

const text = 'This is a long string that will be trimmed';
const truncatedText = ellipsis(text, 27);

console.log(truncatedText); // 'This is a lon…ll be trimmed'
```

## API

### `ellipsis(text, maxLength, options)`

- `text`: `string | Span[]` - The text to be truncated.
- `maxLength`: `number` (optional, default: `16`) - The maximum length of the truncated text.
- `options`: `EllipsisOptions` (optional) - An object with the following properties:
  - `clippedTextReplacer`: `string | Span[]` (optional, default: `'…'`) - The value to represent clipped text.
  - `maxHeadLength`: `number` (optional) - The maximum length of the head text.
  - `maxTailLength`: `number` (optional) - The maximum length of the tail text.
  - `normalizer`: `(text: string | Span[]) => Span[]` (optional) - The function to normalize text.

### `Span`

An interface with the following properties:

- `text`: `string` - The text of the span.
- `length`: `number` - The length of the span.

### `defaultNormalizer(text)`

The default normalizer function that uses `Intl.Segmenter` to split the text into graphemes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.