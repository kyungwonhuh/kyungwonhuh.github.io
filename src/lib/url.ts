/**
 * base 경로(예: /test-repo)를 자동으로 붙여주는 링크 헬퍼.
 * 나중에 개인 도메인으로 옮겨도 모든 링크가 그대로 동작합니다.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL || '/';
  const left = base.endsWith('/') ? base.slice(0, -1) : base;
  const right = path.startsWith('/') ? path : `/${path}`;
  const joined = `${left}${right}`;
  return joined === '' ? '/' : joined;
}
