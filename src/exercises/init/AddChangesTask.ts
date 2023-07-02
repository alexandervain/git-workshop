import type { SimpleGit } from "simple-git";

import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import type { Exercise1Context } from "./types";

export class AddChangesTask implements ExerciseTask {
  public constructor(private readonly context: Exercise1Context) {}

  public readonly description =
    "add the existing file to be committed (add to git)";

  public readonly afterNotes = [
    `it contains a special fs[.gitignore] file - you should commit it to the repo as well`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git add",
        linkUrl: "https://git-scm.com/docs/git-add",
        description:
          "(for making unversionned files versions by adding to git repo)",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git add ${this.context.someFileName}`,
        description: `Adds an untracked file to git repo`,
      },
      {
        command: `git add .`,
        description: `Adds all the untracked files in the current folder (recursively) to git repo`,
      },
    ];
  }

  public async setup(): Promise<void> {
    await this.context.writeText(
      this.context.someFileName,
      "Hello, Git world!"
    );
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const result: TaskResult = {
      passed: false,
      text: this.description,
    };
    if ((await this.context.storage.get("isRepo")) === "true") {
      const status = await git.status();
      if (status.not_added.includes(this.context.someFileName)) {
        result.failureDetails = `File ${this.context.someFileName} is not addded to git`;
      } else {
        result.passed = true;
      }
    }
    return result;
  }
}
