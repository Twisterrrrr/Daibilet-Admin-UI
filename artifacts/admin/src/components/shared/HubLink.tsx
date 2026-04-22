import { useLocation } from "wouter";
import { ExternalLink } from "lucide-react";

interface HubLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showExternal?: boolean;
  testId?: string;
}

/**
 * Cross-hub link with native cmd/ctrl-click support to open in a new tab.
 * Always renders an <a> so middle-click and "Open in new tab" work,
 * but uses wouter navigation on plain click.
 */
export function HubLink({ href, children, className, showExternal = true, testId }: HubLinkProps) {
  const [, setLocation] = useLocation();

  return (
    <a
      href={href}
      data-testid={testId}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let browser open new tab
        e.preventDefault();
        setLocation(href);
      }}
      onAuxClick={(e) => {
        if (e.button === 1) {
          // middle-click — let browser handle it
        }
      }}
      className={className ?? "inline-flex items-center gap-1 text-primary hover:underline"}
      title={`${href} · ⌘/Ctrl+клик — в новой вкладке`}
    >
      {children}
      {showExternal && <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />}
    </a>
  );
}
