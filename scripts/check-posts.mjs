#!/usr/bin/env node
/**
 * 글에 닫히지 않은 HTML 태그가 있는지 검사합니다.
 *
 * 태그를 안 닫아도 빌드는 그냥 통과해버립니다. 대신 화면에서
 * 그 뒤의 글이 전부 인용문 안으로 빨려 들어가는 식으로 조용히 깨집니다.
 * 그런 일을 배포 전에 잡으려고 만든 검사입니다.
 *
 * npm run build / npm run dev 를 할 때 자동으로 먼저 실행됩니다.
 * 따로 돌리려면: npm run check:posts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src', 'content', 'posts');

/** 닫을 필요가 없는 태그들 (HTML 규격상 혼자 쓰는 태그) */
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * 검사 대상에서 뺄 부분을 공백으로 지웁니다.
 * 줄바꿈은 그대로 두어야 줄 번호가 어긋나지 않습니다.
 */
const blank = (m) => m.replace(/[^\n]/g, ' ');

/** 마크다운 안에서 HTML 로 보지 않아야 할 부분을 지웁니다. */
function stripNonHtml(text) {
  return (
    text
      // 맨 위 설정 블록
      .replace(/^---\n[\s\S]*?\n---\n/, blank)
      // ``` 로 감싼 코드 블록
      .replace(/```[\s\S]*?```/g, blank)
      // ` 로 감싼 짧은 코드
      .replace(/`[^`\n]*`/g, blank)
      // HTML 주석
      .replace(/<!--[\s\S]*?-->/g, blank)
  );
}

/** 글자 위치를 줄 번호로 바꿉니다. */
function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

/** 파일 하나를 검사해서 문제 목록을 돌려줍니다. */
function checkFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const text = stripNonHtml(raw);
  const problems = [];
  const stack = [];

  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  let match;

  while ((match = tagPattern.exec(text)) !== null) {
    const [full, closing, rawName, selfClosing] = match;
    const name = rawName.toLowerCase();

    if (VOID_TAGS.has(name) || selfClosing === '/') continue;

    if (closing === '/') {
      if (stack.length === 0) {
        problems.push({
          line: lineOf(text, match.index),
          message: `여는 태그 없이 </${name}> 가 나왔습니다.`,
        });
        continue;
      }
      const open = stack.pop();
      if (open.name !== name) {
        problems.push({
          line: lineOf(text, match.index),
          message:
            `<${open.name}> (${open.line}번째 줄) 를 닫기 전에 </${name}> 가 나왔습니다. ` +
            `태그 순서가 엇갈렸습니다.`,
        });
      }
    } else {
      stack.push({ name, line: lineOf(text, match.index), tag: full });
    }
  }

  for (const open of stack) {
    problems.push({
      line: open.line,
      message: `<${open.name}> 를 열고 닫지 않았습니다. </${open.name}> 를 넣어주세요.`,
    });
  }

  return problems.sort((a, b) => a.line - b.line);
}

function main() {
  if (!fs.existsSync(postsDir)) {
    console.log('검사할 글 폴더가 없습니다. 건너뜁니다.');
    return;
  }

  const files = fs
    .readdirSync(postsDir, { recursive: true })
    .filter((f) => typeof f === 'string' && f.endsWith('.md'))
    .map((f) => path.join(postsDir, f));

  let total = 0;

  for (const file of files) {
    const problems = checkFile(file);
    if (problems.length === 0) continue;

    total += problems.length;
    const shown = path.relative(root, file);
    console.error(`\n  ${shown}`);
    for (const p of problems) {
      console.error(`    ${p.line}번째 줄 — ${p.message}`);
    }
  }

  if (total > 0) {
    console.error(`\n글에서 ${total}군데 문제를 찾았습니다. 고친 뒤 다시 시도해주세요.`);
    console.error('참고: 인용문은 HTML 태그 대신 줄 앞에 > 를 붙이면 더 안전합니다.\n');
    process.exit(1);
  }

  console.log(`글 ${files.length}편 검사 완료 — 문제 없음`);
}

main();
