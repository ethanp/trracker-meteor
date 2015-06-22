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
  addTask: function (name, category) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var caseInsensitiveName = new RegExp(["^", name, "$"].join(""), "i");
    if (Tasks.findOne({name: caseInsensitiveName})) {
      throw new Meteor.Error("task with name "+name+" already exists")
    }
    var taskObj = {
      name: name,
      createdAt: new Date(),
      owner: Meteor.userId(), // logged-in user_id
      complete: false
    };
    // TODO I don't think this is done
    Tasks.insert(taskObj, function (err) {
      if (err) return;
      var curCat = Session.get("curCat");
      Categories.update(curCat, {$addToSet: {tasks: taskObj._id}});
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.owner !== Meteor.userId()) {
      // apparently, throwing this error here means the
      // remove() function below will *not* be called
      throw new Meteor.Error("not-authorized");
    }
    // remove's param is which subset of collection to delete
    Tasks.remove(taskId);
  },
  setComplete: function (taskId, setComplete) {
    // `this` refers to an individual `Task` "document"
    // `_id` is its 'primary key'
    // update takes two params
    //  1. which subset of collection to update
    //  2. an update action to perform on that subset
    Tasks.update(taskId, {$set: {complete: setComplete}});
  },
  getFirstCat: function() {
    return Categories.findOne({owner: Meteor.userId()});
  }
});
