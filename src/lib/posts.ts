import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../../site.config.mjs';

export type Post = CollectionEntry<'posts'>;

/** 공개된 글만, 최신순으로 가져옵니다. (개발 중에는 draft 글도 보입니다) */
export async function getPosts(): Promise<Post[]> {
  const showDrafts = import.meta.env.DEV;
  const posts = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 고정글을 맨 위로 올린 목록 */
export async function getPostsPinnedFirst(): Promise<Post[]> {
  const posts = await getPosts();
  return [...posts].sort((a, b) => Number(b.data.pinned) - Number(a.data.pinned));
}

/** 글의 주소 */
export function postPath(post: Post): string {
  return `/posts/${post.id}`;
}

/** 2026년 9월 9일 형태로 날짜를 표시합니다. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(date);
}

/** 2026.09.09 형태 (목록에서 쓰는 짧은 날짜) */
export function formatDateShort(date: Date): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/** 한글 기준 대략적인 읽는 시간 (분) */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const chars = body.replace(/\s/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

/** 앞뒤 글 (목록 기준) */
export function neighbors(posts: Post[], current: Post) {
  const i = posts.findIndex((p) => p.id === current.id);
  return {
    newer: i > 0 ? posts[i - 1] : undefined,
    older: i >= 0 && i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

/** 모든 태그와 글 개수 */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
