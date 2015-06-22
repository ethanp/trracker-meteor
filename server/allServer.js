Meteor.publish("tasks", function () {
  return Tasks.find({ owner: this.userId });
});

Meteor.publish("categories", function() {
  return Categories.find({ owner: this.userId });
});

Meteor.publish("subtasks", function() {
  return Subtasks.find({ owner: this.userId });
});

Meteor.publish("intervals", function() {
  return Intervals.find({ owner: this.userId });
});
