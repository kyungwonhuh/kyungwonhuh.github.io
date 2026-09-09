// ─────────────────────────────────────────────────────────────
//  사이트 전체 설정 — 여기만 고치면 사이트 대부분이 바뀝니다.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  /** 사이트 이름 (헤더 왼쪽 위, 브라우저 탭에 표시) */
  title: '기록과 취향',

  /** 한 줄 소개 (검색 결과·SNS 공유 시 표시) */
  description: '일상과 생각, 좋아하는 것들을 천천히 쌓아두는 곳.',

  /** 글쓴이 이름 */
  author: '허경원',

  /** 홈 화면 맨 위에 뜨는 짧은 자기소개 (줄바꿈은 배열로 구분) */
  intro: [
    '읽고, 보고, 걷고, 몸을 씁니다.',
    '좋았던 것들을 잊지 않으려고 여기에 적어둡니다.',
  ],

  /**
   * 사이트 주소.
   * 저장소 이름이 'kyungwonhuh0503.github.io' 이므로 주소 뒤에 붙는 경로가 없습니다.
   * 나중에 개인 도메인을 사면 site 만 'https://내도메인.com' 으로 바꾸면 됩니다.
   */
  site: 'https://kyungwonhuh0503.github.io',
  base: '/',

  /** 언어 설정 */
  locale: 'ko-KR',

  /** 홈 화면에 보여줄 최근 글 개수 */
  postsOnHome: 8,

  /** 프로필 링크 (비워두면 표시되지 않습니다) */
  links: {
    email: '',
    instagram: '',
    github: '',
  },

  /**
   * 광고 설정.
   * 지금은 꺼져 있습니다. 나중에 수익화할 때 enabled 를 true 로 바꾸고
   * client / slot 값을 채우면, 글 맨 아래에만 조용히 한 칸 노출됩니다.
   */
  ads: {
    enabled: false,
    client: '', // 예: 'ca-pub-0000000000000000'
    slots: {
      afterPost: '', // 글 본문이 끝난 뒤 한 자리
    },
  },

  /**
   * 방문자 통계. Plausible 을 쓸 경우 도메인만 적으면 됩니다.
   * 비워두면 아무 추적 스크립트도 붙지 않습니다.
   */
  analytics: {
    plausibleDomain: '',
  },
};

/**
 * 카테고리 목록.
 * slug 는 주소에 쓰이는 영문 이름이고, name 은 화면에 보이는 이름입니다.
 * 카테고리를 추가하려면 여기에 한 줄 넣고, 글의 category 에 그 slug 를 쓰면 됩니다.
 */
export const CATEGORIES = [
  { slug: 'essay',    name: '에세이', description: '그날의 생각과 일기' },
  { slug: 'taste',    name: '취향',   description: '영화, 책, 음악에 대하여' },
  { slug: 'place',    name: '장소',   description: '다녀온 공간의 기록' },
  { slug: 'training', name: '운동',   description: '몸을 쓰는 일에 대한 기록' },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/** slug 로 카테고리 정보를 찾습니다. */
export function categoryOf(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? { slug, name: slug, description: '' };
}
