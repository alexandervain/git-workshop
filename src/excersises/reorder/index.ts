import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { REBASING_WARNING } from "../utils";
import { ReorderTask } from "./ReorderTask";

export function factory(context: ExcerciseContext): Excercise {
  return new Excercise({
    context,
    topic:
      `Sometime we want to change an order of the commits - to ogranize it better of as a preparation for squash for example.\n` +
      `This is possible to do in the italic[interactive rebase] mode by changing the order of the lines in the editor.` +
      `${REBASING_WARNING}`,
    description:
      `You will need to change the order of the commits without changing commit content or message.\n` +
      `Use the stress[ineractive rebase] and the opt[pick] option.\n` +
      `Note: you just need to reorder lines of commits (action and commit id, the description is ignored in that mode).`,
    tldr: "change commits order",
    tasks: [new ReorderTask(context)],
  });
}
