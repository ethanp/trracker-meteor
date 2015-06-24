### Next steps

* Add subtasks urls
* Add interval
    * "Record" button
    * Including manual entry using [datetimepicker][dt]
        * Put it in "inline" mode
    * Ensure intervals also `ON DELETE CASCADE`
* Switch to Coffeescript
* Reimplement "hide completed tasks"
    * It was saved in `Session`, which would be fine, except then it should
      default to "hidden", not shown

[boot-acct]: https://github.com/erobit/meteor-accounts-ui-bootstrap-dropdown
[dt]: https://github.com/tsega/meteor-bootstrap3-datetimepicker/

### Lessons Learnt

1. `Session` collection does not last across refreshes.
    * I'm not entirely sure how it's useful then...
2. When iterating through a Mongo array, you're actually
   iterating through the indexes into the array (why?)

### Cool libraries I found

* Animated alerts with [sAlert](http://s-alert.meteor.com/)

### Schema

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
    duedate,
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
