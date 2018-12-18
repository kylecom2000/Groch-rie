$(document).ready(function() {
    //==========================================
    // Landing Page JS
    $("#login-btn").click(function() {
        console.log($(this).data("id"));
        window.location = "login";
    });

    $("#signup-btn").click(function() {
        console.log($(this).data("id"));
        window.location = "signup";
    });

    //==========================================
    // Signup Page JS
    $("#submitSignUpBtn").click(function() {
        const login = {
        userName: $("#email").val().trim(),
        nickName: $("#name").val().trim(),
        password: $("#password").val().trim()
        };
        signUpUser(login);
    });
    
    function signUpUser(login){
        $.post("/api/user/signup", login).then(function(data){
            if (data.success === false) {
                alert(data.error[0]);
            } else {
                window.location.replace(data);
            }
        // If there's an error, handle it by throwing up a bootstrap alert
        }).catch(handleLoginErr);
    }
        function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }

    //==========================================
    // Login Page JS
    $("#submitBtn").click(function() {
        const login = {
            userName: $("#email").val().trim(),
            password: $("#password").val().trim()
        };
        loginUser(login.userName, login.password);
            $("#email").val("");
            $("#password").val("");
    });

    function loginUser(email, password) {
        $.post("/api/user/login", {
            userName: email,
            password: password
        }).then(function(data) {
            window.location.replace(data);
        // If there's an error, log the error
        }).catch(function(err) {
            console.log(err);
        });
    }
});