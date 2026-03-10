import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export const NotificationBadge = ({ count, className, size = 'sm' }: NotificationBadgeProps) => {
  if (!count || count === 0) return null;

  const sizeClasses = size === 'md' 
    ? "min-w-[22px] h-[22px] text-[11px]" 
    : "min-w-[18px] h-[18px] text-[10px]";

  return (
    <span 
      className={cn(
        "flex items-center justify-center px-1",
        "bg-[#FF3B30] text-white font-semibold rounded-full",
        "animate-pulse shadow-lg shadow-red-500/50",
        "ring-2 ring-background",
        sizeClasses,
        className
      )}
    >
      {count >= 999 ? '999+' : count > 99 ? '99+' : count}
    </span>
  );
};
