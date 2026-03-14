import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-xl font-bold whitespace-nowrap transition-all duration-300 ease-premium outline-none select-none cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 active:scale-95 group/btn",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-btn hover:shadow-primary/30 border border-white/10",
        premium: "bg-linear-to-br from-primary to-primary/80 text-white shadow-btn hover:shadow-lg hover:shadow-primary/20 border border-white/20",
        glossy: "bg-background/80 backdrop-blur-md border border-white/10 shadow-premium hover:bg-background transition-all",
        secondary: "bg-muted text-foreground hover:bg-muted/80 border border-border/50 shadow-sm",
        outline: "border-2 border-primary/20 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all px-4",
        ghost: "hover:bg-primary/10 hover:text-primary transition-colors",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
