import React from 'react';

import { Container, Navbar } from 'react-bootstrap'

type Props = React.PropsWithChildren<{
  widget?: boolean
}>

const App: React.FC<Props> = (props: Props) => {
  const isWidget = props.widget || false

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="">
          🥋 High kick
        </Navbar.Brand>
      </Navbar>
      <Container className={isWidget ? "m-0 p-0" : undefined}>
        { props.children }
      </Container>
    </>);
}

export default App;
