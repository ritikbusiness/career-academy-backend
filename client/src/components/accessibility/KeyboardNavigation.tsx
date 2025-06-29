import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Hook for keyboard navigation in lists/grids
interface UseKeyboardNavigationProps {
  itemCount: number;
  orientation?: 'vertical' | 'horizontal' | 'grid';
  gridColumns?: number;
  loop?: boolean;
  onActivate?: (index: number) => void;
}

export function useKeyboardNavigation({
  itemCount,
  orientation = 'vertical',
  gridColumns = 1,
  loop = false,
  onActivate
}: UseKeyboardNavigationProps) {
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = focusIndex;

      switch (key) {
        case 'ArrowDown':
          event.preventDefault();
          if (orientation === 'vertical' || orientation === 'grid') {
            newIndex = orientation === 'grid' 
              ? Math.min(focusIndex + gridColumns, itemCount - 1)
              : Math.min(focusIndex + 1, itemCount - 1);
            if (loop && newIndex === focusIndex && focusIndex === itemCount - 1) {
              newIndex = 0;
            }
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (orientation === 'vertical' || orientation === 'grid') {
            newIndex = orientation === 'grid'
              ? Math.max(focusIndex - gridColumns, 0)
              : Math.max(focusIndex - 1, 0);
            if (loop && newIndex === focusIndex && focusIndex === 0) {
              newIndex = itemCount - 1;
            }
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = Math.min(focusIndex + 1, itemCount - 1);
            if (loop && newIndex === focusIndex && focusIndex === itemCount - 1) {
              newIndex = 0;
            }
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = Math.max(focusIndex - 1, 0);
            if (loop && newIndex === focusIndex && focusIndex === 0) {
              newIndex = itemCount - 1;
            }
          }
          break;

        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;

        case 'End':
          event.preventDefault();
          newIndex = itemCount - 1;
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusIndex >= 0 && onActivate) {
            onActivate(focusIndex);
          }
          break;

        case 'Escape':
          setFocusIndex(-1);
          break;
      }

      if (newIndex !== focusIndex && newIndex >= 0 && newIndex < itemCount) {
        setFocusIndex(newIndex);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [focusIndex, itemCount, orientation, gridColumns, loop, onActivate]);

  // Focus the appropriate element when focusIndex changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || focusIndex < 0) return;

    const items = container.querySelectorAll('[data-keyboard-nav-item]');
    const item = items[focusIndex] as HTMLElement;
    if (item) {
      item.focus();
    }
  }, [focusIndex]);

  return {
    containerRef,
    focusIndex,
    setFocusIndex,
    containerProps: {
      ref: containerRef,
      role: orientation === 'grid' ? 'grid' : 'list',
      'aria-label': 'Navigable content',
      tabIndex: -1
    }
  };
}

// Keyboard navigable item component
interface KeyboardNavItemProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function KeyboardNavItem({ 
  index, 
  children, 
  className, 
  onClick,
  disabled = false
}: KeyboardNavItemProps) {
  return (
    <div
      data-keyboard-nav-item
      tabIndex={disabled ? -1 : 0}
      role="listitem"
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
}

// Modal keyboard navigation component
interface ModalKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnEscape?: boolean;
}

export function ModalKeyboard({ 
  isOpen, 
  onClose, 
  children, 
  className,
  closeOnEscape = true
}: ModalKeyboardProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the modal
    const modal = modalRef.current;
    if (modal) {
      modal.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modal?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        "focus:outline-none",
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}

// Focus management hook for complex interactions
export function useFocusManagement() {
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { focusVisible };
}

// Roving tabindex for radio groups and similar controls
interface RovingTabIndexProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  className?: string;
}

export function RovingTabIndex({ 
  children, 
  orientation = 'horizontal', 
  loop = false,
  className 
}: RovingTabIndexProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('[role="radio"], [role="tab"]')) as HTMLElement[];
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndex;

      const isVerticalKey = key === 'ArrowUp' || key === 'ArrowDown';
      const isHorizontalKey = key === 'ArrowLeft' || key === 'ArrowRight';

      if ((orientation === 'vertical' && isVerticalKey) || (orientation === 'horizontal' && isHorizontalKey)) {
        event.preventDefault();

        if (key === 'ArrowDown' || key === 'ArrowRight') {
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        } else {
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }

        setCurrentIndex(newIndex);
        items[newIndex]?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, orientation, loop]);

  // Update tabindex for all items
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('[role="radio"], [role="tab"]')) as HTMLElement[];
    items.forEach((item, index) => {
      item.tabIndex = index === currentIndex ? 0 : -1;
    });
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      className={className}
    >
      {children}
    </div>
  );
}