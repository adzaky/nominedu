import { cn } from "@/lib/utils";

const TitleContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-fit items-stretch", className)}>
      <div className="w-1 rounded-r-xl bg-primary" />
      <div className="ml-2 flex items-center">{children}</div>
    </div>
  );
};

export { TitleContainer };
