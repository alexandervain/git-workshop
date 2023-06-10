import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { ChangeCommitMessageTask } from "./ChangeCommitMessageTask";
import type { Exercise3Context } from "./types";

export function factory(baseContext: ExcerciseContext): Excercise {
  const context: Exercise3Context = {
    ...baseContext,
    originalMessage: "Original message",
    expectedMessage: "New message",
  };

  return new Excercise({
    context,
    topic:
      `Sometimes we want to change last commit message because of typo for example. Git allows to do so using opt[--amend] option.\n` +
      `Note that in general changing commit messages (not only the last one) is possible using the italic[interactive rebase] - cmd[git rebase -i] \n` +
      `and the cmd[reword] option there. \n` +
      `${REBASING_WARNING}`,
    description: `Repo has a single commit with a message msg["${context.originalMessage}"] that you will need to change`,
    tldr: "change last commit message",
    tasks: [new ChangeCommitMessageTask(context)],
  });
}
