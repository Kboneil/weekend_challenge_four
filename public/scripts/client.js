$(function (){
  appendDom();
  $('#addTask').on('click', 'button', addTask);
  $('#taskList').on('click', '.delete', deleteTask);
});

function addTask (event){
  event.preventDefault();
  var listData = $(this).parent().find('input');

  $.ajax({
    type: 'POST',
    url: '/list',
    data: listData,
    success: appendDom
});
}

function appendDom (){
  var $list = $('#taskList');
  $list.empty();
  $.ajax({
    type: 'GET',
    url: '/list',
    success: function (response) {

      response.forEach( function (listItem) {
        console.log(listItem.task);
        var $li = $('<li></li>');
        $li.append('<p>' + listItem.task + '</p>');

        var $completeButton = $('<button class="complete">Complete!</button>');
        $completeButton.data('id', listItem.id);
        $li.append($completeButton);

        var $deleteButton = $('<button class="delete">Delete!</button>');
        $deleteButton.data('id', listItem.id);
        $li.append($deleteButton);

        $list.append($li);
    });
    }
  });
}

function deleteTask (event) {
  event.preventDefault;
  var $Id = $(this).data('id');
  console.log($Id);

$.ajax({
  type: 'DELETE',
  url: '/list/' + $Id,
  success: appendDom
});
}
