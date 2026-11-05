// Reads src/data/papers.bib and turns it into simple publication objects.

import fs from 'node:fs';
import bibtexParse from '@orcid/bibtex-parse-js';

const clean = (s = '') =>
  s.replace(/\\&/g, '&').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();

const surnames = (authors = '') => {
  const names = clean(authors).split(/\s+and\s+/).map((a) => a.split(',')[0].trim());
  if (names.length < 2) return names.join('');
  return names.slice(0, -1).join(', ') + ' & ' + names.at(-1);
};

const pdfUrl = (pdf) => {
  if (!pdf) return null;
  return pdf.startsWith('http') ? pdf : `/assets/pdf/${pdf}`;
};

const toPub = ({ citationKey, entryTags }) => {
  const t = Object.fromEntries(
    Object.entries(entryTags).map(([k, v]) => [k.toLowerCase(), v])
  );

  return {
    key: citationKey,
    title: clean(t.title),
    authors: surnames(t.author),
    venue: clean(t.venue || t.journal || t.publisher || ''),
    year: Number(t.year) || 0,
    note: clean(t.note || ''),
    site: clean(t.site || ''),
    hide: clean(t.hide || '') === 'true',
    doi: t.doi ? `https://doi.org/${clean(t.doi)}` : null,
    pdf: pdfUrl(clean(t.pdf || '')),
    code: clean(t.code || '') || null,
  };
};

export const loadPubs = () => {
  const raw = fs.readFileSync('src/data/papers.bib', 'utf8');

  return bibtexParse
    .toJSON(raw)
    .map(toPub)
    .filter((p) => !p.hide)
    .sort((a, b) => b.year - a.year);
};

export const pubsFor = (pubs, site) => pubs.filter((p) => p.site === site);
