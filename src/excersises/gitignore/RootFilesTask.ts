import fs from "node:fs/promises";
import path from "node:path";
import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";

const FILE_TO_KEEP = "file_to_keep.txt";
const FILE_TO_IGNORE = "file_to_ignore.txt";

export class RootFilesTask implements ExcerciseTask {
  private readonly pathToIgnore: string;
  private readonly pathToKepp: string;

  public constructor(private readonly context: ExcerciseContext) {
    this.pathToKepp = path.join(this.context.folderPath, FILE_TO_KEEP);
    this.pathToIgnore = path.join(this.context.folderPath, FILE_TO_IGNORE);
  }

  public readonly description = `make file fs[${FILE_TO_IGNORE}] be ignored`;

  public get hints(): Hint[] {
    return [
      {
        linkText: "git status",
        linkUrl: "https://git-scm.com/docs/git-status",
        description: `(see the untracked objects, and the added/changed one)`,
      },
      {
        description: `git log should print ok[nothing to commit, working tree clean] message when you are doen`,
      },
      {
        linkText: "ls",
        linkUrl: "https://man7.org/linux/man-pages/man1/ls.1.html",
        description: `(command to show the content of the folder)`,
      },
      {
        linkText: "cd [folder]",
        linkUrl: "https://man7.org/linux/man-pages/man1/cd.1p.html",
        description:
          `(command to change the folder - "cd foo" will take you to the sub-folder "foo"\n` +
          `of the folder you are running the command at)`,
      },
      {
        description:
          `fs[.gitignore] file will not be shown by simple cmd[ls] command because it starts with sv[.] (dot) \n` +
          `that makes files "hidden", Use cmd[ls -la] to show all files - including the hidden ones`,
      },
      {
        linkText: "vi .gitignore",
        linkUrl: "https://vim.rtorr.com/",
        description: `(opens fs[.gitignore] file in vim editor)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `vi .gitignore`,
        description: ``,
      },
      {
        command: ``,
        description: `add a new line containing msg[${FILE_TO_IGNORE}] text to the fs[${path.resolve(
          this.context.folderPath,
          ".gitignore"
        )}] file`,
      },
    ];
  }

  public async setup(): Promise<void> {
    await fs.writeFile(this.pathToKepp, "Bla");
    await fs.writeFile(this.pathToIgnore, "Bla-bla");
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const rootFilesResult: TaskResult = {
      passed: false,
      text: this.description,
    };

    const ignored = await git.checkIgnore([FILE_TO_KEEP, FILE_TO_IGNORE]);

    if (!ignored.includes(FILE_TO_IGNORE)) {
      rootFilesResult.failureDetails = `fs[${FILE_TO_IGNORE}] is expected to be ignored but it is not`;
    } else if (ignored.includes(FILE_TO_KEEP)) {
      rootFilesResult.failureDetails = `fs[${FILE_TO_KEEP}] is not expected to be ignored but it is`;
    } else {
      rootFilesResult.passed = true;
    }

    return rootFilesResult;
  }
}
