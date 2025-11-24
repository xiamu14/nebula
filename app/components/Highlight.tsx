import { cn } from "@heroui/react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-emerald-100 dark:bg-emerald-700/20 px-1 py-0.5 font-bold text-emerald-700 dark:text-emerald-500",
        className,
      )}
    >
      {children}
    </span>
  );
};
