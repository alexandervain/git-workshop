import type { ExerciseContext } from "../Exercise";

export interface Exercise2Context extends ExerciseContext {
  firstFileName: string;
  secondFileName: string;
  targetBranchName: string;
  originalMessage: string;
}
