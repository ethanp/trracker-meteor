Meteor.publish 'tasks', -> Tasks.find owner: @userId
Meteor.publish 'categories', -> Categories.find owner: @userId
Meteor.publish 'subtasks', -> Subtasks.find owner: @userId
