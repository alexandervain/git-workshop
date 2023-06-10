import path from "node:path";
import { mkdir } from "shelljs";
import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";

const FOLDER_TO_IGNORE = "folder1";
const FILE1 = "file1.txt";

export class IgnoreFolderTask implements ExcerciseTask {
  private readonly pathToIgnore: string;

  public constructor(private readonly context: ExcerciseContext) {
    this.pathToIgnore = path.join(this.context.folderPath, FOLDER_TO_IGNORE);
  }

  public readonly description = `make the whole folder fs[${FOLDER_TO_IGNORE}] be ignored`;

  public get hints(): Hint[] {
    return [];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: ``,
        description: `add a new line containing msg[${FOLDER_TO_IGNORE}] text to the fs[${path.resolve(
          this.context.folderPath,
          ".gitignore"
        )}] file`,
      },
    ];
  }

  public async setup(): Promise<void> {
    mkdir("-p", this.pathToIgnore);
    await this.context.writeText(FILE1, "Bla");
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const folderResult: TaskResult = {
      passed: false,
      text: this.description,
    };

    const ignored = await git.checkIgnore([FOLDER_TO_IGNORE]);

    if (!ignored.includes(FOLDER_TO_IGNORE)) {
      folderResult.failureDetails = `fs[${FOLDER_TO_IGNORE}] is expected to be ignored but it is not`;
    } else {
      folderResult.passed = true;
    }

    return folderResult;
  }
}
