import fs from 'node:fs';
import vm from 'node:vm';
import {createColorRecipe} from '../design/color-recipe.js';
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(new URL('../vendor/material-color-utilities.js',import.meta.url),'utf8'),context);
export const colorRecipe=createColorRecipe(context.window.RosemaryMaterial);
