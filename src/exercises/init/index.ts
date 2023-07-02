import type { ExerciseContext } from "../Exercise";
import { Exercise } from "../Exercise";
import { AddChangesTask } from "./AddChangesTask";
import { CommitTask } from "./CommitTask";
import { InitRepoTask } from "./InitRepoTask";
import { RenameTask } from "./RenameTask";
import type { Exercise1Context } from "./types";

export function factory(baseContext: ExerciseContext): Exercise {
  const context: Exercise1Context = {
    ...baseContext,
    someFileName: "something.txt",
  };

  return new Exercise({
    context,
    topic:
      `A folder is a italic[Git repo root] when it contains a special folder fs[.git] with Git system files.\n` +
      `Git will track all the files and sub-folders of this folder as part of a Git repo.\n` +
      `When you clone a remote repo, git clreates the folder automatically.\n` +
      `When you need to make some folder a Git repo root, use cmd[git init] command\n`,
    description: `You will need to make it a git repo and commit files into it.`,
    tldr: "initialize git repo",
    tasks: [
      new InitRepoTask(context),
      new AddChangesTask(context),
      new CommitTask(context),
      new RenameTask(context),
    ],
    initializedGitRepo: false,
  });
}
