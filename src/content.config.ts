import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS, LANG_CODES, DEFAULT_LANG } from '../site.config.mjs';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      /** 글 제목 (필수) */
      title: z.string(),
      /** 목록에 함께 보이는 한 줄 설명 */
      description: z.string().optional(),
      /** 작성일 — 2026-09-09 형식 (필수) */
      date: z.coerce.date(),
      /** 수정일 (선택) */
      updated: z.coerce.date().optional(),
      /** 카테고리 — site.config.mjs 의 slug 중 하나 */
      category: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
      /** 글의 언어 — 'ko' 또는 'en'. 적지 않으면 한국어로 봅니다 */
      lang: z.enum(LANG_CODES as [string, ...string[]]).default(DEFAULT_LANG),
      /**
       * 같은 내용을 다른 언어로도 쓴 경우, 그 글의 파일 이름(확장자 제외)을 적습니다.
       * 한쪽에만 적어두면 두 글이 서로 연결됩니다. 번역은 의무가 아닙니다.
       */
      translation: z.string().optional(),
      /** 태그 (선택) */
      tags: z.array(z.string()).default([]),
      /** 대표 이미지 — ./images/파일명.jpg 처럼 상대경로로 씁니다 */
      cover: image().optional(),
      /** 대표 이미지 설명 (시각장애인·검색엔진용) */
      coverAlt: z.string().optional(),
      /** true 로 두면 아직 공개되지 않습니다 */
      draft: z.boolean().default(false),
      /** true 로 두면 홈 화면 위쪽에 고정됩니다 */
      pinned: z.boolean().default(false),
    }),
});

export const collections = { posts };
