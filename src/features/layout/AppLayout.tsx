import styled from 'styled-components'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const AppStyled = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  overflow: hidden;
`

const MainStyled = styled.main`
  flex-grow: 1;
  overflow: hidden;
`

function AppLayout() {
  return (
    <AppStyled>
      <Sidebar />
      <MainStyled>
        <Outlet/>
      </MainStyled>
    </AppStyled>
  )
}

export default AppLayout
