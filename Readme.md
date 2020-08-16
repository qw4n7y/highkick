### Dev

```docker-compose up && make run```
```http://localhost:8000/highkick/client/``` to open Highkick GUI
```http://localhost:8000/app/``` to open sample page with Highkick Widget integration

### VARIABLES

var GetOutput = manager.GetOutput
    GetOutput gets string by key from job's dictionary

var JobsPubSub = manager.JobsPubSub
    Keeps reference to jobs update pubSub

var Log = manager.Log
    Log associates custom message with a jon and persists it to database

var NewJob = models.BuildJob
    NewJob builds new job instance

var NewPeriodicalJob = models.NewPeriodicalJob
    NewJob builds new periodical job instance

var Register = manager.RegisterWorker
    Register registers a worker and associate it with provided string
    identificator

var SetupServer = server.Setup
    SetupServer setup GIN handlers for GUI backend to /highkick

var Run = manager.RunJob
    Run registers intent to run a new job, validates it can be executed and
    executes it in goroutine

var RunJobCoherently = manager.RunJobCoherently
    RunJobCoherently executes job on the fly returning execution results

var RunWithOneWorkerAtOnce = manager.RunWithOneWorkerAtOnce
    RunWithOneWorkerAtOnce runs the job in coherent mode with one worker at once

var SetOutput = manager.SetOutput
    SetOutput preserves string value by key in job's dictionary

var Setup = database.Setup
    Setup establishes database connection


### TYPES

type Input = models.JSONDictionary
    Input keeps job parameters as JSON-serializable disctionary

type Job = models.Job
    Job is job instance

type PubSubMessage = models.PubSubMessage
    PubSub Message

type SetupOptions = database.SetupOptions
    SetupOptions is options for setup