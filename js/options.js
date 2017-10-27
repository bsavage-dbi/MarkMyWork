(function () {

    document.addEventListener('DOMContentLoaded', restoreOptions);

    $('#login-button').click(loginClicked);

    function loginClicked() {
        $('#login-button').html("<i class=\"fa fa-spinner fa-pulse fa-lg fa-fw\"></i>");

        var options = {
            username: $('#inp-username').val(),
            password: $('#inp-password').val(),
            baseUrl: $('#inp-base-url').val(),
            apiExtension: '/rest/api/2'
        };
        var jira = new JiraAPI(options.baseUrl, options.apiExtension, options.username, options.password);
        jira.login()
            .then(function (resp) {
                loginSuccess(resp, options);
            }, loginError);

    }

    function loginSuccess(resp, options) {
        console.debug(resp);
        options.accountId = resp.accountId;

        chrome.storage.sync.set(options, function () {
            $('#login-button')
                .removeClass("btn-danger")
                .removeClass("btn-primary")
                .addClass("btn-success")
                .html("Success");
            $('.form-group').removeClass("has-error");
        });
    }

    function loginError(resp) {
        $('#login-button')
            .removeClass("btn-primary")
            .addClass("btn-danger")
            .html("<i class=\"fa fa-exclamation-circle\" aria-hidden=\"true\"></i> Failed! try again.");
        $('.form-group').addClass("has-error");
        console.log(resp);
    }

    // function loginButtonClicked() {
    //
    //     var options = {
    //         apiExtension: "/rest/api/2",
    //         baseUrl: $('#inp-base-url').val(),
    //         password: $('#inp-password').val(),
    //         username: $('#inp-username').val()
    //     };
    //
    //     var jira = new JiraAPI(options.baseUrl, options.apiExtension, options.username, options.password);
    //     jira.login()
    //         .then(
    //             function () {
    //                 $('#login-button')
    //                     .removeClass("btn-primary")
    //                     .addClass("btn-success")
    //                     .html("Success");
    //                 $('#modal').modal('toggle');
    //             },
    //             function () {
    //                 $('#login-button')
    //                     .removeClass("btn-primary")
    //                     .addClass("btn-danger")
    //                     .html("<i class=\"fa fa-exclamation-circle\" aria-hidden=\"true\"></i> Failed! try again.");
    //             })
    // }

    // document.getElementById('login-button').addEventListener('click', saveOptions);
    // function saveOptions() {
    //
    //     var username = document.getElementById('username').value;
    //     var password = document.getElementById('password').value;
    //     // var description = document.getElementById('description').value;
    //     var baseUrl = document.getElementById('baseUrl').value;
    //     // var apiExtension = document.getElementById('apiExtension').value;
    //     // var jql = document.getElementById('jql').value;
    //     var options = {
    //         username: username,
    //         password: password,
    //         description: 'CG Jira Time Logger',
    //         baseUrl: 'https://codegen.atlassian.net/',
    //         apiExtension: '/rest/api/2'
    //     };
    //
    //     chrome.storage.sync.set(options, function () {
    //         var status = document.getElementById('status');
    //         status.textContent = 'Options saved.';
    //         setTimeout(function () {
    //             status.textContent = '';
    //         }, 1000);
    //     });
    // }


    function restoreOptions() {

        chrome.storage.sync.get({
            username: '',
            password: '',
            baseUrl: 'https://codegen.atlassian.net/',
            apiExtension: '/rest/api/2',
            accountId: ''
        }, function (items) {
            document.getElementById('inp-username').value = items.username;
            document.getElementById('inp-password').value = items.password;
            document.getElementById('inp-base-url').value = items.baseUrl;
        });
    }

})(); 
