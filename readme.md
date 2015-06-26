### Next steps

#### Front end
* Add [contextual class][cc] to tasks based on duedate (as in the old trracker)
* Completed tasks should by default be *hidden*
    * when you click the button to explicitly show them, they should be
      *contextual class* `success` or whatever (aka. "green")
    * whether you're showing them or not should be sticky across reloads
* Show/Hide via slidy-thing
    * Tasks in Categories
    * Subtasks in Tasks

[cc]: http://getbootstrap.com/components/#list-group-contextual-classes

#### Middle end
* Add subtasks urls
* Instead of intervals, there should just be a total time spent
    * This trracker is about seeing how long it took, not seeing when you did
      it. That whole thing had more cons than pros.
* Make a side nav with
    * List of categories, with bootstrap-labels summarizing "contextutal class"
      info about tasks (wrt duedates, nahmean)

#### Code quality
* Switch to Coffeescript

#### Eventually
* Make it work on iOS

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
    timeSpent,
    [subtasks],
}

Subtask
{
    name,
    url,
    owner
}
```
