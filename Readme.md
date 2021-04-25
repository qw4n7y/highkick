```import "github.com/qw4n7y/highkick"```

### Types

- Input = map[string]interface{}
- Job(SID, Input, Output, Status)
- JobMeta(SID, title, InputJSONSchema)
- PubSubMessage(Job, error)

### Setup

- SetupDatabase(DatabaseOptions(DB sql.DB, Engine DatabaseEngine, Database string, RunMigrations bool))
- RunServer(ServerParams(AuthMiddleware, ClientURL))
- RunSchedulers
- RunWorkerLauncher

### Job

- Register(JobMeta)
- NewJob(SID, Input, Parent)
- RunSync(Job)
- RunAsync(Job)

### Utils

- Lock(Job)
- Unlock(Job)
- Log(Job, message)
- SetOutput(Job, key, value)
- GetOutput(Job, key)

### PubSub

- JobsPubSub.Subscribe(onMessage(PubSubMessage))