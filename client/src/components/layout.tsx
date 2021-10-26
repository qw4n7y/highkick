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
      <Navbar variant="light" className="bg-success d-flex align-items-center">
        <Navbar.Brand href="" className="p-0 flex-fill">
          <img src="favicon.ico" height="32" width="32"/>
          &nbsp;
          <a href="/" className="ml-2 text-white text-monospace font-weight-bold">Highkick</a>
        </Navbar.Brand>

          <Link to="/online" className="text-dark pr-2">Online</Link>
          <Link to="/index" className="text-dark pr-2">Jobs</Link>
          <Link to="/logs/index" className="text-dark pr-2">Logs</Link>
          <Link to="/workers/index" className="text-dark pr-2">Workers</Link>
          <Link to="/schedulers/index" className="text-dark">Schedulers</Link>
      </Navbar>
      <Container className={isWidget ? "m-0 p-0" : undefined}>
        { props.children }
      </Container>
    </>);
}

export default Layout;
