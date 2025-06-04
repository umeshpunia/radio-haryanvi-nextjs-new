
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      const childrenArray = React.Children.toArray(children);

      if (childrenArray.length !== 1) {
        let childrenDetails = 'unknown (error in stringification)';
        try {
          childrenDetails = childrenArray.map(c => typeof c).join(', ');
        } catch (_) { /* ignore */ }
        const errorMessage = `CUSTOM ERROR FROM BUTTON.TSX (V3): 'asChild' expects exactly one child, but received ${childrenArray.length}. Child types: [${childrenDetails}]`;
        console.error(errorMessage, "Actual children object:", children);
        throw new Error(errorMessage);
      }
      
      const firstChild = childrenArray[0];
      if (!React.isValidElement(firstChild)) {
        let childDetail = 'unknown (error in stringification)';
        try {
          childDetail = String(firstChild);
        } catch (_) { /* ignore */ }
        const errorMessage = `CUSTOM ERROR FROM BUTTON.TSX (V3): Child provided to 'asChild' Button is not a valid React element. Child: ${childDetail}`;
        console.error(errorMessage, "Actual child object:", firstChild);
        throw new Error(errorMessage);
      }

      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {firstChild}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
