### Next steps

#### Front end
* Add [contextual class][cc] to tasks based on duedate (as in the old trracker)
* Show/Hide via slidy-thing
    * Tasks in Categories
    * Subtasks in Tasks
* Duedate setter should slide out when there is text in the "New Task" `input`

[cc]: http://getbootstrap.com/components/#list-group-contextual-classes

#### Middle end
* Make a side nav with
    * List of categories, with bootstrap-labels summarizing "contextutal class"
      info about tasks (wrt duedates, nahmean)

#### Eventually
* Make it work on iOS via Swift over REST API
    * The default iOS styling is not really good-enough

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
