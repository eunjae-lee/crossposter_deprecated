import {
  hasImage,
  substringForTwitter,
  trimText,
  trimTextForTwitter,
} from "../utils";

describe("utils", () => {
  describe("trimText", () => {
    it("trims text and attach ellipsis", () => {
      expect(
        trimText({
          text: "abcdef",
          maximumLength: 3,
        })
      ).toEqual({ trimmed: true, text: "ab…" });
    });

    it("can become a shorter text than the maximum limit", () => {
      expect(
        trimText({
          text: "abcdefghij",
          maximumLength: 8,
          targetLengthAfterTrimming: 5,
        })
      ).toEqual({ trimmed: true, text: "abcd…" });
    });

    it("can have a text of length between targetLength... and maximumLength", () => {
      expect(
        trimText({
          text: "abcdef",
          maximumLength: 10,
          targetLengthAfterTrimming: 4,
        })
      ).toEqual({ trimmed: true, text: "abc…" });
    });

    it("can have a different ellipsis text", () => {
      expect(
        trimText({
          text: "abcdefghij",
          maximumLength: 8,
          targetLengthAfterTrimming: 5,
          ellipsisText: "...",
        })
      ).toEqual({ trimmed: true, text: "ab..." });
    });
  });

  describe("substringForTwitter", () => {
    it("substrings English text correctly", () => {
      expect(substringForTwitter("abcdefg", 4)).toEqual("abcd");
    });

    it("substrings Korean text correctly", () => {
      expect(substringForTwitter("가나다라마바사", 4)).toEqual("가나");
    });

    it("substrings mixed text", () => {
      expect(substringForTwitter("a가나다라마바사", 4)).toEqual("a가");

      expect(substringForTwitter("a가나 cd다라마바사", 8)).toEqual("a가나 cd");

      expect(substringForTwitter("a가나 cd다라마바사", 9)).toEqual("a가나 cd");
    });
  });

  describe("trimTextForTwitter", () => {
    it("trims English text correctly", () => {
      expect(
        trimTextForTwitter({
          text: "abcdef",
          maximumLength: 4,
        })
      ).toEqual({ trimmed: true, text: "ab…" });
    });

    it("doesn't trim if limit is high", () => {
      expect(
        trimTextForTwitter({
          text: "가나다라마바사아",
          maximumLength: 16,
        })
      ).toEqual({ trimmed: false, text: "가나다라마바사아" });
    });

    it("trims Korean text correctly", () => {
      expect(
        trimTextForTwitter({
          text: "가나다라마바사아",
          maximumLength: 8,
        })
      ).toEqual({ trimmed: true, text: "가나다…" });

      expect(
        trimTextForTwitter({
          text: "가나다라마바사아",
          maximumLength: 12,
          targetLengthAfterTrimming: 6,
        })
      ).toEqual({ trimmed: true, text: "가나…" });
    });
  });

  describe("hasImage", () => {
    it("returns false if there is no image", () => {
      expect(hasImage("hello")).toEqual(false);
    });

    it("returns true if there is image", () => {
      expect(
        hasImage("hello\nhere is ![image](./image.png) <- my image!")
      ).toEqual(true);
    });

    it("returns true for those with image extensions", () => {
      expect(hasImage("![image](./image.png)")).toEqual(true);
      expect(hasImage("![image](./image.jpg)")).toEqual(true);
      expect(hasImage("![image](./image.jpeg)")).toEqual(true);
      expect(hasImage("![image](./image.gif)")).toEqual(true);
      expect(hasImage("![image](./image.mp4)")).toEqual(false);
    });
  });
});
