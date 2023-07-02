import type { SimpleGit } from "simple-git";

import type { Hint, TaskResult, TaskSolution } from "./utils";

export interface ExerciseTask {
  readonly beforeNotes?: string[];
  readonly description: string;
  readonly afterNotes?: string[];
  readonly hints: Hint[];
  readonly solutions: TaskSolution[];
  setup: (git: SimpleGit) => Promise<void>;
  check: (git: SimpleGit) => Promise<TaskResult | TaskResult[]>;
}
