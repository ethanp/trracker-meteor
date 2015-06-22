Meteor.publish("tasks", function () {
  return Tasks.find({ owner: this.userId });
});
