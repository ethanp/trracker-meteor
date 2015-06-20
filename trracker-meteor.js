Tasks = new Mongo.Collection("tasks");
Categories = new Mongo.Collection("categories");

if (Meteor.isClient) {
  Meteor.subscribe("tasks");
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideComplete")) {
        return Tasks.find({complete: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideComplete: function () {
      return Session.get("hideComplete");
    },
    incompleteCount: function() {
      return Tasks.find({complete: {$ne: true}}).count();
    }
  });

  Template.body.events({
    /* this right here is a dictionary
     in which all keys are events to listen for
     and values are their event handlers */

    // listen for 'submit' event on anything
    //  matching the .new-task selector
    "submit .new-task": function (event) {
      var text = event.target.text.value;
      Meteor.call("addTask", text);
      event.target.text.value = "";

      // prevent default form submit
      return false;
    },
    // keeping up with which dom event has what name is going to
    // be a learning curve in all this
    "change .hide-complete input": function (event) {
      // `Session` is where we store temporary UI state.
      // We treat it like any other collection, but it is
      // not synced with the server.
      Session.set("hideComplete", event.target.checked);
    }
  })

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    "click .toggle-complete": function () {
      Meteor.call("setComplete", this._id, !this.complete);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  })

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    return Tasks.find({ owner: this.userId });
  });
}

/* code that runs on server and client (latency compensated) */
Meteor.methods({
  // we had to move db access into methods after we removed `insecure`
  addTask: function (text) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),          // logged-in user_id
      username: Meteor.user().username // logged-in username
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
    }
});
