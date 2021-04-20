import React from 'react'

function HumanDuration(props: {seconds: number}) {
    const hour = 3600;
    const minute = 60;

    let { seconds } = props

    const hours = Math.floor(seconds / hour);
    seconds = seconds - hours * hour;

    const minutes = Math.floor(seconds / minute);
    seconds = seconds - minutes * minute;

    return (
        <span>
            { hours > 0 && <>{hours}h</> }
            { minutes > 0 && <>{minutes}m</> }
            { seconds > 0 && <>{seconds}s</> }
        </span>
    )
}

export default HumanDuration