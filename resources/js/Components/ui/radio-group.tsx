import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    // Clona los hijos y les inyecta las propiedades necesarias
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          isSelected: child.props.value === value,
          onSelect: () => onValueChange?.(child.props.value),
        });
      }
      return child;
    });

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {enhancedChildren}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSelected?: boolean;
  onSelect?: () => void;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, isSelected, onSelect, id, value, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        id={id}
        className={cn(
          "h-4 w-4 rounded-full border-gray-300 text-theme-azul focus:ring-theme-azul",
          className
        )}
        checked={isSelected}
        onChange={() => onSelect?.()}
        value={value}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";
