import type { SimpleGit } from "simple-git";

import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import type { Exercise1Context } from "./types";

const TARGET_BRANCH_NAME = "ex1";

export class RenameTask implements ExerciseTask {
  public constructor(private readonly context: Exercise1Context) {}

  public readonly description = `change the name of the old[master] branch to new[${TARGET_BRANCH_NAME}]`;

  public get hints(): Hint[] {
    return [
      {
        linkText: "git branch",
        linkUrl: "https://git-scm.com/docs/git-branch",
        description: "(find the rename option)",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git branch -m ${TARGET_BRANCH_NAME}`,
        description: `Renames the current branch to the provided name ("${TARGET_BRANCH_NAME}" in this case)`,
      },
    ];
  }

  public async setup(): Promise<void> {}

  public async check(git: SimpleGit): Promise<TaskResult> {
    const result: TaskResult = {
      passed: false,
      text: this.description,
    };
    if ((await this.context.storage.get("isRepo")) === "true") {
      const status = await git.status();
      const summary = await git.branch();

      if (status.current !== TARGET_BRANCH_NAME) {
        result.failureDetails = `expected to be "ok[${TARGET_BRANCH_NAME}]" but is "bad[${
          status.current ?? "???"
        }]"`;
      } else if (summary.all.length !== 1) {
        result.failureDetails = `expected to have a single branch but found bad[${summary.all.length}] branches`;
      } else {
        result.passed = true;
      }
    }
    return result;
  }
}
