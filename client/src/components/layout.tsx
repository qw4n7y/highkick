import React from 'react';
import { Link } from 'react-router-dom'

import { Container, Navbar } from 'react-bootstrap'

type Props = React.PropsWithChildren<{
  widget?: boolean
}>

const Layout: React.FC<Props> = (props: Props) => {
  const isWidget = props.widget || false

  return (
    <>
      <Navbar bg="light" variant="light" className="border-dark border-bottom d-flex align-items-center">
        <Navbar.Brand href="" className="p-0 flex-fill">
          <img src="favicon.ico" height="32" width="32"/>
          &nbsp;
          <a href="/" className="text-dark">Highkick</a>
        </Navbar.Brand>

          <Link to="/index" className="pr-2">Jobs</Link>
          <Link to="/schedulers/index">Schedulers</Link>
      </Navbar>
      <Container className={isWidget ? "m-0 p-0" : undefined}>
        { props.children }
      </Container>
    </>);
}

export default Layout;
