import type { ExerciseContext } from "../Exercise";

export interface Exercise3Context extends ExerciseContext {
  originalMessage: string;
  expectedMessage: string;
}
