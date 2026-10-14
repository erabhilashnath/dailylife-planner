const BASE_URL = "http://localhost:4000/api";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function fetchTodosForDate(date) {
  return request(`/todos?date=${date}`);
}

export function fetchTodoCounts(start, end) {
  return request(`/todos/counts?start=${start}&end=${end}`);
}

export function createTodo(todo) {
  return request("/todos", { method: "POST", body: JSON.stringify(todo) });
}

export function updateTodo(id, patch) {
  return request(`/todos/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, { method: "DELETE" });
}
