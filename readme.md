### Next steps

* Fix categ, task, and subtask deletion to `on delete cascade`
* Add subtasks urls
* Add interval recording
* Improve formatting

### Lessons Learnt

1. `Session` collection does not last across refreshes.
    * I'm not entirely sure how it's useful then...

#### Schema

```
Category
{
    name,
    createdAt,
    owner,
    [tasks]
}

Task
{
    name,
    createdAt,
    owner,
    complete,
    isRecording,
    [subtasks],
    [intervals]
}

Subtask
{
    name,
    url,
    owner
}

Interval
{
    startTime,
    endTime,
    owner
}
```
