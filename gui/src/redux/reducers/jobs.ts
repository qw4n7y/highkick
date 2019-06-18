import * as Actions from '../actions/jobs'
import Job from '../../models/job'

export type State = Job[]

const defaultState: State = []

type Action = Actions.Index | Actions.Update | Actions.Destroy
export default function reducer(state: State = defaultState, action: Action) {
  switch (action.type) {
    case Actions.INDEX: {
      const a = action as Actions.Index
      return a.jobs
    }
    case Actions.UPDATE: {
      const a = action as Actions.Update
      const newJob = a.job
      
      const sameJob = state.find((j: Job) => j.id === a.job.id)
      if (!sameJob) {
        state.unshift(newJob)
        return state
      }

      const index = state.indexOf(sameJob)
      state[index] = newJob

      return state.slice(0)
    }
    case Actions.DESTROY: {
      const a = action as Actions.Destroy
      return state.filter(j => j.id !== a.job.id)
    }
  }

  return state
}