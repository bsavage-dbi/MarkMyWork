addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

//region const
var possibleDates = [
    "Jan-1", "Jan-2", "Jan-3", "Jan-4", "Jan-5", "Jan-6", "Jan-7", "Jan-8", "Jan-9", "Jan-10", "Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17", "Jan-18", "Jan-19", "Jan-20", "Jan-21", "Jan-22", "Jan-23", "Jan-24", "Jan-25", "Jan-26", "Jan-27", "Jan-28", "Jan-29", "Jan-30", "Jan-31", "Feb-1", "Feb-2", "Feb-3", "Feb-4", "Feb-5", "Feb-6", "Feb-7", "Feb-8", "Feb-9", "Feb-10", "Feb-11", "Feb-12", "Feb-13", "Feb-14", "Feb-15", "Feb-16", "Feb-17", "Feb-18", "Feb-19", "Feb-20", "Feb-21", "Feb-22", "Feb-23", "Feb-24", "Feb-25", "Feb-26", "Feb-27", "Feb-28", "Mar-1", "Mar-2", "Mar-3", "Mar-4", "Mar-5", "Mar-6", "Mar-7", "Mar-8", "Mar-9", "Mar-10", "Mar-11", "Mar-12", "Mar-13", "Mar-14", "Mar-15", "Mar-16", "Mar-17", "Mar-18", "Mar-19", "Mar-20", "Mar-21", "Mar-22", "Mar-23", "Mar-24", "Mar-25", "Mar-26", "Mar-27", "Mar-28", "Mar-29", "Mar-30", "Mar-31", "Apr-1", "Apr-2", "Apr-3", "Apr-4", "Apr-5", "Apr-6", "Apr-7", "Apr-8", "Apr-9", "Apr-10", "Apr-11", "Apr-12", "Apr-13", "Apr-14", "Apr-15", "Apr-16", "Apr-17", "Apr-18", "Apr-19", "Apr-20", "Apr-21", "Apr-22", "Apr-23", "Apr-24", "Apr-25", "Apr-26", "Apr-27", "Apr-28", "Apr-29", "Apr-30", "May-1", "May-2", "May-3", "May-4", "May-5", "May-6", "May-7", "May-8", "May-9", "May-10", "May-11", "May-12", "May-13", "May-14", "May-15", "May-16", "May-17", "May-18", "May-19", "May-20", "May-21", "May-22", "May-23", "May-24", "May-25", "May-26", "May-27", "May-28", "May-29", "May-30", "May-31", "Jun-1", "Jun-2", "Jun-3", "Jun-4", "Jun-5", "Jun-6", "Jun-7", "Jun-8", "Jun-9", "Jun-10", "Jun-11", "Jun-12", "Jun-13", "Jun-14", "Jun-15", "Jun-16", "Jun-17", "Jun-18", "Jun-19", "Jun-20", "Jun-21", "Jun-22", "Jun-23", "Jun-24", "Jun-25", "Jun-26", "Jun-27", "Jun-28", "Jun-29", "Jun-30", "Jul-1", "Jul-2", "Jul-3", "Jul-4", "Jul-5", "Jul-6", "Jul-7", "Jul-8", "Jul-9", "Jul-10", "Jul-11", "Jul-12", "Jul-13", "Jul-14", "Jul-15", "Jul-16", "Jul-17", "Jul-18", "Jul-19", "Jul-20", "Jul-21", "Jul-22", "Jul-23", "Jul-24", "Jul-25", "Jul-26", "Jul-27", "Jul-28", "Jul-29", "Jul-30", "Jul-31", "Aug-1", "Aug-2", "Aug-3", "Aug-4", "Aug-5", "Aug-6", "Aug-7", "Aug-8", "Aug-9", "Aug-10", "Aug-11", "Aug-12", "Aug-13", "Aug-14", "Aug-15", "Aug-16", "Aug-17", "Aug-18", "Aug-19", "Aug-20", "Aug-21", "Aug-22", "Aug-23", "Aug-24", "Aug-25", "Aug-26", "Aug-27", "Aug-28", "Aug-29", "Aug-30", "Aug-31", "Sep-1", "Sep-2", "Sep-3", "Sep-4", "Sep-5", "Sep-6", "Sep-7", "Sep-8", "Sep-9", "Sep-10", "Sep-11", "Sep-12", "Sep-13", "Sep-14", "Sep-15", "Sep-16", "Sep-17", "Sep-18", "Sep-19", "Sep-20", "Sep-21", "Sep-22", "Sep-23", "Sep-24", "Sep-25", "Sep-26", "Sep-27", "Sep-28", "Sep-29", "Sep-30", "Oct-1", "Oct-2", "Oct-3", "Oct-4", "Oct-5", "Oct-6", "Oct-7", "Oct-8", "Oct-9", "Oct-10", "Oct-11", "Oct-12", "Oct-13", "Oct-14", "Oct-15", "Oct-16", "Oct-17", "Oct-18", "Oct-19", "Oct-20", "Oct-21", "Oct-22", "Oct-23", "Oct-24", "Oct-25", "Oct-26", "Oct-27", "Oct-28", "Oct-29", "Oct-30", "Oct-31", "Nov-1", "Nov-2", "Nov-3", "Nov-4", "Nov-5", "Nov-6", "Nov-7", "Nov-8", "Nov-9", "Nov-10", "Nov-11", "Nov-12", "Nov-13", "Nov-14", "Nov-15", "Nov-16", "Nov-17", "Nov-18", "Nov-19", "Nov-20", "Nov-21", "Nov-22", "Nov-23", "Nov-24", "Nov-25", "Nov-26", "Nov-27", "Nov-28", "Nov-29", "Nov-30", "Dec-1", "Dec-2", "Dec-3", "Dec-4", "Dec-5", "Dec-6", "Dec-7", "Dec-8", "Dec-9", "Dec-10", "Dec-11", "Dec-12", "Dec-13", "Dec-14", "Dec-15", "Dec-16", "Dec-17", "Dec-18", "Dec-19", "Dec-20", "Dec-21", "Dec-22", "Dec-23", "Dec-24", "Dec-25", "Dec-26", "Dec-27", "Dec-28", "Dec-29", "Dec-30", "Dec-31"
];


var colorCodes = [

    {backgroundColor: "#7B1FA2", borderColor: "#6A1B9A"},
    {backgroundColor: "#C2185B", borderColor: "#AD1457"},
    {backgroundColor: "#689F38", borderColor: "#558B2F"},
    {backgroundColor: "#1976D2", borderColor: "#1565C0"},
    {backgroundColor: "#FBC02D", borderColor: "#F9A825"},
    {backgroundColor: "#303F9F", borderColor: "#283593"},
    {backgroundColor: "#AFB42B", borderColor: "#9E9D24"},
    {backgroundColor: "#0288D1", borderColor: "#0277BD"},
    {backgroundColor: "#388E3C", borderColor: "#2E7D32"},
    {backgroundColor: "#FFA000", borderColor: "#FF8F00"},
    {backgroundColor: "#616161", borderColor: "#424242"},
    {backgroundColor: "#5D4037", borderColor: "#4E342E"},
    {backgroundColor: "#D32F2F", borderColor: "#C62828"},
    {backgroundColor: "#512DA8", borderColor: "#4527A0"},
    {backgroundColor: "#E64A19", borderColor: "#D84315"},
    {backgroundColor: "#00796B", borderColor: "#00695C"},
    {backgroundColor: "#0097A7", borderColor: "#00838F"},
    {backgroundColor: "#F57C00", borderColor: "#EF6C00"},
    {backgroundColor: "#455A64", borderColor: "#37474F"}

];

//endregion

var context = {};

context.defaults = {
    timeSpent: "8h"
    , timeStarted: 800
};
context.currentSessionIssues = [];

function onDOMContentLoaded() {

    var options = {
        username: '',
        password: '',
        baseUrl: '',
        apiExtension: '',
        accountId: '',
        jql: ''
    };
    chrome.storage.sync.get(options, init);

    initComponentEvents();

    function init(options) {
        // mandatory fields check
        console.log(options);

        if ((options.username && options.password && options.baseUrl && options.apiExtension && options.accountId)) {
            // Jira API instantiation
            var JIRA = JiraAPI(options.baseUrl, options.apiExtension, options.username, options.password, options.jql);

            context.JIRA = JIRA;
            context.options = options;
            context.isReady = true;

        }
        else {
            swal({
                title: "Settings are not configured properly.",
                html: "Please  go to <a href='options.html'>options</a> to configure them.",
                type: "warning",
                buttons: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: "info",
                closeOnEsc: false,
                closeOnClickOutside: false
            });
        }
        init_calendar();
        loadIssueHistory();
    }


}


function errorMessage(message) {
    alert(message);
}

function loadWorkLogs(start, end, callback) {

    if (!context.isReady) {
        callback();
        return;
    }

    console.log("loading for " + " worklogAuthor = currentUser() AND worklogDate >= '" + start.format() + "' AND worklogDate <= '" + end.format() + "'&fields=worklog");
    context.JIRA
        .searchIssues(" worklogAuthor = currentUser() AND worklogDate >= '" + start.format() + "' AND worklogDate <= '" + end.format() + "'&fields=worklog,summary")
        // .searchIssues(" worklogAuthor = currentUser() AND worklogDate >= '" + start.format() + "' AND worklogDate <= '" + end.format() + "'&fields=id,key")
        .then(handleSuccess, handleError);

    function handleSuccess(response) {
        var issues = response.issues;
        var events = [];
        var promises = [];

        issues.forEach(function (issue) {
                if (issue && issue.fields && issue.fields.worklog && issue.fields.worklog.worklogs) {
                    var worklogs = issue.fields.worklog.worklogs;
                    if (worklogs.length < 4) {
                        // promises.push(Promise.resolve(issue));
                        worklogs.forEach(function (worklog) {
                            if (worklog.author.accountId == context.options.accountId)
                                events.push(createWorkLogEvent(issue, worklog));
                        });
                    }
                    else {
                        promises.push(context.JIRA.getIssueWorklog(issue.key));
                    }
                }
            }
        );
        Promise.all(promises).then(function (promiseReturns) {
            console.log(promiseReturns);
            promiseReturns.forEach(function (workLogInfo) {
                console.log(workLogInfo);
                var workLogs = workLogInfo.worklogs;
                console.log(workLogs);
                workLogs.forEach(function (worklog) {
                    if (worklog.author.accountId == context.options.accountId)
                        events.push(createWorkLogEvent(findIssueById(worklog.issueId), worklog));
                });
            });
            callback(events);
        });

        function findIssueById(issueId) {
            var returnVal = null;
            issues.forEach(function (issue) {
                if (issue.id === issueId) {
                    returnVal = issue;
                }
            });
            return returnVal;
        }
    }

    function createWorkLogEvent(issue, workLog) {
        var event = {};
        event.id = workLog.id;
        event.start = workLog.started;
        event.className = issue.key;
        event.end = moment(workLog.started).add(workLog.timeSpentSeconds, 'seconds').format();
        event.title = issue.key + ": " + issue.fields.summary;
        event.timeSpent = workLog.timeSpent;

        event.workLog = workLog;
        event.issue = issue;

        var colorId = getColorId(issue.key);
        event.backgroundColor = colorCodes[colorId].backgroundColor;
        event.borderColor = colorCodes[colorId].borderColor;
        return event;
    }

    function getColorId(key) {

        if (!context.colorIds) {
            context.colorIds = {};
        }
        if (!context.colorIds[key]) {

            var colorId = !context.currentColorId ? 0 : (context.currentColorId) % colorCodes.length;
            context.colorIds[key] = colorId;

            context.currentColorId = colorId + 1;
        }
        return context.colorIds[key];
    }

    function handleError(error) {
        // hide main loading spinner


    }

    return [];
}


/* CALENDAR */

function init_calendar() {

    if (typeof ($.fn.fullCalendar) === 'undefined') {
        return;
    }
    console.log('init_calendar');

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        started,
        categoryClass;

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        themeSystem: 'bootstrap3',
        selectable: true,
        defaultView: 'agendaWeek',
        selectHelper: true,
        scrollTime: '09:00:00',
        height: 568,
        allDaySlot: false,
        timezone: 'local',
        fixedWeekCount: false,
        select: function (start, end, allDay) {
            calanderRangeSelected(start, end, allDay);
        },
        eventClick: function (calEvent, jsEvent, view) {
            calendarEventClicked(calEvent);
            calendar.fullCalendar('unselect');
        },
        eventRender: function (event, element) {
            if (event.timeSpent) {
                element.find(".fc-time").text(event.timeSpent);
            }
        },
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [1, 2, 3, 4, 5], // Monday - Thursday

            start: '10:00', // a start time (10am in this example)
            end: '18:00', // an end time (6pm in this example)
        },
        editable: true,
        loading: function (isLoading, view) {
            if (context.isReady) {
                if (isLoading) {// isLoading gives boolean value
                    $('#calender-loading').show();
                } else {
                    $('#calender-loading').hide();
                    //hide your loader here
                }
            } else {
                $('#calender-loading').hide();
            }
        },
        events: function (start, end, timezone, callback) {
            loadWorkLogs(start, end, callback);
        },
        eventDrop: function (event, delta, revertFunc) {
            modifyEvent(event);
        },
        eventResize: function (event, delta, revertFunc) {
            modifyEvent(event);
        }
    });

};

function modifyEvent(event) {
    var workLog = event.workLog;
    workLog.started = toString(event.start);
    workLog.timeSpentSeconds = moment.duration(event.end.diff(event.start)).asSeconds();
    context.JIRA.modifyWorklog(event.issue.key, workLog);
    event.timeSpent = (workLog.timeSpentSeconds / 3600) + "h";
    // $('#calendar').fullCalendar( 'renderEvent', event  );
    $('#calendar').fullCalendar('rerenderEvents');
}

function calendarEventClicked(event) {
    $('#hidEditModelIssueId').val(event.issue.key);
    $('#hidEditModelWorkLogId').val(event.id);

    $('#ticketInfo').val(event.issue.key + ": " + event.issue.fields.summary);
    var start = moment(event.start);
    $('#txtAffectingDate').val(start.format("MMM-D"));
    $('#txtStartAt').val(start.format("hh:mm A"));

    var seconds = event.workLog.timeSpentSeconds;
    var minutes_s = seconds % 3600;
    var hours = (seconds - minutes_s) / 3600;
    $('#txtShowDuration').val(hours + "h" + (minutes_s > 0 ? " " + (minutes_s / 60) + "m" : ""));

    $('#txtShowComment').text(event.workLog.comment);


    $('#fc_edit').click();

    $("#deleteEvent").on("click", function () {
        if (confirm("Are you sure you want do delete this work log ? ")) {
            context.JIRA.deleteWorkLog(event.issue.key, event.id);
            $('#calendar').fullCalendar('removeEvents', event.id);
            $('.antoclose2').click();
        }
    });
}

var calanderRangeSelected = function (start, end, allDay) {
    var calender = $('#calendar');
    var viewName = calender.fullCalendar('getView').name;
    var affectingDates = [];

    var timeSpent = getValues().timeSpent;
    var timeStarted = getValues().timeStarted;
    if (viewName == "month") {

        var diff = end.diff(start, "days");
        for (var i = 0; i < diff; i++) {
            var date = start.clone().add(i, "days");
            affectingDates.push({
                value: date,
                label: date.format("MMM-D")
            });
        }
    }

    if (viewName != "month") {
        affectingDates.push({
            value: start,
            label: start.format("MMM-D")
        });
        diff = end.diff(start, "minutes");
        if (diff < 1440)
            timeSpent = Math.floor(diff / 60) + "h " + ((diff % 60) > 0 ? (diff % 60) + "m" : "");
        else {
            var duration = moment.duration(diff * 60000);
            timeSpent = duration.days() + "d " + duration.hours() + "h " + duration.minutes() + "m";
        }
        timeStarted = start.hour() * 100 + start.minute();
        // console.log("timeStarted :" + timeStarted);

    }
    context.currentLog = {
        affectingDates: affectingDates,
        timeStarted: timeStarted,
        timeSpent: timeSpent
    };
    // $('#NewWorklogModel').load("abc.html");
    $('#fc_create').click();

    started = start;
    ended = end;

    $(".antosubmit").on("click", function () {
        var title = $("#title").val();
        if (end) {
            ended = end;
        }

        categoryClass = $("#event_type").val();

        if (title) {
            calendar.fullCalendar('renderEvent', {
                    title: title,
                    start: started,
                    end: end,
                    allDay: allDay
                },
                true // make the event "stick"
            );
        }

        $('#title').val('');

        calender.fullCalendar('unselect');

        $('.antoclose').click();

        return false;
    });
};

function getValues() {
    if (context.previous)
        return context.previous;
    return context.defaults;
}


function initComponentEvents() {

    var engine = initializeTypeaheadEngine()
    $("#dates").tokenfield(
        {
            typeahead: [null, {
                source: engine.ttAdapter(),
                display:'label',
                templates: {
                    suggestion: function (params) {
                        return $("<a>" + params.label + "</a>");
                    }
                }
            }
            ]
        }
    );


    var ticketCombo = $('#ticket').selectize({
        valueField: 'key',
        labelField: 'title',
        searchField: 'summary',
        optgroups: [
            {$order: 0, value: 'recent', label: 'Recently logged'},
            {$order: 1, value: 'history', label: 'History Search'}],
        optgroupField: 'class',
        lockOptgroupOrder: true,
        preload: false,
        create: false
    });


    // $("#startAt").selectize();

    $('#NewWorklogModel').on('show.bs.modal', function (e) {
        if (context.currentLog) {
            ticketCombo[0].selectize.clear(true);
            resetTicketCombo(ticketCombo[0].selectize);

            if (context.currentLog.affectingDates) {
                $("#dates").tokenfield('setTokens', context.currentLog.affectingDates);
            }
            if (context.currentLog.timeStarted) {
                console.log(context.currentLog.timeStarted);
                $("#startAt").val(context.currentLog.timeStarted);
            }
            if (context.currentLog.timeSpent) {
                $("#duration").val(context.currentLog.timeSpent);
            }

        }
        // do something...
    });

    $('#new-worklog-add-button').click(function () {
        if (validateNewWorkLog()) {

            var t = $("#startAt").val();
            var m = t % 100;
            var h = ( t - m) / 100;


            var params = {
                issueId: $('#ticket').val(),
                dates: $("#dates").tokenfield('getTokens'),
                startAt: {h: h, m: m},
                duration: $("#duration").val(),
                comment: $('#comment').val()
            };
            console.log(params);
            context.currentSessionIssues.push(params.issueId);


            saveWorkLog(params);
        }
    });
}

function toString(date) {
    // var date = new Date(dateString);
    var tzo = date.utcOffset();
    var dif = tzo >= 0 ? '+' : '-';

    return date.year()
        + '-' + pad(date.month() + 1)
        + '-' + pad(date.date())
        + 'T' + pad(date.hour())
        + ':' + pad(date.minute())
        + ':' + pad(date.second())
        + '.' + pad(date.millisecond())
        + dif + pad(tzo / 60)
        + pad(tzo % 60);
}

function pad(num) {
    var norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
}

function saveWorkLog(params) {
    console.log(params);
    params.dates.forEach(function (d) {

        var startDate = moment(d.value);

        startDate.set(params.startAt);

        context.JIRA.updateWorklogWithComments(params.issueId, params.duration, toString(startDate), params.comment);
    });
    refreshCalander();
}

function refreshCalander() {
    $('#calendar').fullCalendar('refetchEvents');
}

function validateNewWorkLog() {
    if (!$('#ticket').val()) {
        // alert("error");
        false;
    } else {
        // alert($('#ticket').val() );
    }

    return true;
}

function initializeTypeaheadEngine() {
    var dates = [];
    for (var i = 0; i < 45; i++) {
        var date = moment().add(-i, "d");
        dates.push({
            value: date,
            label: date.format("MMM-D")
        })
    }

    var engine = new Bloodhound({
        local: dates,
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.nonword(d.label);
        },
        queryTokenizer: Bloodhound.tokenizers.nonword
    });

    engine.initialize();
    return engine;
}

function resetTicketCombo(selectize) {
    var issuesInCurrentSession = [];
    if (context.currentSessionIssues) {
        context.currentSessionIssues.forEach(function (issue) {
            issuesInCurrentSession.push(issue);
        });
    }
    if (context.issueHistory) {
        context.issueHistory.forEach(function (issue) {

            issue.class = (issuesInCurrentSession.indexOf(issue.key) > -1) ? 'recent' : 'history';
            selectize.addOption(issue);
        });
    }
}

function loadIssueHistory() {
    if (!context.isReady) {
        return;
    }
    context.JIRA
        .searchIssues(" (issue in watchedIssues() OR issue in issueHistory()) ORDER BY lastViewed DESC&fields=summary")
        .then(function (response) {
            var issues = [];
            response.issues.forEach(function (it) {
                issues.push(createIssueItem(it))
            });
            context.issueHistory = issues;
        }, function (response) {
            console.error(response);
            context.issueHistory = [];
        });
}

function createIssueItem(issue) {
    return {
        "key": issue.key
        , "title": issue.key + ": " + issue.fields.summary
        , "summary": issue.fields.summary
    };
}

