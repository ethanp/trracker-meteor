### Changes so far

1. Get rid of the concept of "public tasks"
    1. I.e. only show a user their tasks
    2. Don't have the code talk about whether or not a task is public

### Lessons Learnt

1. `Session` collection does not last across refreshes.
    * I'm not entirely sure how it's useful then...

### Next steps

1. Add "categories" (via routing?)

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
    [subtasks],
    [intervals]
}

Subtask
{
    name,
    url,

}
```
