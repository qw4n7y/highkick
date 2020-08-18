import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './redux/state'

import JobMeta from './models/job_meta'
import JobMetaActions from './redux/actions/job_metas'

import { Row, Col } from 'react-bootstrap'

import Layout from './components/layout'
import Router from './router'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { store, history } from './redux/store'

type Props = {
  jobMetas?: JobMeta[]
  indexJobMetas?: () => any
}
class App extends React.Component<Props> {
  componentDidMount() {
    this.props.indexJobMetas!()
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Layout>
            <Row>
              <Col md={12} className="pt-2">
                <Router/>
              </Col>
            </Row>
          </Layout>
        </ConnectedRouter>
      </Provider>
    );
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  indexJobMetas: () => dispatch(JobMetaActions.index()),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
