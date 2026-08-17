import { createElement, type CSSProperties } from "react";

import type { IconName } from "@/core/document";
import { getIconDefinition } from "./icon-catalog";

interface IconGraphicProps {
  name: IconName;
  size: number;
  color: string;
  fill: string;
  strokeWidth: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function IconGraphic({
  name,
  size,
  color,
  fill,
  strokeWidth,
  className,
  style,
  title,
}: IconGraphicProps) {
  const definition = getIconDefinition(name);
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {definition.nodes.map((node, index) =>
        createElement(node.tag, { ...node.attrs, key: `${name}-${index}` }),
      )}
    </svg>
  );
}
