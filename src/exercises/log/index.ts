import type { ExerciseContext } from "../Exercise";
import { Exercise } from "../Exercise";
import { LogTask } from "./LogTask";

export function factory(context: ExerciseContext): Exercise {
  return new Exercise({
    context,
    topic:
      `To see the git commit history git provides the cmd[git log] command that shows the commit from the last to the first\n` +
      `providing a basinc information - such as commit hash, message and list of pointers (like HEAD or branch pointers) pointing to that commit`,
    description:
      `Repo has 3 commits. You will need to find out the hash (comment id) of the comment #2.\n` +
      `Use cmd[git log] to help you with that.`,
    tldr: "find commit hash",
    tasks: [new LogTask(context)],
  });
}
