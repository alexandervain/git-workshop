import type { SimpleGit } from "simple-git";

import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";
import type { Exercise2Context } from "./types";

const EXPECTED_MESSAGE = "New message";

export class AmendCommitTask implements ExcerciseTask {
  public constructor(private readonly context: Exercise2Context) {}

  public get description(): string {
    return (
      `commit it to Git bld[amending] the existing commit italic[(that is, "adding" this change to the existing commit)]\n` +
      `and also changing the commit message to "msg[${EXPECTED_MESSAGE}]"`
    );
  }

  public readonly afterNotes = [
    "inspect commit id (hash) before you amending it and after - check if it changed",
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git add",
        linkUrl: "https://git-scm.com/docs/git-add",
        description: `(for making untracked files be tracked by adding to git repo)`,
      },
      {
        linkText: "git commit",
        linkUrl: "https://git-scm.com/docs/git-commit",
        description: `(check the opt[--amend] flag)`,
      },
      {
        linkText: "git log",
        linkUrl: "https://git-scm.com/docs/git-log",
        description: `(view commits hostory)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git add ${this.context.secondFileName}`,
        description: `Adds an untracked/modified file to git repo`,
      },
      {
        command: `git commit --amend -m "New message"`,
        description: `Commits changes to the git by amending the last commit and changing its message`,
      },
      {
        command: `git log"`,
        description: `Shows the git repo commits (history)`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await git.branch(["-m", this.context.targetBranchName]);
    await this.context.writeText(this.context.firstFileName, "I'm file #1");
    await commitChanges(git, "Original message");
  }

  public async check(git: SimpleGit): Promise<TaskResult[]> {
    const amendResult: TaskResult = {
      passed: false,
      text: `amending an existing commit`,
    };
    const changeCommitResult: TaskResult = {
      passed: false,
      text: `chaning the original commit message`,
    };

    const status = await git.status();
    const log = await git.log();

    if (status.not_added.length !== 0) {
      amendResult.failureDetails = `expected to have a clean tree but there are some untracked files: ${status.not_added.join(
        ","
      )}`;
    } else if (status.created.length !== 0) {
      amendResult.failureDetails = `expected to have a clean tree but there are some not commited files: ${status.created.join(
        ","
      )}`;
    } else if (log.total !== 1) {
      amendResult.failureDetails = `Expected to have a single commit, but found bad[${log.total}] commits`;
    } else if (
      (await this.context.storage.get("secondFileExists")) === "true"
    ) {
      amendResult.passed = true;
    }

    if (log.latest?.message !== EXPECTED_MESSAGE) {
      changeCommitResult.failureDetails = `Expected the commit message to be msg[${EXPECTED_MESSAGE}], but it is msg[${
        log.latest?.message ?? ""
      }]`;
    } else {
      changeCommitResult.passed = true;
    }

    return [amendResult, changeCommitResult];
  }
}
