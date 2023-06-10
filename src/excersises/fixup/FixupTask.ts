import type { SimpleGit } from "simple-git";

import type { ExcerciseContext } from "../Excercise";
import type { ExcerciseTask } from "../ExcerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

const COMMIT_1_MESSAGE = "First commit";
const COMMIT_2_MESSAGE = "Second commit";
const COMMIT_3_MESSAGE = "Third commit";
const COMMIT_4_MESSAGE = "Forth commit";

export class FixupTask implements ExcerciseTask {
  public constructor(private readonly context: ExcerciseContext) {}

  public readonly description = `fixup commit #3 into commit #2`;

  public readonly afterNotes = [
    `new commit should have a commit mesage of commit #2`,
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git rebase",
        linkUrl: "https://git-scm.com/docs/git-rebase",
        description: `(use the opt[-1] flag and opt[fixup] option)`,
      },
      {
        description: `to open rebase editor for last N commits use HEAD~N`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git rebase -i HEAD~3`,
        description: `Enters the interactive rebase mode and opens an editor`,
      },
      {
        command: `f`,
        description: `change old[pick] to new[f] or new[fixup] for commit #3 last commits to squash into a previous commit`,
      },
      {
        command: `ESC`,
        description: `switch to non-interactive (command) mode in vim`,
      },
      {
        command: `:wq`,
        description: `write and quite command in vim (press Enter)`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    const textFile = "file.txt";
    await this.context.writeText(textFile, "I'm a file - 1st edition");
    await commitChanges(git, COMMIT_1_MESSAGE);

    await this.context.writeText(textFile, "I'm a good file - 2nd edition");
    await commitChanges(git, COMMIT_2_MESSAGE);

    await this.context.writeText(textFile, "I'm a cool file - 3rd edition");
    await commitChanges(git, COMMIT_3_MESSAGE);

    await this.context.writeText(textFile, "I'm a great file - 4nd edition");
    await commitChanges(git, COMMIT_4_MESSAGE);
  }

  public async check(git: SimpleGit): Promise<TaskResult[]> {
    const fixupCommitsResult: TaskResult = {
      passed: false,
      text: this.description,
    };
    const messagesResult: TaskResult = {
      passed: false,
      text: `preserve only the message from commit #2`,
    };

    const log = await git.log();

    if (log.total !== 3) {
      fixupCommitsResult.failureDetails = `Expected to have ok[3] commits, but found bad[${log.total}] commits`;
    } else {
      fixupCommitsResult.passed = true;
    }

    if (log.all[2].message !== COMMIT_1_MESSAGE) {
      messagesResult.failureDetails = `The first commit message should not have been change. Expected to be msg["${COMMIT_1_MESSAGE}"] but was bad["${log.all[2].message}"]`;
    } else if (log.all[1].message !== COMMIT_2_MESSAGE) {
      messagesResult.failureDetails = `The second commit message should be preserved. Expected to be msg["${COMMIT_2_MESSAGE}"] but was bad["${log.all[1].message}"]`;
    } else if (log.all[0].message !== COMMIT_4_MESSAGE) {
      messagesResult.failureDetails = `The last commit message should be preserved. Expected to be msg["${COMMIT_4_MESSAGE}"] but was bad["${log.all[0].message}"]`;
    } else {
      messagesResult.passed = true;
    }

    return [fixupCommitsResult, messagesResult];
  }
}
