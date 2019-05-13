import React from 'react';

import { Row, Col } from 'react-bootstrap'

import Layout from './components/layout'
import RootList from './components/roots_list'

const App: React.FC = () => {
  return (
    <Layout>
      <Row>
        <Col md={12}>
          <RootList/>
        </Col>
      </Row>
    </Layout>
  );
}

export default App
