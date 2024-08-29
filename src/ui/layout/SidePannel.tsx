import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { useDivClickOutside } from "../../utils/useDivClickOutside";

const ModalContainerStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-modal);
`;

const ModalBodyStyled = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background-color: var(--background-main);
  width: 700px;
  height: 100%;
  border-left: 1px solid var(--stroke-main);
  display: flex;
  flex-direction: column;
`;

type ModalContextType =
  | {
      isOpen: boolean;
      toggleIsOpen: () => void;
    }
  | undefined;

const ModalContext = createContext<ModalContextType>(undefined);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal context was used outside of his scope");
  return context;
}

function SidePannel({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, [setIsOpen]);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        toggleIsOpen,
      }}
    >
      <SidePannelBackground />
      {children}
    </ModalContext.Provider>
  );
}

function SidePannelBackground() {
  const { isOpen } = useModalContext();
  return createPortal(
    (
      <CSSTransition
        in={isOpen}
        timeout={200}
        mountOnEnter
        unmountOnExit
        classNames="background"
      >
        <ModalContainerStyled />
      </CSSTransition>
    ) as ReactElement,
    document.body
  );
}

function SidePannelButton({ children }: { children: ReactNode }) {
  const { toggleIsOpen } = useModalContext();
  return cloneElement(children as ReactElement, { onClick: toggleIsOpen });
}

function SidePannelBody({ children }: { children: ReactNode }) {
  const { isOpen, toggleIsOpen } = useModalContext();
  const RefModalBody = useDivClickOutside(toggleIsOpen);

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames="modal"
    >
      <ModalBodyStyled ref={RefModalBody}>{children}</ModalBodyStyled>
    </CSSTransition>,
    document.body
  );
}

SidePannel.SidePannelButton = SidePannelButton;
SidePannel.SidePannelBody = SidePannelBody;
export default SidePannel;
