### Dev

```docker-compose up && make run && make run_client_dev_server``` to run server
```http://localhost:3000/``` to open Highkick GUI
```http://localhost:8000/app/``` to open sample page with Highkick Widget integration

### VARIABLES

var GetOutput = jobs.GetOutput
    GetOutput gets string by key from job's dictionary

var JobsPubSub = jobs.JobsPubSub
    Keeps reference to jobs update pubSub

var Log = jobs.Log
    Log associates custom message with a jon and persists it to database

var NewJob = models.BuildJob
    NewJob builds new job instance

var NewPeriodicalJob = models.NewPeriodicalJob
    NewJob builds new periodical job instance

var Register = jobs.Register
    Register registers a worker and associate it with provided string
    identificator

var Run = jobs.RunJob
    Run registers intent to run a new job, validates it can be executed and
    executes it in goroutine

var RunJobCoherently = jobs.RunJobCoherently
    RunJobCoherently executes job on the fly returning execution results

var RunWithOneWorkerAtOnce = jobs.RunWithOneWorkerAtOnce
    RunWithOneWorkerAtOnce runs the job with one worker at once

var RunWithOneWorkerAtOnceCoherently = jobs.RunWithOneWorkerAtOnceCoherently
    RunWithOneWorkerAtOnceCoherently runs the job in coherent mode with one
    worker at once

var SetOutput = jobs.SetOutput
    SetOutput preserves string value by key in job's dictionary

var Setup = database.Setup
    Setup establishes database connection

var SetupServer = server.Setup
    SetupServer setup GIN engine for GUI backend


### TYPES

type Input = models.JSONDictionary
    Input keeps job parameters as JSON-serializable disctionary

type Job = models.Job
    Job is job instance

type JobMeta = jobs.Job

type PubSubMessage = models.PubSubMessage
    PubSub Message

type SetupOptions = database.SetupOptions
    SetupOptions is options for setup