import fs from "node:fs/promises";
import path from "node:path";
import { mkdir } from "shelljs";
import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";

const FOLDER = "folder3";
const FILE1_IGNORE = path.join(FOLDER, "file1.txt");
const FILE2_IGNORE = path.join(FOLDER, "file2.txt");
const FILE3_KEEP = path.join(FOLDER, "file3.dat");

export class IgnorePatternTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly description =
    `make all the file with extension ext[.txt] in folder fs[${FOLDER}] be ignored ` +
    `by editing .gitignore file in that folder`;

  public get hints(): Hint[] {
    return [];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `vi ${FOLDER}/.gitignore`,
        description: `add a new line containing ext[*.txt] text to the fs[${path.resolve(
          this.context.folderPath,
          FOLDER,
          ".gitignore"
        )}] file`,
      },
    ];
  }

  public async setup(): Promise<void> {
    mkdir("-p", path.join(this.context.folderPath, FOLDER));
    await this.context.writeText(FILE1_IGNORE, "Bla");
    await this.context.writeText(FILE2_IGNORE, "Bla");
    await this.context.writeText(FILE3_KEEP, "Bla");
    await this.context.writeText(path.join(FOLDER, ".gitignore"), "");
  }

  public async check(git: SimpleGit): Promise<TaskResult[]> {
    const result: TaskResult = {
      passed: false,
      text: this.description,
    };
    const repoCleanResult: TaskResult = {
      passed: false,
      text: "Repo tree should be clean",
    };

    const newFile = path.join(this.context.folderPath, FOLDER, "foo.txt");
    await fs.writeFile(newFile, "Bla");

    const status = await git.status();

    const ignored = await git.checkIgnore([
      FILE1_IGNORE,
      FILE2_IGNORE,
      FILE3_KEEP,
    ]);

    if (!ignored.includes(FILE1_IGNORE)) {
      result.failureDetails = `fs[${FILE1_IGNORE}] is expected to be ignored but it is not`;
    } else if (!ignored.includes(FILE2_IGNORE)) {
      result.failureDetails = `fs[${FILE2_IGNORE}] is expected to be ignored but it is not`;
    } else if (ignored.includes(FILE3_KEEP)) {
      result.failureDetails = `fs[${FILE3_KEEP}] is not expected to be ignored but it is`;
    } else if (status.not_added.length > 0) {
      result.failureDetails = `fs[${newFile}] is expected to be ignored but it is not`;
    } else {
      result.passed = true;
    }

    if (!status.isClean()) {
      repoCleanResult.failureDetails = `repo tree is not clean`;
    } else {
      repoCleanResult.passed = true;
    }

    return [result, repoCleanResult];
  }
}
