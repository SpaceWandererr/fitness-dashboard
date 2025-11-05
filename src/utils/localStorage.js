export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const load = (key, fallback = null) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
