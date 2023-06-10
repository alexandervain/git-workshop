import chalk from "chalk";
import fs from "node:fs/promises";
import path from "node:path";
import type { CommitResult, Response, SimpleGit } from "simple-git";
import tLink from "terminal-link";

import type { ExcerciseContext } from "./Excercise";
import { format, TAGS } from "./format";
import { LocalStorage } from "./LocalStorage";

const ARROW = "\u2192";
const CHECK_MARK = "\u2705";
const CROSS_MARK = "\u274c";

export const REBASING_WARNING = `nb[This is a italic[rebasing] operation - it changes history (commit hashs) - be aware!]`;

export interface Hint {
  description?: string;
  linkText?: string;
  linkUrl?: string;
}
interface ExcerciseDetails {
  id: string;
  topic?: string;
  description: string;
  hints?: Hint[];
  tasks: string[];
}

export interface HasMessage {
  message?: string;
}

export function printExcercise(details: ExcerciseDetails): void {
  console.log(
    chalk.yellowBright(
      `=======================================================================
=========================== ${chalk.blue(
        chalk.underline(chalk.bold(`Excercise #${details.id}`))
      )} ==============================
=======================================================================
`
    )
  );

  if (details.topic !== undefined) {
    console.log(chalk.bold(chalk.underline(`Excersice topic`)));
    console.log(format(details.topic));
    console.log("");
  }

  console.log(chalk.bold(chalk.underline(`Description`)));
  console.log(format(details.description));
  console.log();
  console.log(
    chalk.bold(
      chalk.underline(
        `To complete this exacercise you need to do the following tasks:`
      )
    )
  );
  details.tasks.forEach((item) => {
    console.log(" ", ARROW, arrowLines(format(item)));
  });

  if (details.hints !== undefined && details.hints.length > 0) {
    console.log(chalk.bold(chalk.underline(chalk.italic(`\nHints:`))));
    details.hints.forEach((hint) => {
      const link =
        hint.linkUrl !== undefined
          ? chalk.italic(tLink(format(hint.linkText ?? ""), hint.linkUrl))
          : "";

      console.log(
        " ",
        ARROW,
        arrowLines(
          `${TAGS.cmd(link)} ${chalk.italic(
            format(hint.description ?? "")
          )}`.trim()
        )
      );
    });
  }
  console.log();
}

export interface TaskResult {
  passed: boolean;
  text: string;
  failureDetails?: string;
}

export function printVerificationResults(
  id: string,
  results: TaskResult[]
): void {
  console.log(
    chalk.yellowBright(
      chalk.bold(chalk.underline(`Verification results for excercise #${id}:`))
    )
  );
  results.forEach((result) => {
    if (result.passed) {
      console.log(" ", CHECK_MARK, " ", chalk.green(format(result.text)));
    } else {
      const details =
        result.failureDetails !== undefined
          ? chalk.white(chalk.italic(`(${format(result.failureDetails)})`))
          : "";
      console.log(
        " ",
        CROSS_MARK,
        " ",
        chalk.redBright(format(result.text)),
        details
      );
    }
  });
  console.log();
}

export interface TaskSolution {
  command?: string;
  description: string;
}

export function printSolution(id: string, solutions: TaskSolution[]): void {
  console.log(
    chalk.yellowBright(
      chalk.bold(chalk.underline(`Possible solution for excercise #${id}:`))
    )
  );
  solutions.forEach(({ command, description }) => {
    const text =
      (command !== undefined
        ? `${chalk.blueBright(chalk.italic(command))} - `
        : "") + chalk.green(format(description));
    console.log(" ", ARROW, arrowLines(text));
  });
  console.log();
}

function arrowLines(text: string) {
  return text.replace("\n", "\n     ");
}

export async function exists(folderPath: string): Promise<boolean> {
  return await fs
    .access(folderPath)
    .then(() => true)
    .catch(() => false);
}

export function createContext(id: number | string): ExcerciseContext {
  const folderName = `ex${id}`;
  const folderPath = path.join(process.cwd(), folderName);
  return {
    id: id.toString(),
    folderName,
    folderPath,
    storage: new LocalStorage(folderPath),
    defaultBranchName: `ex${id}`,
    writeText: async (relpath, content) => {
      const textFile = path.join(folderPath, relpath);
      await fs.writeFile(textFile, content);
    },
    readText: async (relpath) => {
      const textFile = path.join(folderPath, relpath);
      const content = await fs.readFile(textFile);
      return content.toString();
    },
  };
}

export async function commitChanges(
  git: SimpleGit,
  message: string
): Promise<Response<CommitResult>> {
  await git.add(".");
  return await git.commit(message);
}
