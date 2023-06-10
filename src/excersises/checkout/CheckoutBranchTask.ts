import promprt from "prompt";
import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

export const COMMIT_1_MESSAGE = "First commit";
const COMMIT_2_MESSAGE = "Second commit";
const COMMIT_3_MESSAGE = "Third commit";

export const FILE_1 = "file1.txt";

const BRANCH_2 = "new_feature";

export class CheckoutBranchTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly beforeNotes = [
    `inspect branches that you have in the repo using cmd[git branch]`,
    `switch to branch bname[${BRANCH_2}]`,
    `update file fs[${FILE_1}] content - add new line there: msg[Something new]`,
    `commit the changes to Git (to brancn bname[${BRANCH_2}])`,
  ];

  public readonly description = `check and copy into clipboard the hash of the your commit`;

  public get afterNotes(): string[] {
    return [
      `switch to branch bname[${this.context.defaultBranchName}]`,
      `verify your change is not presented in this branch`,
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
        command: `git checkout ${BRANCH_2}`,
        description: `Switches to branch bname[${BRANCH_2}], HEAD will point to the last commit in that branch`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await commitChanges(git, "Initial");

    await this.context.writeText(FILE_1, "I'm a file - 1st edition\n");
    const { commit: commit1 } = await commitChanges(git, COMMIT_1_MESSAGE);
    await this.context.storage.put("hash_commit_1", commit1);

    await this.context.writeText(FILE_1, "I'm a file - 2nd edition\n");
    await commitChanges(git, COMMIT_2_MESSAGE);

    await git.checkoutLocalBranch(BRANCH_2);

    await this.context.writeText(FILE_1, "I'm a file - 3nd edition\n");
    const { commit } = await commitChanges(git, COMMIT_3_MESSAGE);
    await this.context.storage.put("hash_last_branch_2", commit);

    await git.checkout(this.context.defaultBranchName);
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const commitsResult: TaskResult = {
      passed: false,
      text: `Checkout branch bname[${BRANCH_2}], make commit, and switch back to ${this.context.defaultBranchName}`,
    };

    const lastAutoCommit = await this.context.storage.get("hash_last_branch_2");

    const status = await git.status();
    const log = await git.log([BRANCH_2]);

    if (status.current !== this.context.defaultBranchName) {
      commitsResult.failureDetails = `make sure to switch to bname[${this.context.defaultBranchName}] branch`;
    } else if (!status.isClean()) {
      commitsResult.failureDetails = `expected the working tree for bname[${this.context.defaultBranchName}] branch to be clean (no changes)`;
    } else if (log.all[1].hash !== lastAutoCommit) {
      commitsResult.failureDetails =
        `The commits tree of branch bname[${BRANCH_2}] is in unexpected state ` +
        `- expected to find commit hash[${
          lastAutoCommit ?? "ERR"
        }] to be one commit bewfore the last one`;
    } else {
      promprt.start({
        message: `Enter the hash of the commit you made to branch "${BRANCH_2}"`,
        allowEmpty: false,
        colors: true,
      });
      const answer = await promprt.get(["hash"]);
      if (log.latest?.hash !== answer.hash) {
        commitsResult.failureDetails = `Hash does not match the last commit hash in bname[${BRANCH_2} - bad[${
          log.latest?.hash ?? ""
        }]`;
      } else {
        commitsResult.passed = true;
      }
    }

    return commitsResult;
  }
}
