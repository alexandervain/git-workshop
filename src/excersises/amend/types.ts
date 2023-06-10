import type { ExcerciseContext } from "../Excercise";

export interface Exercise2Context extends ExcerciseContext {
  firstFileName: string;
  secondFileName: string;
  targetBranchName: string;
  originalMessage: string;
}
