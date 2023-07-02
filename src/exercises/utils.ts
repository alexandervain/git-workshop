import chalk from "chalk";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { CommitResult, Response, SimpleGit } from "simple-git";
import tLink from "terminal-link";

import type { ExerciseContext } from "./Exercise";
import { format, TAGS } from "./format";
import { LocalStorage, STORAGE_FOLDER } from "./LocalStorage";

const ARROW = "\u2192";
const CHECK_MARK = "\u2705";
const CROSS_MARK = "\u274c";

export const REBASING_WARNING = `nb[This is a rebasing operation - it changes history (commit hashs) - be aware!]`;

export interface Hint {
  description?: string;
  linkText?: string;
  linkUrl?: string;
}
interface ExerciseDetails {
  id: string;
  topic?: string;
  description: string;
  hints?: Hint[];
  tasks: string[];
}

export interface HasMessage {
  message?: string;
}

export function printExercise(details: ExerciseDetails): void {
  console.log(
    chalk.yellowBright(
      `=======================================================================
=========================== ${chalk.blue(
        chalk.underline(chalk.bold(`Exercise #${details.id}`))
      )} ==============================
=======================================================================
`
    )
  );

  if (details.topic !== undefined) {
    console.log(chalk.bold(chalk.underline(`Exercise topic`)));
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
      chalk.bold(chalk.underline(`Verification results for exercise #${id}:`))
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
      chalk.bold(chalk.underline(`Possible solution for exercise #${id}:`))
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

const EX_FOLDER_NAME_PATTERN = /ex\d+/u;
function determineBaseFolder(): string {
  const cwd = process.cwd();
  return EX_FOLDER_NAME_PATTERN.test(path.basename(cwd)) &&
    existsSync(path.join(cwd, STORAGE_FOLDER))
    ? path.join(cwd, "..")
    : cwd;
}

export function createContext(id: number | string): ExerciseContext {
  const folderName = `ex${id}`;
  const folderPath = path.join(determineBaseFolder(), folderName);
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
