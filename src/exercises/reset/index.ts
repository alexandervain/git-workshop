import type { ExerciseContext } from "../Exercise";
import { Exercise } from "../Exercise";
import { ResetHardTask } from "./ResetHardTask";
import { ResetSoftTask } from "./ResetSoftTask";

function factory(context: ExerciseContext, soft: boolean): Exercise {
  const text = soft
    ? `- cmd[git reset --sort HEAD~N] to set the HEAD pointer to sv[N] commits back (N could be 0) bld[without changing the file system state]`
    : `- cmd[git reset --hard HEAD~N] to set the HEAD pointer to sv[N] commits back (N could be 0) and bld[change the file system state as it was on that commit]`;

  const opt = soft ? "soft" : "hard";
  return new Exercise({
    context,
    topic:
      `Resetting the HEAD pointer to the specified state. Git repo state consists of 2 parts\n` +
      ` - the current position of the HEAD pointer (normally points to the last commit in the repo)\n` +
      ` - the current state of the file system (thst is, the actual content of the files)\n\n` +
      `The cmd[git reset] command changs one or both of these parts - depending on the psrameters.  \n` +
      `We will take look at one of the most useful: opt[--${opt}].`,
    description: `Repo has few commits. You will play with resetting the state and inspecting it afterwards. Use\n${text}\n`,
    tldr: `reset the state - ${opt}`,
    tasks: [soft ? new ResetSoftTask(context) : new ResetHardTask(context)],
  });
}

export function factorySort(context: ExerciseContext): Exercise {
  return factory(context, true);
}

export function factoryHard(context: ExerciseContext): Exercise {
  return factory(context, false);
}
