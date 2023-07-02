import type { ExerciseContext } from "../Exercise";
import { Exercise } from "../Exercise";
import { IgnoreFolderTask } from "./IgnoreFolderTask";
import { IgnorePatternTask } from "./IgnorePatternTask";
import { IgnoreSubFolderTask } from "./IgnoreSubFolderTask";
import { RootFilesTask } from "./RootFilesTask";

export function factory(context: ExerciseContext): Exercise {
  return new Exercise({
    context,
    topic:
      `Sometimes you don't want to commit particular files or whole folders intp your Git repo.\n` +
      `Git allows that by supporting a special fs[.gitignore] file.\n` +
      `Such file could be placed in any folder - git will respect all the .gitignore files.\n` +
      `Each line in the file should be a name (or path from the current folder) to the file/folder your want to ignore \n` +
      `or a regex (wildcard) to describe a pattern - ext[*.txt] for example to ignore all the files with .txt extension.\n` +
      `fs[.gitignore] should be commited to Git repository as any other file.\n`,
    description:
      `This repo will have few files and folders - all of then "untracked".\n` +
      `You will need to update .gitignore files in root or folders, and commit all files that \n` +
      `should not be ignored to Git - the git tree must be clear.\n` +
      `Run cmd[git status] between your actions to see how git see the changes.\n`,
    tldr: ".gitignore",
    tasks: [
      new RootFilesTask(context),
      new IgnoreFolderTask(context),
      new IgnoreSubFolderTask(context),
      new IgnorePatternTask(context),
    ],
  });
}
