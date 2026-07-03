import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

type InputFormatConfig = {
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  sanitize?: (value: string) => string;
};

const INPUT_FORMAT_CONFIG: Record<string, InputFormatConfig> = {
  text: {},

  number: {
    inputMode: "numeric",
    pattern: "[0-9]*",
    sanitize: (value) => value.replace(/\D+/g, ""),
  },
  phone: {
    inputMode: "tel",
    pattern: "[0-9+]*",
    sanitize: (value) => value.replace(/[^0-9+]/g, ""),
  },
  alphanumeric: {
    sanitize: (value) => value.replace(/[^a-zA-Z0-9]/g, ""),
  },
};

type InputFormat = "text" | "number" | "phone" | "alphanumeric";

interface InputProps
  extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  format?: InputFormat;
}

const inputVariants = cva(`flex w-full border border-input text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:outline-none` , {
  variants: {
    variant: {
      lg: "h-10 px-4 text-sm rounded-md file:pe-4 file:me-4",
      md: "h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md file:pe-3 file:me-3",
      sm: "h-7 px-2.5 text-xs rounded-md file:pe-2.5 file:me-2.5",
    },
  },
  defaultVariants: {
    variant: "md",
  },
});

function Input({
  className,
  type = "text",
  variant,
  format = "text",
  onChange,
  ...props
}: InputProps) {
  const config = INPUT_FORMAT_CONFIG[format];

  return (
    <input
      data-slot="input"
      type={type}
      inputMode={config.inputMode}
      pattern={config.pattern}
      className={cn(inputVariants({ variant }), className)}
      {...props}
      onChange={(e) => {
        if (config.sanitize) {
          e.target.value = config.sanitize(e.target.value);
        }
        onChange?.(e);
      }}
    />
  );
}

export { Input, inputVariants };
