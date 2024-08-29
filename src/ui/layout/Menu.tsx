import {
    MouseEvent,
    ReactElement,
    ReactNode,
    cloneElement,
    createContext,
    useContext,
    useState,
  } from "react";
  import styled from "styled-components";
  import { createPortal } from "react-dom";
import { PositionAbsolute } from "../../../electron/types/Position.type";
import { useUlOutsideClick } from "../../utils/useUlOutsideClick";
  
  const ListTabsStyled = styled.ul<ListTabsStyledProps>`
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-solid);
    position: absolute;
    z-index: 10;
    overflow: hidden;
    top: ${(props) => props.position.top}px;
    right: ${(props) => props.position.right}px;
    display: flex;
    flex-direction: column;
  `;
  
  const TabStyled = styled.button`
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: var(--space-2);
    background-color: transparent;
    border: none;
    font-size: 1rem;
    padding: var(--space-2) var(--space-4);
    cursor: pointer;
    color: var(--text-main);
    &:hover {
      background-color: var(--background-hover);
      color: var(--text-hover);
    }
  `;
  
  type MenuProps = {
    children: ReactNode;
  };
  
  type MenuContextProps = {
    position: PositionAbsolute | null;
    open: (pos: PositionAbsolute, id: string) => void;
    close: () => void;
    openId: string | null;
  };
  
  type ListTabsProps = {
    children: ReactNode;
  };
  
  type ListTabsStyledProps = {
    position: PositionAbsolute;
    width?: number;
  };
  
  type TabMenuProps = {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  };
  
  type ToggleMenuProps = {
    children: ReactNode;
    id: string;
    isStyleNotApplied?: boolean;
  };
  
  const MenuContext = createContext<MenuContextProps | null>(null);
  
  function Menu({ children }: MenuProps): JSX.Element {
    const [position, setPosition] = useState<PositionAbsolute | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
  
    function open(pos: PositionAbsolute, id: string) {
      setPosition(pos);
      setOpenId(id);
    }
  
    function close() {
      setPosition(null);
      setOpenId(null);
    }
  
    return (
      <MenuContext.Provider value={{ position, open, close, openId }}>
        {children}
      </MenuContext.Provider>
    );
  }
  
  /**
   * Unorder list of action in the menu
   */
  function ListTabs({ children }: ListTabsProps): JSX.Element | null {
    const { position, close } = useContext(MenuContext) as MenuContextProps;
    const ref = useUlOutsideClick(close, false);
    if (position === null) return null;
  
    return createPortal(
      <ListTabsStyled position={position} ref={ref}>
        {children}
      </ListTabsStyled>,
      document.body
    );
  }
  
  /**
   * List item of action in the menu ul.
   */
  function Tab({ children, onClick, disabled,  }: TabMenuProps): JSX.Element {
    const { close } = useContext(MenuContext) as MenuContextProps;
    function handleClick(e: MouseEvent) {
      e.stopPropagation();
      onClick?.();
      close();
    }
  
    return (
      <li>
        <TabStyled onClick={handleClick} className="menu-button" disabled={disabled}>
          {children}
        </TabStyled>
      </li>
    );
  }
  
  /**
   * Toggle menu
   */
  function Toggle({
    children,
    id,
    isStyleNotApplied,
  }: ToggleMenuProps): JSX.Element {
    const { open, close, openId } = useContext(MenuContext) as MenuContextProps;
  
    function handleClick(e: MouseEvent) {
      e.stopPropagation();
      const rect = (e.target as HTMLElement)
        .closest("button")
        ?.getBoundingClientRect();
      if (rect) {
        const menuPosition: PositionAbsolute = {
          right: window.innerWidth - rect.width - rect.x,
          top: rect.y + rect.height,
        };
        openId === "" || openId !== id ? open(menuPosition, id) : close();
      }
    }
    if (isStyleNotApplied) return <div onClick={handleClick}>{children}</div>;
    return  cloneElement(children as ReactElement, {onClick : handleClick});
  }
  
  Menu.Tab = Tab;
  Menu.Toggle = Toggle;
  Menu.ListTabs = ListTabs;
  export default Menu;
  