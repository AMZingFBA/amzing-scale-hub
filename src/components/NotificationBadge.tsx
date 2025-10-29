import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count?: number;
  className?: string;
}

export const NotificationBadge = ({ count, className }: NotificationBadgeProps) => {
  if (!count || count === 0) return null;

  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1",
        "bg-[#FF3B30] text-white text-[10px] font-semibold rounded-full",
        "animate-pulse shadow-lg shadow-red-500/50",
        "ring-2 ring-background",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};
