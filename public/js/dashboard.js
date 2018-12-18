$(document).ready(function() {
  // Semantic events
  $(".menu .item").tab();
  $(".ui.accordion").accordion();

  // // On checkbox click
  $(".append-task").on("click", ".checkbox", function() {
    const taskId = $(this).data("id");
    let isComplete = $(this).data("completed");

    // If task is not complete, set to true, else set as false
    if (!isComplete) {
      console.log("!iscomplete");
      isComplete = true;
      $(this).attr("data-completed", true);
    } else {
      console.log("falseasda");
      isComplete = false;
      $(this).attr("data-completed", false);
    }

    const updateTask = {
      id: taskId,
      completed: isComplete
    };

    $.ajax({
      method: "PUT",
      url: "/api/task/checkbox",
      data: updateTask
    });
  });


  // click event for reusing an existin list
  // and changes values to uncompleted
  $(".reuse-list-btn").click(function() {
      event.preventDefault();

      const listId = $(this).data("id");

      const reuseList = {
        id: listId
      };

      $.ajax({
          method: "PUT",
          url: "/api/list/reuse/",
          data: reuseList
      }).then(function() {
        //   window.location.href = "/dashboard/user";
      });
  });


  // click event for adding a new user to an existing list
  $(".add-user-button").click(function() {
      alert("Add User");
      console.log($(this).data("class"));
  });

  // click event for creating a new list
  $(".new-list-button").click(function() {
      var createList = {
          title: $("#new-list-input").val().trim(),
          category: "Shared",
          creatorId: 1
      };
      console.log(createList);

      $.post("/api/list/create", createList, function(data) {
          console.log(data);
        //   window.location.href = "/dashboard/user";
      });
  });

  // click event for creating a new task
  $(".new-item-button").click(function() {

      var createTask = {
          text: $("#new-item-input").val().trim(),
          price: 0,
          listId: $("#new-item-id").data("id"),
          originatorId: 1
      };

      $.post("/api/task/create", createTask, function() {
        //   window.location.href = "/dashboard/user";
      });

  });

  // click event for deleting an existing list
  $(".delete-list-button").click(function() {
      event.preventDefault();

      const listId = $(this).data("id");
      $.ajax({
          method: "DELETE",
          url: "/api/list/delete/" + listId,
      }).then(function() {
          console.log("testing delete ajax");
        //   window.location.href = "/dashboard/user";
      });
  });

  // click event for deleting an existing task
  $("#appended-tasks").on("click", ".delete-item-button", function() {
    event.preventDefault();

    const taskId = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/api/task/delete/" + taskId,
    }).then(function() {
        $("#" + taskId).remove();
    });
  });

  $("#logout-button").click(function() {
    window.location.href = "/api/user/logout";
    });


  //   websockets
  var socket = io({transports: ["websocket"], upgrade: false});
  socket.on("task-create", function(message) {
      console.log(message);
      $("#appended-tasks").append(
  `
  <div id=${message.taskId}>
      <span class="content" style="padding-left: 0px">${message.text}</span>
      <span class="delete-item-button" style="float:right" data-id=${message.taskId}><i class="red large minus square icon"></i></span>
      <p style="font-size:12px">Added by: ${message.nickName}</p>
      <hr>
  </div>
  `
      );

      $(".append-task").append(
        `
        <div class="item">
            <div class="right floated content">
                <div class="ui checkbox" data-completed=${message.completed} data-id=${message.taskId}>
                    <input type="checkbox" name="example">
                    <label></label>
                </div>
            </div>
            <div class="content">
                ${message.text}
            </div>
        </div>
        `
      );
  });

  socket.on("task-update", function(message) {
    console.log(message);
  });

  socket.on("task-delete", function(message) {
      console.log(message);
  });

});
