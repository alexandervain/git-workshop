import chalk from "chalk";

import { format } from "./exercises/format";
const WELCOME = `
 __          __  _                            _          _   _             _____ _ _                        _        _                 
 \\ \\        / / | |                          | |        | | | |           / ____(_) |                      | |      | |                
  \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___  | |_ ___   | |_| |__   ___  | |  __ _| |_  __      _____  _ __| | _____| |__   ___  _ __  
   \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\ | __/ _ \\  | __| '_ \\ / _ \\ | | |_ | | __| \\ \\ /\\ / / _ \\| '__| |/ / __| '_ \\ / _ \\| '_ \\ 
    \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) | | |_| | | |  __/ | |__| | | |_   \\ V  V / (_) | |  |   <\\__ \\ | | | (_) | |_) |
     \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/   \\__|_| |_|\\___|  \\_____|_|\\__|   \\_/\\_/ \\___/|_|  |_|\\_\\___/_| |_|\\___/| .__/ 
                                                                                                                                | |    
                                                                                                                                |_|    
`;

export function mainActions(): void {
  console.log(chalk.cyanBright(WELCOME));
  console.log(
    format(
      String(
        `title[Intro]:\n` +
          `The workshop consists of a few exercises. They are independant and can be executen in any order\n` +
          `though they are provided in some logical order so its recommened to do it in that order.\n` +
          `When starting an exercise, a new sub-folder will be created in the current folder for it\n` +
          `so it's recommended to run this workshop in a dedicated folder - you can create one in your home directory.\n` +
          `This command will create a folder in your home dir and take you there:\n\n` +
          `   cmd[cd ~ && mkdir git-workshop && cd git-workshop]\n\n` +
          `title[Commands]:\n` +
          `There are few commands available in this workshop. Most of the commands expect opt[N] argument - the number of an exercise.\n` +
          `italic[Basic commands]:\n` +
          `  - cmd[gw print]        - print the list of available exercises. \n` +
          `  - cmd[gw start <N>]    - starts an exercise. It will setup the environment (folder) for the exercise and print out the instructions. \n` +
          `  - cmd[gw check <N>]    - checks the exercise execution. It will print out the results and explanations for failed tasks. \n` +
          `  - cmd[gw solution <N>] - prints out a possible solution for the exercise. \n\n` +
          `\n` +
          `title[Flow]:\n` +
          `   - Run cmd[gw start 1].\n` +
          `   - Read instructons and execute listed tasks.\n` +
          `     - italic[It is convenient to have 2 terminals open - in first you run the cmd[gw] commands], in 2nd open the exercise folder and perform tasks.\n` +
          `   - Once ready, run cmd[gw check 1] and see the results.\n` +
          `   - You can fix failed tasks if needed and run cmd[gw check 1] again as many times as needed.\n` +
          `   - Run cmd[gw solution 1] to see a possible solution.\n` +
          `   - Start all over again with the next task.\n` +
          `\n` +
          `title[Additional commands]:\n` +
          `  - cmd[gw print <N>]    - prints out exercise's instruction (without creating the setup). \n` +
          `  - cmd[gw clean <N>]    - cleans up exercise's setup (delete the dedicated folder). \n` +
          `  - cmd[gw restart <N>]  - cleans up exercise's setup and runs the start again. \n` +
          `  - cmd[gw print all]    - prints out all the exercises instructions. \n` +
          `  - cmd[gw clean all]    - cleans up all the exercises setup. \n` +
          `\n`
      )
    )
  );
}
