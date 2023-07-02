import path from "node:path";
import type { SimpleGit } from "simple-git";

import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { exists } from "../utils";
import type { Exercise2Context } from "./types";

export class CreateFileTask implements ExerciseTask {
  public constructor(private readonly context: Exercise2Context) {}

  public readonly beforeNotes = [
    "check the repo status to make sure it's clean",
    "check the repo status between each of the following actions to see how git sees the state",
  ];

  public get description(): string {
    return `create a new file named fs[${this.context.secondFileName}] in that folder`;
  }

  public readonly afterNotes = [
    "check the repo status to see new untracked file",
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git status",
        linkUrl: "https://git-scm.com/docs/git-status",
        description: `(for showing the local repo status)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `touch file2.txt`,
        description: `Touches (accesses/creates if not exists) a file`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {}

  public async check(git: SimpleGit): Promise<TaskResult> {
    const secondFile = path.join(
      this.context.folderPath,
      this.context.secondFileName
    );
    const secondFileExists = await exists(secondFile);
    await this.context.storage.put(
      "secondFileExists",
      secondFileExists.toString()
    );
    return {
      passed: secondFileExists,
      text: this.description,
      failureDetails: secondFileExists
        ? undefined
        : `Expected to have file ${this.context.secondFileName}, but it is missing`,
    };
  }
}
