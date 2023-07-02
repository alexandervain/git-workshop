import { Command, program } from "commander";
import { inspect } from "node:util";
import * as shelljs from "shelljs";

import { exercises } from "./exercises";
import { format } from "./exercises/format";
import { mainActions } from "./main";

shelljs.config.silent = true;

interface HasMessage {
  message?: string;
}

const start = new Command("start").description(
  "start an exercise - pass the execrise number as a parameter"
);

const restart = new Command("restart").description(
  "restart an exercise - pass the execrise number as a parameter"
);

const check = new Command("check").description(
  "check an exercise - pass the execrise number as a parameter"
);

const solution = new Command("solution").description(
  "show a solution for an exercise - pass the execrise number as a parameter"
);

const clean = new Command("clean").description(
  "clean up after an exercise - pass the execrise number as a parameter"
);

const print = new Command("print")
  .action(() => {
    console.log(format(`title[Exercises]:`));
    exercises.forEach((ex) => {
      console.log(`  - ${ex.start.description()}`);
    });
  })
  .description(
    "prints exercise details - pass the execrise number as a parameter"
  );

exercises.forEach((ex) => {
  start.addCommand(ex.start);
  restart.addCommand(ex.restart);
  check.addCommand(ex.check);
  solution.addCommand(ex.solution);
  clean.addCommand(ex.clean);
  print.addCommand(ex.print);
});

print.addCommand(
  new Command("all")
    .description("print description of all the exercises")
    .action(() => {
      exercises.forEach((ex) => {
        ex.printDescription();
      });
    })
);

clean.addCommand(
  new Command("all")
    .description("print description of all the exercises")
    .action(async () => {
      await Promise.all(exercises.map((ex) => ex.cleanup()));
    })
);

program
  .action(mainActions)
  .addCommand(start)
  .addCommand(check)
  .addCommand(solution)
  .addCommand(print)
  .addCommand(clean)
  .addCommand(restart)
  .parseAsync(process.argv)
  .catch((error: HasMessage) => {
    console.error(inspect(error));
    process.exitCode = 1;
  });
