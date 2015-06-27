Meteor.methods
  addCategory: (name) ->
    Categories.insert
      name: name
      createdAt: new Date
      owner: Meteor.userId()
      tasks: []
  addTask: (name, catId, duedate) ->
    taskObj =
      name: name
      createdAt: new Date
      owner: Meteor.userId()
      duedate: duedate
      subtasks: []
      complete: false
      timeSpent: 0
    Tasks.insert taskObj, (err, taskId) ->
      if err then return
      Categories.update { _id: catId }, $addToSet: tasks: taskId
  deleteTask: (taskId) ->
    task = Tasks.findOne(taskId)
    # delete from parent category
    Categories.update { tasks: taskId }, $pull: tasks: taskId
    # delete children subtasks
    for idx of task.subtasks
      Meteor.call 'deleteSubtask', task.subtasks[idx]
    Tasks.remove taskId
  deleteSubtask: (subtaskId) ->
    # delete from parent task
    Tasks.update { subtasks: subtaskId }, $pull: subtasks: subtaskId
    Subtasks.remove subtaskId
  deleteCategory: (categId) ->
    categ = Categories.findOne(categId)
    # delete children tasks
    for idx of categ.tasks
      Meteor.call 'deleteTask', categ.tasks[idx]
    Categories.remove categId
  addSubtask: (name, taskId) ->
    subtask =
      name: name
      owner: Meteor.userId()
      complete: false
      url: 'http://www.google.com'
    Subtasks.insert subtask, (err, subTaskId) ->
      if err then return
      Tasks.update { _id: taskId }, $addToSet: subtasks: subTaskId
  setTaskComplete: (taskId, complete) ->
    Tasks.update taskId, $set: complete: complete
  setSubtaskComplete: (subtaskId, complete) ->
    Subtasks.update subtaskId, $set: complete: complete
  renameCategory: (newName, id) ->
    Categories.update id, $set: name: newName
  renameTask: (newName, id) ->
    Tasks.update id, $set: name: newName
  renameSubtask: (newName, id) ->
    Subtasks.update id, $set: name: newName
  addTime: (time, id) ->
    Tasks.update id, $inc: timeSpent: time
  showComplete: (checked, categID) ->
    Categories.update categID, $set: showComplete: checked
