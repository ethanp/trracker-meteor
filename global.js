Tasks = new Mongo.Collection("tasks");
Categories = new Mongo.Collection("categories");
Subtasks = new Mongo.Collection("subtasks");
Intervals = new Mongo.Collection("intervals");

/* these methods are "latency compensated" (cool!) */
Meteor.methods({
  // we had to move db access into methods after we removed `insecure`
  // seems like a better layout anyhow

  addCategory: function (name) {
    if (!name) throw new Meteor.Error("no name passed");
    Categories.insert({
      name: name,
      createdAt: new Date(),
      owner: Meteor.userId(),
      tasks: []
    })
  },

  addTask: function (name, catId, duedate) {
    if (!name) throw new Meteor.Error("no name passed");
    if (!catId) throw new Meteor.Error("no category passed");
    var taskObj = {
      name: name,
      createdAt: new Date(),
      owner: Meteor.userId(), // logged-in user_id
      duedate: duedate,
      subtasks: [],
      intervals: [],
      complete: false
    };
    Tasks.insert(taskObj, function (err, taskId) {
      if (err) return;
      Categories.update({_id: catId}, {$addToSet: {tasks: taskId}});
    });
  },

  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    // delete from parent category
    Categories.update({tasks: taskId}, {$pull: {tasks: taskId}});
    // delete children subtasks
    for (idx in task.subtasks) {
      Meteor.call("deleteSubtask", task.subtasks[idx]);
    }
    Tasks.remove(taskId);
  },

  deleteSubtask: function (subtaskId) {
    // delete from parent task
    Tasks.update({subtasks: subtaskId}, {$pull: {subtasks: subtaskId}});
    Subtasks.remove(Subtasks.findOne(subtaskId));
  },

  deleteCategory: function (categId) {
    var categ = Categories.findOne(categId);
    // delete children tasks
    for (idx in categ.tasks) {
      Meteor.call("deleteTask", categ.tasks[idx]);
    }
    Categories.remove(categId);
  },

  addSubtask: function (name, taskId) {
    if (!name) throw new Meteor.Error("no name passed");
    if (!taskId) throw new Meteor.Error("no task passed");
    var subtask = {
      name: name,
      owner: Meteor.userId(),
      complete: false,
      url: "http://www.google.com"
    }
    Subtasks.insert(subtask, function (err, subTaskId) {
      if (err) return;
      Tasks.update({_id: taskId}, {$addToSet: {subtasks: subTaskId}});
    });
  },

  setTaskComplete: function (taskId, complete) {
    Tasks.update(taskId, {$set: {complete: complete}});
  },

  setSubtaskComplete: function (subtaskId, complete) {
    Subtasks.update(subtaskId, {$set: {complete: complete}});
  },

  renameCategory: function (newName, id) {
    Categories.update(id, {$set: {name: newName}});
  },

  renameTask: function (newName, id) {
    Tasks.update(id, {$set: {name: newName}});
  },

  renameSubtask: function (newName, id) {
    Subtasks.update(id, {$set: {name: newName}});
  }
});
