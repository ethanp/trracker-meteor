Tasks = new Mongo.Collection("tasks");
Categories = new Mongo.Collection("categories");
Subtasks = new Mongo.Collection("subtasks");
Intervals = new Mongo.Collection("intervals");

/* these methods are "latency compensated" (cool!) */
Meteor.methods({
  // we had to move db access into methods after we removed `insecure`
  // seems like a better layout anyhow

  addCategory: function (name) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Categories.insert({
      name: name,
      createdAt: new Date(),
      owner: Meteor.userId(),
      tasks: []
    })
  },
  addTask: function (name, catId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (!catId) {
      throw new Meteor.Error("task req's assoc'd category");
    }
    if (Tasks.findOne({
      name: new RegExp("^"+name+"$", "i"), // case-insensitive match
      owner: Meteor.userId()
    })) {
      throw new Meteor.Error("you already have a task named "+name);
    }
    var taskObj = {
      name: name,
      createdAt: new Date(),
      owner: Meteor.userId(), // logged-in user_id
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
    console.log("deleting task "+taskId);
    var task = Tasks.findOne(taskId);
    if (task.owner !== Meteor.userId()) {
      // throwing error here means remove() below will *not* be called
      throw new Meteor.Error("not authorized");
    }
    // delete from parent
    Categories.update({tasks: taskId}, {$pull: {tasks: taskId}});
    // delete children
    for (idx in task.subtasks) {
      Meteor.call("deleteSubtask", task.subtasks[idx]);
    }
    Tasks.remove(taskId);
  },
  deleteSubtask: function (subtaskId) {
    console.log("deleting subtask "+subtaskId);
    // delete from parent
    Tasks.update({subtasks: subtaskId}, {$pull: {subtasks: subtaskId}});
    Subtasks.remove(Subtasks.findOne(subtaskId));
  },
  deleteCategory: function (categId) {
    console.log("deleting categ "+categId);
    var categ = Categories.findOne(categId);
    // ON DELETE CASCADE
    for (idx in categ.tasks) {
      Meteor.call("deleteTask", categ.tasks[idx]);
    }
    Categories.remove(categId);
  },
  addSubtask: function (name, taskId) {
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
  }
});
