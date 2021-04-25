```import "github.com/qw4n7y/highkick"```

### Types

- Input = map[string]interface{}
- Job
- JobMeta(SID, title, InputJSONSchema)
- PubSubMessage(Job, error)

### Setup

- SetupDatabase(SetupDatabaseOptions)
- RunServer(RunServerParams)
- RunSchedulers
- RunWorkerLauncher

### Job

- Register(JobMeta)
- NewJob(SID, Input, Parent)
- RunSync(Job)
- RunAsync(Job)

### Utils

- Lock(Job)
- Lock(Unlock)
- Log(Job, message)
- SetOutput(Job, key, value)
- GetOutput(Job, key)

### PubSub

- JobsPubSub.Subscribe(onMessage(PubSubMessage))