Tasks = new Mongo.Collection("tasks");
Categories = new Mongo.Collection("categories");

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
      complete: false
    };
    Tasks.insert(taskObj, function (err, taskId) {
      if (err) return;
      Categories.update({_id: catId}, {$addToSet: {tasks: taskId}});
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.owner !== Meteor.userId()) {
      // throwing error here means remove() below will *not* be called
      throw new Meteor.Error("not authorized");
    }
    // remove's param is which subset of collection to delete
    Tasks.remove(taskId);
  },
  setComplete: function (taskId, complete) {
    Tasks.update(taskId, {$set: {complete: complete}});
  }
});
