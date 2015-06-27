Meteor.subscribe 'tasks'
Meteor.subscribe 'categories'
Meteor.subscribe 'subtasks'

Template.body.helpers
  tasks: ->
    if Session.get('hideComplete')
      Tasks.find { complete: $ne: true }, sort: createdAt: -1
    else
      Tasks.find {}, sort: createdAt: -1
  hideComplete: -> Session.get 'hideComplete'
  incompleteCount: -> Tasks.find(complete: $ne: true).count()
  categories: -> Categories.find()

Template.category.helpers
  tasks: -> Tasks.find _id: $in: @tasks

Template.task.helpers
  isOwner: -> @owner == Meteor.userId()
  subtasks: -> Subtasks.find _id: $in: @subtasks
  humanDuedate: -> moment(@duedate).format 'MMMM Do YYYY, h:mm a'
  humanRelativeTime: -> moment(@duedate).fromNow()
  duration: -> moment.duration(@timeSpent, 'minutes').format 'h [hrs], m [mins]'

addFunc = (e, func, id) ->
  name = e.target.text.value
  Meteor.call func, name, id
  e.target.text.value = ''
  false

Template.body.events
  'submit .new-task': (e) ->
    console.log e
    name = e.target.text.value
    duedate = moment(e.target.duedate.value).toDate()
    Meteor.call 'addTask', name, @_id, duedate
    e.target.text.value = ''
    e.target.duedate.value = ''
    false
  'submit .new-category': (e) -> addFunc e, 'addCategory', @_id
  'submit .new-subtask': (e) -> addFunc e, 'addSubtask', @_id
  'change .hide-complete input': (e) -> Session.set 'hideComplete', e.target.checked

Template.category.events
  'click .delete-category': -> Meteor.call 'deleteCategory', @_id
  'keyup .in-place': (e) -> Meteor.call 'renameCategory', e.target.value, @_id

Template.task.events
  'click .toggle-complete': -> Meteor.call 'setTaskComplete', @_id, !@complete
  'click .delete-task': -> Meteor.call 'deleteTask', @_id
  'keyup .in-place': (e) -> Meteor.call 'renameTask', e.target.value, @_id
  'click .plus-30': -> Meteor.call 'addTime', 30, @_id
  'click .plus-15': -> Meteor.call 'addTime', 15, @_id
  'click .minus-15': -> Meteor.call 'addTime', -15, @_id

Template.subtask.events
  'click .toggle-complete': -> Meteor.call 'setSubtaskComplete', @_id, !@complete
  'click .delete-subtask': -> Meteor.call 'deleteSubtask', @_id
  'keyup .in-place': (e) -> Meteor.call 'renameSubtask', e.target.value, @_id

Template.category.onRendered -> @$('.datetimepicker').datetimepicker sideBySide: true
Template.ifRealDate.helpers realDate: (duedate) -> duedate.getTime() != 0
Template.ifDatePassed.helpers datePassed: (d) -> d.getTime() < (new Date).getTime()
Accounts.ui.config passwordSignupFields: 'USERNAME_ONLY'
