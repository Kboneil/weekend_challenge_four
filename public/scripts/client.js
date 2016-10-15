$(function (){
  appendDom();
  $('#addTask').on('click', 'button', addTask);
  $('#taskList').on('click', '.delete', deleteTask);
  $('#taskList').on('click', '.complete', completeTask);
});

function addTask (event){
  event.preventDefault();
  var listData = $(this).parent().find('input');
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
        console.log(listItem.complete);
        var $li = $('<li></li>');
        $li.append('<p>' + listItem.task + '</p>');

        var $completeButton = $('<button class="complete">Complete!</button>');
        $completeButton.data('id', listItem.id);
        $li.append($completeButton);

        var $deleteButton = $('<button class="delete">Delete!</button>');
        $deleteButton.data('id', listItem.id);
        $li.append($deleteButton);

        $list.append($li);

        //otherwise it's appended to the completed tasks list
      } else {
        var $liComplete = $('<li></li>');
        //once complete the color changes to green
        $liComplete.css('color', 'green');
        $liComplete.append('<p>' + listItem.task + '</p>');
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

$.ajax({
  type: 'DELETE',
  url: '/list/' + $Id,
  success: appendDom
});
}

function completeTask(event){
  event.preventDefault();
//finds that data so it can change the boolean value of a specific row by its id
  var $Id = $(this).data('id');
  console.log($Id);

  var $button = $(this);
  var $task = $button.closest('li').find('p').text();
  //changes the boolean value and packages all the info of that entry into an object
  //that will get sent to are server and updated in the database 
  var data = {task: $task, complete: true, id: $Id}

  console.log("data", data)

  $.ajax({
    type: 'PUT',
    url: '/list/' + $Id,
    data: data,
    success: appendDom
  });
}
