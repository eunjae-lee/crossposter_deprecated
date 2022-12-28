import { cleanUpImageMarkdown } from "../utils";

describe("twitter", () => {
  describe("cleanUpImageMarkdown", () => {
    it("cleans up image markdown", () => {
      expect(
        cleanUpImageMarkdown(`hello
here is ![IMG_6823](https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg) ← a cool image`)
      ).toMatchInlineSnapshot(`
"hello
here is https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg ← a cool image"
`);
    });

    it("cleans up multiple image markdowns", () => {
      expect(
        cleanUpImageMarkdown(`hello
here is ![IMG_6823](https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg) ← a cool image

here is another ![IMG_6823](https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg) ← cool image!`)
      ).toMatchInlineSnapshot(`
"hello
here is https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg ← a cool image

here is another https://user-images.githubusercontent.com/499898/209005310-af250587-5b95-45f9-8e65-5012f9489b50.jpeg ← cool image!"
`);
    });
  });
});
