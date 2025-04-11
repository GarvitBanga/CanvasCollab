import { JSX, ReactNode } from "react";

export function Card({
  className = "",
  title,
  children,
  href,
}: {
  className?: string;
  title?: string;
  children: ReactNode;
  href?: string;
}): JSX.Element {
  const cardClasses =
    "rounded-2xl border border-border bg-background p-6 shadow-md transition hover:shadow-lg";

  const content = (
    <div className={`${cardClasses} ${className}`}>
      <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
        {title} <span className="text-primary">-&gt;</span>
      </h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}