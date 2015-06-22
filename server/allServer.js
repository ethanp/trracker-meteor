Meteor.publish("tasks", function () {
  return Tasks.find({ owner: this.userId });
});

Meteor.publish("categories", function() {
  return Categories.find({ owner: this.userId });
});
