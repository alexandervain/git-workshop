import type { SimpleGit } from "simple-git";
import { CheckRepoActions } from "simple-git";

import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import type { Exercise1Context } from "./types";

export class InitRepoTask implements ExcerciseTask {
  public constructor(private readonly context: Exercise1Context) {}

  public get description(): string {
    return `initializng repo (${this.context.folderName} is a repo root)`;
  }

  public get hints(): Hint[] {
    return [
      {
        linkText: "git init",
        linkUrl: "https://git-scm.com/docs/git-init",
        description: "(initialization)",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: "git init",
        description:
          "Creates a new .git folder (with relevant git content) under the current folder, which makes this folder a git repo root",
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {}

  public async check(git: SimpleGit): Promise<TaskResult> {
    const isRepo = await git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
    await this.context.storage.put("isRepo", isRepo.toString());
    return {
      passed: isRepo,
      text: this.description,
      failureDetails: isRepo
        ? undefined
        : `folder ${this.context.folderName} is not a git repo root`,
    };
  }
}
