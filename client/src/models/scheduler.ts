class Scheduler {
    ID!: number
    JobType!: string
    JobInput!: string
    RunEverySeconds!: number
    Stopped!: boolean
    UpdatedAt!: string
    LastRunAt!: string
    LastError!: string

    constructor(props: any) {
        for(const prop in props) {
            (this as any)[prop] = (props as any)[prop]
        }
    }
}

export default Scheduler