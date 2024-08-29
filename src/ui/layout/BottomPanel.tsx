import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { useDivClickOutside } from "../../utils/useDivClickOutside";
import { HiChevronDown } from "react-icons/hi2";

const BottomPanelStyled = styled.div`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  z-index: 10;
  height: 90%;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-gray-300);
  display: flex;
  flex-direction: column;
`;

type BottomPannelContextType =
  | {
      isOpen: boolean;
      toggleIsOpen: () => void;
    }
  | undefined;

const BottomPannelContext = createContext<BottomPannelContextType>(undefined);

function useBottomPannelContext() {
  const context = useContext(BottomPannelContext);
  if (!context) throw new Error("Modal context was used outside of his scope");
  return context;
}

function BottomPannel({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, [setIsOpen]);

  return (
    <BottomPannelContext.Provider
      value={{
        isOpen,
        toggleIsOpen,
      }}
    >
      {children}
    </BottomPannelContext.Provider>
  );
}

function PannelButton({ children}: { children: ReactNode}) {
  const { toggleIsOpen } = useBottomPannelContext();
  return cloneElement(children as ReactElement, { onClick: toggleIsOpen });
}

function PannelBody({ children, parentElement }: { children: ReactNode , parentElement?: RefObject<HTMLDivElement>  }) {
  const { isOpen, toggleIsOpen } = useBottomPannelContext();
  const RefModalBody = useDivClickOutside(toggleIsOpen);

  return createPortal(<CSSTransition
      in={isOpen}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames="bottom-pannel"
    >
      <BottomPanelStyled ref={RefModalBody}>{children}</BottomPanelStyled>
    </CSSTransition>, parentElement?.current ? parentElement.current : document.body);
}


const TabCollapseStyled = styled.div`
  height: 20px;
  min-height: 20px;
  display: flex;
  padding: 4px 16px;
  align-items: center;
  background-color: var(--color-gray-100);
  cursor: pointer;
  justify-content: space-between;
  &:hover {
    background-color: var(--color-gray-200);
  }
`;

function TabCollapse() {
  const { toggleIsOpen } = useBottomPannelContext();

  return (
    <TabCollapseStyled onClick={toggleIsOpen}>
      <HiChevronDown />
      <HiChevronDown />
    </TabCollapseStyled>
  );
}

BottomPannel.PannelButton = PannelButton;
BottomPannel.PannelBody = PannelBody;
BottomPannel.TabCollapse = TabCollapse;

export default BottomPannel;
