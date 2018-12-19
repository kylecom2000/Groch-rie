$(document).ready(function() {
  // Semantic events
  $(".menu .item").tab();
  $(".ui.accordion").accordion();

  // On enter of an input
  $(".textEnter").keyup(function(e){
    if(e.keyCode === 13)
      {
          $(this).trigger("enterKey");
      }
  });

  // // On checkbox click
  $(".append-task").on("click", ".checkbox", function() {
    const taskId = $(this).data("id");
    let isComplete = $(this).attr("data-completed");

    // If task is not complete, set to true, else set as false
    if (isComplete==="false") {
      isComplete = true;
      $(this).attr("data-completed", true);
    } else {
      isComplete = false;
      $(this).attr("data-completed", false);
    }

    var updateTask = {
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
  $(".reuse-list-btn").click(function(event) {
      event.preventDefault();

      var listId = $(this).data("id");

      var reuseList = {
        id: listId
      };

      $.ajax({
          method: "PUT",
          url: "/api/list/reuse/",
          data: reuseList
      });
  });

  // click event for adding a new user to an existing list
  $(".add-user-button").click(function() {
    $(".ui.modal").modal("show");
  });

  $("#add-user-btn").on("click", function() {
    const listId = $(this).data("listid");
    const newEmail = $("#new-user").val().trim();

    const newUser = {
      listId: listId,
      users: newEmail
    };

    $.ajax({
        method: "PUT",
        url: "/api/list/share/",
        data: newUser
    });
    console.log(newUser);
  });

  // event for creating a new list
  $(".new-list-button").click(function() {
      var createList = {
          title: $("#new-list-input").val().trim(),
          category: "Shared",
          creatorId: 1
      };
      console.log(createList);
      $.post("/api/list/create", createList, function(data) {
          console.log(data);
          shopLists(data.title, data.id);
          displayLists(data.title, data.id);
      });
      $("#new-list-input").val("");
  });

  $("#new-list-input").on("enterKey",function(){
    var createList = {
        title: $("#new-list-input").val().trim(),
        category: "Shared",
        creatorId: 1
    };
    console.log(createList);
    $.post("/api/list/create", createList, function(data) {
        console.log(data);
        shopLists(data.title, data.id);
        displayLists(data.title, data.id);
    });
    $("#new-list-input").val("");
  });

  // click event for creating a new task from list
  $(".appended-lists").on("click", ".new-item-button", function(event) {
    event.preventDefault();
    const textId = $(this).data("id");
    var createTask = {
        text: $("[data-boxId= " + textId + "]").val().trim(),
        price: 0,
        listId: $(this).data("id"),
        completed: false
    };
    console.log(createTask + "first");
    $.post("/api/task/create", createTask, function(data) {
        console.log(createTask);
        console.log(data);
        shopTasks(data.text, data.id, data.listId, data.completed);
      });
    $("[data-boxId= " + textId + "]").val("");
  });

  function shopTasks(text, id, listId, completed) {
    console.log("testing");
    console.log(text, id, listId, completed);
    $("[data-list-id='" + listId + "']").append(
      `
      <div class="item" data-delete-id=${id}>
          <div class="right floated content">
              <div class="ui checkbox" data-id=${id}>
                  <input type="checkbox" name="example" data-completed=${completed}>
                  <label></label>
              </div>
          </div>
          <div class="content">
              ${text}
          </div>
      </div>
      `
    );
  }

  // click event for deleting an existing list
  $(".delete-list-button").click(function(event) {
      event.preventDefault();
      var listId = $(this).data("id");
      $.ajax({
          method: "DELETE",
          url: "/api/list/delete/" + listId,
      }).then(function() {
          console.log("testing delete ajax");
      });
      $("[data-listid='" + listId + "']").remove();
  });

  // click event for deleting an existing task from new list
  $(".appended-lists").on("click", ".delete-item-button", function(event) {
    event.preventDefault();

    var taskId = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/api/task/delete/" + taskId,
    });

    $("[data-delete-id='" + taskId + "']").remove();
  });

  $("#logout-button").click(function() {
    window.location.href = "/api/user/logout";
    });

    //   SOCKETS
    var socket = io({transports: ["websocket"], upgrade: false});
    socket.on("task-create", function(message) {
        console.log(message);

        $("#appended-tasks" + message.listId).append(
        `
        <div data-delete-id=${message.taskId} style="padding-left:10px">
            <span>${message.text}</span>
            <span class="delete-item-button" style="float:right" data-id=${message.taskId}><i class="red large minus square icon"></i></span>
            <p style="font-size:12px">Added by: ${message.nickName}</p>
            <hr>
        </div>
        `
        );
    });

    socket.on("task-update", function(message) {
        console.log(message);
    });

    socket.on("task-delete", function(message) {
        $("[data-delete-id='" + message + "']").remove();
    });

    function displayLists(title, id) {
        $(".appended-lists").append(
        `
        <div data-listid=${id}>
          <div class="title">
              <i class="dropdown icon"></i>
              ${title}
              <span class="delete-list-button" style="float:right" data-id=${id}><i class=" large minus square icon"></i></span>
              <span class="add-user-button" style="float:right;padding-right:5px"><i class="large user plus icon"></i></span>
          </div>
          <div class="content">
              <div style="padding:10px 0px 0px 5px" class="ui middle aligned divided list">
                  <div class="ui form" style="padding-bottom: 20px"><input type="text" class="textEnter" data-boxId=${id} id="new-item-input" placeholder="Enter a new item..."></input>
                      <span class="new-item-button" id="new-item-id" data-id=${id}><i class="teal large plus square icon" style="float:right"></i></span>
                  </div>
                  <div id="appended-tasks${id}"></div>
              </div>
          </div>
        </div>
        `
        );
    }

    function shopLists(title, id) {
      $(".shop-lists").append(
      `
    <div data-listId=${id}>
      <div class="title">
          <i class="dropdown icon"></i>
          ${title}
      </div>
      <div class="content">
          <div style="padding-top:20px" class="ui middle aligned divided list append-task" data-list-id=${id}>
          </div>
      </div>
    </div>
      `
      );
    }
});
