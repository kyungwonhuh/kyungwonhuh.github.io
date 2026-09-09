import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, categoryOf } from '../../site.config.mjs';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  // base 경로(예: /test-repo)까지 포함한 사이트 주소
  const base = `${SITE.base.replace(/\/$/, '')}/`;
  const site = new URL(base, context.site);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      categories: [categoryOf(post.data.category).name, ...post.data.tags],
      // site 기준 상대 경로로 두어야 base 가 유지됩니다
      link: `posts/${post.id}`,
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
