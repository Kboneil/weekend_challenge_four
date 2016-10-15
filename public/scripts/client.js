$(function (){
  appendDom();
  $('#addTask').on('click', 'button', addTask);
  $('#taskList').on('click', '.delete', deleteTask);
  $('#taskList').on('click', '.complete', completeTask);
  $('#completeList').on('click', '.undo', completeTask);
  $('#completeList').on('click', '.delete', deleteTask);
});

function addTask (event){
  event.preventDefault();
  var listData = $(this).parent().find('input');
  console.log("outside empty", listData.val());
  if (listData.val() === ''){
    $('#addTask').prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Oops!</strong> Please enter a task.</div>');
    console.log("in empty", listData);
    return;
  }
//sends whatever is typed in the input to the server
  $.ajax({
    type: 'POST',
    url: '/list',
    data: listData,
    //upon success the new to do task will get appened
    success: appendDom
});
//clears the input
$(this).parent().find('input').val('');
}

function appendDom (){
  var $list = $('#taskList');
  var $completeList = $('#completeList')
  //prevents old info from being added twice
  $list.empty();
  $completeList.empty();
  //gets all the tasks from the database
  $.ajax({
    type: 'GET',
    url: '/list',
    success: function (response) {

      response.forEach( function (listItem) {
        //selects whether it's complete or not based on boolean value
        if (listItem.complete === false){
          //if its not complete it's appended to the top to do list with buttons
        var $li = $('<li></li>');
        $li.append('<p>' + listItem.task + ' </p>');

        var $completeButton = $('<button class="complete"><span class="glyphicon glyphicon-ok-sign"></span></button>');
        $completeButton.addClass("btn btn-success");
        $completeButton.data('id', listItem.id);
        $completeButton.data('status', listItem.complete);
        $completeButton.data('task', listItem.task);
        $li.append($completeButton);

        var $deleteButton = $('<button class="delete"><span class="glyphicon glyphicon-trash"></span></button>');
        $deleteButton.addClass("btn btn-danger");
        $deleteButton.data('id', listItem.id);
        $deleteButton.data('status', listItem.complete);
        $deleteButton.data('task', listItem.task);
        $li.append($deleteButton);


        $list.append($li);

        //otherwise it's appended to the completed tasks list
      } else {

        var $liComplete = $('<li></li>');
        $liComplete.append('<p>' + listItem.task + ' </p>');
        //once complete the color changes to green
        $liComplete.css('color', 'green');

        var $completeButton = $('<button class="undo"><span class="glyphicon glyphicon-repeat"></span></button>');
        $completeButton.addClass("btn btn-success");
        $completeButton.data('id', listItem.id);
        $completeButton.data('status', listItem.complete);
        $completeButton.data('task', listItem.task);
        $liComplete.append($completeButton);

        var $deleteButton = $('<button class="delete"><span class="glyphicon glyphicon-trash"></span></button>');
        $deleteButton.addClass("btn btn-danger");
        $deleteButton.data('id', listItem.id);
        $deleteButton.data('status', listItem.complete);
        $deleteButton.data('task', listItem.task);
        $liComplete.append($deleteButton);

        $completeList.append($liComplete);
      }
    });
    }
  });
}

function deleteTask (event) {
  event.preventDefault;
  //finds that data so it can delete a specific row by its id
  var $Id = $(this).data('id');
  console.log($Id);

if(confirm("Are you sure you want to delete this task?")){
$.ajax({
  type: 'DELETE',
  url: '/list/' + $Id,
  success: appendDom
});
} else {
  $('#taskList').prepend('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Your task was saved.</div>');

}
}

function completeTask(event){
  event.preventDefault();
  //gets all the information of the task
  var $Id = $(this).data('id');
  var $status = $(this).data('status');
  var $task = $(this).data('task');

  //changes the boolean value and packages all the info of that entry into an object
  //that will get sent to are server and updated in the database
if ($status === false) {
  var data = {task: $task, complete: true, id: $Id}
  //this allows for the user to undo a completed task
} else {
  var data = {task: $task, complete: false, id: $Id}
}
  $.ajax({
    type: 'PUT',
    url: '/list/' + $Id,
    data: data,
    success: appendDom
  });
}
