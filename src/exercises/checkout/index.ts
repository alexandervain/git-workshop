import type { ExerciseContext } from "../Exercise";
import { Exercise } from "../Exercise";
import { CheckoutBranchTask } from "./CheckoutBranchTask";
import { CheckoutCommitTask } from "./CheckoutCommitTask";

export function factory(context: ExerciseContext): Exercise {
  return new Exercise({
    context,
    topic:
      `Checkout command brings the git sv[HEAD] to the requested state.\n` +
      ` - when a sv[branch name] provided as an argument, Git switches to that branch\n` +
      ` - when provided with sv[commit hash] - Git restores working files according to that commit\n\n` +
      `Checking out commit is useful to see the state at that point. But note that nb[commiting changes in that state will not change the original branch!]\n`,
    description: `Repo has few commits in few branches. You will play with checking out a specific commit or other branch.`,
    tldr: "checkout",
    tasks: [new CheckoutBranchTask(context), new CheckoutCommitTask(context)],
  });
}
