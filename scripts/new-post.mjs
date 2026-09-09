#!/usr/bin/env node
/**
 * 새 글 파일을 만들어 줍니다.
 *
 *   npm run new -- "제목" [카테고리]
 *
 * 예시:
 *   npm run new -- "9월의 기록"
 *   npm run new -- "다시 읽은 책" taste
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, CATEGORY_SLUGS } from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src', 'content', 'posts');

const [titleArg, categoryArg] = process.argv.slice(2);

if (!titleArg) {
  console.error('\n제목을 적어주세요.\n');
  console.error('  npm run new -- "글 제목" [카테고리]\n');
  console.error(`  카테고리: ${CATEGORIES.map((c) => `${c.slug}(${c.name})`).join(', ')}\n`);
  process.exit(1);
}

const category = categoryArg ?? 'essay';
if (!CATEGORY_SLUGS.includes(category)) {
  console.error(`\n'${category}' 는 없는 카테고리입니다.`);
  console.error(`사용할 수 있는 값: ${CATEGORY_SLUGS.join(', ')}\n`);
  process.exit(1);
}

/** 파일 이름에 쓸 수 없는 문자를 정리합니다. */
function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[/\\?%*:|"'<>.,#()[\]{}]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const now = new Date();
const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
const today = kst.toISOString().slice(0, 10);

const slug = slugify(titleArg) || 'untitled';
const filename = `${today}-${slug}.md`;
const filepath = path.join(postsDir, filename);

if (fs.existsSync(filepath)) {
  console.error(`\n이미 같은 이름의 파일이 있습니다: ${filename}\n`);
  process.exit(1);
}

const body = `---
title: ${titleArg}
description:
date: ${today}
category: ${category}
tags: []
draft: true
---

여기에 글을 씁니다.

<!--
  다 쓰고 나면 위의 draft: true 를 지우거나 false 로 바꿔야 공개됩니다.

  사진을 넣으려면 src/content/posts/images/ 폴더에 파일을 넣고,
  본문에서 이렇게 씁니다:

    ![사진 설명](./images/파일이름.jpg)

  글 맨 위 대표 사진으로 쓰려면 위쪽 설정에 이렇게 추가합니다:

    cover: ./images/파일이름.jpg
    coverAlt: 사진 설명
-->
`;

fs.mkdirSync(postsDir, { recursive: true });
fs.writeFileSync(filepath, body, 'utf8');

console.log(`\n새 글을 만들었습니다:\n  src/content/posts/${filename}\n`);
console.log('이제 이 파일을 열어서 쓰시면 됩니다. 미리 보려면: npm run dev\n');
