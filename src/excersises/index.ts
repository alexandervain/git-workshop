import { factory as amendEx } from "./amend";
import { factory as checkoutEx } from "./checkout";
import { factory as cpEx } from "./cherry-pick";
import { factory as msgEx } from "./commitMessage";
import { factory as deleteEx } from "./delete";
import { factory as fixupEx } from "./fixup";
import { factory as gitIgnoreEx } from "./gitignore";
import { factory as initEx } from "./init";
import { factory as logEx } from "./log";
import { factory as reorderEx } from "./reorder";
import {
  factoryHard as resetHardEx,
  factorySort as resetSoftEx,
} from "./reset";
import { factory as squashEx } from "./squash";
import { createContext } from "./utils";

export const excersises = [
  initEx,
  logEx,
  gitIgnoreEx,
  amendEx,
  msgEx,
  squashEx,
  fixupEx,
  reorderEx,
  deleteEx,
  resetSoftEx,
  resetHardEx,
  checkoutEx,
  cpEx,
].map((factory, index) => factory(createContext(index + 1)));
