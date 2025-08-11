import { describe, expect, test } from "vitest";
import { ellipsis } from "../src/core";

describe("ellipsis", () => {
  test("This is a long string that will be trimmed", () => {
    expect(ellipsis("This is a long string that will be trimmed", 27)).toBe(
      "This is a lon…ll be trimmed"
    );
  });

  test("This 🇺🇳 is 🤡 🐥 a string 🥰 🧑‍🧑‍🧒‍🧒 with compound emoji 😊 ", () => {
    expect(
      ellipsis(
        "This 🇺🇳 is 🤡 🐥 a string 🥰 🧑‍🧑‍🧒‍🧒 with compound emoji 😊 ",
        27
      )
    ).toBe("This 🇺🇳 is 🤡 🐥…ound emoji 😊 ");
  });

  test("Dies is ein öü deutscher String mit Umlauten äß", () => {
    expect(
      ellipsis("Dies is ein öü deutscher String mit Umlauten äß", 27)
    ).toBe("Dies is ein ö…t Umlauten äß");
  });

  test("with max head length 4", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 4,
      })
    ).toBe("This…g that will be trimmed");
  });

  test("max head length < max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 10,
      })
    ).toBe("This is a … will be trimmed");
  });

  test("max head length = max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 26,
      })
    ).toBe("This is a long string that…");
  });

  test("max head length > max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 30,
      })
    ).toBe("This is a long string that…");
  });

  test("max tail length < max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxTailLength: 10,
      })
    ).toBe("This is a long s…be trimmed");
  });

  test("max tail length = max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxTailLength: 26,
      })
    ).toBe("…tring that will be trimmed");
  });

  test("max tail length > max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxTailLength: 30,
      })
    ).toBe("…tring that will be trimmed");
  });

  test("max head and tail length < max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 10,
        maxTailLength: 10,
      })
    ).toBe("This is a …be trimmed");
  });

  test("max head and tail length = max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 13,
        maxTailLength: 13,
      })
    ).toBe("This is a lon…ll be trimmed");
  });

  test("max head and tail length > max length", () => {
    expect(
      ellipsis("This is a long string that will be trimmed", 27, {
        maxHeadLength: 20,
        maxTailLength: 20,
      })
    ).toBe("This is a lon…ll be trimmed");
  });
});
