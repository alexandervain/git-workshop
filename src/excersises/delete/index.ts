import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { DeleteTask } from "./DeleteTask";

export function factory(context: ExcerciseContext): Excercise {
  return new Excercise({
    context,
    topic:
      `Got allows remove (delete) some commits - via italic[interactive rebase] mode.\m` +
      `Note that it is not always possibe - specifically if the following commits relies on the one you are trying to delete.\n` +
      `${REBASING_WARNING}`,
    description:
      `You will need to simple delete some commits.\n` +
      `Use the stress[ineractive rebase] and just delete the relevant line.`,
    tldr: "delete commits",
    tasks: [new DeleteTask(context)],
  });
}
