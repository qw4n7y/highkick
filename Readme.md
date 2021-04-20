### Dev

```docker-compose up && make run && make run_client_dev_server``` to run server
```http://localhost:3000/``` to open Highkick GUI
```http://localhost:8000/app/``` to open sample page with Highkick Widget integration

package highkick // import "github.com/qw4n7y/highkick"

type Input = models.JSONDictionary
type Job = models.Job
type JobMeta = models.JobMeta

var SetOutput = usecases.SetOutput
var GetOutput = usecases.GetOutput

type SetupDatabaseOptions = database.SetupOptions
var SetupDatabase = database.Setup

type RunServerParams = server.RunServerParams
var RunServer = server.RunServer

var NewJob = models.BuildJob
var Register = usecases.Register
var RunSync = usecases.RunSync
var RunAsync = usecases.RunAsync
var RunSchedulers = usecases.RunScheduler
var RunWorkerLauncher = usecases.RunWorkerLauncher

var Lock = usecases.Lock
var Unlock = usecases.Unlock

var Log = usecases.Log

type PubSubMessage = models.PubSubMessage
var JobsPubSub = usecases.JobsPubSub