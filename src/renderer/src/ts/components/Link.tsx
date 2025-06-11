import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

export interface CustomLink {
  url: string,
  text?: string,
  is_external_link: boolean
}

export const Link = ({ link, className, children }: { link: CustomLink, className?: string, children: ReactNode }) => {
  return link.is_external_link ? (
    <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.text} className={className}>
      {children}
    </a>
  ) : (
    <RouterLink to={link.url} title={link.text} className={className}>
      {children}
    </RouterLink>
  );
};