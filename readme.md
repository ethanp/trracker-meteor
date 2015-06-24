### Next steps

#### Front end
* Add [contextual class][cc] to tasks based on duedate (as in the old trracker)
* Reimplement "hide completed tasks"
    * It was saved in `Session`, which would be fine, except then it should
      default to "hidden", not shown
* Find a better font (that also works in Chrome)
* Move "checked:crossed-out" logic to subtasks from tasks
    * Completed tasks should by default be *hidden*
    * when you click the button to explicitly show them, they should be
      *contextual class* `success` or whatever (aka. "green")
* Make category, task, and subtask names in-place editable

[cc]: http://getbootstrap.com/components/#list-group-contextual-classes

#### Middle end
* Add subtasks urls
* Add interval
    * "Record" button
    * Including manual entry using [datetimepicker][dt]
        * Put it in "inline" mode
* Make a side nav with
    * List of categories, with bootstrap-labels summarizing "contextutal class"
      info about tasks (wrt duedates, nahmean)
    * 

#### Back end
* Ensure intervals also `ON DELETE CASCADE`

#### Code quality
* Switch to Coffeescript

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
