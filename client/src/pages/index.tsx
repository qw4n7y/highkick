import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../redux/state'

import JobRootsList from './../components/jobs/roots'

type Props = {
}
class App extends React.Component<Props> {

  render() {
    return (
      <JobRootsList/>
    );
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
