import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold transition-all duration-300 select-none shadow-sm h-7",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        azure:
          "border-blue-400/30 bg-linear-to-br from-blue-500/90 to-blue-600/90 text-white border-t-white/30 backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(59,130,246,0.3)]",
        stable:
          "border-green-400/30 bg-linear-to-br from-green-500/90 to-green-600/90 text-white border-t-white/30 backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(22,163,74,0.3)]",
        spike: 
          "border-red-400/30 bg-linear-to-br from-red-500/90 to-red-600/90 text-white border-t-white/30 backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(220,38,38,0.3)]",
        outline: "text-foreground border-border bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
