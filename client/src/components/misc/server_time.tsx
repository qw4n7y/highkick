import React from 'react'
import * as ReactRedux from 'react-redux'

import ReduxState from './../../redux/state'
import AppActions, { Hello } from '../../redux/actions/app'

import { Clock } from 'react-bootstrap-icons'

type Props = {
    hello?: () => Promise<Hello>
}

type State = {
  serverTime: string
}

class ServerTime extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
          serverTime: ""
        }
    }

    async componentDidMount() {
      const hello = await this.props.hello!()
      this.setState({
        serverTime: hello.ServerTime
      })
    }

    render() {
        return (
            <div>Server<Clock/>&nbsp;{this.state.serverTime}</div>)
    }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
    hello: () => dispatch(AppActions.hello())
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ServerTime)