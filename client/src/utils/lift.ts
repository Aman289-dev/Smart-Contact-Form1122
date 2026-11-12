// Hover lift for buttons: 2px over 200ms, skipped when the visitor prefers reduced motion.
// `translate` is listed because Tailwind v4's translate utilities set that property, not `transform`.
export const lift =
  'transition-[color,background-color,border-color,translate] duration-200 motion-safe:hover:-translate-y-0.5';
