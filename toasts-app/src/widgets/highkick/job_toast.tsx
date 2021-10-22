import React from 'react'
import HighkickJob from '../../models/highkick_job'

import { FileEarmarkBarGraph } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'

function JobToast(props: { job: HighkickJob, siblings: {[key: string]: number} }) {
  const { job, siblings } = props

  const [ showReport, setShowReport ] = React.useState<boolean>(false)

  const failedSiblingsCount = siblings['failed'] || 0
  const totalSiblingsCount = Object.entries(siblings).map(v => v[1]).reduce((acc, count) => acc + count, 0)
  const finishedSiblingsCount = totalSiblingsCount - (siblings['processing'] || 0)
  
  const isScheduled = job.status === 'scheduled'
  const isProcessing = job.status === 'processing' || (siblings['processing'] || 0 > 0)
  const isFailed = job.status === 'failed' || failedSiblingsCount > 0

  const spinner = <div className="rotate d-inline-block m-1" style={{zoom: 2}}>⚙️</div>
  
  var report = ""
  if (!!job.output) {
    const outputObject = JSON.parse(job.output)
    if ('report' in outputObject) {
      report = outputObject.report
    }
  }
  
  return (
    <>
      <p className='m-0'>{job.type}</p>
      {isScheduled && <p className='m-0'>{spinner} Will start shortly</p>}
      {isProcessing && <p className='m-0'>{spinner} Running {finishedSiblingsCount} / {totalSiblingsCount}</p>}
      {isFailed && <p className='m-0'>Failed: {failedSiblingsCount}</p>}
      { !!report && <p className="m-0" onClick={() => setShowReport(!showReport)}><FileEarmarkBarGraph/>&nbsp;Show report</p> }
      { showReport && (
        <Modal
          show={showReport} onHide={() => setShowReport(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Job report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              dangerouslySetInnerHTML={{__html: report.replaceAll("\n", "<br/>")}}
            ></div>
          </Modal.Body>
        </Modal>
      ) }
    </>)
}

export default JobToast