# Git workshop
This is a Git workshop to learn and practice basic git commands and features.
The workshop consists of a few exercises that targeting a specific git feature(s).
Run `gw` to print details and instructions.

## Flow
Each excercise consists of 2 parts: 
- the excercise description and necessary preparations - run `gw start N`, where `N` is the exercise number
- the excercise verification (check execution) to be run to verify your job - run `gw check N`, where `N` is the exercise number

There are also a few other commands available:
- `clean` - resets any store files/setups related to a specific execersise - run `gw clean N`.
  - `all` option allows cleaning all the excercises - run `gw clean all`.
- `print` print details availab;e execersises - run `gw print`.
- `print` print details of a specific execersise - run `gw print N`.
  - `all` option allows printing all the excercises - run `gw print all`.
- `restart` cleans up and starts the requested excercise - run `gw restart N`.
- `solution` print a possibele colution for the requested excercise - run `gw solution N`.

## Starting
- To start workshop, create a new folder where all the workshop materials will be stored.
- In your terminal, go to that folder and start doing exercises:
  - run `gw start N`
  - perform the required tasks
  - run `gw check N`
    - it will check and print the results 
    - if any test has failed, you can apply the missing parts and run `gw check N` again when ready
    - you can run `gw restart N` to re-start the whole step over (you will lost any of yur changes)
- No need to run the clean action when moving to the next exersice
