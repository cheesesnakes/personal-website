# shawndsouza.com — field notebook

Everything you'd normally change is a text file. You shouldn't need to touch
anything in `src/pages`, `src/components` or `src/styles` to update content.

## Where things live

| To change…                         | Edit                                   |
|------------------------------------|----------------------------------------|
| Name, bio, links, portrait, email  | `src/data/profile.yaml`                |
| News on the inside cover           | `src/data/news.yaml`                   |
| Talks and posters                  | `src/data/talks.yaml`                  |
| Publications                       | `src/data/papers.bib`                  |
| A field-site spread                | `src/content/spreads/<site>.yaml`      |
| Blog posts / essays                | `src/content/posts/*.md`               |
| Tab colours for Talks/Writing/Index| `src/data/sections.yaml`               |
| Photos                             | drop files in `src/assets/photos/`     |
| PDFs (CV, papers, posters)         | `public/assets/pdf/`                   |

## Common jobs

**Add a paper.** Paste the BibTeX into `src/data/papers.bib` and add
`site = {andaman},` (or `malvan`, `konkan`, `tamhini`, `ncbs`) so it shows on
that spread. It always appears in the index. Optional fields: `pdf = {file.pdf}`
(a file in `public/assets/pdf/`), `code = {https://github.com/...}`,
`note = {in press}`, `venue = {...}` to override the journal name, and
`hide = {true}` to leave an entry out.

**Add news.** Add a line at the top of `entries` in `src/data/news.yaml`.

**Add a talk.** Add an item under the right year in `src/data/talks.yaml`
(or a new year block at the top).

**Add a field site.** Copy an existing file in `src/content/spreads/`, rename
it (the file name becomes the link, e.g. `#ncbs`), and set `order`. See
`SPREADS.md` for every option.

**Add a post.** Add `src/content/posts/YYYY-MM-DD-Slug.md` with the same front
matter as the others. It appears in the Writing spread and at `/blog/YYYY/Slug/`.

**Highlight text.** In any notes, wrap words in `<mark>…</mark>`.

## Preview and publish

    npm install          # once
    npm run dev          # live preview at http://localhost:4321 while you edit
    npm run build        # writes the finished site to ./dist

Or build with Docker, without installing Node:

    docker compose run --rm build

nginx serves `./dist`, so the site updates as soon as a build finishes.
If an edit breaks a rule (a missing photo, a typo in a field name), the build
stops and names the file and field.
