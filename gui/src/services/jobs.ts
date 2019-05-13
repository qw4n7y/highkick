import Job from '../models/job'

function composeTree(jobs: Job[]) {
  const root = jobs.find(j => j.isRoot())
  if (!root) {
    throw new Error('No root found')
  }

  const composeSubTree = (leaf: Job) => {
    leaf.childs = jobs.filter(job => job.parentID() === leaf.id)
    for(const child of leaf.childs) {
      composeSubTree(child)
    }
  }

  composeSubTree(root)
  return root
}

export default { composeTree }