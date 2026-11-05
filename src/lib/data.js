// Small helpers for reading the YAML data files and rendering Markdown.

import fs from 'node:fs';
import YAML from 'yaml';
import { marked } from 'marked';

export const loadYaml = (name) => YAML.parse(fs.readFileSync(`src/data/${name}.yaml`, 'utf8'));

export const md = (text = '') => marked.parse(text);

export const mdInline = (text = '') => marked.parseInline(text);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const monthYear = (ym) => {
  const [y, m] = String(ym).split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};

export const postSlug = (id) => {
  const [y, , , ...rest] = id.split('-');
  return `${y}/${rest.join('-')}`;
};
