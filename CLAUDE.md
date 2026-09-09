# 이 저장소에 대하여

개인 블로그입니다. Astro로 만든 정적 사이트이고, GitHub Actions가 GitHub Pages로 배포합니다.
운영자는 개발자가 아닙니다. 설명은 한국어로, 전문 용어는 풀어서 씁니다.

## 성격

- 글과 사진을 쌓아 취향을 드러내는 개인 공간. 판매·마케팅 사이트가 아닙니다.
- 디자인 방향은 **미니멀 텍스트 중심**. 여백이 넉넉하고, 장식보다 읽기 편함이 우선입니다.
- 수익화(광고)는 나중에 열어둔 선택지일 뿐입니다. 광고를 티 나게 늘리는 변경은 하지 않습니다.

## 자주 하게 될 일

**새 글 만들기**

```bash
npm run new -- "제목" [essay|taste|place|training]
```

`src/content/posts/YYYY-MM-DD-제목.md` 가 생깁니다. 초안은 `draft: true` 로 시작하고,
공개할 때 그 줄을 지웁니다.

**글의 frontmatter 규칙** (스키마는 `src/content.config.ts`)

- 필수: `title`, `date`, `category`
- 선택: `description`, `tags`, `cover`, `coverAlt`, `draft`, `pinned`, `updated`,
  `lang`, `translation`
- `category` 는 `site.config.mjs` 의 `CATEGORIES` slug 중 하나여야 합니다.
  없는 값을 쓰면 빌드가 실패합니다.

**사진**

- `src/content/posts/images/` 에 두고 본문에서 `./images/파일.jpg` 로 참조합니다.
- `public/` 에 두지 마세요. `src/` 안에 있어야 Astro가 압축·리사이즈합니다.

## 두 언어 운영 방식

한국어와 영어를 **한 사이트에 섞어서** 쌓습니다. `/ko/`, `/en/` 로 나누지 않습니다.
번역 의무를 만들면 글쓰기가 멈추기 때문에, 이 구조는 의도적인 선택입니다.
번역본은 있으면 연결하고 없으면 그만입니다.

- 글의 언어는 frontmatter 의 `lang` (`ko` | `en`, 기본 `ko`).
- 같은 글의 다른 언어판이 있으면 한쪽에 `translation: <상대 글 id>` 를 적습니다.
  `findTranslation()` 이 양방향으로 찾으므로 **양쪽에 적을 필요는 없습니다.**
- **글 페이지는 반드시 `lang` 을 BaseLayout 에 넘깁니다.** 이게 `<html lang>` 과
  `og:locale` 을 결정합니다. 넘기지 않으면 영어 글이 한국어로 선언됩니다.
- 날짜·읽는 시간은 `formatDate(date, lang)`, `readingTime(body, lang)`,
  `readingTimeLabel(minutes, lang)` 로 언어에 맞춰 씁니다. 하드코딩하지 않습니다.
- **UI 문구(메뉴·버튼·라벨)는 한국어로 고정입니다.** 운영자가 정한 방침이므로
  영어 문구를 섞거나 UI 다국어화를 임의로 추가하지 않습니다.
- 목록에는 기본 언어가 아닌 글에만 `EN` 같은 배지를 답니다. 한국어 글에 `KO` 를
  붙이면 대부분의 글에 배지가 생겨 잡음이 됩니다.
- 언어 필터는 `LangFilter.astro` + `data-lang-item` / `data-lang-group` /
  `data-lang-empty` 속성으로 동작합니다. 목록을 새로 만들 때 이 속성들을 빠뜨리면
  필터가 그 목록만 그냥 지나칩니다.

## 지켜야 할 것

- **링크는 반드시 `url()` 헬퍼를 거칩니다** (`src/lib/url.ts`).
  지금은 `base` 가 `/` 라 직접 써도 우연히 동작하지만, 주소 구조가 바뀌는 순간
  전부 깨집니다. `href="/about"` 이 아니라 `href={url('/about')}` 로 씁니다.
- 사이트 설정은 `site.config.mjs` 한 곳에 모읍니다. 값을 여러 파일에 흩뿌리지 않습니다.
- 색·글자·여백은 `src/styles/global.css` 위쪽 CSS 변수로 조절합니다.
  다크 모드 토큰(`:root[data-theme='dark']` 와 `prefers-color-scheme` 블록)도
  같이 맞춰야 합니다. 색을 한쪽에만 정의하지 않습니다.
- 영어 본문은 `[lang='en']` 에서 `word-break: normal` 로 되돌립니다.
  body 의 `word-break: keep-all` 은 한국어 전용 규칙입니다.
- `.prose` 안의 간격은 `.prose > *` → `.prose > * + *` 순서에 의존합니다.
  `.prose p { margin: ... }` 같은 규칙을 뒤에 추가하면 문단 간격이 무너집니다.
- 의존성은 최소로 유지합니다 (astro, @astrojs/sitemap, @astrojs/rss).
  운영자가 직접 관리할 수 있는 수준을 넘기지 않습니다.

## 확인 방법

```bash
npm run dev      # 미리 보기 (draft 글도 보임)
npm run build    # 배포와 같은 방식으로 빌드 — 커밋 전에 꼭 한 번
```

`npm run build` 가 통과해야 배포가 성공합니다. 글을 추가·수정한 뒤에는 항상 빌드를 돌려봅니다.

## 배포

`master` 브랜치에 푸시하면 `.github/workflows/deploy.yml` 이 빌드해서 Pages로 올립니다.
저장소 Settings → Pages → Source 가 **GitHub Actions** 로 되어 있어야 동작합니다.

## 커밋 메시지

한국어로, 무엇이 바뀌었는지 짧게. 예: `새 글: 여름 끝의 음반 세 장`, `홈 화면 여백 조정`
