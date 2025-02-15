import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

export const makeTemplate = (template: string, args?: any) => {
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, template))
    .toString('utf-8');

  const temp = Handlebars.compile(templateStr);

  return temp({ ...args });
};
