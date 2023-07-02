import promprt from "prompt";
import type { SimpleGit } from "simple-git";

import type { ExerciseContext } from "../Exercise";
import type { ExerciseTask } from "../ExerciseTask";
import type { Hint, TaskResult, TaskSolution } from "../utils";
import { commitChanges } from "../utils";

const COMMIT_1_MESSAGE = "First commit";
const COMMIT_2_MESSAGE = "Second commit";
const COMMIT_3_MESSAGE = "Third commit";

export class LogTask implements ExerciseTask {
  public constructor(private readonly context: ExerciseContext) {}

  public readonly description = `find out the hash of the commit with message msg[${COMMIT_2_MESSAGE}]`;

  public readonly afterNotes = [
    "copy the hash into the clipboard - you will need it for the test step",
  ];

  public get hints(): Hint[] {
    return [
      {
        linkText: "git log",
        linkUrl: "https://git-scm.com/docs/git-log",
        description: `(display commits history)`,
      },
    ];
  }

  public get solutions(): TaskSolution[] {
    return [
      {
        command: `git log`,
        description: `Show the commits history`,
      },
    ];
  }

  public async setup(git: SimpleGit): Promise<void> {
    const textFile = "file.txt";
    await this.context.writeText(textFile, "I'm a file - 1st edition");
    await commitChanges(git, COMMIT_1_MESSAGE);

    await this.context.writeText(textFile, "I'm a good file - 2nd edition");
    const res = await commitChanges(git, COMMIT_2_MESSAGE);
    await this.context.storage.put("hash", res.commit);

    await this.context.writeText(textFile, "I'm a cool file - 3rd edition");
    await commitChanges(git, COMMIT_3_MESSAGE);
  }

  public async check(git: SimpleGit): Promise<TaskResult> {
    const commitResult: TaskResult = {
      passed: false,
      text: this.description,
    };

    const hash = (await this.context.storage.get("hash")) ?? "";

    promprt.start({
      message: "Enter the second commit message data",
      allowEmpty: false,
      colors: true,
    });
    const answer = await promprt.get(["hash"]);

    if (answer.hash !== hash) {
      commitResult.failureDetails = `The entered hash does not match to the expected one (hash[${hash}])`;
    } else {
      commitResult.passed = true;
    }

    return commitResult;
  }
}
