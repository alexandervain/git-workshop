import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { SquashTask } from "./SquashTask";

export function factory(context: ExcerciseContext): Excercise {
  return new Excercise({
    context,
    topic:
      `Got allows combining few commits into a single one using the opt[squash] option in italic[interactive rebase] mode.\n` +
      `The content of a commit marked with that option will be added to the previous commit and also the commit message will be appened to the message of the previous commit.\n` +
      `${REBASING_WARNING}`,
    description:
      `Repo has 5 commits. You will need to unite (squash) 3 last commits` +
      `into a single commit preserving all the commit messages (so there will be 2 commits in total).\n` +
      `Use the stress[ineractive rebase] and the opt[squash] option`,
    tldr: "squash commits",
    tasks: [new SquashTask(context)],
  });
}
