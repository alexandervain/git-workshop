import chalk from "chalk";
import { Command } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import { mkdir, rm } from "shelljs";
import type { SimpleGit } from "simple-git";
import gitFactory from "simple-git";

import type { ExerciseTask } from "./ExerciseTask";
import type { LocalStorage } from "./LocalStorage";
import type { TaskResult } from "./utils";
import {
  exists,
  printExercise,
  printSolution,
  printVerificationResults,
} from "./utils";

export interface ExerciseContext {
  id: string;
  folderName: string;
  folderPath: string;
  storage: LocalStorage;
  defaultBranchName: string;
  writeText: (relpath: string, content: string) => Promise<void>;
  readText: (relpath: string) => Promise<string>;
}

interface ExerciseConfig {
  context: ExerciseContext;
  topic: string;
  tldr: string;
  description: string;
  tasks: ExerciseTask[];
  initializedGitRepo?: boolean;
}

export class Exercise {
  private readonly startCommand: Command;
  private readonly checkCommand: Command;
  private readonly solutionCommand: Command;
  private readonly cleanCommand: Command;
  private readonly restartCommand: Command;
  private readonly printCommand: Command;

  private readonly folderName: string;
  private readonly folderPath: string;
  private readonly id: string;

  public constructor(private readonly config: ExerciseConfig) {
    this.folderName = this.config.context.folderName;
    this.folderPath = this.config.context.folderPath;
    this.id = this.config.context.id;

    const pad = this.id.length > 1 ? "" : " ";
    this.startCommand = new Command(this.id)
      .description(
        `Exercide ${chalk.underline(
          chalk.greenBright(this.id)
        )}  ${pad}- ${chalk.italic(chalk.cyanBright(this.config.tldr))}`
      )
      .action(async () => {
        await this.startEx();
      });

    this.checkCommand = new Command(this.id)
      .description(`Exercide ${this.id} - verify completion`)
      .action(async () => {
        const folderExists = await exists(this.folderPath);

        const results: TaskResult[] = [];
        if (!folderExists) {
          results.push({
            passed: false,
            text: `state`,
            failureDetails: `folder ${this.folderPath} not found - make sure you run and completed exercise #${this.id} tasks`,
          });
        } else {
          await this.config.tasks.reduce<Promise<void>>(
            async (previous, task) => {
              await previous;
              const taskResult = await task.check(gitFactory(this.folderPath));
              results.push(
                ...(Array.isArray(taskResult) ? taskResult : [taskResult])
              );
            },
            Promise.resolve()
          );
        }

        this.printDescription();
        printVerificationResults(this.id, results);
      });

    this.solutionCommand = new Command(this.id)
      .description(`Exercide ${this.id} - show solution`)
      .action(async () => {
        this.printDescription();
        const solutions = this.config.tasks.flatMap((task) => task.solutions);
        printSolution(this.id, solutions);
      });

    this.cleanCommand = new Command(this.id)
      .description(`Exercide ${this.id} - clean up`)
      .action(async () => {
        await this.cleanup();
      });

    this.printCommand = new Command(this.id)
      .description(`Exercide ${this.id} - print details`)
      .action(async () => {
        this.printDescription();
      });

    this.restartCommand = new Command(this.id)
      .description(`Exercide ${this.id} - restart (clean & start)`)
      .action(async () => {
        await this.cleanup();
        await this.startEx();
      });
  }

  public get start(): Command {
    return this.startCommand;
  }

  public get restart(): Command {
    return this.restartCommand;
  }

  public get check(): Command {
    return this.checkCommand;
  }

  public get solution(): Command {
    return this.solutionCommand;
  }

  public get clean(): Command {
    return this.cleanCommand;
  }

  public get print(): Command {
    return this.printCommand;
  }

  public printDescription(): void {
    const commonDescriptopn = `The working folder for this exercise is fs[${
      this.folderPath
    }].${
      this.config.initializedGitRepo !== false
        ? " It is a root of a git repo."
        : ""
    }`;

    printExercise({
      id: this.id,
      topic: this.config.topic,
      description: `${commonDescriptopn}\n${this.config.description}`,
      tasks: this.config.tasks.flatMap((task) => [
        ...(task.beforeNotes ?? []),
        task.description,
        ...(task.afterNotes ?? []),
      ]),
      hints: this.config.tasks.flatMap((task) => task.hints),
    });
  }

  public async cleanup(): Promise<void> {
    if (await exists(this.folderPath)) {
      console.log(chalk.italic(` >> removing folder ${this.folderPath}`));
      rm("-rf", this.folderPath);
    }
  }

  private async startEx() {
    if (await exists(this.folderPath)) {
      console.log(
        chalk.redBright(
          `\n>>> The exercise #${this.id} is already in progress <<<\n`
        )
      );
      console.log(chalk.bold(chalk.underline(`You can use:`)));
      console.log(
        ` - ${chalk.italic(
          chalk.green("clean")
        )} command to reset the state and start over`
      );
      console.log(
        ` - ${chalk.italic(
          chalk.green("print")
        )} command to just print the exercise's details again`
      );
      console.log();
      return;
    }

    const git = await this.setup();
    await Promise.all(this.config.tasks.map((task) => task.setup(git)));
    this.printDescription();
  }

  private async setup(): Promise<SimpleGit> {
    mkdir("-p", this.folderPath);
    const git = gitFactory(this.folderPath);
    if (this.config.initializedGitRepo !== false) {
      await git.init();
      await git.branch(["-m", this.config.context.defaultBranchName]);
    }

    mkdir("-p", this.config.context.storage.folder);
    const textFile = path.join(this.folderPath, ".gitignore");
    await fs.writeFile(
      textFile,
      path.basename(this.config.context.storage.folder)
    );

    return git;
  }
}
