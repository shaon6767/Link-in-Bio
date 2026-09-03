let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch(
  input: string,
  init: RequestInit = {},
  { redirectOnFail = false }: { redirectOnFail?: boolean } = {}
): Promise<Response> {
  const opts: RequestInit = { credentials: 'include', ...init };
  let res = await fetch(input, opts);

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      res = await fetch(input, opts);
    } else if (redirectOnFail && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return res;
}