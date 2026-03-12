export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(error.error || "Request failed");
  }

  if (res.status === 204) return {} as T;
  return res.json();
}
