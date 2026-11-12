// The API the tests run against: a copy of the server on a test database of its own, which the
// platform starts for every run (the run_tests tool). Never the app the user sees, and never its
// data. Keep this file as it is; add shared helpers beside it.
const base = process.env.ICOD_TEST_URL_API;
if (!base) {
  throw new Error('ICOD_TEST_URL_API is not set: run the tests with the run_tests tool');
}
export const API = base;

export interface Reply<T> {
  status: number;
  body: T;
  headers: Headers;
}

// One request to the API, its JSON body sent and read back:
// call('POST', '/api/notes', { title: 'a' }). Pass a session's cookie or token in headers.
export async function call<T = any>(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<Reply<T>> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON: the text itself.
  }
  return { status: response.status, body: parsed as T, headers: response.headers };
}

// A value no other test uses (a title, an email), so tests never depend on each other's data.
export function unique(prefix = 'test'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
