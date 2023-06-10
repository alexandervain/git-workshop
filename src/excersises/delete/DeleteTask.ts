import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

const COMMIT_INIT_MESSAGE = "Initial commit";
const COMMIT_1_1_MESSAGE = "Update file1 - 1st edition";
const COMMIT_1_2_MESSAGE = "Update file1 - 2nd edition";
const COMMIT_2_1_MESSAGE = "Update file2 - 1st edition";
const COMMIT_2_2_MESSAGE = "Update file2 - 2nd edition";

export class DeleteTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly description = `delete commits with these message: msg["${COMMIT_1_2_MESSAGE}"] and msg["${COMMIT_2_2_MESSAGE}"]`;

  public readonly afterNotes = [
    `inspect commits hashes before and after re-ordering`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git rebase",
        linkUrl: "https://git-scm.com/docs/git-rebase",
        description: `(use the opt[-i] flag - just delete relevant lines)`,
      },
      {
        description: `to open rebase editor for last N commits use HEAD~N`,
      },
      {
        description: `in the Vim editor cmd[dd] deletes the current line`,
      },
      {
        linkText: "vim (editor) Cheat Sheet",
        linkUrl: "https://vim.rtorr.com/",
        description: `(help for editing message in Vim)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git rebase -i HEAD~4`,
        description: `Enters the interactive rebase mode and opens an editor with last 4 commits`,
      },
      {
        description: `press cmd[dd] on the lines with the msg["${COMMIT_1_2_MESSAGE}"] and "msg[${COMMIT_2_2_MESSAGE}"]`,
      },
      {
        command: `ESC`,
        description: `switch to non-interactive (command) mode in vim`,
      },
      {
        command: `:wq`,
        description: `write and quite command in vim (press Enter)`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await commitChanges(git, COMMIT_INIT_MESSAGE);

    const file1 = "file1.txt";
    const file2 = "file2.txt";
    await this.context.writeText(file1, "I'm file #1 - 1st edition");
    const { commit } = await commitChanges(git, COMMIT_1_1_MESSAGE);
    await this.context.storage.put("hash", commit);

    await this.context.writeText(file1, "I'm file #1 - 2nd edition");
    await commitChanges(git, COMMIT_1_2_MESSAGE);

    await this.context.writeText(file2, "I'm file #2 - 1st edition");
    await commitChanges(git, COMMIT_2_1_MESSAGE);

    await this.context.writeText(file2, "I'm file #2 - 2nd edition");
    await commitChanges(git, COMMIT_2_2_MESSAGE);
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const result: TaskResult = {
      passed: false,
      text: this.description,
    };

    const log = await git.log();
    const hash = await this.context.storage.get("hash");

    if (log.total !== 3) {
      result.failureDetails = `Expected to have ok[3] commits, but found bad[${log.total}] commits`;
    } else if (log.all[1].hash !== hash) {
      result.failureDetails = `Commit msg[${COMMIT_1_1_MESSAGE}] should not have been changed but its hash changed`;
    } else if (
      log.all[0].message !== COMMIT_2_1_MESSAGE ||
      log.all[2].message !== COMMIT_INIT_MESSAGE
    ) {
      // eslint-disable-next-line no-inner-declarations
      function textFor(commitNumber: number, expected: string): string {
        const { message } = log.all[commitNumber];
        return message === expected ? `ok[${message}]` : `bad[${message}]`;
      }

      result.failureDetails =
        `Expected to have this commits [in under[descending] ordder]:\n` +
        `  - ${COMMIT_2_1_MESSAGE}\n` +
        `  - ${COMMIT_1_1_MESSAGE}\n` +
        `  - ${COMMIT_INIT_MESSAGE}\n` +
        `\nbut actually having these:\n` +
        `  - ${textFor(0, COMMIT_2_1_MESSAGE)}\n` +
        `  - ${textFor(1, COMMIT_1_1_MESSAGE)}\n` +
        `  - ${textFor(2, COMMIT_INIT_MESSAGE)}\n`;
    } else {
      result.passed = true;
    }

    return result;
  }
}
