import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends React.ComponentProps<"input"> {
  value?: string;
}

function formatCurrency(value: string) {
  if (!value) return "";

  return new Intl.NumberFormat("id-ID").format(Number(value));
}

export function CurrencyInput({
  className,
  value = "",
  onChange,
  ...props
}: CurrencyInputProps) {
  const formattedValue = formatCurrency(value);

  return (
    <InputGroup className={cn(className)}>
      <InputGroupAddon>
        <InputGroupText>Rp</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        {...props}
        value={formattedValue}
        inputMode="numeric"
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\D+/g, "");

          e.target.value = rawValue;

          onChange?.(e);
        }}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>IDR</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
