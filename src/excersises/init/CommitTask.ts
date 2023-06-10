import type { SimpleGit } from "simple-git";

import type { ExcerciseTask } from "../ExcerciseTask";
import type { HasMessage, Hint, TaskResult, TaskSolution } from "../utils";
import type { Exercise1Context } from "./types";

const COMMIT_MESSAGE = "Very first commit";

export class CommitTask implements ExcerciseTask {
  public constructor(private readonly context: Exercise1Context) {}

  public readonly description = `commit the added changes (new file) to git with message "msg${COMMIT_MESSAGE}]"`;

  public get hints(): Hint[] {
    return [
      {
        linkText: "git commit",
        linkUrl: "https://git-scm.com/docs/git-commit",
        description: "(for committing the changes to a repo)",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git commit -m "Very first commit"`,
        description: `Commits changes to the current branch`,
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
      try {
        const log = await git.log();
        const status = await git.status();
        if (status.created.includes(this.context.someFileName)) {
          result.failureDetails = `File ${this.context.someFileName} is expected to be added to git but it is not`;
        } else if (
          log.latest?.message.toLowerCase() !== COMMIT_MESSAGE.toLowerCase()
        ) {
          result.failureDetails = `Expected commit message: "ok[${COMMIT_MESSAGE}]",  actual: "bad[${String(
            log.latest?.message
          )}]"`;
        } else if (log.total !== 1) {
          result.failureDetails = `Expected to have a single commit, but found bad[${log.total}] commits`;
        } else {
          result.passed = true;
        }
      } catch (err: unknown) {
        result.failureDetails = `Failed to get git log: bad[${String(
          (err as HasMessage).message
        ).trim()}]`;
      }
    }
    return result;
  }
}
