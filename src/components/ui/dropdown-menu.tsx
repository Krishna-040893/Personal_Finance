"use client";

import { cn } from "@/lib/utils";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  cloneElement,
  isValidElement,
} from "react";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

/* ------------------------------------------------------------------ */
/*  DropdownMenu (root)                                                */
/* ------------------------------------------------------------------ */

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  DropdownMenuTrigger                                                */
/* ------------------------------------------------------------------ */

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ asChild, children, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
    onClick?.(e);
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: triggerRef,
      onClick: () => setOpen(!open),
      "aria-expanded": open,
      "aria-haspopup": true,
    });
  }

  return (
    <button
      ref={(node) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      type="button"
      aria-expanded={open}
      aria-haspopup="true"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* ------------------------------------------------------------------ */
/*  DropdownMenuContent                                                */
/* ------------------------------------------------------------------ */

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "bottom" | "top";
}

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "start", side = "bottom", children, ...props }, ref) => {
    const { open, setOpen } = useContext(DropdownContext);
    const menuRef = useRef<HTMLDivElement>(null);
    const focusIndex = useRef(-1);

    /* Close on outside click */
    useEffect(() => {
      if (!open) return;
      const handle = (e: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handle);
      return () => document.removeEventListener("mousedown", handle);
    }, [open, setOpen]);

    /* Keyboard navigation */
    const onKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const items = menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([disabled])'
        );
        if (!items?.length) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          focusIndex.current = Math.min(
            focusIndex.current + 1,
            items.length - 1
          );
          items[focusIndex.current]?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          focusIndex.current = Math.max(focusIndex.current - 1, 0);
          items[focusIndex.current]?.focus();
        } else if (e.key === "Escape") {
          setOpen(false);
        }
      },
      [setOpen]
    );

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="menu"
        onKeyDown={onKeyDown}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-elevated animate-scale-in",
          {
            "top-full mt-1.5": side === "bottom",
            "bottom-full mb-1.5": side === "top",
            "left-0": align === "start",
            "left-1/2 -translate-x-1/2": align === "center",
            "right-0": align === "end",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ------------------------------------------------------------------ */
/*  DropdownMenuItem                                                   */
/* ------------------------------------------------------------------ */

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, destructive, disabled, onClick, children, ...props }, ref) => {
    const { setOpen } = useContext(DropdownContext);

    return (
      <button
        ref={ref}
        role="menuitem"
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-body-sm transition-colors cursor-pointer select-none",
          "focus:bg-accent focus:text-accent-foreground focus:outline-none",
          destructive
            ? "text-destructive hover:bg-destructive-muted"
            : "text-foreground hover:bg-accent hover:text-accent-foreground",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ------------------------------------------------------------------ */
/*  DropdownMenuSeparator                                              */
/* ------------------------------------------------------------------ */

function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  DropdownMenuLabel                                                  */
/* ------------------------------------------------------------------ */

function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-caption font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
