import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { AmendCommitTask } from "./AmendCommitTask";
import { CreateFileTask } from "./CreateFileTask";
import type { Exercise2Context } from "./types";

export function factory(baseContext: ExcerciseContext): Excercise {
  const context: Exercise2Context = {
    ...baseContext,
    firstFileName: "file1.txt",
    secondFileName: "file2.txt",
    targetBranchName: "main",
    originalMessage: "Original message",
  };

  return new Excercise({
    context,
    topic:
      `Sometimes we want to change last commit because we forgot to commit one of the changes we just want to add another change to the same commit\n` +
      `Git allows to do so easily using opt[--amend ] option. This option will update the last commit with the current changes.\n` +
      `${REBASING_WARNING}`,
    description: `Repo has a single branch "${context.targetBranchName}" with a single commit with a message msg["${context.originalMessage}"]. You will need to amend this commit.`,
    tldr: "amend last commit",
    tasks: [new CreateFileTask(context), new AmendCommitTask(context)],
  });
}
