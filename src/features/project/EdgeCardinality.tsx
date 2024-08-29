import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Position } from "reactflow";
import styled from "styled-components";

const CardinalityStyled = styled.div<{
  $left: number;
  $top: number;
  $zoom: number;
  $type: "PARENT" | "CHILD";
  $position: Position;
}>`
  position: absolute;
  left: ${(props) => `${props.$left}px`};
  top: ${(props) => `${props.$top}px`};
  font-size: 1.2rem;
  padding: var(--space-1);
  transform: scale(${(props) => props.$zoom}) ${(props) => props.$position === "left" ? "translateX(-100%)" : "translateX(100%)"} ${(props) => props.$type === "PARENT" && "translateY(-100%)"};
  border-radius: var(--radius);
  z-index: 1;
  background-color: white;
`;

function EdgeCardinality({
  children,
  left,
  top,
  zoom,
  type,
  position,
}: {
  children: ReactNode;
  top: number;
  left: number;
  zoom: number;
  type: "PARENT" | "CHILD";
  position: Position;
}) {
  return createPortal(
    <CardinalityStyled
      $left={left}
      $top={top}
      $zoom={zoom}
      $type={type}
      $position={position}
    >
      {children}
    </CardinalityStyled>,
    document.body
  );
}

export default EdgeCardinality;
