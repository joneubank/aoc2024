# adventofcode 2024

The Chief Historian is always present for the big Christmas sleigh launch, but nobody has seen him in months! Last anyone heard, he was visiting locations that are historically significant to the North Pole; a group of Senior Historians has asked you to accompany them as they check the places they think he was most likely to visit.

As each location is checked, they will mark it on their list with a star. They figure the Chief Historian must be in one of the first fifty places they'll look, so in order to save Christmas, you need to help them get fifty stars on their list before Santa takes off on December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

## Progress Summary

**Total Score:** 8

|  Day  | Title                                            | Puzzle 1 | Puzzle 2 | Notes                                                                                                                                                                                                                                                                                  |
| :---: | :----------------------------------------------- | :------: | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1   | [Historian Hysteria](./src/days/day01/README.md) |    X     |    X     | Sort two lists, compare elements from the two lists. Count elements in list.                                                                                                                                                                                                           |
|   2   | [Red-Nosed Reports](./src/days/day02/README.md)  |    X     |    X     | Checking diffs between elements are all positive/negative and within a range. Part two involves permutations and there is a brute force solution, and a recursive/branching solution that is quicker for long inputs. I added a generator script for new inputs to test the difference |
|   3   | [Mull It Over](./src/days/day03/README.md)       |    X     |    X     | Jumbled mul(1,2) instructions. Regex to pull out matching instructions, iterate over array of instructions to determine final value.                                                                                                                                                   |
|   4   | [Ceres Search](./src/days/day04/README.md)       |    X     |    X     | Word search, create matching patterns, like matrix kernel operations, then apply them to subgrids from the original grid.                                                                                                                                                              |
|   5   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|   6   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|   7   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|   8   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|   9   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  10   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  11   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  12   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  13   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  14   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  15   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  16   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  17   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  18   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  19   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  20   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  21   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  22   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  23   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  24   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |
|  25   |                                                  |          |          |                                                                                                                                                                                                                                                                                        |

## Development Setup

Code is written in TypeScript and is organized to be run by [Deno](https://deno.com/).

Each day's solution is found in its own directory within `./src/days`. The inputs for that day are stored in the same directory, as a file named `inputs.txt`.

To execute code for a specific day, update the file [`./src/dev.ts`](./src/dev.ts) to import the day in question, then run:

```sh
deno run dev
```

### Starting a New Day

A template of the directory for a new day can be found at `./src/days/template`. Copy this into a new directory for your day, then update the import in [`./src/dev.ts`](./src/dev.ts) to point to your new day file:

```sh
cp -r ./src/days/template ./src/days/day00
```