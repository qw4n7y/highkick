import React from 'react';

import { Container, Navbar } from 'react-bootstrap'

const App: React.FC = (props: any) => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="">
          <img
            alt=""
            src="./logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top mr-4"
          />
          {'High kick'}
        </Navbar.Brand>
      </Navbar>
      <Container>
        { props.children }
      </Container>
    </>);
}

export default App;
