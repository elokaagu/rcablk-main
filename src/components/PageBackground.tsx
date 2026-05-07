type PageBackgroundProps =
  | { color: string; background?: never }
  | { background: string; color?: never };

// Sets the document-level background to match the page so that browser
// overscroll/elastic scroll (e.g. macOS Safari rubber-band) doesn't reveal the
// default white body behind a colored page. Render once per route at the top
// of the page tree. Pass `color` for a solid fill or `background` for any CSS
// `background` shorthand value (e.g. a gradient).
export default function PageBackground(props: PageBackgroundProps) {
  const declaration = "color" in props && props.color !== undefined
    ? `background-color:${props.color};`
    : `background:${props.background};`;
  const css = `html,body{${declaration}}`;
  return <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />;
}
