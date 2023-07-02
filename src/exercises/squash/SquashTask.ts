import type { SimpleGit } from "simple-git";

import type { ExerciseContext } from "../Exercise";
import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

const COMMIT_1_MESSAGE = "First commit";
const COMMIT_2_MESSAGE = "Second commit";
const COMMIT_3_MESSAGE = "Third commit";
const COMMIT_4_MESSAGE = "Forth commit";

export class SquashTask implements ExerciseTask {
  public constructor(private readonly context: ExerciseContext) {}

  public readonly description = `squash 3 last commits`;

  public readonly afterNotes = [`preserve all the commit mesages`];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git rebase",
        linkUrl: "https://git-scm.com/docs/git-rebase",
        description: `(use the opt[-i] flag and opt[squash] option)`,
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
        command: `s`,
        description: `change old[pick] to new[s] or new[squash] for 2 last commits to squash into a previous commit`,
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
    const squashCommitsResult: TaskResult = {
      passed: false,
      text: this.description,
    };
    const preserveMessagesResult: TaskResult = {
      passed: false,
      text: `preserve all commit messages`,
    };

    const log = await git.log();

    if (log.total !== 2) {
      squashCommitsResult.failureDetails = `Expected to have ok[2] commits, but found bad[${log.total}] commits`;
    } else {
      squashCommitsResult.passed = true;
    }

    const lastCommitMessage = `${log.latest?.message ?? ""}\n${
      log.latest?.body ?? ""
    }`;
    function hasMessage(msg: string) {
      const found = lastCommitMessage.includes(msg);
      if (!found) {
        preserveMessagesResult.failureDetails = `The original message commit is missing in "msg[${lastCommitMessage}]" (expected to have "sv[${msg}]" part)`;
      }
      return found;
    }

    if (
      hasMessage(COMMIT_2_MESSAGE) &&
      hasMessage(COMMIT_3_MESSAGE) &&
      hasMessage(COMMIT_4_MESSAGE)
    ) {
      preserveMessagesResult.passed = true;
    }

    return [squashCommitsResult, preserveMessagesResult];
  }
}
