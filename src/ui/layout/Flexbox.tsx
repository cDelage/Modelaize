import styled from "styled-components";

export const Row = styled.div<{
  $gap?: string;
  $justify?: string;
  $align?: string;
  $grow?: number;
  $shrink?: number;
  $padding?: string;
  $width?: string;
  $minHeight?: string;
  $height?: string;
  $overflow?: string;
  $boxSizing?:string;
  $flexWrap?: string;
  $cursor?: string;
}>`
  display: flex;
  box-sizing: border-box;
  gap: ${(props) => props.$gap};
  justify-content: ${(props) => props.$justify};
  align-items: ${(props) => props.$align};
  flex-grow: ${(props) => props.$grow};
  flex-shrink: ${(props) => props.$grow};
  padding: ${(props) => props.$padding};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  overflow: ${(props) => props.$overflow};
  box-sizing: ${(props) => props.$boxSizing};
  min-height: ${(props) => props.$minHeight};
  flex-wrap: ${(props) => props.$flexWrap};
  cursor: ${(props) => props.$cursor};
  `;

export const Column = styled.div<{
  $gap?: string;
  $justify?: string;
  $align?: string;
  $grow?: number;
  $shrink?: number;
  $padding?: string;
  $width?: string;
  $height?: string;
  $overflow?: string;
  $boxSizing?:string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap};
  justify-content: ${(props) => props.$justify};
  align-items: ${(props) => props.$align};
  flex-grow: ${(props) => props.$grow};
  flex-shrink: ${(props) => props.$grow};
  padding: ${(props) => props.$padding};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  overflow: ${(props) => props.$overflow};
  box-sizing: ${(props) => props.$boxSizing};
`;
