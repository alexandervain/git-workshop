import fs from "node:fs/promises";
import path from "node:path";
import { mkdir } from "shelljs";
import type { SimpleGit } from "simple-git";

import type { ExerciseContext } from "../Exercise";
import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";

const FOLDER_TO_KEEP = "folder2";
const SUBFOLDER_TO_IGNORE = "subfolder";
const FILE1 = "file1.txt";
const PATH_TO_IGNORE = path.join(FOLDER_TO_KEEP, SUBFOLDER_TO_IGNORE);

export class IgnoreSubFolderTask implements ExerciseTask {
  private readonly subfolderToIgnore: string;
  private readonly fileToIgnore: string;
  private readonly fileToKeep: string;

  public constructor(private readonly context: ExerciseContext) {
    this.subfolderToIgnore = path.join(
      this.context.folderPath,
      FOLDER_TO_KEEP,
      SUBFOLDER_TO_IGNORE
    );
    this.fileToIgnore = path.join(this.subfolderToIgnore, FILE1);
    this.fileToKeep = path.join(this.context.folderPath, FOLDER_TO_KEEP, FILE1);
  }

  public readonly description = `make the whole folder fs[${PATH_TO_IGNORE}] be ignored`;

  public get hints(): Hint[] {
    return [];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: ``,
        description: `add a new line containing msg[${PATH_TO_IGNORE}] text to the fs[${path.resolve(
          this.context.folderPath,
          ".gitignore"
        )}] file`,
      },
    ];
  }

  public async setup(): Promise<void> {
    mkdir("-p", this.subfolderToIgnore);
    await fs.writeFile(this.fileToKeep, "Bla");
    await fs.writeFile(this.fileToIgnore, "Bla");
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const folderResult: TaskResult = {
      passed: false,
      text: this.description,
    };

    const ignored = await git.checkIgnore([
      PATH_TO_IGNORE,
      this.fileToIgnore,
      this.fileToKeep,
    ]);

    if (!ignored.includes(PATH_TO_IGNORE)) {
      folderResult.failureDetails = `fs[${PATH_TO_IGNORE}] is expected to be ignored but it is not`;
    } else if (!ignored.includes(this.fileToIgnore)) {
      folderResult.failureDetails = `fs[${this.fileToIgnore}] is expected to be ignored but it is not`;
    } else if (ignored.includes(this.fileToKeep)) {
      folderResult.failureDetails = `fs[${this.fileToKeep}] is not expected to be ignored but it is`;
    } else {
      folderResult.passed = true;
    }

    return folderResult;
  }
}
