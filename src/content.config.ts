// Schemas for the notebook's content. If an edit breaks a rule here,
// `npm run build` stops and tells you which file and field is wrong.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photo = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  size: z.enum(['normal', 'small']).default('normal'),
  tilt: z.enum(['left', 'right']).default('left'),
});

const chapter = z.object({
  text: z.string(),
  link: z.string().optional(),
  link_text: z.string().optional(),
});

const page = z.object({
  head: z.tuple([z.string(), z.string()]).optional(),
  title: z.string().optional(),
  title_size: z.enum(['large', 'small']).default('large'),
  fields: z.array(z.tuple([z.string(), z.string()])).default([]),
  notes_label: z.string().optional(),
  notes: z.string().optional(),
  chapters_label: z.string().optional(),
  chapters: z.array(chapter).default([]),
  reef: z.boolean().default(false),
  photos: z.array(photo).default([]),
  photos_row: z.boolean().default(false),
  sketch: z.string().optional(),
  sketch_caption: z.string().optional(),
  pubs: z.string().optional(),
  pubs_empty: z.string().optional(),
});

const spreads = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/spreads' }),
  schema: z.object({
    order: z.number(),
    tab: z.string().optional(),
    tab_of: z.string().optional(),
    contents: z.string().optional(),
    color: z.string().optional(),
    left: page,
    right: page,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    pub: z.string().optional(),
    blurb: z.string(),
    photo: z.string().optional(),
    photo_alt: z.string().optional(),
    photo_caption: z.string().optional(),
  }),
});

export const collections = { spreads, posts };
