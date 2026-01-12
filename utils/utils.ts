export function isColor(value: string): boolean {
  return (
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ||
    /^rgb(a?)\((\s*\d+\s*,){2,3}\s*[\d.]+\s*\)$/.test(value) ||
    /^hsl(a?)\((\s*\d+\s*,){2}\s*[\d.]+%\s*\)$/.test(value)
  ); 
}
