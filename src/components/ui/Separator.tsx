import { cn } from "@/utils/cn"

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-[#21262d]", className)} />
}
