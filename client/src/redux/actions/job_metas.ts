import ReduxState from '../state'
import JobMeta from '../../models/job_meta'
import Filters from '../../models/filters'

import JobMetas from '../../services/job_metas'

// Types

export const INDEX = 'JOB_METAS/INDEX'

// Actions

export class Index {
  type = INDEX
  constructor(public items: JobMeta[]) { }
}

// Action creators

function index() {
  return async (dispatch: any, getState: () => ReduxState) => {
    const items = await JobMetas.index()
    dispatch(new Index(items))
  }
}

export default { index }