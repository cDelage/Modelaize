import { ReactNode, useContext, createContext, useState } from "react";
import styled, { css } from "styled-components";

type TabsContextType = {
  openId?: string;
};

export type Tab = {
  id: string;
  children: ReactNode;
};

const TabStyled = styled.div<{ $active: boolean }>`
  padding: var(--space-1) var(--space-2);
  cursor: pointer;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  user-select: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  ${(props) =>
    props.$active &&
    css`
      color: var(--text-active);
      border-bottom: 2px solid var(--stroke-active-dark);
    `}

  &:hover {
    background-color: var(--background-hover);
  }
`;

const HeaderContainerStyled = styled.div`
  display: flex;
  border-bottom: 1px solid var(--stroke-main);
  padding: 0px var(--space-4);
`;

const WindowContainerStyled = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const TabsContainerStyled = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabsContext = createContext<TabsContextType>({});

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContext was used outside of his scope");
  return context;
}

function Tabs({ tabs, children }: { tabs: Tab[]; children: ReactNode }) {
  const [openId, setOpenId] = useState<string | undefined>(
    tabs[0] ? tabs[0].id : ""
  );

  return (
    <TabsContext.Provider value={{ openId }}>
      <TabsContainerStyled id="tabs-container">
        <HeaderContainerStyled>
          {tabs.map((tab) => (
            <TabStyled
              key={tab.id}
              $active={openId === tab.id}
              onClick={() => setOpenId(tab.id)}
            >
              {tab.children}
            </TabStyled>
          ))}
        </HeaderContainerStyled>
        <WindowContainerStyled>{children}</WindowContainerStyled>
      </TabsContainerStyled>
    </TabsContext.Provider>
  );
}

function Window({ id, children }: { id: string; children: ReactNode }) {
  const { openId } = useTabsContext();
  if (openId !== id) return null;

  return children;
}

Tabs.Window = Window;

export default Tabs;
