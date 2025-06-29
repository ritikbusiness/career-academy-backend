import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  mainContentId?: string;
  className?: string;
}

export function SkipToContent({ 
  mainContentId = 'main-content',
  className 
}: SkipToContentProps) {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus skip link when Tab is first pressed
      if (event.key === 'Tab' && !event.shiftKey) {
        const focusedElement = document.activeElement;
        if (focusedElement === document.body || focusedElement === document.documentElement) {
          event.preventDefault();
          skipLinkRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkipClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const mainContent = document.getElementById(mainContentId);
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      ref={skipLinkRef}
      href={`#${mainContentId}`}
      onClick={handleSkipClick}
      className={cn(
        // Position it off-screen by default
        "sr-only absolute left-0 top-0 z-50 px-4 py-2 bg-blue-600 text-white rounded-br-md",
        // Make it visible when focused
        "focus:not-sr-only focus:block",
        // Ensure it has proper focus styles
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        // Add transition for smooth appearance
        "transition-all duration-200",
        className
      )}
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
}

// Screen Reader Only utility component
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenReaderOnly({ children, className }: ScreenReaderOnlyProps) {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
}

// Live Region for dynamic content announcements
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({ 
  children, 
  politeness = 'polite', 
  atomic = false,
  className 
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}

// Accessible Heading component with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AccessibleHeading({ 
  level, 
  children, 
  className,
  id
}: AccessibleHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      id={id}
      className={cn(
        "scroll-mt-20", // Offset for sticky headers
        className
      )}
    >
      {children}
    </Tag>
  );
}

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  className?: string;
}

export function FocusTrap({ children, active, className }: FocusTrapProps) {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = trapRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when trap becomes active
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <div ref={trapRef} className={className}>
      {children}
    </div>
  );
}