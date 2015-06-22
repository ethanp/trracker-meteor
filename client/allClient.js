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
      var name = event.target.text.value;
      Meteor.call("addTask", name);
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
