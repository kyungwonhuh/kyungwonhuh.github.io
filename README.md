# 기록과 취향

개인 블로그입니다. 글은 텍스트 파일로 쓰고, GitHub에 올리면 자동으로 웹사이트가 됩니다.
서버 비용은 들지 않습니다.

---

## 1. 처음 한 번만 하는 설정

사이트가 인터넷에 보이려면 GitHub에서 **두 가지**를 해야 합니다. 순서가 중요합니다.

### (1) 저장소 이름 바꾸기

이 사이트는 주소가 **`https://kyungwonhuh0503.github.io/`** 로 딱 떨어지도록 맞춰져
있습니다. 그렇게 되려면 저장소 이름이 그 주소와 똑같아야 합니다.

1. GitHub에서 이 저장소로 갑니다
2. 위쪽 **Settings** 탭 클릭
3. 맨 위 **Repository name** 칸의 내용을 지우고 **`kyungwonhuh0503.github.io`** 입력
4. 옆의 **Rename** 버튼 클릭

> 이름을 바꿔도 기존 주소는 GitHub가 자동으로 새 주소로 넘겨주기 때문에,
> 컴퓨터에 받아둔 폴더에서 그대로 계속 작업하셔도 됩니다.

### (2) Pages 스위치 켜기

1. 같은 **Settings** 안에서 왼쪽 메뉴의 **Pages** 클릭
2. **Source** 항목을 **GitHub Actions** 로 선택

이러고 나서 글을 올리면 1~2분 뒤 아래 주소에서 사이트가 열립니다.

**https://kyungwonhuh0503.github.io/**

---

## 2. 글 쓰는 법

### 가장 쉬운 방법 — Claude Code에게 말하기

터미널에서 이 폴더를 열고 Claude Code에게 그냥 말하면 됩니다.

```
"오늘 본 영화에 대한 글 하나 새로 만들어줘. 카테고리는 취향으로."
"어제 쓴 카페 글에 사진 두 장 넣고 공개로 바꿔줘."
"제목을 좀 더 담백하게 바꿔줄래?"
```

### 직접 만드는 방법

```bash
npm run new -- "글 제목"              # 에세이로 만들어집니다
npm run new -- "그 영화에 대하여" taste  # 카테고리를 지정할 수도 있습니다
```

`src/content/posts/` 안에 파일이 하나 생깁니다. 그 파일을 열어서 쓰면 됩니다.

### 글 파일의 생김새

```markdown
---
title: 글 제목
description: 목록에 함께 보이는 한 줄 설명
date: 2026-09-09
category: essay
tags: [기록, 가을]
draft: true
---

여기서부터 본문입니다.

## 소제목은 이렇게

**굵게**, *기울임*, [링크](https://example.com) 도 됩니다.

> 인용문은 이렇게 씁니다.
```

맨 위 `---` 사이는 **글의 정보**, 그 아래는 **본문**입니다.

| 항목 | 설명 |
| --- | --- |
| `title` | 제목 (필수) |
| `date` | 작성일, `2026-09-09` 형식 (필수) |
| `category` | `essay` / `taste` / `place` / `training` 중 하나 (필수) |
| `description` | 목록에 보이는 한 줄 설명 |
| `tags` | 태그 목록 |
| `draft` | `true` 면 아직 공개되지 않습니다. **다 쓰면 이 줄을 지우세요** |
| `pinned` | `true` 면 홈 화면 맨 위에 고정됩니다 |
| `cover` | 대표 사진 (아래 참고) |

---

## 3. 사진 넣는 법

1. 사진 파일을 `src/content/posts/images/` 폴더에 넣습니다
2. 본문에서 이렇게 씁니다

```markdown
![사진 설명](./images/파일이름.jpg)
```

글 맨 위에 큰 대표 사진을 넣고 싶으면, 글 정보 부분에 이렇게 적습니다.

```yaml
cover: ./images/파일이름.jpg
coverAlt: 사진 설명
```

사진은 **알아서 압축되고 크기별로 만들어집니다.** 원본을 그대로 넣어도
방문자에게는 가벼운 파일이 전달되니, 용량을 줄이려고 애쓰지 않아도 됩니다.

---

## 4. 미리 보기

```bash
npm install    # 맨 처음 한 번만
npm run dev
```

터미널에 뜨는 주소(보통 http://localhost:4321/)를 브라우저에서 엽니다.
파일을 저장하면 화면이 바로 바뀝니다.

`draft: true` 인 글도 미리 보기에서는 보이지만, 실제 사이트에는 나가지 않습니다.

---

## 5. 사이트에 올리기

```bash
git add .
git commit -m "새 글: 제목"
git push
```

푸시하면 GitHub가 알아서 사이트를 다시 만들어 배포합니다.
진행 상황은 저장소의 **Actions** 탭에서 볼 수 있고, 보통 1~2분 걸립니다.

Claude Code에게 "올려줘" 라고 해도 됩니다.

---

## 6. 설정 바꾸기

거의 모든 설정은 **`site.config.mjs`** 파일 하나에 모여 있습니다.

| 바꾸고 싶은 것 | 고칠 곳 |
| --- | --- |
| 사이트 이름, 소개 문구 | `site.config.mjs` 의 `SITE` |
| 홈 화면 첫 인사말 | `SITE.intro` |
| 카테고리 추가/삭제 | `site.config.mjs` 의 `CATEGORIES` |
| 메일·인스타 링크 | `SITE.links` |
| 소개 페이지 내용 | `src/pages/about.md` |
| 색과 글자 크기 | `src/styles/global.css` 맨 위 |

---

## 7. 나중에 광고 붙이기

광고는 **기본적으로 꺼져 있습니다.** 켜더라도 본문 목록 중간이나 사이드바가 아니라
**글이 끝난 뒤 딱 한 자리**에만, "광고" 라는 작은 표시와 함께 조용히 들어갑니다.

켜는 방법은 `site.config.mjs` 에서:

```js
ads: {
  enabled: true,
  client: 'ca-pub-여기에애드센스번호',
  slots: {
    afterPost: '광고단위번호',
  },
},
```

애드센스 승인에는 보통 **글이 어느 정도 쌓여 있어야** 하니,
당분간은 꺼둔 채로 글부터 모으는 걸 권합니다.

방문자 수를 보고 싶으면 `SITE.analytics.plausibleDomain` 에 도메인을 적으면 됩니다.
(비워두면 어떤 추적 스크립트도 붙지 않습니다.)

---

## 8. 개인 도메인 연결하기

도메인을 샀다면:

1. `site.config.mjs` 에서 `site` 만 바꿉니다
   ```js
   site: 'https://내도메인.com',
   ```
2. `public/CNAME` 파일을 만들고 안에 `내도메인.com` 한 줄만 적습니다
3. 도메인 구매처에서 DNS를 GitHub Pages 쪽으로 연결합니다
4. GitHub 저장소 → Settings → Pages → Custom domain 에 도메인 입력

이 과정도 Claude Code에게 "도메인 연결 도와줘" 라고 하면 같이 해줍니다.

---

## 폴더 구조

```
site.config.mjs           ← 사이트 설정 (여기를 제일 자주 고칩니다)
src/
  content/posts/          ← 글이 들어가는 곳
    images/               ← 글에 넣을 사진
  pages/
    about.md              ← 소개 페이지
  styles/global.css       ← 색, 글자, 여백
  components/             ← 머리말, 꼬리말 같은 조각
  layouts/                ← 페이지 틀
public/                   ← 파비콘 등 그대로 복사되는 파일
.github/workflows/        ← 자동 배포 설정
```

---

## 쓰는 기술

[Astro](https://astro.build) — 마크다운 글을 정적 HTML로 바꿔주는 도구입니다.
방문자에게는 순수한 HTML만 전달되기 때문에 아주 빠르고, 서버가 필요 없습니다.
