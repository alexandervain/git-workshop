import type { SimpleGit } from "simple-git";

import type { ExerciseContext } from "../Exercise";
import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

const COMMIT_1_MESSAGE = "First commit";
const COMMIT_2_MESSAGE = "Second commit";
const COMMIT_3_MESSAGE = "Third commit";
const COMMIT_4_MESSAGE = "Forth commit";

const FILE_1 = "file1.txt";
const FILE_2 = "file2.txt";

const NEW_CONTENT = "My change";

export class ResetSoftTask implements ExerciseTask {
  public constructor(private readonly context: ExerciseContext) {}

  public readonly beforeNotes = [
    `inspect the state - note that there are no changed to commit`,
    `update file fs[${FILE_1}] content - add new line there: msg[${NEW_CONTENT}]`,
    `check the state (cmd[git status]) - see the file you changed is in the list`,
  ];

  public readonly description = `reset sv[soft] the state to commit with "msg[${COMMIT_3_MESSAGE}]"`;

  public readonly afterNotes = [
    `check the state again - note another file fs[${FILE_2}] in the list`,
    `check the content of the fs[${FILE_1}] - verify that it still contains your change`,
    `* once done and checked - restart the exercise and try doing the reset using the sv[hash] of the commit and not the HEAD ref`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git reset --soft",
        linkUrl: "https://git-scm.com/docs/git-reset",
      },
      {
        linkText: "git log",
        linkUrl: "https://git-scm.com/docs/git-log",
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git reset --sort HEAD~1`,
        description: `Reset the tree to the one before last commit without change filesystem state`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    await commitChanges(git, "Initial");

    await this.context.writeText(FILE_1, "I'm a file - 1st edition\n");
    await commitChanges(git, COMMIT_1_MESSAGE);

    await this.context.writeText(FILE_1, "I'm a file - 2nd edition\n");
    await commitChanges(git, COMMIT_2_MESSAGE);

    await this.context.writeText(FILE_1, "I'm a file - 3nd edition\n");
    const { commit } = await commitChanges(git, COMMIT_3_MESSAGE);
    await this.context.storage.put("hash3", commit);

    await this.context.writeText(FILE_1, "I'm a file - 4th edition\n");
    await this.context.writeText(FILE_2, "I'm another file");
    await commitChanges(git, COMMIT_4_MESSAGE);
  }

  public async check(git: SimpleGit): Promise<TaskResult[]> {
    const commitsResult: TaskResult = {
      passed: false,
      text: this.description,
    };
    const fsResult: TaskResult = {
      passed: false,
      text: `change file fs[${FILE_1}]`,
    };

    const hash = await this.context.storage.get("hash3");
    const log = await git.log();
    const status = await git.status();

    if (log.latest?.hash !== hash) {
      commitsResult.failureDetails = `Expected the last commit to be hash[${
        hash ?? ""
      }]`;
    } else if (!status.created.includes(FILE_2)) {
      commitsResult.failureDetails = `Expected file fs[${FILE_2}] to be in the created list (${status.modified.join(
        ", "
      )})`;
    } else if (!status.modified.includes(FILE_1)) {
      commitsResult.failureDetails = `Expected file fs[${FILE_1}] to be in the modified list (${status.modified.join(
        ", "
      )})`;
    } else {
      commitsResult.passed = true;
    }

    const content = await this.context.readText(FILE_1);
    if (!content.includes(NEW_CONTENT)) {
      fsResult.failureDetails = `Expected file fs[${FILE_1}] to contain msg[${NEW_CONTENT}]`;
    } else {
      fsResult.passed = true;
    }

    return [fsResult, commitsResult];
  }
}
