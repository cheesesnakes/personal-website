# Spreads

Each .yaml file here is one two-page spread in the notebook.

- order: position in the notebook (lower comes first)
- tab: label on the index tab. Leave it out for a continuation page,
  and set tab_of to the spread it continues
- color: the index-tab colour
- contents: line in the table of contents (defaults to tab)
- left / right: the two pages. Each page can have, in this order:
  head, title, fields, notes_label, notes, chapters, reef,
  photos, photos_row, sketch, sketch_caption, pubs, pubs_empty

`pubs: andaman` lists every entry in src/data/papers.bib with
`site = {andaman}`. Photos are file names in src/assets/photos.
Sketches are names of files in src/components/sketches.
Notes are Markdown; <mark>...</mark> highlights.
