export function cn(...inputs) {
  // small runtime fallback for cn + twMerge used in template
  // we avoid adding TypeScript types here to keep parity with project
  const cls = inputs.filter(Boolean).join(' ')
  return cls
}
