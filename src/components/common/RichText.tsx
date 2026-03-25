import React from "react";

const ALLOWED_TAGS: Record<string, React.ElementType> = {
  b: "strong",
  br: "br",
  em: "em",
  i: "i",
  li: "li",
  ol: "ol",
  p: "p",
  span: "span",
  strong: "strong",
  ul: "ul",
};

const getSafeClassName = (element: Element) => {
  const className =
    element.getAttribute("class") ?? element.getAttribute("classname");

  return className?.trim() ? className.trim() : undefined;
};

const renderSafeNodes = (nodes: ChildNode[], keyPrefix: string): React.ReactNode[] =>
  nodes.flatMap((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (node.nodeType === 3) {
      return node.textContent ?? "";
    }

    if (node.nodeType !== 1) {
      return [];
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    const component = ALLOWED_TAGS[tagName];
    const children = renderSafeNodes(Array.from(element.childNodes), key);

    if (!component) {
      return children;
    }

    const className = getSafeClassName(element);
    const props = className ? { key, className } : { key };

    if (component === "br") {
      return React.createElement("br", props);
    }

    return React.createElement(component, props, children);
  });

export const renderRichText = (html: string) => {
  if (!html) return null;

  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, "");
  }

  const documentFragment = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    "text/html"
  );

  return renderSafeNodes(Array.from(documentFragment.body.childNodes), "rich-text");
};

type RichTextProps<T extends React.ElementType = "div"> = {
  as?: T;
  html: string;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "children" | "dangerouslySetInnerHTML"
>;

const RichText = <T extends React.ElementType = "div">({
  as,
  html,
  ...props
}: RichTextProps<T>) => {
  const Component = (as ?? "div") as React.ElementType;

  return <Component {...props}>{renderRichText(html)}</Component>;
};

export default RichText;
