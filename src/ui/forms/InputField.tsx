import { ReactNode } from "react";
import { Column } from "../layout/Flexbox";

function InputField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <Column $gap="12px">
      <label>
        {label}
      </label>
      {children}
    </Column>
  );
}

export default InputField;
