/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import chalk from "chalk";

export const TAGS = {
  cmd: (txt: string) => chalk.italic(chalk.greenBright(txt)),
  opt: (txt: string) => chalk.italic(chalk.greenBright(txt)),
  fs: (txt: string) => chalk.bold(chalk.italic(chalk.whiteBright(txt))),
  sv: (txt: string) => chalk.bold(chalk.redBright(txt)),
  bad: (txt: string) => chalk.redBright(txt),
  ok: (txt: string) => chalk.green(txt),
  old: (txt: string) => chalk.red(txt),
  new: (txt: string) => chalk.blueBright(txt),
  msg: (txt: string) => chalk.yellowBright(txt),
  ext: (txt: string) => chalk.yellow(txt),
  hash: (txt: string) => chalk.italic(chalk.yellowBright(txt)),
  bname: (txt: string) => chalk.italic(chalk.redBright(txt)),
  nb: (txt: string) => chalk.underline(chalk.bold(chalk.red(txt))),
  stress: (txt: string) => chalk.italic(chalk.underline(txt)),
  title: (txt: string) => chalk.bold(chalk.underline(txt)),
  bold: chalk.bold,
  italic: chalk.italic,
  under: chalk.underline,
};

export function format(text: string): string {
  return Object.entries(TAGS).reduce((last, [tag, fn]) => {
    // function replacer(substr: string, arg: string, offset, string, groups) {
    const replacer = (match: string, arg: string) => fn(arg);

    const pattern = new RegExp(`${tag}\\[(?<arg>[^\\]]*)\\]`, "gmu");
    return last.replace(pattern, replacer);
  }, text);
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
