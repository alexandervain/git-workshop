import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { FixupTask } from "./FixupTask";

export function factory(context: ExcerciseContext): Excercise {
  return new Excercise({
    context,
    topic:
      `Got allows combining few commits into a single one using the opt[fixup] option in italic[interactive rebase] mode.\n` +
      `The content of a commit marked with that option will be added to the previous commit, while its commit message is dropped.\n` +
      `${REBASING_WARNING}`,
    description:
      `Repo has 3 commits (#1, #2, #3, #4). You will need to unite commits #2 and #3` +
      `into a single commit with a commit message of the commit #2.\nThere will be 3 commits in total after you done.\n` +
      `Use the stress[ineractive rebase] and the opt[fixup] option`,
    tldr: "fixup commits",
    tasks: [new FixupTask(context)],
  });
}
