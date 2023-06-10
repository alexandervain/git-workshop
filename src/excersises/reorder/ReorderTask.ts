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

export class ReorderTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly description = `move commit with message "msg[${COMMIT_2_1_MESSAGE}]" to be before the commit with message "msg[${COMMIT_1_2_MESSAGE}]"`;

  public readonly afterNotes = [
    `inspect commits hashes before and after re-ordering`,
    `after you did the first re-ordering, try to do another one - try to  move commit with \n` +
      `message "msg[${COMMIT_2_2_MESSAGE}]" to be before the commit with message "msg[${COMMIT_2_1_MESSAGE}]" - this will fail. Why?`,
    `read the instruction that will be printed when rebase failed - it instructs on the options to progress from that point`,
    `run cmd[git status] when the rebase attempt failed - inspect the status`,
    `see the current branch name when rebase failed - note that it is a commit hash (not the original branch) - that's because sv[HEAD] points to that commit now`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git rebase",
        linkUrl: "https://git-scm.com/docs/git-rebase",
        description: `(use the opt[-i] flag and opt[pick] option - just re-order relevant lines)`,
      },
      {
        description: `to open rebase editor for last N commits use HEAD~N`,
      },
      {
        linkText: "git rebase --abord",
        linkUrl: "https://git-scm.com/docs/git-rebase",
        description: `(to abort the in-progress rebase - basically, when it failed to complete the rebase)`,
      },
      {
        description: `in the Vim editor cmd[yy] command copies the current line into a clipboard`,
      },
      {
        description: `in the Vim editor cmd[p] command pastes the value from clipboard as the next line`,
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
        description:
          `reorder lines - escentially create a new line - msg[pick HASH] (where hash[HASH] is the hash \n` +
          `of the "msg[${COMMIT_2_1_MESSAGE}]" commit) - before the line of the commit "msg[${COMMIT_1_2_MESSAGE}]"`,
      },
      {
        command: `ESC`,
        description: `switch to non-interactive (command) mode in vim`,
      },
      {
        command: `:wq`,
        description: `write and quite command in vim (press Enter)`,
      },
      {
        description:
          `Moving commit "msg[${COMMIT_2_2_MESSAGE}]" to be before the commit with message "msg[${COMMIT_2_1_MESSAGE}]"\n` +
          `failed because both commits changed the same line in the same file - Git stores\n` +
          `the delta (change) vs. the previous state of the same file. Thus basically the second\n` +
          `commit relies on the state created by the first one - they can't be reoredred.`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await commitChanges(git, COMMIT_INIT_MESSAGE);

    const file1 = "file1.txt";
    await this.context.writeText(file1, "I'm file #1 - 1st edition");
    const { commit } = await commitChanges(git, COMMIT_1_1_MESSAGE);
    await this.context.storage.put("hash", commit);

    await this.context.writeText(file1, "I'm file #1 - 2nd edition");
    await commitChanges(git, COMMIT_1_2_MESSAGE);

    const file2 = "file2.txt";
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

    if (log.total !== 5) {
      result.failureDetails = `Expected to keep all ok[5] commits, but found bad[${log.total}] commits`;
    } else if (log.all[3].hash !== hash) {
      result.failureDetails = `Commit msg[${COMMIT_1_1_MESSAGE}] should not have been changed but its hash changed`;
    } else if (
      log.all[0].message !== COMMIT_2_2_MESSAGE ||
      log.all[1].message !== COMMIT_1_2_MESSAGE ||
      log.all[2].message !== COMMIT_2_1_MESSAGE
    ) {
      // eslint-disable-next-line no-inner-declarations
      function textFor(commitNumber: number, expected: string): string {
        const { message } = log.all[commitNumber];
        const fmt = message === expected ? "ok" : "bad";
        return `${fmt}[${message}]`;
      }

      result.failureDetails =
        `Expected this order of commits  [in under[descending] ordder]:\n` +
        `  - ${COMMIT_2_2_MESSAGE}\n` +
        `  - ${COMMIT_1_2_MESSAGE}\n` +
        `  - ${COMMIT_2_1_MESSAGE}\n` +
        `  - ${COMMIT_1_1_MESSAGE}\n` +
        `  - ${COMMIT_INIT_MESSAGE}\n` +
        `\nbut the actual order is:\n` +
        `  - ${textFor(0, COMMIT_2_2_MESSAGE)}\n` +
        `  - ${textFor(1, COMMIT_1_2_MESSAGE)}\n` +
        `  - ${textFor(2, COMMIT_2_1_MESSAGE)}\n` +
        `  - ${textFor(3, COMMIT_1_1_MESSAGE)}\n` +
        `  - ${textFor(4, COMMIT_INIT_MESSAGE)}\n`;
    } else {
      result.passed = true;
    }

    return result;
  }
}
