/**
 * site.config.mjs 의 base 경로를 자동으로 붙여주는 링크 헬퍼.
 * 지금은 base 가 '/' 라 그대로 통과하지만, 나중에 주소 구조가 바뀌어도
 * 이 함수를 거친 링크는 전부 알아서 따라갑니다.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL || '/';
  const left = base.endsWith('/') ? base.slice(0, -1) : base;
  const right = path.startsWith('/') ? path : `/${path}`;
  const joined = `${left}${right}`;
  return joined === '' ? '/' : joined;
}
