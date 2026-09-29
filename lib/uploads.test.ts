import { describe, expect, it } from "vitest";
import { UPLOAD_PATH_PATTERN, uploadPathFor } from "./uploads";

describe("uploadPathFor", () => {
  it.each([
    ["zizi", "Screenshot 2025-01-01 at 10.00.00.PNG", "projects/zizi/screenshot-2025-01-01-at-10-00-00.png"],
    ["zizi", "hero.webp", "projects/zizi/hero.webp"],
    ["My Project", "Café Menu.JPEG", "projects/my-project/cafe-menu.jpeg"],
    ["", "noextension", "projects/untitled/noextension"],
    ["zizi", ".png", "projects/zizi/png"],
    ["zizi", "🔥🔥.png", "projects/zizi/image.png"],
  ])("maps (%j, %j) to %s", (slug, fileName, expected) => {
    expect(uploadPathFor(slug, fileName)).toBe(expected);
  });

  it("caps long file names", () => {
    const path = uploadPathFor("zizi", `${"a".repeat(100)}.png`);
    expect(path).toBe(`projects/zizi/${"a".repeat(40)}.png`);
  });

  it("always produces a path the upload route accepts", () => {
    const names = ["../../etc/passwd", "a/b\\c.png", "weird..name..webp", "  spaced  .avif", "UPPER.PNG", "x.p!n@g"];
    for (const name of names) {
      const path = uploadPathFor("../Evil Slug", name);
      expect(path, name).toMatch(UPLOAD_PATH_PATTERN);
      expect(path).not.toContain("..");
    }
  });
});
