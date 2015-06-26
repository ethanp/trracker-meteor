Meteor.subscribe("tasks");
Meteor.subscribe("categories");
Meteor.subscribe("subtasks");
Meteor.subscribe("intervals");

Template.body.helpers({
  tasks: function() {
    if (Session.get("hideComplete")) {
      return Tasks.find({complete: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideComplete: function() {
    return Session.get("hideComplete");
  },
  incompleteCount: function() {
    return Tasks.find({complete: {$ne: true}}).count();
  },
  categories: function() {
    return Categories.find();
  }
});

var addFunc = function (event, func, id) {
  var name = event.target.text.value;
  Meteor.call(func, name, id);
  event.target.text.value = "";
  return false; // prevent default form submit
}

Template.body.events({
  "submit .new-task": function (event) {
    console.log(event)
    var name = event.target.text.value;
    var duedate = moment(event.target.duedate.value).toDate();
    Meteor.call("addTask", name, this._id, duedate);
    event.target.text.value = "";
    event.target.duedate.value = "";
    return false;
  },
  "submit .new-category": function (event) {
    return addFunc(event, "addCategory", this._id);
  },
  "submit .new-subtask": function (event) {
    return addFunc(event, "addSubtask", this._id);
  },
  "change .hide-complete input": function (event) {
    Session.set("hideComplete", event.target.checked);
  }
})

Template.task.helpers({
  isOwner: function() {
    return this.owner === Meteor.userId();
  },
  subtasks: function() {
    return Subtasks.find({_id: {$in: this.subtasks}});
  },
  humanDuedate: function() {
    return moment(this.duedate).format('MMMM Do YYYY, h:mm a');
  },
  humanRelativeTime: function() {
    return moment(this.duedate).fromNow();
  },
  duration: function() {
    return moment.duration(this.timeSpent, "minutes").format("h [hrs], m [mins]");
  }
});

Template.category.helpers({
  tasks: function() {
    return Tasks.find({_id: {$in: this.tasks}});
  }
});

Template.task.events({
  "click .toggle-complete": function() {
    Meteor.call("setTaskComplete", this._id, !this.complete);
  },
  "click .delete-task": function() {
    Meteor.call("deleteTask", this._id);
  },
  "keyup .in-place": function (event) {
    Meteor.call("renameTask", event.target.value, this._id);
  },
  "click .plus-30": function () {
    Meteor.call("addTime", 30, this._id);
  },
  "click .plus-15": function () {
    Meteor.call("addTime", 15, this._id);
  },
  "click .minus-15": function () {
    Meteor.call("addTime", -15, this._id);
  }
});

Template.subtask.events({
  "click .toggle-complete": function() {
    Meteor.call("setSubtaskComplete", this._id, !this.complete);
  },
  "click .delete-subtask": function() {
    Meteor.call("deleteSubtask", this._id);
  },
  "keyup .in-place": function (event) {
    Meteor.call("renameSubtask", event.target.value, this._id);
  }
});

Template.category.events({
  "click .delete-category": function() {
    Meteor.call("deleteCategory", this._id);
  },
  "keyup .in-place": function (event) {
    Meteor.call("renameCategory", event.target.value, this._id);
  }
});

Template.category.onRendered(function() {
  this.$('.datetimepicker').datetimepicker({
    sideBySide: true
  });
});

Template.ifRealDate.helpers({
  realDate: function (duedate) {
    return duedate.getTime() !== 0;
  }
});

Template.ifDatePassed.helpers({
  datePassed : function (d) {
    return d.getTime() < new Date().getTime();
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
