Meteor.subscribe 'tasks'
Meteor.subscribe 'categories'
Meteor.subscribe 'subtasks'

# Date Utilities
oneWeekFromNow = -> (new Date).getTime() + (1000 * 60 * 60 * 24 * 7)
isDate = (d) -> d and d.getTime() != 0
beyond = (d) -> isDate(d) and d.getTime() < (new Date).getTime()
soon = (d) -> isDate(d) and not beyond(d) and d.getTime() < oneWeekFromNow()

Template.topNav.helpers
  incompleteCount: -> Tasks.find(complete: $ne: true).count()

Template.sideNav.helpers
  categories: -> Categories.find()
  incompletes: -> Tasks.find(_id: { $in: @tasks }, complete: $ne: true).count()
  categLabelColor: ->
    # any way to just call the incompletes() method above?
    incompletes = Tasks.find(_id: { $in: @tasks }, complete: $ne: true).count()
    if incompletes then 'warning' else 'success'

Template.userCategories.helpers
  categories: -> Categories.find()

Template.category.helpers
  tasks: ->
    if Categories.findOne(this).showComplete
      Tasks.find { _id: $in: @tasks }, sort: createdAt: -1
    else
      Tasks.find {_id: { $in: @tasks }, complete: $ne: true }, sort: createdAt: -1

Template.task.helpers
  isOwner: -> @owner == Meteor.userId()
  subtasks: -> Subtasks.find _id: $in: @subtasks
  humanDuedate: -> moment(@duedate).format 'MMMM Do YYYY, h:mm a'
  humanRelativeTime: -> moment(@duedate).fromNow()
  duration: -> moment.duration(@timeSpent, 'minutes').format 'h [hrs], m [mins]'
  liClasses: ->
    result = ''
    if @complete
      result += 'checked '
    if beyond @duedate
      result += 'list-group-item-danger '
    if soon @duedate
      result += 'list-group-item-warning '
    result

Template.body.events
  'submit .new-task': (e) ->
    name = e.target.text.value
    duedate = moment(e.target.duedate.value).toDate()
    Meteor.call 'addTask', name, @_id, duedate
    e.target.text.value = ''
    e.target.duedate.value = ''
    false
  'submit .new-category': (e) ->
    name = e.target.text.value
    Meteor.call 'addCategory', name, @_id
    e.target.text.value = ''
    false
  'submit .new-subtask': (e) ->
    name = e.target.text.value
    url = e.target.url.value
    Meteor.call 'addSubtask', name, url, @_id
    e.target.text.value = ''
    e.target.url.value = ''
    false
  'submit .in-place': -> false # prevents reload

Template.category.events
  'click .delete-category': -> Meteor.call 'deleteCategory', @_id
  'keyup .in-place': (e) -> Meteor.call 'renameCategory', e.target.value, @_id
  'change .show-complete input': (e) ->
    Meteor.call 'showComplete', e.target.checked, @_id

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
  'keyup .rename-subtask': (e) -> Meteor.call 'renameSubtask', e.target.value, @_id
  'submit .edit-link-form': (e) ->
    # update mongo, and remove the form
    Meteor.call 'editLink', e.target.edited.value, @_id
    $li = $(e.target).parent()
    $li.removeClass('editing-link')
    $('.edit-link-form').remove()
    false

  'click .edit-link': (e) ->

    # TODO this should be a TEMPLATE that is loaded on each subtask by default
    # but with display: none
    # then all this has to do is .show() it and .hide() it
    # my gut is that the current way below is bad style

    $editButton = $(e.target)
    $li = $editButton.parent().parent()

    # hide the form if it's showing
    if $li.hasClass('editing-link')
      $li.removeClass('editing-link')
      $('.edit-link-form').remove()
      return false

    $li.addClass('editing-link')
    existingLink = $editButton.parent().children('a[href]').attr('href')
    $label = $('<label>').text('Edit Url: ')
    $input = $('<input>').addClass('in-place rename-link').attr
      type: 'text', name: 'edited', value: existingLink

    $form = $('<form>').addClass('edit-link-form').append($label).append($input)
    $li.append $form

Template.category.onRendered -> @$('.datetimepicker').datetimepicker sideBySide: true
Template.ifRealDate.helpers realDate: (duedate) -> duedate.getTime() != 0
Template.ifDatePassed.helpers datePassed: (d) -> beyond d
Accounts.ui.config passwordSignupFields: 'USERNAME_ONLY'
