### Next steps

* Add subtasks urls
* Add interval recording
* Improve formatting

### Lessons Learnt

1. `Session` collection does not last across refreshes.
    * I'm not entirely sure how it's useful then...
2. When iterating through a Mongo array, you're actually
   iterating through the indexes into the array (why?)

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
