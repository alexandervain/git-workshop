import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { COMMIT_1_MESSAGE, FILE_1 } from "./CheckoutBranchTask";

const BRANCH_NEW = "from_commit";
const COMMIT_NEW_MESSAGE = "my commit";

export class CheckoutCommitTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly beforeNotes = [
    `check the content of the file fs[${FILE_1}] - just to compare it later`,
    `checkout commit with message msg[${COMMIT_1_MESSAGE}]`,
    `run cmd[git log] - note the commits history (now it's short)`,
    `run cmd[git status] - pay attention to the notes`,
    `update file fs[${FILE_1}] content - add some text`,
    `commit the changes to Git (being in the detached mode) with a message msg[${COMMIT_NEW_MESSAGE}]`,
  ];

  public readonly description = `new create a new branch from here named bname[${BRANCH_NEW}]`;

  public get afterNotes(): string[] {
    return [
      `switch to branch bname[${this.context.defaultBranchName}]`,
      `verify your change is not presented in this branch`,
      `check the branches list again - cmd[git branch]`,
    ];
  }

  public get hints(): Hint[] {
    return [
      {
        linkText: "git branch",
        linkUrl: "https://git-scm.com/docs/git-branch",
        description: "Shows branches information and allows creating new ones",
      },
      {
        linkText: "git checkout",
        linkUrl: "https://git-scm.com/docs/git-checkout",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git checkout COMMIT_HASH`,
        description:
          `Checkouts state as it was at that commit - HEAD will point to it. Filesystem is changed according to that commit\n` +
          `Note that it is a nb[detached mode]! Changes will be lost - create a new branch to preserve them`,
      },
      {
        command: `git checkout -b BRANCH_NAME`,
        description: `Creates a new branch pointing to the current commit`,
      },
    ];
  }

  public async setup(): Promise<void> {}

  public async check(git: SimpleGit): Promise<TaskResult> {
    const commitsResult: TaskResult = {
      passed: false,
      text: `Create branch bname[${BRANCH_NEW}] from a checked out commit`,
    };

    const commitHash = await this.context.storage.get("hash_commit_1");

    const branch = await git.branch();
    if (!branch.all.includes(BRANCH_NEW)) {
      commitsResult.failureDetails = `Branch bname[${BRANCH_NEW}] does not exist`;
    } else {
      const log = await git.log([BRANCH_NEW]);
      if (log.all[1].hash !== commitHash) {
        commitsResult.failureDetails =
          `The commits tree of branch bname[${BRANCH_NEW}] is in unexpected state ` +
          `- expected to find commit hash[${
            commitHash ?? "ERR"
          }] to be one commit bewfore the last one`;
      } else if (log.all[0].message !== COMMIT_NEW_MESSAGE) {
        commitsResult.failureDetails =
          `Expected last commit in branch bname[${BRANCH_NEW}] to have message msg[${COMMIT_NEW_MESSAGE}] ` +
          `but it is bad[${log.all[0].message}].`;
      } else {
        commitsResult.passed = true;
      }
    }
    return commitsResult;
  }
}
