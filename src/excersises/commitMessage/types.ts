import type { ExcerciseContext } from "../Excercise";

export interface Exercise3Context extends ExcerciseContext {
  originalMessage: string;
  expectedMessage: string;
}
