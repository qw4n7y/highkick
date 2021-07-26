export enum SchedulerType {
    Timer = "timer",
    ExactTime = "exact_time"
}

class Scheduler {
    ID!: number
    JobType!: string
    JobInput!: string

    SchedulerType!: SchedulerType
    RunEverySeconds!: number
    ExactTimes!: string[]

    Stopped!: boolean
    UpdatedAt!: string
    
    LastRunAt!: string
    LastError!: string

    constructor(props: Partial<Scheduler>) {
        for(const prop in props) {
            (this as any)[prop] = (props as any)[prop]
        }
    }
}

export default Scheduler