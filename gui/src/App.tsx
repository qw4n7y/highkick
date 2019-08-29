import React from 'react';

import { Row, Col } from 'react-bootstrap'

import Layout from './components/layout'
import JobRootsList from './components/jobs/roots'

const App: React.FC = () => {
  return (
    <Layout>
      <Row>
        <Col md={12} className="pt-2">
          <JobRootsList/>
        </Col>
      </Row>
    </Layout>
  );
}

export default App
