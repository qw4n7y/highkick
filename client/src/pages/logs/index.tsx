import React from 'react'
import Moment from 'moment'

import Service, { Filters } from '../../services/job_logs'
import JobLog from "../../models/job_log"

type Props = {}

function LogsIndex(props: Props) {
    let pulseIndicatorEl = React.createRef<HTMLDivElement>()

    // STATE

    const [items, setItems] = React.useState<JobLog[]>([])
    const [idSince, setIDSince] = React.useState<number | undefined>(undefined)
    const [since, setSince] = React.useState<Moment.Moment>(Moment())

    // EFFECTS

    React.useEffect(() => {
        loadMoreRecursive()
    }, [])

    // ACTIONS

    const touchPulseIndicator = () => {
        pulseIndicatorEl.current?.classList.add("active")
        setTimeout(() => {
            pulseIndicatorEl.current?.classList.remove("active")
        }, 500)
    }

    const loadMoreRecursive = async () => {
        const filters: Filters = {
            Limit: 1000
        }
        if (!!idSince) {
            filters.IDSince = idSince
        } else {
            filters.Since = since.format(Moment.defaultFormat)
        }
        const newItems = await Service.index(filters)
        if (newItems.length === 0) {
            setTimeout(loadMoreRecursive, 5000) // no logs - sleep 5
        } else {
            const maxId = newItems[newItems.length - 1].id
            setIDSince(maxId)
            setItems([...items, ...newItems])

            setTimeout(loadMoreRecursive, 1000) // logs are here - sleep 1
        }
        
        touchPulseIndicator()
    }

    // RENDER

    return (
        <>
            <div className="jumbotron p-2 m-1 d-flex align-items-center">
                <p className="m-0 lead text-monospace font-weight-bold mr-4 flex-fill">
                    Logs&nbsp;
                <div 
                className="d-inline-block pulse-indicator"
                ref={pulseIndicatorEl}
                ></div></p>
            </div>
            <table className="table table-sm">
                { items.reverse().map(item => {
                    return (
                        <tr key={item.id}>
                            <td className="text-muted">{item.id}</td>
                            <td>{item.content}</td>
                            <td>{Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                        </tr>
                    )
                }) }
            </table>
        </>
    );
}

export default LogsIndex
