import {
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import { PositionAbsolute } from "../../../electron/types/Position.type";

type TooltipContextType = {
  showBody?: boolean;
  setShowBody?: (showBody: boolean) => void;
};

const TooltipContext = createContext<TooltipContextType>({});

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context)
    throw new Error("Tooltip context was used outside of his scope");
  return context;
}

const TooltipContainer = styled.div`
  position: relative;
`;

function Tooltip({ children }: { children: ReactNode }) {
  const [showBody, setShowBody] = useState<boolean>(false);

  return (
    <TooltipContext.Provider
      value={{
        showBody,
        setShowBody,
      }}
    >
      <TooltipContainer>{children}</TooltipContainer>
    </TooltipContext.Provider>
  );
}

function TooltipButton({ children }: { children: ReactNode }) {
  const { showBody, setShowBody } = useTooltipContext();
  return cloneElement(children as ReactElement, {
    onClick: () => setShowBody?.(!showBody),
  });
}

const TooltipBodyContainer = styled.div<{
  $width?: string;
  $position?: PositionAbsolute;
}>`
  position: absolute;
  width: ${(props) => props.$width};
  ${(props) => props.$position as CSSProp}
  z-index: 1;
`;

function TooltipBody({
  children,
  width,
  position,
}: {
  children: ReactNode;
  width?: string;
  position?: PositionAbsolute;
}) {
  const { showBody } = useTooltipContext();

  if (!showBody) return null;

  return <TooltipBodyContainer $width={width} $position={position}>{children}</TooltipBodyContainer>;
}

Tooltip.TooltipButton = TooltipButton;
Tooltip.TooltipBody = TooltipBody;

export default Tooltip;
