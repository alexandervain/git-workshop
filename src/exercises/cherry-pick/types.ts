import type { ExerciseContext } from "../Exercise";

export interface ExerciseCPContext extends ExerciseContext {
  branchA: string;
  branchB: string;
}
