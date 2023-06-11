import type { ExcerciseContext } from "../Excercise";
import { Excercise } from "../Excercise";
import { CPTask } from "./CPTask";
import type { ExcerciseCPContext } from "./types";

export function factory(baseContext: ExcerciseContext): Excercise {
  const context: ExcerciseCPContext = {
    ...baseContext,
    branchA: "A",
    branchB: "B",
  };
  return new Excercise({
    context,
    topic:
      `You might have a few branches and sometimes you need to take a commit from one branch and add it to other.\n` +
      `For that git provides cmd[git cherry-pick] command that accepts one or more hashs of commit(s) existing in other (local) branch.`,
    description:
      `Repo has a 2 branches - bname[${context.branchA}] and bname[${context.branchB}] with few commits each. You will need to bring some commits from one branch to another.\n` +
      `Use the cmd[git cherry-pick] command.\n`,
    tldr: "cherry-pick commits",
    tasks: [new CPTask(context)],
  });
}
