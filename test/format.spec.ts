import { format, TAGS } from "../src/excersises/format";

describe("Format", () => {
  it("should return text without tags as is", async () => {
    const text = "foo bar";
    expect(format(text)).toStrictEqual(text);
  });

  it("should format tags", async () => {
    const text = "foo sv[NOTE] cmd[bar] baz cmd[bla] xxx fs[file1.txt]";
    expect(format(text)).toBe(
      `foo ${TAGS.sv("NOTE")} ${TAGS.cmd("bar")} baz ${TAGS.cmd(
        "bla"
      )} xxx ${TAGS.fs("file1.txt")}`
    );
  });
});
