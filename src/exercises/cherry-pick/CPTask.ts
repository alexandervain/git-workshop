import type { SimpleGit } from "simple-git";

import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";
import type { ExerciseCPContext } from "./types";

const COMMIT_INIT_MESSAGE = "Initial commit";
const COMMIT_1_MESSAGE = "Update file1 - 1st edition";
const COMMIT_2_MESSAGE = "Update file1 - 2nd edition";

const COMMIT_B_1_MESSAGE = "Create file2";
const COMMIT_B_2_MESSAGE = "Update file1 - special edition";
const COMMIT_B_3_MESSAGE = "Update file2";

const COMMIT_A_1_MESSAGE = "Update file1 - 3rd edition";

export class CPTask implements ExerciseTask {
  public constructor(private readonly context: ExerciseCPContext) {}

  public get beforeNotes(): string[] {
    return [
      `inspect commits log in branch bname[${this.context.branchA}]`,
      `inspect commits log in branch bname[${this.context.branchB}]`,
    ];
  }

  public get description(): string {
    return (
      `cherry-pick commits with message "msg[${COMMIT_B_1_MESSAGE}]" and "msg[${COMMIT_B_3_MESSAGE}]" ` +
      `existing in branch bname[${this.context.branchB}] into branch bname[${this.context.branchA}]`
    );
  }

  public get afterNotes(): string[] {
    return [
      `nb[the order of listing commits is important.] try first to list them in italic[reversed] order (last and then first)`,
      `(to abort cherry-pick when it has conflicts use opt[--abort] flag)`,
      `inspect the log of branch bname[${this.context.branchA}] - find 2 picked commits`,
      `check if they have the same hash as the original ones`,
      `inspect the log of branch bname[${this.context.branchB}] - has it changed?`,
    ];
  }

  public get hints(): Hint[] {
    return [
      {
        linkText: "git cherry-pick",
        linkUrl: "https://git-scm.com/docs/git-cherry-pick",
        description: `(adds commits from other branches to the current one)`,
      },
      {
        linkText: "git cherry-pick --abort",
        linkUrl: "https://git-scm.com/docs/git-cherry-pick",
        description: `(aborts in-progress cmd[cherry-pick] when it has conflicts)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git cherry-pick HASH1 HASH2`,
        description: `Finds commits with HASH1 and HASH2 in the repo and adds them to the current branch`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await git.branch(["-m", this.context.branchA]);
    await commitChanges(git, COMMIT_INIT_MESSAGE);

    const file1 = "file1.txt";
    await this.context.writeText(file1, "I'm file #1 - 1st edition");
    await commitChanges(git, COMMIT_1_MESSAGE);

    await this.context.writeText(file1, "I'm file #1 - 2nd edition");
    await commitChanges(git, COMMIT_2_MESSAGE);

    // create branch B
    await git.checkoutLocalBranch(this.context.branchB);

    const file2 = "file2.txt";
    await this.context.writeText(file2, "I'm file #2 - 1st edition");
    await commitChanges(git, COMMIT_B_1_MESSAGE);

    await this.context.writeText(file1, "I'm file #1 - special edition");
    await commitChanges(git, COMMIT_B_2_MESSAGE);

    await this.context.writeText(file2, "I'm file #2 - 2nd edition");
    const { commit: lastB } = await commitChanges(git, COMMIT_B_3_MESSAGE);
    await this.context.storage.put("last_hash_b", lastB);

    // back to branch A
    await git.checkout(this.context.branchA);
    await this.context.writeText(file1, "I'm file #1 - 3rd edition");
    const { commit: lastA } = await commitChanges(git, COMMIT_A_1_MESSAGE);
    await this.context.storage.put("last_hash_a", lastA);
  }

  public async check(git: SimpleGit): Promise<TaskResult[]> {
    const resultA: TaskResult = {
      passed: false,
      text: this.description,
    };
    const resultB: TaskResult = {
      passed: false,
      text: `branch bname[${this.context.branchB}] should not change`,
    };

    const logA = await git.log([this.context.branchA]);
    const logB = await git.log([this.context.branchB]);

    const lastHashA = (await this.context.storage.get("last_hash_a")) ?? "???";
    const lastHashB = (await this.context.storage.get("last_hash_b")) ?? "???";

    if (logB.total !== 6) {
      resultB.failureDetails = `Expected to keep ok[6] commits untouched, but found bad[${logB.total}] commits`;
    } else if (logB.all[0].hash !== lastHashB) {
      resultB.failureDetails = `Expected to keep ok[6] commits untouched, but last commit has changed (expected ok[${lastHashB}] hash but found bad[${logB.all[0].hash}])`;
    } else {
      resultB.passed = true;
    }

    if (logA.total !== 6) {
      resultA.failureDetails = `Expected to have ok[6] commits, but found bad[${logA.total}] commits`;
    } else if (logA.all[2].hash !== lastHashA) {
      resultA.failureDetails = `Expected to keep commit msg[${COMMIT_A_1_MESSAGE}] untouched, but it changed (expected ok[${lastHashA}] hash but found bad[${logA.all[0].hash}])`;
    } else if (
      logA.all[0].message !== COMMIT_B_3_MESSAGE ||
      logA.all[1].message !== COMMIT_B_1_MESSAGE
    ) {
      // eslint-disable-next-line no-inner-declarations
      function textFor(commitNumber: number, expected: string): string {
        const { message } = logA.all[commitNumber];
        const fmt = message === expected ? "ok" : "bad";
        return `${fmt}[${message}]`;
      }

      resultA.failureDetails =
        `Expected 2 last commits in bname[${this.context.branchA}] to have commit messages [in under[descending] ordder]:\n` +
        `  - ${COMMIT_B_3_MESSAGE}\n` +
        `  - ${COMMIT_B_1_MESSAGE}\n` +
        `\nbut the actual 2 last commits are:\n` +
        `  - ${textFor(0, COMMIT_B_3_MESSAGE)}\n` +
        `  - ${textFor(1, COMMIT_B_1_MESSAGE)}\n`;
    } else {
      resultA.passed = true;
    }

    return [resultA, resultB];
  }
}
