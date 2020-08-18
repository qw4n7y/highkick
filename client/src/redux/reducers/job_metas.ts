import * as Actions from '../actions/job_metas'
import JobMeta from '../../models/job_meta'

export type State = JobMeta[]

const defaultState: State = []

type Action = Actions.Index
export default function reducer(state: State = defaultState, action: Action) {
  switch (action.type) {
    case Actions.INDEX: {
      const a = action as Actions.Index
      return a.items
    }
  }
  return state
}