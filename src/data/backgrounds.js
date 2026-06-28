// Curated background presets. The `value` is a CSS background string applied
// directly to the root container, so gradients and plain colours both work.

export const BACKGROUNDS = [
  { id: 'sunset',   label: 'Sunset',   value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { id: 'ocean',    label: 'Ocean',    value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { id: 'forest',   label: 'Forest',   value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { id: 'lavender', label: 'Lavender', value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  { id: 'midnight', label: 'Midnight', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { id: 'paper',    label: 'Paper',    value: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' },
];

export const DEFAULT_BACKGROUND = BACKGROUNDS[0];