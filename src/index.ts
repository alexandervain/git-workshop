import { Command, program } from "commander";
import { inspect } from "node:util";
import * as shelljs from "shelljs";

import { excersises } from "./excersises";
import { format } from "./excersises/format";
import { mainActions } from "./main";

shelljs.config.silent = true;

interface HasMessage {
  message?: string;
}

const start = new Command("start").description(
  "start an exersice - pass the execrise number as a parameter"
);

const restart = new Command("restart").description(
  "restart an exersice - pass the execrise number as a parameter"
);

const check = new Command("check").description(
  "check an exersice - pass the execrise number as a parameter"
);

const solution = new Command("solution").description(
  "show a solution for an exersice - pass the execrise number as a parameter"
);

const clean = new Command("clean").description(
  "clean up after an exersice - pass the execrise number as a parameter"
);

const print = new Command("print")
  .action(() => {
    console.log(format(`title[Excersices]:`));
    excersises.forEach((ex) => {
      console.log(`  - ${ex.start.description()}`);
    });
  })
  .description(
    "prints exersice details - pass the execrise number as a parameter"
  );

excersises.forEach((ex) => {
  start.addCommand(ex.start);
  restart.addCommand(ex.restart);
  check.addCommand(ex.check);
  solution.addCommand(ex.solution);
  clean.addCommand(ex.clean);
  print.addCommand(ex.print);
});

print.addCommand(
  new Command("all")
    .description("print description of all the excersices")
    .action(() => {
      excersises.forEach((ex) => {
        ex.printDescription();
      });
    })
);

clean.addCommand(
  new Command("all")
    .description("print description of all the excersices")
    .action(async () => {
      await Promise.all(excersises.map((ex) => ex.cleanup()));
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
