import type { SimpleGit } from "simple-git";

import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";
import type { Exercise3Context } from "./types";

export class ChangeCommitMessageTask implements ExcerciseTask {
  public constructor(private readonly context: Exercise3Context) {}

  public get description(): string {
    return `change last commit message to bld[${this.context.expectedMessage}]`;
  }

  public readonly afterNotes = [
    `try to do it interactively - without using "-m" flag`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git commit",
        linkUrl: "https://git-scm.com/docs/git-commit",
        description: `(check the opt[--amend] flag)`,
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
        command: `git commit --amend`,
        description: `Enters the editor to edit last commit message`,
      },
      {
        command: `i`,
        description: `switch to interactive (allowing to enter text) mode in vim`,
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
    await this.context.writeText("file.txt", "I'm a file");
    await commitChanges(git, this.context.originalMessage);
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const changeCommitResult: TaskResult = {
      passed: false,
      text: `chaning the original commit message`,
    };

    const log = await git.log();
    if (log.total !== 1) {
      changeCommitResult.failureDetails = `Expected to have a single commit, but found bad[${log.total}] commits`;
    } else if (log.latest?.message !== this.context.expectedMessage) {
      changeCommitResult.failureDetails = `Expected the commit message to be ok["${
        this.context.expectedMessage
      }"], but it is bad["${log.latest?.message ?? ""}]"`;
    } else {
      changeCommitResult.passed = true;
    }

    return changeCommitResult;
  }
}
