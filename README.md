# Git workshop
This is a Git workshop to learn a practice basic git commands and features.
The workshop consists of a few exercides that targeting a specific git feature(s).

## Flow
Each excersise consists of 2 parts: 
- the excercise description and necessary preparations - run `gw start N`, when `N` is the exercise number
- the excercise verification (test execution) to be run to verify your job - run `gw check N`, when `N` is the exercise number

There are also a few other commands available:
- `clean` - resets any store files/setups related to a specific execersise - run `gw clean N`.
  - `all` option allows cleaning all the excercises - run `gw clean all`.
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

## Excercise
A detailed description of each excercise will be printed by the `gw-run exN` command.

Exacercises topics:
1. Git repo initialization and commits
2. Git log
2. .gitignore
2. Amend last commit
4. Changing commit messages
3. Unite (squash) commits with preserving commit messages
4. Unite (fixup) commits without preserving commit messages
5. Re-organize commits (interfactive rebase)
5. Delete commits (interfactive rebase)
6. Reset
7. Checkout commit
7. _Checrry pick_
6. _Rebase from other branch_
7. _Merge from other branch_
8. _Setting remote repositories_
