export type InputProps = {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}