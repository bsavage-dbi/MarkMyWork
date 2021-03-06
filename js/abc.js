function userLink(e, t, i, n) {
    var r;
    if (t.$parent.isGadget) {
        var a = angular.copy(t.$parent.reportParamsObject);
        delete a.allUsers, delete a.group, n || delete a.groupByField, a.pivotTableType = "Timesheet", a.user = i.key, t.reportParams = $.param(a), r = '{{$parent.hostBaseUrl}}/plugins/servlet/ac/timereports/timereports#!{{reportParams}}" target="_parent'
    } else r = "{{userObject.key ? '#/?pivotTableType=Timesheet&user=' + userObject.key + '&group=" + (n ? "" : "&groupByField=") + "&_=' + $id : ''}}";
    t.userObject = i;
    var s = e('<a ng-class="{inactive: !userObject.active, disabled: !userObject.key}" ng-href="' + r + '" ng-bind="\'test\'"></a>')(t);
    return delete t.reportParams, delete t.userObject, s
}

function CsvView(e) {
    this.allIssues = e
}

function ExcelView(e) {
    this.allIssues = e
}

function PivotColumn(e) {
    this.columnKey = e, this.sum = 0, this.entries = [], this.value = null
}

function PivotEntry(e, t, i) {
    this.rowKey = e, this.columnKey = t, this.columnKeys = [t], this.value = i, this.values = {}, this.values[t.keyValue] = i
}

function WorkedTimePivotEntry(e, t, i) {
    PivotEntry.apply(this, [e, t, i.timeSpentSeconds]), this.worklog = i
}

function EmptyPivotEntry(e) {
    this.rowKey = e, this.columnKey = {}, this.columnKeys = [], this.values = {}
}

function StringComparator(e, t) {
    return null == e && null == t ? 0 : null == e ? 1 : null == t ? -1 : e.localeCompare(t)
}

function PivotRow(e) {
    this.rowKey = e, this.columns = {}, this.sum = 0, this.data = []
}

function WorkedTimePivotStrategy(e, t, i) {
    this.rowKeyClass = e, this.columnKeyClass = t, this.options = WorkedTimePivotStrategy.getStrategyOptions(i), this.configOptions = i.configOptions
}

function TimeEntryStrategy(e, t) {
    this.rowKeyClass = e, this.options = {startDate: t.startDate, endDate: t.endDate, worklogAuthors: [t.user], includeEmpty: t.includeEmpty}, this.configOptions = t.configOptions
}

function IssueTimeStrategy(e, t) {
    this.rowKeyClass = e, this.options = {startDate: t.startDate, endDate: t.endDate}, t.user && (this.options.worklogAuthors = [t.user]), this.configOptions = t.configOptions
}

function PassedTimePivotStrategy(e, t, i) {
    this.rowKeyClass = e, this.columnKeyClass = t, this.options = WorkedTimePivotStrategy.getStrategyOptions(i), this.configOptions = i.configOptions, delete this.configOptions.startedTimeInStatus
}

function TimeTrackingStrategy(e, t) {
    this.rowKeyClass = e, this.options = {
        groupByField: t.groupByField,
        groupByFieldObject: t.groupByFieldObject,
        categorizeByField: t.categorizeByField,
        categorizeByFieldObject: t.categorizeByFieldObject
    }, this.configOptions = t.configOptions
}

function PivotTable(e, t) {
    this.pivotStrategy = e, this.rows = {}, this._sortedRows = null, this._sortedColumns = null, this.totals = {}, this.sum = 0, this.num = 0, this.pivotStrategy.getColumnsFunction && (this.totals = this.pivotStrategy.getColumnsFunction()), this.logger = t
}

function TimesheetStrategy(e, t, i) {
    this.rowKeyClass = e, this.columnKeyClass = t, this.options = TimesheetStrategy.getStrategyOptions(i), this.configOptions = i.configOptions
}

function GadgetSummary(e, t, i) {
    var n = function (t, i) {
        for (var n = [], r = 0; r < e.length; r++) e[r].key != t || null != i && i != /[^.]*$/.exec(e[r].label) || n.push(e[r]);
        return n
    }, r = function (e) {
        for (var t = "", i = 0; i < e.length; i++) t.length > 0 && (t += ", "), t += e[i].labelParam;
        return t
    }, a = function (e, t) {
        return {text: e, styleClass: t}
    };
    this.getSummaryItems = function () {
        var e = [];
        e.push(a("Summary ", "grey"));
        var s = r(n("allUsers")), o = r(n("group")), l = r(n("filterOrProjectId", "project")), u = r(n("filterOrProjectId", "filter")), d = r(n("startDate")), c = r(n("endDate")),
            m = r(n("groupByField"));
        return s && ["Timesheet", "PieChart"].indexOf(i) >= 0 ? e.push(a("for all users", "grey")) : o ? (e.push(a("for groups", "grey")), e.push(a(o))) : t && (e.push(a("for user", "grey")), e.push(a(t.displayName))), null != l && "" != l.length ? (e.length > 1 ? e.push(a("and", "grey")) : e.push(a("for", "grey")), e.push(a("project ", "grey")), e.push(a(l))) : !u && ["Timesheet", "PieChart"].indexOf(i) < 0 && (e.length > 1 ? e.push(a("and", "grey")) : e.push(a("for", "grey")), e.push(a("all projects"))), null != u && "" != u.length && (e.length > 1 && e.push(a("and", "grey")), e.push(a("filter", "grey")), e.push(a(u))), null != m && "" != m && (e.push(a("grouped by", "grey")), e.push(a(m))), null != d && "" != d && (e.push(a("from", "grey")), e.push(a(d))), null != c && "" != c && (e.push(a("to", "grey")), e.push(a(c))), e
    }
}

function TimesheetSelectOptions(e, t, i, n) {
    this.options = [], this.optionClass = e, this.sortableProperty = null != i ? i : "label", this.selected = null != t ? t : "", this.sections = n
}

function TimesheetGeneralOption(e, t) {
    this.label = e, this.id = t
}

var app = angular.module("timesheetApp", ["appBase", "xeditable"]);
app.run(["editableOptions", "editableThemes", function (e, t) {
    e.theme = "aui", t.aui = {
        formTpl: '<form class="aui"></form>',
        noformTpl: '<span class="editable-wrap"></span>',
        controlsTpl: '<div class="inline-edit-fields" tabindex="1"><div class="field-group"></div></div>',
        inputTpl: "",
        errorTpl: '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
        buttonsTpl: '<span class="editable-buttons"></span>',
        submitTpl: '<button class="aui-button submit" accesskey="s" type="submit" title="Press Alt+s to submit this form"><span class="aui-icon aui-icon-small aui-iconfont-success">Save</span></button>',
        cancelTpl: '<button class="aui-button cancel" type="cancel" ng-click="$form.$cancel()" title="Press Alt+` to cancel"><span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Cancel</span></button>',
        buttonsClass: "",
        inputClass: "text long-field",
        postrender: function () {
            switch (this.directiveName) {
                case"editableText":
                case"editableSelect":
                case"editableTextarea":
                case"editableEmail":
                case"editableTel":
                case"editableNumber":
                case"editableUrl":
                case"editableSearch":
                case"editableDate":
                case"editableDatetime":
                case"editableTime":
                case"editableMonth":
                case"editableWeek":
                    if (this.inputEl.addClass("form-control"), this.theme.inputClass) {
                        if (this.inputEl.attr("multiple") && ("input-sm" === this.theme.inputClass || "input-lg" === this.theme.inputClass)) break;
                        this.inputEl.addClass(this.theme.inputClass)
                    }
            }
            this.buttonsEl && this.theme.buttonsClass && this.buttonsEl.find("button").addClass(this.theme.buttonsClass)
        }
    }
}]), app.config(["$routeProvider", "$windowProvider", function (e, t) {
    var i = t.$get();
    e.when("/", {
        controller: i.mainController || "TimesheetController", templateUrl: i.mainTemplate || "/templates/main.html", resolve: {
            loggedInUser: ["loggedInUser", function (e) {
                return e
            }], projectKey: ["projectKey", function (e) {
                return e
            }], jql: ["jql", function (e) {
                return e
            }], externalFilter: ["externalFilter", function (e) {
                return e
            }], timesheetParams: ["timesheetParams", function (e) {
                return e
            }], flightRecorder: ["flightRecorder", function (e) {
                return e
            }]
        }
    }).otherwise({redirectTo: "/"})
}]), app.controller("BitbucketController", ["$scope", "$q", "$window", "loggedInUser", "flightRecorder", "pivottableService", function (e, t, i, n, r, a) {
    var s = window.RA || window.AP;
    !function () {
        s.resize(), e.replyTo = n.displayName + " <" + n.emailAddress + ">";
        var i, o, l = function () {
            e.$apply(function () {
                e.loading = !0
            }), r.sendEmail(e.includeSupportData.enabled, e.replyTo, e.title, e.content).then(function (e) {
                s.Dialog.close("submit")
            })
        }, u = t.defer();
        s.dialog.getCustomData(function (t) {
            if (e.title = t.errorMessage, t.stackTrace) {
                var l = ["", "", "---- Error Stack Trace ----"];
                l.push.apply(l, t.stackTrace), e.content = l.join("\n")
            }
            t.options && (e.includeSupportData = {
                enabled: !1,
                options: t.options
            }, r.setEnabled(!0), r.timesheetParams = t.timesheetParams, 0 == Object.keys(t.timesheetParams).length ? angular.isFunction(s.cookie.read) ? s.cookie.read("timereports-location-search", function (e) {
                r.cookie(e), u.resolve(TimesheetUtils.getJson(e))
            }) : u.resolve({}) : u.resolve(t.timesheetParams), i = a.getFields(), o = a.restrictedByAuditorsGroups(n)), e.$apply()
        }), s.events.on("dialog.submit", l), s.dialog.disableCloseOnSubmit(), e.$watch("includeSupportData.enabled", function (r) {
            if (r) {
                var l = s.dialog.getButton("submit");
                l.disable(), t.all([u.promise, i, o]).then(function (i) {
                    var r = i[0], s = i[2];
                    r.viewId && viewService.getViews(r.viewId, n).then(u.resolve);
                    var o = e.includeSupportData.options.restrictable && s ? null : a.getPivotTable(n, e.includeSupportData.options);
                    t.when(o).then(function () {
                        e.SubmitIssueForm.$valid && l.enable()
                    })
                })
            }
        })
    }()
}]), app.controller("ConfigurationController", ["$scope", "$route", "$routeParams", "$location", "$q", "$sce", "$timeout", "$window", "configurationService", "$http", "loggedInUser", function (e, t, i, n, r, a, s, o, l, u, d) {
    function c(e) {
        h(e + "SaveSuccess")
    }

    function m(e) {
        h(e + "SaveError")
    }

    function h(t) {
        e[t] = !0, s(function () {
            e[t] = !1
        }, 2e3)
    }

    var p = window.RA || window.AP;
    !function () {
        p.resize(), e.contentTemplate = function () {
            return e.templates.configure
        }, e.saveAuditorsGroups = function () {
            l.saveConfiguration(e.auditorsGroups).then(function (t) {
                e.auditorsGroups = t, c("auditorsGroups")
            })
        }, e.saveCompositionIssueLink = function () {
            l.saveConfiguration(e.compositionIssueLink).then(function (t) {
                e.compositionIssueLink = t, c("compositionIssueLink")
            })
        }, e.saveParentIssueField = function () {
            l.saveConfiguration(e.parentIssueField).then(function (t) {
                e.parentIssueField = t, c("parentIssueField")
            })
        }, e.saveWeekendType = function () {
            var t = angular.copy(e.weekendType);
            "60" == t.val && (t.val = null), l.saveConfiguration(t).then(function (t) {
                t.val || (t.val = "60"), e.weekendType = t, c("weekendType")
            })
        }, e.savePreserveStartedTime = function () {
            l.saveConfiguration(e.preserveStartedTime).then(function (t) {
                e.preserveStartedTime = t, c("preserveStartedTime")
            })
        }, e.saveWorkingTimeInStatus = function () {
            l.saveConfiguration(e.workingTimeInStatus).then(function (t) {
                e.workingTimeInStatus = t, c("workingTimeInStatus")
            })
        }, e.saveStartedTimeInStatus = function () {
            l.saveConfiguration(e.startedTimeInStatus).then(function (t) {
                e.startedTimeInStatus = t, c("startedTimeInStatus")
            })
        }, e.saveDurationType = function () {
            "h" == e.durationType.val && (e.weekendType.val = null);
            var t;
            null != e.prettyDuration.val ? (e.prettyDuration.val = null, t = l.saveConfiguration(e.prettyDuration)) : t = r.resolve(), t.then(function () {
                l.saveConfiguration(e.durationType).then(function (t) {
                    e.durationType = t, c("durationType")
                })
            })
        }, e.saveMaxFractionDigits = function () {
            l.saveConfiguration(e.maxFractionDigits).then(function (t) {
                e.maxFractionDigits = t, c("maxFractionDigits")
            })
        }, e.saveCacheWorklog = function () {
            l.saveConfiguration(e.cacheWorklog).then(function (t) {
                e.cacheWorklog = t, c("cacheWorklog")
            })
        };
        var t = function (e) {
            return u.post("/api/storeWorklog?user_key=" + encodeURIComponent(d.key), {enabled: e})
        }, i = function (t) {
            e.storeWorklog.val ? (e.cacheWorklogBak = e.cacheWorklog.val, e.cacheWorklog.val = !1) : t && (e.cacheWorklog.val = e.cacheWorklogBak)
        };
        e.saveStoreWorklog = function () {
            i("restore"), t(e.storeWorklog.val).then(function () {
                l.saveConfiguration(e.storeWorklog).then(function (t) {
                    e.storeWorklog = t, c("storeWorklog")
                })
            }, function () {
                e.storeWorklog.val = !e.storeWorklog.val, i("restore"), m("storeWorklog")
            })
        }, e.saveTrackSupportData = function () {
            l.saveConfiguration(e.trackSupportData).then(function (t) {
                e.trackSupportData = t, c("trackSupportData")
            })
        }, e.saveOnErrorIgnore = function () {
            l.saveConfiguration(e.onErrorIgnore).then(function (t) {
                e.onErrorIgnore = t, c("onErrorIgnore")
            })
        }, e.saveWorklogVisibilityGroup = function () {
            l.saveConfiguration(e.worklogVisibilityGroup).then(function (t) {
                e.worklogVisibilityGroup = t, c("worklogVisibilityGroup")
            })
        }, e.saveWorklogVisibilityRole = function () {
            l.saveConfiguration(e.worklogVisibilityRole).then(function (t) {
                e.worklogVisibilityRole = t, c("worklogVisibilityRole")
            })
        }, e.saveTimeentryPanelGroups = function () {
            e.timeentryPanelGroups.val = e.timeentryPanelGroups.val ? e.timeentryPanelGroups.val.split(",") : void 0, l.saveConfiguration(e.timeentryPanelGroups).then(function (t) {
                e.timeentryPanelGroups = t, c("timeentryPanelGroups")
            })
        };
        var n = function () {
            l.saveConfiguration(e.workLabels).then(function (t) {
                e.workLabels = t, c("workLabels")
            })
        };
        e.addWorkLabel = function (t) {
            t && -1 == e.workLabels.val.indexOf(t) ? (e.workLabels.val.push(t), n()) : m("workLabels")
        }, e.removeWorkLabel = function (t) {
            e.workLabels.val.splice(t, 1), n()
        }, e.saveWorkDescriptionRequired = function () {
            l.saveConfiguration(e.workDescriptionRequired).then(function (t) {
                e.workDescriptionRequired = t, c("workDescriptionRequired")
            })
        }, e.getApiKey = function () {
            u.get("/api/key?user_key=" + encodeURIComponent(d.key)).then(function (e) {
                p.flag.create({title: "REST Key", body: e.data, type: "success"})
            }, function (e) {
                p.flag.create({title: "REST Key", body: e.data || e || "Something went wrong", type: "error"})
            })
        };
        var a = l.getConfiguration(), s = l.getAllCompositionIssueLinks(), h = l.getAllParentIssueFields(), f = l.getAllRoles();
        r.all([a, s, h, f]).then(function (t) {
            p.resize();
            var n = t[0], r = t[1], a = t[2], s = t[3], l = function (e) {
                null == e.val && (e.val = "")
            };
            if (e.auditorsGroups = n.auditorsGroups, e.compositionIssueLink = n.compositionIssueLink, l(e.compositionIssueLink), e.parentIssueField = n.parentIssueField, l(e.parentIssueField), e.weekendType = n.weekendType, e.preserveStartedTime = n.preserveStartedTime, e.workingTimeInStatus = n.workingTimeInStatus, e.startedTimeInStatus = n.startedTimeInStatus, e.prettyDuration = n.prettyDuration, e.durationType = n.durationType, e.maxFractionDigits = n.maxFractionDigits, e.trackSupportData = n.trackSupportData, e.onErrorIgnore = n.onErrorIgnore, e.worklogVisibilityGroup = n.worklogVisibilityGroup, e.worklogVisibilityRole = n.worklogVisibilityRole, e.timeentryPanelGroups = n.timeentryPanelGroups, e.workDescriptionRequired = n.workDescriptionRequired, e.workLabels = n.workLabels, e.cacheWorklog = n.cacheWorklog, e.storeWorklog = n.storeWorklog, e.storeWorklog && i(), e.prettyDuration.val && (e.durationType.val = "pretty"), e.allCompositionIssueLinks = TimesheetUtils.makeUISelectList(r, !0), null != a && a.length > 0) {
                e.allParentIssueFields = [{id: "", label: ""}];
                for (var u = 0; u < a.length; u++) e.allParentIssueFields.push({id: a[u].id, label: a[u].name})
            }
            e.worklogVisibilityRoles = new TimesheetSelectOptions(TimesheetGeneralOption, e.worklogVisibilityRole.val), delete s["atlassian-addons-project-access"];
            for (var d in s) e.worklogVisibilityRoles.addOption(d, d);
            e.allWeekendTypes = [], e.allWeekendTypes.push({id: "60", label: "Sat-Sun"}), e.allWeekendTypes.push({id: "56", label: "Fri-Sat"}), e.allWeekendTypes.push({
                id: "45",
                label: "Thu-Fri"
            }), e.allWeekendTypes.push({id: "0", label: "Sun"}), e.allWeekendTypes.push({id: "5", label: "Fri"}), e.allDurationTypes = [], e.allDurationTypes.push({
                id: "h",
                label: "Hours"
            }), e.allDurationTypes.push({id: "d", label: "Days"}), e.allDurationTypes.push({id: "pretty", label: "Pretty Duration"}), e.problemReporter = void 0 != o.mailerUrl
        })
    }()
}]), app.controller("GadgetController", ["$scope", "$rootScope", "$route", "$routeParams", "$q", "$location", "$sce", "$timeout", "localize", "loggedInUser", "pivottableService", function (e, t, i, n, r, a, s, o, l, u, d) {
    var c = window.RA || window.AP;
    !function () {
        c.resize(), e.contentTemplate = function () {
            return e.templates.dialog
        };
        var i = function () {
            return TimesheetUtils.normalizeObject({
                title: e.title,
                pivotTableType: e.$parent.pivotTableType,
                group: e.$parent.group,
                user: e.$parent.user,
                allUsers: e.$parent.allUsers.enabled,
                sumSubTasks: e.$parent.sumSubTasks,
                includeEmpty: e.$parent.includeEmpty,
                filterOrProjectId: e.$parent.filterOrProjectId,
                groupByField: e.$parent.groupByField,
                categorizeByField: e.$parent.categorizeByField,
                moreFields: e.$parent.moreFields,
                numOfWeeks: e.$parent.numOfWeeks,
                reportingDay: e.$parent.reportingDayOptions.selected,
                hideWeekends: !e.$parent.showWeekends.enabled
            }, !0)
        };
        e.pivotTableTypeChanged = function () {
            e.$parent.pivotTableType = e.$parent.pivotTableTypeOptions.selected ? e.$parent.pivotTableTypeOptions.selected : "", c.resize()
        }, e.filterByChanged = function (t) {
            e.$parent.filterOrProjectId = null != t && "" != t ? t.split(",") : []
        }, e.groupChange = function (t) {
            e.$parent.group = null != t && "" != t ? t.split(",") : []
        }, e.userChange = function (t) {
            e.$parent.user = t
        }, e.allUsersChange = function (t) {
            e.$parent.allUsers.enabled = t
        }, e.sumSubTasksChange = function (t) {
            e.$parent.sumSubTasks = t
        }, e.includeEmptyChange = function (t) {
            e.$parent.includeEmpty = t
        }, e.groupByChanged = function () {
            e.$parent.groupByField = e.$parent.groupByOptions.selected ? e.$parent.groupByOptions.selected : ""
        }, e.categorizeByChanged = function () {
            e.$parent.categorizeByField = e.$parent.categorizeByOptions.selected ? e.$parent.categorizeByOptions.selected : ""
        }, e.moreFieldsChanged = function () {
            e.$parent.moreFields = e.$parent.moreFieldsOptions.selected
        }, e.numOfWeeksChange = function (t) {
            e.$parent.numOfWeeks = t || 1
        }, e.reportingDayChanged = function () {
            e.$parent.reportingDay = e.$parent.reportingDayOptions.selected
        }, d.getGadgetConfiguration(e.$parent.dashboardId, e.$parent.dashboardItemId).then(function (t) {
            var i = Object.keys(t);
            if (null != t && i.length > 0) for (var n = 0; n < i.length; n++) e.$parent[i[n]] = t[i[n]];
            t.user ? e.userInfo = e.$parent.paramUserInfo : e.$parent.user = null, e.$parent.allUsers = {enabled: !0 === e.$parent.allUsers}, e.$parent.showWeekends = {enabled: !e.$parent.hideWeekends}
        }), e.saveGadgetConfig = function () {
            var n = i();
            d.saveGadgetConfiguration(e.dashboardId, e.dashboardItemId, n).then(function () {
                t.$emit("gadgetConfigSave")
            })
        }, e.cancelGadgetConfigSaving = function () {
            t.$emit("gadgetConfigCancel")
        }
    }()
}]), app.controller("TimesheetController", ["$window", "$scope", "$rootScope", "localize", "$timeout", "$q", "$route", "$routeParams", "$location", "$sce", "$interval", "pivottableService", "configurationService", "loggedInUser", "projectKey", "jql", "externalFilter", "timesheetParams", "applicationLoggingService", "viewService", "flightRecorder", "validationService", "jobService", function (e, t, i, n, r, a, s, o, l, u, d, c, m, h, p, f, _, g, y, v, k, w, T) {
    function b(y) {
        if (AP.resize(), $(".aui-inline-dialog").hide(), t.TimesheetUtils = TimesheetUtils, t.showGadgetConfiguration = !1, t.pivotTableType = t.issueKey ? "IssueTime" : y.pivotTableType || "Timesheet", "PlannedVsActualTime" == t.pivotTableType && (t.pivotTableType = "TimeTracking"), t.reportDialog = t.reportDialog || "timereports" == t.dialogType, t.contentTemplate = function () {
                return t.reportDialog ? t.templates.menu : t.issueKey ? t.templates.issuetime : "Timesheet" == t.pivotTableType ? t.templates.timesheet : "PieChart" == t.pivotTableType ? t.templates.piechart : t.templates.pivottable
            }, t.isDayView = ["TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0, t.dialogCloseFunction = function (e) {
                if (void 0 != e) if ("submit" == e) t.refresh(); else if (angular.isObject(e)) {
                    var i = function () {
                        K.queue = t.pivotTable.queue, K.queueToAdd = t.pivotTable.queueToAdd, K.matches = t.pivotTable.matches, t.execute()
                    }, n = function (t) {
                        var n = t.worklog || t.fields.worklog, r = n.worklogs;
                        if (e.worklogOld) for (var a = 0; a < r.length; a++) if (r[a].id == e.worklogOld.id) {
                            r.splice(a, 1);
                            break
                        }
                        e.worklog && r.push(e.worklog), i()
                    }, r = function (e) {
                        for (var t in c.allIssues) if (c.allIssues[t].key == e) return n(c.allIssues[t]), !0;
                        return !1
                    };
                    r(e.issueKey) || c.getIssueByKey(t.pivotTable, e.issueKey, K).promise.then(function (n) {
                        var a = function (e) {
                            c.processIssue(t.pivotTable, K, n).then(function () {
                                K.sumSubTasks && c.allIssues.push(e || n), i()
                            })
                        };
                        if (K.sumSubTasks) {
                            var s = c.getParentIssue(t.pivotTable, n, K);
                            s.hasOwnProperty("promise") ? c.onParentIssue(t.pivotTable, n, K, s, [], function (t) {
                                t ? (e.worklog && (e.worklog._issue = {key: n.key, fields: {summary: n.fields.summary}}), r(t.key) || a(t)) : a()
                            }) : a()
                        } else a()
                    })
                }
            }, t.isGadget) {
            t.title = y.title;
            var b = t.title || n.getLocalizedString(t.pivotTableType);
            AP.jira.setDashboardItemTitle(b), AP.jira.DashboardItem.onDashboardItemEdit(function () {
                t.showGadgetConfiguration = !0, t.$apply()
            });
            var M = angular.copy(y);
            if (angular.isDefined(f)) {
                var D = f.match(/(\s+|^)order\s+by(\s+.+?)(\s+asc|\s+desc)?$/i);
                D && (f = f.substring(0, f.length - D[0].length)), M.jql = f
            } else if (_) {
                var A = parseInt(_);
                if (A < 0) {
                    switch (A) {
                        case-1:
                            f = "assignee = currentUser() AND resolution = Unresolved";
                            break;
                        case-2:
                            f = "reporter = currentUser()";
                            break;
                        case-3:
                            f = "issuekey in issueHistory()";
                            break;
                        case-4:
                            f = "";
                            break;
                        case-5:
                            f = "resolution = Unresolved";
                            break;
                        case-6:
                            f = "created >= -1w";
                            break;
                        case-7:
                            f = "resolutiondate >= -1w";
                            break;
                        case-8:
                            f = "updated >= -1w";
                            break;
                        case-9:
                            f = "statusCategory = Done";
                            break;
                        default:
                            return void AP.flag.create({title: "Unsupported predefined filter", body: "Filter " + A + " is not known", type: "error"})
                    }
                    M.jql = f
                } else M.filterOrProjectId = "filter_" + _
            }
            t.reportParamsObject = TimesheetUtils.normalizeObject(TimesheetUtils.unwrapBoolObjects(M)), t.reportParams = $.param(t.reportParamsObject), t.reportDialog && AP.events.on("dialog.submit", function () {
                e.parent.location.href = t.hostBaseUrl + "/plugins/servlet/ac/timereports/timereports#!" + t.reportParams
            })
        }
        var S = function () {
            var e = new Date, i = this.worklog.date;
            i.setHours(e.getHours()), i.setMinutes(e.getMinutes());
            var n = {issueKey: this.worklog.issueKey, date: i, timeSpent: this.worklog.timeSpent, comment: this.worklog.comment, initialWorkLabels: c.workLabels};
            AP.dialog.create({key: "createworklog", width: "720px", height: "450px", chrome: !0, header: "Log Work", submitText: "Log", customData: n}).on("close", t.dialogCloseFunction)
        }, Y = function (e) {
            var i = this, n = angular.copy(i.worklog);
            i.loading = !0;
            var r = TimesheetUtils.getCurrentTimeMs() - TimesheetUtils.getTimeSpentMs(n.timeSpent, t.jiraConfig);
            n.date = new Date(n.date.getTime() + Math.max(0, r)), c.createWorklog(n).then(function (n) {
                i.loading = !1, e();
                var r = new WorkedTimePivotEntry(i.rowKey, i.columnKey, n);
                t.pivotTable.addEntry(r), (i.rowKey.issue.worklog || i.rowKey.issue.fields.worklog).worklogs.push(n)
            }, function () {
                i.loading = !1
            })
        };
        t.addWorklogPopup = {
            worklog: {estimateType: "auto"}, init: function (e, i) {
                this.columnKey = e, this.rowKey = i;
                var n = e.keyValue, r = i.issue.key;
                this.worklog.timeSpent = t.jiraConfig.workingHoursPerDay + "h", this.worklog.comment = "", this.worklog.date = new Date(n), this.worklog.issueKey = r
            }, addWorklog: Y, openMoreOptionDialog: S
        }, t.editWorklogPopup = {
            worklog: {estimateType: "auto"}, worklogs: [], init: function (e, i, n) {
                this.columnKey = e, this.rowKey = i;
                var r = new Date(e.keyValue);
                this.worklogs = [], i.issue && (this.worklog.timeSpent = t.jiraConfig.workingHoursPerDay + "h", this.worklog.comment = "", this.worklog.date = r, this.worklog.issueKey = i.issue.key);
                for (var a = 0; a < n.length; a++) if (TimesheetUtils.sameDay(r, new Date(n[a].columnKey.keyValue))) {
                    var s = angular.copy(n[a].worklog);
                    this.worklogs.push(s), i.field ? (s._issue ? s._issueInfo = s._issue : s._issueInfo = {
                        key: n[a].rowKey._issue.key,
                        fields: {summary: n[a].rowKey._issue.fields.summary}
                    }, "workeduser" != y.groupByField && (s._authorInfo = s.author)) : t.user || (s._authorInfo = s.author)
                }
            }, openDeleteWorklogDialog: function (e, i) {
                t.deleteWorklogDialog(e, i ? i.key : this.worklog.issueKey)
            }, openEditWorklogDialog: function (e, i) {
                t.updateWorklogDialog(e, i ? i.key : this.worklog.issueKey)
            }, openMoreOptionDialog: S, addWorklog: Y
        }, t.addWorklogDialog = function (e) {
            var i = e || {};
            i.date = i.started || new Date, i.initialWorkLabels = c.workLabels, i.jqlQuery = t.jqlQuery, AP.dialog.create({
                key: t.issueKey ? "createworklog" : "addworklog",
                width: "720px",
                height: "450px",
                chrome: !0,
                header: "Log Work",
                submitText: "Log",
                customData: i
            }).on("close", t.dialogCloseFunction)
        }, t.updateWorklogDialog = function (e, i) {
            var n = {issueKey: i, worklogId: e, initialWorkLabels: c.workLabels};
            AP.dialog.create({key: "updateworklog", width: "720px", height: "450px", chrome: !0, header: "Log Work", submitText: "Log", customData: n}).on("close", t.dialogCloseFunction)
        }, t.deleteWorklogDialog = function (e, i) {
            var n = {issueKey: i, worklogId: e};
            AP.dialog.create({key: "deleteworklog", width: "720px", height: "250px", chrome: !0, header: "Delete Worklog", submitText: "Delete", customData: n}).on("close", t.dialogCloseFunction)
        };
        var x = function () {
            try {
                var e = window.localStorage.getItem(B);
                return e ? TimesheetUtils.getJson(LZString.decompressFromUTF16(e)) : []
            } catch (e) {
                return console.log(e), []
            }
        }, E = function (e, t) {
            if (e.started) {
                var i = angular.copy(e), n = x();
                try {
                    n = n.filter(function (e) {
                        return new Date(e.started).getTime() != new Date(i.started).getTime()
                    }), t || n.push(i), n = JSON.stringify(n), window.localStorage.setItem(B, LZString.compressToUTF16(n))
                } catch (e) {
                    console.log("timeentry cache error", e)
                }
            }
        }, C = function () {
            i.workTimer && (d.cancel(i.workTimer), delete i.workTimer)
        }, O = function (e) {
            i.workTimer = d(function () {
                e.timeSpentSeconds += 60, t.workEntry.values["2timespent"] = e.timeSpentSeconds, E(e)
            }, 6e4)
        };
        if (C(), t.createEntry = function (e, i) {
                var n = new PivotKey.Issue(e, i, K.configOptions), a = new PivotKey.Generic("TimeEntry", "1started", "time"), s = new PivotKey.Generic("TimeEntry", "2timespent"),
                    o = new PivotKey.Generic("TimeEntry", "3action");
                o.showStart = !0;
                var l = new PivotEntry(n, a, i.started);
                return l.worklog = i, l.addColumn(s, 0), "TimeEntry" == t.pivotTableType && l.addColumn(o, l), t.pivotTable.addEntry(l), t.rowKeySize = TimesheetUtils.colspan(t.pivotTable), t.pivotTable._sortedColumns = null, l.values[s.keyValue] = i.timeSpentSeconds ? i.timeSpentSeconds : 1, r(function () {
                    AP.resize()
                }), l
            }, t.removeCashedWorklog = function () {
                E(this.worklog, "removeFromCache"), t.execute()
            }, t.startWork = function (e, i) {
                C();
                var n = !i && (!t.workEntry || e);
                t.workEntry && (t.workEntry.worklog.stopped = new Date, E(t.workEntry.worklog), delete t.workEntry);
                var r;
                if (t.pivotTable.rows[this.worklog.issueKey] && !this.worklog.started) r = angular.copy(t.pivotTable.rows[this.worklog.issueKey].columns["3action"].worklog), delete r.stopped; else if (e) r = angular.copy(this.worklog); else {
                    r = this.worklog;
                    var a = !0
                }
                if (n && !a) r.started = new Date, r.timeSpentSeconds = 0, c.havePermissions(["WORK_ON_ISSUES", "EDIT_OWN_WORKLOGS", "DELETE_OWN_WORKLOGS"], "issueKey=" + r.issueKey).then(function (e) {
                    return function (i) {
                        if (!i[0]) return delete e.issueKey, void t.errors.push("error.cannotLogWorkIssue");
                        t.errors.splice(0, t.errors.length), i[1] || (t.cannotEditOwnWorklogIssue[e.issueKey] = !0), i[2] || (t.cannotDeleteOwnWorklogIssue[e.issueKey] = !0), c.findIssueByKey(e.issueKey, K).then(function (i) {
                            t.workEntry = t.createEntry(i, e), E(e), O(e)
                        })
                    }
                }(r)); else if (n && a) {
                    delete r.stopped;
                    t.workEntry = this.entry;
                    E(r), O(r)
                } else i ? (r.timeSpent = DrawHelper.prettyDuration(r.timeSpentSeconds, t.jiraConfig), E(r, "removeFromCache"), t.addWorklogDialog(r)) : E(r)
            }, t.editWorklog = function (e) {
                c.findIssueByKey(e.issueId, K).then(function (i) {
                    t.updateWorklogDialog(e.id, i.key)
                })
            }, t.deleteWorklog = function (e) {
                c.findIssueByKey(e.issueId, K).then(function (i) {
                    t.deleteWorklogDialog(e.id, i.key)
                })
            }, t.isMonthView = "month" === y.view, t.sum = "PieChart" != t.pivotTableType ? y.sum || (t.isMonthView ? "week" : "day") : "day", t.compressed = "TimeEntry" != t.pivotTableType && (0 == y.showDetails || "false" == y.showDetails), "TimeTracking" != t.pivotTableType) {
            t.startDate = {value: y.startDate ? moment(y.startDate).toDate() : void 0}, t.endDate = {value: y.endDate ? moment(y.endDate).toDate() : void 0};
            var P = t.numOfWeeks = y.numOfWeeks || 1, I = t.isMonthView, j = null != y.reportingDay ? y.reportingDay : moment.localeData().firstDayOfWeek();
            -1 == j && (j = "day" == t.sum ? moment().day() : moment.localeData().firstDayOfWeek()), t.reportingDay = j;
            var W = TimesheetUtils.getLastMondayDate(j);
            W = TimesheetUtils.addWeeks(W, 1 - P);
            var F = TimesheetUtils.getFirstDayOfTheMonth();
            if (void 0 === y.startDate && (t.startDate.value = t.isDayView ? moment().startOf("day").toDate() : I ? F : W), ["TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0 && (t.endDate = t.startDate), void 0 === y.endDate) {
                var z = t.startDate.value || W;
                t.endDate.value = t.isDayView ? moment(t.startDate.value).toDate() : I ? TimesheetUtils.getLastDayOfTheMonth(z) : TimesheetUtils.addDays(z, 7 * (P - 1) + 6)
            }
            t.showWeekends = {enabled: !(0 == y.showWeekends || "false" == y.showWeekends)}, t.isStartDateToday = TimesheetUtils.sameDay(t.startDate.value, new Date)
        } else t.startDate = {value: y.startDate ? moment(y.startDate).toDate() : void 0}, t.endDate = {value: y.endDate ? moment(y.endDate).toDate() : void 0}, t.showWeekends = {}, delete t.hideDetails;
        t.projectKey = y._allProjects ? null : p, t.sumSubTasks = {enabled: 1 == y.sumSubTasks || "true" == y.sumSubTasks}, angular.isDefined(y.jql) ? t.filterOrProjectId = null : t.filterOrProjectId = !angular.isDefined(f) && _ ? "filter_" + _ : y.filterOrProjectId || (t.projectKey && !y._allProjects ? "project_" + t.projectKey : void 0), ["Timesheet", "TimeEntry"].indexOf(t.pivotTableType) >= 0 && (t.filterOrProjectId || y.jql) ? t.includeEmpty = {enabled: 1 == y.includeEmpty || "true" == y.includeEmpty} : t.includeEmpty = {}, t.instantView = y.instantView, "TimeTracking" == t.pivotTableType ? (t.hideTotalColumn = !0, t.hideDetails = void 0 == y.groupByField || "workeduser" == y.groupByField, t.hideDetails && (t.compressed = !0), t.hidePrevNext = !0, t.canLogWork = t.canEditOwnWorklog = t.canDeleteOwnWorklog = !1) : (delete t.hideTotalColumn, t.allUsers = {enabled: y.allUsers}, "IssueWorkedTimeByUser" == t.pivotTableType || "IssueWorkedTimeByStatus" == t.pivotTableType || "PieChart" == t.pivotTableType ? t.hidePrevNext = null === y.startDate && null === y.endDate : t.hidePrevNext = !1, ["Timesheet", "PieChart", "TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0 ? (t.user = y.allUsers || y.group && 0 != y.group.length ? null : y.user ? decodeURIComponent(y.user) : h.key, ["TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0 || "Timesheet" == t.pivotTableType && (!y.group || 0 == y.group.length) && !y.allUsers && t.user == h.key && !y.groupByField ? c.havePermissions(["WORK_ON_ISSUES", "EDIT_OWN_WORKLOGS", "DELETE_OWN_WORKLOGS"]).then(function (e) {
            t.editWorklogPopup.canLogWork = t.canLogWork = e[0], t.editWorklogPopup.cannotLogWorkIssue = t.cannotLogWorkIssue = {}, t.editWorklogPopup.canEditOwnWorklog = t.canEditOwnWorklog = e[1], t.editWorklogPopup.cannotEditOwnWorklogIssue = t.cannotEditOwnWorklogIssue = {}, t.editWorklogPopup.canDeleteOwnWorklog = t.canDeleteOwnWorklog = e[2], t.editWorklogPopup.cannotDeleteOwnWorklogIssue = t.cannotDeleteOwnWorklogIssue = {}
        }) : t.canLogWork = t.canEditOwnWorklog = t.canDeleteOwnWorklog = !1, "TimeEntry" == t.pivotTableType && (t.hideTotalColumn = !0, delete t.group, t.user = h.key)) : t.canLogWork = t.canEditOwnWorklog = t.canDeleteOwnWorklog = !1, "PieChart" == t.pivotTableType && (t.hideDetails = !0)), ["TimeTracking", "IssueWorkedTimeByUser", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) >= 0 ? (t.user = y.user && !y.group ? decodeURIComponent(y.user) : void 0, t.user || (t.paramUserInfo = null), t.group = y.group) : y.allUsers || (t.group = y.group);
        var H = t.hostBaseUrl ? t.hostBaseUrl.match(/https?:\/\/(.+?)[\.|:]/)[1] : "", B = "timeentry" + H + t.user;
        t.changeWeek = function (e) {
            var i = t.isMonthView && !t.isDayView, n = TimesheetUtils.changeDate(t.startDate.value, e, "Timesheet" != t.pivotTableType, i, t.reportingDay);
            if (null != n && (y.startDate = n), y.endDate) {
                var r = TimesheetUtils.changeDate(t.endDate.value, e, !0, i, t.reportingDay);
                null != r && (y.endDate = r)
            }
            L(y)
        };
        var U = function (e, i) {
            return !moment().isBetween(TimesheetUtils.addWeeks(t.startDate.value, t.numOfWeeks - 1), TimesheetUtils.addDays(t.endDate.value, 1)) && e.getTime() > i.getTime()
        };
        t.showPrevToday = t.startDate.value && t.endDate.value && t.isDayView ? TimesheetUtils.isAfterDate(t.startDate.value, new Date) : U(TimesheetUtils.addWeeks(t.startDate.value, t.numOfWeeks - 1), new Date), t.showNextToday = t.startDate.value && t.endDate.value && t.isDayView ? TimesheetUtils.isAfterDate(new Date, TimesheetUtils.addDays(t.endDate.value, 1)) : U(new Date, TimesheetUtils.addDays(t.endDate.value, 1)), t.moveToday = function () {
            delete y.startDate, delete y.endDate, L(y)
        }, t.toggleMonthView = function () {
            if (t.isMonthView) delete y.view, delete y.startDate, delete y.endDate, y.sum = "day"; else {
                if (y.startDate || y.endDate) {
                    var e = TimesheetUtils.getFirstDayOfTheMonth(t.startDate.value || t.endDate.value), i = TimesheetUtils.getLastDayOfTheMonth(t.startDate.value || t.endDate.value);
                    y.startDate = TimesheetUtils.formatDateForSearch(e), y.endDate = TimesheetUtils.formatDateForSearch(i)
                }
                y.view = "month", y.sum = "week"
            }
            L(y)
        }, t.toggleShowDetails = function () {
            t.compressed ? y.showDetails = !0 : y.showDetails = !1, L(y, !0), t.compressed = !t.compressed
        }, t.groupByChanged = function () {
            t.groupByOptions.selected ? y.groupByField = t.groupByOptions.selected : delete y.groupByField, L(y)
        }, t.categorizeByChanged = function () {
            t.categorizeByOptions.selected ? y.categorizeByField = t.categorizeByOptions.selected : delete y.categorizeByField, L(y)
        }, t.moreFieldsChanged = function () {
            t.moreFieldsOptions.selected ? y.moreFields = t.moreFieldsOptions.selected : delete y.moreFields, L(y)
        }, t.filterByChanged = function (e) {
            null != e && "" != e ? (y.filterOrProjectId = e.split(","), delete y._allProjects, delete y.jql) : (delete y.filterOrProjectId, y._allProjects = !0), L(y)
        }, t.pivotTableTypeChanged = function () {
            t.pivotTableTypeOptions.selected ? (y.pivotTableType = t.pivotTableTypeOptions.selected, delete y.loaded) : delete y.pivotTableType, L(y)
        }, t.groupChange = function (e) {
            null != e && "" != e ? (y.group = e.split(","), delete y.allUsers) : delete y.group, L(y)
        }, t.startChangeDate = function (e) {
            N("startDate", e)
        }, t.endChangeDate = function (e) {
            N("endDate", e)
        };
        var N = function (e, t) {
            null != t && "" != t ? y[e] = t : delete y[e], L(y)
        };
        t.reportingDayChanged = function () {
            null == t.reportingDayOptions.selected ? delete y.reportingDay : y.reportingDay = t.reportingDayOptions.selected, t.loading || (y.loaded = t.loaded), L(y)
        }, t.toggleShowWeekends = function () {
            0 == y.showWeekends || "false" == y.showWeekends ? delete y.showWeekends : y.showWeekends = !1, t.loading || (y.loaded = t.loaded), L(y)
        }, t.userChange = function (e) {
            e ? (y.user = encodeURIComponent(e), delete y.allUsers) : (delete y.user, y.group && 0 != y.group.length || (y.allUsers = !0)), L(y)
        }, t.allUsersChange = function (e) {
            e ? y.allUsers = !0 : delete y.allUsers, L(y)
        }, t.sumSubTasksChange = function (e) {
            e ? y.sumSubTasks = !0 : delete y.sumSubTasks, L(y)
        }, t.includeEmptyChange = function (e) {
            e ? y.includeEmpty = !0 : delete y.includeEmpty, L(y)
        }, t.instantViewChange = function (e) {
            e ? y.instantView = !0 : delete y.instantView, y.loaded = !e, L(y)
        }, t.setStartAt = function (e) {
            e ? y.startAt = e : delete y.startAt, t.loading || (y.loaded = t.loaded), L(y)
        }, t.refresh = function () {
            c.resetState(), m.resetState(), v.resetState(), o.loaded || !t.loaded ? s.reload() : (t.loading || (y.loaded = t.loaded), l.search(y))
        }, t.removeMenuOption = function (e, i) {
            var n = y[e];
            if (angular.isArray(n) && n.length > 1) {
                if ("filterOrProjectId" == e) {
                    var r = t.filterByOptions.findOption(i, "isLabel");
                    null != r && (i = r.id)
                }
                n.splice(n.indexOf(i), 1)
            } else "user" != e || t.user != h.key || y.group && 0 != y.group.length || "Timesheet" != t.pivotTableType ? "filterOrProjectId" == e && (y._allProjects = !0) : y.allUsers = !0, delete y[e];
            L(y)
        }, t.getSelectedOptionLabels = function () {
            for (var e = [], i = Object.keys(y), r = function (i, r) {
                var a = "param." + i;
                if ("filterOrProjectId" == i) {
                    var s = t.filterByOptions.findOption(r);
                    null != s && (r = s.label, 0 == s.id.indexOf("project_") && (a += ".project"), 0 == s.id.indexOf("filter_") && (a += ".filter"))
                } else if ("groupByField" == i) {
                    var s = t.groupByOptions.findOption(r);
                    null != s && (r = s.label)
                } else if ("categorizeByField" == i) {
                    var s = t.categorizeByOptions.findOption(r);
                    null != s && (r = s.label)
                } else if ("moreFields" == i) {
                    var s = t.moreFieldsOptions.findOption(r);
                    null != s && (r = s.label)
                } else "user" == i ? r = t.paramUserInfo.displayName : "startDate" == i || "endDate" == i ? r = moment(r).format("YYYY-MM-DD") : "reportingDay" == i ? r = -1 == r ? n.getLocalizedString("Today") : moment.localeData().weekdays(moment().day(parseInt(r))) : "jql" == i && (r = decodeURIComponent(TimesheetUtils.replaceAll(r, "+", " ")));
                e.push({label: a, labelParam: r, key: i})
            }, a = 0; a < i.length; a++) {
                var s = i[a];
                if (-1 != ["user", "allUsers", "startDate", "endDate", "groupByField", "categorizeByField", "moreFields", "filterOrProjectId", "group", "reportingDay", "jql"].indexOf(s) && (("endDate" != s || "TimeEntry" != t.pivotTableType) && !("allUsers" == s && ["Timesheet", "PieChart"].indexOf(t.pivotTableType) < 0) && ("user" != s || t.paramUserInfo) && ("moreFields" != s || "PieChart" != t.pivotTableType) && ("reportingDay" != s || "Timesheet" == t.pivotTableType) && !(["TimeTracking", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) >= 0 && "groupByField" == s && ["workeduser", "workeddate", "workcreated"].indexOf(y[s]) >= 0) && !((y.group || y.allUsers) && "user" == s || y.allUsers && "group" == s) && null != y[s] && (!(["group", "groupByField", "categorizeByField", "allUsers"].indexOf(s) >= 0) || y[s]) && ("TimeEntry" != t.pivotTableType || -1 == ["group", "allUsers", "groupByField"].indexOf(s)))) {
                    var o = y[s];
                    if (angular.isArray(o)) for (var l = 0; l < o.length; l++) r(s, o[l]); else null != o && "" != o ? r(s, o) : "jql" == s && r(s, o)
                }
            }
            return y.user || y.allUsers || y.group && 0 != y.group.length || -1 == ["Timesheet", "PieChart"].indexOf(t.pivotTableType) || r("user", h.key), y.filterOrProjectId || !t.projectKey || y._allProjects || r("filterOrProjectId", "project_" + t.projectKey), "TimeTracking" != t.pivotTableType && (void 0 === y.startDate ? r("startDate", t.startDate.value) : null === y.startDate && r("startDate", moment("1970-01-01")), "TimeEntry" != t.pivotTableType && (void 0 === y.endDate ? r("endDate", t.endDate.value) : null === y.endDate && r("endDate", moment("2099-12-31")))), e
        };
        t.licenseStatus = function () {
            var e = "";
            return "expired" == t.license ? e = '<span class="red">LICENSE EXPIRED</span>' : "none" == t.license ? e = '<span class="red">NO LICENSE</span>' : "active" != t.license && (e = '<span class="red">LICENSE ERROR</span>'), {
                isActive: "active" == t.license,
                message: u.trustAsHtml(e)
            }
        }();
        var R = ["Timesheet", "PieChart", "TimeEntry"].indexOf(t.pivotTableType) >= 0 || y.user, K = {
            pivotTableType: t.pivotTableType,
            groupByField: y.groupByField,
            categorizeByField: y.categorizeByField,
            moreFields: TimesheetUtils.wrapIntoArray(y.moreFields),
            monthView: t.isMonthView,
            startDate: t.startDate.value,
            endDate: t.endDate.value,
            filterOrProjectId: t.filterOrProjectId,
            groups: !t.group || angular.isArray(t.group) ? t.group : [t.group],
            sumSubTasks: t.sumSubTasks.enabled,
            sum: t.sum,
            reportingDay: t.reportingDay,
            showWeekends: t.showWeekends.enabled,
            jql: y.jql,
            issueKey: t.issueKey,
            issueId: t.issueId,
            isGadget: t.isGadget,
            includeEmpty: t.includeEmpty.enabled && (t.filterOrProjectId || y.jql),
            _fields: t._fields,
            jqlQuery: t.jqlQuery
        };
        R && (K.user = t.user);
        var G = ["project", "issuetype", "key", "summary", "priority"], q = function (e, t) {
            -1 === G.indexOf(t.id) && -1 === e.indexOf(t) && e.push(t)
        };
        t.excelView = function (e) {
            var i = function (e) {
                for (var i = 0; i < t.allFields.length; i++) if (t.allFields[i].id == e) return t.allFields[i];
                return {id: e, name: e}
            }, n = [];
            if (angular.isArray(y.moreFields)) for (var r = 0; r < y.moreFields.length; r++) {
                var a = y.moreFields[r], s = i(a);
                q(n, s)
            } else if (y.moreFields) {
                var s = i(y.moreFields);
                q(n, s)
            }
            if (y.groupByField) {
                var s = i(y.groupByField);
                q(n, s)
            }
            if (y.categorizeByField) {
                var s = i(y.categorizeByField);
                q(n, s)
            }
            var o = {
                hostBaseUrl: t.hostBaseUrl,
                pivotTableType: t.pivotTableType,
                moreFields: n,
                monthView: t.isMonthView,
                startDate: t.startDate.value,
                endDate: t.endDate.value,
                worklogAuthors: t.group && t.group.length > 0 && !K.configOptions.storeWorklog ? c.worklogAuthors : null,
                sumSubTasks: t.sumSubTasks.enabled,
                maxFractionDigits: t.jiraConfig.maxFractionDigits,
                configOptions: K.configOptions,
                isGadget: t.isGadget,
                excelViewClass: e ? CsvView : ExcelView
            };
            R && (o.user = t.user);
            var l = function (e) {
                TimesheetUtils.sortByProperty(c.allIssues, "key", !1, PivotKey.Issue.comparator), new e.excelViewClass(c.allIssues).download(e)
            };
            t.loaded ? l(o) : (t.loading++, c.getPivotTable(h, K).then(function (e) {
                t.loading--, l(o)
            }))
        }, c.isAdministrator().then(function (e) {
            t.isAdmin = e
        }), t.loading && t.loaded && c.cancel(), t.loading++, delete t.pivotTable;
        var V = a.when(t.user == h.key ? h : c.getUserInfo(t.user)).then(function (e) {
            return t.paramUserInfo = e, e
        }), J = c.getFields();
        t.loaded = t.isGadget || t.instantView || y.loaded || ["TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0 || t.user == h.key && !y.startDate && !y.endDate, c.restrictedByAuditorsGroups(h).then(function (i) {
            var n = ("Timesheet" == t.pivotTableType || "PieChart" == t.pivotTableType) && (y.allUsers || K.groups || t.user && t.user != h.key);
            n = n || "IssueWorkedTimeByUser" == t.pivotTableType, n && i ? (t.loading--, t.restrictionError = {msgKey: "error.restriction.auditorsGroups"}) : e.requireLicense && n && !t.licenseStatus.isActive ? (t.loading--, t.restrictionError = {msgKey: "error.restriction.licenseError"}) : (t.execute = function () {
                delete t.supportDataLoaded, "PieChart" == t.pivotTableType && (t.pivotTable = {}), t.loading++, t.loaded = !0, t.$loading = c.getPivotTable(h, K).then(function (e) {
                    if (t.jqlQuery = K.jqlQuery, t._fields = K._fields, t.loading--, ["TimeEntry", "IssueTime"].indexOf(t.pivotTableType) >= 0 && t.isStartDateToday) {
                        var i = x();
                        angular.forEach(i, function (e) {
                            t.issueKey && t.issueKey != e.issueKey || c.findIssueByKey(e.issueKey, K).then(function (i) {
                                var n = t.createEntry(i, e);
                                !n.worklog.stopped && n.worklog.started && (t.workEntry = n, O(n.worklog))
                            })
                        }), C()
                    }
                    t.pivotTable = e, t.rowKeySize = TimesheetUtils.colspan(e), e.sortedColumns();
                    var n = e.sortedRows(), a = n.length, s = y.startAt || 0;
                    t.issuesCount = {
                        total: a,
                        startAt: s < a ? s : 0,
                        maxResults: 50
                    }, t.pages = [], t.issuesCount.end = Math.min(t.issuesCount.startAt + t.issuesCount.maxResults, t.issuesCount.total);
                    for (var o = Math.ceil(t.issuesCount.total / t.issuesCount.maxResults), l = 0; l < o; l++) t.pages.push(l);
                    if (t.canLogWork || t.canEditOwnWorklog || t.canDeleteOwnWorklog) for (var l = t.issuesCount.startAt; l < Math.min(t.issuesCount.startAt + 50, a); l++) {
                        var u = n[l].rowKey.keyValue;
                        c.havePermissions(["WORK_ON_ISSUES", "EDIT_OWN_WORKLOGS", "DELETE_OWN_WORKLOGS"], "issueKey=" + u).then(function (e) {
                            return function (i) {
                                i[0] || (t.editWorklogPopup.cannotLogWorkIssue[e] = !0, t.cannotLogWorkIssue[e] = !0), i[1] || (t.editWorklogPopup.cannotEditOwnWorklogIssue[e] = !0, t.cannotEditOwnWorklogIssue[e] = !0), i[2] || (t.editWorklogPopup.cannotDeleteOwnWorklogIssue[e] = !0, t.cannotDeleteOwnWorklogIssue[e] = !0)
                            }
                        }(u))
                    }
                    t.epicLinkField = c.epicLinkField, r(function () {
                        AP.resize()
                    }), t.$broadcast("loadingReset"), c.expireWorklogCache()
                }, function (e) {
                    --t.loading || (t.$broadcast("loadingReset"), t.loaded = !1)
                }, function (e) {
                    t.$broadcast("loadingProgress", e)
                })
            }, a.all([V, m.getConfiguration(), J, de, t.$loading]).then(function (e) {
                var i = e[0], n = e[1], r = e[2], a = e[3];
                if (a && !a.timeTrackingEnabled) throw new Error("Time Tracking is OFF");
                if (n.maxFractionDigits && (t.jiraConfig.maxFractionDigits = n.maxFractionDigits.val), R && (K.username = i ? i.name : t.user), K.configOptions = {}, null != n.compositionIssueLink.val && (K.configOptions.compositionIssueLink = n.compositionIssueLink.val), null != n.parentIssueField.val && (K.configOptions.parentIssueField = n.parentIssueField.val), K.configOptions.weekendType = n.weekendType.val, K.configOptions.preserveStartedTime = n.preserveStartedTime.val, t.workingTimeInStatus = K.configOptions.workingTimeInStatus = n.workingTimeInStatus.val, K.configOptions.startedTimeInStatus = n.startedTimeInStatus.val, K.configOptions.storeWorklog = n.storeWorklog && n.storeWorklog.val, ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(K.pivotTableType) >= 0 && ["workeduser", "workeddate", "workcreated"].indexOf(K.groupByField) >= 0 && (K.groupByField = ""), t.workDescriptionRequired = n.workDescriptionRequired.val, K.groupByField) for (var s = 0; s < r.length; s++) if (r[s].id == K.groupByField) {
                    K.groupByFieldObject = r[s];
                    break
                }
                if (K.categorizeByField) for (var s = 0; s < r.length; s++) if (r[s].id == K.groupByField) {
                    K.categorizeByFieldObject = r[s];
                    break
                }
                return null != K.groups && "" != K.groups && (K.username = ""), t.jiraConfig.timeFormat = n.durationType.val || (n.prettyDuration.val ? "pretty" : "h"), t.configOptions = K.configOptions, t.loading--, "PieChart" == t.pivotTableType && (t.pivotTable = null), c.clearWorklogCache(n)
            }).then(!t.reportDialog && t.loaded ? t.execute : null))
        });
        var Z = {id: "workeduser", name: "Worked User", custom: !0, schema: {}, clauseNames: []}, Q = {id: "workeddate", name: "Worked Date", custom: !0, schema: {}, clauseNames: []},
            X = {id: "workcreated", name: "Work Created", custom: !0, schema: {}, clauseNames: []}, ee = {id: "commentfirstword", name: "Comment Firstword", custom: !0, schema: {}, clauseNames: []},
            te = {id: "issue", name: "Issue itself", custom: !0, schema: {}, clauseNames: []}, ie = {id: "parent", name: "Parent Issue", custom: !0, schema: {}, clauseNames: []},
            ne = {id: "worklabel", name: "Work Label/s", custom: !0, schema: {}, clauseNames: []}, re = {id: "projectcategory", name: "Project Category", custom: !0, schema: {}, clauseNames: []};
        J.then(function (e) {
            t.groupByOptions = new TimesheetSelectOptions(TimesheetGeneralOption, y.groupByField), t.moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, TimesheetUtils.wrapIntoArray(y.moreFields));
            for (var i = TimesheetUtils.filterFields(e), n = 0; n < i.length; n++) {
                var r = i[n];
                t.groupByOptions.addOption(r.name, r.id), t.moreFieldsOptions.addOption(r.name, r.id)
            }
            t.moreFieldsOptions.addOption(re.name, re.id), t.moreFieldsOptions.sort(), ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) < 0 && (t.groupByOptions.addOption(Z.name, Z.id), t.groupByOptions.addOption(Q.name, Q.id), t.groupByOptions.addOption(X.name, X.id), t.groupByOptions.addOption(ee.name, ee.id)), t.groupByOptions.addOption(te.name, te.id), t.groupByOptions.addOption(ie.name, ie.id), t.groupByOptions.addOption(ne.name, ne.id), t.groupByOptions.addOption(re.name, re.id), t.groupByOptions.sort(), t.groupByOptions.addOption("No grouping", "", !0), t.categorizeByOptions = angular.copy(t.groupByOptions), t.categorizeByOptions.selected = y.categorizeByField || "", e.push(Z, Q, X, ee, ie, ne, re), t.allFields = e
        });
        var ae = a.all([c.getFilters(), m.getProjects()]).then(function (e) {
            var i = e[0], n = e[1];
            t.filterByOptions = new TimesheetSelectOptions(TimesheetGeneralOption, y.filterOrProjectId, null, {filter: "Filter", project: "Project"});
            for (var r = 0; r < i.length; r++) t.filterByOptions.addOption(i[r].name, "filter_" + i[r].id);
            for (var r = 0; r < n.length; r++) t.filterByOptions.addOption(n[r].name + " (" + n[r].key + ")", "project_" + n[r].key)
        });
        a.all([J, ae, V]).then(function () {
            var e = t.getSelectedOptionLabels();
            t.gadgetSummary = new GadgetSummary(e, t.paramUserInfo, t.pivotTableType).getSummaryItems(), t.selectedOptionLabels = e
        }), t.pivotTableTypeOptions = new TimesheetSelectOptions(TimesheetGeneralOption, t.pivotTableType);
        for (var se = Object.keys(PivotTableType), oe = 0; oe < se.length; oe++) t.pivotTableTypeOptions.addOption(n.getLocalizedString(se[oe]), se[oe]);
        t.reportingDayOptions = new TimesheetSelectOptions(TimesheetGeneralOption, y.reportingDay), null != y.reportingDay && t.reportingDayOptions.addOption("", null), t.reportingDayOptions.addOption(n.getLocalizedString("Today"), -1), t.everyWeekOptions = new TimesheetSelectOptions(TimesheetGeneralOption, y.everyWeekOn || t.reportingDay);
        for (var le = moment(), oe = 0; oe < 7; oe++) {
            var ue = (moment.localeData().firstDayOfWeek() + oe) % 7;
            le.day(ue), t.reportingDayOptions.addOption(moment.localeData().weekdays(le), ue), t.everyWeekOptions.addOption(moment.localeData().weekdays(le), ue)
        }
        var D = /^(\d\d?):(\d\d?)(am|pm)$/.exec(y.everyWeekAt);
        D ? (t.everyWeekOptions.hour = parseInt(D[1]), t.everyWeekOptions.minute = parseInt(D[2]), t.everyWeekOptions.period = D[3]) : (t.everyWeekOptions.hour = 6, t.everyWeekOptions.minute = 0, t.everyWeekOptions.period = "am"), t.jiraConfig = {
            workingHoursPerDay: 8,
            workingDaysPerWeek: 5,
            defaultUnit: "minute",
            timeFormat: ""
        };
        var de = c.getJiraConfiguration();
        de.then(function (e) {
            if (e) {
                if (!e.timeTrackingConfiguration) return void AP.flag.create({
                    title: "Time Tracking is currently OFF",
                    body: "Please enable Time Tracking in Administration - Issues - Time Tracking",
                    type: "error"
                });
                e.timeTrackingConfiguration.workingHoursPerDay && (t.jiraConfig.workingHoursPerDay = e.timeTrackingConfiguration.workingHoursPerDay), e.timeTrackingConfiguration.workingDaysPerWeek && (t.jiraConfig.workingDaysPerWeek = e.timeTrackingConfiguration.workingDaysPerWeek), e.timeTrackingConfiguration.defaultUnit && (t.jiraConfig.defaultUnit = e.timeTrackingConfiguration.defaultUnit)
            }
        });
        var ce = t.isMonthView && t.numOfWeeks > 1 || t.numOfWeeks > 4 || y.startDate && y.endDate && moment(y.startDate).month() != moment(y.endDate).month();
        t.weekSumChange = function () {
            y.sum = "week" == t.sum ? ce ? "month" : "day" : "month" == t.sum ? "day" : "week", t.loading || (y.loaded = t.loaded), L(y)
        }, function () {
            var e = function (e, i) {
                t.sumTitle = i, t.sumClass = e
            };
            "month" == t.sum ? e("day", "Show daily worked hours") : "week" == t.sum ? ce ? e("month", "Sum worked hours by month") : e("day", "Show daily worked hours") : e("week", "Sum worked hours by week")
        }(), t.viewChanged = function () {
            var e = t.viewOptions.selected, i = e.split("_");
            "view" == i[0] ? (y = {viewId: i[1]}, v.updateCurrentView(y.viewId), angular.extend(y, t.currentView), t.showDeleteButton = !0) : y.viewId ? (y = {pivotTableType: i[1]}, angular.copy({}, t.currentView), t.showDeleteButton = !1) : (y.pivotTableType = i[1], delete y.everyWeekOn, delete y.everyWeekAt), L(y), t.showSaveButton = !1
        }, t.saveView = function () {
            angular.copy(y, t.currentView), delete t.currentView._;
            var e;
            if (t.currentView.viewId) {
                e = v.updateView(t.currentView, h), t.showSaveButton = !1;
                var i = t.viewOptions.findOption(t.viewOptions.selected);
                i && i.label != t.currentView.name && (i.label = t.currentView.name, t.$broadcast("viewUpdated", t.viewOptions.selected))
            } else e = v.addView(t.currentView, h).then(function (e) {
                var t = l.search();
                t.viewId = e.viewId, l.search(t)
            });
            return e
        }, t.deleteView = function () {
            v.removeView(t.currentView, h).then(function () {
                var e = l.search();
                delete e.viewId, l.search(e)
            })
        }, t.viewNameChanged = function () {
            y.name = t.currentView.name, t.showSaveButton = !0, t.loading || (y.loaded = t.loaded), L(y)
        }, t.downloadSupportData = k.enabled ? function () {
            t.problemDescriptionPopup = {
                init: function () {
                    this.problemDescription = ""
                }, confirmSend: function (e) {
                    this.loading = !0;
                    var i = h.displayName + " <" + h.emailAddress + ">";
                    k.sendEmail(!0, i, "Time Reports Support Data", t.problemDescriptionPopup.problemDescription).then(function (i) {
                        t.$apply(function () {
                            t.supportDataLoaded = !0, delete this.loading
                        }), e()
                    })
                }
            }, t.problemDescriptionPopup.init()
        } : null, t.subscribePopup = {
            everyWeekOptions: t.everyWeekOptions, init: function () {
                this.currentView = angular.copy(t.currentView), this.loading = !1
            }, subscribe: function (e) {
                this.loading = !0, y.everyWeekOn = t.everyWeekOptions.selected, y.everyWeekAt = t.everyWeekOptions.hour + ":" + t.everyWeekOptions.minute + t.everyWeekOptions.period, y.name || (y.name = t.pivotTableType + " On " + t.everyWeekOptions.findOption(y.everyWeekOn).label);
                var i = {jobId: y.jobId, schedule: "weekly", on: y.everyWeekOn, at: y.everyWeekAt, offset: moment().utcOffset()};
                T.saveJob(i, h).then(function (i) {
                    y.jobId = i.jobId, t.saveView().then(e)
                }), L(y, "noinit")
            }, unsubscribe: function (e) {
                this.loading = !0, T.removeJob(y.jobId, h).then(function (i) {
                    delete y.jobId, delete y.everyWeekOn, delete y.everyWeekAt, t.saveView().then(e)
                })
            }
        }, t.errors = w.validate(t);
        var me = e.$onErrorPopup;
        me && (me.data("options", K), me.data("timesheetParams", g)), t.contactSupport = function () {
            var e = {options: K, timesheetParams: g};
            AP.dialog.create({key: "bitbucket", width: "720px", height: "400px", chrome: !0, header: "Contact Support", submitText: "Submit", customData: e})
        }
    }

    var M = t.dashboardId ? "-" + t.dashboardId + "-" + t.dashboardItemId : "", D = "timereports-location-search" + M, L = function (e, i) {
        if (k.setEnabled(!1), i || b(e), t.currentView && t.currentView.name && (t.showSaveButton = !0), delete e._, delete e.loaded, angular.isFunction(AP.cookie.save) && AP.cookie.save(D, JSON.stringify(e)), angular.isFunction(AP.history.pushState)) {
            var n = angular.copy(e);
            AP.history.pushState($.param(TimesheetUtils.normalizeObject(n, !0)))
        }
        e._ = Date.now()
    }, A = a.defer();
    0 != Object.keys(g).length || t.issueKey ? 0 == Object.keys(o).length ? A.resolve(g) : A.resolve(o) : angular.isFunction(AP.cookie.read) ? AP.cookie.read(D, function (e) {
        k.cookie(e);
        var t = TimesheetUtils.getJson(e || "");
        (angular.isDefined(f) || _) && (delete t.filterOrProjectId, delete t.jql), A.resolve(t)
    }) : A.resolve(g), A.promise.then(function (e) {
        e.showDetails || (e.showDetails = !1);
        var i;
        t.isGadget && t.dashboardId && t.dashboardItemId ? i = c.getGadgetConfiguration(t.dashboardId, t.dashboardItemId).then(function (t) {
            var i = angular.extend({
                title: null,
                numOfWeeks: null,
                hideWeekends: null,
                reportingDay: null,
                filterOrProjectId: null,
                user: null,
                allUsers: null,
                group: null,
                groupByField: null,
                categorizeByField: null,
                moreFields: null,
                sumSubTasks: null,
                includeEmpty: null
            }, t);
            return i.showWeekends = !i.hideWeekends, angular.extend(e, i)
        }) : (t.currentView = v.data.currentView, i = v.getViews(e.viewId, h).then(function () {
            var i = angular.isDefined(v.data.currentView.viewId);
            t.showDeleteButton = i;
            var r = v.data.allViews.length > 0 ? {view: "Saved Report", pivotTableType: "Default Report"} : null;
            t.viewOptions = new TimesheetSelectOptions(TimesheetGeneralOption, null, null, r), t.viewOptions.selected = i ? "view_" + v.data.currentView.viewId : "pivotTableType_" + (e.pivotTableType || "Timesheet");
            for (var a = 0; a < v.data.allViews.length; a++) {
                var s = v.data.allViews[a];
                t.viewOptions.addOption(s.name, "view_" + s.viewId)
            }
            for (var o = Object.keys(PivotTableType), a = 0; a < o.length; a++) {
                var l = o[a];
                t.viewOptions.addOption(n.getLocalizedString(l), "pivotTableType_" + l)
            }
            if (i) {
                var u = angular.copy(t.currentView);
                delete e._, t.showSaveButton = !angular.equals(u, e);
                var d = angular.extend({
                    filterOrProjectId: null,
                    user: null,
                    allUsers: null,
                    group: null,
                    startDate: null,
                    endDate: null,
                    showWeekends: null,
                    reportingDay: null,
                    groupByField: null,
                    categorizeByField: null,
                    moreFields: null,
                    sumSubTasks: null,
                    includeEmpty: null,
                    _allProjects: null,
                    everyWeekOn: null,
                    everyWeekAt: null,
                    jobId: null
                }, e);
                return TimesheetUtils.normalizeObject(angular.extend(u, d))
            }
            return delete e.viewId, e
        })), i.then(b)
    }), i.onGadgetConfigSave |= i.$on("gadgetConfigSave", function () {
        t.showGadgetConfiguration = !1, t.refresh()
    }), i.onGadgetConfigCancel |= i.$on("gadgetConfigCancel", function () {
        t.showGadgetConfiguration = !1
    }), t.loading = 0
}]), app.controller("WelcomeController", ["$scope", "$route", "$routeParams", "$location", "$q", "$sce", "$timeout", "$window", "loggedInUser", function (e, t, i, n, r, a, s, o, l) {
    var u = window.RA || window.AP;
    !function () {
        u.resize(), e.contentTemplate = function () {
            return e.templates.welcome
        }
    }()
}]), app.controller("WorklogController", ["$scope", "$route", "$routeParams", "$location", "$sce", "$timeout", "loggedInUser", "pivottableService", "applicationLoggingService", "configurationService", function (e, t, i, n, r, a, s, o, l, u) {
    var d = window.RA || window.AP;
    !function () {
        d.resize();
        var t = function () {
            var t = moment();
            return null != e.worklogDatetime.date ? (t = moment(e.worklogDatetime.date).startOf("day"), null != e.worklogDatetime.time && (e.worklogDatetime.time.timePartsToMoment(), t.add(e.worklogDatetime.time.momentTime))) : null != e.worklog.started && (t = moment(e.worklog.started)), t.toDate()
        }, i = function (e, t, i) {
            var n = moment(TimesheetUtils.convertDate(t, i));
            e.date = n.toDate(), e.time.momentTime = n, e.time.momentToTimeParts()
        }, n = function () {
            e.$apply(function () {
                e.loading = !0
            }), o.deleteWorklog(e.worklog).then(function (t) {
                d.dialog.close({action: "deleted", worklogOld: e.worklog, issueKey: e.worklog.issueKey})
            })
        }, r = function () {
            e.$apply(function () {
                e.loading = !0
            });
            var i = angular.copy(e.worklog);
            e.worklog.started = TimesheetUtils.formatDate(t()), o.updateWorklog(e.worklog).then(function (t) {
                d.dialog.close({action: "updated", worklogOld: i, worklog: t, issueKey: e.worklog.issueKey})
            })
        }, a = function () {
            e.$apply(function () {
                e.loading = !0
            }), e.worklog.date = t(), o.createWorklog(e.worklog).then(function (t) {
                d.dialog.close({action: "added", worklog: t, issueKey: e.worklog.issueKey})
            })
        };
        e.contentTemplate = function () {
            return e.templates.dialog
        }, e.worklog = {estimateType: "auto", estimateValue: ""}, e.$watch("worklog.estimateType", function (t) {
            e.worklog.estimateValue = "", e.worklog.adjustmentAmount = ""
        }), u.getConfiguration().then(function (t) {
            e.workLabelsList = t.workLabels.val, e.workDescriptionRequired = t.workDescriptionRequired.val, e.visibilityGroup = t.worklogVisibilityGroup.val, e.visibilityRole = t.worklogVisibilityRole.val, o.clearWorklogCache(t)
        }), e.worklogDatetime = {
            date: "", time: {
                momentTime: null, timeParts: [], momentToTimeParts: function () {
                    if (null != this.momentTime) {
                        var e = /^(.*?)(\d+):(\d+)(.*?)$/, t = e.exec(this.momentTime.format("LT"));
                        t || (t = e.exec(this.momentTime.locale("en").format("LT")));
                        var i = [], n = "" == t[1] && "" == t[4];
                        "" != t[1] && i.push({value: t[1], step: 12}), i.push({value: t[2], step: 1, min: n ? 0 : 1, max: n ? 23 : 12, suffix: ":"}), i.push({
                            value: t[3],
                            step: 5,
                            min: 0,
                            max: 59
                        }), "" != t[4] && i.push({value: t[4], step: 12}), this.timeParts = i
                    }
                }, timePartsToMoment: function () {
                    if (null != this.timeParts) {
                        for (var e = "", t = 0; t < this.timeParts.length; t++) e += this.timeParts[t].value, null != this.timeParts[t].suffix && (e += this.timeParts[t].suffix);
                        this.momentTime = moment(e, "LT")
                    }
                }
            }
        }, e.groups = s.groups, d.dialog.getCustomData(function (t) {
            if ("delete" != e.dialogType && e.$watch("worklog.issueKey", function (t, i) {
                    if (t) {
                        var n = t.split("-")[0];
                        o.isProjectAdmin(n).then(function (t) {
                            t ? u.getRoles(n).then(function (t) {
                                delete t["atlassian-addons-project-access"], e.roles = t
                            }) : e.roles = null
                        })
                    }
                }), null != t.worklogId) o.getWorklog(t.issueKey, t.worklogId).then(function (n) {
                n.issueKey = t.issueKey, n.visibilityGroup = n.visibility && "group" == n.visibility.type ? n.visibility.value : "", n.visibilityRole = n.visibility && "role" == n.visibility.type ? n.visibility.value : "", angular.extend(e.worklog, n);
                var r = n.author ? n.author.timeZone : null;
                i(e.worklogDatetime, n.started, r)
            }); else {
                e.$watch("visibilityGroup", function (t, i) {
                    if (t) for (var n = t.split(","), r = 0; r < e.groups.length; r++) {
                        var a = e.groups[r].name;
                        if (n.indexOf(a) >= 0) {
                            e.worklog.visibilityGroup = a;
                            break
                        }
                    }
                }), e.$watch("visibilityRole", function (t, i) {
                    if (t) {
                        var n = t.split(",");
                        e.$watch("roles", function (t) {
                            if (t) {
                                for (var i in t) if (n.indexOf(i) >= 0) {
                                    e.worklog.visibilityRole = i;
                                    break
                                }
                            } else e.worklog.visibilityRole = null
                        })
                    }
                }), angular.extend(e.worklog, {timeSpent: t.timeSpent, comment: t.comment, issueKey: t.issueKey});
                var n = TimesheetUtils.formatDate(null != t.date ? t.date : new Date);
                i(e.worklogDatetime, n, null), e.$apply()
            }
            if (t.initialWorkLabels) {
                var r = Object.keys(t.initialWorkLabels);
                e.workLabelsList = e.workLabelsList ? TimesheetUtils.uniqueArray(e.workLabelsList.concat(r)) : r
            }
            e.jqlQuery = t.jqlQuery
        });
        var l = function (e) {
            switch (e) {
                case"delete":
                    return n;
                case"update":
                    return r;
                case"create":
                case"add":
                    return a;
                default:
                    throw new Error("Unsupported dialogType: " + e)
            }
        }(e.dialogType);
        d.events.on("dialog.submit", l), d.dialog.disableCloseOnSubmit()
    }()
}]);
var DrawHelper = {
    composeTooltip: function (e, t, i, n) {
        return '<table cellspacing="2px" cellpadding="2px"><tr>' + this.prepareHtmlForIcons(i, e, "<br/>") + "<td>" + this.prepareLinkForItem(i, e, n) + "<br/>" + Math.round(t.percent) + "%</td></tr></table>"
    }, composeLegendTooltip: function (e, t, i, n, r) {
        var a = this.getTooltipHint(this.getDataItemByLabel(i, e));
        return "<table><tr>" + this.prepareHtmlForIcons(i, e, "") + "<td>" + this.prepareLinkForItem(i, e) + (a ? "&nbsp;" + this.truncate(a, r) : "") + "&nbsp;(" + this.getFormattedTime(t.data[0][1], n) + ")</td></tr></table>"
    }, prepareHtmlForIcons: function (e, t, i) {
        var n = this.getTooltipIcons(e, t), r = "";
        if (null != n && n.length > 0) {
            r += "<td style='width:" + ("" == i ? 16 * n.length : 16) + "px; white-space: nowrap'>";
            for (var a = 0; a < n.length; a++) 0 != a && (r += i), r += '<img src="' + n[a].url + '" title="' + this.escapeQuotes(n[a].title) + '" height="16"/>';
            r += "</td>"
        }
        return r
    }, truncate: function (e, t) {
        var i = t ? 20 : 45;
        return e.length > i ? '<span title="' + this.escapeQuotes(e) + '">' + this.escapeHtml(e.substring(0, i)) + "</span>" : this.escapeHtml(e)
    }, prepareLinkForItem: function (e, t, i) {
        var n = this.getDataItemByLabel(e, t), r = this.getTooltipUrl(n);
        if (r) {
            var a = this.getTooltipHint(n), s = this.getResolutionCss(n.link);
            return this.getMasterUrlHtml(n) + this.getLinkHtml(r, a, n.link.label, s)
        }
        return this.truncate(t, i)
    }, getTooltipIcons: function (e, t) {
        var i = this.getDataItemByLabel(e, t);
        return null != i ? i.icons : null
    }, getDataItemByLabel: function (e, t) {
        for (var i = 0; i < e.length; i++) if (e[i].label == t) return e[i];
        return null
    }, getTooltipUrl: function (e) {
        return null != e && null != e.link ? e.link.url : "#"
    }, getTooltipHint: function (e) {
        return null != e && e.link && null != e.link.hint ? e.link.hint : ""
    }, getLinkHtml: function (e, t, i, n) {
        return '<a title="' + this.escapeQuotes(t) + '" href="' + e + (n ? '" class="' + n : "") + '">' + this.escapeHtml(i) + "</a>"
    }, getMasterUrlHtml: function (e) {
        if (null != e) {
            var t = e.masterLink;
            if (null != t) return this.getLinkHtml(t.url, t.hint, t.label, "parentIssue2 " + this.getResolutionCss(t))
        }
        return ""
    }, getResolutionCss: function (e) {
        return null != e.resolution ? "fixed" : ""
    }, getFormattedTime: function (e, t, i) {
        switch (t.timeFormat) {
            case"pretty":
                return this.prettyDuration(e, t, i);
            case"d":
                return this.formatDecimal(e / (3600 * parseFloat(t.workingHoursPerDay)), t.maxFractionDigits) + "d";
            default:
                return this.formatDecimal(e / 3600, t.maxFractionDigits) + "h"
        }
    }, formatDecimal: function (e, t) {
        return parseFloat(e.toFixed(t || 2)).toLocaleString()
    }, isResolvedIssue: function (e) {
        return null != e && null != e.resolution
    }, prettyDuration: function (e, t, i) {
        var n = parseInt(e) || 0, r = Math.abs(n), a = Math.sign(n), s = 3600 * (i ? 24 : parseFloat(t.workingHoursPerDay)), o = (i ? 7 : parseFloat(t.workingDaysPerWeek)) * s, l = 4 * o, u = 12 * l,
            d = [];
        if (r >= u) {
            var c = Math.floor(r / u);
            d.push(a * c + "y"), r -= c * u, a *= a
        }
        if (r >= l) {
            var m = Math.floor(r / l);
            d.push(a * m + "m"), r -= m * l, a *= a
        }
        if (r >= o) {
            var h = Math.floor(r / o);
            d.push(a * h + "w"), r -= h * o, a *= a
        }
        if (r >= s) {
            var p = Math.floor(r / s);
            r -= p * s, d.push(a * p + "d"), a *= a
        }
        if (r >= 3600) {
            var f = Math.floor(r / 3600);
            d.push(a * f + "h"), r -= 3600 * f, a *= a
        }
        if (r >= 60 || 0 == d.length) {
            var _ = Math.floor(r / 60);
            d.push(a * _ + "m"), r -= 60 * _, a *= a
        }
        return d.join(" ")
    }, buildLabel: function (e, t) {
        if (-1 != e.indexOf(" 00:00:00 ") && (e = e.replace(" 00:00:00 ", "")), t.rowKey.project) {
            var i = t.rowKey.project;
            i.name && i.key && (e = e.replace(i.name, i.key))
        }
        return e
    }, escapeQuotes: function (e) {
        return e.replace(/"/g, '\\"')
    }, escapeHtml: function (e) {
        return "&nbsp;" == e ? e : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
    }
};
app.directive("issueField", ["$compile", "applicationLoggingService", function (e, t) {
    return {
        restrict: "E", scope: {field: "=", name: "=", issue: "=", jiraConfig: "="}, link: function (i, n, r) {
            var a, s, o = function (e) {
                return -1 != ["aggregatetimeoriginalestimate", "aggregatetimeestimate", "aggregatetimespent", "timeoriginalestimate", "timeestimate", "timespent", "originalestimateremaining"].indexOf(e)
            }, l = /com\.atlassian\.greenhopper\.service\.sprint\.Sprint@[\d\w]+\[(.+)?\]/, u = function (n) {
                if (angular.isObject(n) && n.hasOwnProperty("name")) return n.name;
                if (angular.isObject(n) && n.hasOwnProperty("value")) return n.value + (n.hasOwnProperty("child") ? ":" + u(n.child) : "");
                if (angular.isObject(n) && n.hasOwnProperty("key")) {
                    var r = i.$new();
                    return r.issueField = n, r.hostBaseUrl = i.$parent.hostBaseUrl, e('<issue-key issue="issueField" show-summary="' + ("issue" == i.name) + '"/>')(r)
                }
                if (angular.isString(n) && (a = n.match(l))) {
                    t.trace("Sprint field", a[1]);
                    for (var s = a[1].split(","), d = 0; d < s.length; d++) {
                        var c = s[d];
                        if (t.trace("Sprint field split", c), 0 == c.indexOf("name=")) return c.substr(5)
                    }
                    return "&nbsp;"
                }
                return o(i.name) ? DrawHelper.getFormattedTime(n, i.jiraConfig) : n
            };
            if (i.field) if (/\/rest\/api(\/\d+)\/user/.test(i.field.self)) {
                var d;
                if (i.$parent.isGadget) {
                    var c = angular.copy(i.$parent.reportParamsObject);
                    delete c.allUsers, delete c.group, delete c.groupByField, c.pivotTableType = "Timesheet", c.user = i.field.key, i.reportParams = $.param(c), d = '{{$parent.hostBaseUrl}}/plugins/servlet/ac/timereports/timereports#!{{reportParams}}" target="_parent'
                } else d = "#/?pivotTableType=Timesheet&user={{field.key}}&allUsers=&group=&groupByField=&_={{$id}}";
                s = e('<a ng-class="{inactive: !field.active, disabled: !field.key}" ng-href="' + d + '" ng-bind="field.displayName || field.name"></a>')(i)
            } else TimesheetUtils.isDate(i.field) ? (i.value = new Date(i.field), s = e("<span>{{value | date:'yyyy-MM-dd'}}</span>")(i)) : Array.isArray(i.field) ? (s = "", i.field.length > 0 && (i.field[0].inwardIssue || i.field[0].outwardIssue) ? i.field.forEach(function (e) {
                e.inwardIssue ? (n.append(e.type.inward + "&nbsp;"), n.append(u(e.inwardIssue))) : (n.append(e.type.outward + "&nbsp;"), n.append(u(e.outwardIssue))), n.append("<br/>")
            }) : i.field.forEach(function (e) {
                n.append(u(e)), n.append("<br/>")
            })) : s = u(i.field); else s = "projectcategory" == i.name && i.issue && i.issue.fields.project.projectCategory ? i.issue.fields.project.projectCategory.name : "&nbsp;";
            n.append(s)
        }
    }
}]), app.directive("oldWorklog", [function () {
    return {
        restrict: "E",
        scope: {worklog: "=", editWork: "=", deleteWork: "=", cannotEdit: "=", cannotDelete: "="},
        template: '<span><i class="fa fa-pencil-square-o" ng-click="editWork(worklog)" ng-hide="cannotEdit"></i></span><span><i class="fa fa-trash-o" ng-click="deleteWork(worklog)" ng-hide="cannotDelete"></i></span>'
    }
}]), app.directive("newWorklog", [function () {
    return {
        restrict: "E",
        scope: {worklog: "=", logWork: "=", entry: "=", removeCashedWorklog: "="},
        template: '<span><i class="fa" ng-click="logWork()" ng-class="{\'fa-play\': !$root.workTimer, \'fa-pause\': $root.workTimer && !worklog.stopped}"></i></span><span ng-if="!$root.workTimer || !worklog.stopped"><i class="fa fa-stop" ng-click="logWork(false, true)"></i></span><span ng-if="!$root.workTimer || !worklog.stopped"><i class="fa fa-trash-o" ng-click="removeCashedWorklog()"></i></span>'
    }
}]), app.directive("pivotCell", ["$compile", "$interval", function (e, t) {
    return {
        restrict: "E", scope: {key: "=", columns: "=", logWork: "=", editWork: "=", deleteWork: "=", jiraConfig: "=", removeCashedWorklog: "="}, link: function (t, i, n) {
            if (t.logWork && "3action" == t.key.keyValue) {
                var r, a = t.columns[t.key.keyValue];
                a.isTotalColumn ? r = "&nbsp;" : a.entries ? (t.worklog = {issueKey: a.entries[0].rowKey.keyValue}, a.worklog = t.worklog, r = e('<i class="fa fa-play" ng-click="logWork()" ng-show="!$root.workTimer && key.showStart && !$parent.cannotLogWorkIssue[worklog.issueKey]"></i>')(t)) : a.worklog && a.worklog.id ? (t.worklog = a.worklog, t.worklog.issueKey = a.rowKey.keyValue, r = e('<old-worklog worklog="worklog" edit-work="editWork" delete-work="deleteWork" cannot-edit="$parent.cannotEditOwnWorklogIssue[worklog.issueKey]"cannot-delete="$parent.cannotDeleteOwnWorklogIssue[worklog.issueKey]"/>')(t)) : (t.entry = a, t.worklog = a.worklog, r = e('<new-worklog worklog="worklog" log-work="logWork" entry="entry" remove-cashed-worklog = "removeCashedWorklog" />')(t)), i.append(r)
            } else t.key.filterName ? i.append(e('<span ng-bind-html="columns[key.keyValue] | ' + t.key.filterName + '"/>')(t)) : i.append(e("<span ng-bind=\"columns[key.keyValue] | prettyHours:jiraConfig:$parent.pivotTableType == 'IssuePassedTimeByStatus' && !$parent.workingTimeInStatus\"/>")(t))
        }
    }
}]), app.directive("columnKey", ["$compile", function (e) {
    return {
        restrict: "A", scope: {columnKey: "="}, link: function (t, i, n) {
            t.$watch("columnKey", function () {
                if (t.columnKey.user) {
                    var n;
                    if (t.$parent.isGadget) {
                        var r = angular.copy(t.$parent.reportParamsObject);
                        delete r.allUsers, delete r.group, r.pivotTableType = "Timesheet", r.user = t.columnKey.user.key, t.reportParams = $.param(r), n = '{{$parent.hostBaseUrl}}/plugins/servlet/ac/timereports/timereports#!{{reportParams}}" target="_parent'
                    } else t.startDate = TimesheetUtils.formatDateForSearch(t.columnKey.options.startDate), t.endDate = TimesheetUtils.formatDateForSearch(t.columnKey.options.endDate), n = "{{columnKey.user.key ? '#/?pivotTableType=Timesheet&user=' + columnKey.user.key + '&startDate=' + startDate + '&endDate=' + endDate + '&group=' + '&_=' + $id : ''}}"
                    ;
                    i.html('<a ng-class="{inactive: !columnKey.user.active, disabled: !columnKey.user.key}" ng-href="' + n + '" ng-bind="columnKey.user.displayName || columnKey.user.name"></a>')
                } else t.columnKey.date ? i.html("<span>{{columnKey.date | date:'EEE'}}<br/>{{columnKey.date | date:'dd/MMM'}}</span>") : t.columnKey.weekNumber ? (t.endDateIncluded = TimesheetUtils.addDays(t.columnKey.endDate, -1), i.html("<span title=\"{{columnKey.startDate | date:'d MMM'}}-{{endDateIncluded | date:'d MMM'}}\">Week<br/>{{columnKey.weekNumber | number}}</span>")) : t.columnKey.monthKey ? i.html("<span title=\"{{columnKey.endDate | date:'1-d MMMM'}}\">{{columnKey.keyValue | date:'MMM'}}</span>") : i.html("<span>{{columnKey.keyValue | i18n}}</span>");
                e(i.contents())(t)
            })
        }
    }
}]), app.directive("issueType", ["$compile", function () {
    return {
        restrict: "E",
        scope: {issue: "="},
        replace: !0,
        template: '<a href="{{$parent.hostBaseUrl}}/browse/{{issue.key}}" target="_parent"><img width="16" height="16" title="{{issue.fields.issuetype.description}}" ng-src="{{issue.fields.issuetype.iconUrl}}" alt="{{issue.fields.issuetype.name}}" /></a>'
    }
}]), app.directive("issueKey", ["$compile", function () {
    return {
        restrict: "E",
        scope: {issue: "=", showTitle: "=", showSummary: "="},
        replace: !0,
        template: '<a href="{{$parent.hostBaseUrl}}/browse/{{issue.key}}" target="_parent" title="{{showTitle || issue.fields.summary.length > 100 ? issue.fields.summary : \'\'}}"><span ng-if="showSummary"><img  width="16" height="16" title="{{issue.fields.issuetype.description}}" ng-src="{{issue.fields.issuetype.iconUrl}}" alt="{{issue.fields.issuetype.name}}" style="vertical-align: top"/>&nbsp;</span><s ng-show="issue.fields.resolution">{{issue.key}}</s><span ng-hide="issue.fields.resolution">{{issue.key}}</span><span ng-if="showSummary">&nbsp;{{issue.fields.summary | limitTo:100}}&nbsp;</span><img ng-if="showSummary" width="16" height="16" ng-src="{{issue.fields.priority.iconUrl}}" alt="{{issue.fields.priority.name}}" style="vertical-align: top"/></a>'
    }
}]), app.directive("issueSummary", ["$compile", function () {
    return {
        restrict: "E",
        scope: {issue: "="},
        replace: !0,
        template: '<a href="{{$parent.hostBaseUrl}}/browse/{{issue.key}}" target="_parent"  title="{{issue.fields.summary.length > 175 ? issue.fields.summary : \'\'}}">{{issue.fields.summary | limitTo:175}}</a>'
    }
}]), app.directive("issuePriority", ["$compile", function () {
    return {
        restrict: "E",
        scope: {issue: "="},
        replace: !0,
        template: '<a href="{{$parent.hostBaseUrl}}/browse/{{issue.key}}" target="_parent"><img width="16" height="16" ng-src="{{issue.fields.priority.iconUrl}}" alt="{{issue.fields.priority.name}}" /></a>'
    }
}]), app.directive("excelViewBak", ["$compile", "$templateCache", "$templateRequest", function (e, t, i) {
    return {
        restrict: "A", scope: {excelView: "=", pivotTable: "="}, link: function (n, r) {
            t.get(n.excelView) || i(n.excelView), $(r).click(function () {
                var t = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>\n";
                t += "<head>\n", t += "\x3c!--[if gte mso 9]>\n", t += "<xml>\n", t += "<x:ExcelWorkbook>", t += "<x:ExcelWorksheets>", t += "<x:ExcelWorksheet>", t += "<x:Name>", t += "{worksheet}", t += "</x:Name>", t += "<x:WorksheetOptions>", t += "<x:DisplayGridlines/>", t += "</x:WorksheetOptions>", t += "</x:ExcelWorksheet>", t += "</x:ExcelWorksheets>", t += "</x:ExcelWorkbook>\n", t += "</xml>\n", t += "<![endif]--\x3e\n", t += "</head>\n", t += "<body>\n";
                var i = e('<div><ng-include src="excelView"></ng-include></div>')(n);
                n.$apply(), t += i.html(), t += "</body>\n", t += "</html>\n", console.log(t)
            })
        }
    }
}]), app.directive("auiSelect2", ["$timeout", function (e) {
    return {
        require: "ngModel", restrict: "A", link: function (t, i, n, r) {
            e(function () {
                t.$watch(n.ngModel, function () {
                    $(i).auiSelect2()
                })
            }, 0)
        }
    }
}]), app.directive("auiDatePicker", [function () {
    return {
        restrict: "A", require: "ngModel", link: function (e, t, i, n) {
            $(t).datePicker({overrideBrowserDefault: !0}), $(t).change(function () {
                n.$valid && null != i.ngDateChangedFunc && e[i.ngDateChangedFunc]($(t).val())
            })
        }
    }
}]), app.directive("timePicker", ["$compile", function (e) {
    return {
        restrict: "E", scope: {time: "="}, link: function (t, i, n) {
            var r = function (e) {
                return /^\d+$/.test(e)
            };
            t.timeClick = function (e, i) {
                r(e.value) ? i.shiftKey ? (e.value = parseInt(e.value) - e.step, e.value < e.min && (e.value = e.min)) : (e.value = parseInt(e.value) + e.step, e.value > e.max && (e.value = e.max)) : (t.time.timePartsToMoment(), t.time.momentTime.set("hour", e.step + t.time.momentTime.get("hour")), t.time.momentToTimeParts())
            }, t.timeChange = function (e) {
                null != e.min && null != e.max ? r(e.value) ? null != e.min && null != e.max && (e.value > e.max ? e.value = e.max : e.value < e.min && (e.value = e.min)) : e.value = e.min : e.value = ""
            }, $(i).append(e('<input type="text" ng-repeat-start="item in time.timeParts" maxLength="5" class="text" style="max-width: 40px; margin: 0 1px;" ng-model="item.value" ng-click="timeClick(item, $event)" ng-change="timeChange(item)"><span ng-repeat-end ng-show="item.suffix">{{item.suffix}}</span>')(t))
        }
    }
}]), app.directive("pivottableSlider", [function () {
    return {restrict: "E", scope: !1, templateUrl: "/templates/slider.html"}
}]), app.directive("auiUserPicker", [function () {
    return {
        restrict: "A", scope: {ngValue: "=", ngUserChangedFunc: "="}, link: function (e, t, i) {
            $(t).auiSelect2({
                hasAvatar: !1,
                allowClear: !0,
                placeholder: "Search for user",
                multiple: !1,
                ajax: {
                    url: "/rest/api/2/user/picker", type: "GET", dataType: "json", cache: !0, data: function (e) {
                        return {query: e, maxResults: 1e3, showAvatar: !0}
                    }, results: function (e) {
                        return e = TimesheetUtils.getJson(e), {results: e.users}
                    }, transport: function (e) {
                        AP.request({url: e.url, headers: {Accept: "application/json"}, data: e.data, success: e.success, error: e.error})
                    }
                },
                id: function (e) {
                    return e.key
                },
                formatSelection: function (e) {
                    return Select2.util.escapeMarkup(e.displayName)
                },
                formatResult: function (e, t, i, n) {
                    var r = e.displayName + " - (" + e.name + ")", a = [], s = function (e) {
                        return e
                    };
                    return Select2.util.markMatch(n(r), n(i.term), a, s), a.join("")
                },
                formatNoMatches: function (e) {
                    return "No matches found"
                },
                initSelection: function (t, i) {
                    i(e.ngValue)
                }
            }), e.$watch("ngValue", function (e) {
                e ? t.select2("val", e.key) : t.select2("val", null)
            }), $(t).change(function () {
                null != e.ngUserChangedFunc && e.ngUserChangedFunc($(t).val())
            })
        }
    }
}]), app.directive("selectedOption", [function () {
    return {
        restrict: "E",
        scope: {label: "=", labelParam: "=", removeAction: "&removeAction"},
        template: '<span class="aui-label">{{label | i18n:labelParam}}<span ng-click="removeAction()" class="icon-close"><svg width="5px" height="5px" viewBox="288 109 5 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><path fill="currentColor" d="M292.808502,112.885224 C293.063833,113.140571 293.063833,113.553306 292.808502,113.808653 C292.681164,113.936 292.513991,114 292.346818,114 C292.179645,114 292.012473,113.936 291.885134,113.808653 L290.500082,112.42351 L289.114376,113.808653 C288.987038,113.936 288.819865,114 288.652692,114 C288.485519,114 288.319,113.936 288.191008,113.808653 C287.936331,113.553306 287.936331,113.140571 288.191008,112.885224 L289.57606,111.500082 L288.191008,110.114939 C287.936331,109.859592 287.936331,109.446204 288.191008,109.19151 C288.446338,108.936163 288.859699,108.936163 289.114376,109.19151 L290.500082,110.576653 L291.885134,109.19151 C292.140464,108.936163 292.553172,108.936163 292.808502,109.19151 C293.063833,109.446204 293.063833,109.859592 292.808502,110.114939 L291.42345,111.500082 L292.808502,112.885224 Z" id="Fill-1" stroke="none" fill-rule="evenodd"></path></svg></span></span>'
    }
}]), app.directive("auiGroupPicker", [function () {
    return {
        restrict: "A", link: function (e, t, i) {
            $(t).auiSelect2({
                hasAvatar: !1, placeholder: " ", multiple: !0, ajax: {
                    url: "/rest/api/2/groups/picker", type: "GET", dataType: "json", cache: !0, data: function (e) {
                        return {query: e, maxResults: 1e3, showAvatar: !0}
                    }, results: function (e) {
                        return e = TimesheetUtils.getJson(e), {results: e.groups}
                    }, transport: function (e) {
                        AP.request({url: e.url, headers: {Accept: "application/json"}, data: e.data, success: e.success, error: e.error})
                    }
                }, id: function (e) {
                    return e.name
                }, formatSelection: function (e) {
                    return Select2.util.escapeMarkup(e.name)
                }, formatResult: function (e, t, i, n) {
                    var r = e.name, a = [], s = function (e) {
                        return e
                    };
                    return Select2.util.markMatch(n(r), n(i.term), a, s), a.join("")
                }, formatNoMatches: function (e) {
                    return "No matches found"
                }
            });
            var n = function (e) {
                if (null != e && "" != e) {
                    angular.isArray(e) || (e = e.split(","));
                    for (var i = [], n = 0; n < e.length; n++) i.push({name: e[n], html: e[n]});
                    $(t).auiSelect2("data", i)
                } else $(t).auiSelect2("data", null)
            };
            e.$watch(i.ngModel, n), i.updateEvent && e.$on(i.updateEvent, function (e, t) {
                n(t)
            }), $(t).change(function () {
                null != i.ngGroupChangedFunc && e[i.ngGroupChangedFunc]($(t).val())
            })
        }
    }
}]), app.directive("auiIssuePicker", ["pivottableService", function (e) {
    return {
        scope: {ngModel: "=", ngDisabled: "="}, restrict: "A", link: function (t, i, n) {
            $(i).auiSelect2({
                placeholder: "", multiple: !1, ajax: {
                    url: "/rest/api/2/issue/picker", type: "GET", dataType: "json", cache: !0, data: function (e) {
                        return {query: e, currentJQL: t.$parent.jqlQuery || "", showSubTasks: !0}
                    }, results: function (e) {
                        e = TimesheetUtils.getJson(e);
                        var t = [];
                        return e.sections.length > 0 && (t.push({select2Section: e.sections[0].label, children: e.sections[0].issues}), e.sections.length > 1 && t.push({
                            select2Section: e.sections[1].label,
                            children: e.sections[1].issues
                        })), {results: t}
                    }, transport: function (e) {
                        AP.request({url: e.url, headers: {Accept: "application/json"}, data: e.data, success: e.success, error: e.error})
                    }
                }, id: function (e) {
                    return e.key
                }, formatSelection: function (e) {
                    return Select2.util.escapeMarkup(e.key + ": " + e.summaryText)
                }, formatResult: function (e, t, i, n) {
                    if (e.hasOwnProperty("select2Section")) return e.select2Section;
                    var r = e.key + ": " + e.summaryText, a = [], s = function (e) {
                        return e
                    };
                    return Select2.util.markMatch(n(r), n(i.term), a, s), a.join("")
                }, initSelection: function (i, n) {
                    t.ngModel && e.findIssueByKey(t.ngModel, {_fields: "summary"}).then(function (e) {
                        n({key: e.key, summaryText: e.fields.summary})
                    })
                }, formatNoMatches: function (e) {
                    return "No matches found"
                }
            }), t.$watch("ngModel", function (e) {
                e && i.select2("val", e)
            })
        }
    }
}]), app.directive("auiMultiSelectPicker", [function () {
    return {
        restrict: "A", link: function (e, t, i) {
            e.$watch(i.ngOptionsData, function () {
                null != e[i.ngOptionsData] && ($(t).auiSelect2({
                    hasAvatar: !1,
                    placeholder: " ",
                    multiple: "false" != i.auiMultiSelectPicker,
                    data: {results: e[i.ngOptionsData].getOptions(), text: "label"},
                    id: function (e) {
                        return e.id
                    },
                    formatSelection: function (e) {
                        return Select2.util.escapeMarkup(e.label)
                    },
                    formatResult: function (e, t, i, n) {
                        var r = e.label, a = [], s = function (e) {
                            return e
                        };
                        return Select2.util.markMatch(n(r), n(i.term), a, s), a.join("")
                    },
                    formatNoMatches: function (e) {
                        return "No matches found"
                    }
                }), t.on("select2-loaded", function () {
                    t.select2("dropdown").find(".select2-result-label").each(function (e, t) {
                        var i = $(t), n = i.text();
                        n && n.length > 25 && i.attr("title", n)
                    })
                }))
            });
            var n = function (n) {
                if (null != n) {
                    angular.isArray(n) || (n = n.split(","));
                    var r = [];
                    if (null != e[i.ngOptionsData]) for (var a = 0; a < n.length; a++) {
                        var s = e[i.ngOptionsData].findOption(n[a]);
                        null != s && r.push({id: s.id, label: s.label})
                    }
                    $(t).auiSelect2("data", "false" != i.auiMultiSelectPicker || 0 == r.length ? r : r[0])
                } else $(t).auiSelect2("data", null)
            };
            e.$watch(i.ngModel, n), i.updateEvent && e.$on(i.updateEvent, function (e, t) {
                n(t)
            }), $(t).change(function () {
                null != i.ngValueChangedFunc && e[i.ngValueChangedFunc]($(t).val())
            })
        }
    }
}]), app.directive("pieChart", ["pivottableService", "$interpolate", "$compile", function (e, t, i) {
    return {
        restrict: "A", link: function (n, r, a) {
            var s = null, o = $(r).height(), l = n.$parent.hostBaseUrl, u = function (e, t) {
                    if (null == t) return {label: e};
                    var i = t.fields.resolution;
                    return null != i && (i = {name: i.name, description: i.description}), {label: t.key, url: l + "/browse/" + t.key, hint: t.fields.summary, resolution: i}
                }, d = function (t) {
                    if (null != t) {
                        var i = e.getParentIssueKey(t, {configOptions: n.configOptions});
                        if (null != i) return {label: i, url: l + "/browse/" + i, hint: "", resolution: null}
                    }
                    return null
                }, c = function (e) {
                    var t = null;
                    if (null != e) {
                        t = [];
                        var i = Object.keys(e.rows);
                        for (var n in i) {
                            var r = i[n], a = e.rows[r], s = [], o = a.rowKey.issue;
                            if (null != o) {
                                var l = o.fields.priority, c = o.fields.issuetype;
                                s = [], l && s.push({url: l.iconUrl, title: l.name}), c && s.push({url: c.iconUrl, title: c.name + " - " + c.description})
                            }
                            var m = DrawHelper.buildLabel(r, a);
                            t.push({label: m, data: a.sum, link: u(m, o), icons: s, masterLink: d(o)})
                        }
                    }
                    return t
                }, m = n.jiraConfig || {},
                h = '<button class="aui-button" ng-click="downloadSupportData()" ng-if="downloadSupportData && !isGadget"><span class="aui-icon aui-icon-small aui-iconfont-export-list"></span>&nbsp;Support Data</button>',
                p = function () {
                    var e = $(r).find(".legend");
                    e.find("table").css("font-size", ""), e.find("table tr:first").first().before('<tr><th colspan="2"><span id="sliderPlaceholder"></span></th></tr>'), e.find("#sliderPlaceholder").before(i("<pivottable-slider />")(n)), e.find("table tbody").first().append('<tr><td colspan="2">' + t("{{'Total' | i18n}}")(n) + " <b>" + DrawHelper.getFormattedTime(n[a.ngModel].sum, m) + '</b></td></tr><tr><td colspan="2"><br id="supportButtonPlaceholder"/></td></tr>'), e.find("#supportButtonPlaceholder").after(i(h)(n))
                };
            n.$watch(a.ngModel, function (e) {
                if (s = null, n.loading) 0 == $("#loading").length && $(r).html(i("<loading/>")(n)); else if (n.loaded) {
                    var t = c(e);
                    if (null != t && t.length > 0) null == s ? s = $.plot(r, t, {
                        series: {
                            pie: {
                                show: !0, radius: .9, label: {
                                    show: !0, radius: .8, formatter: function (e, i) {
                                        return DrawHelper.composeTooltip(i.label, i, t, n.isGadget)
                                    }, background: {opacity: .8}, threshold: .05
                                }, offset: {left: -Math.round(o / 2)}
                            }
                        }, grid: {color: "#000"}, legend: {
                            show: !0, margin: [0, 23], labelFormatter: function (e, i) {
                                return DrawHelper.composeLegendTooltip(e, i, t, m, n.isGadget)
                            }
                        }
                    }) : (s.setData(t), s.setupGrid(), s.draw()), p(), $(r).resize(p); else if ((null != n.startDate || null != n.endDate) && !r.has("pivottable-slider").length) {
                        $(r).css("position", "absolute");
                        r.html(i('<div style="position: absolute; left: 60px; top: 0; margin: 30px;"><b>NO DATA</b></div><div class="legend"><table style="position: absolute; top: 23px; right: 0; color: rgb(0, 0, 0); width: 215px" width="215px"><tr><th colspan="2"><pivottable-slider /></th></tr><tr><td colspan="2"><br/><button class="aui-button" ng-click="downloadSupportData()" ng-if="downloadSupportData && !isGadget"><span class="aui-icon aui-icon-small aui-iconfont-export-list"></span>&nbsp;Support Data</button></td></tr></table></div>')(n))
                    }
                } else $(r).html(i('<br/><button class="aui-button" ng-click="execute()" ng-disabled="loading" ng-class="{disabled: loading}">   <span class="aui-icon aui-icon-small aui-iconfont-view"></span>&nbsp;View Report</button>' + h)(n));
                var a = window.RA || window.AP, l = $(document);
                a.resize(l.width(), l.height())
            })
        }
    }
}]), app.directive("auiInlineDialog", ["$compile", "$timeout", "$window", function (e, t, i) {
    return {
        restrict: "E", scope: {template: "=", container: "=", popupData: "=", workDescriptionRequired: "=", initFn: "&"}, link: function (i, n, r) {
            i.hostBaseUrl = i.$parent.hostBaseUrl;
            var a = AJS.InlineDialog(i.container, i.$id, function (n, r, a) {
                var s = "<ng-include src=\"'" + i.template + "'\"></ng-include>";
                return t(function () {
                    n.css("padding", "5px").html(e(s)(i))
                }, 0), a(), !1
            }, {
                useLiveEvents: !0, noBind: !i.container, initCallback: function (e) {
                    this.popup.css("right", "auto"), this.popup.refresh(), $(".contents", this.popup).off("mouseleave")
                }, preHideCallback: function (e) {
                    return !0
                }
            });
            i.closePopup = function () {
                a.hide()
            }, i.initFn({params: {dialog: a, scope: i}})
        }
    }
}]), app.directive("enterPressed", [function () {
    return {
        require: "^form", link: function (e, t, i, n) {
            t.bind("keydown keypress", function (t) {
                13 === t.which && n.$valid && (e.$apply(function () {
                    e.$eval(i.enterPressed)
                }), t.preventDefault())
            })
        }
    }
}]), app.directive("validationErrors", [function () {
    return {restrict: "E", scope: {errors: "="}, replace: !0, template: '<ul class="errors"><li ng-repeat="error in errors">{{error | i18n}}</li></ul>'}
}]), app.directive("workLabels", [function () {
    return {
        restrict: "A", link: function (e, t, i) {
            $(t).textcomplete([{
                match: /#(\w*)$/, search: function (t, n) {
                    var r = e[i.workLabels] || [];
                    n($.map(r, function (e) {
                        return 0 === e.indexOf(t) ? e : null
                    }))
                }, index: 1, replace: function (e) {
                    return " #" + e + " "
                }
            }])
        }
    }
}]), app.directive("loading", [function () {
    return {
        restrict: "E", link: function (e, t) {
            $(t).html('<div id="loading" class="aui-progress-indicator"><span class="aui-progress-indicator-value"></span></div>'), e.$on("loadingProgress", function (e, t) {
                AJS.progressBars.update("#loading", t)
            }), e.$on("loadingReset", function () {
                AJS.progressBars.setIndeterminate("#loading")
            })
        }
    }
}]), app.filter("prettyHours", [function () {
    return function (e, t, i) {
        var n = e && angular.isObject(e) ? e.sum : parseInt(e) || 0;
        return 0 != n ? DrawHelper.getFormattedTime(n, t || {}, i) : ""
    }
}]), app.filter("time", ["$sce", function (e) {
    return function (t, i) {
        var n = t && angular.isObject(t) && t.hasOwnProperty("value") ? t.value : t;
        return n ? e.trustAsHtml(moment(n).format("LT")) : ""
    }
}]), app.filter("timeago", [function () {
    return function (e) {
        var t = moment(e);
        return t.isValid() ? t.fromNow() : e
    }
}]), app.filter("timeTracking", ["$sce", function (e) {
    return function (t) {
        var i = t.value || t;
        if (i.timespent + i.estimate == 0) return e.trustAsHtml("&nbsp;");
        var n = Math.round(100 * i.timespent / (i.estimate + i.timespent)), r = 100 - n,
            a = '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0; margin: 0"><table border="0" width="100px" style="font-size: 5px;" cellpadding="0" cellspacing="0"><tr>' + (n > 0 ? '<td style="width:' + n + '%; background-color: #51a825;">&nbsp;</td>' : "") + (r > 0 ? '<td style="width:' + r + '%; background-color: #ec8e00;">&nbsp;</td>' : "") + '</tr></table></td><td style="margin: 0; padding: 0 0 0 5px">' + n + "%</td></tr></table>";
        return e.trustAsHtml(a)
    }
}]), app.filter("htmlSafe", ["$sce", function (e) {
    return function (t) {
        return e.trustAsHtml(t)
    }
}]);
var appBaseModule = angular.module("appBase", ["ngRoute", "localization", "talis.services.logging", "configuration", "directives"]);
appBaseModule.config(["$httpProvider", "$provide", function (e, t) {
    if (!window.atlToken) {
        var i = "&" + window.location.search.substring(1);
        window.atlToken = getUrlParam(i, "&jwt")
    }
    window.atlToken && (e.defaults.headers.common.Authorization = "JWT " + window.atlToken), t.factory("authHttpInterceptor", ["$injector", "$q", function (t, i) {
        return {
            response: function (i) {
                var n = i.headers("X-acpt");
                return n && (window.atlToken = n, e.defaults.headers.common.Authorization = "JWT " + window.atlToken, t.get("authbeat").authbeat()), i
            }, responseError: function (e) {
                return 401 == e.status && "/authbeat" != e.config.url && "/bitbucket/login" != e.config.url ? AP.flag.create({
                    title: "Authentication expired",
                    body: "Reload page to restore communication with add-on backend",
                    type: "error"
                }) : (e.config.url = -1) && t.get("applicationLoggingService").trace("responseError", e), i.reject(e)
            }
        }
    }]), t.factory("urlRewriteHttpInterceptor", ["$injector", "$window", function (e, t) {
        return {
            request: function (e) {
                var i = e.url.match(/^\/?(.+?)\//);
                return i && "i18n" == i[1] && (e.url = t.i18nDefault), e
            }
        }
    }]), e.interceptors.push("authHttpInterceptor", "urlRewriteHttpInterceptor")
}]), appBaseModule.run(["$rootScope", "$window", "$http", "$injector", "localize", "applicationLoggingService", function (e, t, i, n, r, a) {
    a.flush();
    var s = "&" + t.location.search.substring(1);
    3 == getUrlParam(s, "&v") && ("active" == getUrlParam(s, "lic") && (t.storeWorklogEnabled = !0, e.subscribe = !0), n.get("authbeat").authbeat());
    e.deployedDate = t.deployedDate, r.initLocalizedResources(), e.initOnErrorPopup = function (e) {
        var i = n.get("configurationService");
        i.getConfiguration().then(function (n) {
            a.trace("mailer url, ignore?", [t.mailerUrl, n.onErrorIgnore.val]), t.mailerUrl && !n.onErrorIgnore.val && (t.$onErrorPopup = e.dialog, e.scope.onErrorDialog = function () {
                $onErrorPopup.hide();
                var e = {
                    errorMessage: $onErrorPopup.data("errorMessage"),
                    stackTrace: $onErrorPopup.data("stackTrace"),
                    options: $onErrorPopup.data("options"),
                    timesheetParams: $onErrorPopup.data("options")
                };
                AP.dialog.create({key: "bitbucket", width: "700px", height: "400px", chrome: !0, header: "Report Problem", submitText: "Submit", customData: e})
            }, e.scope.onErrorIgnore = function () {
                n.onErrorIgnore.val = !0, i.saveConfiguration(n.onErrorIgnore).then(function () {
                    t.$onErrorPopup.hide(), delete t.$onErrorPopup
                })
            })
        })
    }
}]), appBaseModule.service("authbeat", ["$timeout", "$http", function (e, t) {
    this.authbeatPromise = null, this.authbeat = function () {
        e.cancel(this.authbeatPromise), this.authbeatPromise = e(function () {
            t.get("/authbeat")
        }, 78e4, !1)
    }
}]);
var getParam = function (e, t, i) {
    var n = t.defer();
    return window.AP.getLocation(function (t) {
        var r = getUrlParam(t, e);
        n.resolve(angular.isFunction(i) ? i(r) : r)
    }), n.promise
}, getUrlParam = function (e, t) {
    var i, n = e.split(t + "=")[1];
    return angular.isDefined(n) && (i = n.split(/&|#!/)[0] || ""), i
};
appBaseModule.factory("projectKey", ["$q", function (e) {
    return getParam("project.key", e)
}]), appBaseModule.factory("externalFilter", ["$q", function (e) {
    return getParam("filter", e)
}]), appBaseModule.factory("jql", ["$q", function (e) {
    return getParam("jql", e, function (e) {
        return angular.isDefined(e) ? decodeURIComponent(TimesheetUtils.replaceAll(e, "+", " ")) : e
    })
}]), appBaseModule.factory("timesheetParams", ["$q", "$routeParams", function (e, t) {
    var i = e.defer();
    return window.AP.getLocation(function (e) {
        var n = e.split("#!");
        i.resolve(2 == n.length ? TimesheetUtils.parseParams(n[1]) : t)
    }), i.promise
}]), appBaseModule.factory("loggedInUser", ["$q", "pivottableService", function (e, t) {
    var n = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}, r = function (e) {
        for (i in n) e = e.replace(n[i], i);
        return e
    }, a = e.defer();
    return window.AP.getUser(function (e) {
        e.key = r(e.key), t.getUserInfo(e.key).then(function (e) {
            moment.locale(e.locale), a.resolve(e)
        })
    }), a.promise
}]), appBaseModule.service("apService", ["$q", function (e) {
}]);
var configurationModule = angular.module("configuration", []);
configurationModule.service("configurationService", ["$q", "$http", "dataService", "applicationLoggingService", "$rootScope", function (e, t, i, n, r) {
    var a = window.RA || window.AP;
    if (this.data = {
            allCompositionIssueLinks: null,
            allParentIssueFields: null
        }, this.defaults = [{key: "auditorsGroups"}, {key: "compositionIssueLink"}, {key: "parentIssueField"}, {
            key: "weekendType",
            val: "60"
        }, {key: "preserveStartedTime"}, {key: "onErrorIgnore"}, {key: "prettyDuration"}, {key: "durationType"}, {key: "maxFractionDigits"}, {key: "trackSupportData"}, {key: "worklogVisibilityGroup"}, {key: "worklogVisibilityRole"}, {key: "timeentryPanelGroups"}, {key: "workDescriptionRequired"}, {
            key: "workLabels",
            val: []
        }, {key: "workingTimeInStatus"}, {key: "startedTimeInStatus"}], window.storeWorklogEnabled) this.defaults.push({key: "storeWorklog"}); else {
        var s = this;
        a.getLocation(function (e) {
            -1 != ["timereports", "avelytchenko"].indexOf(e.match(/https:\/\/(.+?)\./)[1]) && (s.defaults.push({key: "storeWorklog"}), r.subscribe = !0)
        })
    }
    try {
        var o = "__storage_test__";
        window.localStorage.setItem(o, o), window.localStorage.removeItem(o), this.defaults.push({key: "cacheWorklog"})
    } catch (e) {
    }
    var l = null;
    this.getConfiguration = function () {
        return null == l && (l = i.getProperty("configuration").then(function (e) {
            for (var t = this.convert(e), i = {}, n = 0; n < this.defaults.length; n++) {
                var r = this.defaults[n];
                i[r.key] = t.hasOwnProperty(r.key) ? {key: r.key, val: t[r.key]} : r
            }
            return i
        }.bind(this))), l
    }, this.saveConfiguration = function (e) {
        return e.val && (!angular.isArray(e.val) || e.val.length > 0) ? this.updateConfiguration(e) : this.deleteConfiguration(e)
    }, this.convert = function (e) {
        return angular.isArray(e) && (e = e.reduce(function (e, t) {
            return e[t.key] = t.val, e
        }, {})), e
    }, this.updateConfiguration = function (t) {
        var n = e.defer();
        return i.getProperty("configuration", []).then(function (e) {
            e = this.convert(e), e[t.key] = t.val, i.setProperty("configuration", e).then(function () {
                n.resolve(t)
            })
        }.bind(this)), n.promise
    }, this.deleteConfiguration = function (t) {
        var n = e.defer();
        return i.getProperty("configuration", []).then(function (e) {
            e = this.convert(e), delete e[t.key], i.setProperty("configuration", e).then(function () {
                n.resolve({key: t.key})
            })
        }.bind(this)), n.promise
    }, this.getAllCompositionIssueLinks = function () {
        var t = this, i = e.defer();
        return null == t.data.allCompositionIssueLinks ? a.request({
            url: "/rest/api/2/issueLinkType", dataType: "json", success: function (e) {
                e = TimesheetUtils.getJson(e), t.data.allCompositionIssueLinks = [];
                for (var n = 0; n < e.issueLinkTypes.length; n++) t.data.allCompositionIssueLinks.push(e.issueLinkTypes[n].name);
                i.resolve(t.data.allCompositionIssueLinks)
            }, error: n.error
        }) : i.resolve(t.data.allCompositionIssueLinks), i.promise
    }, this.getAllParentIssueFields = function () {
        var t = this, i = e.defer();
        return null == t.data.allParentIssueFields ? a.request({
            url: "/rest/api/2/field", dataType: "json", success: function (e) {
                e = TimesheetUtils.getJson(e), t.data.allParentIssueFields = [];
                for (var n = 0; n < e.length; n++) 1 == e[n].custom && null != e[n].schema && "com.pyxis.greenhopper.jira:gh-epic-link" == e[n].schema.custom && t.data.allParentIssueFields.push({
                    id: e[n].id,
                    name: e[n].name
                });
                i.resolve(t.data.allParentIssueFields)
            }, error: n.error
        }) : i.resolve(t.data.allParentIssueFields), i.promise
    }, this.getProjects = function () {
        var t = this, i = e.defer();
        if (null == t.data.allProjects) {
            a.request({
                url: "/rest/api/2/project", dataType: "json", success: function (e) {
                    e = TimesheetUtils.getJson(e), t.data.allProjects = e, i.resolve(e)
                }, error: n.error
            })
        } else i.resolve(t.data.allProjects);
        return i.promise
    }, this.getRoles = function (t) {
        var i = this;
        if (null == i.data.allRoles && (i.data.allRoles = {}), i.data.allRoles.hasOwnProperty(t)) return i.data.allRoles[t];
        var n = e.defer();
        i.data.allRoles[t] = n.promise;
        var r = "/rest/api/2/project/" + t + "/role";
        return a.request({
            url: r, dataType: "json", success: function (e) {
                e = TimesheetUtils.getJson(e), n.resolve(e)
            }, error: function (e) {
                n.reject()
            }
        }), n.promise
    }, this.getAllRoles = function () {
        var t = this, i = e.defer();
        return this.getProjects().then(function (e) {
            i.resolve(t.getRoles(e[0].key))
        }), i.promise
    }, this.getAllRolesBak = function () {
        var t = this, i = e.defer();
        return null == t.data.allRoles ? a.request({
            url: "/rest/api/2/role", dataType: "json", success: function (e) {
                e = TimesheetUtils.getJson(e), t.data.allRoles = e, i.resolve(t.data.allRoles)
            }, error: n.error
        }) : i.resolve(t.data.allRoles), i.promise
    }, this.resetState = function () {
        l = null, this.data.allCompositionIssueLinks = null, this.data.allParentIssueFields = null
    }
}]), configurationModule.service("dataService", ["$q", "applicationLoggingService", "$http", function (e, t, i) {
    var n = window.RA || window.AP, r = "/rest/atlassian-connect/1/addons/timereports", a = r + "/properties/", s = e.defer(), o = {};
    this.getProperty = function (t, i) {
        var r = e.defer();
        return s.promise.then(function () {
            if (!o[t]) return void r.resolve(i || {});
            n.request({
                url: a + t, success: function (e) {
                    var t = TimesheetUtils.getJson(e), i = TimesheetUtils.getJson(t.value);
                    r.resolve(i)
                }, error: function (e) {
                    r.resolve(i || {})
                }
            })
        }), r.promise
    }, this.setProperty = function (t, i) {
        var r = e.defer();
        return n.request({
            url: a + t, type: "PUT", data: JSON.stringify(i), contentType: "application/json", success: function (e) {
                var i = TimesheetUtils.getJson(e), n = TimesheetUtils.getJson(i.value);
                o[t] = !0, r.resolve(n)
            }, error: function (e) {
                r.reject(e)
            }
        }), r.promise
    }, n.request({
        url: a, success: function (e) {
            e = TimesheetUtils.getJson(e);
            for (var t = 0; t < e.keys.length; t++) {
                var i = e.keys[t];
                o[i.key] = !0
            }
            s.resolve()
        }
    }), n.request({
        url: r, success: function (e) {
            t.license = TimesheetUtils.getJson(e)
        }
    })
}]);
var directives = angular.module("directives", ["talis.services.logging"]);
directives.directive("context", ["applicationLoggingService", function (e) {
    return {
        restrict: "E", scope: {items: "="}, link: function (t, i, n) {
            e.trace("context", t.items);
            var r = TimesheetUtils.getJson(t.items);
            e.baseUrl = r.hostBaseUrl, angular.extend(t.$parent, r)
        }
    }
}]), directives.directive("autoFocus", ["$timeout", function (e) {
    return function (t, i, n) {
        e(function () {
            i.focus().select()
        }, 0)
    }
}]), directives.directive("formInvalid", [function () {
    return {
        restrict: "E", require: "^form", link: function (e, t, i, n) {
            var r = AP.dialog.getButton("submit");
            e.$watch(n.$name + ".$invalid", function (e) {
                e ? r.disable() : r.enable()
            })
        }
    }
}]), directives.directive("logWorkPermission", ["pivottableService", function (e) {
    return {
        restrict: "A", require: "ngModel", link: function (t, i, n, r) {
            t.$watch("worklog.issueKey", function (t, n) {
                t && e.havePermissions(["WORK_ON_ISSUES"], "issueKey=" + t).then(function (e) {
                    r.$setValidity(i[0].name, e[0])
                })
            })
        }
    }
}]), directives.directive("formSubmit", [function () {
    return {
        restrict: "A", link: function (e, t, i) {
            var n = AP.dialog.getButton("submit");
            AP.events.on("dialog.submit", function () {
                n.disable(), t.submit()
            })
        }
    }
}]), directives.directive("timespent", [function () {
    return {
        require: "ngModel", link: function (e, t, i, n) {
            n.$validators.timespent = function (e, t) {
                if (!t || /^\d*\.?\d+$/.test(t)) return !t || parseFloat(t) > 0;
                for (var i = t.split(" "), n = ["w", "d", "h", "m"], r = i.length > 0, a = 0; a < i.length && r && n.length > 0; a++) do {
                    var s = n.shift(), o = RegExp("^(\\d*\\.?\\d+)" + s + "$"), l = i[a].match(o);
                    r = null != l && parseFloat(l[1]) > 0
                } while (n.length > 0 && !r);
                return r
            }
        }
    }
}]), directives.directive("error", [function () {
    return {
        restrict: "E", link: function (e, t) {
            $(t).click(function () {
                e.$apply(function () {
                    throw new Error("Test")
                })
            })
        }
    }
}]), directives.directive("resize", ["$timeout", function (e) {
    return {
        restrict: "E", link: function (t, i) {
            var n = function () {
                var e = window.RA || window.AP, t = $(document);
                e.resize(t.width(), t.height())
            };
            t.$parent.$watch("loading", function (t) {
                t ? n() : e(n, 100)
            })
        }
    }
}]);
var loggingModule = angular.module("talis.services.logging", []);
loggingModule.factory("traceService", function () {
    return {print: printStackTrace}
}), loggingModule.provider("$exceptionHandler", {
    $get: ["exceptionLoggingService", function (e) {
        return e
    }]
}), loggingModule.factory("exceptionLoggingService", ["$log", "$window", "traceService", "applicationLoggingService", function (e, t, i, n) {
    function r(r, a) {
        e.error.apply(e, arguments);
        try {
            var s = r.toString(), o = i.print({e: r});
            t.loggerUrl && $.ajax({
                type: "POST",
                url: t.loggerUrl,
                headers: {Authorization: "JWT " + t.atlToken},
                contentType: "application/json",
                data: angular.toJson({
                    url: t.location.href,
                    message: s,
                    type: "exception",
                    stackTrace: o,
                    tracelog: n.flush(),
                    cause: decodeURIComponent(a || t.location.hash),
                    licene: {evaluation: n.license.evaluation, maximumNumberOfUsers: n.license.maximumNumberOfUsers},
                    deployedHash: t.deployedHash
                })
            });
            var l = t.$onErrorPopup;
            l && (l.show(null, ".section-header"), l.data("errorMessage", s).data("stackTrace", o))
        } catch (t) {
            e.warn("Error server-side logging failed"), e.log(t)
        }
    }

    return r
}]), loggingModule.factory("applicationLoggingService", ["$log", "$window", function (e, t) {
    return {
        license: {}, messages: [], trace: function (e, t) {
            this.messages.push(e + " " + JSON.stringify(t))
        }, flush: function () {
            return this.messages.splice(0, this.messages.length)
        }, error: function (i, n) {
            e.error.apply(e, arguments);
            try {
                t.loggerUrl && $.ajax({
                    type: "POST",
                    url: t.loggerUrl,
                    headers: {Authorization: "JWT " + t.atlToken},
                    contentType: "application/json",
                    data: angular.toJson({
                        url: t.location.href,
                        message: i,
                        type: "error",
                        tracelog: this.flush(),
                        cause: decodeURIComponent(n || t.location.hash),
                        licene: {evaluation: this.license.evaluation, maximumNumberOfUsers: this.license.maximumNumberOfUsers},
                        deployedHash: t.deployedHash
                    })
                })
            } catch (t) {
                e.warn("Error server-side logging failed"), e.log(t)
            }
        }, debug: function (i, n) {
            e.log.apply(e, arguments);
            try {
                t.loggerUrl && $.ajax({
                    type: "POST",
                    url: t.loggerUrl,
                    headers: {Authorization: "JWT " + t.atlToken},
                    contentType: "application/json",
                    data: angular.toJson({message: i + " " + JSON.stringify(n), licene: {evaluation: this.license.evaluation, maximumNumberOfUsers: this.license.maximumNumberOfUsers}, type: "debug"})
                })
            } catch (t) {
                e.warn("Error server-side logging failed"), e.log(t)
            }
        }
    }
}]), CsvView.dateTimeFormat = "YYYY-MM-DD HH:mm:ss", CsvView.prototype.fieldValue = function (e, t, i) {
    var n = /com\.atlassian\.greenhopper\.service\.sprint\.Sprint@[\d\w]+\[(.+)?\]/, r = i.maxFractionDigits, a = function (e) {
        var t;
        if (angular.isObject(e) && e.hasOwnProperty("name")) return e.name;
        if (angular.isObject(e) && e.hasOwnProperty("key")) return e.key;
        if (angular.isObject(e) && e.hasOwnProperty("value")) return e.value + (e.hasOwnProperty("child") ? ":" + a(e.child) : "");
        if (angular.isString(e) && (t = e.match(n))) {
            for (var i = t[1].split(","), r = 0; r < i.length; r++) {
                var s = i[r];
                if (0 == s.indexOf("name=")) return s.substr(5)
            }
            return ""
        }
        return e
    }, s = t.id || t;
    this.field = function (e) {
        var i = e.fields[s];
        return t && t.schema && "com.pyxis.greenhopper.jira:gh-epic-link" == t.schema.custom && (i ? i = {key: i} : "Epic" == e.fields.issuetype.name && (i = {key: e.key})), "project" == s && (i = ""), i || (i = "parent" == s ? {key: e.key} : "projectcategory" == s && e.fields.project.projectCategory ? e.fields.project.projectCategory : ""), i
    }(e);
    var o = function (e) {
            if (TimesheetUtils.isDate(e)) return moment(e).format(CsvView.dateTimeFormat);
            if (Array.isArray(e)) {
                var t = "";
                return e.length > 0 && (e[0].inwardIssue || e[0].outwardIssue) ? t = e.map(function (e) {
                    return e.inwardIssue ? e.type.inward + " " + a(e.inwardIssue) : e.type.outward + " " + a(e.outwardIssue)
                }).join(", ") : e.forEach(function (e) {
                    t.length > 0 && (t += ", "), t += a(e)
                }), t
            }
            return a(e)
        }(this.field)
    ;
    return -1 != ["timeestimate", "timeoriginalestimate", "timespent"].indexOf(s) && "" != o && (o = DrawHelper.formatDecimal((o || 0) / 3600, r) + "h"), o
}, CsvView.prototype.escape = function (e) {
    return '"' + e.replace(/"/g, '""') + '"'
}, CsvView.prototype.enquote = function (e) {
    return e.indexOf(",") >= 0 ? this.escape(e) : e
}, CsvView.prototype.generate = function (e) {
    for (var t = PivotTableFactory.createPivotTable(e), i = "Project,Issue Type,Key,Summary,Priority", n = 0; n < e.moreFields.length; n++) {
        var r = e.moreFields[n];
        ["workeduser", "workeddate"].indexOf(r.id) < 0 && (i += "," + this.escape(r.name))
    }
    "TimeTracking" == e.pivotTableType ? i += ",Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress\n" : (i += ",Date Started", "IssuePassedTimeByStatus" == e.pivotTableType && (i += ",Date Ended"), i += ",Username,Display Name,Time Spent (h)", "IssuePassedTimeByStatus" == e.pivotTableType ? i += ",Status\n" : i += ",Work Description\n");
    var a = 0;
    for (var n in this.allIssues) {
        var s = t.add(this.allIssues[n]);
        for (var n in s) {
            var o = s[n], l = o.rowKey.issue, u = o.rowKey.worklog || o.worklog;
            i += this.escape(l.fields.project.name) + ",", i += l.fields.issuetype.name + ",", i += l.key + ",", i += this.escape(l.fields.summary) + ",", i += this.escape(this.fieldValue(l, "priority", e)) + ",";
            for (var n = 0; n < e.moreFields.length; n++) {
                var r = e.moreFields[n];
                ["workeduser", "workeddate"].indexOf(r.id) < 0 && ("workcreated" == r.id ? i += moment(u.created).format(CsvView.dateTimeFormat) + "," : i += this.escape(String(this.fieldValue(l, r, e))) + ",")
            }
            if ("TimeTracking" == e.pivotTableType) {
                i += this.enquote(DrawHelper.formatDecimal(o.values["1timeoriginalestimate"] / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(o.values["2esttimeremaining"] / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(o.values["3timespent"] / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(o.values["4diff"] / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(o.values["5originalestimateremaining"] / 3600, e.maxFractionDigits)) + ",";
                var d = o.values["6progress"];
                if (d.timespent + d.estimate == 0) i += "\n"; else {
                    var c = Math.round(100 * d.timespent / (d.estimate + d.timespent));
                    i += this.enquote(DrawHelper.formatDecimal(c, e.maxFractionDigits) + "%") + "\n"
                }
            } else i += moment(u.workDate).format(CsvView.dateTimeFormat) + ",", "IssuePassedTimeByStatus" == e.pivotTableType && (i += moment(u.toDate).format(CsvView.dateTimeFormat) + ","), i += u.author.name + ",", i += (this.escape(u.author.displayName) || "") + ",", i += this.enquote(DrawHelper.formatDecimal(u.timeSpentSeconds / 3600, e.maxFractionDigits)) + ",", i += this.escape((u._issue ? u._issue.key + " " : "") + ("IssuePassedTimeByStatus" == e.pivotTableType ? o.columnKey.keyValue : u.comment || "")) + "\n", a += u.timeSpentSeconds
        }
    }
    for (var m = "", h = 0, n = 0; n < e.moreFields.length; n++) {
        var r = e.moreFields[n];
        ["workeduser", "workeddate"].indexOf(r.id) < 0 && h++
    }
    for (var p = "TimeTracking" == e.pivotTableType ? 5 : 8, n = 0; n < p + h; n++) m += ",";
    if ("IssuePassedTimeByStatus" == e.pivotTableType && (m += ","), i += "Total" + m, "TimeTracking" == e.pivotTableType) {
        i += this.enquote(DrawHelper.formatDecimal(t.totals["1timeoriginalestimate"].sum / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(t.totals["2esttimeremaining"].sum / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(t.totals["3timespent"].sum / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(t.totals["4diff"].sum / 3600, e.maxFractionDigits)) + ",", i += this.enquote(DrawHelper.formatDecimal(t.totals["5originalestimateremaining"].sum / 3600, e.maxFractionDigits)) + ",";
        var d = t.totals["6progress"].value;
        if (d.timespent + d.estimate == 0) i += "\n"; else {
            var c = Math.round(100 * d.timespent / (d.estimate + d.timespent));
            i += this.enquote(DrawHelper.formatDecimal(c, e.maxFractionDigits) + "%") + "\n"
        }
    } else i += this.enquote(DrawHelper.formatDecimal(a / 3600, e.maxFractionDigits)) + ",\n";
    return i
}, CsvView.prototype.download = function (e) {
    var t = "\ufeff" + this.generate(e), i = new Blob([t], {encoding: "utf-8", type: "application/vnd.ms-excel;charset=utf-8;"});
    saveAs(i, "exportData.csv")
}, ExcelView.dateTimeFormat = "YYYY-MM-DD HH:mm:ss", ExcelView.prototype.fieldValue = function (e, t, i) {
    var n = /com\.atlassian\.greenhopper\.service\.sprint\.Sprint@[\d\w]+\[(.+)?\]/, r = i.maxFractionDigits, a = i.hostBaseUrl || "", s = function (e) {
        var t;
        if (angular.isObject(e) && e.hasOwnProperty("name")) return e.name;
        if (angular.isObject(e) && e.hasOwnProperty("key")) return "<a href='" + a + "/browse/" + e.key + "'>" + e.key + "</a>";
        if (angular.isObject(e) && e.hasOwnProperty("value")) return e.value + (e.hasOwnProperty("child") ? ":" + s(e.child) : "");
        if (angular.isString(e) && (t = e.match(n))) {
            for (var i = t[1].split(","), r = 0; r < i.length; r++) {
                var o = i[r];
                if (0 == o.indexOf("name=")) return o.substr(5)
            }
            return ""
        }
        return e
    }, o = t.id || t;
    this.field = function (e) {
        var i = e.fields[o];
        return t && t.schema && "com.pyxis.greenhopper.jira:gh-epic-link" == t.schema.custom && (i ? i = {key: i} : "Epic" == e.fields.issuetype.name && (i = {key: e.key})), "project" == o && (i = ""), i || (i = "parent" == o ? {key: e.key} : "projectcategory" == o && e.fields.project.projectCategory ? e.fields.project.projectCategory : ""), i
    }(e);
    var l = function (e) {
        if (TimesheetUtils.isDate(e)) return moment(e).format(ExcelView.dateTimeFormat);
        if (Array.isArray(e)) {
            var t = "";
            return e.length > 0 && (e[0].inwardIssue || e[0].outwardIssue) ? t = e.map(function (e) {
                return e.inwardIssue ? e.type.inward + " " + s(e.inwardIssue) : e.type.outward + " " + s(e.outwardIssue)
            }).join(", ") : e.forEach(function (e) {
                t.length > 0 && (t += ", "), t += s(e)
            }), t
        }
        return s(e)
    }(this.field);
    return -1 != ["timeestimate", "timeoriginalestimate", "timespent"].indexOf(o) && "" != l && (l = DrawHelper.formatDecimal((l || 0) / 3600, r) + "h"), l
}, ExcelView.prototype.generate = function (e) {
    var t = e.hostBaseUrl || "", i = function (e, i) {
        return "<a href='" + t + e + "'>" + i + "</a>"
    }, n = PivotTableFactory.createPivotTable(e), r = "<style>\n";
    r += "\x3c!--br\n", r += "    {mso-data-placement:same-cell;}\n", r += "\x3c!--table\n";
    var a = 1234.5.toLocaleString().match(/\d+(\D)?\d+(\D)\d+/);
    r += '    {mso-displayed-decimal-separator:"\\' + a[2] + '";', r += (a[1] ? '\n    mso-displayed-thousand-separator:"\\' + a[1] + '";' : "") + "}\n", r += "--\x3e\n", r += "</style>\n", r += "<table>\n", r += "  <tr>\n", r += "    <td>Project</td>\n", r += "    <td>Issue Type</td>\n", r += "    <td>Key</td>\n", r += "    <td>Summary</td>\n", r += "    <td>Priority</td>\n";
    for (var s = 0; s < e.moreFields.length; s++) {
        var o = e.moreFields[s];
        ["workeduser", "workeddate"].indexOf(o.id) < 0 && (r += "    <td>" + o.name + "</td>\n")
    }
    "TimeTracking" == e.pivotTableType ? (r += "    <td>Original Estimate (h)</td>\n", r += "    <td>Est. Time Remaining (h)</td>\n", r += "    <td>Time Spent (h)</td>\n", r += "    <td>Variance (h)</td>\n", r += "    <td>Original Estimate Remaining (h)</td>\n", r += "    <td>Progress</td>\n") : (r += "    <td>Date Started</td>\n", "IssuePassedTimeByStatus" == e.pivotTableType && (r += "    <td>Date Ended</td>\n"), r += "    <td>Username</td>\n", r += "    <td>Display Name</td>\n", r += "    <td>Time Spent (h)</td>\n", "IssuePassedTimeByStatus" == e.pivotTableType ? r += "    <td>Status</td>\n" : r += "    <td>Work Description</td>\n"), r += "  </tr>\n";
    var l = 0;
    for (var s in this.allIssues) {
        var u = n.add(this.allIssues[s]);
        for (var s in u) {
            r += "  <tr>\n";
            var d = u[s], c = d.rowKey.issue, m = d.rowKey.worklog || d.worklog;
            r += "    <td>" + c.fields.project.name + "</td>\n", r += "    <td>" + c.fields.issuetype.name + "</td>\n", r += "    <td>" + i("/browse/" + c.key, c.key) + "</td>\n", r += "    <td>" + i("/browse/" + c.key, c.fields.summary) + "</td>\n", r += "    <td>" + this.fieldValue(c, "priority", e) + "</td>\n";
            for (var s = 0; s < e.moreFields.length; s++) {
                var o = e.moreFields[s];
                ["workeduser", "workeddate"].indexOf(o.id) < 0 && ("workcreated" == o.id ? r += "    <td>" + moment(m.created).format(ExcelView.dateTimeFormat) + "</td>\n" : r += "    <td>" + this.fieldValue(c, o, e) + "</td>\n")
            }
            if ("TimeTracking" == e.pivotTableType) {
                r += "    <td>" + DrawHelper.formatDecimal(d.values["1timeoriginalestimate"] / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(d.values["2esttimeremaining"] / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(d.values["3timespent"] / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(d.values["4diff"] / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(d.values["5originalestimateremaining"] / 3600, e.maxFractionDigits) + "</td>\n";
                var h = d.values["6progress"];
                if (h.timespent + h.estimate == 0) r += "    <td></td>\n"; else {
                    var p = Math.round(100 * h.timespent / (h.estimate + h.timespent));
                    r += "    <td>" + DrawHelper.formatDecimal(p, e.maxFractionDigits) + "%</td>\n"
                }
            } else r += "    <td>" + moment(m.workDate).format(ExcelView.dateTimeFormat) + "</td>\n", "IssuePassedTimeByStatus" == e.pivotTableType && (r += "    <td>" + moment(m.toDate).format(ExcelView.dateTimeFormat) + "</td>\n"), r += "    <td>" + m.author.name + "</td>\n", r += "    <td>" + (m.author.displayName || "") + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(m.timeSpentSeconds / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + (m._issue ? i("/browse/" + m._issue.key, m._issue.key) + " " : "") + ("IssuePassedTimeByStatus" == e.pivotTableType ? d.columnKey.keyValue : m.comment || "") + "</td>\n", r += "  </tr>\n", l += m.timeSpentSeconds
        }
    }
    r += "  <tr>\n", r += "    <td>Total</td>\n";
    for (var f = 0, s = 0; s < e.moreFields.length; s++) {
        var o = e.moreFields[s];
        ["workeduser", "workeddate"].indexOf(o.id) < 0 && f++
    }
    for (var _ = "TimeTracking" == e.pivotTableType ? 4 : 7, s = 0; s < _ + f; s++) r += "    <td></td>\n";
    if ("IssuePassedTimeByStatus" == e.pivotTableType && (r += "    <td></td>\n"), "TimeTracking" == e.pivotTableType) {
        r += "    <td>" + DrawHelper.formatDecimal(n.totals["1timeoriginalestimate"].sum / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(n.totals["2esttimeremaining"].sum / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(n.totals["3timespent"].sum / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(n.totals["4diff"].sum / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td>" + DrawHelper.formatDecimal(n.totals["5originalestimateremaining"].sum / 3600, e.maxFractionDigits) + "</td>\n";
        var h = n.totals["6progress"].value;
        if (h.timespent + h.estimate == 0) r += "    <td></td>\n"; else {
            var p = Math.round(100 * h.timespent / (h.estimate + h.timespent));
            r += "    <td>" + DrawHelper.formatDecimal(p, e.maxFractionDigits) + "%</td>\n"
        }
    } else r += "    <td>" + DrawHelper.formatDecimal(l / 3600, e.maxFractionDigits) + "</td>\n", r += "    <td></td>\n";
    return r += "  </tr>\n", r += "</table>\n"
}, ExcelView.prototype.download = function (e) {
    var t = this.generate(e), i = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n';
    i += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=utf-8">', i += "<head>\n", i += "\x3c!--[if gte mso 9]>\n", i += "<xml>\n", i += "<x:ExcelWorkbook>", i += "<x:ExcelWorksheets>", i += "<x:ExcelWorksheet>", i += "<x:Name>", i += "{worksheet}", i += "</x:Name>", i += "<x:WorksheetOptions>", i += "<x:DisplayGridlines/>", i += "</x:WorksheetOptions>", i += "</x:ExcelWorksheet>", i += "</x:ExcelWorksheets>", i += "</x:ExcelWorkbook>\n", i += "</xml>\n", i += "<![endif]--\x3e\n", i += "</head>\n", i += "<body>\n", i += t, i += "</body>\n", i += "</html>\n";
    var n = [i], r = new Blob(n, {encoding: "utf-8", type: "application/vnd.ms-excel;charset=utf-8;"});
    if (!document.documentMode) {
        var a;
        a = -1 != navigator.userAgent.indexOf("Safari") && -1 == navigator.userAgent.indexOf("Chrome") ? "data:application/vnd.ms-excel;charset=utf-8;filename=exportData.xls;base64," + AJS.$.base64.encode(i) : URL.createObjectURL(r);
        var s = document.createElement("a");
        "string" == typeof s.download ? (s.href = a, s.download = "exportData.xls", document.body.appendChild(s), s.click(), setTimeout(function () {
            document.body.removeChild(s)
        }, 100)) : window.open(a)
    } else window.navigator.msSaveOrOpenBlob(r, "exportData.xls")
}, PivotColumn.prototype.add = function (e, t) {
    if (this.entries.push(e), "number" == typeof t) this.sum += t; else if (angular.isObject(t) && Object.keys(t).length > 0) {
        this.value = this.value || {};
        for (var i in t) "number" == typeof t[i] && (this.value[i] = t[i] + (this.value[i] || 0))
    }
}, PivotColumn.prototype.remove = function (e, t) {
    for (var i = 0; i < this.entries.length; i++) if (this.entries[i].worklog.id === e.worklog.id) {
        this.entries.splice(i, 1);
        break
    }
    if ("number" == typeof t) this.sum -= t; else if (angular.isObject(t) && Object.keys(t).length > 0) {
        this.value = this.value || {};
        for (var n in t) "number" == typeof t[n] && (this.value[n] = t[n] - (this.value[n] || 0))
    }
}, PivotEntry.prototype.addColumn = function (e, t) {
    this.columnKeys.push(e), this.values[e.keyValue] = t
};
var PivotKey = {};
PivotKey.Generic = function (e, t, i) {
    this.keyName = e, this.keyValue = t, this.filterName = i
}, PivotKey.Issue = function (e, t) {
    this.issue = e, this.keyName = "issue", this.keyValue = this.issue.key, this.worklog = t
}, PivotKey.Issue.comparator = function (e, t) {
    if (null == e && null == t) return 0;
    if (null == e) return 1;
    if (null == t) return -1;
    var i = e.split("-"), n = t.split("-");
    if (1 == i.length && 1 == n.length) {
        var r = parseInt(i[0]), a = parseInt(n[0]), s = r - a;
        return s
    }
    if (1 == i.length) return 1;
    if (1 == n.length) return -1;
    for (var o = i[0], l = n[0], u = 0; u < o.length && u < l.length && !s; u++) s = o.charCodeAt(u) - l.charCodeAt(u);
    if (s) return s;
    var s = o.length - l.length;
    if (s) return s;
    var r = parseInt(i[1]), a = parseInt(n[1]), s = r - a;
    return s
}, PivotKey.User = function (e, t, i) {
    this.user = e.author, this.keyName = "user", this.keyValue = e.author ? e.author.name : "anonymous", this.options = i
}, PivotKey.User.comparator = function (e, t) {
    return StringComparator(e.keyValue, t.keyValue)
}, PivotKey.getStatus = function (e, t) {
    for (var i = TimesheetUtils.convertDate(e.started), n = t.fields.status.name, r = t.fields.status.id, a = new Date, s = t.changelog ? t.changelog : {}, o = s.histories ? s.histories : [], l = 0; l < o.length; l++) for (var u = o[l], d = u.items || [], c = TimesheetUtils.convertDate(u.created), m = 0; m < d.length; m++) {
        var h = d[m];
        "jira" == h.fieldtype && "status" == h.field && i < c && a > c && (n = h.fromString, r = h.from, a = c)
    }
    return {name: n, id: r}
}, PivotKey.getStatuses = function (e) {
    var t = e.changelog ? e.changelog : {}, i = t.histories ? t.histories : [], n = [];
    return i.map(function (e) {
        var t = TimesheetUtils.convertDate(e.created);
        (e.items || []).map(function (e) {
            if ("jira" == e.fieldtype && "status" == e.field) {
                var i = {id: e.from, name: e.fromString, date: t.getTime()};
                n.push(i)
            }
        })
    }), n.push({id: e.fields.status.id, name: e.fields.status.name, date: Date.now()}), TimesheetUtils.sortByProperty(n, "date"), n
}, PivotKey.getStatusKeys = function (e, t, i) {
    for (var n = PivotKey.getStatuses(t), r = e.timeSpentSeconds, a = e.workDate.getTime(), s = [], o = 0; o < n.length - 1 && a > n[o].date;) o++;
    for (; o < n.length - 1 && r > 0 && a < n[o].date; o++) {
        var l = n[o], u = i.startedTimeInStatus ? r : PivotKey.getTimeInStatus(new Date(a), new Date(l.date), i), d = {key: new PivotKey.Status(l.name, l.id, l.date), timespent: Math.min(r, u)};
        s.push(d), a = l.date, r -= d.timespent
    }
    if (r > 0) {
        var l = n[n.length - 1], d = {key: new PivotKey.Status(l.name, l.id, l.date), timespent: r};
        s.push(d)
    }
    return s
}, PivotKey.getTimeInStatus = function (e, t, i) {
    if (i.workingTimeInStatus) {
        var n = e.getTime();
        e.setHours(9, 0, 0, 0), n = Math.max(n, e.getTime());
        var r = t.getTime();
        t.setHours(17, 0, 0, 0), n = Math.min(n, t.getTime()), r = Math.min(r, t.getTime());
        var a = new Date(n), s = new Date(n);
        s.setHours(17, 0, 0, 0);
        for (var o = 0; a.getTime() < r;) {
            if (!TimesheetUtils.isWeekend(a, i)) {
                o += (Math.min(s.getTime(), r) - Math.min(s.getTime(), a.getTime())) / 1e3
            }
            var l = a.getDate() + 1;
            a.setDate(l), a.setHours(9, 0, 0, 0, 0), s.setDate(l)
        }
        return o
    }
    return (t.getTime() - e.getTime()) / 1e3
}, PivotKey.Status = function (e, t, i) {
    this.keyValue = e, this.statusId = t, this.statusDate = i
}, PivotKey.Status.comparator = function (e, t) {
    var i = ["10000", "1", "3", "4", "5", "6", "400", "401", "10001"];
    return i.indexOf(e.statusId) - i.indexOf(t.statusId)
}, PivotKey.HourOfTheDay = function (e) {
    this.keyName = "dayOfTheWeek", this.date = TimesheetUtils.truncateMinutes(e), this.keyValue = this.date.getTime()
}, PivotKey.DayOfTheWeek = function (e) {
    this.keyName = "dayOfTheWeek", this.date = TimesheetUtils.truncateTime(e), this.keyValue = this.date.getTime()
}, PivotKey.WeekOfTheYear = function (e, t) {
    this.keyName = "weekOfTheYear", this.startDate = TimesheetUtils.getPrevMonday(e, t.reportingDay), this.endDate = TimesheetUtils.addDays(e, 7), this.weekNumber = TimesheetUtils.getNormalizedWeekNumber(e), this.keyValue = this.startDate.getTime()
}, PivotKey.MonthOfTheYear = function (e) {
    this.keyName = "monthOfTheYear", this.startDate = TimesheetUtils.getFirstDayOfTheMonth(e), this.endDate = TimesheetUtils.getLastDayOfTheMonth(e), this.monthKey = TimesheetUtils.getMonthKey(e), this.keyValue = this.startDate.getTime()
}, PivotKey.NULL_VALUE = "&nbsp;", PivotKey.sprintRegex = /com\.atlassian\.greenhopper\.service\.sprint\.Sprint@[\d\w]+\[(.+)?\]/, PivotKey.getNameOrKey = function (e) {
    var t;
    if (angular.isObject(e) && e.hasOwnProperty("name")) return e.name;
    if (angular.isObject(e) && e.hasOwnProperty("key")) return e.key;
    if (angular.isObject(e) && e.hasOwnProperty("value")) return e.value + (e.hasOwnProperty("child") ? ":" + PivotKey.getNameOrKey(e.child) : "");
    if (angular.isString(e) && (t = e.match(PivotKey.sprintRegex))) {
        for (var i = t[1].split(","), n = 0; n < i.length; n++) {
            var r = i[n];
            if (0 == r.indexOf("name=")) return r.substr(5)
        }
        return PivotKey.NULL_VALUE
    }
    return e
}, PivotKey.getValue = function (e) {
    if (TimesheetUtils.isDate(e)) return TimesheetUtils.truncateTime(moment(e).toDate());
    if (Array.isArray(e)) {
        var t = "";
        return e.forEach(function (e) {
            t.length > 0 && (t += ", "), t += PivotKey.getNameOrKey(e)
        }), t
    }
    return PivotKey.getNameOrKey(e)
}, PivotKey.getFieldValueObject = function (e, t, i) {
    var n = i.fields[e];
    return t && t.schema && "com.pyxis.greenhopper.jira:gh-epic-link" == t.schema.custom && (n ? n = {key: n} : "Epic" == i.fields.issuetype.name && (n = {key: i.key})), n || (n = "issue" == e ? i : "parent" == e ? {
        key: i.key,
        fields: {summary: i.fields.summary, resolution: i.fields.resolution}
    } : "projectcategory" == e && i.fields.project.projectCategory ? i.fields.project.projectCategory : PivotKey.NULL_VALUE), n
}, PivotKey.getFieldAndValue = function (e, t, i, n) {
    var r, a;
    switch (t) {
        case"workeduser":
            r = n.author || PivotKey.NULL_VALUE, a = r.displayName || r.name || PivotKey.NULL_VALUE;
            break;
        case"workeddate":
            r = a = n.started || PivotKey.NULL_VALUE;
            break;
        case"workcreated":
            r = a = n.created || PivotKey.NULL_VALUE;
            break;
        case"commentfirstword":
            if (n.comment) {
                var s = n.comment.indexOf(" ");
                r = s > 0 ? n.comment.substring(0, s) : n.comment
            } else r = PivotKey.NULL_VALUE;
            a = r;
            break;
        case"worklabel":
            var o = TimesheetUtils.getTags(n.comment);
            o && o.length > 0 ? (o.sort(), r = o.join(", ")) : r = PivotKey.NULL_VALUE, a = r;
            break;
        default:
            r = PivotKey.getFieldValueObject(t, i, e), a = PivotKey.getValue(r)
    }
    return [r, a]
}, PivotKey.GroupByField = function (e, t, i) {
    var n = i.groupByField, r = i.groupByFieldObject;
    "issue" != n && (this._issue = e), this._worklog = t;
    var a = i.categorizeByField ? PivotKey.getFieldAndValue(e, i.categorizeByField, i.categorizeByFieldObject, t) : [{name: ""}, ""];
    this.project = a[0];
    var s = PivotKey.getFieldAndValue(e, n, r, t);
    this.field = s[0], this.keyValue = (i.categorizeByField ? a[1] + ":" : "") + s[1], this.keyName = n
}, PivotKey.GroupByField.comparator = StringComparator, PivotRow.prototype.add = function (e) {
    for (var t = 0; t < e.columnKeys.length; t++) {
        var i = e.columnKeys[t], n = e.values[i.keyValue];
        PivotTable.getOrCreate(this.columns, i, PivotColumn).add(e, n)
    }
    "number" == typeof e.value && (this.sum += e.value), void 0 !== e.value && this.data.push(e)
}, PivotRow.prototype.remove = function (e) {
    for (var t = 0; t < e.columnKeys.length; t++) {
        var i = e.columnKeys[t], n = e.values[i.keyValue];
        this.columns[i.keyValue].remove(e, n)
    }
    if ("number" == typeof e.value && (this.sum -= e.value), void 0 !== e.value) for (var t = 0; t < this.data.length; t++) if (this.data[t].worklog.id === e.worklog.id) {
        this.data.splice(t, 1);
        break
    }
}, WorkedTimePivotStrategy.getStrategyOptions = function (e) {
    var t = {startDate: e.startDate, endDate: e.endDate};
    return e.worklogAuthors ? t.worklogAuthors = e.worklogAuthors : e.user && (t.worklogAuthors = [e.user]), t.groupByField = e.groupByField, t.groupByFieldObject = e.groupByFieldObject, t.categorizeByField = e.categorizeByField, t.categorizeByFieldObject = e.categorizeByFieldObject, t.pivotByStatus = "IssueWorkedTimeByStatus" == e.pivotTableType, t
}, WorkedTimePivotStrategy.prototype.getEntries = function (e) {
    for (var t = [], i = e.worklog || e.fields.worklog, n = 0; n < i.worklogs.length; n++) {
        var r = i.worklogs[n], a = new this.rowKeyClass(e, r, this.options), s = !0,
            o = r.workDate = TimesheetUtils.convertDate(r.started, !this.configOptions.preserveStartedTime && r.author ? r.author.timeZone : null);
        if (this.options.startDate && (s = o >= this.options.startDate), this.options.endDate) {
            var l = TimesheetUtils.addDays(this.options.endDate, 1);
            s = s && o < l
        }
        var u = !this.options.worklogAuthors || r.author && this.options.worklogAuthors.indexOf(r.author.key ? r.author.key : r.author.name.toLowerCase()) >= 0;
        if (s && u) {
            var d;
            if (this.options.pivotByStatus) {
                var c = PivotKey.getStatusKeys(r, e, this.configOptions);
                d = new PivotEntry(a, c[0].key, r.timeSpentSeconds), d.values[c[0].key.keyValue] = c[0].timespent, d.worklog = r;
                for (var m = 1; m < c.length; m++) d.addColumn(c[m].key, c[m].timespent)
            } else {
                d = new WorkedTimePivotEntry(a, new this.columnKeyClass(r, e, this.options), r)
            }
            t.push(d)
        }
    }
    return t
}, TimeEntryStrategy.prototype.addEntry = function (e, t, i, n, r) {
    var a = new PivotKey.Generic("TimeEntry", "1started", "time"), s = new PivotKey.Generic("TimeEntry", "2timespent"), o = new PivotKey.Generic("TimeEntry", "3action");
    o.showStart = TimesheetUtils.sameDay(this.options.startDate, new Date);
    var l = new PivotEntry(t, a, n);
    l.worklog = i, l.addColumn(s, r), l.addColumn(o, l), e.push(l)
}, TimeEntryStrategy.prototype.getEntries = function (e) {
    for (var t = [], i = e.worklog || e.fields.worklog, n = 0; n < i.worklogs.length; n++) {
        var r = i.worklogs[n], a = new this.rowKeyClass(e, r, this.options), s = !0, o = r.workDate = TimesheetUtils.convertDate(r.started, r.author ? r.author.timeZone : null);
        if (this.options.startDate && (s = o >= this.options.startDate), this.options.endDate) {
            var l = TimesheetUtils.addDays(this.options.endDate, 1);
            s = s && o < l
        }
        var u = !this.options.worklogAuthors || r.author && this.options.worklogAuthors.indexOf(r.author.key ? r.author.key : r.author.name.toLowerCase()) >= 0;
        s && u && this.addEntry(t, a, r, o, r.timeSpentSeconds)
    }
    if (this.options.includeEmpty && 0 == t.length) {
        var a = new this.rowKeyClass(e, null, this.options);
        this.addEntry(t, a)
    }
    return t
}, IssueTimeStrategy.prototype.getEntries = function (e) {
    for (var t = [], i = e.worklog || e.fields.worklog, n = 0; n < i.worklogs.length; n++) {
        var r = i.worklogs[n], a = new this.rowKeyClass(e, r, this.configOptions), s = !0, o = r.workDate = TimesheetUtils.convertDate(r.started, r.author ? r.author.timeZone : null);
        if (this.options.startDate && (s = o >= this.options.startDate), this.options.endDate) {
            var l = TimesheetUtils.addDays(this.options.endDate, 1);
            s = s && o < l
        }
        var u = !this.options.worklogAuthors || r.author && this.options.worklogAuthors.indexOf(r.author.key ? r.author.key : r.author.name.toLowerCase()) >= 0;
        if (s && u) {
            var d = new PivotKey.Generic("TimeEntry", "1started", "time"), c = new PivotKey.Generic("TimeEntry", "2timespent"), m = new PivotEntry(a, d, o);
            m.worklog = r, m.addColumn(c, r.timeSpentSeconds), t.push(m)
        }
    }
    return t
}, PassedTimePivotStrategy.prototype.getEntries = function (e) {
    for (var t = [], i = new this.rowKeyClass(e, null, this.options), n = moment(this.options.startDate).unix(), r = moment(e.fields.created).unix(), a = new Date(1e3 * Math.max(n, r)), s = TimesheetUtils.addDays(this.options.endDate, this.configOptions.workingTimeInStatus ? 0 : 1).getTime(), o = new Date(Math.min(s, Date.now())), l = {
        workDate: a,
        timeSpentSeconds: PivotKey.getTimeInStatus(a, o, this.configOptions)
    }, u = PivotKey.getStatusKeys(l, e, this.configOptions), d = a.getTime(), c = 0; c < u.length; c++) {
        var m = new PivotEntry(i, u[c].key, u[c].timespent), h = moment(d).format(ExcelView.dateTimeFormat), p = u[c].key.statusDate, f = new Date(Math.min(p, o.getTime())),
            _ = moment(f).format(ExcelView.dateTimeFormat);
        m.worklog = {comment: h + " - " + _, workDate: d, toDate: f, author: {name: "", displayName: ""}, timeSpentSeconds: m.value}, t.push(m), d = p
    }
    return t
}, TimeTrackingStrategy.prototype.getEntries = function (e) {
    var t = new this.rowKeyClass(e, null, this.options), i = new PivotKey.Generic("PlannedVsActual", "1timeoriginalestimate"), n = new PivotKey.Generic("PlannedVsActual", "2esttimeremaining"),
        r = new PivotKey.Generic("PlannedVsActual", "3timespent"), a = new PivotKey.Generic("PlannedVsActual", "4diff"), s = new PivotKey.Generic("PlannedVsActual", "5originalestimateremaining"),
        o = new PivotKey.Generic("PlannedVsActual", "6progress", "timeTracking"), l = e.fields.timeoriginalestimate || 0, u = new PivotEntry(t, i, l), d = e.fields.timespent || 0,
        c = e.fields.timeestimate || 0;
    return u.addColumn(n, c), u.addColumn(r, d), u.addColumn(a, l - d - c), u.addColumn(s, Math.max(0, l - d)), u.addColumn(o, {estimate: c, timespent: d}), [u]
}, PivotTable.prototype.sortedColumns = function () {
    if (null == this._sortedColumns) {
        this._sortedColumns = [];
        for (var e = Object.keys(this.totals), t = 0; t < e.length; t++) this._sortedColumns.push(this.totals[e[t]]);
        this.pivotStrategy.columnKeyClass && this.pivotStrategy.columnKeyClass.hasOwnProperty("comparator") && TimesheetUtils.sortByProperty(this._sortedColumns, "columnKey", !1, this.pivotStrategy.columnKeyClass.comparator)
    }
    return this._sortedColumns
}, PivotTable.prototype.sortedRows = function () {
    if (null == this._sortedRows) {
        var e = TimesheetUtils.getPerformance(), t = (e.now(), Object.keys(this.rows));
        this.pivotStrategy.rowKeyClass.hasOwnProperty("comparator") && t.sort(this.pivotStrategy.rowKeyClass.comparator);
        e.now();
        this._sortedRows = [], t.map(function (e) {
            this._sortedRows.push(this.rows[e])
        }, this);
        e.now();
        if (!this.pivotStrategy.options.showWeekends) for (var i in this.totals) if (this.totals[i].columnKey.isWeekend && !this.totals[i].sum) {
            delete this.totals[i];
            for (var n = 0; n < this._sortedRows.length; n++) delete this._sortedRows[n].columns[i];
            for (var n = 0; n < this._sortedColumns.length; n++) this._sortedColumns[n].columnKey.keyValue == i && this._sortedColumns.splice(n, 1)
        }
    }
    return this._sortedRows
}, PivotTable.prototype.addEntry = function (e) {
    var t = this.pivotStrategy.pivotRowType || PivotRow, i = this;
    PivotTable.getOrCreate(this.rows, e.rowKey, t, function () {
        i.pivotStrategy.getColumnsFunction && (this.columns = i.pivotStrategy.getColumnsFunction()), this.moreFields = i.moreFields
    }).add(e);
    for (var n = 0; n < e.columnKeys.length; n++) {
        var r = e.columnKeys[n], a = e.values[r.keyValue];
        PivotTable.getOrCreate(this.totals, r, PivotColumn, function () {
            this.isTotalColumn = !0
        }).add(e, a)
    }
    "number" == typeof e.value && (this.sum += e.value), this._sortedRows = null
}, PivotTable.prototype.removeEntry = function (e) {
    this.rows[e.rowKey.keyValue].remove(e);
    for (var t = 0; t < e.columnKeys.length; t++) {
        var i = e.columnKeys[t], n = e.values[i.keyValue];
        this.totals[i.keyValue].remove(e, n)
    }
    "number" == typeof e.value && (this.sum -= e.value), this._sortedRows = null
}, PivotTable.prototype.add = function (e) {
    var t = this.pivotStrategy.getEntries(e);
    t.length > 0 && this.num++;
    for (i in t) {
        var n = t[i];
        this.addEntry(n)
    }
    return t
};
var PivotTableType = {TimeEntry: 0, Timesheet: 1, IssueWorkedTimeByUser: 2, IssueWorkedTimeByStatus: 3, TimeTracking: 4, PieChart: 5, IssuePassedTimeByStatus: 6}, PivotTableFactory = {};
PivotTableFactory.createPivotTable = function (e, t) {
    var i, n = e.groupByField, r = function (e, t, i, n) {
        return t ? new e(PivotKey.GroupByField, i, n) : new e(PivotKey.Issue, i, n)
    };
    switch (PivotTableType[e.pivotTableType]) {
        case PivotTableType.PieChart:
        case PivotTableType.IssueWorkedTimeByUser:
            i = r(WorkedTimePivotStrategy, n, PivotKey.User, e);
            break;
        case PivotTableType.IssueWorkedTimeByStatus:
            i = r(WorkedTimePivotStrategy, n, PivotKey.Status, e);
            break;
        case PivotTableType.IssuePassedTimeByStatus:
            i = r(PassedTimePivotStrategy, n, PivotKey.Status, e);
            break;
        case PivotTableType.TimeTracking:
            i = n ? new TimeTrackingStrategy(PivotKey.GroupByField, e) : new TimeTrackingStrategy(PivotKey.Issue, e);
            break;
        case PivotTableType.Timesheet:
            var a = e.monthView, s = a ? PivotKey.WeekOfTheYear : PivotKey.DayOfTheWeek;
            i = r(TimesheetStrategy, n, this.createPivotKey(e, s), e);
            var o = a ? i.getMonthColumns : i.getWeekColumns;
            i.getColumnsFunction = this.createGetColumnFunction(i, e, o);
            break;
        case PivotTableType.TimeEntry:
            i = new TimeEntryStrategy(PivotKey.Issue, e);
            break;
        default:
            if ("IssueTime" != e.pivotTableType) throw"Unknown PivotTableType " + e.pivotTableType;
            i = new IssueTimeStrategy(PivotKey.Issue, e)
    }
    var l = new PivotTable(i, t);
    return l.moreFields = e.moreFields, l
}, PivotTable.getOrCreate = function (e, t, i, n) {
    var r = e[t.keyValue];
    return void 0 == r && (r = new i(t), n && n.apply(r), e[t.keyValue] = r), r
}, PivotTableFactory.createGetColumnFunction = function (e, t, i) {
    var n = i;
    if (null != t) switch (t.sum) {
        case"month":
            n = e.getYearColumns;
            break;
        case"week":
            n = e.getMonthColumns;
            break;
        case"day":
            n = e.getWeekColumns
    }
    return n
}, PivotTableFactory.createPivotKey = function (e, t) {
    var i = t;
    if (null != e) switch (e.sum) {
        case"month":
            i = PivotKey.MonthOfTheYear;
            break;
        case"week":
            i = PivotKey.WeekOfTheYear;
            break;
        case"day":
            i = PivotKey.DayOfTheWeek
    }
    return i
}, TimesheetStrategy.getStrategyOptions = function (e) {
    var t = e.monthView, i = e.endDate ? TimesheetUtils.addDays(e.endDate, -6) : TimesheetUtils.getLastMondayDate(e.reportingDay),
        n = e.startDate ? moment(e.startDate).toDate() : t ? TimesheetUtils.addDays(i, -21) : i,
        r = e.endDate ? moment(e.endDate).toDate() : t ? TimesheetUtils.addDays(n, 27) : TimesheetUtils.addDays(n, 6), a = {startDate: n, endDate: r};
    return e.worklogAuthors ? a.worklogAuthors = e.worklogAuthors : e.user && (a.worklogAuthors = [e.user]), a.includeEmpty = e.includeEmpty, a.reportingDay = e.reportingDay, a.showWeekends = e.showWeekends, a.groupByField = e.groupByField, a.groupByFieldObject = e.groupByFieldObject, a.categorizeByField = e.categorizeByField, a.categorizeByFieldObject = e.categorizeByFieldObject, a
}, TimesheetStrategy.prototype.getEntries = function (e) {
    for (var t = [], i = e.worklog || e.fields.worklog, n = 0; n < i.worklogs.length; n++) {
        var r = i.worklogs[n], a = r.workDate = TimesheetUtils.convertDate(r.started, !this.configOptions.preserveStartedTime && r.author ? r.author.timeZone : null),
            s = TimesheetUtils.addDays(this.options.endDate, 1);
        if (a >= this.options.startDate && a < s && (!this.options.worklogAuthors || r.author && this.options.worklogAuthors.indexOf(r.author.key ? r.author.key : r.author.name.toLowerCase()) >= 0)) {
            var o = new this.rowKeyClass(e, r, this.options), l = new this.columnKeyClass(a, this.options), u = new WorkedTimePivotEntry(o, l, r);
            t.push(u)
        }
    }
    if (this.options.includeEmpty && 0 == t.length && ["workeduser", "workeddate", "workcreated"].indexOf(this.options.groupByField) < 0) {
        var o = new this.rowKeyClass(e, null, this.options), u = new EmptyPivotEntry(o);
        t.push(u)
    }
    return t
}, TimesheetStrategy.prototype.getYearColumns = function () {
    return this.getColumns(TimesheetUtils.getMonthForYear)
}, TimesheetStrategy.prototype.getMonthColumns = function () {
    return this.getColumns(TimesheetUtils.getWeeksForMonth)
}, TimesheetStrategy.prototype.getWeekColumns = function () {
    return this.getColumns(TimesheetUtils.getDatesForWeek)
}, TimesheetStrategy.prototype.getDayColumns = function () {
    return this.getColumns(TimesheetUtils.getHoursForDay)
}, TimesheetStrategy.prototype.getColumns = function (e) {
    return e(this.options, this.configOptions).map(function (e) {
        var t = new this.columnKeyClass(moment(e.date).toDate(), this.options);
        return t.isToday = e.isToday, t.isWeekend = e.isWeekend, t
    }, this).reduce(function (e, t) {
        return e[t.keyValue] = new PivotColumn(t), e
    }, {})
}, app.factory("flightRecorder", ["$http", "$q", "configurationService", "loggedInUser", "projectKey", "timesheetParams", "applicationLoggingService", "pivottableService", function (e, t, i, n, r, a, s, o) {
    var l = function () {
        return moment(new Date).format("YYYY-MMM-DD_HH-mm-ss") + ".txt"
    };
    this.enabled = !1, this.supportData = {}, this.fileName = null;
    var u = t.defer(), d = this;
    i.getConfiguration().then(function (e) {
        d.config = e, e.trackSupportData.val && d.setEnabled(!0), u.resolve(d)
    }), n.then(function (e) {
        d.loggedInUser = e
    }), r.then(function (e) {
        d.projectKey = e
    }), a.then(function (e) {
        d.timesheetParams = e
    });
    var c = window.RA || window.AP, m = c.request;
    return this.setEnabled = function (e) {
        this.enabled = e, e ? (d.startFile(), window.loggerUrl = window._loggerUrl, c.request = function (e) {
            m(d.wrapRequest(e))
        }) : (c.request = m, delete window.loggerUrl, d.supportData = {})
    }, this.startFile = function () {
        for (this.fileName = l(); this.supportData.hasOwnProperty(this.fileName);) this.fileName = l();
        this.supportData[this.fileName] = []
    }, this.cookie = function (e) {
        this.enabled && (this.cookies = angular.copy(e))
    }, this.wrapRequest = function (e) {
        var t = {action: "rest", request: {url: e.url, data: e.data}}, i = e.success, n = e.error;
        return e.success = function (e) {
            t.response = e, d.supportData[d.fileName].push(t), i(e)
        }, e.error = function (e) {
            t.error = e, d.supportData[d.fileName].push(t), n(e, null, null)
        }, e
    }, this.stringify = function (e) {
        return "object" == typeof e ? JSON.stringify(e) : "'" + (e || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'"
    }, this.generateJs = function () {
        var e = "//" + window.deployedDate + "\n";
        if (e += "AJS = window.AJS || {$: window.$};\n", e += "window.storeWorklogEnabled = true;\n", this.config.cacheWorklog && this.config.cacheWorklog.val && (!this.config.storeWorklog || !this.config.storeWorklog.val) && o.allIssues) {
            var t = window.localStorage.getItem("updatedSince");
            t && (e += 'window.localStorage.setItem("updatedSince", ' + t + ");\n");
            var i = window.localStorage.getItem("deletedSince")
            ;i && (e += 'window.localStorage.setItem("deletedSince", ' + i + ");\n");
            var n = function (t, i) {
                i && (e += 'window.localStorage.setItem("' + t + '", LZString.compressToUTF16(' + d.stringify(LZString.decompressFromUTF16(i)) + "));\n")
            };
            o.allIssues.forEach(function (e) {
                var t = "i" + e.id, i = window.localStorage.getItem(t);
                if (n(t, i), e._subTaskIds) for (var r = 0; r < e._subTaskIds.length; r++) t = "i" + e._subTaskIds[r], i = window.localStorage.getItem(t), n(t, i)
            })
        }
        e += "AP = {\n", e += "  flag: {\n", e += "      create: function() {\n", e += "          debugger;\n", e += "      }\n", e += "  },\n", e += "  getUser: function(callback) {\n", e += "    setTimeout(function() {\n", e += '      callback({id: "' + this.loggedInUser.name + '", key: "' + this.loggedInUser.key + '"});\n', e += "    });\n", e += "  },\n", e += "  getLocation: function(callback) {\n", e += "    setTimeout(function() {\n", e += "      callback('" + s.baseUrl + (this.projectKey ? "/?project.key=" + this.projectKey : "") + "#!" + $.param(this.timesheetParams).replace(/'/g, "\\'") + "');\n", e += "    });\n", e += "  },\n", e += "  request: function(options) {\n", e += "    setTimeout(function() {\n", e += '      if (options.url == "/rest/api/2/user?expand=groups&key=' + this.loggedInUser.key + '") {\n', e += "        options.success(" + JSON.stringify(this.loggedInUser) + ");\n", e += '      } else if (options.url == "/rest/atlassian-connect/1/addons/timereports") {\n', e += "        options.success(" + JSON.stringify(s.license) + ");\n", e += '      } else if (options.url == "/rest/atlassian-connect/1/addons/timereports/properties/") {\n', e += "        options.success({keys: [{key: 'configuration'}]});\n", e += '      } else if (options.url == "/rest/atlassian-connect/1/addons/timereports/properties/configuration") {\n';
        var r = {};
        for (var a in this.config) r[a] = this.config[a].val;
        e += "        options.success({value: " + JSON.stringify(r) + "});\n";
        for (var l = d.supportData[Object.keys(d.supportData)[0]], u = 0; u < l.length; u++) {
            var c = l[u];
            "rest" == c.action && (e += '      } else if (options.url == "' + c.request.url + '") {\n', c.error ? e += "        options.error(" + this.stringify(c.error) + ");\n" : e += "        options.success(" + this.stringify(c.response) + ");\n")
        }
        return e += "      } else if (options.url.match(/rest\\/api\\/2\\/worklog\\/.+?since=/)) {\n", e += '        options.success(\'{"values": [], "until": 9000000000000,"lastPage": true}\');\n', e += "      } else {\n", e += '        throw new Error("Not recorded: " + options.url);\n', e += "      }\n", e += "    });\n", e += "  },\n", e += "  resize: function() {\n", e += "  },\n", e += "  messages: {\n", e += "    error: function() {\n", e += "      console.log.apply(console, arguments);\n", e += "    }\n", e += "  },\n", e += "  cookie: {\n", e += "    read: function(name, callback) {\n", e += "      callback(" + JSON.stringify(this.cookies) + ");\n", e += "    }\n", e += "  },\n", e += "  history: {\n", e += "    pushState: function(state) {\n", e += "      console.log('history state', state);\n", e += "    }\n", e += "  },\n", e += "  inlineDialog: {\n", e += "    hide: function(state) {\n", e += "    }\n", e += "  },\n", e += "  require: function(what, callback) {\n", e += '    throw new Error("Not implemented: " + what);\n', e += "  }\n", e += "}"
    }, this.zipBlob = function (e) {
        var t = new JSZip, i = this.generateJs();
        return t.file(this.fileName, i), t.generateAsync({type: "blob"})
    }, this.download = function () {
        this.zipBlob().then(function (e) {
            saveAs(e, "supportData.zi_")
        })
    }, this.sendEmail = function (i, n, r, a) {
        return (i ? d.zipBlob() : t.resolve()).then(function (t) {
            var i = new FormData;
            if (t) {
                var s = new File([t], "supportData.zi_");
                i.append("supportData", s)
            }
            return i.append("replyTo", n), i.append("title", r), i.append("content", a || ""), e.post(window.mailerUrl, i, {transformRequest: angular.identity, headers: {"Content-Type": void 0}})
        })
    }, u.promise
}]), app.service("jobService", ["$q", "$http", function (e, t) {
    this.data = {};
    var i = function (e) {
        return "jobs4" + e.key
    };
    this.getJobs = function (n) {
        var r = this, a = e.defer();
        return 0 == Object.keys(r.data).length ? t.get("/api/configuration/" + i(n)).success(function (e) {
            r.data.config = e || {}, a.resolve(r.data.config)
        }) : a.resolve(r.data.jobs), a.promise
    }, this.saveJob = function (n, r) {
        var a = e.defer(), s = this;
        return t.get("/api/configuration/" + i(r)).success(function (e) {
            var o = angular.copy(n);
            if (e) {
                var l = e.val;
                if (n.jobId) {
                    var u = s.indexById(n.jobId, l);
                    l.splice(u, 1, o)
                } else {
                    var d = l[l.length - 1];
                    o.jobId = d.jobId + 1, l.push(o)
                }
                t.put("/api/configuration/" + e.id, e).success(function (e) {
                    angular.copy(e, s.data.config), a.resolve(o)
                })
            } else o.jobId = 1, e = {key: i(r), val: [o]}, t.post("/api/configuration/", e).success(function (e) {
                angular.copy(e, s.data.config), a.resolve(o)
            })
        }), a.promise
    }, this.removeJob = function (n, r) {
        var a = e.defer(), s = this;
        return t.get("/api/configuration/" + i(r)).success(function (e) {
            if (e) {
                var i = e.val, r = s.indexById(n, i);
                i.splice(r, 1), i.length > 0 ? (e.val = i, t.put("/api/configuration/" + e.id, e).success(function (e) {
                    angular.copy(e, s.data.config), a.resolve(s.data.config)
                })) : t.delete("/api/configuration/" + e.id).success(function () {
                    angular.copy({}, s.data.config), a.resolve(s.data.config)
                })
            } else a.resolve(s.data.config)
        }), a.promise
    }, this.indexById = function (e, t) {
        var i = -1;
        return t.forEach(function (t, n) {
            if (e == t.jobId) return void(i = n)
        }), i
    }, this.resetState = function () {
        delete this.data.config
    }
}]), app.service("pivottableService", ["$q", "$timeout", "$interval", "$http", "applicationLoggingService", "configurationService", function (e, t, i, n, r, a) {
    var s = window.RA || window.AP;
    this.permissions = {}, this.userGroups = {}, this.worklogAuthors = [], this.epicFields = {}, this.workLabels = {}, this.issueWorklogs = [], this.issueChangelogs = [], this.findIssueByKeyPromises = [], this.getPermissionsPromises = [], r._ = Date.now(), this.getPivotTable = function (n, a) {
        a.groups && a.groups.length > 0 && !a.configOptions.storeWorklog && (a.worklogAuthors = this.worklogAuthors);
        var s = PivotTableFactory.createPivotTable(a, r), o = e.defer(), l = "IssueTime" == a.pivotTableType;
        if (l && !this.allIssues) this.allIssues = [], this.getIssueWorklog(a.issueKey, a.issueId).then(function (e) {
            this.addIssue(s, {key: a.issueKey, id: a.issueId, fields: {worklog: e}}), o.resolve(s)
        }.bind(this)); else if (!l && this.checkAndUpdateOptions(a)) {
            s.queue = {}, s.queueToAdd = [], s.matches = {};
            var u = this;
            if (this.groups && this.groups.length > 0 && (this.userGroups[n.key] = e.resolve(n), a.configOptions.storeWorklog || this.initWorklogAuthors(n)), a.configOptions.storeWorklog && -1 == ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(a.pivotTableType)) u.getAndProcessIssues(s, a).then(function () {
                angular.forEach(s.queueToAdd, function (e) {
                    u.addIssue(s, e)
                }), o.resolve(s)
            }, o.reject, o.notify); else {
                var d, c = TimesheetUtils.getPerformance(), m = (c.now(), 0), h = 0, p = i(function () {
                    d ? i.cancel(p) : o.notify(++h / 250)
                }, 250);
                this.onAllIssues(this.getQuery(s, a), function (e) {
                    c.now();
                    d || (h = e.total || 1, d = function () {
                        o.notify(++m / h)
                    });
                    var t = u.processIssues(s, a, e, d);
                    c.now();
                    return t
                }).then(function (t) {
                    if (!u.cancel(o)) {
                        var i = t.reduce(function (e, t) {
                            return e.concat(t)
                        });
                        c.now();
                        e.all(i).then(function () {
                            if (!u.cancel(o)) {
                                angular.forEach(s.queueToAdd, function (e) {
                                    u.addIssue(s, e)
                                }), o.resolve(s);
                                c.now()
                            }
                        }, o.reject)
                    }
                }, function (e) {
                    i.cancel(p), o.reject(e)
                })
            }
        } else {
            a.queue && (s.queue = a.queue), a.queueToAdd && (s.queueToAdd = a.queueToAdd), a.matches && (s.matches = a.matches);
            for (var f in this.allIssues) {
                s.add(this.allIssues[f])
            }
            "PieChart" == a.pivotTableType ? t(function () {
                o.resolve(s)
            }) : o.resolve(s)
        }
        return o.promise
    }, this.cancel = function (e) {
        return this._cancel && e ? (e.reject("cancelled"), this._cancel = !1, !0) : (e || (this._cancel = !0), !1)
    }, this.getAndProcessIssues = function (t, a) {
        var s = this, o = e.defer(), l = new TimesheetUtils.queryBuilder;
        null != a.startDate && "" != a.startDate && l.addQuery("start", s.addDays(a.startDate, -1)), null != a.endDate && "" != a.endDate && l.addQuery("end", s.addDays(a.endDate, 2)), a.user && l.addQuery("author", a.user), a.groups && l.addQuery("groups", a.groups), null != a.jql ? l.addQuery("jql", a.jql) : a.filterOrProjectId && l.addQuery("filterOrProjectId", a.filterOrProjectId), a.projectKey && l.addQuery("projectKey", a.projectKey), a.sumSubTasks && l.addQuery("sumSubTasks", a.sumSubTasks);
        var u = this.getMoreFields(a);
        u.length > 0 && l.addQuery("moreFields", u);
        var d = "project,issuetype,resolution,summary,priority,status,parent,issuelinks";
        this.initEpicLinkField(), this.epicLinkField && (d += "," + this.epicLinkField.id), u.length > 0 && (d += "," + u.join(",")), this.isProcessChildren(a) && (d += ",subtasks"), a._fields = d, ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(a.pivotTableType) < 0 && (a._fields += ",worklog"), l.addQuery("_", Date.now());
        var c, m = l.build(), h = TimesheetUtils.getPerformance(), p = h.now(), f = 0, _ = i(function () {
            o.notify(++f / 250)
        }, 250);
        return n.get("/api/worklog?" + m).success(function (n) {
            if (i.cancel(_), !s.cancel(o)) {
                var l = h.now();
                c = f * n.length / 250, f = (n.length - c) / n.length;
                var u = s.processIssues(t, a, {issues: n}, function () {
                    c += f, o.notify(c / n.length)
                });
                e.all(u).then(o.resolve);
                var d = h.now();
                r.debug("getAndProcessIssues", {_: r._, t2: d - l, t1: l - p, t: d - p})
            }
        }).error(function () {
            console.log(arguments)
        }), o.promise
    }, this.onAllIssues = function (t, i) {
        var n = (t ? "&" : "") + "startAt=", r = this.getIssues(t + n + "0"), a = e.defer(), s = r.then(i), o = [s], l = this;
        return r.then(function (r) {
            for (var s = Math.ceil(r.total / r.maxResults) || 1, u = 1; u < s; u++) !function (s, u) {
                var d = 5 * Math.floor(u / 5) + 1, c = u > 5 ? o.slice(d, d + 5) : [];
                e.all(c).then(function () {
                    l.cancel(a) || l.getIssues(t + n + r.maxResults * u).then(i).then(s.resolve, s.reject)
                }), o.push(s.promise)
            }(e.defer(), u);
            e.all(o).then(a.resolve, a.reject)
        }, a.reject), a.promise
    }, this.getFields = function () {
        var t = this, i = e.defer();
        if (null == t.allFields) {
            var n = "/rest/api/2/field";
            s.request({
                url: n, dataType: "json", success: function (e) {
                    e = TimesheetUtils.getJson(e), t.allFields = e, i.resolve(e)
                }, error: function (e) {
                    var r = Array.prototype.slice.call(arguments);
                    r.push(n, i), t.onError.apply(t, r)
                }
            })
        } else i.resolve(t.allFields);
        return i.promise
    }, this.getFilters = function () {
        var t = this, i = e.defer();
        if (null == t.allFilters) {
            var n = "/rest/api/2/filter/favourite";
            s.request({
                url: n, dataType: "json", success: function (e) {
                    e = TimesheetUtils.getJson(e), t.allFilters = e, i.resolve(e)
                }, error: function (e) {
                    var r = Array.prototype.slice.call(arguments);
                    r.push(n, i), t.onError.apply(t, r)
                }
            })
        } else i.resolve(t.allFilters);
        return i.promise
    }, this.getJiraConfiguration = function () {
        if (!this.jiraConfiguration) {
            var t = e.defer();
            this.jiraConfiguration = t.promise, s.request({
                url: "/rest/api/2/configuration", dataType: "json", success: function (e) {
                    t.resolve(TimesheetUtils.getJson(e))
                }, error: function () {
                    t.resolve()
                }
            })
        }
        return this.jiraConfiguration
    }, this.getUserInfo = function (t) {
        var i = e.defer();
        if (t) {
            var n = this, r = "/rest/api/2/user?expand=groups&key=" + encodeURIComponent(t);
            s.request({
                url: r, dataType: "json", success: function (e) {
                    i.resolve(TimesheetUtils.getJson(e))
                }, error: function (e) {
                    if (404 == e.status) i.resolve(); else {
                        var t = Array.prototype.slice.call(arguments);
                        t.push(r, i), n.onError.apply(n, t)
                    }
                }
            })
        } else i.resolve(null);
        return i.promise
    }, this.getIssues = function (t) {
        var i = this, n = e.defer(), r = "/rest/api/2/search?" + t;
        return s.request({
            url: r, dataType: "json", success: function (e) {
                e = TimesheetUtils.getJson(e), n.resolve(e)
            }, error: function () {
                var e = Array.prototype.slice.call(arguments);
                e.push(r, n), i.onError.apply(i, e)
            }
        }), n.promise
    }, this.getQuery = function (e, t) {
        var i = this, n = t.isGadget ? 500 : 1e3, r = function (e) {
            return '"' + e + '"'
        }, a = "project,issuetype,resolution,summary,priority,status,parent,issuelinks";
        ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) < 0 && (a += ",worklog", t.includeEmpty && (n /= 2)), "TimeTracking" == t.pivotTableType && (a += "," + this.timeFields.join(",")), this.initEpicLinkField(), this.epicLinkField && (a += "," + this.epicLinkField.id), "IssuePassedTimeByStatus" == t.pivotTableType && (a += ",created");
        var s = this.getMoreFields(t);
        s.length > 0 && (a += "," + s.join(",")), this.isProcessChildren(t) && (a += ",subtasks"), t._fields = a;
        var o = (new TimesheetUtils.queryBuilder).addQuery("fields", a).addQuery("maxResults", n);
        ["IssueWorkedTimeByStatus", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) >= 0 && o.addQuery("expand", "changelog");
        var l = function (e) {
            var t;
            !e.includeEmpty && e.sumSubTasks && "TimeTracking" != e.pivotTableType ? (i.initMatches(e), t = new TimesheetUtils.queryBuilder(" and ")) : t = TimesheetUtils.getSearchQueryBuilder(e);
            var n = "IssuePassedTimeByStatus" == e.pivotTableType, a = "TimeTracking" == e.pivotTableType;
            if (!e.includeEmpty && null != e.startDate && "" != e.startDate) {
                var s = n ? "status changed" : a ? "updated" : "worklogDate", o = n ? " after " : ">=", l = n || a ? new TimesheetUtils.queryBuilder(" or ") : t;
                l.addQuery(s, r(i.addDays(e.startDate, -1)), o), (n || a) && (l.addQuery("created", r(i.addDays(e.startDate, -1)), ">"), t.addQueryBuilder(l))
            }
            if (!e.includeEmpty && null != e.endDate && "" != e.endDate) {
                var s = n ? "status changed" : a ? "updated" : "worklogDate", o = n ? " before " : "<=", l = n || a ? new TimesheetUtils.queryBuilder(" or ") : t;
                l.addQuery(s, r(i.addDays(e.endDate, 1)), o), (n || a) && (l.addQuery("created", r(i.addDays(e.endDate, 1)), "<"), t.addQueryBuilder(l))
            }
            var u = function (e) {
                return e.replace('"', "\\u0022").replace("#", "\\u0023").replace("$", "\\u0024").replace("%", "\\u0025").replace("*", "\\u002a").replace("@", "\\u0040").replace("^", "\\u005e")
            }, d = n ? "status changed" : a ? "assignee" : "worklogAuthor", c = n ? " by " : "=";
            if (!e.includeEmpty && e.username) {
                var m = u(e.username), l = n || a ? new TimesheetUtils.queryBuilder(" or ") : t;
                l.addQuery(d, r(m), c), (n || a) && (l.addQuery("reporter", r(m)), t.addQueryBuilder(l))
            }
            if (!e.includeEmpty && e.groups && e.groups.length > 0) {
                for (var h = new TimesheetUtils.queryBuilder(" or "), p = 0; p < e.groups.length; p++) {
                    var c = n ? " by " : " in ";
                    h.addQueryWithFunc(d, r(u(e.groups[p])), c, "membersOf"), (n || a) && h.addQueryWithFunc("reporter", r(u(e.groups[p])), " in ", "membersOf")
                }
                t.addQueryBuilder(h)
            }
            return t
        }(t);
        if (!l.isEmpty()) {
            var u = l.build();
            o.addQuery("jql", encodeURIComponent(u));
            var d = TimesheetUtils.getSearchQueryBuilder(t);
            t.jqlQuery = d.build()
        }
        return o.build()
    }, this.timeFields = ["timeoriginalestimate", "timeestimate", "timespent"], this.isProcessChildren = function (e) {
        var t = this.getMoreFields(e);
        return e.sumSubTasks && ("TimeTracking" == e.pivotTableType || TimesheetUtils.findOne(t, this.timeFields)) && (!e.groupByField || !this.isEpicField(e.groupByField) && this.epicLinkField && this.epicLinkField.id != e.groupByField)
    }, this.processIssues = function (e, t, i, n) {
        var r = [];
        for (var a in i.issues) {
            var s = i.issues[a];
            ["TimeTracking", "IssuePassedTimeByStatus"].indexOf(t.pivotTableType) >= 0 && (s.fields.worklog = {total: 0, maxResults: 0, worklogs: []});
            var o = this.processIssue(e, t, s);
            o.then(n), r.push(o)
        }
        return r
    }, this.processIssue = function (t, i, n) {
        var r = e.defer(), a = this;
        if (i.sumSubTasks) {
            var s = function (e) {
                if (t.queue.hasOwnProperty(n.key)) {
                    var i = t.queue[n.key];
                    return i.promise.$$state && 0 != i.promise.$$state.status || i.resolve(n), i.promise
                }
                return e && (t.queue[n.key] = e), n
            }, o = this.getParentIssue(t, n, i);
            if (o.hasOwnProperty("promise")) {
                var l = s();
                e.when(l).then(function (n) {
                    a.loadAllWorklogs(n, e.defer(), i).promise.then(function (e) {
                        a.addWorklogsToParent(t, e, r, i, o)
                    })
                })
            } else {
                var l = s(r);
                e.when(l).then(function (e) {
                    e ? a.addOnceIfMatches(t, e, i).then(function () {
                        r.resolve(e)
                    }) : r.resovle()
                })
            }
        } else {
            var u = [];
            if ("parent" == i.groupByField) {
                var d = this.getParentIssue(t, n, i);
                if (d.hasOwnProperty("promise")) {
                    var c = e.defer();
                    u.push(c.promise), a.resolveParent(t, n, c, i, d)
                } else n.fields.parent = n
            } else this.getEpicFields(t, n, i, u);
            var o = this.loadAllWorklogs(n, null, i);
            o.hasOwnProperty("promise") && u.push(o.promise);
            var m = this.loadAllChangelogs(n, i);
            m.hasOwnProperty("promise") && u.push(m.promise), e.all(u).then(function () {
                a.addIssue(t, n), r.resolve(n)
            })
        }
        return r.promise
    }, this.addIssue = function (e, t) {
        this.allIssues.push(t);
        e.add(t)
    }, this.getParentIssue = function (e, t, i) {
        var n = this.getParentIssueKey(t, i);
        return n ? this.getIssueByKey(e, n, i) : t
    }, this.getIssueByKey = function (t, i, n) {
        var r = this;
        if (t.queue.hasOwnProperty(i)) return t.queue[i];
        var a = e.defer();
        return t.queue[i] = a, r.findIssueByKey(i, n, a), a
    }, this.getParentIssueKey = function (e, t) {
        var i = t.configOptions;
        return e.fields.parent ? e.fields.parent.key : i && i.parentIssueField && e.fields[i.parentIssueField] ? e.fields[i.parentIssueField] : i && i.compositionIssueLink ? this.getCompositionLinkKey(e, i) : null
    }, this.getCompositionLinkKey = function (e, t) {
        var i = e.fields.issuelinks;
        if (null != i && i.length > 0) for (var n = 0; n < i.length; n++) if (i[n].outwardIssue && i[n].type.name == t.compositionIssueLink) return i[n].outwardIssue.key;
        return null
    }, this.resolveParent = function (e, t, i, n, r) {
        this.onParentIssue(e, t, n, r, [], function (e) {
            t.fields.parent = e || t, i.resolve()
        })
    }, this.initMatches = function (t) {
        if (!this.matches) {
            var i = TimesheetUtils.getSearchQueryBuilder(t), n = i.build();
            if (n && (t.jql || t.filterIds.length > 0)) {
                var r = "fields=~&maxResults=1000&jql=" + encodeURIComponent(n);
                this.matchIssueIds = [], this.matches = this.onAllIssues(r, function (e) {
                    for (var t in e.issues) {
                        var i = e.issues[t];
                        this.matchIssueIds.push(i.id)
                    }
                }.bind(this))
            } else {
                var a = e.defer();
                this.matches = a.promise, a.resolve(), delete this.matchIssueIds
            }
        }
    }, this.processChildren = function (t, i, n, r) {
        if (!this.isProcessChildren(n)) return null;
        if (!(r.indexOf(i.key) < 0)) return null;
        r.push(i.key);
        var a = [], s = this, o = null;
        if ("Epic" == i.fields.issuetype.name && this.epicLinkField) {
            var l = new TimesheetUtils.queryBuilder(" and ");
            l.addQuery(this.epicLinkField.clauseNames[0], i.key);
            var u = l.build();
            if (0 != u.length) {
                var d = "fields=issuetype,resolution,issuelinks,timeoriginalestimate,timeestimate,timespent," + this.epicLinkField.id + ",subtasks&maxResults=1000&jql=" + encodeURIComponent(u),
                    c = e.defer();
                o = c.promise;
                var m = [], h = s.onAllIssues(d, function (a) {
                    for (var o in a.issues) {
                        var l = a.issues[o];
                        l.fields.worklog = {total: 0, maxResults: 0, worklogs: []};
                        var u = s.processChildren(t, l, n, r);
                        m.push(u), e.when(u).then(function (e) {
                            return function () {
                                s.addWorklogs(e, i)
                            }
                        }(l))
                    }
                });
                h.then(function () {
                    e.all(m).then(c.resolve)
                })
            }
        }
        for (var p in i.fields.subtasks) {
            var f = i.fields.subtasks[p];
            a.push(f.key)
        }
        var _ = i.fields.issuelinks, g = n.configOptions;
        if (null != _ && _.length > 0 && g.compositionIssueLink) for (var p = 0; p < _.length; p++) if (_[p].inwardIssue && _[p].type.name == g.compositionIssueLink) {
            var f = _[p].inwardIssue;
            a.push(f.key)
        }
        if (a.length > 0) {
            var y = e.defer();
            if (a.length > 0) {
                var v = "key in (" + a.join() + ")", d = "fields=issuetype,issuelinks,timeoriginalestimate,timeestimate,timespent&maxResults=1000&jql=" + encodeURIComponent(v), k = [o],
                    h = s.onAllIssues(d, function (a) {
                        for (var o in a.issues) {
                            var l = a.issues[o];
                            l.fields.worklog = {total: 0, maxResults: 0, worklogs: []};
                            var u = s.processChildren(t, l, n, r);
                            k.push(u), e.when(u).then(function (e) {
                                return function () {
                                    s.addWorklogs(e, i)
                                }
                            }(l))
                        }
                    });
                h.then(function () {
                    e.all(k).then(y.resolve)
                })
            } else y.resolve();
            return y.promise
        }
        return o
    }, this.checkIfMatches = function (t, i) {
        this.matches || ("TimeTracking" == i.pivotTableType ? this.matches = e.resolve() : this.initMatches(i));
        var n = e.defer();
        return this.matches.then(function () {
            var e = null == this.matchIssueIds;
            e = e && (null == i.projectKeys || 0 == i.projectKeys.length || i.projectKeys.indexOf(t.fields.project.key) >= 0), e = e || null != this.matchIssueIds && -1 != this.matchIssueIds.indexOf(t.id), n.resolve(e)
        }.bind(this), n.reject), n.promise
    }, this.addOnceIfMatches = function (t, i, n) {
        var r = this, a = t.matches[i.key];
        return a || (a = t.matches[i.key] = e.defer(), this.checkIfMatches(i, n).then(function (s) {
            if (s) {
                var o = [];
                r.getEpicFields(t, i, n, o);
                var l = r.processChildren(t, i, n, []);
                o.push(l), e.all(o).then(function () {
                    var s = r.loadAllWorklogs(i, null, n).promise, o = r.loadAllChangelogs(i, n).promise;
                    e.all([s, o]).then(function () {
                        t.queueToAdd.push(i), a.resolve(i)
                    })
                })
            } else a.resolve()
        })), a.promise
    }, this.addWorklogsToParent = function (e, t, i, n, r) {
        var a = this;
        return this.onParentIssue(e, t, n, r, [], function (r) {
            r || (r = t), a.addOnceIfMatches(e, r, n).then(function (e) {
                e && t.key != r.key && a.addWorklogs(t, r), i.resolve()
            })
        }), i.promise
    }, this.onParentIssue = function (e, t, i, n, a, s) {
        var o = this;
        n.promise.then(function (n) {
            if (n) if (a.indexOf(n.key) >= 0) r.debug("Cycle summing subtasks for issue " + t.key, a), s(); else {
                a.push(n.key);
                var l = o.getParentIssue(e, n, i);
                l.hasOwnProperty("promise") ? o.onParentIssue(e, t, i, l, a, s) : s(n)
            } else r.debug("Parent issue for " + t.key + " is not visible"), s(t)
        })
    }, this.addWorklogs = function (e, t) {
        var i = e.worklog || e.fields.worklog, n = t.worklog || t.fields.worklog, r = {key: e.key, fields: {summary: e.fields.summary}};
        for (var a in i.worklogs) i.worklogs[a]._issue = r, n.worklogs.push(i.worklogs[a]);
        t._subTaskIds || (t._subTaskIds = []);
        var s = parseInt(e.id);
        t._subTaskIds.indexOf(s) >= 0 || (t._subTaskIds.push(s), t.fields.timeestimate = (e.fields.timeestimate || 0) + (t.fields.timeestimate || 0), t.fields.timeoriginalestimate = (e.fields.timeoriginalestimate || 0) + (t.fields.timeoriginalestimate || 0), t.fields.timespent = (e.fields.timespent || 0) + (t.fields.timespent || 0))
    }, this.restrictedByAuditorsGroups = function (t) {
        var i = e.defer();
        return a.getConfiguration().then(function (e) {
            var n = e.auditorsGroups.val, r = null != n;
            if (r) for (var a = 0; a < t.groups.items.length && r; a++) r = -1 == n.indexOf(t.groups.items[a].name);
            i.resolve(r)
        }), i.promise
    }, this.getPermissions = function (t) {
        if (!this.permissions.hasOwnProperty(t)) {
            var i = e.defer();
            this.permissions[t] = i.promise;
            var n = this.getPermissionsPromises, r = n.length > 5 ? n[n.length - 5] : 0;
            n.push(i.promise);
            var a = this;
            e.when(r).then(function () {
                s.request({
                    url: "/rest/api/2/mypermissions" + t, dataType: "json", success: function (e) {
                        e = TimesheetUtils.getJson(e), i.resolve(e.permissions)
                    }, error: function () {
                        var e = Array.prototype.slice.call(arguments);
                        e.push(t, i), a.onError.apply(a, e)
                    }
                })
            })
        }
        return this.permissions[t]
    }, this.havePermissions = function (e) {
        var t = "?" + [].slice.call(arguments, 1).join("&");
        return this.getPermissions(t).then(function (t) {
            for (var i = [], n = 0; n < e.length; n++) i.push(null != t[e[n]] && 1 == t[e[n]].havePermission);
            return i
        })
    }, this.isAdministrator = function () {
        return this.havePermissions(["ADMINISTER"]).then(function (e) {
            return e[0]
        })
    }, this.isProjectAdmin = function (e) {
        return this.havePermissions(["PROJECT_ADMIN"], "projectKey=" + e).then(function (e) {
            return e[0]
        })
    }, this.findIssueByKey = function (t, i, n) {
        var r = this.findIssueByKeyPromises, a = r.length > 5 ? r[r.length - 5] : 0;
        n || (n = e.defer()), r.push(n.promise);
        var o = this;
        return e.when(a).then(function () {
            if (!n.promise.$$state || 0 == n.promise.$$state.status) {
                var e = "/rest/api/2/issue/" + t + "?fields=" + i._fields;
                ["IssueWorkedTimeByStatus", "IssuePassedTimeByStatus"].indexOf(i.pivotTableType) >= 0 && (e += "&expand=changelog"), s.request({
                    url: e, dataType: "json", success: function (e) {
                        var t = TimesheetUtils.getJson(e);
                        t.fields && !t.fields.worklog && (t.fields.worklog = {total: 0, maxResults: 0, worklogs: []}), n.resolve(t)
                    }, error: function (t) {
                        if ([403, 404].indexOf(t.status) >= 0) n.resolve(); else {
                            var i = Array.prototype.slice.call(arguments);
                            i.push(e, n), o.onError.apply(o, i)
                        }
                    }
                })
            }
        }), n.promise
    }, this.getIssueWorklog = function (t, i) {
        if (this.cacheWorklog) {
            var n = window.localStorage.getItem("i" + i);
            if (n) return this.updateCacheExpiry(function (e) {
                e[i] = r._
            }), e.resolve(TimesheetUtils.getJson(LZString.decompressFromUTF16(n)))
        }
        var a = e.defer(), o = this.issueWorklogs.length > 5 ? this.issueWorklogs[this.issueWorklogs.length - 5] : 0;
        this.issueWorklogs.push(a.promise);
        var l = this;
        return e.when(o).then(function () {
            s.request({
                url: "/rest/api/2/issue/" + t + "/worklog", dataType: "json", success: function (e) {
                    var t = TimesheetUtils.getJson(e);
                    if (l.cacheWorklog) try {
                        window.localStorage.setItem("i" + i, LZString.compressToUTF16(e)), t.worklogs.forEach(function (e) {
                            window.localStorage.setItem("w" + e.id, i)
                        }), l.updateCacheExpiry(function (e) {
                            e[i] = r._
                        })
                    } catch (e) {
                        console.log("cache is full", i, e)
                    }
                    a.resolve(t)
                }, error: function () {
                    a.reject()
                }
            })
        }), a.promise
    }, this.filterWorklogs = function (t, i, n) {
        var r = [], a = this, s = t.worklog || t.fields.worklog;
        if (s.worklogs && s.worklogs.length > 0 && angular.forEach(s.worklogs, function (e) {
                var t = TimesheetUtils.getTags(e.comment);
                t && t.length > 0 && angular.forEach(t, function (e) {
                    a.workLabels[e] ? a.workLabels[e]++ : a.workLabels[e] = 1
                });
                var i = angular.isObject(e.author);
                if (a.groups && !n.configOptions.storeWorklog || !i) {
                    var s = e.author ? e.author.key || e.author.name || e.author : "";
                    if (a.userGroups.hasOwnProperty(s)) a.userGroups[s].$$state && 0 != a.userGroups[s].$$state.status || r.push(a.userGroups[s]); else {
                        var o = a.userGroups[s] = a.getUserInfo(s);
                        r.push(o), a.groups && o.then(a.initWorklogAuthors.bind(a))
                    }
                    i || a.userGroups[s].then(function (t) {
                        e.author = t
                    })
                }
            }), 0 == r.length && !i) return t;
        var i = i || e.defer();
        return e.all(r).then(function () {
            i.resolve(t)
        }), i
    }, this.initWorklogAuthors = function (e) {
        if (e) for (var t = 0; t < e.groups.items.length; t++) if (this.groups.indexOf(e.groups.items[t].name) >= 0) {
            this.worklogAuthors.push(e.key);
            break
        }
    }, this.loadAllWorklogs = function (t, i, n) {
        var r = this, a = t.worklog || t.fields.worklog;
        if (a || (a = t.fields.worklog = {total: 1, maxResults: 0, worklogs: []}), a.total > a.maxResults) {
            var s = i || e.defer(), o = function (e) {
                return angular.copy(e, a), r.filterWorklogs(t, s, n), e
            };
            return this.getIssueWorklog(t.key, t.id).then(o, s.reject), s
        }
        return this.filterWorklogs(t, i, n)
    }, this.getIssueChangelog = function (t, i, n) {
        var r = e.defer(), a = this, o = n || "/rest/api/2/issue/" + t.key + "/changelog?startAt=" + i;
        return s.request({
            url: o, dataType: "json", success: function (e) {
                var i = TimesheetUtils.getJson(e);
                t.changelog.histories = t.changelog.histories.concat(i.values), i.isLast ? r.resolve(t) : a.getIssueChangelog(t, i.startAt + i.maxResult, i.nextPage).then(r.resolve, r.reject)
            }, error: function () {
                var e = Array.prototype.slice.call(arguments);
                e.push(o, r), a.onError.apply(a, e)
            }
        }), r.promise
    }, this.loadAllChangelogs = function (t, i) {
        var n = t.changelog;
        if (!n) return {};
        if (n.total > n.maxResults) {
            var r = e.defer(), a = this, s = this.issueChangelogs.length > 5 ? this.issueChangelogs[this.issueChangelogs.length - 5] : 0;
            return this.issueChangelogs.push(r.promise), e.when(s).then(function () {
                a.getIssueChangelog(t, n.maxResults).then(r.resolve, r.reject)
            }), r
        }
        return {}
    }, this.getMoreFields = function (e) {
        var t = e.moreFields && angular.isArray(e.moreFields) ? e.moreFields.slice() : [];
        return e.groupByField && t.unshift(e.groupByField), e.categorizeByField && t.unshift(e.categorizeByField), t
    }, this.getEpicFields = function (e, t, i, n) {
        for (var r = this.getMoreFields(i), a = 0; a < r.length; a++) {
            var s = r[a];
            if (this.isEpicField(s)) {
                var o = this.getEpic(e, t, i);
                o && (n.push(o), o.then(function (e, i) {
                    return function (i) {
                        i && (t.fields[e] = i.fields[e])
                    }
                }(s)))
            }
        }
    }, this.isEpicField = function (e) {
        if (!this.epicFields.hasOwnProperty(e)) {
            for (var t = 0; t < this.allFields.length; t++) {
                var i = this.allFields[t];
                if (i.id == e) return this.epicFields[e] = i.custom && null != i.schema && ["com.pyxis.greenhopper.jira:gh-epic-color", "com.pyxis.greenhopper.jira:gh-epic-status", "com.pyxis.greenhopper.jira:gh-epic-label"].indexOf(i.schema.custom) >= 0
            }
            this.epicFields[e] = !1
        }
        return this.epicFields[e]
    }, this.initEpicLinkField = function () {
        if (!this.hasOwnProperty("epicLinkField")) {
            this.epicLinkField = null;
            for (var e = 0; e < this.allFields.length; e++) {
                var t = this.allFields[e];
                if (t.custom && null != t.schema && "com.pyxis.greenhopper.jira:gh-epic-link" == t.schema.custom) {
                    this.epicLinkField = t;
                    break
                }
            }
        }
    }, this.getEpic = function (t, i, n) {
        if (!this.epicLinkField) return null;
        var r = this.getParentIssue(t, i, n);
        if (r.hasOwnProperty("promise")) {
            var a = e.defer(), s = this;
            return this.onParentIssue(t, i, n, r, [], function (e) {
                e && "Epic" == e.fields.issuetype.name ? a.resolve(e) : e && e.fields[s.epicLinkField.id] ? s.getIssueByKey(t, e.fields[s.epicLinkField.id], n).promise.then(a.resolve) : a.resolve()
            }), a.promise
        }
        return i.fields[this.epicLinkField.id] ? this.getIssueByKey(t, i.fields[this.epicLinkField.id], n).promise : null
    }, this.onError = function (e, t, i, n, r) {
        401 == e.status ? this.loginExpired() : [500, 502, 503, 504].indexOf(e.status) >= 0 ? this.serviceUnavailable() : 403 == e.status ? this.forbidden() : this.unexpectedError(e, i, n), r.reject()
    }, this.loginExpired = function () {
        s.flag.create({title: "Jira session expired", body: "Please login again to restore connection with Jira", type: "error"})
    }, this.serviceUnavailable = function () {
        s.flag.create({title: "Jira Unavailable", body: "The requested resource failed to load. If the problem persists, please contact Atlassian Cloud Support.", type: "error"})
    }, this.forbidden = function () {
        s.flag.create({title: "Forbidden", body: "You need to accept WRITE and DELETE scopes for the add-on in UPM", type: "error"})
    }, this.unexpectedError = function (e, t, i) {
        function n(e) {
            var t = document.createElement("DIV");
            return t.innerHTML = e, t.textContent || t.innerText || ""
        }

        var r = "";
        if (e && e.responseText) try {
            var a = TimesheetUtils.getJson(e.responseText);
            r = a.errorMessages ? a.errorMessages.join(" ") : "Unknown", a.errors && (r += "\n" + JSON.stringify(a.errors)), a.status = e.status
        } catch (t) {
            r = i + " " + e.status + " " + n(e.responseText)
        } else r = t;
        s.flag.create({title: "Unexpected error", body: r, type: "error"})
    }, this.getGadgetConfiguration = function (t, i) {
        var n = e.defer();
        return s.request({
            url: "/rest/api/2/dashboard/" + t + "/items/" + i + "/properties", success: function (e) {
                e = TimesheetUtils.getJson(e), e.keys.length > 0 ? s.request({
                    url: "/rest/api/2/dashboard/" + t + "/items/" + i + "/properties/gadgetConfig", success: function (e) {
                        e = TimesheetUtils.getJson(e), n.resolve(e.value)
                    }, error: function (e) {
                        n.resolve({})
                    }
                }) : n.resolve({})
            }, error: function (e) {
                n.resolve({})
            }
        }), n.promise
    }, this.saveGadgetConfiguration = function (t, i, n) {
        var r = e.defer();
        return s.request({
            url: "/rest/api/2/dashboard/" + t + "/items/" + i + "/properties/gadgetConfig",
            type: "PUT",
            contentType: "application/json",
            headers: {Accept: "application/json"},
            data: JSON.stringify(n),
            success: function (e) {
                r.resolve(TimesheetUtils.getJson(e))
            },
            error: function (e) {
                r.reject()
            }
        }), r.promise
    }, this.createWorklog = function (t) {
        var i = e.defer(), n = this, r = this.getEstimateParams(t, "reduceBy"), a = "/rest/api/2/issue/" + t.issueKey + "/worklog" + r;
        return s.request({
            url: a, type: "POST", contentType: "application/json", headers: {Accept: "application/json"}, data: n.getCreateWorklogRequest(t), success: function (e) {
                e = TimesheetUtils.getJson(e), n.removeWorklogFromCache(e), i.resolve(e)
            }, error: function () {
                var e = Array.prototype.slice.call(arguments);
                e.push(a, i), n.onError.apply(n, e)
            }
        }), i.promise
    }, this.getWorklog = function (t, i) {
        var n = e.defer(), r = this, a = "/rest/api/2/issue/" + t + "/worklog/" + i;
        return s.request({
            url: a, type: "GET", contentType: "application/json", headers: {Accept: "application/json"}, success: function (e) {
                n.resolve(TimesheetUtils.getJson(e))
            }, error: function () {
                var e = Array.prototype.slice.call(arguments);
                e.push(a, n), r.onError.apply(r, e)
            }
        }), n.promise
    }, this.updateWorklog = function (t) {
        var i = e.defer(), n = this, r = this.getEstimateParams(t), a = "/rest/api/2/issue/" + t.issueKey + "/worklog/" + t.id + r;
        return s.request({
            url: a, type: "PUT", contentType: "application/json", headers: {Accept: "application/json"}, data: n.getUpdateWorklogRequest(t), success: function (e) {
                n.removeWorklogFromCache(t), i.resolve(TimesheetUtils.getJson(e))
            }, error: function () {
                var e = Array.prototype.slice.call(arguments);
                e.push(a, i), n.onError.apply(n, e)
            }
        }), i.promise
    }, this.deleteWorklog = function (t) {
        var i = e.defer(), n = this, r = this.getEstimateParams(t, "increaseBy"), a = "/rest/api/2/issue/" + t.issueKey + "/worklog/" + t.id + r;
        return s.request({
            url: a, type: "DELETE", contentType: "application/json", success: function () {
                n.removeWorklogFromCache(t), i.resolve(!0)
            }, error: function (e) {
                var t = Array.prototype.slice.call(arguments);
                t.push(a, i), n.onError.apply(n, t)
            }
        }), i.promise
    }, this.getEstimateParams = function (e, t) {
        var i = "?adjustEstimate=" + e.estimateType;
        return "new" == e.estimateType ? i += "&newEstimate=" + encodeURIComponent(e.estimateValue) : "manual" == e.estimateType && (i += "&" + t + "=" + encodeURIComponent(e.adjustmentAmount)), i
    }, this.getCreateWorklogRequest = function (e) {
        return JSON.stringify({
            comment: e.comment,
            started: TimesheetUtils.formatDate(e.date),
            timeSpent: e.timeSpent,
            visibility: e.visibilityGroup ? {type: "group", value: e.visibilityGroup} : e.visibilityRole ? {type: "role", value: e.visibilityRole} : null
        })
    }, this.getUpdateWorklogRequest = function (e) {
        return JSON.stringify({
            comment: e.comment,
            started: e.started,
            timeSpent: e.timeSpent,
            visibility: e.visibilityGroup ? {type: "group", value: e.visibilityGroup} : e.visibilityRole ? {type: "role", value: e.visibilityRole} : null
        })
    }, this.onDeletedWorklogs = function (t, i) {
        var n = e.defer(), r = this, a = "/rest/api/2/worklog/deleted?since=" + t;
        return s.request({
            url: a, type: "GET", contentType: "application/json", success: function (e) {
                var t = TimesheetUtils.getJson(e);
                i(t), t.lastPage ? n.resolve(t.until + 1) : r.onDeletedWorklogs(t.until, i).then(n.resolve)
            }, error: function (e) {
                var t = Array.prototype.slice.call(arguments);
                t.push(a, n), r.onError.apply(r, t)
            }
        }), n.promise
    }, this.onUpdatedWorklogs = function (t, i) {
        var n = e.defer(), r = this, a = "/rest/api/2/worklog/updated?since=" + t;
        return s.request({
            url: a, type: "GET", contentType: "application/json", success: function (e) {
                i(TimesheetUtils.getJson(e)).then(function (e) {
                    e.lastPage ? n.resolve(e.until + 1) : r.onOutdatedWorklogs(e.until, i).then(n.resolve)
                })
            }, error: function (e) {
                var t = Array.prototype.slice.call(arguments);
                t.push(a, n), r.onError.apply(r, t)
            }
        }), n.promise
    }, this.onWorklogs = function (t, i) {
        var n = t.values.map(function (e) {
            return e.worklogId
        });
        if (!n.length) return e.resolve(t)
            ;
        var r = e.defer(), a = this, o = "/rest/api/2/worklog/list";
        return s.request({
            url: o, type: "POST", contentType: "application/json", data: JSON.stringify({ids: n}), success: function (e) {
                i(TimesheetUtils.getJson(e)), r.resolve(t)
            }, error: function (e) {
                var t = Array.prototype.slice.call(arguments);
                t.push(o, r), a.onError.apply(a, t)
            }
        }), r.promise
    }, this.removeWorklogFromCache = function (e) {
        if (this.cacheWorklog) try {
            var t = e.issueId || window.localStorage.getItem("w" + e.worklogId), i = window.localStorage.getItem("i" + t);
            if (i) {
                TimesheetUtils.getJson(LZString.decompressFromUTF16(i)).worklogs.forEach(function (e) {
                    window.localStorage.removeItem("w" + e.id)
                }), window.localStorage.removeItem("i" + t), this.updateCacheExpiry(function (e) {
                    delete e[t]
                })
            } else (e.id || e.worklogId) && window.localStorage.removeItem("w" + (e.id || e.worklogId))
        } catch (t) {
            console.log("Failed to remove worklog " + (e.id || e.worklogId || "for issue " + e.issueId) + " from cache", t)
        }
    };
    this.updateCacheExpiry = function (e) {
        try {
            var t = TimesheetUtils.getJson(window.localStorage.getItem("cacheExpiry")) || {};
            e(t), window.localStorage.setItem("cacheExpiry", JSON.stringify(t))
        } catch (e) {
            console.log("Failed to update cache expiry", e)
        }
    }, this.clearWorklogCache = function (t) {
        if (this.cacheWorklog = t.cacheWorklog && t.cacheWorklog.val && (!t.storeWorklog || !t.storeWorklog.val), this.cacheWorklog && !this.allIssues) try {
            var i = window.localStorage.getItem("cacheId"), n = r.baseUrl + "#0";
            i != n && (window.localStorage.clear(), window.localStorage.setItem("cacheId", n));
            var a, s = this, o = window.localStorage.getItem("updatedSince"), l = window.localStorage.getItem("deletedSince"), u = Date.now() - 36e5;
            a = o ? this.onUpdatedWorklogs(parseInt(o), function (e) {
                return s.onWorklogs(e, function (e) {
                    e.forEach(s.removeWorklogFromCache.bind(s))
                })
            }) : e.resolve(u);
            var d;
            return d = l ? this.onDeletedWorklogs(parseInt(l), function (e) {
                e.values.forEach(s.removeWorklogFromCache.bind(s))
            }) : e.resolve(u), e.all([a, d]).then(function (e) {
                window.localStorage.setItem("updatedSince", e[0]), window.localStorage.setItem("deletedSince", e[1])
            })
        } catch (e) {
            console.log("Failed to clear worklog cache", e)
        }
    }, this.expireWorklogCache = function () {
        if (this.cacheWorklog) {
            var e = TimesheetUtils.getJson(window.localStorage.getItem("cacheExpiry"));
            if (e) for (var t in e) r._ - e[t] > 6048e5 && this.removeWorklogFromCache({issueId: t})
        }
    }, this.resetState = function () {
        this.allIssues = null, this.allFilters = null, this.allProjects = null, this.allFields = null, this.filterOrProjectId = null, this.sumSubTasks = null, this.includeEmpty = null, this.permissions = {}, this.jiraConfiguration = null
    }, this.checkAndUpdateOptions = function (e) {
        var t = this.getMoreFields(e),
            i = null == this.allIssues || !angular.equals(this.filterOrProjectId, e.filterOrProjectId) || this.sumSubTasks != e.sumSubTasks || !this.includeEmpty && e.includeEmpty || !angular.equals(this.startDate, e.startDate) || !angular.equals(this.endDate, e.endDate) || this.username != e.username || this.groups != e.groups || "IssueWorkedTimeByStatus" != this.pivotTableType && "IssueWorkedTimeByStatus" == e.pivotTableType || "IssuePassedTimeByStatus" != this.pivotTableType && "IssuePassedTimeByStatus" == e.pivotTableType || !angular.equals(this.moreFields, t);
        return i && (this.allIssues = [], this.filterOrProjectId = angular.copy(e.filterOrProjectId), this.sumSubTasks = e.sumSubTasks, this.includeEmpty = e.includeEmpty, this.startDate = e.startDate, this.endDate = e.endDate, this.username = e.username, this.groups = e.groups, this.userGroups = {}, this.worklogAuthors.splice(0, this.worklogAuthors.length), this.matches = null, this.pivotTableType = e.pivotTableType, this.moreFields = t, this.issueWorklogs.splice(0, this.issueWorklogs.length), this.issueChangelogs.splice(0, this.issueChangelogs.length), this.findIssueByKeyPromises.splice(0, this.findIssueByKeyPromises.length), this.getPermissionsPromises.splice(0, this.getPermissionsPromises.length)), i
    }, this.addDays = function (e, t) {
        if (null == e || "" == e) return e;
        var i = TimesheetUtils.addDays(new Date(e), t);
        return TimesheetUtils.formatDateForSearch(i)
    }
}]), app.service("validationService", ["$q", "$http", function (e, t) {
    this.validate = function (e) {
        var t = [];
        return t = t.concat(this.validateDates(e.startDate.value, e.endDate.value))
    }, this.validateDates = function (e, t) {
        var i = [];
        return null != e && (moment(e).isAfter(moment()) ? i.push("error.startDate.afterNow") : null != t && moment(e).isAfter(moment(t)) && i.push("error.startDate.afterEnd")), i
    }
}]), app.service("viewService", ["$q", "$http", "dataService", function (e, t, i) {
    var n = function (e) {
        return "views4" + e.key
    };
    this.data = {allViews: [], currentView: {}}, this.updateCurrentView = function (e) {
        if (this.data.currentView.viewId != e) {
            var t = this.findById(e, this.data.allViews);
            t && angular.copy(t, this.data.currentView)
        }
    }, this.getViews = function (t, r) {
        var a = e.defer(), s = this;
        return 0 == this.data.allViews.length ? i.getProperty(n(r), []).then(function (e) {
            [].push.apply(s.data.allViews, e), s.updateCurrentView(t), a.resolve(s.data.allViews)
        }) : (s.updateCurrentView(t), a.resolve(s.data.allViews)), a.promise
    }, this.addView = function (t, r) {
        var a = e.defer(), s = this;
        return i.getProperty(n(r), []).then(function (e) {
            var o = e.length > 0 ? e[e.length - 1] : {viewId: 0}, l = angular.copy(t);
            l.viewId = o.viewId + 1, e.push(l), i.setProperty(n(r), e).then(function () {
                s.data.allViews.push(l), angular.copy(l, s.data.currentView), a.resolve(s.data.currentView)
            })
        }), a.promise
    }, this.updateView = function (t, r) {
        var a = e.defer(), s = this;
        return i.getProperty(n(r), []).then(function (e) {
            var o = s.indexById(t.viewId, e), l = angular.copy(t);
            e[o] = l, i.setProperty(n(r), e).then(function () {
                var e = s.indexById(t.viewId, s.data.allViews);
                s.data.allViews.splice(e, 1, l), angular.equals(t, s.data.currentView) || angular.copy(t, s.data.currentView), a.resolve(s.data.currentView)
            })
        }), a.promise
    }, this.removeView = function (t, r) {
        var a = e.defer(), s = this, o = t.viewId;
        return i.getProperty(n(r), []).then(function (e) {
            var t = s.indexById(o, e);
            e.splice(t, 1), i.setProperty(n(r), e).then(function () {
                var e = s.indexById(o, s.data.allViews);
                s.data.allViews.splice(e, 1), angular.copy({}, s.data.currentView), a.resolve(s.data.allViews)
            })
        }), a.promise
    }, this.indexById = function (e, t) {
        var i = -1;
        return t.forEach(function (t, n) {
            if (e == t.viewId) return void(i = n)
        }), i
    }, this.findById = function (e, t) {
        var i = this.indexById(e, t);
        return -1 != i ? t[i] : null
    }, this.resetState = function () {
        this.data.allViews.splice(0, this.data.allViews.length)
    }
}]), TimesheetSelectOptions.prototype.getOptions = function () {
    var e = this.options, t = {};
    if (this.sections) {
        e = [];
        for (var i = 0; i < this.options.length; i++) {
            var n = this.options[i], r = n.id.split("_")[0];
            if (!t.hasOwnProperty(r)) {
                var a = t[r] = {label: this.sections[r], children: []};
                e.push(a)
            }
            t[r].children.push(n)
        }
    }
    return e
}, TimesheetSelectOptions.prototype.addOption = function (e, t, i, n) {
    var r = new this.optionClass(e, t);
    return 1 == i ? this.options.unshift(r) : this.options.push(r), this
}, TimesheetSelectOptions.prototype.findOption = function (e, t) {
    for (var i = 0; i < this.options.length; i++) if (this.options[i].isOption(e, t)) return this.options[i];
    return null
}, TimesheetSelectOptions.prototype.sort = function (e) {
    TimesheetUtils.sortByProperty(this.options, this.sortableProperty, e)
}, TimesheetGeneralOption.prototype.isOption = function (e, t) {
    return t ? this.label == e : this.id == e
}, function (e) {
    function t() {
        var e = arguments[0], i = t.cache;
        return i[e] && i.hasOwnProperty(e) || (i[e] = t.parse(e)), t.format.call(null, i[e], arguments)
    }

    function i(e) {
        return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
    }

    function n(e, t) {
        return Array(t + 1).join(e)
    }

    var r = {
        not_string: /[^s]/,
        number: /[dief]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };
    t.format = function (e, a) {
        var s, o, l, u, d, c, m, h = 1, p = e.length, f = "", _ = [], g = !0, y = "";
        for (o = 0; o < p; o++) if ("string" === (f = i(e[o]))) _[_.length] = e[o]; else if ("array" === f) {
            if (u = e[o], u[2]) for (s = a[h], l = 0; l < u[2].length; l++) {
                if (!s.hasOwnProperty(u[2][l])) throw new Error(t("[sprintf] property '%s' does not exist", u[2][l]));
                s = s[u[2][l]]
            } else s = u[1] ? a[u[1]] : a[h++];
            if ("function" == i(s) && (s = s()), r.not_string.test(u[8]) && "number" != i(s) && isNaN(s)) throw new TypeError(t("[sprintf] expecting number but found %s", i(s)));
            switch (r.number.test(u[8]) && (g = s >= 0), u[8]) {
                case"b":
                    s = s.toString(2);
                    break;
                case"c":
                    s = String.fromCharCode(s);
                    break;
                case"d":
                case"i":
                    s = parseInt(s, 10);
                    break;
                case"e":
                    s = u[7] ? s.toExponential(u[7]) : s.toExponential();
                    break;
                case"f":
                    s = u[7] ? parseFloat(s).toFixed(u[7]) : parseFloat(s);
                    break;
                case"o":
                    s = s.toString(8);
                    break;
                case"s":
                    s = (s = String(s)) && u[7] ? s.substring(0, u[7]) : s;
                    break;
                case"u":
                    s >>>= 0;
                    break;
                case"x":
                    s = s.toString(16);
                    break;
                case"X":
                    s = s.toString(16).toUpperCase()
            }
            !r.number.test(u[8]) || g && !u[3] ? y = "" : (y = g ? "+" : "-", s = s.toString().replace(r.sign, "")), c = u[4] ? "0" === u[4] ? "0" : u[4].charAt(1) : " ", m = u[6] - (y + s).length, d = u[6] && m > 0 ? n(c, m) : "", _[_.length] = u[5] ? y + s + d : "0" === c ? y + d + s : d + y + s
        }
        return _.join("")
    }, t.cache = {}, t.parse = function (e) {
        for (var t = e, i = [], n = [], a = 0; t;) {
            if (null !== (i = r.text.exec(t))) n[n.length] = i[0]; else if (null !== (i = r.modulo.exec(t))) n[n.length] = "%"; else {
                if (null === (i = r.placeholder.exec(t))) throw new SyntaxError("[sprintf] unexpected placeholder");
                if (i[2]) {
                    a |= 1;
                    var s = [], o = i[2], l = [];
                    if (null === (l = r.key.exec(o))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                    for (s[s.length] = l[1]; "" !== (o = o.substring(l[0].length));) if (null !== (l = r.key_access.exec(o))) s[s.length] = l[1]; else {
                        if (null === (l = r.index_access.exec(o))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                        s[s.length] = l[1]
                    }
                    i[2] = s
                } else a |= 2;
                if (3 === a) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                n[n.length] = i
            }
            t = t.substring(i[0].length)
        }
        return n
    };
    var a = function (e, i, n) {
        return n = (i || []).slice(0), n.splice(0, 0, e), t.apply(null, n)
    };
    "undefined" != typeof exports ? (exports.sprintf = t, exports.vsprintf = a) : (e.sprintf = t, e.vsprintf = a, "function" == typeof define && define.amd && define(function () {
        return {sprintf: t, vsprintf: a}
    }))
}("undefined" == typeof window ? this : window);
var LZString = function () {
    function e(e, t) {
        if (!r[e]) {
            r[e] = {};
            for (var i = 0; i < e.length; i++) r[e][e.charAt(i)] = i
        }
        return r[e][t]
    }

    var t = String.fromCharCode, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", r = {}, a = {
        compressToBase64: function (e) {
            if (null == e) return "";
            var t = a._compress(e, 6, function (e) {
                return i.charAt(e)
            });
            switch (t.length % 4) {
                default:
                case 0:
                    return t;
                case 1:
                    return t + "===";
                case 2:
                    return t + "==";
                case 3:
                    return t + "="
            }
        }, decompressFromBase64: function (t) {
            return null == t ? "" : "" == t ? null : a._decompress(t.length, 32, function (n) {
                return e(i, t.charAt(n))
            })
        }, compressToUTF16: function (e) {
            return null == e ? "" : a._compress(e, 15, function (e) {
                return t(e + 32)
            }) + " "
        }, decompressFromUTF16: function (e) {
            return null == e ? "" : "" == e ? null : a._decompress(e.length, 16384, function (t) {
                return e.charCodeAt(t) - 32
            })
        }, compressToUint8Array: function (e) {
            for (var t = a.compress(e), i = new Uint8Array(2 * t.length), n = 0, r = t.length; n < r; n++) {
                var s = t.charCodeAt(n);
                i[2 * n] = s >>> 8, i[2 * n + 1] = s % 256
            }
            return i
        }, decompressFromUint8Array: function (e) {
            if (null === e || void 0 === e) return a.decompress(e);
            for (var i = new Array(e.length / 2), n = 0, r = i.length; n < r; n++) i[n] = 256 * e[2 * n] + e[2 * n + 1];
            var s = [];
            return i.forEach(function (e) {
                s.push(t(e))
            }), a.decompress(s.join(""))
        }, compressToEncodedURIComponent: function (e) {
            return null == e ? "" : a._compress(e, 6, function (e) {
                return n.charAt(e)
            })
        }, decompressFromEncodedURIComponent: function (t) {
            return null == t ? "" : "" == t ? null : (t = t.replace(/ /g, "+"), a._decompress(t.length, 32, function (i) {
                return e(n, t.charAt(i))
            }))
        }, compress: function (e) {
            return a._compress(e, 16, function (e) {
                return t(e)
            })
        }, _compress: function (e, t, i) {
            if (null == e) return "";
            var n, r, a, s = {}, o = {}, l = "", u = "", d = "", c = 2, m = 3, h = 2, p = [], f = 0, _ = 0;
            for (a = 0; a < e.length; a += 1) if (l = e.charAt(a), Object.prototype.hasOwnProperty.call(s, l) || (s[l] = m++, o[l] = !0), u = d + l, Object.prototype.hasOwnProperty.call(s, u)) d = u; else {
                if (Object.prototype.hasOwnProperty.call(o, d)) {
                    if (d.charCodeAt(0) < 256) {
                        for (n = 0; n < h; n++) f <<= 1, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++;
                        for (r = d.charCodeAt(0), n = 0; n < 8; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1
                    } else {
                        for (r = 1, n = 0; n < h; n++) f = f << 1 | r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r = 0;
                        for (r = d.charCodeAt(0), n = 0; n < 16; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1
                    }
                    c--, 0 == c && (c = Math.pow(2, h), h++), delete o[d]
                } else for (r = s[d], n = 0; n < h; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1;
                c--, 0 == c && (c = Math.pow(2, h), h++), s[u] = m++, d = String(l)
            }
            if ("" !== d) {
                if (Object.prototype.hasOwnProperty.call(o, d)) {
                    if (d.charCodeAt(0) < 256) {
                        for (n = 0; n < h; n++) f <<= 1, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++;
                        for (r = d.charCodeAt(0), n = 0; n < 8; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1
                    } else {
                        for (r = 1, n = 0; n < h; n++) f = f << 1 | r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r = 0;
                        for (r = d.charCodeAt(0), n = 0; n < 16; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1
                    }
                    c--, 0 == c && (c = Math.pow(2, h), h++), delete o[d]
                } else for (r = s[d], n = 0; n < h; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1;
                c--, 0 == c && (c = Math.pow(2, h), h++)
            }
            for (r = 2, n = 0; n < h; n++) f = f << 1 | 1 & r, _ == t - 1 ? (_ = 0, p.push(i(f)), f = 0) : _++, r >>= 1;
            for (; ;) {
                if (f <<= 1, _ == t - 1) {
                    p.push(i(f));
                    break
                }
                _++
            }
            return p.join("")
        }, decompress: function (e) {
            return null == e ? "" : "" == e ? null : a._decompress(e.length, 32768, function (t) {
                return e.charCodeAt(t)
            })
        }, _decompress: function (e, i, n) {
            var r, a, s, o, l, u, d, c = [], m = 4, h = 4, p = 3, f = "", _ = [], g = {val: n(0), position: i, index: 1};
            for (r = 0; r < 3; r += 1) c[r] = r;
            for (s = 0, l = Math.pow(2, 2), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
            switch (s) {
                case 0:
                    for (s = 0, l = Math.pow(2, 8), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
                    d = t(s);
                    break;
                case 1:
                    for (s = 0, l = Math.pow(2, 16), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
                    d = t(s);
                    break;
                case 2:
                    return ""
            }
            for (c[3] = d, a = d, _.push(d); ;) {
                if (g.index > e) return "";
                for (s = 0, l = Math.pow(2, p), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
                switch (d = s) {
                    case 0:
                        for (s = 0, l = Math.pow(2, 8), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
                        c[h++] = t(s), d = h - 1, m--;
                        break;
                    case 1:
                        for (s = 0, l = Math.pow(2, 16), u = 1; u != l;) o = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = i, g.val = n(g.index++)), s |= (o > 0 ? 1 : 0) * u, u <<= 1;
                        c[h++] = t(s), d = h - 1, m--;
                        break;
                    case 2:
                        return _.join("")
                }
                if (0 == m && (m = Math.pow(2, p), p++), c[d]) f = c[d]; else {
                    if (d !== h) return null;
                    f = a + a.charAt(0)
                }
                _.push(f), c[h++] = a + f.charAt(0), m--, a = f, 0 == m && (m = Math.pow(2, p), p++)
            }
        }
    };
    return a
}();
"function" == typeof define && define.amd ? define(function () {
    return LZString
}) : "undefined" != typeof module && null != module && (module.exports = LZString), function (e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.printStackTrace = t()
}(this, function () {
    function e(t) {
        t = t || {guess: !0};
        var i = t.e || null, n = !!t.guess, r = t.mode || null, a = new e.implementation, s = a.run(i, r);
        return n ? a.guessAnonymousFunctions(s) : s
    }

    return e.implementation = function () {
    }, e.implementation.prototype = {
        run: function (e, t) {
            return e = e || this.createException(), t = t || this.mode(e), "other" === t ? this.other(arguments.callee) : this[t](e)
        }, createException: function () {
            try {
                this.undef()
            } catch (e) {
                return e
            }
        }, mode: function (e) {
            return "undefined" != typeof window && window.navigator.userAgent.indexOf("PhantomJS") > -1 ? "phantomjs" : e.arguments && e.stack ? "chrome" : e.stack && e.sourceURL ? "safari" : e.stack && e.number ? "ie" : e.stack && e.fileName ? "firefox" : e.message && e["opera#sourceloc"] ? e.stacktrace ? e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length ? "opera9" : "opera10a" : "opera9" : e.message && e.stack && e.stacktrace ? e.stacktrace.indexOf("called from line") < 0 ? "opera10b" : "opera11" : e.stack && !e.fileName ? "chrome" : "other"
        }, instrumentFunction: function (t, i, n) {
            t = t || window;
            var r = t[i];
            t[i] = function () {
                return n.call(this, e().slice(4)), t[i]._instrumented.apply(this, arguments)
            }, t[i]._instrumented = r
        }, deinstrumentFunction: function (e, t) {
            e[t].constructor === Function && e[t]._instrumented && e[t]._instrumented.constructor === Function && (e[t] = e[t]._instrumented)
        }, chrome: function (e) {
            return (e.stack + "\n").replace(/^[\s\S]+?\s+at\s+/, " at ").replace(/^\s+(at eval )?at\s+/gm, "").replace(/^([^\(]+?)([\n$])/gm, "{anonymous}() ($1)$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}() ($1)").replace(/^(.+) \((.+)\)$/gm, "$1@$2").split("\n").slice(0, -1)
        }, safari: function (e) {
            return e.stack.replace(/\[native code\]\n/m, "").replace(/^(?=\w+Error\:).*$\n/m, "").replace(/^@/gm, "{anonymous}()@").split("\n")
        }, ie: function (e) {
            return e.stack.replace(/^\s*at\s+(.*)$/gm, "$1").replace(/^Anonymous function\s+/gm, "{anonymous}() ").replace(/^(.+)\s+\((.+)\)$/gm, "$1@$2").split("\n").slice(1)
        }, firefox: function (e) {
            return e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^(?:\((\S*)\))?@/gm, "{anonymous}($1)@").split("\n")
        }, opera11: function (e) {
            for (var t = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/, i = e.stacktrace.split("\n"), n = [], r = 0, a = i.length; r < a; r += 2) {
                var s = t.exec(i[r]);
                if (s) {
                    var o = s[4] + ":" + s[1] + ":" + s[2], l = s[3] || "global code";
                    l = l.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, "{anonymous}"), n.push(l + "@" + o + " -- " + i[r + 1].replace(/^\s+/, ""))
                }
            }
            return n
        }, opera10b: function (e) {
            for (var t = /^(.*)@(.+):(\d+)$/, i = e.stacktrace.split("\n"), n = [], r = 0, a = i.length; r < a; r++) {
                var s = t.exec(i[r]);
                if (s) {
                    var o = s[1] ? s[1] + "()" : "global code";
                    n.push(o + "@" + s[2] + ":" + s[3])
                }
            }
            return n
        }, opera10a: function (e) {
            for (var t = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i, i = e.stacktrace.split("\n"), n = [], r = 0, a = i.length; r < a; r += 2) {
                var s = t.exec(i[r]);
                if (s) {
                    var o = s[3] || "{anonymous}";
                    n.push(o + "()@" + s[2] + ":" + s[1] + " -- " + i[r + 1].replace(/^\s+/, ""))
                }
            }
            return n
        }, opera9: function (e) {
            for (var t = /Line (\d+).*script (?:in )?(\S+)/i, i = e.message.split("\n"), n = [], r = 2, a = i.length; r < a; r += 2) {
                var s = t.exec(i[r]);
                s && n.push("{anonymous}()@" + s[2] + ":" + s[1] + " -- " + i[r + 1].replace(/^\s+/, ""))
            }
            return n
        }, phantomjs: function (e) {
            for (var t = /(\S+) \((\S+)\)/i, i = e.stack.split("\n"), n = [], r = 1, a = i.length; r < a; r++) {
                i[r] = i[r].replace(/^\s+at\s+/gm, "");
                var s = t.exec(i[r]);
                s ? n.push(s[1] + "()@" + s[2]) : n.push("{anonymous}()@" + i[r])
            }
            return n
        }, other: function (e) {
            for (var t, i, n = /function(?:\s+([\w$]+))?\s*\(/, r = [], a = Array.prototype.slice; e && r.length < 10;) {
                t = n.test(e.toString()) ? RegExp.$1 || "{anonymous}" : "{anonymous}";
                try {
                    i = a.call(e.arguments || [])
                } catch (e) {
                    i = ["Cannot access arguments: " + e]
                }
                r[r.length] = t + "(" + this.stringifyArguments(i) + ")";
                try {
                    e = e.caller
                } catch (e) {
                    r[r.length] = "Cannot access caller: " + e;
                    break
                }
            }
            return r
        }, stringifyArguments: function (e) {
            for (var t = [], i = Array.prototype.slice, n = 0; n < e.length; ++n) {
                var r = e[n];
                void 0 === r ? t[n] = "undefined" : null === r ? t[n] = "null" : r.constructor && (r.constructor === Array ? r.length < 3 ? t[n] = "[" + this.stringifyArguments(r) + "]" : t[n] = "[" + this.stringifyArguments(i.call(r, 0, 1)) + "..." + this.stringifyArguments(i.call(r, -1)) + "]" : r.constructor === Object ? t[n] = "#object" : r.constructor === Function ? t[n] = "#function" : r.constructor === String ? t[n] = '"' + r + '"' : r.constructor === Number ? t[n] = r : t[n] = "?")
            }
            return t.join(",")
        }, sourceCache: {}, ajax: function (e) {
            var t = this.createXMLHTTPObject();
            if (t) try {
                return t.open("GET", e, !1), t.send(null), t.responseText
            } catch (e) {
            }
            return ""
        }, createXMLHTTPObject: function () {
            for (var e, t = [function () {
                return new XMLHttpRequest
            }, function () {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function () {
                return new ActiveXObject("Msxml3.XMLHTTP")
            }, function () {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }], i = 0; i < t.length; i++) try {
                return e = t[i](), this.createXMLHTTPObject = t[i], e
            } catch (e) {
            }
        }, isSameDomain: function (e) {
            return "undefined" != typeof location && -1 !== e.indexOf(location.hostname)
        }, getSource: function (e) {
            return e in this.sourceCache || (this.sourceCache[e] = this.ajax(e).split("\n")), this.sourceCache[e]
        }, guessAnonymousFunctions: function (e) {
            for (var t = 0; t < e.length; ++t) {
                var i = /\{anonymous\}\(.*\)@(.*)/, n = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/, r = e[t], a = i.exec(r);
                if (a) {
                    var s = n.exec(a[1]);
                    if (s) {
                        var o = s[1], l = s[2], u = s[3] || 0;
                        if (o && this.isSameDomain(o) && l) {
                            var d = this.guessAnonymousFunction(o, l, u);
                            e[t] = r.replace("{anonymous}", d)
                        }
                    }
                }
            }
            return e
        }, guessAnonymousFunction: function (e, t, i) {
            var n;
            try {
                n = this.findFunctionName(this.getSource(e), t)
            } catch (t) {
                n = "getSource failed with url: " + e + ", exception: " + t.toString()
            }
            return n
        }, findFunctionName: function (e, t) {
            for (var i, n, r, a = /function\s+([^(]*?)\s*\(([^)]*)\)/, s = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/, o = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/, l = "", u = Math.min(t, 20), d = 0; d < u; ++d) if (i = e[t - d - 1], r = i.indexOf("//"), r >= 0 && (i = i.substr(0, r)), i) {
                if (l = i + l, (n = s.exec(l)) && n[1]) return n[1];
                if ((n = a.exec(l)) && n[1]) return n[1];
                if ((n = o.exec(l)) && n[1]) return n[1]
            }
            return "(?)"
        }
    }, e
}), function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.moment = t()
}(this, function () {
    "use strict";

    function e() {
        return Fn.apply(null, arguments)
    }

    function t(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }

    function i(e) {
        return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e)
    }

    function n(e, t) {
        var i, n = [];
        for (i = 0; i < e.length; ++i) n.push(t(e[i], i));
        return n
    }

    function r(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }

    function a(e, t) {
        for (var i in t) r(t, i) && (e[i] = t[i]);
        return r(t, "toString") && (e.toString = t.toString), r(t, "valueOf") && (e.valueOf = t.valueOf), e
    }

    function s(e, t, i, n) {
        return Ae(e, t, i, n, !0).utc()
    }

    function o() {
        return {empty: !1, unusedTokens: [], unusedInput: [], overflow: -2, charsLeftOver: 0, nullInput: !1, invalidMonth: null, invalidFormat: !1, userInvalidated: !1, iso: !1}
    }

    function l(e) {
        return null == e._pf && (e._pf = o()), e._pf
    }

    function u(e) {
        if (null == e._isValid) {
            var t = l(e);
            e._isValid = !(isNaN(e._d.getTime()) || !(t.overflow < 0) || t.empty || t.invalidMonth || t.invalidWeekday || t.nullInput || t.invalidFormat || t.userInvalidated), e._strict && (e._isValid = e._isValid && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour)
        }
        return e._isValid
    }

    function d(e) {
        var t = s(NaN);
        return null != e ? a(l(t), e) : l(t).userInvalidated = !0, t
    }

    function c(e, t) {
        var i, n, r;
        if (void 0 !== t._isAMomentObject && (e._isAMomentObject = t._isAMomentObject), void 0 !== t._i && (e._i = t._i), void 0 !== t._f && (e._f = t._f), void 0 !== t._l && (e._l = t._l), void 0 !== t._strict && (e._strict = t._strict), void 0 !== t._tzm && (e._tzm = t._tzm), void 0 !== t._isUTC && (e._isUTC = t._isUTC), void 0 !== t._offset && (e._offset = t._offset), void 0 !== t._pf && (e._pf = l(t)), void 0 !== t._locale && (e._locale = t._locale), Hn.length > 0) for (i in Hn) n = Hn[i], void 0 !== (r = t[n]) && (e[n] = r);
        return e
    }

    function m(t) {
        c(this, t), this._d = new Date(null != t._d ? t._d.getTime() : NaN), !1 === Bn && (Bn = !0, e.updateOffset(this), Bn = !1)
    }

    function h(e) {
        return e instanceof m || null != e && null != e._isAMomentObject
    }

    function p(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e)
    }

    function f(e) {
        var t = +e, i = 0;
        return 0 !== t && isFinite(t) && (i = p(t)), i
    }

    function _(e, t, i) {
        var n, r = Math.min(e.length, t.length), a = Math.abs(e.length - t.length), s = 0;
        for (n = 0; n < r; n++) (i && e[n] !== t[n] || !i && f(e[n]) !== f(t[n])) && s++;
        return s + a
    }

    function g() {
    }

    function y(e) {
        return e ? e.toLowerCase().replace("_", "-") : e
    }

    function v(e) {
        for (var t, i, n, r, a = 0; a < e.length;) {
            for (r = y(e[a]).split("-"), t = r.length, i = y(e[a + 1]), i = i ? i.split("-") : null; t > 0;) {
                if (n = k(r.slice(0, t).join("-"))) return n;
                if (i && i.length >= t && _(r, i, !0) >= t - 1) break;
                t--
            }
            a++
        }
        return null
    }

    function k(e) {
        var t = null;
        if (!Un[e] && "undefined" != typeof module && module && module.exports) try {
            t = zn._abbr, require("./locale/" + e), w(t)
        } catch (e) {
        }
        return Un[e]
    }

    function w(e, t) {
        var i;
        return e && (i = void 0 === t ? b(e) : T(e, t)) && (zn = i), zn._abbr
    }

    function T(e, t) {
        return null !== t ? (t.abbr = e, Un[e] = Un[e] || new g, Un[e].set(t), w(e), Un[e]) : (delete Un[e], null)
    }

    function b(e) {
        var i;
        if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return zn;
        if (!t(e)) {
            if (i = k(e)) return i;
            e = [e]
        }
        return v(e)
    }

    function M(e, t) {
        var i = e.toLowerCase();
        $n[i] = $n[i + "s"] = $n[t] = e
    }

    function D(e) {
        return "string" == typeof e ? $n[e] || $n[e.toLowerCase()] : void 0
    }

    function L(e) {
        var t, i, n = {};
        for (i in e) r(e, i) && (t = D(i)) && (n[t] = e[i]);
        return n
    }

    function A(t, i) {
        return function (n) {
            return null != n ? (Y(this, t, n), e.updateOffset(this, i), this) : S(this, t)
        }
    }

    function S(e, t) {
        return e._d["get" + (e._isUTC ? "UTC" : "") + t]()
    }

    function Y(e, t, i) {
        return e._d["set" + (e._isUTC ? "UTC" : "") + t](i)
    }

    function x(e, t) {
        var i;
        if ("object" == typeof e) for (i in e) this.set(i, e[i]); else if (e = D(e), "function" == typeof this[e]) return this[e](t);
        return this
    }

    function E(e, t, i) {
        var n = "" + Math.abs(e), r = t - n.length;
        return (e >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + n
    }

    function C(e, t, i, n) {
        var r = n;
        "string" == typeof n && (r = function () {
            return this[n]()
        }), e && (Gn[e] = r), t && (Gn[t[0]] = function () {
            return E(r.apply(this, arguments), t[1], t[2])
        }), i && (Gn[i] = function () {
            return this.localeData().ordinal(r.apply(this, arguments), e)
        })
    }

    function O(e) {
        return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
    }

    function P(e) {
        var t, i, n = e.match(Nn);
        for (t = 0, i = n.length; t < i; t++) Gn[n[t]] ? n[t] = Gn[n[t]] : n[t] = O(n[t]);
        return function (r) {
            var a = "";
            for (t = 0; t < i; t++) a += n[t] instanceof Function ? n[t].call(r, e) : n[t];
            return a
        }
    }

    function I(e, t) {
        return e.isValid() ? (t = j(t, e.localeData()), Kn[t] = Kn[t] || P(t), Kn[t](e)) : e.localeData().invalidDate()
    }

    function j(e, t) {
        function i(e) {
            return t.longDateFormat(e) || e
        }

        var n = 5;
        for (Rn.lastIndex = 0; n >= 0 && Rn.test(e);) e = e.replace(Rn, i), Rn.lastIndex = 0, n -= 1;
        return e
    }

    function W(e) {
        return "function" == typeof e && "[object Function]" === Object.prototype.toString.call(e)
    }

    function F(e, t, i) {
        lr[e] = W(t) ? t : function (e) {
            return e && i ? i : t
        }
    }

    function z(e, t) {
        return r(lr, e) ? lr[e](t._strict, t._locale) : new RegExp(H(e))
    }

    function H(e) {
        return e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, i, n, r) {
            return t || i || n || r
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function B(e, t) {
        var i, n = t;
        for ("string" == typeof e && (e = [e]), "number" == typeof t && (n = function (e, i) {
            i[t] = f(e)
        }), i = 0; i < e.length; i++) ur[e[i]] = n
    }

    function U(e, t) {
        B(e, function (e, i, n, r) {
            n._w = n._w || {}, t(e, n._w, n, r)
        })
    }

    function $(e, t, i) {
        null != t && r(ur, e) && ur[e](t, i._a, i, e)
    }

    function N(e, t) {
        return new Date(Date.UTC(e, t + 1, 0)).getUTCDate()
    }

    function R(e) {
        return this._months[e.month()]
    }

    function K(e) {
        return this._monthsShort[e.month()]
    }

    function G(e, t, i) {
        var n, r, a;
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), n = 0; n < 12; n++) {
            if (r = s([2e3, n]), i && !this._longMonthsParse[n] && (this._longMonthsParse[n] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i"), this._shortMonthsParse[n] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i")), i || this._monthsParse[n] || (a = "^" + this.months(r, "") + "|^" + this.monthsShort(r, ""), this._monthsParse[n] = new RegExp(a.replace(".", ""), "i")), i && "MMMM" === t && this._longMonthsParse[n].test(e)) return n;
            if (i && "MMM" === t && this._shortMonthsParse[n].test(e)) return n;
            if (!i && this._monthsParse[n].test(e)) return n
        }
    }

    function q(e, t) {
        var i;
        return "string" == typeof t && "number" != typeof(t = e.localeData().monthsParse(t)) ? e : (i = Math.min(e.date(), N(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, i), e)
    }

    function V(t) {
        return null != t ? (q(this, t), e.updateOffset(this, !0), this) : S(this, "Month")
    }

    function J() {
        return N(this.year(), this.month())
    }

    function Z(e) {
        var t, i = e._a;
        return i && -2 === l(e).overflow && (t = i[cr] < 0 || i[cr] > 11 ? cr : i[mr] < 1 || i[mr] > N(i[dr], i[cr]) ? mr : i[hr] < 0 || i[hr] > 24 || 24 === i[hr] && (0 !== i[pr] || 0 !== i[fr] || 0 !== i[_r]) ? hr : i[pr] < 0 || i[pr] > 59 ? pr : i[fr] < 0 || i[fr] > 59 ? fr : i[_r] < 0 || i[_r] > 999 ? _r : -1, l(e)._overflowDayOfYear && (t < dr || t > mr) && (t = mr), l(e).overflow = t), e
    }

    function Q(t) {
        !1 === e.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t)
    }

    function X(e, t) {
        var i = !0;
        return a(function () {
            return i && (Q(e + "\n" + (new Error).stack), i = !1), t.apply(this, arguments)
        }, t)
    }

    function ee(e, t) {
        vr[e] || (Q(t), vr[e] = !0)
    }

    function te(e) {
        var t, i, n = e._i, r = kr.exec(n);
        if (r) {
            for (l(e).iso = !0, t = 0, i = wr.length; t < i; t++) if (wr[t][1].exec(n)) {
                e._f = wr[t][0];
                break
            }
            for (t = 0, i = Tr.length; t < i; t++) if (Tr[t][1].exec(n)) {
                e._f += (r[6] || " ") + Tr[t][0];
                break
            }
            n.match(ar) && (e._f += "Z"), ke(e)
        } else e._isValid = !1
    }

    function ie(t) {
        var i = br.exec(t._i);
        if (null !== i) return void(t._d = new Date(+i[1]));
        te(t), !1 === t._isValid && (delete t._isValid, e.createFromInputFallback(t))
    }

    function ne(e, t, i, n, r, a, s) {
        var o = new Date(e, t, i, n, r, a, s);
        return e < 1970 && o.setFullYear(e), o
    }

    function re(e) {
        var t = new Date(Date.UTC.apply(null, arguments));
        return e < 1970 && t.setUTCFullYear(e), t
    }

    function ae(e) {
        return se(e) ? 366 : 365
    }

    function se(e) {
        return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
    }

    function oe() {
        return se(this.year())
    }

    function le(e, t, i) {
        var n, r = i - t, a = i - e.day();
        return a > r && (a -= 7), a < r - 7 && (a += 7), n = Se(e).add(a, "d"), {week: Math.ceil(n.dayOfYear() / 7), year: n.year()}
    }

    function ue(e) {
        return le(e, this._week.dow, this._week.doy).week
    }

    function de() {
        return this._week.dow
    }

    function ce() {
        return this._week.doy
    }

    function me(e) {
        var t = this.localeData().week(this);
        return null == e ? t : this.add(7 * (e - t), "d")
    }

    function he(e) {
        var t = le(this, 1, 4).week;
        return null == e ? t : this.add(7 * (e - t), "d")
    }

    function pe(e, t, i, n, r) {
        var a, s = 6 + r - n, o = re(e, 0, 1 + s), l = o.getUTCDay();
        return l < r && (l += 7), i = null != i ? 1 * i : r, a = 1 + s + 7 * (t - 1) - l + i, {year: a > 0 ? e : e - 1, dayOfYear: a > 0 ? a : ae(e - 1) + a}
    }

    function fe(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == e ? t : this.add(e - t, "d")
    }

    function _e(e, t, i) {
        return null != e ? e : null != t ? t : i
    }

    function ge(e) {
        var t = new Date;
        return e._useUTC ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()] : [t.getFullYear(), t.getMonth(), t.getDate()]
    }

    function ye(e) {
        var t, i, n, r, a = [];
        if (!e._d) {
            for (n = ge(e), e._w && null == e._a[mr] && null == e._a[cr] && ve(e), e._dayOfYear && (r = _e(e._a[dr], n[dr]), e._dayOfYear > ae(r) && (l(e)._overflowDayOfYear = !0), i = re(r, 0, e._dayOfYear), e._a[cr] = i.getUTCMonth(), e._a[mr] = i.getUTCDate()), t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = a[t] = n[t];
            for (; t < 7; t++) e._a[t] = a[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
            24 === e._a[hr] && 0 === e._a[pr] && 0 === e._a[fr] && 0 === e._a[_r] && (e._nextDay = !0, e._a[hr] = 0), e._d = (e._useUTC ? re : ne).apply(null, a), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[hr] = 24)
        }
    }

    function ve(e) {
        var t, i, n, r, a, s, o;
        t = e._w, null != t.GG || null != t.W || null != t.E ? (a = 1, s = 4, i = _e(t.GG, e._a[dr], le(Se(), 1, 4).year), n = _e(t.W, 1), r = _e(t.E, 1)) : (a = e._locale._week.dow, s = e._locale._week.doy, i = _e(t.gg, e._a[dr], le(Se(), a, s).year), n = _e(t.w, 1), null != t.d ? (r = t.d) < a && ++n : r = null != t.e ? t.e + a : a), o = pe(i, n, r, s, a), e._a[dr] = o.year, e._dayOfYear = o.dayOfYear
    }

    function ke(t) {
        if (t._f === e.ISO_8601) return void te(t);
        t._a = [], l(t).empty = !0;
        var i, n, r, a, s, o = "" + t._i, u = o.length, d = 0;
        for (r = j(t._f, t._locale).match(Nn) || [], i = 0; i < r.length; i++) a = r[i], n = (o.match(z(a, t)) || [])[0], n && (s = o.substr(0, o.indexOf(n)), s.length > 0 && l(t).unusedInput.push(s), o = o.slice(o.indexOf(n) + n.length), d += n.length), Gn[a] ? (n ? l(t).empty = !1 : l(t).unusedTokens.push(a), $(a, n, t)) : t._strict && !n && l(t).unusedTokens.push(a);
        l(t).charsLeftOver = u - d, o.length > 0 && l(t).unusedInput.push(o), !0 === l(t).bigHour && t._a[hr] <= 12 && t._a[hr] > 0 && (l(t).bigHour = void 0), t._a[hr] = we(t._locale, t._a[hr], t._meridiem), ye(t), Z(t)
    }

    function we(e, t, i) {
        var n;
        return null == i ? t : null != e.meridiemHour ? e.meridiemHour(t, i) : null != e.isPM ? (n = e.isPM(i), n && t < 12 && (t += 12), n || 12 !== t || (t = 0), t) : t
    }

    function Te(e) {
        var t, i, n, r, s;
        if (0 === e._f.length) return l(e).invalidFormat = !0, void(e._d = new Date(NaN));
        for (r = 0; r < e._f.length; r++) s = 0, t = c({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._f = e._f[r], ke(t), u(t) && (s += l(t).charsLeftOver, s += 10 * l(t).unusedTokens.length, l(t).score = s, (null == n || s < n) && (n = s, i = t));
        a(e, i || t)
    }

    function be(e) {
        if (!e._d) {
            var t = L(e._i);
            e._a = [t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], ye(e)
        }
    }

    function Me(e) {
        var t = new m(Z(De(e)));
        return t._nextDay && (t.add(1, "d"), t._nextDay = void 0), t
    }

    function De(e) {
        var n = e._i, r = e._f;
        return e._locale = e._locale || b(e._l), null === n || void 0 === r && "" === n ? d({nullInput: !0}) : ("string" == typeof n && (e._i = n = e._locale.preparse(n)), h(n) ? new m(Z(n)) : (t(r) ? Te(e) : r ? ke(e) : i(n) ? e._d = n : Le(e), e))
    }

    function Le(r) {
        var a = r._i;
        void 0 === a ? r._d = new Date : i(a) ? r._d = new Date(+a) : "string" == typeof a ? ie(r) : t(a) ? (r._a = n(a.slice(0), function (e) {
            return parseInt(e, 10)
        }), ye(r)) : "object" == typeof a ? be(r) : "number" == typeof a ? r._d = new Date(a) : e.createFromInputFallback(r)
    }

    function Ae(e, t, i, n, r) {
        var a = {};
        return "boolean" == typeof i && (n = i, i = void 0), a._isAMomentObject = !0, a._useUTC = a._isUTC = r, a._l = i, a._i = e, a._f = t, a._strict = n, Me(a)
    }

    function Se(e, t, i, n) {
        return Ae(e, t, i, n, !1)
    }

    function Ye(e, i) {
        var n, r;
        if (1 === i.length && t(i[0]) && (i = i[0]),
                !i.length) return Se();
        for (n = i[0], r = 1; r < i.length; ++r) i[r].isValid() && !i[r][e](n) || (n = i[r]);
        return n
    }

    function xe() {
        return Ye("isBefore", [].slice.call(arguments, 0))
    }

    function Ee() {
        return Ye("isAfter", [].slice.call(arguments, 0))
    }

    function Ce(e) {
        var t = L(e), i = t.year || 0, n = t.quarter || 0, r = t.month || 0, a = t.week || 0, s = t.day || 0, o = t.hour || 0, l = t.minute || 0, u = t.second || 0, d = t.millisecond || 0;
        this._milliseconds = +d + 1e3 * u + 6e4 * l + 36e5 * o, this._days = +s + 7 * a, this._months = +r + 3 * n + 12 * i, this._data = {}, this._locale = b(), this._bubble()
    }

    function Oe(e) {
        return e instanceof Ce
    }

    function Pe(e, t) {
        C(e, 0, 0, function () {
            var e = this.utcOffset(), i = "+";
            return e < 0 && (e = -e, i = "-"), i + E(~~(e / 60), 2) + t + E(~~e % 60, 2)
        })
    }

    function Ie(e) {
        var t = (e || "").match(ar) || [], i = t[t.length - 1] || [], n = (i + "").match(Sr) || ["-", 0, 0], r = 60 * n[1] + f(n[2]);
        return "+" === n[0] ? r : -r
    }

    function je(t, n) {
        var r, a;
        return n._isUTC ? (r = n.clone(), a = (h(t) || i(t) ? +t : +Se(t)) - +r, r._d.setTime(+r._d + a), e.updateOffset(r, !1), r) : Se(t).local()
    }

    function We(e) {
        return 15 * -Math.round(e._d.getTimezoneOffset() / 15)
    }

    function Fe(t, i) {
        var n, r = this._offset || 0;
        return null != t ? ("string" == typeof t && (t = Ie(t)), Math.abs(t) < 16 && (t *= 60), !this._isUTC && i && (n = We(this)), this._offset = t, this._isUTC = !0, null != n && this.add(n, "m"), r !== t && (!i || this._changeInProgress ? et(this, Ve(t - r, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, e.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? r : We(this)
    }

    function ze(e, t) {
        return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset()
    }

    function He(e) {
        return this.utcOffset(0, e)
    }

    function Be(e) {
        return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(We(this), "m")), this
    }

    function Ue() {
        return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ie(this._i)), this
    }

    function $e(e) {
        return e = e ? Se(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0
    }

    function Ne() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }

    function Re() {
        if (void 0 !== this._isDSTShifted) return this._isDSTShifted;
        var e = {};
        if (c(e, this), e = De(e), e._a) {
            var t = e._isUTC ? s(e._a) : Se(e._a);
            this._isDSTShifted = this.isValid() && _(e._a, t.toArray()) > 0
        } else this._isDSTShifted = !1;
        return this._isDSTShifted
    }

    function Ke() {
        return !this._isUTC
    }

    function Ge() {
        return this._isUTC
    }

    function qe() {
        return this._isUTC && 0 === this._offset
    }

    function Ve(e, t) {
        var i, n, a, s = e, o = null;
        return Oe(e) ? s = {
            ms: e._milliseconds,
            d: e._days,
            M: e._months
        } : "number" == typeof e ? (s = {}, t ? s[t] = e : s.milliseconds = e) : (o = Yr.exec(e)) ? (i = "-" === o[1] ? -1 : 1, s = {
            y: 0,
            d: f(o[mr]) * i,
            h: f(o[hr]) * i,
            m: f(o[pr]) * i,
            s: f(o[fr]) * i,
            ms: f(o[_r]) * i
        }) : (o = xr.exec(e)) ? (i = "-" === o[1] ? -1 : 1, s = {
            y: Je(o[2], i),
            M: Je(o[3], i),
            d: Je(o[4], i),
            h: Je(o[5], i),
            m: Je(o[6], i),
            s: Je(o[7], i),
            w: Je(o[8], i)
        }) : null == s ? s = {} : "object" == typeof s && ("from" in s || "to" in s) && (a = Qe(Se(s.from), Se(s.to)), s = {}, s.ms = a.milliseconds, s.M = a.months), n = new Ce(s), Oe(e) && r(e, "_locale") && (n._locale = e._locale), n
    }

    function Je(e, t) {
        var i = e && parseFloat(e.replace(",", "."));
        return (isNaN(i) ? 0 : i) * t
    }

    function Ze(e, t) {
        var i = {milliseconds: 0, months: 0};
        return i.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(i.months, "M").isAfter(t) && --i.months, i.milliseconds = +t - +e.clone().add(i.months, "M"), i
    }

    function Qe(e, t) {
        var i;
        return t = je(t, e), e.isBefore(t) ? i = Ze(e, t) : (i = Ze(t, e), i.milliseconds = -i.milliseconds, i.months = -i.months), i
    }

    function Xe(e, t) {
        return function (i, n) {
            var r, a;
            return null === n || isNaN(+n) || (ee(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period)."), a = i, i = n, n = a), i = "string" == typeof i ? +i : i, r = Ve(i, n), et(this, r, e), this
        }
    }

    function et(t, i, n, r) {
        var a = i._milliseconds, s = i._days, o = i._months;
        r = null == r || r, a && t._d.setTime(+t._d + a * n), s && Y(t, "Date", S(t, "Date") + s * n), o && q(t, S(t, "Month") + o * n), r && e.updateOffset(t, s || o)
    }

    function tt(e, t) {
        var i = e || Se(), n = je(i, this).startOf("day"), r = this.diff(n, "days", !0),
            a = r < -6 ? "sameElse" : r < -1 ? "lastWeek" : r < 0 ? "lastDay" : r < 1 ? "sameDay" : r < 2 ? "nextDay" : r < 7 ? "nextWeek" : "sameElse";
        return this.format(t && t[a] || this.localeData().calendar(a, this, Se(i)))
    }

    function it() {
        return new m(this)
    }

    function nt(e, t) {
        return t = D(void 0 !== t ? t : "millisecond"), "millisecond" === t ? (e = h(e) ? e : Se(e), +this > +e) : (h(e) ? +e : +Se(e)) < +this.clone().startOf(t)
    }

    function rt(e, t) {
        var i;
        return t = D(void 0 !== t ? t : "millisecond"), "millisecond" === t ? (e = h(e) ? e : Se(e), +this < +e) : (i = h(e) ? +e : +Se(e), +this.clone().endOf(t) < i)
    }

    function at(e, t, i) {
        return this.isAfter(e, i) && this.isBefore(t, i)
    }

    function st(e, t) {
        var i;
        return t = D(t || "millisecond"), "millisecond" === t ? (e = h(e) ? e : Se(e), +this == +e) : (i = +Se(e), +this.clone().startOf(t) <= i && i <= +this.clone().endOf(t))
    }

    function ot(e, t, i) {
        var n, r, a = je(e, this), s = 6e4 * (a.utcOffset() - this.utcOffset());
        return t = D(t), "year" === t || "month" === t || "quarter" === t ? (r = lt(this, a), "quarter" === t ? r /= 3 : "year" === t && (r /= 12)) : (n = this - a, r = "second" === t ? n / 1e3 : "minute" === t ? n / 6e4 : "hour" === t ? n / 36e5 : "day" === t ? (n - s) / 864e5 : "week" === t ? (n - s) / 6048e5 : n), i ? r : p(r)
    }

    function lt(e, t) {
        var i, n, r = 12 * (t.year() - e.year()) + (t.month() - e.month()), a = e.clone().add(r, "months");
        return t - a < 0 ? (i = e.clone().add(r - 1, "months"), n = (t - a) / (a - i)) : (i = e.clone().add(r + 1, "months"), n = (t - a) / (i - a)), -(r + n)
    }

    function ut() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }

    function dt() {
        var e = this.clone().utc();
        return 0 < e.year() && e.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : I(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : I(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }

    function ct(t) {
        var i = I(this, t || e.defaultFormat);
        return this.localeData().postformat(i)
    }

    function mt(e, t) {
        return this.isValid() ? Ve({to: this, from: e}).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    }

    function ht(e) {
        return this.from(Se(), e)
    }

    function pt(e, t) {
        return this.isValid() ? Ve({from: this, to: e}).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    }

    function ft(e) {
        return this.to(Se(), e)
    }

    function _t(e) {
        var t;
        return void 0 === e ? this._locale._abbr : (t = b(e), null != t && (this._locale = t), this)
    }

    function gt() {
        return this._locale
    }

    function yt(e) {
        switch (e = D(e)) {
            case"year":
                this.month(0);
            case"quarter":
            case"month":
                this.date(1);
            case"week":
            case"isoWeek":
            case"day":
                this.hours(0);
            case"hour":
                this.minutes(0);
            case"minute":
                this.seconds(0);
            case"second":
                this.milliseconds(0)
        }
        return "week" === e && this.weekday(0), "isoWeek" === e && this.isoWeekday(1), "quarter" === e && this.month(3 * Math.floor(this.month() / 3)), this
    }

    function vt(e) {
        return e = D(e), void 0 === e || "millisecond" === e ? this : this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms")
    }

    function kt() {
        return +this._d - 6e4 * (this._offset || 0)
    }

    function wt() {
        return Math.floor(+this / 1e3)
    }

    function Tt() {
        return this._offset ? new Date(+this) : this._d
    }

    function bt() {
        var e = this;
        return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()]
    }

    function Mt() {
        var e = this;
        return {years: e.year(), months: e.month(), date: e.date(), hours: e.hours(), minutes: e.minutes(), seconds: e.seconds(), milliseconds: e.milliseconds()}
    }

    function Dt() {
        return u(this)
    }

    function Lt() {
        return a({}, l(this))
    }

    function At() {
        return l(this).overflow
    }

    function St(e, t) {
        C(0, [e, e.length], 0, t)
    }

    function Yt(e, t, i) {
        return le(Se([e, 11, 31 + t - i]), t, i).week
    }

    function xt(e) {
        var t = le(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return null == e ? t : this.add(e - t, "y")
    }

    function Et(e) {
        var t = le(this, 1, 4).year;
        return null == e ? t : this.add(e - t, "y")
    }

    function Ct() {
        return Yt(this.year(), 1, 4)
    }

    function Ot() {
        var e = this.localeData()._week;
        return Yt(this.year(), e.dow, e.doy)
    }

    function Pt(e) {
        return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3)
    }

    function It(e, t) {
        return "string" != typeof e ? e : isNaN(e) ? (e = t.weekdaysParse(e), "number" == typeof e ? e : null) : parseInt(e, 10)
    }

    function jt(e) {
        return this._weekdays[e.day()]
    }

    function Wt(e) {
        return this._weekdaysShort[e.day()]
    }

    function Ft(e) {
        return this._weekdaysMin[e.day()]
    }

    function zt(e) {
        var t, i, n;
        for (this._weekdaysParse = this._weekdaysParse || [], t = 0; t < 7; t++) if (this._weekdaysParse[t] || (i = Se([2e3, 1]).day(t), n = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), this._weekdaysParse[t] = new RegExp(n.replace(".", ""), "i")), this._weekdaysParse[t].test(e)) return t
    }

    function Ht(e) {
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != e ? (e = It(e, this.localeData()), this.add(e - t, "d")) : t
    }

    function Bt(e) {
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == e ? t : this.add(e - t, "d")
    }

    function Ut(e) {
        return null == e ? this.day() || 7 : this.day(this.day() % 7 ? e : e - 7)
    }

    function $t(e, t) {
        C(e, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), t)
        })
    }

    function Nt(e, t) {
        return t._meridiemParse
    }

    function Rt(e) {
        return "p" === (e + "").toLowerCase().charAt(0)
    }

    function Kt(e, t, i) {
        return e > 11 ? i ? "pm" : "PM" : i ? "am" : "AM"
    }

    function Gt(e, t) {
        t[_r] = f(1e3 * ("0." + e))
    }

    function qt() {
        return this._isUTC ? "UTC" : ""
    }

    function Vt() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }

    function Jt(e) {
        return Se(1e3 * e)
    }

    function Zt() {
        return Se.apply(null, arguments).parseZone()
    }

    function Qt(e, t, i) {
        var n = this._calendar[e];
        return "function" == typeof n ? n.call(t, i) : n
    }

    function Xt(e) {
        var t = this._longDateFormat[e], i = this._longDateFormat[e.toUpperCase()];
        return t || !i ? t : (this._longDateFormat[e] = i.replace(/MMMM|MM|DD|dddd/g, function (e) {
            return e.slice(1)
        }), this._longDateFormat[e])
    }

    function ei() {
        return this._invalidDate
    }

    function ti(e) {
        return this._ordinal.replace("%d", e)
    }

    function ii(e) {
        return e
    }

    function ni(e, t, i, n) {
        var r = this._relativeTime[i];
        return "function" == typeof r ? r(e, t, i, n) : r.replace(/%d/i, e)
    }

    function ri(e, t) {
        var i = this._relativeTime[e > 0 ? "future" : "past"];
        return "function" == typeof i ? i(t) : i.replace(/%s/i, t)
    }

    function ai(e) {
        var t, i;
        for (i in e) t = e[i], "function" == typeof t ? this[i] = t : this["_" + i] = t;
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
    }

    function si(e, t, i, n) {
        var r = b(), a = s().set(n, t);
        return r[i](a, e)
    }

    function oi(e, t, i, n, r) {
        if ("number" == typeof e && (t = e, e = void 0), e = e || "", null != t) return si(e, t, i, r);
        var a, s = [];
        for (a = 0; a < n; a++) s[a] = si(e, a, i, r);
        return s
    }

    function li(e, t) {
        return oi(e, t, "months", 12, "month")
    }

    function ui(e, t) {
        return oi(e, t, "monthsShort", 12, "month")
    }

    function di(e, t) {
        return oi(e, t, "weekdays", 7, "day")
    }

    function ci(e, t) {
        return oi(e, t, "weekdaysShort", 7, "day")
    }

    function mi(e, t) {
        return oi(e, t, "weekdaysMin", 7, "day")
    }

    function hi() {
        var e = this._data;
        return this._milliseconds = Zr(this._milliseconds), this._days = Zr(this._days), this._months = Zr(this._months), e.milliseconds = Zr(e.milliseconds), e.seconds = Zr(e.seconds), e.minutes = Zr(e.minutes), e.hours = Zr(e.hours), e.months = Zr(e.months), e.years = Zr(e.years), this
    }

    function pi(e, t, i, n) {
        var r = Ve(t, i);
        return e._milliseconds += n * r._milliseconds, e._days += n * r._days, e._months += n * r._months, e._bubble()
    }

    function fi(e, t) {
        return pi(this, e, t, 1)
    }

    function _i(e, t) {
        return pi(this, e, t, -1)
    }

    function gi(e) {
        return e < 0 ? Math.floor(e) : Math.ceil(e)
    }

    function yi() {
        var e, t, i, n, r, a = this._milliseconds, s = this._days, o = this._months, l = this._data;
        return a >= 0 && s >= 0 && o >= 0 || a <= 0 && s <= 0 && o <= 0 || (a += 864e5 * gi(ki(o) + s), s = 0, o = 0), l.milliseconds = a % 1e3, e = p(a / 1e3), l.seconds = e % 60, t = p(e / 60), l.minutes = t % 60, i = p(t / 60), l.hours = i % 24, s += p(i / 24), r = p(vi(s)), o += r, s -= gi(ki(r)), n = p(o / 12), o %= 12, l.days = s, l.months = o, l.years = n, this
    }

    function vi(e) {
        return 4800 * e / 146097
    }

    function ki(e) {
        return 146097 * e / 4800
    }

    function wi(e) {
        var t, i, n = this._milliseconds;
        if ("month" === (e = D(e)) || "year" === e) return t = this._days + n / 864e5, i = this._months + vi(t), "month" === e ? i : i / 12;
        switch (t = this._days + Math.round(ki(this._months)), e) {
            case"week":
                return t / 7 + n / 6048e5;
            case"day":
                return t + n / 864e5;
            case"hour":
                return 24 * t + n / 36e5;
            case"minute":
                return 1440 * t + n / 6e4;
            case"second":
                return 86400 * t + n / 1e3;
            case"millisecond":
                return Math.floor(864e5 * t) + n;
            default:
                throw new Error("Unknown unit " + e)
        }
    }

    function Ti() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * f(this._months / 12)
    }

    function bi(e) {
        return function () {
            return this.as(e)
        }
    }

    function Mi(e) {
        return e = D(e), this[e + "s"]()
    }

    function Di(e) {
        return function () {
            return this._data[e]
        }
    }

    function Li() {
        return p(this.days() / 7)
    }

    function Ai(e, t, i, n, r) {
        return r.relativeTime(t || 1, !!i, e, n)
    }

    function Si(e, t, i) {
        var n = Ve(e).abs(), r = ha(n.as("s")), a = ha(n.as("m")), s = ha(n.as("h")), o = ha(n.as("d")), l = ha(n.as("M")), u = ha(n.as("y")),
            d = r < pa.s && ["s", r] || 1 === a && ["m"] || a < pa.m && ["mm", a] || 1 === s && ["h"] || s < pa.h && ["hh", s] || 1 === o && ["d"] || o < pa.d && ["dd", o] || 1 === l && ["M"] || l < pa.M && ["MM", l] || 1 === u && ["y"] || ["yy", u];
        return d[2] = t, d[3] = +e > 0, d[4] = i, Ai.apply(null, d)
    }

    function Yi(e, t) {
        return void 0 !== pa[e] && (void 0 === t ? pa[e] : (pa[e] = t, !0))
    }

    function xi(e) {
        var t = this.localeData(), i = Si(this, !e, t);
        return e && (i = t.pastFuture(+this, i)), t.postformat(i)
    }

    function Ei() {
        var e, t, i, n = fa(this._milliseconds) / 1e3, r = fa(this._days), a = fa(this._months);
        e = p(n / 60), t = p(e / 60), n %= 60, e %= 60, i = p(a / 12), a %= 12;
        var s = i, o = a, l = r, u = t, d = e, c = n, m = this.asSeconds();
        return m ? (m < 0 ? "-" : "") + "P" + (s ? s + "Y" : "") + (o ? o + "M" : "") + (l ? l + "D" : "") + (u || d || c ? "T" : "") + (u ? u + "H" : "") + (d ? d + "M" : "") + (c ? c + "S" : "") : "P0D"
    }

    function Ci(e, t) {
        var i = e.split("_");
        return t % 10 == 1 && t % 100 != 11 ? i[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? i[1] : i[2]
    }

    function Oi(e, t, i) {
        var n = {
            mm: t ? "хвіліна_хвіліны_хвілін" : "хвіліну_хвіліны_хвілін",
            hh: t ? "гадзіна_гадзіны_гадзін" : "гадзіну_гадзіны_гадзін",
            dd: "дзень_дні_дзён",
            MM: "месяц_месяцы_месяцаў",
            yy: "год_гады_гадоў"
        };
        return "m" === i ? t ? "хвіліна" : "хвіліну" : "h" === i ? t ? "гадзіна" : "гадзіну" : e + " " + Ci(n[i], +e)
    }

    function Pi(e, t) {
        return {
            nominative: "студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),
            accusative: "студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")
        }[/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function Ii(e, t) {
        return {
            nominative: "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),
            accusative: "нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")
        }[/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(t) ? "accusative" : "nominative"][e.day()]
    }

    function ji(e, t, i) {
        return e + " " + zi({mm: "munutenn", MM: "miz", dd: "devezh"}[i], e)
    }

    function Wi(e) {
        switch (Fi(e)) {
            case 1:
            case 3:
            case 4:
            case 5:
            case 9:
                return e + " bloaz";
            default:
                return e + " vloaz"
        }
    }

    function Fi(e) {
        return e > 9 ? Fi(e % 10) : e
    }

    function zi(e, t) {
        return 2 === t ? Hi(e) : e
    }

    function Hi(e) {
        var t = {m: "v", b: "v", d: "z"};
        return void 0 === t[e.charAt(0)] ? e : t[e.charAt(0)] + e.substring(1)
    }

    function Bi(e, t, i) {
        var n = e + " ";
        switch (i) {
            case"m":
                return t ? "jedna minuta" : "jedne minute";
            case"mm":
                return n += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
            case"h":
                return t ? "jedan sat" : "jednog sata";
            case"hh":
                return n += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
            case"dd":
                return n += 1 === e ? "dan" : "dana";
            case"MM":
                return n += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
            case"yy":
                return n += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
        }
    }

    function Ui(e) {
        return e > 1 && e < 5 && 1 != ~~(e / 10)
    }

    function $i(e, t, i, n) {
        var r = e + " ";
        switch (i) {
            case"s":
                return t || n ? "pár sekund" : "pár sekundami";
            case"m":
                return t ? "minuta" : n ? "minutu" : "minutou";
            case"mm":
                return t || n ? r + (Ui(e) ? "minuty" : "minut") : r + "minutami";
            case"h":
                return t ? "hodina" : n ? "hodinu" : "hodinou";
            case"hh":
                return t || n ? r + (Ui(e) ? "hodiny" : "hodin") : r + "hodinami";
            case"d":
                return t || n ? "den" : "dnem";
            case"dd":
                return t || n ? r + (Ui(e) ? "dny" : "dní") : r + "dny";
            case"M":
                return t || n ? "měsíc" : "měsícem";
            case"MM":
                return t || n ? r + (Ui(e) ? "měsíce" : "měsíců") : r + "měsíci";
            case"y":
                return t || n ? "rok" : "rokem";
            case"yy":
                return t || n ? r + (Ui(e) ? "roky" : "let") : r + "lety"
        }
    }

    function Ni(e, t, i, n) {
        var r = {
            m: ["eine Minute", "einer Minute"],
            h: ["eine Stunde", "einer Stunde"],
            d: ["ein Tag", "einem Tag"],
            dd: [e + " Tage", e + " Tagen"],
            M: ["ein Monat", "einem Monat"],
            MM: [e + " Monate", e + " Monaten"],
            y: ["ein Jahr", "einem Jahr"],
            yy: [e + " Jahre", e + " Jahren"]
        };
        return t ? r[i][0] : r[i][1]
    }

    function Ri(e, t, i, n) {
        var r = {
            m: ["eine Minute", "einer Minute"],
            h: ["eine Stunde", "einer Stunde"],
            d: ["ein Tag", "einem Tag"],
            dd: [e + " Tage", e + " Tagen"],
            M: ["ein Monat", "einem Monat"],
            MM: [e + " Monate", e + " Monaten"],
            y: ["ein Jahr", "einem Jahr"],
            yy: [e + " Jahre", e + " Jahren"]
        };
        return t ? r[i][0] : r[i][1]
    }

    function Ki(e, t, i, n) {
        var r = {
            s: ["mõne sekundi", "mõni sekund", "paar sekundit"],
            m: ["ühe minuti", "üks minut"],
            mm: [e + " minuti", e + " minutit"],
            h: ["ühe tunni", "tund aega", "üks tund"],
            hh: [e + " tunni", e + " tundi"],
            d: ["ühe päeva", "üks päev"],
            M: ["kuu aja", "kuu aega", "üks kuu"],
            MM: [e + " kuu", e + " kuud"],
            y: ["ühe aasta", "aasta", "üks aasta"],
            yy: [e + " aasta", e + " aastat"]
        };
        return t ? r[i][2] ? r[i][2] : r[i][1] : n ? r[i][0] : r[i][1]
    }

    function Gi(e, t, i, n) {
        var r = "";
        switch (i) {
            case"s":
                return n ? "muutaman sekunnin" : "muutama sekunti";
            case"m":
                return n ? "minuutin" : "minuutti";
            case"mm":
                r = n ? "minuutin" : "minuuttia";
                break;
            case"h":
                return n ? "tunnin" : "tunti";
            case"hh":
                r = n ? "tunnin" : "tuntia";
                break;
            case"d":
                return n ? "päivän" : "päivä";
            case"dd":
                r = n ? "päivän" : "päivää";
                break;
            case"M":
                return n ? "kuukauden" : "kuukausi";
            case"MM":
                r = n ? "kuukauden" : "kuukautta";
                break;
            case"y":
                return n ? "vuoden" : "vuosi";
            case"yy":
                r = n ? "vuoden" : "vuotta"
        }
        return r = qi(e, n) + " " + r
    }

    function qi(e, t) {
        return e < 10 ? t ? Fa[e] : Wa[e] : e
    }

    function Vi(e, t, i) {
        var n = e + " ";
        switch (i) {
            case"m":
                return t ? "jedna minuta" : "jedne minute";
            case"mm":
                return n += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
            case"h":
                return t ? "jedan sat" : "jednog sata";
            case"hh":
                return n += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
            case"dd":
                return n += 1 === e ? "dan" : "dana";
            case"MM":
                return n += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
            case"yy":
                return n += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
        }
    }

    function Ji(e, t, i, n) {
        var r = e;
        switch (i) {
            case"s":
                return n || t ? "néhány másodperc" : "néhány másodperce";
            case"m":
                return "egy" + (n || t ? " perc" : " perce");
            case"mm":
                return r + (n || t ? " perc" : " perce");
            case"h":
                return "egy" + (n || t ? " óra" : " órája");
            case"hh":
                return r + (n || t ? " óra" : " órája");
            case"d":
                return "egy" + (n || t ? " nap" : " napja");
            case"dd":
                return r + (n || t ? " nap" : " napja");
            case"M":
                return "egy" + (n || t ? " hónap" : " hónapja");
            case"MM":
                return r + (n || t ? " hónap" : " hónapja");
            case"y":
                return "egy" + (n || t ? " év" : " éve");
            case"yy":
                return r + (n || t ? " év" : " éve")
        }
        return ""
    }

    function Zi(e) {
        return (e ? "" : "[múlt] ") + "[" + $a[this.day()] + "] LT[-kor]"
    }

    function Qi(e, t) {
        return {
            nominative: "հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),
            accusative: "հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")
        }[/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function Xi(e, t) {
        return "հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_")[e.month()]
    }

    function en(e, t) {
        return "կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_")[e.day()]
    }

    function tn(e) {
        return e % 100 == 11 || e % 10 != 1
    }

    function nn(e, t, i, n) {
        var r = e + " ";
        switch (i) {
            case"s":
                return t || n ? "nokkrar sekúndur" : "nokkrum sekúndum";
            case"m":
                return t ? "mínúta" : "mínútu";
            case"mm":
                return tn(e) ? r + (t || n ? "mínútur" : "mínútum") : t ? r + "mínúta" : r + "mínútu";
            case"hh":
                return tn(e) ? r + (t || n ? "klukkustundir" : "klukkustundum") : r + "klukkustund";
            case"d":
                return t ? "dagur" : n ? "dag" : "degi";
            case"dd":
                return tn(e) ? t ? r + "dagar" : r + (n ? "daga" : "dögum") : t ? r + "dagur" : r + (n ? "dag" : "degi");
            case"M":
                return t ? "mánuður" : n ? "mánuð" : "mánuði";
            case"MM":
                return tn(e) ? t ? r + "mánuðir" : r + (n ? "mánuði" : "mánuðum") : t ? r + "mánuður" : r + (n ? "mánuð" : "mánuði");
            case"y":
                return t || n ? "ár" : "ári";
            case"yy":
                return tn(e) ? r + (t || n ? "ár" : "árum") : r + (t || n ? "ár" : "ári")
        }
    }

    function rn(e, t) {
        return {
            nominative: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),
            accusative: "იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")
        }[/D[oD] *MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function an(e, t) {
        return {
            nominative: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),
            accusative: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")
        }[/(წინა|შემდეგ)/.test(t) ? "accusative" : "nominative"][e.day()]
    }

    function sn(e, t, i, n) {
        var r = {m: ["eng Minutt", "enger Minutt"], h: ["eng Stonn", "enger Stonn"], d: ["een Dag", "engem Dag"], M: ["ee Mount", "engem Mount"], y: ["ee Joer", "engem Joer"]};
        return t ? r[i][0] : r[i][1]
    }

    function on(e) {
        return un(e.substr(0, e.indexOf(" "))) ? "a " + e : "an " + e
    }

    function ln(e) {
        return un(e.substr(0, e.indexOf(" "))) ? "viru " + e : "virun " + e
    }

    function un(e) {
        if (e = parseInt(e, 10), isNaN(e)) return !1;
        if (e < 0) return !0;
        if (e < 10) return 4 <= e && e <= 7;
        if (e < 100) {
            var t = e % 10, i = e / 10;
            return un(0 === t ? i : t)
        }
        if (e < 1e4) {
            for (; e >= 10;) e /= 10;
            return un(e)
        }
        return e /= 1e3, un(e)
    }

    function dn(e, t, i, n) {
        return t ? "kelios sekundės" : n ? "kelių sekundžių" : "kelias sekundes"
    }

    function cn(e, t) {
        return {
            nominative: "sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),
            accusative: "sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_")
        }[/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function mn(e, t, i, n) {
        return t ? pn(i)[0] : n ? pn(i)[1] : pn(i)[2]
    }

    function hn(e) {
        return e % 10 == 0 || e > 10 && e < 20
    }

    function pn(e) {
        return Na[e].split("_")
    }

    function fn(e, t, i, n) {
        var r = e + " ";
        return 1 === e ? r + mn(e, t, i[0], n) : t ? r + (hn(e) ? pn(i)[1] : pn(i)[0]) : n ? r + pn(i)[1] : r + (hn(e) ? pn(i)[1] : pn(i)[2])
    }

    function _n(e, t) {
        var i = -1 === t.indexOf("dddd HH:mm"), n = Ra[e.day()];
        return i ? n : n.substring(0, n.length - 2) + "į"
    }

    function gn(e, t, i) {
        return i ? t % 10 == 1 && 11 !== t ? e[2] : e[3] : t % 10 == 1 && 11 !== t ? e[0] : e[1]
    }

    function yn(e, t, i) {
        return e + " " + gn(Ka[i], e, t)
    }

    function vn(e, t, i) {
        return gn(Ka[i], e, t)
    }

    function kn(e, t) {
        return t ? "dažas sekundes" : "dažām sekundēm"
    }

    function wn(e) {
        return e % 10 < 5 && e % 10 > 1 && ~~(e / 10) % 10 != 1
    }

    function Tn(e, t, i) {
        var n = e + " ";
        switch (i) {
            case"m":
                return t ? "minuta" : "minutę";
            case"mm":
                return n + (wn(e) ? "minuty" : "minut");
            case"h":
                return t ? "godzina" : "godzinę";
            case"hh":
                return n + (wn(e) ? "godziny" : "godzin");
            case"MM":
                return n + (wn(e) ? "miesiące" : "miesięcy");
            case"yy":
                return n + (wn(e) ? "lata" : "lat")
        }
    }

    function bn(e, t, i) {
        var n = {mm: "minute", hh: "ore", dd: "zile", MM: "luni", yy: "ani"}, r = " ";
        return (e % 100 >= 20 || e >= 100 && e % 100 == 0) && (r = " de "), e + r + n[i]
    }

    function Mn(e, t) {
        var i = e.split("_");
        return t % 10 == 1 && t % 100 != 11 ? i[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? i[1] : i[2]
    }

    function Dn(e, t, i) {
        var n = {mm: t ? "минута_минуты_минут" : "минуту_минуты_минут", hh: "час_часа_часов", dd: "день_дня_дней", MM: "месяц_месяца_месяцев", yy: "год_года_лет"};
        return "m" === i ? t ? "минута" : "минуту" : e + " " + Mn(n[i], +e)
    }

    function Ln(e, t) {
        return {
            nominative: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")
        }[/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function An(e, t) {
        return {
            nominative: "янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),
            accusative: "янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")
        }[/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function Sn(e, t) {
        return {
            nominative: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
            accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")
        }[/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(t) ? "accusative" : "nominative"][e.day()]
    }

    function Yn(e) {
        return e > 1 && e < 5
    }

    function xn(e, t, i, n) {
        var r = e + " ";
        switch (i) {
            case"s":
                return t || n ? "pár sekúnd" : "pár sekundami";
            case"m":
                return t ? "minúta" : n ? "minútu" : "minútou";
            case"mm":
                return t || n ? r + (Yn(e) ? "minúty" : "minút") : r + "minútami";
            case"h":
                return t ? "hodina" : n ? "hodinu" : "hodinou";
            case"hh":
                return t || n ? r + (Yn(e) ? "hodiny" : "hodín") : r + "hodinami";
            case"d":
                return t || n ? "deň" : "dňom";
            case"dd":
                return t || n ? r + (Yn(e) ? "dni" : "dní") : r + "dňami";
            case"M":
                return t || n ? "mesiac" : "mesiacom";
            case"MM":
                return t || n ? r + (Yn(e) ? "mesiace" : "mesiacov") : r + "mesiacmi";
            case"y":
                return t || n ? "rok" : "rokom";
            case"yy":
                return t || n ? r + (Yn(e) ? "roky" : "rokov") : r + "rokmi"
        }
    }

    function En(e, t, i, n) {
        var r = e + " ";
        switch (i) {
            case"s":
                return t || n ? "nekaj sekund" : "nekaj sekundami";
            case"m":
                return t ? "ena minuta" : "eno minuto";
            case"mm":
                return r += 1 === e ? t ? "minuta" : "minuto" : 2 === e ? t || n ? "minuti" : "minutama" : e < 5 ? t || n ? "minute" : "minutami" : t || n ? "minut" : "minutami";
            case"h":
                return t ? "ena ura" : "eno uro";
            case"hh":
                return r += 1 === e ? t ? "ura" : "uro" : 2 === e ? t || n ? "uri" : "urama" : e < 5 ? t || n ? "ure" : "urami" : t || n ? "ur" : "urami";
            case"d":
                return t || n ? "en dan" : "enim dnem";
            case"dd":
                return r += 1 === e ? t || n ? "dan" : "dnem" : 2 === e ? t || n ? "dni" : "dnevoma" : t || n ? "dni" : "dnevi";
            case"M":
                return t || n ? "en mesec" : "enim mesecem";
            case"MM":
                return r += 1 === e ? t || n ? "mesec" : "mesecem" : 2 === e ? t || n ? "meseca" : "mesecema" : e < 5 ? t || n ? "mesece" : "meseci" : t || n ? "mesecev" : "meseci";
            case"y":
                return t || n ? "eno leto" : "enim letom";
            case"yy":
                return r += 1 === e ? t || n ? "leto" : "letom" : 2 === e ? t || n ? "leti" : "letoma" : e < 5 ? t || n ? "leta" : "leti" : t || n ? "let" : "leti"
        }
    }

    function Cn(e, t, i, n) {
        var r = {
            s: ["viensas secunds", "'iensas secunds"],
            m: ["'n míut", "'iens míut"],
            mm: [e + " míuts", " " + e + " míuts"],
            h: ["'n þora", "'iensa þora"],
            hh: [e + " þoras", " " + e + " þoras"],
            d: ["'n ziua", "'iensa ziua"],
            dd: [e + " ziuas", " " + e + " ziuas"],
            M: ["'n mes", "'iens mes"],
            MM: [e + " mesen", " " + e + " mesen"],
            y: ["'n ar", "'iens ar"],
            yy: [e + " ars", " " + e + " ars"]
        };
        return n ? r[i][0] : t ? r[i][0] : r[i][1].trim()
    }

    function On(e, t) {
        var i = e.split("_");
        return t % 10 == 1 && t % 100 != 11 ? i[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? i[1] : i[2]
    }

    function Pn(e, t, i) {
        var n = {mm: "хвилина_хвилини_хвилин", hh: "година_години_годин", dd: "день_дні_днів", MM: "місяць_місяці_місяців", yy: "рік_роки_років"};
        return "m" === i ? t ? "хвилина" : "хвилину" : "h" === i ? t ? "година" : "годину" : e + " " + On(n[i], +e)
    }

    function In(e, t) {
        return {
            nominative: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),
            accusative: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")
        }[/D[oD]? *MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
    }

    function jn(e, t) {
        return {
            nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),
            accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),
            genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")
        }[/(\[[ВвУу]\]) ?dddd/.test(t) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t) ? "genitive" : "nominative"][e.day()]
    }

    function Wn(e) {
        return function () {
            return e + "о" + (11 === this.hours() ? "б" : "") + "] LT"
        }
    }

    var Fn, zn, Hn = e.momentProperties = [], Bn = !1, Un = {}, $n = {},
        Nn = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        Rn = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Kn = {}, Gn = {}, qn = /\d/, Vn = /\d\d/, Jn = /\d{3}/, Zn = /\d{4}/, Qn = /[+-]?\d{6}/, Xn = /\d\d?/, er = /\d{1,3}/, tr = /\d{1,4}/,
        ir = /[+-]?\d{1,6}/, nr = /\d+/, rr = /[+-]?\d+/, ar = /Z|[+-]\d\d:?\d\d/gi, sr = /[+-]?\d+(\.\d{1,3})?/,
        or = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, lr = {}, ur = {}, dr = 0, cr = 1, mr = 2, hr = 3, pr = 4, fr = 5,
        _r = 6;
    C("M", ["MM", 2], "Mo", function () {
        return this.month() + 1
    }), C("MMM", 0, 0, function (e) {
        return this.localeData().monthsShort(this, e)
    }), C("MMMM", 0, 0, function (e) {
        return this.localeData().months(this, e)
    }), M("month", "M"), F("M", Xn), F("MM", Xn, Vn), F("MMM", or), F("MMMM", or), B(["M", "MM"], function (e, t) {
        t[cr] = f(e) - 1
    }), B(["MMM", "MMMM"], function (e, t, i, n) {
        var r = i._locale.monthsParse(e, n, i._strict);
        null != r ? t[cr] = r : l(i).invalidMonth = e
    });
    var gr = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), yr = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), vr = {};
    e.suppressDeprecationWarnings = !1;
    var kr = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        wr = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]],
        Tr = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], br = /^\/?Date\((\-?\d+)/i;
    e.createFromInputFallback = X("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""))
    }), C(0, ["YY", 2], 0, function () {
        return this.year() % 100
    }), C(0, ["YYYY", 4], 0, "year"), C(0, ["YYYYY", 5], 0, "year"), C(0, ["YYYYYY", 6, !0], 0, "year"), M("year", "y"), F("Y", rr), F("YY", Xn, Vn), F("YYYY", tr, Zn), F("YYYYY", ir, Qn), F("YYYYYY", ir, Qn), B(["YYYYY", "YYYYYY"], dr), B("YYYY", function (t, i) {
        i[dr] = 2 === t.length ? e.parseTwoDigitYear(t) : f(t)
    }), B("YY", function (t, i) {
        i[dr] = e.parseTwoDigitYear(t)
    }), e.parseTwoDigitYear = function (e) {
        return f(e) + (f(e) > 68 ? 1900 : 2e3)
    };
    var Mr = A("FullYear", !1);
    C("w", ["ww", 2], "wo", "week"), C("W", ["WW", 2], "Wo", "isoWeek"), M("week", "w"), M("isoWeek", "W"), F("w", Xn), F("ww", Xn, Vn), F("W", Xn), F("WW", Xn, Vn), U(["w", "ww", "W", "WW"], function (e, t, i, n) {
        t[n.substr(0, 1)] = f(e)
    });
    var Dr = {dow: 0, doy: 6};
    C("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), M("dayOfYear", "DDD"), F("DDD", er), F("DDDD", Jn), B(["DDD", "DDDD"], function (e, t, i) {
        i._dayOfYear = f(e)
    }), e.ISO_8601 = function () {
    };
    var Lr = X("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function () {
        var e = Se.apply(null, arguments);
        return e < this ? this : e
    }), Ar = X("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function () {
        var e = Se.apply(null, arguments);
        return e > this ? this : e
    });
    Pe("Z", ":"), Pe("ZZ", ""), F("Z", ar), F("ZZ", ar), B(["Z", "ZZ"], function (e, t, i) {
        i._useUTC = !0, i._tzm = Ie(e)
    });
    var Sr = /([\+\-]|\d\d)/gi;
    e.updateOffset = function () {
    };
    var Yr = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
        xr = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
    Ve.fn = Ce.prototype;
    var Er = Xe(1, "add"), Cr = Xe(-1, "subtract");
    e.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var Or = X("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (e) {
        return void 0 === e ? this.localeData() : this.locale(e)
    });
    C(0, ["gg", 2], 0, function () {
        return this.weekYear() % 100
    }), C(0, ["GG", 2], 0, function () {
        return this.isoWeekYear() % 100
    }), St("gggg", "weekYear"), St("ggggg", "weekYear"), St("GGGG", "isoWeekYear"), St("GGGGG", "isoWeekYear"), M("weekYear", "gg"), M("isoWeekYear", "GG"), F("G", rr), F("g", rr), F("GG", Xn, Vn), F("gg", Xn, Vn), F("GGGG", tr, Zn), F("gggg", tr, Zn), F("GGGGG", ir, Qn), F("ggggg", ir, Qn), U(["gggg", "ggggg", "GGGG", "GGGGG"], function (e, t, i, n) {
        t[n.substr(0, 2)] = f(e)
    }), U(["gg", "GG"], function (t, i, n, r) {
        i[r] = e.parseTwoDigitYear(t)
    }), C("Q", 0, 0, "quarter"), M("quarter", "Q"), F("Q", qn), B("Q", function (e, t) {
        t[cr] = 3 * (f(e) - 1)
    }), C("D", ["DD", 2], "Do", "date"), M("date", "D"), F("D", Xn), F("DD", Xn, Vn), F("Do", function (e, t) {
        return e ? t._ordinalParse : t._ordinalParseLenient
    }), B(["D", "DD"], mr), B("Do", function (e, t) {
        t[mr] = f(e.match(Xn)[0], 10)
    });
    var Pr = A("Date", !0);
    C("d", 0, "do", "day"), C("dd", 0, 0, function (e) {
        return this.localeData().weekdaysMin(this, e)
    }), C("ddd", 0, 0, function (e) {
        return this.localeData().weekdaysShort(this, e)
    }), C("dddd", 0, 0, function (e) {
        return this.localeData().weekdays(this, e)
    }), C("e", 0, 0, "weekday"), C("E", 0, 0, "isoWeekday"), M("day", "d"), M("weekday", "e"), M("isoWeekday", "E"), F("d", Xn), F("e", Xn), F("E", Xn), F("dd", or), F("ddd", or), F("dddd", or), U(["dd", "ddd", "dddd"], function (e, t, i) {
        var n = i._locale.weekdaysParse(e);
        null != n ? t.d = n : l(i).invalidWeekday = e
    }), U(["d", "e", "E"], function (e, t, i, n) {
        t[n] = f(e)
    });
    var Ir = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), jr = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), Wr = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    C("H", ["HH", 2], 0, "hour"), C("h", ["hh", 2], 0, function () {
        return this.hours() % 12 || 12
    }), $t("a", !0), $t("A", !1), M("hour", "h"), F("a", Nt), F("A", Nt), F("H", Xn), F("h", Xn), F("HH", Xn, Vn), F("hh", Xn, Vn), B(["H", "HH"], hr), B(["a", "A"], function (e, t, i) {
        i._isPm = i._locale.isPM(e), i._meridiem = e
    }), B(["h", "hh"], function (e, t, i) {
        t[hr] = f(e), l(i).bigHour = !0
    });
    var Fr = /[ap]\.?m?\.?/i, zr = A("Hours", !0);
    C("m", ["mm", 2], 0, "minute"), M("minute", "m"), F("m", Xn), F("mm", Xn, Vn), B(["m", "mm"], pr);
    var Hr = A("Minutes", !1);
    C("s", ["ss", 2], 0, "second"), M("second", "s"), F("s", Xn), F("ss", Xn, Vn), B(["s", "ss"], fr);
    var Br = A("Seconds", !1);
    C("S", 0, 0, function () {
        return ~~(this.millisecond() / 100)
    }), C(0, ["SS", 2], 0, function () {
        return ~~(this.millisecond() / 10)
    }), C(0, ["SSS", 3], 0, "millisecond"),
        C(0, ["SSSS", 4], 0, function () {
            return 10 * this.millisecond()
        }), C(0, ["SSSSS", 5], 0, function () {
        return 100 * this.millisecond()
    }), C(0, ["SSSSSS", 6], 0, function () {
        return 1e3 * this.millisecond()
    }), C(0, ["SSSSSSS", 7], 0, function () {
        return 1e4 * this.millisecond()
    }), C(0, ["SSSSSSSS", 8], 0, function () {
        return 1e5 * this.millisecond()
    }), C(0, ["SSSSSSSSS", 9], 0, function () {
        return 1e6 * this.millisecond()
    }), M("millisecond", "ms"), F("S", er, qn), F("SS", er, Vn), F("SSS", er, Jn);
    var Ur;
    for (Ur = "SSSS"; Ur.length <= 9; Ur += "S") F(Ur, nr);
    for (Ur = "S"; Ur.length <= 9; Ur += "S") B(Ur, Gt);
    var $r = A("Milliseconds", !1);
    C("z", 0, 0, "zoneAbbr"), C("zz", 0, 0, "zoneName");
    var Nr = m.prototype;
    Nr.add = Er, Nr.calendar = tt, Nr.clone = it, Nr.diff = ot, Nr.endOf = vt, Nr.format = ct, Nr.from = mt, Nr.fromNow = ht, Nr.to = pt, Nr.toNow = ft, Nr.get = x, Nr.invalidAt = At, Nr.isAfter = nt, Nr.isBefore = rt, Nr.isBetween = at, Nr.isSame = st, Nr.isValid = Dt, Nr.lang = Or, Nr.locale = _t, Nr.localeData = gt, Nr.max = Ar, Nr.min = Lr, Nr.parsingFlags = Lt, Nr.set = x, Nr.startOf = yt, Nr.subtract = Cr, Nr.toArray = bt, Nr.toObject = Mt, Nr.toDate = Tt, Nr.toISOString = dt, Nr.toJSON = dt, Nr.toString = ut, Nr.unix = wt, Nr.valueOf = kt, Nr.year = Mr, Nr.isLeapYear = oe, Nr.weekYear = xt, Nr.isoWeekYear = Et, Nr.quarter = Nr.quarters = Pt, Nr.month = V, Nr.daysInMonth = J, Nr.week = Nr.weeks = me, Nr.isoWeek = Nr.isoWeeks = he, Nr.weeksInYear = Ot, Nr.isoWeeksInYear = Ct, Nr.date = Pr, Nr.day = Nr.days = Ht, Nr.weekday = Bt, Nr.isoWeekday = Ut, Nr.dayOfYear = fe, Nr.hour = Nr.hours = zr, Nr.minute = Nr.minutes = Hr, Nr.second = Nr.seconds = Br, Nr.millisecond = Nr.milliseconds = $r, Nr.utcOffset = Fe, Nr.utc = He, Nr.local = Be, Nr.parseZone = Ue, Nr.hasAlignedHourOffset = $e, Nr.isDST = Ne, Nr.isDSTShifted = Re, Nr.isLocal = Ke, Nr.isUtcOffset = Ge, Nr.isUtc = qe, Nr.isUTC = qe, Nr.zoneAbbr = qt, Nr.zoneName = Vt, Nr.dates = X("dates accessor is deprecated. Use date instead.", Pr), Nr.months = X("months accessor is deprecated. Use month instead", V), Nr.years = X("years accessor is deprecated. Use year instead", Mr), Nr.zone = X("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", ze);
    var Rr = Nr, Kr = {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"},
        Gr = {LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A"}, qr = /\d{1,2}/, Vr = {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        }, Jr = g.prototype;
    Jr._calendar = Kr, Jr.calendar = Qt, Jr._longDateFormat = Gr, Jr.longDateFormat = Xt, Jr._invalidDate = "Invalid date", Jr.invalidDate = ei, Jr._ordinal = "%d", Jr.ordinal = ti, Jr._ordinalParse = qr, Jr.preparse = ii, Jr.postformat = ii, Jr._relativeTime = Vr, Jr.relativeTime = ni, Jr.pastFuture = ri, Jr.set = ai, Jr.months = R, Jr._months = gr, Jr.monthsShort = K, Jr._monthsShort = yr, Jr.monthsParse = G, Jr.week = ue, Jr._week = Dr, Jr.firstDayOfYear = ce, Jr.firstDayOfWeek = de, Jr.weekdays = jt, Jr._weekdays = Ir, Jr.weekdaysMin = Ft, Jr._weekdaysMin = Wr, Jr.weekdaysShort = Wt, Jr._weekdaysShort = jr, Jr.weekdaysParse = zt, Jr.isPM = Rt, Jr._meridiemParse = Fr, Jr.meridiem = Kt, w("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (e) {
            var t = e % 10;
            return e + (1 === f(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
        }
    }), e.lang = X("moment.lang is deprecated. Use moment.locale instead.", w), e.langData = X("moment.langData is deprecated. Use moment.localeData instead.", b);
    var Zr = Math.abs, Qr = bi("ms"), Xr = bi("s"), ea = bi("m"), ta = bi("h"), ia = bi("d"), na = bi("w"), ra = bi("M"), aa = bi("y"), sa = Di("milliseconds"), oa = Di("seconds"), la = Di("minutes"),
        ua = Di("hours"), da = Di("days"), ca = Di("months"), ma = Di("years"), ha = Math.round, pa = {s: 45, m: 45, h: 22, d: 26, M: 11}, fa = Math.abs, _a = Ce.prototype;
    _a.abs = hi, _a.add = fi, _a.subtract = _i, _a.as = wi, _a.asMilliseconds = Qr, _a.asSeconds = Xr, _a.asMinutes = ea, _a.asHours = ta, _a.asDays = ia, _a.asWeeks = na, _a.asMonths = ra, _a.asYears = aa, _a.valueOf = Ti, _a._bubble = yi, _a.get = Mi, _a.milliseconds = sa, _a.seconds = oa, _a.minutes = la, _a.hours = ua, _a.days = da, _a.weeks = Li, _a.months = ca, _a.years = ma, _a.humanize = xi, _a.toISOString = Ei, _a.toString = Ei, _a.toJSON = Ei, _a.locale = _t, _a.localeData = gt, _a.toIsoString = X("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Ei), _a.lang = Or, C("X", 0, 0, "unix"), C("x", 0, 0, "valueOf"), F("x", rr), F("X", sr), B("X", function (e, t, i) {
        i._d = new Date(1e3 * parseFloat(e, 10))
    }), B("x", function (e, t, i) {
        i._d = new Date(f(e))
    }), e.version = "2.10.6", function (e) {
        Fn = e
    }(Se), e.fn = Rr, e.min = xe, e.max = Ee, e.utc = s, e.unix = Jt, e.months = li, e.isDate = i, e.locale = w, e.invalid = d, e.duration = Ve, e.isMoment = h, e.weekdays = di, e.parseZone = Zt, e.localeData = b, e.isDuration = Oe, e.monthsShort = ui, e.weekdaysMin = mi, e.defineLocale = T, e.weekdaysShort = ci, e.normalizeUnits = D, e.relativeTimeThreshold = Yi;
    var ga = e, ya = (ga.defineLocale("af", {
            months: "Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),
            weekdaysShort: "Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),
            weekdaysMin: "So_Ma_Di_Wo_Do_Vr_Sa".split("_"),
            meridiemParse: /vm|nm/i,
            isPM: function (e) {
                return /^nm$/i.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 12 ? i ? "vm" : "VM" : i ? "nm" : "NM"
            },
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Vandag om] LT", nextDay: "[Môre om] LT", nextWeek: "dddd [om] LT", lastDay: "[Gister om] LT", lastWeek: "[Laas] dddd [om] LT", sameElse: "L"},
            relativeTime: {
                future: "oor %s",
                past: "%s gelede",
                s: "'n paar sekondes",
                m: "'n minuut",
                mm: "%d minute",
                h: "'n uur",
                hh: "%d ure",
                d: "'n dag",
                dd: "%d dae",
                M: "'n maand",
                MM: "%d maande",
                y: "'n jaar",
                yy: "%d jaar"
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("ar-ma", {
            months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[اليوم على الساعة] LT", nextDay: "[غدا على الساعة] LT", nextWeek: "dddd [على الساعة] LT", lastDay: "[أمس على الساعة] LT", lastWeek: "dddd [على الساعة] LT", sameElse: "L"},
            relativeTime: {future: "في %s", past: "منذ %s", s: "ثوان", m: "دقيقة", mm: "%d دقائق", h: "ساعة", hh: "%d ساعات", d: "يوم", dd: "%d أيام", M: "شهر", MM: "%d أشهر", y: "سنة", yy: "%d سنوات"},
            week: {dow: 6, doy: 12}
        }), {1: "١", 2: "٢", 3: "٣", 4: "٤", 5: "٥", 6: "٦", 7: "٧", 8: "٨", 9: "٩", 0: "٠"}), va = {"١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "٠": "0"},
        ka = (ga.defineLocale("ar-sa", {
            months: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            meridiemParse: /ص|م/,
            isPM: function (e) {
                return "م" === e
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "ص" : "م"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            preparse: function (e) {
                return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (e) {
                    return va[e]
                }).replace(/،/g, ",")
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return ya[e]
                }).replace(/,/g, "،")
            },
            week: {dow: 6, doy: 12}
        }), ga.defineLocale("ar-tn", {
            months: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {dow: 1, doy: 4}
        }), {1: "١", 2: "٢", 3: "٣", 4: "٤", 5: "٥", 6: "٦", 7: "٧", 8: "٨", 9: "٩", 0: "٠"}),
        wa = {"١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "٠": "0"}, Ta = function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5
        }, ba = {
            s: ["أقل من ثانية", "ثانية واحدة", ["ثانيتان", "ثانيتين"], "%d ثوان", "%d ثانية", "%d ثانية"],
            m: ["أقل من دقيقة", "دقيقة واحدة", ["دقيقتان", "دقيقتين"], "%d دقائق", "%d دقيقة", "%d دقيقة"],
            h: ["أقل من ساعة", "ساعة واحدة", ["ساعتان", "ساعتين"], "%d ساعات", "%d ساعة", "%d ساعة"],
            d: ["أقل من يوم", "يوم واحد", ["يومان", "يومين"], "%d أيام", "%d يومًا", "%d يوم"],
            M: ["أقل من شهر", "شهر واحد", ["شهران", "شهرين"], "%d أشهر", "%d شهرا", "%d شهر"],
            y: ["أقل من عام", "عام واحد", ["عامان", "عامين"], "%d أعوام", "%d عامًا", "%d عام"]
        }, Ma = function (e) {
            return function (t, i, n, r) {
                var a = Ta(t), s = ba[e][Ta(t)];
                return 2 === a && (s = s[i ? 0 : 1]), s.replace(/%d/i, t)
            }
        },
        Da = ["كانون الثاني يناير", "شباط فبراير", "آذار مارس", "نيسان أبريل", "أيار مايو", "حزيران يونيو", "تموز يوليو", "آب أغسطس", "أيلول سبتمبر", "تشرين الأول أكتوبر", "تشرين الثاني نوفمبر", "كانون الأول ديسمبر"],
        La = (ga.defineLocale("ar", {
            months: Da,
            monthsShort: Da,
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "D/‏M/‏YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            meridiemParse: /ص|م/,
            isPM: function (e) {
                return "م" === e
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "ص" : "م"
            },
            calendar: {
                sameDay: "[اليوم عند الساعة] LT",
                nextDay: "[غدًا عند الساعة] LT",
                nextWeek: "dddd [عند الساعة] LT",
                lastDay: "[أمس عند الساعة] LT",
                lastWeek: "dddd [عند الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {future: "بعد %s", past: "منذ %s", s: Ma("s"), m: Ma("m"), mm: Ma("m"), h: Ma("h"), hh: Ma("h"), d: Ma("d"), dd: Ma("d"), M: Ma("M"), MM: Ma("M"), y: Ma("y"), yy: Ma("y")},
            preparse: function (e) {
                return e.replace(/\u200f/g, "").replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (e) {
                    return wa[e]
                }).replace(/،/g, ",")
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return ka[e]
                }).replace(/,/g, "،")
            },
            week: {dow: 6, doy: 12}
        }), {
            1: "-inci",
            5: "-inci",
            8: "-inci",
            70: "-inci",
            80: "-inci",
            2: "-nci",
            7: "-nci",
            20: "-nci",
            50: "-nci",
            3: "-üncü",
            4: "-üncü",
            100: "-üncü",
            6: "-ncı",
            9: "-uncu",
            10: "-uncu",
            30: "-uncu",
            60: "-ıncı",
            90: "-ıncı"
        }), Aa = (ga.defineLocale("az", {
            months: "yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),
            monthsShort: "yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),
            weekdays: "Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),
            weekdaysShort: "Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),
            weekdaysMin: "Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[bugün saat] LT", nextDay: "[sabah saat] LT", nextWeek: "[gələn həftə] dddd [saat] LT", lastDay: "[dünən] LT", lastWeek: "[keçən həftə] dddd [saat] LT", sameElse: "L"},
            relativeTime: {
                future: "%s sonra",
                past: "%s əvvəl",
                s: "birneçə saniyyə",
                m: "bir dəqiqə",
                mm: "%d dəqiqə",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir il",
                yy: "%d il"
            },
            meridiemParse: /gecə|səhər|gündüz|axşam/,
            isPM: function (e) {
                return /^(gündüz|axşam)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "gecə" : e < 12 ? "səhər" : e < 17 ? "gündüz" : "axşam"
            },
            ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
            ordinal: function (e) {
                if (0 === e) return e + "-ıncı";
                var t = e % 10, i = e % 100 - t, n = e >= 100 ? 100 : null;
                return e + (La[t] || La[i] || La[n])
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("be", {
            months: Pi,
            monthsShort: "студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),
            weekdays: Ii,
            weekdaysShort: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            weekdaysMin: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY г.", LLL: "D MMMM YYYY г., HH:mm", LLLL: "dddd, D MMMM YYYY г., HH:mm"},
            calendar: {
                sameDay: "[Сёння ў] LT", nextDay: "[Заўтра ў] LT", lastDay: "[Учора ў] LT", nextWeek: function () {
                    return "[У] dddd [ў] LT"
                }, lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return "[У мінулую] dddd [ў] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[У мінулы] dddd [ў] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "праз %s", past: "%s таму", s: "некалькі секунд", m: Oi, mm: Oi, h: Oi, hh: Oi, d: "дзень", dd: Oi, M: "месяц", MM: Oi, y: "год", yy: Oi},
            meridiemParse: /ночы|раніцы|дня|вечара/,
            isPM: function (e) {
                return /^(дня|вечара)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "ночы" : e < 12 ? "раніцы" : e < 17 ? "дня" : "вечара"
            },
            ordinalParse: /\d{1,2}-(і|ы|га)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"M":
                    case"d":
                    case"DDD":
                    case"w":
                    case"W":
                        return e % 10 != 2 && e % 10 != 3 || e % 100 == 12 || e % 100 == 13 ? e + "-ы" : e + "-і";
                    case"D":
                        return e + "-га";
                    default:
                        return e
                }
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("bg", {
            months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
            weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "D.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd, D MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[Днес в] LT", nextDay: "[Утре в] LT", nextWeek: "dddd [в] LT", lastDay: "[Вчера в] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[В изминалата] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[В изминалия] dddd [в] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {
                future: "след %s",
                past: "преди %s",
                s: "няколко секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дни",
                M: "месец",
                MM: "%d месеца",
                y: "година",
                yy: "%d години"
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function (e) {
                var t = e % 10, i = e % 100;
                return 0 === e ? e + "-ев" : 0 === i ? e + "-ен" : i > 10 && i < 20 ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {dow: 1, doy: 7}
        }), {1: "১", 2: "২", 3: "৩", 4: "৪", 5: "৫", 6: "৬", 7: "৭", 8: "৮", 9: "৯", 0: "০"}), Sa = {"১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9", "০": "0"},
        Ya = (ga.defineLocale("bn", {
            months: "জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),
            monthsShort: "জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),
            weekdays: "রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),
            weekdaysShort: "রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),
            weekdaysMin: "রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),
            longDateFormat: {LT: "A h:mm সময়", LTS: "A h:mm:ss সময়", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, A h:mm সময়", LLLL: "dddd, D MMMM YYYY, A h:mm সময়"},
            calendar: {sameDay: "[আজ] LT", nextDay: "[আগামীকাল] LT", nextWeek: "dddd, LT", lastDay: "[গতকাল] LT", lastWeek: "[গত] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s পরে",
                past: "%s আগে",
                s: "কএক সেকেন্ড",
                m: "এক মিনিট",
                mm: "%d মিনিট",
                h: "এক ঘন্টা",
                hh: "%d ঘন্টা",
                d: "এক দিন",
                dd: "%d দিন",
                M: "এক মাস",
                MM: "%d মাস",
                y: "এক বছর",
                yy: "%d বছর"
            },
            preparse: function (e) {
                return e.replace(/[১২৩৪৫৬৭৮৯০]/g, function (e) {
                    return Sa[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Aa[e]
                })
            },
            meridiemParse: /রাত|সকাল|দুপুর|বিকেল|রাত/,
            isPM: function (e) {
                return /^(দুপুর|বিকেল|রাত)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "রাত" : e < 10 ? "সকাল" : e < 17 ? "দুপুর" : e < 20 ? "বিকেল" : "রাত"
            },
            week: {dow: 0, doy: 6}
        }), {1: "༡", 2: "༢", 3: "༣", 4: "༤", 5: "༥", 6: "༦", 7: "༧", 8: "༨", 9: "༩", 0: "༠"}),
        xa = {"༡": "1", "༢": "2", "༣": "3", "༤": "4", "༥": "5", "༦": "6", "༧": "7", "༨": "8", "༩": "9", "༠": "0"}, Ea = (ga.defineLocale("bo", {
            months: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            monthsShort: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            weekdays: "གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),
            weekdaysShort: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            weekdaysMin: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            longDateFormat: {LT: "A h:mm", LTS: "A h:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, A h:mm", LLLL: "dddd, D MMMM YYYY, A h:mm"},
            calendar: {sameDay: "[དི་རིང] LT", nextDay: "[སང་ཉིན] LT", nextWeek: "[བདུན་ཕྲག་རྗེས་མ], LT", lastDay: "[ཁ་སང] LT", lastWeek: "[བདུན་ཕྲག་མཐའ་མ] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s ལ་",
                past: "%s སྔན་ལ",
                s: "ལམ་སང",
                m: "སྐར་མ་གཅིག",
                mm: "%d སྐར་མ",
                h: "ཆུ་ཚོད་གཅིག",
                hh: "%d ཆུ་ཚོད",
                d: "ཉིན་གཅིག",
                dd: "%d ཉིན་",
                M: "ཟླ་བ་གཅིག",
                MM: "%d ཟླ་བ",
                y: "ལོ་གཅིག",
                yy: "%d ལོ"
            },
            preparse: function (e) {
                return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (e) {
                    return xa[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Ya[e]
                })
            },
            meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
            isPM: function (e) {
                return /^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "མཚན་མོ" : e < 10 ? "ཞོགས་ཀས" : e < 17 ? "ཉིན་གུང" : e < 20 ? "དགོང་དག" : "མཚན་མོ"
            },
            week: {dow: 0, doy: 6}
        }), ga.defineLocale("br", {
            months: "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),
            monthsShort: "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
            weekdays: "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),
            weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
            longDateFormat: {LT: "h[e]mm A", LTS: "h[e]mm:ss A", L: "DD/MM/YYYY", LL: "D [a viz] MMMM YYYY", LLL: "D [a viz] MMMM YYYY h[e]mm A", LLLL: "dddd, D [a viz] MMMM YYYY h[e]mm A"},
            calendar: {sameDay: "[Hiziv da] LT", nextDay: "[Warc'hoazh da] LT", nextWeek: "dddd [da] LT", lastDay: "[Dec'h da] LT", lastWeek: "dddd [paset da] LT", sameElse: "L"},
            relativeTime: {
                future: "a-benn %s",
                past: "%s 'zo",
                s: "un nebeud segondennoù",
                m: "ur vunutenn",
                mm: ji,
                h: "un eur",
                hh: "%d eur",
                d: "un devezh",
                dd: ji,
                M: "ur miz",
                MM: ji,
                y: "ur bloaz",
                yy: Wi
            },
            ordinalParse: /\d{1,2}(añ|vet)/,
            ordinal: function (e) {
                return e + (1 === e ? "añ" : "vet")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("bs", {
            months: "januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                }, lastDay: "[jučer u] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "za %s", past: "prije %s", s: "par sekundi", m: Bi, mm: Bi, h: Bi, hh: Bi, d: "dan", dd: Bi, M: "mjesec", MM: Bi, y: "godinu", yy: Bi},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("ca", {
            months: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),
            monthsShort: "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),
            weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),
            weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
            weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "LT:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd D MMMM YYYY H:mm"},
            calendar: {
                sameDay: function () {
                    return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                }, nextDay: function () {
                    return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                }, nextWeek: function () {
                    return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                }, lastDay: function () {
                    return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                }, lastWeek: function () {
                    return "[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "fa %s",
                s: "uns segons",
                m: "un minut",
                mm: "%d minuts",
                h: "una hora",
                hh: "%d hores",
                d: "un dia",
                dd: "%d dies",
                M: "un mes",
                MM: "%d mesos",
                y: "un any",
                yy: "%d anys"
            },
            ordinalParse: /\d{1,2}(r|n|t|è|a)/,
            ordinal: function (e, t) {
                var i = 1 === e ? "r" : 2 === e ? "n" : 3 === e ? "r" : 4 === e ? "t" : "è";
                return "w" !== t && "W" !== t || (i = "a"), e + i
            },
            week: {dow: 1, doy: 4}
        }), "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")), Ca = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),
        Oa = (ga.defineLocale("cs", {
            months: Ea,
            monthsShort: Ca,
            monthsParse: function (e, t) {
                var i, n = [];
                for (i = 0; i < 12; i++) n[i] = new RegExp("^" + e[i] + "$|^" + t[i] + "$", "i");
                return n
            }(Ea, Ca),
            weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
            weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
            weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[dnes v] LT", nextDay: "[zítra v] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[v neděli v] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [v] LT";
                        case 3:
                            return "[ve středu v] LT";
                        case 4:
                            return "[ve čtvrtek v] LT";
                        case 5:
                            return "[v pátek v] LT";
                        case 6:
                            return "[v sobotu v] LT"
                    }
                }, lastDay: "[včera v] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[minulou neděli v] LT";
                        case 1:
                        case 2:
                            return "[minulé] dddd [v] LT";
                        case 3:
                            return "[minulou středu v] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [v] LT";
                        case 6:
                            return "[minulou sobotu v] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "za %s", past: "před %s", s: $i, m: $i, mm: $i, h: $i, hh: $i, d: $i, dd: $i, M: $i, MM: $i, y: $i, yy: $i},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("cv", {
            months: "кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),
            monthsShort: "кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),
            weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),
            weekdaysShort: "выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),
            weekdaysMin: "вр_тн_ыт_юн_кҫ_эр_шм".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD-MM-YYYY",
                LL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",
                LLL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",
                LLLL: "dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"
            },
            calendar: {
                sameDay: "[Паян] LT [сехетре]",
                nextDay: "[Ыран] LT [сехетре]",
                lastDay: "[Ӗнер] LT [сехетре]",
                nextWeek: "[Ҫитес] dddd LT [сехетре]",
                lastWeek: "[Иртнӗ] dddd LT [сехетре]",
                sameElse: "L"
            },
            relativeTime: {
                future: function (e) {
                    return e + (/сехет$/i.exec(e) ? "рен" : /ҫул$/i.exec(e) ? "тан" : "ран")
                },
                past: "%s каялла",
                s: "пӗр-ик ҫеккунт",
                m: "пӗр минут",
                mm: "%d минут",
                h: "пӗр сехет",
                hh: "%d сехет",
                d: "пӗр кун",
                dd: "%d кун",
                M: "пӗр уйӑх",
                MM: "%d уйӑх",
                y: "пӗр ҫул",
                yy: "%d ҫул"
            },
            ordinalParse: /\d{1,2}-мӗш/,
            ordinal: "%d-мӗш",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("cy", {
            months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),
            monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),
            weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),
            weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Heddiw am] LT", nextDay: "[Yfory am] LT", nextWeek: "dddd [am] LT", lastDay: "[Ddoe am] LT", lastWeek: "dddd [diwethaf am] LT", sameElse: "L"},
            relativeTime: {
                future: "mewn %s",
                past: "%s yn ôl",
                s: "ychydig eiliadau",
                m: "munud",
                mm: "%d munud",
                h: "awr",
                hh: "%d awr",
                d: "diwrnod",
                dd: "%d diwrnod",
                M: "mis",
                MM: "%d mis",
                y: "blwyddyn",
                yy: "%d flynedd"
            },
            ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
            ordinal: function (e) {
                var t = e, i = "", n = ["", "af", "il", "ydd", "ydd", "ed", "ed", "ed", "fed", "fed", "fed", "eg", "fed", "eg", "eg", "fed", "eg", "eg", "fed", "eg", "fed"];
                return t > 20 ? i = 40 === t || 50 === t || 60 === t || 80 === t || 100 === t ? "fed" : "ain" : t > 0 && (i = n[t]), e + i
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("da", {
            months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY HH:mm", LLLL: "dddd [d.] D. MMMM YYYY HH:mm"},
            calendar: {sameDay: "[I dag kl.] LT", nextDay: "[I morgen kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[I går kl.] LT", lastWeek: "[sidste] dddd [kl] LT", sameElse: "L"},
            relativeTime: {
                future: "om %s",
                past: "%s siden",
                s: "få sekunder",
                m: "et minut",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dage",
                M: "en måned",
                MM: "%d måneder",
                y: "et år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("de-at", {
            months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY HH:mm", LLLL: "dddd, D. MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[Heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[Morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[Gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {future: "in %s", past: "vor %s", s: "ein paar Sekunden", m: Ni, mm: "%d Minuten", h: Ni, hh: "%d Stunden", d: Ni, dd: Ni, M: Ni, MM: Ni, y: Ni, yy: Ni},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("de", {
            months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY HH:mm", LLLL: "dddd, D. MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[Heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[Morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[Gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {future: "in %s", past: "vor %s", s: "ein paar Sekunden", m: Ri, mm: "%d Minuten", h: Ri, hh: "%d Stunden", d: Ri, dd: Ri, M: Ri, MM: Ri, y: Ri, yy: Ri},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("el", {
            monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
            monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
            months: function (e, t) {
                return /D/.test(t.substring(0, t.indexOf("MMMM"))) ? this._monthsGenitiveEl[e.month()] : this._monthsNominativeEl[e.month()]
            },
            monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
            weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
            weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
            weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
            meridiem: function (e, t, i) {
                return e > 11 ? i ? "μμ" : "ΜΜ" : i ? "πμ" : "ΠΜ"
            },
            isPM: function (e) {
                return "μ" === (e + "").toLowerCase()[0]
            },
            meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
            longDateFormat: {LT: "h:mm A", LTS: "h:mm:ss A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY h:mm A", LLLL: "dddd, D MMMM YYYY h:mm A"},
            calendarEl: {
                sameDay: "[Σήμερα {}] LT", nextDay: "[Αύριο {}] LT", nextWeek: "dddd [{}] LT", lastDay: "[Χθες {}] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 6:
                            return "[το προηγούμενο] dddd [{}] LT";
                        default:
                            return "[την προηγούμενη] dddd [{}] LT"
                    }
                }, sameElse: "L"
            },
            calendar: function (e, t) {
                var i = this._calendarEl[e], n = t && t.hours();
                return "function" == typeof i && (i = i.apply(t)), i.replace("{}", n % 12 == 1 ? "στη" : "στις")
            },
            relativeTime: {
                future: "σε %s",
                past: "%s πριν",
                s: "λίγα δευτερόλεπτα",
                m: "ένα λεπτό",
                mm: "%d λεπτά",
                h: "μία ώρα",
                hh: "%d ώρες",
                d: "μία μέρα",
                dd: "%d μέρες",
                M: "ένας μήνας",
                MM: "%d μήνες",
                y: "ένας χρόνος",
                yy: "%d χρόνια"
            },
            ordinalParse: /\d{1,2}η/,
            ordinal: "%dη",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("en-au", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {LT: "h:mm A", LTS: "h:mm:ss A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY h:mm A", LLLL: "dddd, D MMMM YYYY h:mm A"},
            calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"},
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("en-ca", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {LT: "h:mm A", LTS: "h:mm:ss A", L: "YYYY-MM-DD", LL: "D MMMM, YYYY", LLL: "D MMMM, YYYY h:mm A", LLLL: "dddd, D MMMM, YYYY h:mm A"},
            calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"},
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            }
        }), ga.defineLocale("en-gb", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"},
            relativeTime: {
                future: "in %s", past: "%s ago", s: "a few seconds",
                m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("eo", {
            months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
            weekdays: "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
            weekdaysShort: "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY-MM-DD", LL: "D[-an de] MMMM, YYYY", LLL: "D[-an de] MMMM, YYYY HH:mm", LLLL: "dddd, [la] D[-an de] MMMM, YYYY HH:mm"},
            meridiemParse: /[ap]\.t\.m/i,
            isPM: function (e) {
                return "p" === e.charAt(0).toLowerCase()
            },
            meridiem: function (e, t, i) {
                return e > 11 ? i ? "p.t.m." : "P.T.M." : i ? "a.t.m." : "A.T.M."
            },
            calendar: {sameDay: "[Hodiaŭ je] LT", nextDay: "[Morgaŭ je] LT", nextWeek: "dddd [je] LT", lastDay: "[Hieraŭ je] LT", lastWeek: "[pasinta] dddd [je] LT", sameElse: "L"},
            relativeTime: {
                future: "je %s",
                past: "antaŭ %s",
                s: "sekundoj",
                m: "minuto",
                mm: "%d minutoj",
                h: "horo",
                hh: "%d horoj",
                d: "tago",
                dd: "%d tagoj",
                M: "monato",
                MM: "%d monatoj",
                y: "jaro",
                yy: "%d jaroj"
            },
            ordinalParse: /\d{1,2}a/,
            ordinal: "%da",
            week: {dow: 1, doy: 7}
        }), "Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_")), Pa = "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"), Ia = (ga.defineLocale("es", {
            months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
            monthsShort: function (e, t) {
                return /-MMM-/.test(t) ? Pa[e.month()] : Oa[e.month()]
            },
            weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
            weekdaysShort: "Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY H:mm", LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"},
            calendar: {
                sameDay: function () {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                }, nextDay: function () {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                }, nextWeek: function () {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                }, lastDay: function () {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                }, lastWeek: function () {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("et", {
            months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
            monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
            weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
            weekdaysShort: "P_E_T_K_N_R_L".split("_"),
            weekdaysMin: "P_E_T_K_N_R_L".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {sameDay: "[Täna,] LT", nextDay: "[Homme,] LT", nextWeek: "[Järgmine] dddd LT", lastDay: "[Eile,] LT", lastWeek: "[Eelmine] dddd LT", sameElse: "L"},
            relativeTime: {future: "%s pärast", past: "%s tagasi", s: Ki, m: Ki, mm: Ki, h: Ki, hh: Ki, d: Ki, dd: "%d päeva", M: Ki, MM: Ki, y: Ki, yy: Ki},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("eu", {
            months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
            monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
            weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
            weekdaysShort: "ig._al._ar._az._og._ol._lr.".split("_"),
            weekdaysMin: "ig_al_ar_az_og_ol_lr".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY[ko] MMMM[ren] D[a]",
                LLL: "YYYY[ko] MMMM[ren] D[a] HH:mm",
                LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",
                l: "YYYY-M-D",
                ll: "YYYY[ko] MMM D[a]",
                lll: "YYYY[ko] MMM D[a] HH:mm",
                llll: "ddd, YYYY[ko] MMM D[a] HH:mm"
            },
            calendar: {sameDay: "[gaur] LT[etan]", nextDay: "[bihar] LT[etan]", nextWeek: "dddd LT[etan]", lastDay: "[atzo] LT[etan]", lastWeek: "[aurreko] dddd LT[etan]", sameElse: "L"},
            relativeTime: {
                future: "%s barru",
                past: "duela %s",
                s: "segundo batzuk",
                m: "minutu bat",
                mm: "%d minutu",
                h: "ordu bat",
                hh: "%d ordu",
                d: "egun bat",
                dd: "%d egun",
                M: "hilabete bat",
                MM: "%d hilabete",
                y: "urte bat",
                yy: "%d urte"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), {1: "۱", 2: "۲", 3: "۳", 4: "۴", 5: "۵", 6: "۶", 7: "۷", 8: "۸", 9: "۹", 0: "۰"}), ja = {"۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9", "۰": "0"},
        Wa = (ga.defineLocale("fa", {
            months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            meridiemParse: /قبل از ظهر|بعد از ظهر/,
            isPM: function (e) {
                return /بعد از ظهر/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "قبل از ظهر" : "بعد از ظهر"
            },
            calendar: {sameDay: "[امروز ساعت] LT", nextDay: "[فردا ساعت] LT", nextWeek: "dddd [ساعت] LT", lastDay: "[دیروز ساعت] LT", lastWeek: "dddd [پیش] [ساعت] LT", sameElse: "L"},
            relativeTime: {
                future: "در %s",
                past: "%s پیش",
                s: "چندین ثانیه",
                m: "یک دقیقه",
                mm: "%d دقیقه",
                h: "یک ساعت",
                hh: "%d ساعت",
                d: "یک روز",
                dd: "%d روز",
                M: "یک ماه",
                MM: "%d ماه",
                y: "یک سال",
                yy: "%d سال"
            },
            preparse: function (e) {
                return e.replace(/[۰-۹]/g, function (e) {
                    return ja[e]
                }).replace(/،/g, ",")
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Ia[e]
                }).replace(/,/g, "،")
            },
            ordinalParse: /\d{1,2}م/,
            ordinal: "%dم",
            week: {dow: 6, doy: 12}
        }), "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")), Fa = ["nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", Wa[7], Wa[8], Wa[9]],
        za = (ga.defineLocale("fi", {
            months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
            monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
            weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
            weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
            weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD.MM.YYYY",
                LL: "Do MMMM[ta] YYYY",
                LLL: "Do MMMM[ta] YYYY, [klo] HH.mm",
                LLLL: "dddd, Do MMMM[ta] YYYY, [klo] HH.mm",
                l: "D.M.YYYY",
                ll: "Do MMM YYYY",
                lll: "Do MMM YYYY, [klo] HH.mm",
                llll: "ddd, Do MMM YYYY, [klo] HH.mm"
            },
            calendar: {sameDay: "[tänään] [klo] LT", nextDay: "[huomenna] [klo] LT", nextWeek: "dddd [klo] LT", lastDay: "[eilen] [klo] LT", lastWeek: "[viime] dddd[na] [klo] LT", sameElse: "L"},
            relativeTime: {future: "%s päästä", past: "%s sitten", s: Gi, m: Gi, mm: Gi, h: Gi, hh: Gi, d: Gi, dd: Gi, M: Gi, MM: Gi, y: Gi, yy: Gi},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("fo", {
            months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),
            weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split("_"),
            weekdaysMin: "su_má_tý_mi_hó_fr_le".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D. MMMM, YYYY HH:mm"},
            calendar: {sameDay: "[Í dag kl.] LT", nextDay: "[Í morgin kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[Í gjár kl.] LT", lastWeek: "[síðstu] dddd [kl] LT", sameElse: "L"},
            relativeTime: {
                future: "um %s",
                past: "%s síðani",
                s: "fá sekund",
                m: "ein minutt",
                mm: "%d minuttir",
                h: "ein tími",
                hh: "%d tímar",
                d: "ein dagur",
                dd: "%d dagar",
                M: "ein mánaði",
                MM: "%d mánaðir",
                y: "eitt ár",
                yy: "%d ár"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("fr-ca", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY-MM-DD", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Aujourd'hui à] LT", nextDay: "[Demain à] LT", nextWeek: "dddd [à] LT", lastDay: "[Hier à] LT", lastWeek: "dddd [dernier à] LT", sameElse: "L"},
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinalParse: /\d{1,2}(er|e)/,
            ordinal: function (e) {
                return e + (1 === e ? "er" : "e")
            }
        }), ga.defineLocale("fr", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Aujourd'hui à] LT", nextDay: "[Demain à] LT", nextWeek: "dddd [à] LT", lastDay: "[Hier à] LT", lastWeek: "dddd [dernier à] LT", sameElse: "L"},
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal: function (e) {
                return e + (1 === e ? "er" : "")
            },
            week: {dow: 1, doy: 4}
        }), "jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")), Ha = "jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"), Ba = (ga.defineLocale("fy", {
            months: "jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),
            monthsShort: function (e, t) {
                return /-MMM-/.test(t) ? Ha[e.month()] : za[e.month()]
            },
            weekdays: "snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),
            weekdaysShort: "si._mo._ti._wo._to._fr._so.".split("_"),
            weekdaysMin: "Si_Mo_Ti_Wo_To_Fr_So".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD-MM-YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[hjoed om] LT", nextDay: "[moarn om] LT", nextWeek: "dddd [om] LT", lastDay: "[juster om] LT", lastWeek: "[ôfrûne] dddd [om] LT", sameElse: "L"},
            relativeTime: {
                future: "oer %s",
                past: "%s lyn",
                s: "in pear sekonden",
                m: "ien minút",
                mm: "%d minuten",
                h: "ien oere",
                hh: "%d oeren",
                d: "ien dei",
                dd: "%d dagen",
                M: "ien moanne",
                MM: "%d moannen",
                y: "ien jier",
                yy: "%d jierren"
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("gl", {
            months: "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),
            monthsShort: "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
            weekdays: "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
            weekdaysShort: "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd D MMMM YYYY H:mm"},
            calendar: {
                sameDay: function () {
                    return "[hoxe " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                }, nextDay: function () {
                    return "[mañá " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                }, nextWeek: function () {
                    return "dddd [" + (1 !== this.hours() ? "ás" : "a") + "] LT"
                }, lastDay: function () {
                    return "[onte " + (1 !== this.hours() ? "á" : "a") + "] LT"
                }, lastWeek: function () {
                    return "[o] dddd [pasado " + (1 !== this.hours() ? "ás" : "a") + "] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: function (e) {
                    return "uns segundos" === e ? "nuns segundos" : "en " + e
                }, past: "hai %s", s: "uns segundos", m: "un minuto", mm: "%d minutos", h: "unha hora", hh: "%d horas", d: "un día", dd: "%d días", M: "un mes", MM: "%d meses", y: "un ano", yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("he", {
            months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
            monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
            weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
            weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
            weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [ב]MMMM YYYY",
                LLL: "D [ב]MMMM YYYY HH:mm",
                LLLL: "dddd, D [ב]MMMM YYYY HH:mm",
                l: "D/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd, D MMM YYYY HH:mm"
            },
            calendar: {sameDay: "[היום ב־]LT", nextDay: "[מחר ב־]LT", nextWeek: "dddd [בשעה] LT", lastDay: "[אתמול ב־]LT", lastWeek: "[ביום] dddd [האחרון בשעה] LT", sameElse: "L"},
            relativeTime: {
                future: "בעוד %s", past: "לפני %s", s: "מספר שניות", m: "דקה", mm: "%d דקות", h: "שעה", hh: function (e) {
                    return 2 === e ? "שעתיים" : e + " שעות"
                }, d: "יום", dd: function (e) {
                    return 2 === e ? "יומיים" : e + " ימים"
                }, M: "חודש", MM: function (e) {
                    return 2 === e ? "חודשיים" : e + " חודשים"
                }, y: "שנה", yy: function (e) {
                    return 2 === e ? "שנתיים" : e % 10 == 0 && 10 !== e ? e + " שנה" : e + " שנים"
                }
            }
        }), {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}), Ua = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"},
        $a = (ga.defineLocale("hi", {
            months: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),
            monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),
            weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {LT: "A h:mm बजे", LTS: "A h:mm:ss बजे", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, A h:mm बजे", LLLL: "dddd, D MMMM YYYY, A h:mm बजे"},
            calendar: {sameDay: "[आज] LT", nextDay: "[कल] LT", nextWeek: "dddd, LT", lastDay: "[कल] LT", lastWeek: "[पिछले] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s में",
                past: "%s पहले",
                s: "कुछ ही क्षण",
                m: "एक मिनट",
                mm: "%d मिनट",
                h: "एक घंटा",
                hh: "%d घंटे",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महीने",
                MM: "%d महीने",
                y: "एक वर्ष",
                yy: "%d वर्ष"
            },
            preparse: function (e) {
                return e.replace(/[१२३४५६७८९०]/g, function (e) {
                    return Ua[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Ba[e]
                })
            },
            meridiemParse: /रात|सुबह|दोपहर|शाम/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "रात" === t ? e < 4 ? e : e + 12 : "सुबह" === t ? e : "दोपहर" === t ? e >= 10 ? e : e + 12 : "शाम" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "रात" : e < 10 ? "सुबह" : e < 17 ? "दोपहर" : e < 20 ? "शाम" : "रात"
            },
            week: {dow: 0, doy: 6}
        }), ga.defineLocale("hr", {
            months: "siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),
            monthsShort: "sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                }, lastDay: "[jučer u] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "za %s", past: "prije %s", s: "par sekundi", m: Vi, mm: Vi, h: Vi, hh: Vi, d: "dan", dd: Vi, M: "mjesec", MM: Vi, y: "godinu", yy: Vi},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")), Na = (ga.defineLocale("hu", {
            months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
            monthsShort: "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
            weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
            weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
            weekdaysMin: "v_h_k_sze_cs_p_szo".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "YYYY.MM.DD.", LL: "YYYY. MMMM D.", LLL: "YYYY. MMMM D. H:mm", LLLL: "YYYY. MMMM D., dddd H:mm"},
            meridiemParse: /de|du/i,
            isPM: function (e) {
                return "u" === e.charAt(1).toLowerCase()
            },
            meridiem: function (e, t, i) {
                return e < 12 ? !0 === i ? "de" : "DE" : !0 === i ? "du" : "DU"
            },
            calendar: {
                sameDay: "[ma] LT[-kor]", nextDay: "[holnap] LT[-kor]", nextWeek: function () {
                    return Zi.call(this, !0)
                }, lastDay: "[tegnap] LT[-kor]", lastWeek: function () {
                    return Zi.call(this, !1)
                }, sameElse: "L"
            },
            relativeTime: {future: "%s múlva", past: "%s", s: Ji, m: Ji, mm: Ji, h: Ji, hh: Ji, d: Ji, dd: Ji, M: Ji, MM: Ji, y: Ji, yy: Ji},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("hy-am", {
            months: Qi,
            monthsShort: Xi,
            weekdays: en,
            weekdaysShort: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            weekdaysMin: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY թ.", LLL: "D MMMM YYYY թ., HH:mm", LLLL: "dddd, D MMMM YYYY թ., HH:mm"},
            calendar: {
                sameDay: "[այսօր] LT", nextDay: "[վաղը] LT", lastDay: "[երեկ] LT", nextWeek: function () {
                    return "dddd [օրը ժամը] LT"
                }, lastWeek: function () {
                    return "[անցած] dddd [օրը ժամը] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: "%s հետո",
                past: "%s առաջ",
                s: "մի քանի վայրկյան",
                m: "րոպե",
                mm: "%d րոպե",
                h: "ժամ",
                hh: "%d ժամ",
                d: "օր",
                dd: "%d օր",
                M: "ամիս",
                MM: "%d ամիս",
                y: "տարի",
                yy: "%d տարի"
            },
            meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
            isPM: function (e) {
                return /^(ցերեկվա|երեկոյան)$/.test(e)
            },
            meridiem: function (e) {
                return e < 4 ? "գիշերվա" : e < 12 ? "առավոտվա" : e < 17 ? "ցերեկվա" : "երեկոյան"
            },
            ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"DDD":
                    case"w":
                    case"W":
                    case"DDDo":
                        return 1 === e ? e + "-ին" : e + "-րդ";
                    default:
                        return e
                }
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("id", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {LT: "HH.mm", LTS: "HH.mm.ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] HH.mm", LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"},
            meridiemParse: /pagi|siang|sore|malam/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "siang" === t ? e >= 11 ? e : e + 12 : "sore" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 11 ? "pagi" : e < 15 ? "siang" : e < 19 ? "sore" : "malam"
            },
            calendar: {sameDay: "[Hari ini pukul] LT", nextDay: "[Besok pukul] LT", nextWeek: "dddd [pukul] LT", lastDay: "[Kemarin pukul] LT", lastWeek: "dddd [lalu pukul] LT", sameElse: "L"},
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lalu",
                s: "beberapa detik",
                m: "semenit",
                mm: "%d menit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("is", {
            months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
            weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
            weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split("_"),
            weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD/MM/YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY [kl.] H:mm", LLLL: "dddd, D. MMMM YYYY [kl.] H:mm"},
            calendar: {sameDay: "[í dag kl.] LT", nextDay: "[á morgun kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[í gær kl.] LT", lastWeek: "[síðasta] dddd [kl.] LT", sameElse: "L"},
            relativeTime: {future: "eftir %s", past: "fyrir %s síðan", s: nn, m: nn, mm: nn, h: "klukkustund", hh: nn, d: nn, dd: nn, M: nn, MM: nn, y: nn, yy: nn},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("it", {
            months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),
            monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
            weekdays: "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
            weekdaysShort: "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
            weekdaysMin: "D_L_Ma_Me_G_V_S".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[Oggi alle] LT", nextDay: "[Domani alle] LT", nextWeek: "dddd [alle] LT", lastDay: "[Ieri alle] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[la scorsa] dddd [alle] LT";
                        default:
                            return "[lo scorso] dddd [alle] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {
                future: function (e) {
                    return (/^[0-9].+$/.test(e) ? "tra" : "in") + " " + e
                }, past: "%s fa", s: "alcuni secondi", m: "un minuto", mm: "%d minuti", h: "un'ora", hh: "%d ore", d: "un giorno", dd: "%d giorni", M: "un mese", MM: "%d mesi", y: "un anno", yy: "%d anni"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("ja", {
            months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
            weekdaysShort: "日_月_火_水_木_金_土".split("_"),
            weekdaysMin: "日_月_火_水_木_金_土".split("_"),
            longDateFormat: {LT: "Ah時m分", LTS: "Ah時m分s秒", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah時m分", LLLL: "YYYY年M月D日Ah時m分 dddd"},
            meridiemParse: /午前|午後/i,
            isPM: function (e) {
                return "午後" === e
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "午前" : "午後"
            },
            calendar: {sameDay: "[今日] LT", nextDay: "[明日] LT", nextWeek: "[来週]dddd LT", lastDay: "[昨日] LT", lastWeek: "[前週]dddd LT", sameElse: "L"},
            relativeTime: {future: "%s後", past: "%s前", s: "数秒", m: "1分", mm: "%d分", h: "1時間", hh: "%d時間", d: "1日", dd: "%d日", M: "1ヶ月", MM: "%dヶ月", y: "1年", yy: "%d年"}
        }), ga.defineLocale("jv", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),
            weekdays: "Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),
            longDateFormat: {LT: "HH.mm", LTS: "HH.mm.ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] HH.mm", LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"},
            meridiemParse: /enjing|siyang|sonten|ndalu/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "enjing" === t ? e : "siyang" === t ? e >= 11 ? e : e + 12 : "sonten" === t || "ndalu" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 11 ? "enjing" : e < 15 ? "siyang" : e < 19 ? "sonten" : "ndalu"
            },
            calendar: {
                sameDay: "[Dinten puniko pukul] LT",
                nextDay: "[Mbenjang pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kala wingi pukul] LT",
                lastWeek: "dddd [kepengker pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "wonten ing %s",
                past: "%s ingkang kepengker",
                s: "sawetawis detik",
                m: "setunggal menit",
                mm: "%d menit",
                h: "setunggal jam",
                hh: "%d jam",
                d: "sedinten",
                dd: "%d dinten",
                M: "sewulan",
                MM: "%d wulan",
                y: "setaun",
                yy: "%d taun"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("ka", {
            months: rn,
            monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
            weekdays: an,
            weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
            weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
            longDateFormat: {LT: "h:mm A", LTS: "h:mm:ss A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY h:mm A", LLLL: "dddd, D MMMM YYYY h:mm A"},
            calendar: {sameDay: "[დღეს] LT[-ზე]", nextDay: "[ხვალ] LT[-ზე]", lastDay: "[გუშინ] LT[-ზე]", nextWeek: "[შემდეგ] dddd LT[-ზე]", lastWeek: "[წინა] dddd LT-ზე", sameElse: "L"},
            relativeTime: {
                future: function (e) {
                    return /(წამი|წუთი|საათი|წელი)/.test(e) ? e.replace(/ი$/, "ში") : e + "ში"
                }, past: function (e) {
                    return /(წამი|წუთი|საათი|დღე|თვე)/.test(e) ? e.replace(/(ი|ე)$/, "ის წინ") : /წელი/.test(e) ? e.replace(/წელი$/, "წლის წინ") : void 0
                }, s: "რამდენიმე წამი", m: "წუთი", mm: "%d წუთი", h: "საათი", hh: "%d საათი", d: "დღე", dd: "%d დღე", M: "თვე", MM: "%d თვე", y: "წელი", yy: "%d წელი"
            },
            ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
            ordinal: function (e) {
                return 0 === e ? e : 1 === e ? e + "-ლი" : e < 20 || e <= 100 && e % 20 == 0 || e % 100 == 0 ? "მე-" + e : e + "-ე"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("km", {
            months: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            monthsShort: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysShort: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysMin: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[ថ្ងៃនៈ ម៉ោង] LT", nextDay: "[ស្អែក ម៉ោង] LT", nextWeek: "dddd [ម៉ោង] LT", lastDay: "[ម្សិលមិញ ម៉ោង] LT", lastWeek: "dddd [សប្តាហ៍មុន] [ម៉ោង] LT", sameElse: "L"},
            relativeTime: {
                future: "%sទៀត",
                past: "%sមុន",
                s: "ប៉ុន្មានវិនាទី",
                m: "មួយនាទី",
                mm: "%d នាទី",
                h: "មួយម៉ោង",
                hh: "%d ម៉ោង",
                d: "មួយថ្ងៃ",
                dd: "%d ថ្ងៃ",
                M: "មួយខែ",
                MM: "%d ខែ",
                y: "មួយឆ្នាំ",
                yy: "%d ឆ្នាំ"
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("ko", {
            months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
            weekdaysShort: "일_월_화_수_목_금_토".split("_"),
            weekdaysMin: "일_월_화_수_목_금_토".split("_"),
            longDateFormat: {LT: "A h시 m분", LTS: "A h시 m분 s초", L: "YYYY.MM.DD", LL: "YYYY년 MMMM D일", LLL: "YYYY년 MMMM D일 A h시 m분", LLLL: "YYYY년 MMMM D일 dddd A h시 m분"},
            calendar: {sameDay: "오늘 LT", nextDay: "내일 LT", nextWeek: "dddd LT", lastDay: "어제 LT", lastWeek: "지난주 dddd LT", sameElse: "L"},
            relativeTime: {future: "%s 후", past: "%s 전", s: "몇초", ss: "%d초", m: "일분", mm: "%d분", h: "한시간", hh: "%d시간", d: "하루", dd: "%d일", M: "한달", MM: "%d달", y: "일년", yy: "%d년"},
            ordinalParse: /\d{1,2}일/,
            ordinal: "%d일",
            meridiemParse: /오전|오후/,
            isPM: function (e) {
                return "오후" === e
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "오전" : "오후"
            }
        }), ga.defineLocale("lb", {
            months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),
            weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
            longDateFormat: {LT: "H:mm [Auer]", LTS: "H:mm:ss [Auer]", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm [Auer]", LLLL: "dddd, D. MMMM YYYY H:mm [Auer]"},
            calendar: {
                sameDay: "[Haut um] LT", sameElse: "L", nextDay: "[Muer um] LT", nextWeek: "dddd [um] LT", lastDay: "[Gëschter um] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 2:
                        case 4:
                            return "[Leschten] dddd [um] LT";
                        default:
                            return "[Leschte] dddd [um] LT"
                    }
                }
            },
            relativeTime: {future: on, past: ln, s: "e puer Sekonnen", m: sn, mm: "%d Minutten", h: sn, hh: "%d Stonnen", d: sn, dd: "%d Deeg", M: sn, MM: "%d Méint", y: sn, yy: "%d Joer"},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), {
            m: "minutė_minutės_minutę",
            mm: "minutės_minučių_minutes",
            h: "valanda_valandos_valandą",
            hh: "valandos_valandų_valandas",
            d: "diena_dienos_dieną",
            dd: "dienos_dienų_dienas",
            M: "mėnuo_mėnesio_mėnesį",
            MM: "mėnesiai_mėnesių_mėnesius",
            y: "metai_metų_metus",
            yy: "metai_metų_metus"
        }), Ra = "sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"), Ka = (ga.defineLocale("lt", {
            months: cn,
            monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
            weekdays: _n,
            weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
            weekdaysMin: "S_P_A_T_K_Pn_Š".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY [m.] MMMM D [d.]",
                LLL: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
                LLLL: "YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",
                l: "YYYY-MM-DD",
                ll: "YYYY [m.] MMMM D [d.]",
                lll: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
                llll: "YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"
            },
            calendar: {sameDay: "[Šiandien] LT", nextDay: "[Rytoj] LT", nextWeek: "dddd LT", lastDay: "[Vakar] LT", lastWeek: "[Praėjusį] dddd LT", sameElse: "L"},
            relativeTime: {future: "po %s", past: "prieš %s", s: dn, m: mn, mm: fn, h: mn, hh: fn, d: mn, dd: fn, M: mn, MM: fn, y: mn, yy: fn},
            ordinalParse: /\d{1,2}-oji/,
            ordinal: function (e) {
                return e + "-oji"
            },
            week: {dow: 1, doy: 4}
        }), {
            m: "minūtes_minūtēm_minūte_minūtes".split("_"),
            mm: "minūtes_minūtēm_minūte_minūtes".split("_"),
            h: "stundas_stundām_stunda_stundas".split("_"),
            hh: "stundas_stundām_stunda_stundas".split("_"),
            d: "dienas_dienām_diena_dienas".split("_"),
            dd: "dienas_dienām_diena_dienas".split("_"),
            M: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
            MM: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
            y: "gada_gadiem_gads_gadi".split("_"),
            yy: "gada_gadiem_gads_gadi".split("_")
        }), Ga = (ga.defineLocale("lv", {
            months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
            weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
            weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
            weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY.", LL: "YYYY. [gada] D. MMMM", LLL: "YYYY. [gada] D. MMMM, HH:mm", LLLL: "YYYY. [gada] D. MMMM, dddd, HH:mm"},
            calendar: {
                sameDay: "[Šodien pulksten] LT",
                nextDay: "[Rīt pulksten] LT",
                nextWeek: "dddd [pulksten] LT",
                lastDay: "[Vakar pulksten] LT",
                lastWeek: "[Pagājušā] dddd [pulksten] LT",
                sameElse: "L"
            },
            relativeTime: {future: "pēc %s", past: "pirms %s", s: kn, m: vn, mm: yn, h: vn, hh: yn, d: vn, dd: yn, M: vn, MM: yn, y: vn, yy: yn},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), {
            words: {
                m: ["jedan minut", "jednog minuta"],
                mm: ["minut", "minuta", "minuta"],
                h: ["jedan sat", "jednog sata"],
                hh: ["sat", "sata", "sati"],
                dd: ["dan", "dana", "dana"],
                MM: ["mjesec", "mjeseca", "mjeseci"],
                yy: ["godina", "godine", "godina"]
            }, correctGrammaticalCase: function (e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            }, translate: function (e, t, i) {
                var n = Ga.words[i];
                return 1 === i.length ? t ? n[0] : n[1] : e + " " + Ga.correctGrammaticalCase(e, n)
            }
        }), qa = (ga.defineLocale("me", {
            months: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"],
            monthsShort: ["jan.", "feb.", "mar.", "apr.", "maj", "jun", "jul", "avg.", "sep.", "okt.", "nov.", "dec."],
            weekdays: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"],
            weekdaysShort: ["ned.", "pon.", "uto.", "sri.", "čet.", "pet.", "sub."],
            weekdaysMin: ["ne", "po", "ut", "sr", "če", "pe", "su"],
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[danas u] LT", nextDay: "[sjutra u] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                }, lastDay: "[juče u] LT", lastWeek: function () {
                    return ["[prošle] [nedjelje] [u] LT", "[prošlog] [ponedjeljka] [u] LT", "[prošlog] [utorka] [u] LT", "[prošle] [srijede] [u] LT", "[prošlog] [četvrtka] [u] LT", "[prošlog] [petka] [u] LT", "[prošle] [subote] [u] LT"][this.day()]
                }, sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "nekoliko sekundi",
                m: Ga.translate,
                mm: Ga.translate,
                h: Ga.translate,
                hh: Ga.translate,
                d: "dan",
                dd: Ga.translate,
                M: "mjesec",
                MM: Ga.translate,
                y: "godinu",
                yy: Ga.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("mk", {
            months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),
            weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split("_"),
            weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss", L: "D.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[Денес во] LT", nextDay: "[Утре во] LT", nextWeek: "dddd [во] LT", lastDay: "[Вчера во] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[Во изминатата] dddd [во] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[Во изминатиот] dddd [во] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {
                future: "после %s",
                past: "пред %s",
                s: "неколку секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дена",
                M: "месец",
                MM: "%d месеци",
                y: "година",
                yy: "%d години"
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function (e) {
                var t = e % 10, i = e % 100;
                return 0 === e ? e + "-ев" : 0 === i ? e + "-ен" : i > 10 && i < 20 ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("ml", {
            months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),
            monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),
            weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),
            weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),
            weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),
            longDateFormat: {LT: "A h:mm -നു", LTS: "A h:mm:ss -നു", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, A h:mm -നു", LLLL: "dddd, D MMMM YYYY, A h:mm -നു"},
            calendar: {sameDay: "[ഇന്ന്] LT", nextDay: "[നാളെ] LT", nextWeek: "dddd, LT", lastDay: "[ഇന്നലെ] LT", lastWeek: "[കഴിഞ്ഞ] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s കഴിഞ്ഞ്",
                past: "%s മുൻപ്",
                s: "അൽപ നിമിഷങ്ങൾ",
                m: "ഒരു മിനിറ്റ്",
                mm: "%d മിനിറ്റ്",
                h: "ഒരു മണിക്കൂർ",
                hh: "%d മണിക്കൂർ",
                d: "ഒരു ദിവസം",
                dd: "%d ദിവസം",
                M: "ഒരു മാസം",
                MM: "%d മാസം",
                y: "ഒരു വർഷം",
                yy: "%d വർഷം"
            },
            meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
            isPM: function (e) {
                return /^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "രാത്രി" : e < 12 ? "രാവിലെ" : e < 17 ? "ഉച്ച കഴിഞ്ഞ്" : e < 20 ? "വൈകുന്നേരം" : "രാത്രി"
            }
        }), {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}), Va = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"},
        Ja = (ga.defineLocale("mr", {
            months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),
            monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),
            weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {LT: "A h:mm वाजता", LTS: "A h:mm:ss वाजता", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, A h:mm वाजता", LLLL: "dddd, D MMMM YYYY, A h:mm वाजता"},
            calendar: {sameDay: "[आज] LT", nextDay: "[उद्या] LT", nextWeek: "dddd, LT", lastDay: "[काल] LT", lastWeek: "[मागील] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s नंतर",
                past: "%s पूर्वी",
                s: "सेकंद",
                m: "एक मिनिट",
                mm: "%d मिनिटे",
                h: "एक तास",
                hh: "%d तास",
                d: "एक दिवस",
                dd: "%d दिवस",
                M: "एक महिना",
                MM: "%d महिने",
                y: "एक वर्ष",
                yy: "%d वर्षे"
            },
            preparse: function (e) {
                return e.replace(/[१२३४५६७८९०]/g, function (e) {
                    return Va[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return qa[e]
                })
            },
            meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "रात्री" === t ? e < 4 ? e : e + 12 : "सकाळी" === t ? e : "दुपारी" === t ? e >= 10 ? e : e + 12 : "सायंकाळी" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "रात्री" : e < 10 ? "सकाळी" : e < 17 ? "दुपारी" : e < 20 ? "सायंकाळी" : "रात्री"
            },
            week: {dow: 0, doy: 6}
        }), ga.defineLocale("ms-my", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {LT: "HH.mm", LTS: "HH.mm.ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] HH.mm", LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"},
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "tengahari" === t ? e >= 11 ? e : e + 12 : "petang" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 11 ? "pagi" : e < 15 ? "tengahari" : e < 19 ? "petang" : "malam"
            },
            calendar: {sameDay: "[Hari ini pukul] LT", nextDay: "[Esok pukul] LT", nextWeek: "dddd [pukul] LT", lastDay: "[Kelmarin pukul] LT", lastWeek: "dddd [lepas pukul] LT", sameElse: "L"},
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("ms", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {LT: "HH.mm", LTS: "HH.mm.ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] HH.mm", LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"},
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "tengahari" === t ? e >= 11 ? e : e + 12 : "petang" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 11 ? "pagi" : e < 15 ? "tengahari" : e < 19 ? "petang" : "malam"
            },
            calendar: {sameDay: "[Hari ini pukul] LT", nextDay: "[Esok pukul] LT", nextWeek: "dddd [pukul] LT", lastDay: "[Kelmarin pukul] LT", lastWeek: "dddd [lepas pukul] LT", sameElse: "L"},
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {dow: 1, doy: 7}
        }), {1: "၁", 2: "၂", 3: "၃", 4: "၄", 5: "၅", 6: "၆", 7: "၇", 8: "၈", 9: "၉", 0: "၀"}),
        Za = {"၁": "1", "၂": "2", "၃": "3", "၄": "4", "၅": "5", "၆": "6", "၇": "7", "၈": "8", "၉": "9", "၀": "0"}, Qa = (ga.defineLocale("my", {
            months: "ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),
            monthsShort: "ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),
            weekdays: "တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),
            weekdaysShort: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            weekdaysMin: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[ယနေ.] LT [မှာ]", nextDay: "[မနက်ဖြန်] LT [မှာ]", nextWeek: "dddd LT [မှာ]", lastDay: "[မနေ.က] LT [မှာ]", lastWeek: "[ပြီးခဲ့သော] dddd LT [မှာ]", sameElse: "L"},
            relativeTime: {
                future: "လာမည့် %s မှာ",
                past: "လွန်ခဲ့သော %s က",
                s: "စက္ကန်.အနည်းငယ်",
                m: "တစ်မိနစ်",
                mm: "%d မိနစ်",
                h: "တစ်နာရီ",
                hh: "%d နာရီ",
                d: "တစ်ရက်",
                dd: "%d ရက်",
                M: "တစ်လ",
                MM: "%d လ",
                y: "တစ်နှစ်",
                yy: "%d နှစ်"
            },
            preparse: function (e) {
                return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (e) {
                    return Za[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Ja[e]
                })
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("nb", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tirs_ons_tors_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {LT: "H.mm", LTS: "H.mm.ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY [kl.] H.mm", LLLL: "dddd D. MMMM YYYY [kl.] H.mm"},
            calendar: {sameDay: "[i dag kl.] LT", nextDay: "[i morgen kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[i går kl.] LT", lastWeek: "[forrige] dddd [kl.] LT", sameElse: "L"},
            relativeTime: {
                future: "om %s",
                past: "for %s siden",
                s: "noen sekunder",
                m: "ett minutt",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dager",
                M: "en måned",
                MM: "%d måneder",
                y: "ett år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}), Xa = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"},
        es = (ga.defineLocale("ne", {
            months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),
            monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),
            weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),
            weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),
            weekdaysMin: "आइ._सो._मङ्_बु._बि._शु._श.".split("_"),
            longDateFormat: {LT: "Aको h:mm बजे", LTS: "Aको h:mm:ss बजे", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, Aको h:mm बजे", LLLL: "dddd, D MMMM YYYY, Aको h:mm बजे"},
            preparse: function (e) {
                return e.replace(/[१२३४५६७८९०]/g, function (e) {
                    return Xa[e]
                })
            },
            postformat: function (e) {
                return e.replace(/\d/g, function (e) {
                    return Qa[e]
                })
            },
            meridiemParse: /राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "राती" === t ? e < 3 ? e : e + 12 : "बिहान" === t ? e : "दिउँसो" === t ? e >= 10 ? e : e + 12 : "बेलुका" === t || "साँझ" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                return e < 3 ? "राती" : e < 10 ? "बिहान" : e < 15 ? "दिउँसो" : e < 18 ? "बेलुका" : e < 20 ? "साँझ" : "राती"
            },
            calendar: {sameDay: "[आज] LT", nextDay: "[भोली] LT", nextWeek: "[आउँदो] dddd[,] LT", lastDay: "[हिजो] LT", lastWeek: "[गएको] dddd[,] LT", sameElse: "L"},
            relativeTime: {
                future: "%sमा",
                past: "%s अगाडी",
                s: "केही समय",
                m: "एक मिनेट",
                mm: "%d मिनेट",
                h: "एक घण्टा",
                hh: "%d घण्टा",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महिना",
                MM: "%d महिना",
                y: "एक बर्ष",
                yy: "%d बर्ष"
            },
            week: {dow: 1, doy: 7}
        }), "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")), ts = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"), is = (ga.defineLocale("nl", {
            months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort: function (e, t) {
                return /-MMM-/.test(t) ? ts[e.month()] : es[e.month()]
            },
            weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
            weekdaysMin: "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD-MM-YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[vandaag om] LT", nextDay: "[morgen om] LT", nextWeek: "dddd [om] LT", lastDay: "[gisteren om] LT", lastWeek: "[afgelopen] dddd [om] LT", sameElse: "L"},
            relativeTime: {
                future: "over %s",
                past: "%s geleden",
                s: "een paar seconden",
                m: "één minuut",
                mm: "%d minuten",
                h: "één uur",
                hh: "%d uur",
                d: "één dag",
                dd: "%d dagen",
                M: "één maand",
                MM: "%d maanden",
                y: "één jaar",
                yy: "%d jaar"
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("nn", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
            weekdaysShort: "sun_mån_tys_ons_tor_fre_lau".split("_"),
            weekdaysMin: "su_må_ty_on_to_fr_lø".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[I dag klokka] LT",
                nextDay: "[I morgon klokka] LT",
                nextWeek: "dddd [klokka] LT",
                lastDay: "[I går klokka] LT",
                lastWeek: "[Føregåande] dddd [klokka] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "for %s sidan",
                s: "nokre sekund",
                m: "eit minutt",
                mm: "%d minutt",
                h: "ein time",
                hh: "%d timar",
                d: "ein dag",
                dd: "%d dagar",
                M: "ein månad",
                MM: "%d månader",
                y: "eit år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),
        ns = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"), rs = (ga.defineLocale("pl", {
            months: function (e, t) {
                return "" === t ? "(" + ns[e.month()] + "|" + is[e.month()] + ")" : /D MMMM/.test(t) ? ns[e.month()] : is[e.month()]
            },
            monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
            weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
            weekdaysShort: "nie_pon_wt_śr_czw_pt_sb".split("_"),
            weekdaysMin: "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {
                sameDay: "[Dziś o] LT", nextDay: "[Jutro o] LT", nextWeek: "[W] dddd [o] LT", lastDay: "[Wczoraj o] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[W zeszłą niedzielę o] LT";
                        case 3:
                            return "[W zeszłą środę o] LT";
                        case 6:
                            return "[W zeszłą sobotę o] LT";
                        default:
                            return "[W zeszły] dddd [o] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "za %s", past: "%s temu", s: "kilka sekund", m: Tn, mm: Tn, h: Tn, hh: Tn, d: "1 dzień", dd: "%d dni", M: "miesiąc", MM: Tn, y: "rok", yy: Tn},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("pt-br", {
            months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
            monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
            weekdays: "Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY [às] HH:mm", LLLL: "dddd, D [de] MMMM [de] YYYY [às] HH:mm"},
            calendar: {
                sameDay: "[Hoje às] LT", nextDay: "[Amanhã às] LT", nextWeek: "dddd [às] LT", lastDay: "[Ontem às] LT", lastWeek: function () {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "poucos segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº"
        }), ga.defineLocale("pt", {
            months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
            monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
            weekdays: "Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY HH:mm", LLLL: "dddd, D [de] MMMM [de] YYYY HH:mm"},
            calendar: {
                sameDay: "[Hoje às] LT", nextDay: "[Amanhã às] LT", nextWeek: "dddd [às] LT", lastDay: "[Ontem às] LT", lastWeek: function () {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                }, sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "há %s",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("ro", {
            months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),
            monthsShort: "ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),
            weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
            weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
            weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd, D MMMM YYYY H:mm"},
            calendar: {sameDay: "[azi la] LT", nextDay: "[mâine la] LT", nextWeek: "dddd [la] LT", lastDay: "[ieri la] LT", lastWeek: "[fosta] dddd [la] LT", sameElse: "L"},
            relativeTime: {future: "peste %s", past: "%s în urmă", s: "câteva secunde", m: "un minut", mm: bn, h: "o oră", hh: bn, d: "o zi", dd: bn, M: "o lună", MM: bn, y: "un an", yy: bn},
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("ru", {
            months: Ln,
            monthsShort: An,
            weekdays: Sn,
            weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            monthsParse: [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY г.", LLL: "D MMMM YYYY г., HH:mm", LLLL: "dddd, D MMMM YYYY г., HH:mm"},
            calendar: {
                sameDay: "[Сегодня в] LT", nextDay: "[Завтра в] LT", lastDay: "[Вчера в] LT", nextWeek: function () {
                    return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT"
                }, lastWeek: function (e) {
                    if (e.week() === this.week()) return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
                    switch (this.day()) {
                        case 0:
                            return "[В прошлое] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[В прошлый] dddd [в] LT";
                        case 3:
                        case 5:
                        case 6:
                            return "[В прошлую] dddd [в] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "через %s", past: "%s назад", s: "несколько секунд", m: Dn, mm: Dn, h: "час", hh: Dn, d: "день", dd: Dn, M: "месяц", MM: Dn, y: "год", yy: Dn},
            meridiemParse: /ночи|утра|дня|вечера/i,
            isPM: function (e) {
                return /^(дня|вечера)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "ночи" : e < 12 ? "утра" : e < 17 ? "дня" : "вечера"
            },
            ordinalParse: /\d{1,2}-(й|го|я)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"M":
                    case"d":
                    case"DDD":
                        return e + "-й";
                    case"D":
                        return e + "-го";
                    case"w":
                    case"W":
                        return e + "-я";
                    default:
                        return e
                }
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("si", {
            months: "ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),
            monthsShort: "ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),
            weekdays: "ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),
            weekdaysShort: "ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),
            weekdaysMin: "ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),
            longDateFormat: {LT: "a h:mm", LTS: "a h:mm:ss", L: "YYYY/MM/DD", LL: "YYYY MMMM D", LLL: "YYYY MMMM D, a h:mm", LLLL: "YYYY MMMM D [වැනි] dddd, a h:mm:ss"},
            calendar: {sameDay: "[අද] LT[ට]", nextDay: "[හෙට] LT[ට]", nextWeek: "dddd LT[ට]", lastDay: "[ඊයේ] LT[ට]", lastWeek: "[පසුගිය] dddd LT[ට]", sameElse: "L"},
            relativeTime: {
                future: "%sකින්",
                past: "%sකට පෙර",
                s: "තත්පර කිහිපය",
                m: "මිනිත්තුව",
                mm: "මිනිත්තු %d",
                h: "පැය",
                hh: "පැය %d",
                d: "දිනය",
                dd: "දින %d",
                M: "මාසය",
                MM: "මාස %d",
                y: "වසර",
                yy: "වසර %d"
            },
            ordinalParse: /\d{1,2} වැනි/,
            ordinal: function (e) {
                return e + " වැනි"
            },
            meridiem: function (e, t, i) {
                return e > 11 ? i ? "ප.ව." : "පස් වරු" : i ? "පෙ.ව." : "පෙර වරු"
            }
        }), "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")), as = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),
        ss = (ga.defineLocale("sk", {
            months: rs,
            monthsShort: as,
            monthsParse: function (e, t) {
                var i, n = [];
                for (i = 0; i < 12; i++) n[i] = new RegExp("^" + e[i] + "$|^" + t[i] + "$", "i");
                return n
            }(rs, as),
            weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
            weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
            weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[dnes o] LT", nextDay: "[zajtra o] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[v nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [o] LT";
                        case 3:
                            return "[v stredu o] LT";
                        case 4:
                            return "[vo štvrtok o] LT";
                        case 5:
                            return "[v piatok o] LT";
                        case 6:
                            return "[v sobotu o] LT"
                    }
                }, lastDay: "[včera o] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[minulú nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[minulý] dddd [o] LT";
                        case 3:
                            return "[minulú stredu o] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [o] LT";
                        case 6:
                            return "[minulú sobotu o] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "za %s", past: "pred %s", s: xn, m: xn, mm: xn, h: xn, hh: xn, d: xn, dd: xn, M: xn, MM: xn, y: xn, yy: xn},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("sl", {
            months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
            weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
            weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[danes ob] LT", nextDay: "[jutri ob] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[v] [nedeljo] [ob] LT";
                        case 3:
                            return "[v] [sredo] [ob] LT";
                        case 6:
                            return "[v] [soboto] [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[v] dddd [ob] LT"
                    }
                }, lastDay: "[včeraj ob] LT", lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[prejšnjo] [nedeljo] [ob] LT";
                        case 3:
                            return "[prejšnjo] [sredo] [ob] LT";
                        case 6:
                            return "[prejšnjo] [soboto] [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prejšnji] dddd [ob] LT"
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "čez %s", past: "pred %s", s: En, m: En, mm: En, h: En, hh: En, d: En, dd: En, M: En, MM: En, y: En, yy: En},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("sq", {
            months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),
            monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
            weekdays: "E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),
            weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
            weekdaysMin: "D_H_Ma_Më_E_P_Sh".split("_"),
            meridiemParse: /PD|MD/,
            isPM: function (e) {
                return "M" === e.charAt(0)
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "PD" : "MD"
            },
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Sot në] LT", nextDay: "[Nesër në] LT", nextWeek: "dddd [në] LT", lastDay: "[Dje në] LT", lastWeek: "dddd [e kaluar në] LT", sameElse: "L"},
            relativeTime: {
                future: "në %s",
                past: "%s më parë",
                s: "disa sekonda",
                m: "një minutë",
                mm: "%d minuta",
                h: "një orë",
                hh: "%d orë",
                d: "një ditë",
                dd: "%d ditë",
                M: "një muaj",
                MM: "%d muaj",
                y: "një vit",
                yy: "%d vite"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), {
            words: {
                m: ["један минут", "једне минуте"],
                mm: ["минут", "минуте", "минута"],
                h: ["један сат", "једног сата"],
                hh: ["сат", "сата", "сати"],
                dd: ["дан", "дана", "дана"],
                MM: ["месец", "месеца", "месеци"],
                yy: ["година", "године", "година"]
            }, correctGrammaticalCase: function (e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            }, translate: function (e, t, i) {
                var n = ss.words[i];
                return 1 === i.length ? t ? n[0] : n[1] : e + " " + ss.correctGrammaticalCase(e, n)
            }
        }), os = (ga.defineLocale("sr-cyrl", {
            months: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"],
            monthsShort: ["јан.", "феб.", "мар.", "апр.", "мај", "јун", "јул", "авг.", "сеп.", "окт.", "нов.", "дец."],
            weekdays: ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"],
            weekdaysShort: ["нед.", "пон.", "уто.", "сре.", "чет.", "пет.", "суб."],
            weekdaysMin: ["не", "по", "ут", "ср", "че", "пе", "су"],
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[данас у] LT", nextDay: "[сутра у] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[у] [недељу] [у] LT";
                        case 3:
                            return "[у] [среду] [у] LT";
                        case 6:
                            return "[у] [суботу] [у] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[у] dddd [у] LT"
                    }
                }, lastDay: "[јуче у] LT", lastWeek: function () {
                    return ["[прошле] [недеље] [у] LT", "[прошлог] [понедељка] [у] LT", "[прошлог] [уторка] [у] LT", "[прошле] [среде] [у] LT", "[прошлог] [четвртка] [у] LT", "[прошлог] [петка] [у] LT", "[прошле] [суботе] [у] LT"][this.day()]
                }, sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "пре %s",
                s: "неколико секунди",
                m: ss.translate,
                mm: ss.translate,
                h: ss.translate,
                hh: ss.translate,
                d: "дан",
                dd: ss.translate,
                M: "месец",
                MM: ss.translate,
                y: "годину",
                yy: ss.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), {
            words: {
                m: ["jedan minut", "jedne minute"],
                mm: ["minut", "minute", "minuta"],
                h: ["jedan sat", "jednog sata"],
                hh: ["sat", "sata", "sati"],
                dd: ["dan", "dana", "dana"],
                MM: ["mesec", "meseca", "meseci"],
                yy: ["godina", "godine", "godina"]
            }, correctGrammaticalCase: function (e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            }, translate: function (e, t, i) {
                var n = os.words[i];
                return 1 === i.length ? t ? n[0] : n[1] : e + " " + os.correctGrammaticalCase(e, n)
            }
        }), ls = (ga.defineLocale("sr", {
            months: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"],
            monthsShort: ["jan.", "feb.", "mar.", "apr.", "maj", "jun", "jul", "avg.", "sep.", "okt.", "nov.", "dec."],
            weekdays: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"],
            weekdaysShort: ["ned.", "pon.", "uto.", "sre.", "čet.", "pet.", "sub."],
            weekdaysMin: ["ne", "po", "ut", "sr", "če", "pe", "su"],
            longDateFormat: {LT: "H:mm", LTS: "H:mm:ss", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY H:mm", LLLL: "dddd, D. MMMM YYYY H:mm"},
            calendar: {
                sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedelju] [u] LT";
                        case 3:
                            return "[u] [sredu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                }, lastDay: "[juče u] LT", lastWeek: function () {
                    return ["[prošle] [nedelje] [u] LT", "[prošlog] [ponedeljka] [u] LT", "[prošlog] [utorka] [u] LT", "[prošle] [srede] [u] LT", "[prošlog] [četvrtka] [u] LT", "[prošlog] [petka] [u] LT", "[prošle] [subote] [u] LT"][this.day()]
                }, sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pre %s",
                s: "nekoliko sekundi",
                m: os.translate,
                mm: os.translate,
                h: os.translate,
                hh: os.translate,
                d: "dan",
                dd: os.translate,
                M: "mesec",
                MM: os.translate,
                y: "godinu",
                yy: os.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("sv", {
            months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
            weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
            weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY-MM-DD", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[Idag] LT", nextDay: "[Imorgon] LT", lastDay: "[Igår] LT", nextWeek: "[På] dddd LT", lastWeek: "[I] dddd[s] LT", sameElse: "L"},
            relativeTime: {
                future: "om %s",
                past: "för %s sedan",
                s: "några sekunder",
                m: "en minut",
                mm: "%d minuter",
                h: "en timme",
                hh: "%d timmar",
                d: "en dag",
                dd: "%d dagar",
                M: "en månad",
                MM: "%d månader",
                y: "ett år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}(e|a)/,
            ordinal: function (e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "e" : 1 === t ? "a" : 2 === t ? "a" : "e")
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("ta", {
            months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),
            weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),
            weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, HH:mm", LLLL: "dddd, D MMMM YYYY, HH:mm"},
            calendar: {sameDay: "[இன்று] LT", nextDay: "[நாளை] LT", nextWeek: "dddd, LT", lastDay: "[நேற்று] LT", lastWeek: "[கடந்த வாரம்] dddd, LT", sameElse: "L"},
            relativeTime: {
                future: "%s இல்",
                past: "%s முன்",
                s: "ஒரு சில விநாடிகள்",
                m: "ஒரு நிமிடம்",
                mm: "%d நிமிடங்கள்",
                h: "ஒரு மணி நேரம்",
                hh: "%d மணி நேரம்",
                d: "ஒரு நாள்",
                dd: "%d நாட்கள்",
                M: "ஒரு மாதம்",
                MM: "%d மாதங்கள்",
                y: "ஒரு வருடம்",
                yy: "%d ஆண்டுகள்"
            },
            ordinalParse: /\d{1,2}வது/,
            ordinal: function (e) {
                return e + "வது"
            },
            meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
            meridiem: function (e, t, i) {
                return e < 2 ? " யாமம்" : e < 6 ? " வைகறை" : e < 10 ? " காலை" : e < 14 ? " நண்பகல்" : e < 18 ? " எற்பாடு" : e < 22 ? " மாலை" : " யாமம்"
            },
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "யாமம்" === t ? e < 2 ? e : e + 12 : "வைகறை" === t || "காலை" === t ? e : "நண்பகல்" === t && e >= 10 ? e : e + 12
            },
            week: {dow: 0, doy: 6}
        }), ga.defineLocale("th", {
            months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
            monthsShort: "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
            weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
            weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),
            weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
            longDateFormat: {
                LT: "H นาฬิกา m นาที",
                LTS: "H นาฬิกา m นาที s วินาที",
                L: "YYYY/MM/DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY เวลา H นาฬิกา m นาที",
                LLLL: "วันddddที่ D MMMM YYYY เวลา H นาฬิกา m นาที"
            },
            meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
            isPM: function (e) {
                return "หลังเที่ยง" === e
            },
            meridiem: function (e, t, i) {
                return e < 12 ? "ก่อนเที่ยง" : "หลังเที่ยง"
            },
            calendar: {sameDay: "[วันนี้ เวลา] LT", nextDay: "[พรุ่งนี้ เวลา] LT", nextWeek: "dddd[หน้า เวลา] LT", lastDay: "[เมื่อวานนี้ เวลา] LT", lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT", sameElse: "L"},
            relativeTime: {
                future: "อีก %s",
                past: "%sที่แล้ว",
                s: "ไม่กี่วินาที",
                m: "1 นาที",
                mm: "%d นาที",
                h: "1 ชั่วโมง",
                hh: "%d ชั่วโมง",
                d: "1 วัน",
                dd: "%d วัน",
                M: "1 เดือน",
                MM: "%d เดือน",
                y: "1 ปี",
                yy: "%d ปี"
            }
        }), ga.defineLocale("tl-ph", {
            months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),
            monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
            weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),
            weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
            weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "MM/D/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY HH:mm", LLLL: "dddd, MMMM DD, YYYY HH:mm"},
            calendar: {sameDay: "[Ngayon sa] LT", nextDay: "[Bukas sa] LT", nextWeek: "dddd [sa] LT", lastDay: "[Kahapon sa] LT", lastWeek: "dddd [huling linggo] LT", sameElse: "L"},
            relativeTime: {
                future: "sa loob ng %s",
                past: "%s ang nakalipas",
                s: "ilang segundo",
                m: "isang minuto",
                mm: "%d minuto",
                h: "isang oras",
                hh: "%d oras",
                d: "isang araw",
                dd: "%d araw",
                M: "isang buwan",
                MM: "%d buwan",
                y: "isang taon",
                yy: "%d taon"
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function (e) {
                return e
            },
            week: {dow: 1, doy: 4}
        }), {
            1: "'inci",
            5: "'inci",
            8: "'inci",
            70: "'inci",
            80: "'inci",
            2: "'nci",
            7: "'nci",
            20: "'nci",
            50: "'nci",
            3: "'üncü",
            4: "'üncü",
            100: "'üncü",
            6: "'ncı",
            9: "'uncu",
            10: "'uncu",
            30: "'uncu",
            60: "'ıncı",
            90: "'ıncı"
        }), us = (ga.defineLocale("tr", {
            months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
            monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
            weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
            weekdaysShort: "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
            weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd, D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[bugün saat] LT", nextDay: "[yarın saat] LT", nextWeek: "[haftaya] dddd [saat] LT", lastDay: "[dün] LT", lastWeek: "[geçen hafta] dddd [saat] LT", sameElse: "L"},
            relativeTime: {
                future: "%s sonra",
                past: "%s önce",
                s: "birkaç saniye",
                m: "bir dakika",
                mm: "%d dakika",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir yıl",
                yy: "%d yıl"
            },
            ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
            ordinal: function (e) {
                if (0 === e) return e + "'ıncı";
                var t = e % 10, i = e % 100 - t, n = e >= 100 ? 100 : null;
                return e + (ls[t] || ls[i] || ls[n])
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("tzl", {
            months: "Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),
            monthsShort: "Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),
            weekdays: "Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),
            weekdaysShort: "Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),
            weekdaysMin: "Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),
            longDateFormat: {LT: "HH.mm", LTS: "LT.ss", L: "DD.MM.YYYY", LL: "D. MMMM [dallas] YYYY", LLL: "D. MMMM [dallas] YYYY LT", LLLL: "dddd, [li] D. MMMM [dallas] YYYY LT"},
            meridiem: function (e, t, i) {
                return e > 11 ? i ? "d'o" : "D'O" : i ? "d'a" : "D'A"
            },
            calendar: {sameDay: "[oxhi à] LT", nextDay: "[demà à] LT", nextWeek: "dddd [à] LT", lastDay: "[ieiri à] LT", lastWeek: "[sür el] dddd [lasteu à] LT", sameElse: "L"},
            relativeTime: {future: "osprei %s", past: "ja%s", s: Cn, m: Cn, mm: Cn, h: Cn, hh: Cn, d: Cn, dd: Cn, M: Cn, MM: Cn, y: Cn, yy: Cn},
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("tzm-latn", {
            months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[asdkh g] LT", nextDay: "[aska g] LT", nextWeek: "dddd [g] LT", lastDay: "[assant g] LT", lastWeek: "dddd [g] LT", sameElse: "L"},
            relativeTime: {
                future: "dadkh s yan %s",
                past: "yan %s",
                s: "imik",
                m: "minuḍ",
                mm: "%d minuḍ",
                h: "saɛa",
                hh: "%d tassaɛin",
                d: "ass",
                dd: "%d ossan",
                M: "ayowr",
                MM: "%d iyyirn",
                y: "asgas",
                yy: "%d isgasn"
            },
            week: {dow: 6, doy: 12}
        }), ga.defineLocale("tzm", {
            months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "dddd D MMMM YYYY HH:mm"},
            calendar: {sameDay: "[ⴰⵙⴷⵅ ⴴ] LT", nextDay: "[ⴰⵙⴽⴰ ⴴ] LT", nextWeek: "dddd [ⴴ] LT", lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT", lastWeek: "dddd [ⴴ] LT", sameElse: "L"},
            relativeTime: {
                future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
                past: "ⵢⴰⵏ %s",
                s: "ⵉⵎⵉⴽ",
                m: "ⵎⵉⵏⵓⴺ",
                mm: "%d ⵎⵉⵏⵓⴺ",
                h: "ⵙⴰⵄⴰ",
                hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
                d: "ⴰⵙⵙ",
                dd: "%d oⵙⵙⴰⵏ",
                M: "ⴰⵢoⵓⵔ",
                MM: "%d ⵉⵢⵢⵉⵔⵏ",
                y: "ⴰⵙⴳⴰⵙ",
                yy: "%d ⵉⵙⴳⴰⵙⵏ"
            },
            week: {dow: 6, doy: 12}
        }), ga.defineLocale("uk", {
            months: In,
            monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
            weekdays: jn,
            weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY р.", LLL: "D MMMM YYYY р., HH:mm", LLLL: "dddd, D MMMM YYYY р., HH:mm"},
            calendar: {
                sameDay: Wn("[Сьогодні "), nextDay: Wn("[Завтра "), lastDay: Wn("[Вчора "), nextWeek: Wn("[У] dddd ["), lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return Wn("[Минулої] dddd [").call(this);
                        case 1:
                        case 2:
                        case 4:
                            return Wn("[Минулого] dddd [").call(this)
                    }
                }, sameElse: "L"
            },
            relativeTime: {future: "за %s", past: "%s тому", s: "декілька секунд", m: Pn, mm: Pn, h: "годину", hh: Pn, d: "день", dd: Pn, M: "місяць", MM: Pn, y: "рік", yy: Pn},
            meridiemParse: /ночі|ранку|дня|вечора/,
            isPM: function (e) {
                return /^(дня|вечора)$/.test(e)
            },
            meridiem: function (e, t, i) {
                return e < 4 ? "ночі" : e < 12 ? "ранку" : e < 17 ? "дня" : "вечора"
            },
            ordinalParse: /\d{1,2}-(й|го)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"M":
                    case"d":
                    case"DDD":
                    case"w":
                    case"W":
                        return e + "-й";
                    case"D":
                        return e + "-го";
                    default:
                        return e
                }
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("uz", {
            months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
            weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
            weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
            weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
            longDateFormat: {LT: "HH:mm", LTS: "HH:mm:ss", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY HH:mm", LLLL: "D MMMM YYYY, dddd HH:mm"},
            calendar: {
                sameDay: "[Бугун соат] LT [да]",
                nextDay: "[Эртага] LT [да]",
                nextWeek: "dddd [куни соат] LT [да]",
                lastDay: "[Кеча соат] LT [да]",
                lastWeek: "[Утган] dddd [куни соат] LT [да]",
                sameElse: "L"
            },
            relativeTime: {
                future: "Якин %s ичида",
                past: "Бир неча %s олдин",
                s: "фурсат",
                m: "бир дакика",
                mm: "%d дакика",
                h: "бир соат",
                hh: "%d соат",
                d: "бир кун",
                dd: "%d кун",
                M: "бир ой",
                MM: "%d ой",
                y: "бир йил",
                yy: "%d йил"
            },
            week: {dow: 1, doy: 7}
        }), ga.defineLocale("vi", {
            months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),
            monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
            weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
            weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM [năm] YYYY",
                LLL: "D MMMM [năm] YYYY HH:mm",
                LLLL: "dddd, D MMMM [năm] YYYY HH:mm",
                l: "DD/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd, D MMM YYYY HH:mm"
            },
            calendar: {sameDay: "[Hôm nay lúc] LT", nextDay: "[Ngày mai lúc] LT", nextWeek: "dddd [tuần tới lúc] LT", lastDay: "[Hôm qua lúc] LT", lastWeek: "dddd [tuần rồi lúc] LT", sameElse: "L"},
            relativeTime: {
                future: "%s tới",
                past: "%s trước",
                s: "vài giây",
                m: "một phút",
                mm: "%d phút",
                h: "một giờ",
                hh: "%d giờ",
                d: "một ngày",
                dd: "%d ngày",
                M: "một tháng",
                MM: "%d tháng",
                y: "một năm",
                yy: "%d năm"
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function (e) {
                return e
            },
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("zh-cn", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah点mm分",
                LTS: "Ah点m分s秒",
                L: "YYYY-MM-DD",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日Ah点mm分",
                LLLL: "YYYY年MMMD日ddddAh点mm分",
                l: "YYYY-MM-DD",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日Ah点mm分",
                llll: "YYYY年MMMD日ddddAh点mm分"
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "凌晨" === t || "早上" === t || "上午" === t ? e : "下午" === t || "晚上" === t ? e + 12 : e >= 11 ? e : e + 12
            },
            meridiem: function (e, t, i) {
                var n = 100 * e + t;
                return n < 600 ? "凌晨" : n < 900 ? "早上" : n < 1130 ? "上午" : n < 1230 ? "中午" : n < 1800 ? "下午" : "晚上"
            },
            calendar: {
                sameDay: function () {
                    return 0 === this.minutes() ? "[今天]Ah[点整]" : "[今天]LT"
                }, nextDay: function () {
                    return 0 === this.minutes() ? "[明天]Ah[点整]" : "[明天]LT"
                }, lastDay: function () {
                    return 0 === this.minutes() ? "[昨天]Ah[点整]" : "[昨天]LT"
                }, nextWeek: function () {
                    var e, t;
                    return e = ga().startOf("week"), t = this.unix() - e.unix() >= 604800 ? "[下]" : "[本]", 0 === this.minutes() ? t + "dddAh点整" : t + "dddAh点mm"
                }, lastWeek: function () {
                    var e, t;
                    return e = ga().startOf("week"), t = this.unix() < e.unix() ? "[上]" : "[本]", 0 === this.minutes() ? t + "dddAh点整" : t + "dddAh点mm"
                }, sameElse: "LL"
            },
            ordinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"d":
                    case"D":
                    case"DDD":
                        return e + "日";
                    case"M":
                        return e + "月";
                    case"w":
                    case"W":
                        return e + "周";
                    default:
                        return e
                }
            },
            relativeTime: {future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年"},
            week: {dow: 1, doy: 4}
        }), ga.defineLocale("zh-tw", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah點mm分",
                LTS: "Ah點m分s秒",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日Ah點mm分",
                LLLL: "YYYY年MMMD日ddddAh點mm分",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日Ah點mm分",
                llll: "YYYY年MMMD日ddddAh點mm分"
            },
            meridiemParse: /早上|上午|中午|下午|晚上/,
            meridiemHour: function (e, t) {
                return 12 === e && (e = 0), "早上" === t || "上午" === t ? e : "中午" === t ? e >= 11 ? e : e + 12 : "下午" === t || "晚上" === t ? e + 12 : void 0
            },
            meridiem: function (e, t, i) {
                var n = 100 * e + t;
                return n < 900 ? "早上" : n < 1130 ? "上午" : n < 1230 ? "中午" : n < 1800 ? "下午" : "晚上"
            },
            calendar: {sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "[下]ddddLT", lastDay: "[昨天]LT", lastWeek: "[上]ddddLT", sameElse: "L"},
            ordinalParse: /\d{1,2}(日|月|週)/,
            ordinal: function (e, t) {
                switch (t) {
                    case"d":
                    case"D":
                    case"DDD":
                        return e + "日";
                    case"M":
                        return e + "月";
                    case"w":
                    case"W":
                        return e + "週";
                    default:
                        return e
                }
            },
            relativeTime: {future: "%s內", past: "%s前", s: "幾秒", m: "一分鐘", mm: "%d分鐘", h: "一小時", hh: "%d小時", d: "一天", dd: "%d天", M: "一個月", MM: "%d個月", y: "一年", yy: "%d年"}
        }), ga);
    return us.locale("en"), us
}), function (e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["moment"], t) : "object" == typeof exports ? module.exports = t(require("moment")) : t(e.moment)
}(this, function (e) {
    "use strict";

    function t(e) {
        return e > 96 ? e - 87 : e > 64 ? e - 29 : e - 48
    }

    function i(e) {
        var i, n = 0, r = e.split("."), a = r[0], s = r[1] || "", o = 1, l = 0, u = 1;
        for (45 === e.charCodeAt(0) && (n = 1, u = -1), n; n < a.length; n++) i = t(a.charCodeAt(n)), l = 60 * l + i;
        for (n = 0; n < s.length; n++) o /= 60, i = t(s.charCodeAt(n)), l += i * o;
        return l * u
    }

    function n(e) {
        for (var t = 0; t < e.length; t++) e[t] = i(e[t])
    }

    function r(e, t) {
        for (var i = 0; i < t; i++) e[i] = Math.round((e[i - 1] || 0) + 6e4 * e[i]);
        e[t - 1] = 1 / 0
    }

    function a(e, t) {
        var i, n = [];
        for (i = 0; i < t.length; i++) n[i] = e[t[i]];
        return n
    }

    function s(e) {
        var t = e.split("|"), i = t[2].split(" "), s = t[3].split(""), o = t[4].split(" ");
        return n(i), n(s), n(o), r(o, s.length), {name: t[0], abbrs: a(t[1].split(" "), s), offsets: a(i, s), untils: o}
    }

    function o(e) {
        e && this._set(s(e))
    }

    function l(e) {
        return (e || "").toLowerCase().replace(/\//g, "_")
    }

    function u(e) {
        var t, i, n;
        for ("string" == typeof e && (e = [e]), t = 0; t < e.length; t++) i = e[t].split("|")[0], n = l(i), v[n] = e[t], w[n] = i
    }

    function d(e, t) {
        e = l(e);
        var i, n = v[e];
        return n instanceof o ? n : "string" == typeof n ? (n = new o(n), v[e] = n, n) : k[e] && t !== d && (i = d(k[e], d)) ? (n = v[e] = new o, n._set(i), n.name = w[e], n) : null
    }

    function c() {
        var e, t = [];
        for (e in w) w.hasOwnProperty(e) && (v[e] || v[k[e]]) && w[e] && t.push(w[e]);
        return t.sort()
    }

    function m(e) {
        var t, i, n, r;
        for ("string" == typeof e && (e = [e]), t = 0; t < e.length; t++) i = e[t].split("|"), n = l(i[0]), r = l(i[1]), k[n] = r, w[n] = i[0], k[r] = n, w[r] = i[1]
    }

    function h(e) {
        u(e.zones), m(e.links), g.dataVersion = e.version
    }

    function p(e) {
        return p.didShowError || (p.didShowError = !0, _("moment.tz.zoneExists('" + e + "') has been deprecated in favor of !moment.tz.zone('" + e + "')")), !!d(e)
    }

    function f(e) {
        return !(!e._a || void 0 !== e._tzm)
    }

    function _(e) {
        "undefined" != typeof console && "function" == typeof console.error && console.error(e)
    }

    function g(t) {
        var i = Array.prototype.slice.call(arguments, 0, -1), n = arguments[arguments.length - 1], r = d(n), a = e.utc.apply(null, i);
        return r && !e.isMoment(t) && f(a) && a.add(r.parse(a), "minutes"), a.tz(n), a
    }

    function y(e) {
        return function () {
            return this._z ? this._z.abbr(this) : e.call(this)
        }
    }

    if (void 0 !== e.tz) return _("Moment Timezone " + e.tz.version + " was already loaded " + (e.tz.dataVersion ? "with data from " : "without any data") + e.tz.dataVersion), e;
    var v = {}, k = {}, w = {}, T = e.version.split("."), b = +T[0], M = +T[1];
    (b < 2 || 2 === b && M < 6) && _("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js " + e.version + ". See momentjs.com"), o.prototype = {
        _set: function (e) {
            this.name = e.name, this.abbrs = e.abbrs, this.untils = e.untils, this.offsets = e.offsets
        }, _index: function (e) {
            var t, i = +e, n = this.untils;
            for (t = 0; t < n.length; t++) if (i < n[t]) return t
        }, parse: function (e) {
            var t, i, n, r, a = +e, s = this.offsets, o = this.untils, l = o.length - 1;
            for (r = 0; r < l; r++) if (t = s[r], i = s[r + 1], n = s[r ? r - 1 : r], t < i && g.moveAmbiguousForward ? t = i : t > n && g.moveInvalidForward && (t = n), a < o[r] - 6e4 * t) return s[r];
            return s[l]
        }, abbr: function (e) {
            return this.abbrs[this._index(e)]
        }, offset: function (e) {
            return this.offsets[this._index(e)]
        }
    }, g.version = "0.4.1", g.dataVersion = "", g._zones = v, g._links = k, g._names = w, g.add = u, g.link = m, g.load = h, g.zone = d, g.zoneExists = p, g.names = c, g.Zone = o, g.unpack = s, g.unpackBase60 = i, g.needsOffset = f, g.moveInvalidForward = !0, g.moveAmbiguousForward = !1;
    var D = e.fn;
    e.tz = g, e.defaultZone = null, e.updateOffset = function (t, i) {
        var n, r = e.defaultZone;
        void 0 === t._z && (r && f(t) && !t._isUTC && (t._d = e.utc(t._a)._d, t.utc().add(r.parse(t), "minutes")), t._z = r), t._z && (n = t._z.offset(t), Math.abs(n) < 16 && (n /= 60), void 0 !== t.utcOffset ? t.utcOffset(-n, i) : t.zone(n, i))
    }, D.tz = function (t) {
        return t ? (this._z = d(t), this._z ? e.updateOffset(this) : _("Moment Timezone has no data for " + t + ". See http://momentjs.com/timezone/docs/#/data-loading/."), this) : this._z ? this._z.name : void 0
    }, D.zoneName = y(D.zoneName), D.zoneAbbr = y(D.zoneAbbr), D.utc = function (e) {
        return function () {
            return this._z = null, e.apply(this, arguments)
        }
    }(D.utc), e.tz.setDefault = function (t) {
        return (b < 2 || 2 === b && M < 9) && _("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js " + e.version + "."), e.defaultZone = t ? d(t) : null, e
    };
    var L = e.momentProperties;
    return "[object Array]" === Object.prototype.toString.call(L) ? (L.push("_z"), L.push("_a")) : L && (L._z = null), h({
        version: "2015g",
        zones: ["Africa/Abidjan|GMT|0|0|", "Africa/Addis_Ababa|EAT|-30|0|", "Africa/Algiers|CET|-10|0|", "Africa/Bangui|WAT|-10|0|", "Africa/Blantyre|CAT|-20|0|", "Africa/Cairo|EET EEST|-20 -30|010101010|1Cby0 Fb0 c10 8n0 8Nd0 gL0 e10 mn0", "Africa/Casablanca|WET WEST|0 -10|01010101010101010101010101010101010101010|1Cco0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0", "Africa/Ceuta|CET CEST|-10 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Africa/Johannesburg|SAST|-20|0|", "Africa/Tripoli|EET CET CEST|-20 -10 -20|0120|1IlA0 TA0 1o00", "Africa/Windhoek|WAST WAT|-20 -10|01010101010101010101010|1C1c0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0", "America/Adak|HST HDT|a0 90|01010101010101010101010|1BR00 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Anchorage|AKST AKDT|90 80|01010101010101010101010|1BQX0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Anguilla|AST|40|0|", "America/Araguaina|BRT BRST|30 20|010|1IdD0 Lz0", "America/Argentina/Buenos_Aires|ART|30|0|", "America/Asuncion|PYST PYT|30 40|01010101010101010101010|1C430 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0", "America/Atikokan|EST|50|0|", "America/Bahia|BRT BRST|30 20|010|1FJf0 Rb0", "America/Bahia_Banderas|MST CDT CST|70 50 60|01212121212121212121212|1C1l0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0", "America/Belem|BRT|30|0|", "America/Belize|CST|60|0|", "America/Boa_Vista|AMT|40|0|", "America/Bogota|COT|50|0|", "America/Boise|MST MDT|70 60|01010101010101010101010|1BQV0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Campo_Grande|AMST AMT|30 40|01010101010101010101010|1BIr0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10", "America/Cancun|CST CDT EST|60 50 50|010101010102|1C1k0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 Dd0", "America/Caracas|VET|4u|0|", "America/Cayenne|GFT|30|0|", "America/Cayman|EST EDT|50 40|01010101010|1Qtj0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Chicago|CST CDT|60 50|01010101010101010101010|1BQU0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Chihuahua|MST MDT|70 60|01010101010101010101010|1C1l0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0", "America/Creston|MST|70|0|", "America/Dawson|PST PDT|80 70|01010101010101010101010|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Detroit|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Eirunepe|AMT ACT|40 50|01|1KLE0", "America/Fort_Nelson|PST PDT MST|80 70 70|010101010102|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0", "America/Glace_Bay|AST ADT|40 30|01010101010101010101010|1BQS0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Godthab|WGT WGST|30 20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "America/Goose_Bay|AST ADT|40 30|01010101010101010101010|1BQQ1 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Grand_Turk|EST EDT AST|50 40 40|0101010101012|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Guayaquil|ECT|50|0|", "America/Guyana|GYT|40|0|", "America/Havana|CST CDT|50 40|01010101010101010101010|1BQR0 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0", "America/La_Paz|BOT|40|0|", "America/Lima|PET|50|0|", "America/Merida|CST CDT|60 50|01010101010101010101010|1C1k0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0", "America/Metlakatla|PST|80|0|", "America/Miquelon|PMST PMDT|30 20|01010101010101010101010|1BQR0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Montevideo|UYST UYT|20 30|010101010101|1BQQ0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0", "America/Noronha|FNT|20|0|", "America/North_Dakota/Beulah|MST MDT CST CDT|70 60 60 50|01232323232323232323232|1BQV0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Paramaribo|SRT|30|0|", "America/Port-au-Prince|EST EDT|50 40|0101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "America/Santa_Isabel|PST PDT|80 70|01010101010101010101010|1C1m0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0", "America/Santiago|CLST CLT CLT|30 40 30|010101010102|1C1f0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 1wn0", "America/Sao_Paulo|BRST BRT|20 30|01010101010101010101010|1BIq0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10", "America/Scoresbysund|EGT EGST|10 0|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "America/St_Johns|NST NDT|3u 2u|01010101010101010101010|1BQPv 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0", "Antarctica/Casey|CAST AWST|-b0 -80|0101|1BN30 40P0 KL0", "Antarctica/Davis|DAVT DAVT|-50 -70|0101|1BPw0 3Wn0 KN0", "Antarctica/DumontDUrville|DDUT|-a0|0|", "Antarctica/Macquarie|AEDT MIST|-b0 -b0|01|1C140", "Antarctica/Mawson|MAWT|-50|0|", "Antarctica/McMurdo|NZDT NZST|-d0 -c0|01010101010101010101010|1C120 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00", "Antarctica/Rothera|ROTT|30|0|", "Antarctica/Syowa|SYOT|-30|0|", "Antarctica/Troll|UTC CEST|0 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Antarctica/Vostok|VOST|-60|0|", "Asia/Aden|AST|-30|0|", "Asia/Almaty|ALMT|-60|0|", "Asia/Amman|EET EEST|-20 -30|010101010101010101010|1BVy0 1qM0 11A0 1o00 11A0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0", "Asia/Anadyr|ANAT ANAST ANAT|-c0 -c0 -b0|0120|1BWe0 1qN0 WM0", "Asia/Aqtau|AQTT|-50|0|", "Asia/Ashgabat|TMT|-50|0|", "Asia/Baku|AZT AZST|-40 -50|01010101010101010101010|1BWo0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Asia/Bangkok|ICT|-70|0|", "Asia/Beirut|EET EEST|-20 -30|01010101010101010101010|1BWm0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0", "Asia/Bishkek|KGT|-60|0|", "Asia/Brunei|BNT|-80|0|", "Asia/Calcutta|IST|-5u|0|", "Asia/Chita|YAKT YAKST YAKT IRKT|-90 -a0 -a0 -80|01023|1BWh0 1qM0 WM0 8Hz0", "Asia/Choibalsan|CHOT CHOST|-80 -90|0101010101010|1O8G0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0", "Asia/Chongqing|CST|-80|0|", "Asia/Dacca|BDT|-60|0|", "Asia/Damascus|EET EEST|-20 -30|01010101010101010101010|1C0m0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0", "Asia/Dili|TLT|-90|0|", "Asia/Dubai|GST|-40|0|", "Asia/Dushanbe|TJT|-50|0|", "Asia/Gaza|EET EEST|-20 -30|01010101010101010101010|1BVW1 SKX 1xd1 MKX 1AN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1210 1nz0 14N0 1nz0 1210 1nz0 1210 1nz0 1210 1nz0", "Asia/Hebron|EET EEST|-20 -30|0101010101010101010101010|1BVy0 Tb0 1xd1 MKX bB0 cn0 1cN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1210 1nz0 14N0 1nz0 1210 1nz0 1210 1nz0 1210 1nz0", "Asia/Hong_Kong|HKT|-80|0|", "Asia/Hovd|HOVT HOVST|-70 -80|0101010101010|1O8H0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0", "Asia/Irkutsk|IRKT IRKST IRKT|-80 -90 -90|01020|1BWi0 1qM0 WM0 8Hz0", "Asia/Istanbul|EET EEST|-20 -30|01010101010101010101010|1BWp0 1qM0 Xc0 1qo0 WM0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Asia/Jakarta|WIB|-70|0|", "Asia/Jayapura|WIT|-90|0|", "Asia/Jerusalem|IST IDT|-20 -30|01010101010101010101010|1BVA0 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0", "Asia/Kabul|AFT|-4u|0|", "Asia/Kamchatka|PETT PETST PETT|-c0 -c0 -b0|0120|1BWe0 1qN0 WM0", "Asia/Karachi|PKT|-50|0|", "Asia/Kashgar|XJT|-60|0|", "Asia/Kathmandu|NPT|-5J|0|", "Asia/Khandyga|VLAT VLAST VLAT YAKT YAKT|-a0 -b0 -b0 -a0 -90|010234|1BWg0 1qM0 WM0 17V0 7zD0", "Asia/Krasnoyarsk|KRAT KRAST KRAT|-70 -80 -80|01020|1BWj0 1qM0 WM0 8Hz0", "Asia/Kuala_Lumpur|MYT|-80|0|", "Asia/Magadan|MAGT MAGST MAGT MAGT|-b0 -c0 -c0 -a0|01023|1BWf0 1qM0 WM0 8Hz0", "Asia/Makassar|WITA|-80|0|", "Asia/Manila|PHT|-80|0|", "Asia/Nicosia|EET EEST|-20 -30|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Asia/Novokuznetsk|KRAT NOVST NOVT NOVT|-70 -70 -60 -70|01230|1BWj0 1qN0 WM0 8Hz0", "Asia/Novosibirsk|NOVT NOVST NOVT|-60 -70 -70|01020|1BWk0 1qM0 WM0 8Hz0", "Asia/Omsk|OMST OMSST OMST|-60 -70 -70|01020|1BWk0 1qM0 WM0 8Hz0", "Asia/Oral|ORAT|-50|0|", "Asia/Pyongyang|KST KST|-90 -8u|01|1P4D0", "Asia/Qyzylorda|QYZT|-60|0|", "Asia/Rangoon|MMT|-6u|0|", "Asia/Sakhalin|SAKT SAKST SAKT|-a0 -b0 -b0|01020|1BWg0 1qM0 WM0 8Hz0", "Asia/Samarkand|UZT|-50|0|", "Asia/Seoul|KST|-90|0|", "Asia/Singapore|SGT|-80|0|", "Asia/Srednekolymsk|MAGT MAGST MAGT SRET|-b0 -c0 -c0 -b0|01023|1BWf0 1qM0 WM0 8Hz0", "Asia/Tbilisi|GET|-40|0|", "Asia/Tehran|IRST IRDT|-3u -4u|01010101010101010101010|1BTUu 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0", "Asia/Thimbu|BTT|-60|0|", "Asia/Tokyo|JST|-90|0|", "Asia/Ulaanbaatar|ULAT ULAST|-80 -90|0101010101010|1O8G0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0", "Asia/Ust-Nera|MAGT MAGST MAGT VLAT VLAT|-b0 -c0 -c0 -b0 -a0|010234|1BWf0 1qM0 WM0 17V0 7zD0", "Asia/Vladivostok|VLAT VLAST VLAT|-a0 -b0 -b0|01020|1BWg0 1qM0 WM0 8Hz0", "Asia/Yakutsk|YAKT YAKST YAKT|-90 -a0 -a0|01020|1BWh0 1qM0 WM0 8Hz0", "Asia/Yekaterinburg|YEKT YEKST YEKT|-50 -60 -60|01020|1BWl0 1qM0 WM0 8Hz0", "Asia/Yerevan|AMT AMST|-40 -50|01010|1BWm0 1qM0 WM0 1qM0", "Atlantic/Azores|AZOT AZOST|10 0|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Atlantic/Canary|WET WEST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Atlantic/Cape_Verde|CVT|10|0|", "Atlantic/South_Georgia|GST|20|0|", "Atlantic/Stanley|FKST FKT|30 40|010|1C6R0 U10", "Australia/ACT|AEDT AEST|-b0 -a0|01010101010101010101010|1C140 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0", "Australia/Adelaide|ACDT ACST|-au -9u|01010101010101010101010|1C14u 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0", "Australia/Brisbane|AEST|-a0|0|", "Australia/Darwin|ACST|-9u|0|", "Australia/Eucla|ACWST|-8J|0|", "Australia/LHI|LHDT LHST|-b0 -au|01010101010101010101010|1C130 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu", "Australia/Perth|AWST|-80|0|", "Chile/EasterIsland|EASST EAST EAST|50 60 50|010101010102|1C1f0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 1wn0", "Eire|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Etc/GMT+1|GMT+1|10|0|", "Etc/GMT+10|GMT+10|a0|0|", "Etc/GMT+11|GMT+11|b0|0|", "Etc/GMT+12|GMT+12|c0|0|", "Etc/GMT+2|GMT+2|20|0|", "Etc/GMT+3|GMT+3|30|0|", "Etc/GMT+4|GMT+4|40|0|", "Etc/GMT+5|GMT+5|50|0|", "Etc/GMT+6|GMT+6|60|0|", "Etc/GMT+7|GMT+7|70|0|", "Etc/GMT+8|GMT+8|80|0|", "Etc/GMT+9|GMT+9|90|0|", "Etc/GMT-1|GMT-1|-10|0|", "Etc/GMT-10|GMT-10|-a0|0|", "Etc/GMT-11|GMT-11|-b0|0|", "Etc/GMT-12|GMT-12|-c0|0|", "Etc/GMT-13|GMT-13|-d0|0|", "Etc/GMT-14|GMT-14|-e0|0|", "Etc/GMT-2|GMT-2|-20|0|", "Etc/GMT-3|GMT-3|-30|0|", "Etc/GMT-4|GMT-4|-40|0|", "Etc/GMT-5|GMT-5|-50|0|", "Etc/GMT-6|GMT-6|-60|0|", "Etc/GMT-7|GMT-7|-70|0|", "Etc/GMT-8|GMT-8|-80|0|", "Etc/GMT-9|GMT-9|-90|0|", "Etc/UCT|UCT|0|0|", "Etc/UTC|UTC|0|0|", "Europe/Belfast|GMT BST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Europe/Chisinau|EET EEST|-20 -30|01010101010101010101010|1BWo0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "Europe/Kaliningrad|EET EEST FET|-20 -30 -30|01020|1BWo0 1qM0 WM0 8Hz0", "Europe/Minsk|EET EEST FET MSK|-20 -30 -30 -30|01023|1BWo0 1qM0 WM0 8Hy0", "Europe/Moscow|MSK MSD MSK|-30 -40 -40|01020|1BWn0 1qM0 WM0 8Hz0", "Europe/Samara|SAMT SAMST SAMT|-40 -40 -30|0120|1BWm0 1qN0 WM0", "Europe/Simferopol|EET EEST MSK MSK|-20 -30 -40 -30|01010101023|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11z0 1nW0", "HST|HST|a0|0|", "Indian/Chagos|IOT|-60|0|", "Indian/Christmas|CXT|-70|0|", "Indian/Cocos|CCT|-6u|0|", "Indian/Kerguelen|TFT|-50|0|", "Indian/Mahe|SCT|-40|0|", "Indian/Maldives|MVT|-50|0|", "Indian/Mauritius|MUT|-40|0|", "Indian/Reunion|RET|-40|0|", "Kwajalein|MHT|-c0|0|", "MET|MET MEST|-10 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00", "NZ-CHAT|CHADT CHAST|-dJ -cJ|01010101010101010101010|1C120 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00", "Pacific/Apia|SST SDT WSDT WSST|b0 a0 -e0 -d0|01012323232323232323232|1Dbn0 1ff0 1a00 CI0 AQ0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00", "Pacific/Bougainville|PGT BST|-a0 -b0|01|1NwE0", "Pacific/Chuuk|CHUT|-a0|0|", "Pacific/Efate|VUT|-b0|0|", "Pacific/Enderbury|PHOT|-d0|0|", "Pacific/Fakaofo|TKT TKT|b0 -d0|01|1Gfn0", "Pacific/Fiji|FJST FJT|-d0 -c0|01010101010101010101010|1BWe0 1o00 Rc0 1wo0 Ao0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0", "Pacific/Funafuti|TVT|-c0|0|", "Pacific/Galapagos|GALT|60|0|", "Pacific/Gambier|GAMT|90|0|", "Pacific/Guadalcanal|SBT|-b0|0|", "Pacific/Guam|ChST|-a0|0|", "Pacific/Kiritimati|LINT|-e0|0|", "Pacific/Kosrae|KOST|-b0|0|", "Pacific/Marquesas|MART|9u|0|", "Pacific/Midway|SST|b0|0|", "Pacific/Nauru|NRT|-c0|0|", "Pacific/Niue|NUT|b0|0|", "Pacific/Norfolk|NFT NFT|-bu -b0|01|1PoCu", "Pacific/Noumea|NCT|-b0|0|", "Pacific/Palau|PWT|-90|0|", "Pacific/Pohnpei|PONT|-b0|0|", "Pacific/Port_Moresby|PGT|-a0|0|", "Pacific/Rarotonga|CKT|a0|0|", "Pacific/Tahiti|TAHT|a0|0|", "Pacific/Tarawa|GILT|-c0|0|", "Pacific/Tongatapu|TOT|-d0|0|", "Pacific/Wake|WAKT|-c0|0|", "Pacific/Wallis|WFT|-c0|0|"],
        links: ["Africa/Abidjan|Africa/Accra", "Africa/Abidjan|Africa/Bamako", "Africa/Abidjan|Africa/Banjul", "Africa/Abidjan|Africa/Bissau", "Africa/Abidjan|Africa/Conakry", "Africa/Abidjan|Africa/Dakar", "Africa/Abidjan|Africa/Freetown", "Africa/Abidjan|Africa/Lome", "Africa/Abidjan|Africa/Monrovia", "Africa/Abidjan|Africa/Nouakchott", "Africa/Abidjan|Africa/Ouagadougou", "Africa/Abidjan|Africa/Sao_Tome", "Africa/Abidjan|Africa/Timbuktu", "Africa/Abidjan|America/Danmarkshavn", "Africa/Abidjan|Atlantic/Reykjavik", "Africa/Abidjan|Atlantic/St_Helena", "Africa/Abidjan|Etc/GMT", "Africa/Abidjan|Etc/GMT+0", "Africa/Abidjan|Etc/GMT-0", "Africa/Abidjan|Etc/GMT0", "Africa/Abidjan|Etc/Greenwich", "Africa/Abidjan|GMT", "Africa/Abidjan|GMT+0", "Africa/Abidjan|GMT-0", "Africa/Abidjan|GMT0", "Africa/Abidjan|Greenwich", "Africa/Abidjan|Iceland", "Africa/Addis_Ababa|Africa/Asmara", "Africa/Addis_Ababa|Africa/Asmera", "Africa/Addis_Ababa|Africa/Dar_es_Salaam", "Africa/Addis_Ababa|Africa/Djibouti", "Africa/Addis_Ababa|Africa/Juba", "Africa/Addis_Ababa|Africa/Kampala", "Africa/Addis_Ababa|Africa/Khartoum", "Africa/Addis_Ababa|Africa/Mogadishu", "Africa/Addis_Ababa|Africa/Nairobi", "Africa/Addis_Ababa|Indian/Antananarivo", "Africa/Addis_Ababa|Indian/Comoro", "Africa/Addis_Ababa|Indian/Mayotte", "Africa/Algiers|Africa/Tunis", "Africa/Bangui|Africa/Brazzaville", "Africa/Bangui|Africa/Douala", "Africa/Bangui|Africa/Kinshasa", "Africa/Bangui|Africa/Lagos", "Africa/Bangui|Africa/Libreville", "Africa/Bangui|Africa/Luanda", "Africa/Bangui|Africa/Malabo", "Africa/Bangui|Africa/Ndjamena", "Africa/Bangui|Africa/Niamey", "Africa/Bangui|Africa/Porto-Novo", "Africa/Blantyre|Africa/Bujumbura", "Africa/Blantyre|Africa/Gaborone", "Africa/Blantyre|Africa/Harare", "Africa/Blantyre|Africa/Kigali", "Africa/Blantyre|Africa/Lubumbashi", "Africa/Blantyre|Africa/Lusaka", "Africa/Blantyre|Africa/Maputo", "Africa/Cairo|Egypt", "Africa/Casablanca|Africa/El_Aaiun", "Africa/Ceuta|Arctic/Longyearbyen", "Africa/Ceuta|Atlantic/Jan_Mayen", "Africa/Ceuta|CET", "Africa/Ceuta|Europe/Amsterdam", "Africa/Ceuta|Europe/Andorra", "Africa/Ceuta|Europe/Belgrade", "Africa/Ceuta|Europe/Berlin", "Africa/Ceuta|Europe/Bratislava", "Africa/Ceuta|Europe/Brussels", "Africa/Ceuta|Europe/Budapest", "Africa/Ceuta|Europe/Busingen", "Africa/Ceuta|Europe/Copenhagen", "Africa/Ceuta|Europe/Gibraltar", "Africa/Ceuta|Europe/Ljubljana", "Africa/Ceuta|Europe/Luxembourg", "Africa/Ceuta|Europe/Madrid", "Africa/Ceuta|Europe/Malta", "Africa/Ceuta|Europe/Monaco", "Africa/Ceuta|Europe/Oslo", "Africa/Ceuta|Europe/Paris", "Africa/Ceuta|Europe/Podgorica", "Africa/Ceuta|Europe/Prague", "Africa/Ceuta|Europe/Rome", "Africa/Ceuta|Europe/San_Marino", "Africa/Ceuta|Europe/Sarajevo", "Africa/Ceuta|Europe/Skopje", "Africa/Ceuta|Europe/Stockholm", "Africa/Ceuta|Europe/Tirane", "Africa/Ceuta|Europe/Vaduz", "Africa/Ceuta|Europe/Vatican", "Africa/Ceuta|Europe/Vienna", "Africa/Ceuta|Europe/Warsaw", "Africa/Ceuta|Europe/Zagreb", "Africa/Ceuta|Europe/Zurich", "Africa/Ceuta|Poland", "Africa/Johannesburg|Africa/Maseru", "Africa/Johannesburg|Africa/Mbabane", "Africa/Tripoli|Libya", "America/Adak|America/Atka", "America/Adak|US/Aleutian", "America/Anchorage|America/Juneau", "America/Anchorage|America/Nome", "America/Anchorage|America/Sitka", "America/Anchorage|America/Yakutat", "America/Anchorage|US/Alaska", "America/Anguilla|America/Antigua", "America/Anguilla|America/Aruba", "America/Anguilla|America/Barbados", "America/Anguilla|America/Blanc-Sablon", "America/Anguilla|America/Curacao", "America/Anguilla|America/Dominica", "America/Anguilla|America/Grenada", "America/Anguilla|America/Guadeloupe", "America/Anguilla|America/Kralendijk", "America/Anguilla|America/Lower_Princes", "America/Anguilla|America/Marigot", "America/Anguilla|America/Martinique", "America/Anguilla|America/Montserrat", "America/Anguilla|America/Port_of_Spain", "America/Anguilla|America/Puerto_Rico", "America/Anguilla|America/Santo_Domingo", "America/Anguilla|America/St_Barthelemy", "America/Anguilla|America/St_Kitts", "America/Anguilla|America/St_Lucia", "America/Anguilla|America/St_Thomas", "America/Anguilla|America/St_Vincent", "America/Anguilla|America/Tortola", "America/Anguilla|America/Virgin", "America/Argentina/Buenos_Aires|America/Argentina/Catamarca", "America/Argentina/Buenos_Aires|America/Argentina/ComodRivadavia", "America/Argentina/Buenos_Aires|America/Argentina/Cordoba", "America/Argentina/Buenos_Aires|America/Argentina/Jujuy", "America/Argentina/Buenos_Aires|America/Argentina/La_Rioja", "America/Argentina/Buenos_Aires|America/Argentina/Mendoza", "America/Argentina/Buenos_Aires|America/Argentina/Rio_Gallegos", "America/Argentina/Buenos_Aires|America/Argentina/Salta", "America/Argentina/Buenos_Aires|America/Argentina/San_Juan", "America/Argentina/Buenos_Aires|America/Argentina/San_Luis", "America/Argentina/Buenos_Aires|America/Argentina/Tucuman", "America/Argentina/Buenos_Aires|America/Argentina/Ushuaia", "America/Argentina/Buenos_Aires|America/Buenos_Aires", "America/Argentina/Buenos_Aires|America/Catamarca", "America/Argentina/Buenos_Aires|America/Cordoba", "America/Argentina/Buenos_Aires|America/Jujuy", "America/Argentina/Buenos_Aires|America/Mendoza", "America/Argentina/Buenos_Aires|America/Rosario", "America/Atikokan|America/Coral_Harbour", "America/Atikokan|America/Jamaica", "America/Atikokan|America/Panama", "America/Atikokan|EST", "America/Atikokan|Jamaica", "America/Belem|America/Fortaleza", "America/Belem|America/Maceio", "America/Belem|America/Recife", "America/Belem|America/Santarem", "America/Belize|America/Costa_Rica", "America/Belize|America/El_Salvador", "America/Belize|America/Guatemala", "America/Belize|America/Managua", "America/Belize|America/Regina", "America/Belize|America/Swift_Current", "America/Belize|America/Tegucigalpa", "America/Belize|Canada/East-Saskatchewan", "America/Belize|Canada/Saskatchewan", "America/Boa_Vista|America/Manaus", "America/Boa_Vista|America/Porto_Velho", "America/Boa_Vista|Brazil/West", "America/Boise|America/Cambridge_Bay", "America/Boise|America/Denver", "America/Boise|America/Edmonton", "America/Boise|America/Inuvik", "America/Boise|America/Ojinaga", "America/Boise|America/Shiprock", "America/Boise|America/Yellowknife", "America/Boise|Canada/Mountain", "America/Boise|MST7MDT", "America/Boise|Navajo", "America/Boise|US/Mountain", "America/Campo_Grande|America/Cuiaba", "America/Chicago|America/Indiana/Knox", "America/Chicago|America/Indiana/Tell_City", "America/Chicago|America/Knox_IN", "America/Chicago|America/Matamoros", "America/Chicago|America/Menominee", "America/Chicago|America/North_Dakota/Center", "America/Chicago|America/North_Dakota/New_Salem", "America/Chicago|America/Rainy_River", "America/Chicago|America/Rankin_Inlet", "America/Chicago|America/Resolute", "America/Chicago|America/Winnipeg", "America/Chicago|CST6CDT", "America/Chicago|Canada/Central", "America/Chicago|US/Central", "America/Chicago|US/Indiana-Starke", "America/Chihuahua|America/Mazatlan", "America/Chihuahua|Mexico/BajaSur", "America/Creston|America/Dawson_Creek", "America/Creston|America/Hermosillo", "America/Creston|America/Phoenix", "America/Creston|MST", "America/Creston|US/Arizona", "America/Dawson|America/Ensenada", "America/Dawson|America/Los_Angeles", "America/Dawson|America/Tijuana", "America/Dawson|America/Vancouver", "America/Dawson|America/Whitehorse", "America/Dawson|Canada/Pacific", "America/Dawson|Canada/Yukon", "America/Dawson|Mexico/BajaNorte", "America/Dawson|PST8PDT", "America/Dawson|US/Pacific", "America/Dawson|US/Pacific-New", "America/Detroit|America/Fort_Wayne", "America/Detroit|America/Indiana/Indianapolis", "America/Detroit|America/Indiana/Marengo", "America/Detroit|America/Indiana/Petersburg", "America/Detroit|America/Indiana/Vevay", "America/Detroit|America/Indiana/Vincennes", "America/Detroit|America/Indiana/Winamac", "America/Detroit|America/Indianapolis", "America/Detroit|America/Iqaluit", "America/Detroit|America/Kentucky/Louisville", "America/Detroit|America/Kentucky/Monticello", "America/Detroit|America/Louisville", "America/Detroit|America/Montreal", "America/Detroit|America/Nassau", "America/Detroit|America/New_York", "America/Detroit|America/Nipigon", "America/Detroit|America/Pangnirtung", "America/Detroit|America/Thunder_Bay", "America/Detroit|America/Toronto", "America/Detroit|Canada/Eastern", "America/Detroit|EST5EDT", "America/Detroit|US/East-Indiana", "America/Detroit|US/Eastern", "America/Detroit|US/Michigan", "America/Eirunepe|America/Porto_Acre", "America/Eirunepe|America/Rio_Branco", "America/Eirunepe|Brazil/Acre", "America/Glace_Bay|America/Halifax", "America/Glace_Bay|America/Moncton", "America/Glace_Bay|America/Thule", "America/Glace_Bay|Atlantic/Bermuda", "America/Glace_Bay|Canada/Atlantic", "America/Havana|Cuba", "America/Merida|America/Mexico_City", "America/Merida|America/Monterrey", "America/Merida|Mexico/General", "America/Metlakatla|Pacific/Pitcairn", "America/Noronha|Brazil/DeNoronha", "America/Santiago|Antarctica/Palmer", "America/Santiago|Chile/Continental", "America/Sao_Paulo|Brazil/East", "America/St_Johns|Canada/Newfoundland", "Antarctica/McMurdo|Antarctica/South_Pole", "Antarctica/McMurdo|NZ", "Antarctica/McMurdo|Pacific/Auckland", "Asia/Aden|Asia/Baghdad", "Asia/Aden|Asia/Bahrain", "Asia/Aden|Asia/Kuwait", "Asia/Aden|Asia/Qatar", "Asia/Aden|Asia/Riyadh", "Asia/Aqtau|Asia/Aqtobe", "Asia/Ashgabat|Asia/Ashkhabad", "Asia/Bangkok|Asia/Ho_Chi_Minh", "Asia/Bangkok|Asia/Phnom_Penh", "Asia/Bangkok|Asia/Saigon", "Asia/Bangkok|Asia/Vientiane", "Asia/Calcutta|Asia/Colombo", "Asia/Calcutta|Asia/Kolkata", "Asia/Chongqing|Asia/Chungking", "Asia/Chongqing|Asia/Harbin", "Asia/Chongqing|Asia/Macao", "Asia/Chongqing|Asia/Macau", "Asia/Chongqing|Asia/Shanghai", "Asia/Chongqing|Asia/Taipei", "Asia/Chongqing|PRC", "Asia/Chongqing|ROC", "Asia/Dacca|Asia/Dhaka", "Asia/Dubai|Asia/Muscat", "Asia/Hong_Kong|Hongkong", "Asia/Istanbul|Europe/Istanbul", "Asia/Istanbul|Turkey", "Asia/Jakarta|Asia/Pontianak", "Asia/Jerusalem|Asia/Tel_Aviv", "Asia/Jerusalem|Israel", "Asia/Kashgar|Asia/Urumqi", "Asia/Kathmandu|Asia/Katmandu", "Asia/Kuala_Lumpur|Asia/Kuching", "Asia/Makassar|Asia/Ujung_Pandang", "Asia/Nicosia|EET", "Asia/Nicosia|Europe/Athens", "Asia/Nicosia|Europe/Bucharest", "Asia/Nicosia|Europe/Helsinki", "Asia/Nicosia|Europe/Kiev", "Asia/Nicosia|Europe/Mariehamn", "Asia/Nicosia|Europe/Nicosia", "Asia/Nicosia|Europe/Riga", "Asia/Nicosia|Europe/Sofia", "Asia/Nicosia|Europe/Tallinn", "Asia/Nicosia|Europe/Uzhgorod", "Asia/Nicosia|Europe/Vilnius", "Asia/Nicosia|Europe/Zaporozhye", "Asia/Samarkand|Asia/Tashkent", "Asia/Seoul|ROK", "Asia/Singapore|Singapore", "Asia/Tehran|Iran", "Asia/Thimbu|Asia/Thimphu", "Asia/Tokyo|Japan", "Asia/Ulaanbaatar|Asia/Ulan_Bator", "Atlantic/Canary|Atlantic/Faeroe", "Atlantic/Canary|Atlantic/Faroe", "Atlantic/Canary|Atlantic/Madeira", "Atlantic/Canary|Europe/Lisbon", "Atlantic/Canary|Portugal", "Atlantic/Canary|WET", "Australia/ACT|Australia/Canberra", "Australia/ACT|Australia/Currie", "Australia/ACT|Australia/Hobart", "Australia/ACT|Australia/Melbourne", "Australia/ACT|Australia/NSW", "Australia/ACT|Australia/Sydney", "Australia/ACT|Australia/Tasmania", "Australia/ACT|Australia/Victoria", "Australia/Adelaide|Australia/Broken_Hill", "Australia/Adelaide|Australia/South", "Australia/Adelaide|Australia/Yancowinna", "Australia/Brisbane|Australia/Lindeman", "Australia/Brisbane|Australia/Queensland", "Australia/Darwin|Australia/North", "Australia/LHI|Australia/Lord_Howe", "Australia/Perth|Australia/West", "Chile/EasterIsland|Pacific/Easter", "Eire|Europe/Dublin", "Etc/UCT|UCT", "Etc/UTC|Etc/Universal", "Etc/UTC|Etc/Zulu", "Etc/UTC|UTC", "Etc/UTC|Universal", "Etc/UTC|Zulu", "Europe/Belfast|Europe/Guernsey", "Europe/Belfast|Europe/Isle_of_Man", "Europe/Belfast|Europe/Jersey", "Europe/Belfast|Europe/London", "Europe/Belfast|GB", "Europe/Belfast|GB-Eire", "Europe/Chisinau|Europe/Tiraspol", "Europe/Moscow|Europe/Volgograd", "Europe/Moscow|W-SU", "HST|Pacific/Honolulu", "HST|Pacific/Johnston", "HST|US/Hawaii", "Kwajalein|Pacific/Kwajalein", "Kwajalein|Pacific/Majuro", "NZ-CHAT|Pacific/Chatham", "Pacific/Chuuk|Pacific/Truk", "Pacific/Chuuk|Pacific/Yap", "Pacific/Guam|Pacific/Saipan", "Pacific/Midway|Pacific/Pago_Pago", "Pacific/Midway|Pacific/Samoa", "Pacific/Midway|US/Samoa", "Pacific/Pohnpei|Pacific/Ponape"]
    }), e
}), angular.module("xeditable", []).value("editableOptions", {
    theme: "default",
    icon_set: "default",
    buttons: "right",
    blurElem: "cancel",
    blurForm: "ignore",
    activate: "focus",
    isDisabled: !1,
    activationEvent: "click"
}), angular.module("xeditable").directive("editableBsdate", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableBsdate", inputTpl: "<div></div>", render: function () {
            this.parent.render.call(this);
            var e = angular.element('<input type="text" class="form-control" ng-model="$data"/>'),
                t = angular.element('<button type="button" class="btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>'),
                i = angular.element('<span class="input-group-btn"></span>');
            e.attr("uib-datepicker-popup", this.attrs.eDatepickerPopupXEditable || "yyyy/MM/dd"), e.attr("is-open", this.attrs.eIsOpen), e.attr("date-disabled", this.attrs.eDateDisabled), e.attr("uib-datepicker-popup", this.attrs.eDatepickerPopup), e.attr("min-date", this.attrs.eMinDate), e.attr("max-date", this.attrs.eMaxDate), e.attr("year-range", this.attrs.eYearRange || 20), e.attr("show-button-bar", this.attrs.eShowButtonBar || !0), e.attr("current-text", this.attrs.eCurrentText || "Today"), e.attr("clear-text", this.attrs.eClearText || "Clear"), e.attr("close-text", this.attrs.eCloseText || "Done"), e.attr("close-on-date-selection", this.attrs.eCloseOnDateSelection || !0), e.attr("datepicker-append-to-body", this.attrs.eDatePickerAppendToBody || !1), e.attr("date-disabled", this.attrs.eDateDisabled), e.attr("name", this.attrs.eName), this.scope.dateOptions = {
                formatDay: this.attrs.eFormatDay || "dd",
                formatMonth: this.attrs.eFormatMonth || "MMMM",
                formatYear: this.attrs.eFormatYear || "yyyy",
                formatDayHeader: this.attrs.eFormatDayHeader || "EEE",
                formatDayTitle: this.attrs.eFormatDayTitle || "MMMM yyyy",
                formatMonthTitle: this.attrs.eFormatMonthTitle || "yyyy",
                showWeeks: !this.attrs.eShowWeeks || "true" === this.attrs.eShowWeeks.toLowerCase(),
                startingDay: this.attrs.eStartingDay || 0,
                minMode: this.attrs.eMinMode || "day",
                maxMode: this.attrs.eMaxMode || "year",
                initDate: this.attrs.eInitDate || new Date,
                datepickerMode: this.attrs.eDatepickerMode || "day"
            }, e.attr("datepicker-options", "dateOptions"), t.attr("ng-click", this.attrs.eNgClick), i.append(t), this.inputEl.prepend(e), this.inputEl.append(i), this.inputEl.removeAttr("class"), this.inputEl.removeAttr("ng-click"), this.inputEl.removeAttr("is-open"), this.inputEl.removeAttr("init-date"), this.inputEl.removeAttr("datepicker-popup"), this.inputEl.removeAttr("required"), this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("date-picker-append-to-body"), this.inputEl.removeAttr("name"), this.inputEl.attr("class", "input-group")
        }
    })
}]), angular.module("xeditable").directive("editableBstime", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableBstime", inputTpl: "<uib-timepicker></uib-timepicker>", render: function () {
            this.parent.render.call(this);
            var e = angular.element('<div class="well well-small" style="display:inline-block;"></div>');
            e.attr("ng-model", this.inputEl.attr("ng-model")), this.inputEl.removeAttr("ng-model"), this.attrs.eNgChange && (e.attr("ng-change", this.inputEl.attr("ng-change")), this.inputEl.removeAttr("ng-change")), this.inputEl.wrap(e)
        }
    })
}]), angular.module("xeditable").directive("editableCheckbox", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableCheckbox", inputTpl: '<input type="checkbox">', render: function () {
            this.parent.render.call(this), this.attrs.eTitle && (this.inputEl.wrap("<label></label>"), this.inputEl.parent().append(this.attrs.eTitle))
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                setTimeout(function () {
                    e.scope.$apply(function () {
                        e.scope.$form.$submit()
                    })
                }, 500)
            })
        }
    })
}]), angular.module("xeditable").directive("editableChecklist", ["editableDirectiveFactory", "editableNgOptionsParser", function (e, t) {
    return e({
        directiveName: "editableChecklist", inputTpl: "<span></span>", useCopy: !0, render: function () {
            this.parent.render.call(this);
            var e = t(this.attrs.eNgOptions),
                i = '<label ng-repeat="' + e.ngRepeat + '"><input type="checkbox" checklist-model="$parent.$data" checklist-value="' + e.locals.valueFn + '"><span ng-bind="' + e.locals.displayFn + '"></span></label>';
            this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.html(i)
        }
    })
}]), angular.module("xeditable").directive("editableCombodate", ["editableDirectiveFactory", "editableCombodate", function (e, t) {
    return e({
        directiveName: "editableCombodate", inputTpl: '<input type="text">', render: function () {
            this.parent.render.call(this);
            var e = {value: new Date(this.scope.$data)}, i = this;
            angular.forEach(["format", "template", "minYear", "maxYear", "yearDescending", "minuteStep", "secondStep", "firstItem", "errorClass", "customClass", "roundTime", "smartDays"], function (t) {
                var n = "e" + t.charAt(0).toUpperCase() + t.slice(1);
                n in i.attrs && (e[t] = i.attrs[n])
            });
            var n = t.getInstance(this.inputEl, e);
            n.$widget.find("select").bind("change", function (e) {
                i.scope.$data = new Date(n.getValue()).toISOString()
            })
        }
    })
}]), function () {
    var e = "text|password|email|tel|number|url|search|color|date|datetime|time|month|week|file".split("|");
    angular.forEach(e, function (e) {
        var t = "editable" + e.charAt(0).toUpperCase() + e.slice(1);
        angular.module("xeditable").directive(t, ["editableDirectiveFactory", function (i) {
            return i({directiveName: t, inputTpl: '<input type="' + e + '">'})
        }])
    }), angular.module("xeditable").directive("editableRange", ["editableDirectiveFactory", function (e) {
        return e({
            directiveName: "editableRange", inputTpl: '<input type="range" id="range" name="range">', render: function () {
                this.parent.render.call(this), this.inputEl.after("<output>{{$data}}</output>")
            }
        })
    }])
}(), angular.module("xeditable").directive("editableRadiolist", ["editableDirectiveFactory", "editableNgOptionsParser", function (e, t) {
    return e({
        directiveName: "editableRadiolist", inputTpl: "<span></span>", render: function () {
            this.parent.render.call(this);
            var e = t(this.attrs.eNgOptions),
                i = '<label ng-repeat="' + e.ngRepeat + '"><input type="radio" ng-disabled="' + this.attrs.eNgDisabled + '" ng-model="$parent.$data" value="{{' + e.locals.valueFn + '}}"><span ng-bind="' + e.locals.displayFn + '"></span></label>';
            this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.html(i)
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                setTimeout(function () {
                    e.scope.$apply(function () {
                        e.scope.$form.$submit()
                    })
                }, 500)
            })
        }
    })
}]), angular.module("xeditable").directive("editableSelect", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableSelect", inputTpl: "<select></select>", autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                e.scope.$apply(function () {
                    e.scope.$form.$submit()
                })
            })
        }
    })
}]), angular.module("xeditable").directive("editableTextarea", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableTextarea", inputTpl: "<textarea></textarea>", addListeners: function () {
            var e = this;
            e.parent.addListeners.call(e), e.single && "no" !== e.buttons && e.autosubmit()
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("keydown", function (t) {
                (t.ctrlKey || t.metaKey) && 13 === t.keyCode && e.scope.$apply(function () {
                    e.scope.$form.$submit()
                })
            })
        }
    })
}]), angular.module("xeditable").directive("editableUiSelect", ["editableDirectiveFactory", function (e) {
    var t = function (e, t) {
        var i = angular.element("<" + e + "/>");
        i.html(t.html());
        for (var n = t[0].attributes, r = 0; r < n.length; ++r) i.attr(n.item(r).nodeName, n.item(r).value);
        return i
    }, i = null, n = null, r = e({
        directiveName: "editableUiSelect", inputTpl: "<ui-select></ui-select>", render: function () {
            this.parent.render.call(this), this.inputEl.append(t("ui-select-match", i)), this.inputEl.append(t("ui-select-choices", n)), this.inputEl.removeAttr("ng-model"), this.inputEl.attr("ng-model", "$parent.$data")
        }
    }), a = r.link;
    return r.link = function (e, t, r, s) {
        var o = t.find("editable-ui-select-match"), l = t.find("editable-ui-select-choices");
        return i = o.clone(), n = l.clone(), o.remove(), l.remove(), a(e, t, r, s)
    }, r
}]), angular.module("xeditable").factory("editableController", ["$q", "editableUtils", function (e, t) {
    function i(e, i, n, r, a, s, o, l, u, d) {
        var c, m, h = this;
        h.scope = e, h.elem = n, h.attrs = i, h.inputEl = null, h.editorEl = null, h.single = !0, h.error = "", h.theme = a[o.theme] || a.default, h.parent = {}, h.icon_set = "default" === o.icon_set ? s.default[o.theme] : s.external[o.icon_set], h.inputTpl = "", h.directiveName = "", h.useCopy = !1, h.single = null, h.buttons = "right", h.init = function (t) {
            if (h.single = t, h.name = i.eName || i[h.directiveName], !i[h.directiveName]) throw"You should provide value for `" + h.directiveName + "` in editable element!";
            c = r(i[h.directiveName]), h.single ? h.buttons = h.attrs.buttons || o.buttons : h.buttons = "no", i.eName && h.scope.$watch("$data", function (e) {
                h.scope.$form.$data[i.eName] = e
            }), i.onshow && (h.onshow = function () {
                return h.catchError(r(i.onshow)(e))
            }), i.onhide && (h.onhide = function () {
                return r(i.onhide)(e)
            }), i.oncancel && (h.oncancel = function () {
                return r(i.oncancel)(e)
            }), i.onbeforesave && (h.onbeforesave = function () {
                return h.catchError(r(i.onbeforesave)(e))
            }), i.onaftersave && (h.onaftersave = function () {
                return h.catchError(r(i.onaftersave)(e))
            }), e.$parent.$watch(i[h.directiveName], function (e, t) {
                h.setLocalValue(), h.handleEmpty()
            })
        }, h.render = function () {
            var e = h.theme;
            h.inputEl = angular.element(h.inputTpl), h.controlsEl = angular.element(e.controlsTpl), h.controlsEl.append(h.inputEl), "no" !== h.buttons && (h.buttonsEl = angular.element(e.buttonsTpl), h.submitEl = angular.element(e.submitTpl), h.cancelEl = angular.element(e.cancelTpl), h.icon_set && (h.submitEl.find("span").addClass(h.icon_set.ok), h.cancelEl.find("span").addClass(h.icon_set.cancel)), h.buttonsEl.append(h.submitEl).append(h.cancelEl), h.controlsEl.append(h.buttonsEl), h.inputEl.addClass("editable-has-buttons")), h.errorEl = angular.element(e.errorTpl), h.controlsEl.append(h.errorEl), h.editorEl = angular.element(h.single ? e.formTpl : e.noformTpl), h.editorEl.append(h.controlsEl);
            for (var n in i.$attr) if (!(n.length <= 1)) {
                var r = !1, a = n.substring(1, 2);
                if ("e" === n.substring(0, 1) && a === a.toUpperCase() && "Form" !== (r = n.substring(1)) && "NgSubmit" !== r) {
                    r = r.substring(0, 1).toLowerCase() + t.camelToDash(r.substring(1));
                    var s = "value" !== r && "" === i[n] ? r : i[n];
                    h.inputEl.attr(r, s)
                }
            }
            h.inputEl.addClass("editable-input"), h.inputEl.attr("ng-model", "$data"), h.editorEl.addClass(t.camelToDash(h.directiveName)), h.single && (h.editorEl.attr("editable-form", "$form"), h.editorEl.attr("blur", h.attrs.blur || ("no" === h.buttons ? "cancel" : o.blurElem))), angular.isFunction(e.postrender) && e.postrender.call(h)
        }, h.setLocalValue = function () {
            h.scope.$data = h.useCopy ? angular.copy(c(e.$parent)) : c(e.$parent)
        }, h.show = function () {
            return h.setLocalValue(), h.render(), n.after(h.editorEl), u(h.editorEl)(e), h.addListeners(), n.addClass("editable-hide"), h.onshow()
        }, h.hide = function () {
            return h.editorEl.remove(), n.removeClass("editable-hide"), h.onhide()
        }, h.cancel = function () {
            h.oncancel()
        }, h.addListeners = function () {
            h.inputEl.bind("keyup", function (e) {
                if (h.single) switch (e.keyCode) {
                    case 27:
                        h.scope.$apply(function () {
                            h.scope.$form.$cancel()
                        })
                }
            }), h.single && "no" === h.buttons && h.autosubmit(), h.editorEl.bind("click", function (e) {
                e.which && 1 !== e.which || h.scope.$form.$visible && (h.scope.$form._clicked = !0)
            })
        }, h.setWaiting = function (e) {
            e ? (m = !h.inputEl.attr("disabled") && !h.inputEl.attr("ng-disabled") && !h.inputEl.attr("ng-enabled")) && (h.inputEl.attr("disabled", "disabled"), h.buttonsEl && h.buttonsEl.find("button").attr("disabled", "disabled")) : m && (h.inputEl.removeAttr("disabled"), h.buttonsEl && h.buttonsEl.find("button").removeAttr("disabled"))
        }, h.activate = function (e, t) {
            setTimeout(function () {
                var i = h.inputEl[0];
                "focus" === o.activate && i.focus && (e && (t = t || e, i.onfocus = function () {
                    var i = this;
                    setTimeout(function () {
                        i.setSelectionRange(e, t)
                    })
                }), i.focus()), "select" === o.activate && i.select && i.select()
            }, 0)
        }, h.setError = function (t) {
            angular.isObject(t) || (e.$error = t, h.error = t)
        }, h.catchError = function (e, t) {
            return angular.isObject(e) && !0 !== t ? d.when(e).then(angular.bind(this, function (e) {
                this.catchError(e, !0)
            }), angular.bind(this, function (e) {
                this.catchError(e, !0)
            })) : t && angular.isObject(e) && e.status && 200 !== e.status && e.data && angular.isString(e.data) ? (this.setError(e.data), e = e.data) : angular.isString(e) && this.setError(e), e
        }, h.save = function () {
            c.assign(e.$parent, h.useCopy ? angular.copy(h.scope.$data) : h.scope.$data)
        }, h.handleEmpty = function () {
            var t = c(e.$parent), i = null === t || void 0 === t || "" === t || angular.isArray(t) && 0 === t.length;
            n.toggleClass("editable-empty", i)
        }, h.autosubmit = angular.noop, h.onshow = angular.noop, h.onhide = angular.noop, h.oncancel = angular.noop, h.onbeforesave = angular.noop, h.onaftersave = angular.noop
    }

    return i.$inject = ["$scope", "$attrs", "$element", "$parse", "editableThemes", "editableIcons", "editableOptions", "$rootScope", "$compile", "$q"], i
}]), angular.module("xeditable").factory("editableDirectiveFactory", ["$parse", "$compile", "editableThemes", "$rootScope", "$document", "editableController", "editableFormController", "editableOptions", function (e, t, i, n, r, a, s, o) {
    return function (t) {
        return {
            restrict: "A", scope: !0, require: [t.directiveName, "?^form"], controller: a, link: function (i, a, l, u) {
                var d, c = u[0], m = !1;
                if (u[1]) d = u[1], m = void 0 === l.eSingle; else if (l.eForm) {
                    var h = e(l.eForm)(i);
                    if (h) d = h, m = !0; else for (var p = 0; p < r[0].forms.length; p++) if (r[0].forms[p].name === l.eForm) {
                        d = null, m = !0;
                        break
                    }
                }
                if (angular.forEach(t, function (e, t) {
                        void 0 !== c[t] && (c.parent[t] = c[t])
                    }), angular.extend(c, t), !(angular.isDefined(l.editDisabled) ? i.$eval(l.editDisabled) : o.isDisabled)) if (c.init(!m), i.$editable = c, a.addClass("editable"), m) if (d) {
                    if (i.$form = d, !i.$form.$addEditable) throw"Form with editable elements should have `editable-form` attribute.";
                    i.$form.$addEditable(c)
                } else n.$$editableBuffer = n.$$editableBuffer || {}, n.$$editableBuffer[l.eForm] = n.$$editableBuffer[l.eForm] || [], n.$$editableBuffer[l.eForm].push(c), i.$form = null; else i.$form = s(), i.$form.$addEditable(c), l.eForm && (i.$parent[l.eForm] = i.$form), l.eForm && !l.eClickable || (a.addClass("editable-click"), a.bind(o.activationEvent, function (e) {
                    e.preventDefault(), e.editable = c, i.$apply(function () {
                        i.$form.$show()
                    })
                }))
            }
        }
    }
}]), angular.module("xeditable").factory("editableFormController", ["$parse", "$document", "$rootScope", "editablePromiseCollection", "editableUtils", function (e, t, i, n, r) {
    var a = [], s = function (e, t) {
        if (t == e) return !0;
        for (var i = t.parentNode; null !== i;) {
            if (i == e) return !0;
            i = i.parentNode
        }
        return !1
    }, o = function (e, t) {
        var i = !0, n = e.$editables;
        return angular.forEach(n, function (e) {
            var n = e.editorEl[0];
            s(n, t.target) && (i = !1)
        }), i
    };
    t.bind("click", function (e) {
        if (!e.which || 1 === e.which) {
            for (var t = [], n = [], r = 0; r < a.length; r++) a[r]._clicked ? a[r]._clicked = !1 : a[r].$waiting || ("cancel" === a[r]._blur && o(a[r], e) && t.push(a[r]), "submit" === a[r]._blur && o(a[r], e) && n.push(a[r]));
            (t.length || n.length) && i.$apply(function () {
                angular.forEach(t, function (e) {
                    e.$cancel()
                }), angular.forEach(n, function (e) {
                    e.$submit()
                })
            })
        }
    }), i.$on("closeEdit", function () {
        for (var e = 0; e < a.length; e++) a[e].$hide()
    });
    var l = {
        $addEditable: function (e) {
            this.$editables.push(e), e.elem.bind("$destroy", angular.bind(this, this.$removeEditable, e)), e.scope.$form || (e.scope.$form = this), this.$visible && e.catchError(e.show()), e.catchError(e.setWaiting(this.$waiting))
        }, $removeEditable: function (e) {
            for (var t = 0; t < this.$editables.length; t++) if (this.$editables[t] === e) return void this.$editables.splice(t, 1)
        }, $show: function () {
            if (!this.$visible) {
                this.$visible = !0;
                var e = n();
                e.when(this.$onshow()), this.$setError(null, ""), angular.forEach(this.$editables, function (t) {
                    e.when(t.show())
                }), e.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: angular.bind(this, this.$activate),
                    onFalse: angular.bind(this, this.$activate),
                    onString: angular.bind(this, this.$activate)
                }), setTimeout(angular.bind(this, function () {
                    this._clicked = !1, -1 === r.indexOf(a, this) && a.push(this)
                }), 0)
            }
        }, $activate: function (e) {
            var t;
            if (this.$editables.length) {
                if (angular.isString(e)) for (t = 0; t < this.$editables.length; t++) if (this.$editables[t].name === e) return void this.$editables[t].activate();
                for (t = 0; t < this.$editables.length; t++) if (this.$editables[t].error) return void this.$editables[t].activate();
                this.$editables[0].activate(this.$editables[0].elem[0].selectionStart, this.$editables[0].elem[0].selectionEnd)
            }
        }, $hide: function () {
            this.$visible && (this.$visible = !1, this.$onhide(), angular.forEach(this.$editables, function (e) {
                e.hide()
            }), r.arrayRemove(a, this))
        }, $cancel: function () {
            this.$visible && (this.$oncancel(), angular.forEach(this.$editables, function (e) {
                e.cancel()
            }), this.$hide())
        }, $setWaiting: function (e) {
            this.$waiting = !!e, angular.forEach(this.$editables, function (t) {
                t.setWaiting(!!e)
            })
        }, $setError: function (e, t) {
            angular.forEach(this.$editables, function (i) {
                e && i.name !== e || i.setError(t)
            })
        }, $submit: function () {
            function e(e) {
                var t = n();
                t.when(this.$onbeforesave()), t.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: e ? angular.bind(this, this.$save) : angular.bind(this, this.$hide),
                    onFalse: angular.bind(this, this.$hide),
                    onString: angular.bind(this, this.$activate)
                })
            }

            if (!this.$waiting) {
                this.$setError(null, "");
                var t = n();
                angular.forEach(this.$editables, function (e) {
                    t.when(e.onbeforesave())
                }), t.then({onWait: angular.bind(this, this.$setWaiting), onTrue: angular.bind(this, e, !0), onFalse: angular.bind(this, e, !1), onString: angular.bind(this, this.$activate)})
            }
        }, $save: function () {
            angular.forEach(this.$editables, function (e) {
                e.save()
            });
            var e = n();
            e.when(this.$onaftersave()), angular.forEach(this.$editables, function (t) {
                e.when(t.onaftersave())
            }), e.then({onWait: angular.bind(this, this.$setWaiting), onTrue: angular.bind(this, this.$hide), onFalse: angular.bind(this, this.$hide), onString: angular.bind(this, this.$activate)})
        }, $onshow: angular.noop, $oncancel: angular.noop, $onhide: angular.noop, $onbeforesave: angular.noop, $onaftersave: angular.noop
    };
    return function () {
        return angular.extend({$editables: [], $visible: !1, $waiting: !1, $data: {}, _clicked: !1, _blur: null}, l)
    }
}]), angular.module("xeditable").directive("editableForm", ["$rootScope", "$parse", "editableFormController", "editableOptions", function (e, t, i, n) {
    return {
        restrict: "A", require: ["form"], compile: function () {
            return {
                pre: function (t, n, r, a) {
                    var s, o = a[0];
                    r.editableForm ? t[r.editableForm] && t[r.editableForm].$show ? (s = t[r.editableForm], angular.extend(o, s)) : (s = i(), t[r.editableForm] = s, angular.extend(s, o)) : (s = i(), angular.extend(o, s));
                    var l = e.$$editableBuffer, u = o.$name;
                    u && l && l[u] && (angular.forEach(l[u], function (e) {
                        s.$addEditable(e)
                    }), delete l[u])
                }, post: function (e, i, r, a) {
                    var s;
                    s = r.editableForm && e[r.editableForm] && e[r.editableForm].$show ? e[r.editableForm] : a[0], r.onshow && (s.$onshow = angular.bind(s, t(r.onshow), e)), r.onhide && (s.$onhide = angular.bind(s, t(r.onhide), e)), r.oncancel && (s.$oncancel = angular.bind(s, t(r.oncancel), e)), r.shown && t(r.shown)(e) && s.$show(), s._blur = r.blur || n.blurForm, r.ngSubmit || r.submit || (r.onbeforesave && (s.$onbeforesave = function () {
                        return t(r.onbeforesave)(e, {$data: s.$data})
                    }), r.onaftersave && (s.$onaftersave = function () {
                        return t(r.onaftersave)(e, {$data: s.$data})
                    }), i.bind("submit", function (t) {
                        t.preventDefault(), e.$apply(function () {
                            s.$submit()
                        })
                    })), i.bind("click", function (e) {
                        e.which && 1 !== e.which || s.$visible && (s._clicked = !0)
                    })
                }
            }
        }
    }
}]), angular.module("xeditable").factory("editablePromiseCollection", ["$q", function (e) {
    function t() {
        return {
            promises: [], hasFalse: !1, hasString: !1, when: function (t, i) {
                if (!1 === t) this.hasFalse = !0; else if (!i && angular.isObject(t)) this.promises.push(e.when(t)); else {
                    if (!angular.isString(t)) return;
                    this.hasString = !0
                }
            }, then: function (t) {
                function i() {
                    o.hasString || o.hasFalse ? !o.hasString && o.hasFalse ? r() : a() : n()
                }

                t = t || {};
                var n = t.onTrue || angular.noop, r = t.onFalse || angular.noop, a = t.onString || angular.noop, s = t.onWait || angular.noop, o = this;
                this.promises.length ? (s(!0), e.all(this.promises).then(function (e) {
                    s(!1), angular.forEach(e, function (e) {
                        o.when(e, !0)
                    }), i()
                }, function (e) {
                    s(!1), a()
                })) : i()
            }
        }
    }

    return t
}]), angular.module("xeditable").factory("editableUtils", [function () {
    return {
        indexOf: function (e, t) {
            if (e.indexOf) return e.indexOf(t);
            for (var i = 0; i < e.length; i++) if (t === e[i]) return i;
            return -1
        }, arrayRemove: function (e, t) {
            var i = this.indexOf(e, t);
            return i >= 0 && e.splice(i, 1), t
        }, camelToDash: function (e) {
            var t = /[A-Z]/g;
            return e.replace(t, function (e, t) {
                return (t ? "-" : "") + e.toLowerCase()
            })
        }, dashToCamel: function (e) {
            var t = /([\:\-\_]+(.))/g, i = /^moz([A-Z])/;
            return e.replace(t, function (e, t, i, n) {
                return n ? i.toUpperCase() : i
            }).replace(i, "Moz$1")
        }
    }
}]), angular.module("xeditable").factory("editableNgOptionsParser", [function () {
    function e(e) {
        var i
        ;
        if (!(i = e.match(t))) throw"ng-options parse error";
        var n, r = i[2] || i[1], a = i[4] || i[6], s = i[5], o = (i[3], i[2] ? i[1] : a), l = i[7], u = i[8], d = u ? i[8] : null;
        return void 0 === s ? (n = a + " in " + l, void 0 !== u && (n += " track by " + d)) : n = "(" + s + ", " + a + ") in " + l, {
            ngRepeat: n,
            locals: {valueName: a, keyName: s, valueFn: o, displayFn: r}
        }
    }

    var t = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
    return e
}]), angular.module("xeditable").factory("editableCombodate", [function () {
    function e(e, t) {
        if (this.$element = angular.element(e), "INPUT" != this.$element[0].nodeName) throw"Combodate should be applied to INPUT element";
        var i = (new Date).getFullYear();
        this.defaults = {
            format: "YYYY-MM-DD HH:mm",
            template: "D / MMM / YYYY   H : mm",
            value: null,
            minYear: 1970,
            maxYear: i,
            yearDescending: !0,
            minuteStep: 5,
            secondStep: 1,
            firstItem: "empty",
            errorClass: null,
            customClass: "",
            roundTime: !0,
            smartDays: !0
        }, this.options = angular.extend({}, this.defaults, t), this.init()
    }

    return e.prototype = {
        constructor: e, init: function () {
            if (this.map = {
                    day: ["D", "date"],
                    month: ["M", "month"],
                    year: ["Y", "year"],
                    hour: ["[Hh]", "hours"],
                    minute: ["m", "minutes"],
                    second: ["s", "seconds"],
                    ampm: ["[Aa]", ""]
                }, this.$widget = angular.element('<span class="combodate"></span>').html(this.getTemplate()), this.initCombos(), this.options.smartDays) {
                var e = this;
                this.$widget.find("select").bind("change", function (t) {
                    (angular.element(t.target).hasClass("month") || angular.element(t.target).hasClass("year")) && e.fillCombo("day")
                })
            }
            this.$widget.find("select").css("width", "auto"), this.$element.css("display", "none").after(this.$widget), this.setValue(this.$element.val() || this.options.value)
        }, getTemplate: function () {
            var e = this.options.template, t = this.options.customClass;
            return angular.forEach(this.map, function (t, i) {
                t = t[0];
                var n = new RegExp(t + "+"), r = t.length > 1 ? t.substring(1, 2) : t;
                e = e.replace(n, "{" + r + "}")
            }), e = e.replace(/ /g, "&nbsp;"), angular.forEach(this.map, function (i, n) {
                i = i[0];
                var r = i.length > 1 ? i.substring(1, 2) : i;
                e = e.replace("{" + r + "}", '<select class="' + n + " " + t + '"></select>')
            }), e
        }, initCombos: function () {
            for (var e in this.map) {
                var t = this.$widget[0].querySelectorAll("." + e);
                this["$" + e] = t.length ? angular.element(t) : null, this.fillCombo(e)
            }
        }, fillCombo: function (e) {
            var t = this["$" + e];
            if (t) {
                var i = "fill" + e.charAt(0).toUpperCase() + e.slice(1), n = this[i](), r = t.val();
                t.html("");
                for (var a = 0; a < n.length; a++) t.append('<option value="' + n[a][0] + '">' + n[a][1] + "</option>");
                t.val(r)
            }
        }, fillCommon: function (e) {
            var t, i = [];
            if ("name" === this.options.firstItem) {
                t = moment.relativeTime || moment.langData()._relativeTime;
                var n = "function" == typeof t[e] ? t[e](1, !0, e, !1) : t[e];
                n = n.split(" ").reverse()[0], i.push(["", n])
            } else "empty" === this.options.firstItem && i.push(["", ""]);
            return i
        }, fillDay: function () {
            var e, t, i = this.fillCommon("d"), n = -1 !== this.options.template.indexOf("DD"), r = 31;
            if (this.options.smartDays && this.$month && this.$year) {
                var a = parseInt(this.$month.val(), 10), s = parseInt(this.$year.val(), 10);
                isNaN(a) || isNaN(s) || (r = moment([s, a]).daysInMonth())
            }
            for (t = 1; t <= r; t++) e = n ? this.leadZero(t) : t, i.push([t, e]);
            return i
        }, fillMonth: function () {
            var e, t, i = this.fillCommon("M"), n = -1 !== this.options.template.indexOf("MMMM"), r = -1 !== this.options.template.indexOf("MMM"), a = -1 !== this.options.template.indexOf("MM");
            for (t = 0; t <= 11; t++) e = n ? moment().date(1).month(t).format("MMMM") : r ? moment().date(1).month(t).format("MMM") : a ? this.leadZero(t + 1) : t + 1, i.push([t, e]);
            return i
        }, fillYear: function () {
            var e, t, i = [], n = -1 !== this.options.template.indexOf("YYYY");
            for (t = this.options.maxYear; t >= this.options.minYear; t--) e = n ? t : (t + "").substring(2), i[this.options.yearDescending ? "push" : "unshift"]([t, e]);
            return i = this.fillCommon("y").concat(i)
        }, fillHour: function () {
            var e, t, i = this.fillCommon("h"), n = -1 !== this.options.template.indexOf("h"), r = (this.options.template.indexOf("H"), -1 !== this.options.template.toLowerCase().indexOf("hh")),
                a = n ? 1 : 0, s = n ? 12 : 23;
            for (t = a; t <= s; t++) e = r ? this.leadZero(t) : t, i.push([t, e]);
            return i
        }, fillMinute: function () {
            var e, t, i = this.fillCommon("m"), n = -1 !== this.options.template.indexOf("mm");
            for (t = 0; t <= 59; t += this.options.minuteStep) e = n ? this.leadZero(t) : t, i.push([t, e]);
            return i
        }, fillSecond: function () {
            var e, t, i = this.fillCommon("s"), n = -1 !== this.options.template.indexOf("ss");
            for (t = 0; t <= 59; t += this.options.secondStep) e = n ? this.leadZero(t) : t, i.push([t, e]);
            return i
        }, fillAmpm: function () {
            var e = -1 !== this.options.template.indexOf("a");
            this.options.template.indexOf("A");
            return [["am", e ? "am" : "AM"], ["pm", e ? "pm" : "PM"]]
        }, getValue: function (e) {
            var t, i = {}, n = this, r = !1;
            return angular.forEach(this.map, function (e, t) {
                if ("ampm" !== t) {
                    var a = "day" === t ? 1 : 0;
                    return i[t] = n["$" + t] ? parseInt(n["$" + t].val(), 10) : a, isNaN(i[t]) ? (r = !0, !1) : void 0
                }
            }), r ? "" : (this.$ampm && (12 === i.hour ? i.hour = "am" === this.$ampm.val() ? 0 : 12 : i.hour = "am" === this.$ampm.val() ? i.hour : i.hour + 12), t = moment([i.year, i.month, i.day, i.hour, i.minute, i.second]), this.highlight(t), e = void 0 === e ? this.options.format : e, null === e ? t.isValid() ? t : null : t.isValid() ? t.format(e) : "")
        }, setValue: function (e) {
            function t(e, t) {
                var i = {};
                return angular.forEach(e.children("option"), function (e, n) {
                    var r = angular.element(e).attr("value");
                    if ("" !== r) {
                        var a = Math.abs(r - t);
                        (void 0 === i.distance || a < i.distance) && (i = {value: r, distance: a})
                    }
                }), i.value
            }

            if (e) {
                var i = "string" == typeof e ? moment(e, this.options.format, !0) : moment(e), n = this, r = {};
                i.isValid() && (angular.forEach(this.map, function (e, t) {
                    "ampm" !== t && (r[t] = i[e[1]]())
                }), this.$ampm && (r.hour >= 12 ? (r.ampm = "pm", r.hour > 12 && (r.hour -= 12)) : (r.ampm = "am", 0 === r.hour && (r.hour = 12))), angular.forEach(r, function (e, i) {
                    n["$" + i] && ("minute" === i && n.options.minuteStep > 1 && n.options.roundTime && (e = t(n["$" + i], e)), "second" === i && n.options.secondStep > 1 && n.options.roundTime && (e = t(n["$" + i], e)), n["$" + i].val(e))
                }), this.options.smartDays && this.fillCombo("day"), this.$element.val(i.format(this.options.format)).triggerHandler("change"))
            }
        }, highlight: function (e) {
            e.isValid() ? this.options.errorClass ? this.$widget.removeClass(this.options.errorClass) : this.$widget.find("select").css("border-color", this.borderColor) : this.options.errorClass ? this.$widget.addClass(this.options.errorClass) : (this.borderColor || (this.borderColor = this.$widget.find("select").css("border-color")), this.$widget.find("select").css("border-color", "red"))
        }, leadZero: function (e) {
            return e <= 9 ? "0" + e : e
        }, destroy: function () {
            this.$widget.remove(), this.$element.removeData("combodate").show()
        }
    }, {
        getInstance: function (t, i) {
            return new e(t, i)
        }
    }
}]), angular.module("xeditable").factory("editableIcons", function () {
    return {
        default: {bs2: {ok: "icon-ok icon-white", cancel: "icon-remove"}, bs3: {ok: "glyphicon glyphicon-ok", cancel: "glyphicon glyphicon-remove"}},
        external: {"font-awesome": {ok: "fa fa-check", cancel: "fa fa-times"}}
    }
}), angular.module("xeditable").factory("editableThemes", function () {
    return {
        default: {
            formTpl: '<form class="editable-wrap"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<span class="editable-controls"></span>',
            inputTpl: "",
            errorTpl: '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit">save</button>',
            cancelTpl: '<button type="button" ng-click="$form.$cancel()">cancel</button>'
        },
        bs2: {
            formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
            inputTpl: "",
            errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit" class="btn btn-primary"><span></span></button>',
            cancelTpl: '<button type="button" class="btn" ng-click="$form.$cancel()"><span></span></button>'
        },
        bs3: {
            formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
            inputTpl: "",
            errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit" class="btn btn-primary"><span></span></button>',
            cancelTpl: '<button type="button" class="btn btn-default" ng-click="$form.$cancel()"><span></span></button>',
            buttonsClass: "",
            inputClass: "",
            postrender: function () {
                switch (this.directiveName) {
                    case"editableText":
                    case"editableSelect":
                    case"editableTextarea":
                    case"editableEmail":
                    case"editableTel":
                    case"editableNumber":
                    case"editableUrl":
                    case"editableSearch":
                    case"editableDate":
                    case"editableDatetime":
                    case"editableBsdate":
                    case"editableTime":
                    case"editableMonth":
                    case"editableWeek":
                    case"editablePassword":
                        if (this.inputEl.addClass("form-control"), this.theme.inputClass) {
                            if (this.inputEl.attr("multiple") && ("input-sm" === this.theme.inputClass || "input-lg" === this.theme.inputClass)) break;
                            this.inputEl.addClass(this.theme.inputClass)
                        }
                        break;
                    case"editableCheckbox":
                        this.editorEl.addClass("checkbox")
                }
                this.buttonsEl && this.theme.buttonsClass && this.buttonsEl.find("button").addClass(this.theme.buttonsClass)
            }
        },
        semantic: {
            formTpl: '<form class="editable-wrap ui form" ng-class="{\'error\': $error}" role="form"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls ui fluid input" ng-class="{\'error\': $error}"></div>',
            inputTpl: "",
            errorTpl: '<div class="editable-error ui error message" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="mini ui buttons"></span>',
            submitTpl: '<button type="submit" class="ui primary button"><i class="ui check icon"></i></button>',
            cancelTpl: '<button type="button" class="ui button" ng-click="$form.$cancel()"><i class="ui cancel icon"></i></button>'
        }
    }
}), function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.JSZip = e()
    }
}(function () {
    var e;
    return function e(t, i, n) {
        function r(s, o) {
            if (!i[s]) {
                if (!t[s]) {
                    var l = "function" == typeof require && require;
                    if (!o && l) return l(s, !0);
                    if (a) return a(s, !0);
                    var u = new Error("Cannot find module '" + s + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var d = i[s] = {exports: {}};
                t[s][0].call(d.exports, function (e) {
                    var i = t[s][1][e];
                    return r(i || e)
                }, d, d.exports, e, t, i, n)
            }
            return i[s].exports
        }

        for (var a = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
        return r
    }({
        1: [function (e, t, i) {
            "use strict";
            var n = e("./utils"), r = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            i.encode = function (e) {
                for (var t, i, r, s, o, l, u, d = [], c = 0, m = e.length, h = m, p = "string" !== n.getTypeOf(e); c < e.length;) h = m - c, p ? (t = e[c++], i = c < m ? e[c++] : 0, r = c < m ? e[c++] : 0) : (t = e.charCodeAt(c++), i = c < m ? e.charCodeAt(c++) : 0, r = c < m ? e.charCodeAt(c++) : 0), s = t >> 2, o = (3 & t) << 4 | i >> 4, l = h > 1 ? (15 & i) << 2 | r >> 6 : 64, u = h > 2 ? 63 & r : 64, d.push(a.charAt(s) + a.charAt(o) + a.charAt(l) + a.charAt(u));
                return d.join("")
            }, i.decode = function (e) {
                var t, i, n, s, o, l, u, d = 0, c = 0;
                e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                var m = 3 * e.length / 4;
                e.charAt(e.length - 1) === a.charAt(64) && m--, e.charAt(e.length - 2) === a.charAt(64) && m--;
                var h;
                for (h = r.uint8array ? new Uint8Array(m) : new Array(m); d < e.length;) s = a.indexOf(e.charAt(d++)), o = a.indexOf(e.charAt(d++)), l = a.indexOf(e.charAt(d++)), u = a.indexOf(e.charAt(d++)), t = s << 2 | o >> 4, i = (15 & o) << 4 | l >> 2, n = (3 & l) << 6 | u, h[c++] = t, 64 !== l && (h[c++] = i), 64 !== u && (h[c++] = n);
                return h
            }
        }, {"./support": 27, "./utils": 29}], 2: [function (e, t, i) {
            "use strict";

            function n(e, t, i, n, r) {
                this.compressedSize = e, this.uncompressedSize = t, this.crc32 = i, this.compression = n, this.compressedContent = r
            }

            var r = e("./external"), a = e("./stream/DataWorker"), s = e("./stream/DataLengthProbe"), o = e("./stream/Crc32Probe"), s = e("./stream/DataLengthProbe");
            n.prototype = {
                getContentWorker: function () {
                    var e = new a(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")), t = this;
                    return e.on("end", function () {
                        if (this.streamInfo.data_length !== t.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch")
                    }), e
                }, getCompressedWorker: function () {
                    return new a(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression)
                }
            }, n.createWorkerFrom = function (e, t, i) {
                return e.pipe(new o).pipe(new s("uncompressedSize")).pipe(t.compressWorker(i)).pipe(new s("compressedSize")).withStreamInfo("compression", t)
            }, t.exports = n
        }, {"./external": 6, "./stream/Crc32Probe": 22, "./stream/DataLengthProbe": 23, "./stream/DataWorker": 24}], 3: [function (e, t, i) {
            "use strict";
            var n = e("./stream/GenericWorker");
            i.STORE = {
                magic: "\0\0", compressWorker: function (e) {
                    return new n("STORE compression")
                }, uncompressWorker: function () {
                    return new n("STORE decompression")
                }
            }, i.DEFLATE = e("./flate")
        }, {"./flate": 7, "./stream/GenericWorker": 25}], 4: [function (e, t, i) {
            "use strict";

            function n(e, t, i, n) {
                var r = s, a = n + i;
                e ^= -1;
                for (var o = n; o < a; o++) e = e >>> 8 ^ r[255 & (e ^ t[o])];
                return -1 ^ e
            }

            function r(e, t, i, n) {
                var r = s, a = n + i;
                e ^= -1;
                for (var o = n; o < a; o++) e = e >>> 8 ^ r[255 & (e ^ t.charCodeAt(o))];
                return -1 ^ e
            }

            var a = e("./utils"), s = function () {
                for (var e, t = [], i = 0; i < 256; i++) {
                    e = i;
                    for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                    t[i] = e
                }
                return t
            }();
            t.exports = function (e, t) {
                return void 0 !== e && e.length ? "string" !== a.getTypeOf(e) ? n(0 | t, e, e.length, 0) : r(0 | t, e, e.length, 0) : 0
            }
        }, {"./utils": 29}], 5: [function (e, t, i) {
            "use strict";
            i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null
        }, {}], 6: [function (e, t, i) {
            "use strict";
            var n = e("es6-promise").Promise;
            t.exports = {Promise: n}
        }, {"es6-promise": 37}], 7: [function (e, t, i) {
            "use strict";

            function n(e, t) {
                o.call(this, "FlateWorker/" + e), this._pako = new a[e]({raw: !0, level: t.level || -1}), this.meta = {};
                var i = this;
                this._pako.onData = function (e) {
                    i.push({data: e, meta: i.meta})
                }
            }

            var r = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, a = e("pako"), s = e("./utils"), o = e("./stream/GenericWorker"),
                l = r ? "uint8array" : "array";
            i.magic = "\b\0", s.inherits(n, o), n.prototype.processChunk = function (e) {
                this.meta = e.meta, this._pako.push(s.transformTo(l, e.data), !1)
            }, n.prototype.flush = function () {
                o.prototype.flush.call(this), this._pako.push([], !0)
            }, n.prototype.cleanUp = function () {
                o.prototype.cleanUp.call(this), this._pako = null
            }, i.compressWorker = function (e) {
                return new n("Deflate", e)
            }, i.uncompressWorker = function () {
                return new n("Inflate", {})
            }
        }, {"./stream/GenericWorker": 25, "./utils": 29, pako: 38}], 8: [function (e, t, i) {
            "use strict";

            function n(e, t, i, n) {
                a.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t, this.zipPlatform = i, this.encodeFileName = n, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = []
            }

            var r = e("../utils"), a = e("../stream/GenericWorker"), s = e("../utf8"), o = e("../crc32"), l = e("../signature"), u = function (e, t) {
                var i, n = "";
                for (i = 0; i < t; i++) n += String.fromCharCode(255 & e), e >>>= 8;
                return n
            }, d = function (e, t) {
                var i = e;
                return e || (i = t ? 16893 : 33204), (65535 & i) << 16
            }, c = function (e, t) {
                return 63 & (e || 0)
            }, m = function (e, t, i, n, a, m) {
                var h, p, f = e.file, _ = e.compression, g = m !== s.utf8encode, y = r.transformTo("string", m(f.name)), v = r.transformTo("string", s.utf8encode(f.name)), k = f.comment,
                    w = r.transformTo("string", m(k)), T = r.transformTo("string", s.utf8encode(k)), b = v.length !== f.name.length, M = T.length !== k.length, D = "", L = "", A = "", S = f.dir,
                    Y = f.date, x = {crc32: 0, compressedSize: 0, uncompressedSize: 0};
                t && !i || (x.crc32 = e.crc32, x.compressedSize = e.compressedSize, x.uncompressedSize = e.uncompressedSize);
                var E = 0;
                t && (E |= 8), g || !b && !M || (E |= 2048);
                var C = 0, O = 0;
                S && (C |= 16), "UNIX" === a ? (O = 798, C |= d(f.unixPermissions, S)) : (O = 20, C |= c(f.dosPermissions)), h = Y.getUTCHours(), h <<= 6, h |= Y.getUTCMinutes(), h <<= 5, h |= Y.getUTCSeconds() / 2, p = Y.getUTCFullYear() - 1980, p <<= 4, p |= Y.getUTCMonth() + 1, p <<= 5, p |= Y.getUTCDate(), b && (L = u(1, 1) + u(o(y), 4) + v, D += "up" + u(L.length, 2) + L), M && (A = u(1, 1) + u(o(w), 4) + T, D += "uc" + u(A.length, 2) + A);
                var P = "";
                return P += "\n\0", P += u(E, 2), P += _.magic, P += u(h, 2), P += u(p, 2), P += u(x.crc32, 4), P += u(x.compressedSize, 4), P += u(x.uncompressedSize, 4), P += u(y.length, 2), P += u(D.length, 2), {
                    fileRecord: l.LOCAL_FILE_HEADER + P + y + D,
                    dirRecord: l.CENTRAL_FILE_HEADER + u(O, 2) + P + u(w.length, 2) + "\0\0\0\0" + u(C, 4) + u(n, 4) + y + D + w
                }
            }, h = function (e, t, i, n, a) {
                var s = r.transformTo("string", a(n));
                return l.CENTRAL_DIRECTORY_END + "\0\0\0\0" + u(e, 2) + u(e, 2) + u(t, 4) + u(i, 4) + u(s.length, 2) + s
            }, p = function (e) {
                return l.DATA_DESCRIPTOR + u(e.crc32, 4) + u(e.compressedSize, 4) + u(e.uncompressedSize, 4)
            };
            r.inherits(n, a), n.prototype.push = function (e) {
                var t = e.meta.percent || 0, i = this.entriesCount, n = this._sources.length;
                this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, a.prototype.push.call(this, {
                    data: e.data,
                    meta: {currentFile: this.currentFile, percent: i ? (t + 100 * (i - n - 1)) / i : 100}
                }))
            }, n.prototype.openedSource = function (e) {
                if (this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name, this.streamFiles && !e.file.dir) {
                    var t = m(e, this.streamFiles, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                    this.push({data: t.fileRecord, meta: {percent: 0}})
                } else this.accumulate = !0
            }, n.prototype.closedSource = function (e) {
                this.accumulate = !1;
                var t = m(e, this.streamFiles, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                if (this.dirRecords.push(t.dirRecord), this.streamFiles && !e.file.dir) this.push({data: p(e), meta: {percent: 100}}); else for (this.push({
                    data: t.fileRecord,
                    meta: {percent: 0}
                }); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
                this.currentFile = null
            }, n.prototype.flush = function () {
                for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) this.push({data: this.dirRecords[t], meta: {percent: 100}});
                var i = this.bytesWritten - e, n = h(this.dirRecords.length, i, e, this.zipComment, this.encodeFileName);
                this.push({data: n, meta: {percent: 100}})
            }, n.prototype.prepareNextSource = function () {
                this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume()
            }, n.prototype.registerPrevious = function (e) {
                this._sources.push(e);
                var t = this;
                return e.on("data", function (e) {
                    t.processChunk(e)
                }), e.on("end", function () {
                    t.closedSource(t.previous.streamInfo), t._sources.length ? t.prepareNextSource() : t.end()
                }), e.on("error", function (e) {
                    t.error(e)
                }), this
            }, n.prototype.resume = function () {
                return !!a.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0))
            }, n.prototype.error = function (e) {
                var t = this._sources;
                if (!a.prototype.error.call(this, e)) return !1;
                for (var i = 0; i < t.length; i++) try {
                    t[i].error(e)
                } catch (e) {
                }
                return !0
            }, n.prototype.lock = function () {
                a.prototype.lock.call(this);
                for (var e = this._sources, t = 0; t < e.length; t++) e[t].lock()
            }, t.exports = n
        }, {"../crc32": 4, "../signature": 20, "../stream/GenericWorker": 25, "../utf8": 28, "../utils": 29}], 9: [function (e, t, i) {
            "use strict";
            var n = e("../compressions"), r = e("./ZipFileWorker"), a = function (e, t) {
                var i = e || t, r = n[i];
                if (!r) throw new Error(i + " is not a valid compression method !");
                return r
            };
            i.generateWorker = function (e, t, i) {
                var n = new r(t.streamFiles, i, t.platform, t.encodeFileName), s = 0;
                try {
                    e.forEach(function (e, i) {
                        s++;
                        var r = a(i.options.compression, t.compression), o = i.options.compressionOptions || t.compressionOptions || {}, l = i.dir, u = i.date;
                        i._compressWorker(r, o).withStreamInfo("file", {
                            name: e,
                            dir: l,
                            date: u,
                            comment: i.comment || "",
                            unixPermissions: i.unixPermissions,
                            dosPermissions: i.dosPermissions
                        }).pipe(n)
                    }), n.entriesCount = s
                } catch (e) {
                    n.error(e)
                }
                return n
            }
        }, {"../compressions": 3, "./ZipFileWorker": 8}], 10: [function (e, t, i) {
            "use strict";

            function n() {
                if (!(this instanceof n)) return new n;
                if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                this.files = {}, this.comment = null, this.root = "", this.clone = function () {
                    var e = new n;
                    for (var t in this) "function" != typeof this[t] && (e[t] = this[t]);
                    return e
                }
            }

            n.prototype = e("./object"), n.prototype.loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.loadAsync = function (e, t) {
                return (new n).loadAsync(e, t)
            }, n.external = e("./external"), t.exports = n
        }, {"./defaults": 5, "./external": 6, "./load": 11, "./object": 13, "./support": 27}], 11: [function (e, t, i) {
            "use strict";

            function n(e) {
                return new a.Promise(function (t, i) {
                    var n = e.decompressed.getContentWorker().pipe(new l);
                    n.on("error", function (e) {
                        i(e)
                    }).on("end", function () {
                        n.streamInfo.crc32 !== e.decompressed.crc32 ? i(new Error("Corrupted zip : CRC32 mismatch")) : t()
                    }).resume()
                })
            }

            var r = e("./utils"), a = e("./external"), s = e("./utf8"), r = e("./utils"), o = e("./zipEntries"), l = e("./stream/Crc32Probe"), u = e("./nodejsUtils");
            t.exports = function (e, t) {
                var i = this;
                return t = r.extend(t || {}, {
                    base64: !1,
                    checkCRC32: !1,
                    optimizedBinaryString: !1,
                    createFolders: !1,
                    decodeFileName: s.utf8decode
                }), u.isNode && u.isStream(e) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", e, !0, t.optimizedBinaryString, t.base64).then(function (e) {
                    var i = new o(t);
                    return i.load(e), i
                }).then(function (e) {
                    var i = [a.Promise.resolve(e)], r = e.files;
                    if (t.checkCRC32) for (var s = 0; s < r.length; s++) i.push(n(r[s]));
                    return a.Promise.all(i)
                }).then(function (e) {
                    for (var n = e.shift(), r = n.files, a = 0; a < r.length; a++) {
                        var s = r[a];
                        i.file(s.fileNameStr, s.decompressed, {
                            binary: !0,
                            optimizedBinaryString: !0,
                            date: s.date,
                            dir: s.dir,
                            comment: s.fileCommentStr.length ? s.fileCommentStr : null,
                            unixPermissions: s.unixPermissions,
                            dosPermissions: s.dosPermissions,
                            createFolders: t.createFolders
                        })
                    }
                    return n.zipComment.length && (i.comment = n.zipComment), i
                })
            }
        }, {"./external": 6, "./nodejsUtils": 12, "./stream/Crc32Probe": 22, "./utf8": 28, "./utils": 29, "./zipEntries": 30}], 12: [function (e, t, i) {
            (function (e) {
                "use strict";
                t.exports = {
                    isNode: void 0 !== e, newBuffer: function (t, i) {
                        return new e(t, i)
                    }, isBuffer: function (t) {
                        return e.isBuffer(t)
                    }, isStream: function (e) {
                        return e && "function" == typeof e.on && "function" == typeof e.pause && "function" == typeof e.resume
                    }
                }
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0)
        }, {}], 13: [function (e, t, i) {
            "use strict";

            function n(e) {
                return "[object RegExp]" === Object.prototype.toString.call(e)
            }

            var r = e("./utf8"), a = e("./utils"), s = e("./stream/GenericWorker"), o = e("./stream/StreamHelper"), l = e("./defaults"), u = e("./compressedObject"), d = e("./zipObject"),
                c = e("./generate"), m = e("./nodejsUtils"), h = e("./nodejs/NodejsStreamInputAdapter"), p = function (e, t, i) {
                    var n, r = a.getTypeOf(t);
                    i = a.extend(i || {}, l), i.date = i.date || new Date, null !== i.compression && (i.compression = i.compression.toUpperCase()), "string" == typeof i.unixPermissions && (i.unixPermissions = parseInt(i.unixPermissions, 8)), i.unixPermissions && 16384 & i.unixPermissions && (i.dir = !0), i.dosPermissions && 16 & i.dosPermissions && (i.dir = !0), i.dir && (e = _(e)), i.createFolders && (n = f(e)) && g.call(this, n, !0);
                    var o = "string" === r && !1 === i.binary && !1 === i.base64;
                    i.binary = !o, (t instanceof u && 0 === t.uncompressedSize || i.dir || !t || 0 === t.length) && (i.base64 = !1, i.binary = !0, t = "", i.compression = "STORE", r = "string");
                    var c = null;
                    c = t instanceof u || t instanceof s ? t : m.isNode && m.isStream(t) ? new h(e, t) : a.prepareContent(e, t, i.binary, i.optimizedBinaryString, i.base64);
                    var p = new d(e, c, i);
                    this.files[e] = p
                }, f = function (e) {
                    "/" === e.slice(-1) && (e = e.substring(0, e.length - 1));
                    var t = e.lastIndexOf("/");
                    return t > 0 ? e.substring(0, t) : ""
                }, _ = function (e) {
                    return "/" !== e.slice(-1) && (e += "/"), e
                }, g = function (e, t) {
                    return t = void 0 !== t ? t : l.createFolders, e = _(e), this.files[e] || p.call(this, e, null, {dir: !0, createFolders: t}), this.files[e]
                }, y = {
                    load: function () {
                        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                    }, forEach: function (e) {
                        var t, i, n;
                        for (t in this.files) this.files.hasOwnProperty(t) && (n = this.files[t], (i = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(i, n))
                    }, filter: function (e) {
                        var t = [];
                        return this.forEach(function (i, n) {
                            e(i, n) && t.push(n)
                        }), t
                    }, file: function (e, t, i) {
                        if (1 === arguments.length) {
                            if (n(e)) {
                                var r = e;
                                return this.filter(function (e, t) {
                                    return !t.dir && r.test(e)
                                })
                            }
                            var a = this.files[this.root + e];
                            return a && !a.dir ? a : null
                        }
                        return e = this.root + e, p.call(this, e, t, i), this
                    }, folder: function (e) {
                        if (!e) return this;
                        if (n(e)) return this.filter(function (t, i) {
                            return i.dir && e.test(t)
                        });
                        var t = this.root + e, i = g.call(this, t), r = this.clone();
                        return r.root = i.name, r
                    }, remove: function (e) {
                        e = this.root + e;
                        var t = this.files[e];
                        if (t || ("/" !== e.slice(-1) && (e += "/"), t = this.files[e]), t && !t.dir) delete this.files[e]; else for (var i = this.filter(function (t, i) {
                            return i.name.slice(0, e.length) === e
                        }), n = 0; n < i.length; n++) delete this.files[i[n].name];
                        return this
                    }, generate: function (e) {
                        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                    }, generateInternalStream: function (e) {
                        var t, i = {};
                        try {
                            if (i = a.extend(e || {}, {
                                    streamFiles: !1,
                                    compression: "STORE",
                                    compressionOptions: null,
                                    type: "",
                                    platform: "DOS",
                                    comment: null,
                                    mimeType: "application/zip",
                                    encodeFileName: r.utf8encode
                                }), i.type = i.type.toLowerCase(), i.compression = i.compression.toUpperCase(), "binarystring" === i.type && (i.type = "string"), !i.type) throw new Error("No output type specified.");
                            a.checkSupport(i.type), "darwin" !== e.platform && "freebsd" !== e.platform && "linux" !== e.platform && "sunos" !== e.platform || (e.platform = "UNIX"), "win32" === e.platform && (e.platform = "DOS");
                            var n = i.comment || this.comment || "";
                            t = c.generateWorker(this, i, n)
                        } catch (e) {
                            t = new s("error"), t.error(e)
                        }
                        return new o(t, i.type || "string", i.mimeType)
                    }, generateAsync: function (e, t) {
                        return this.generateInternalStream(e).accumulate(t)
                    }, generateNodeStream: function (e, t) {
                        return e = e || {}, e.type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(t)
                    }
                };
            t.exports = y
        }, {
            "./compressedObject": 2,
            "./defaults": 5,
            "./generate": 9,
            "./nodejs/NodejsStreamInputAdapter": 35,
            "./nodejsUtils": 12,
            "./stream/GenericWorker": 25,
            "./stream/StreamHelper": 26,
            "./utf8": 28,
            "./utils": 29,
            "./zipObject": 32
        }], 14: [function (e, t, i) {
            "use strict";

            function n(e) {
                r.call(this, e);
                for (var t = 0; t < this.data.length; t++) e[t] = 255 & e[t]
            }

            var r = e("./DataReader");
            e("../utils").inherits(n, r), n.prototype.byteAt = function (e) {
                return this.data[this.zero + e]
            }, n.prototype.lastIndexOfSignature = function (e) {
                for (var t = e.charCodeAt(0), i = e.charCodeAt(1), n = e.charCodeAt(2), r = e.charCodeAt(3), a = this.length - 4; a >= 0; --a) if (this.data[a] === t && this.data[a + 1] === i && this.data[a + 2] === n && this.data[a + 3] === r) return a - this.zero;
                return -1
            }, n.prototype.readAndCheckSignature = function (e) {
                var t = e.charCodeAt(0), i = e.charCodeAt(1), n = e.charCodeAt(2), r = e.charCodeAt(3), a = this.readData(4);
                return t === a[0] && i === a[1] && n === a[2] && r === a[3]
            }, n.prototype.readData = function (e) {
                if (this.checkOffset(e), 0 === e) return [];
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t
            }, t.exports = n
        }, {"../utils": 29, "./DataReader": 15}], 15: [function (e, t, i) {
            "use strict";

            function n(e) {
                this.data = e, this.length = e.length, this.index = 0, this.zero = 0
            }

            var r = e("../utils");
            n.prototype = {
                checkOffset: function (e) {
                    this.checkIndex(this.index + e)
                }, checkIndex: function (e) {
                    if (this.length < this.zero + e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?")
                }, setIndex: function (e) {
                    this.checkIndex(e), this.index = e
                }, skip: function (e) {
                    this.setIndex(this.index + e)
                }, byteAt: function (e) {
                }, readInt: function (e) {
                    var t, i = 0;
                    for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) i = (i << 8) + this.byteAt(t);
                    return this.index += e, i
                }, readString: function (e) {
                    return r.transformTo("string", this.readData(e))
                }, readData: function (e) {
                }, lastIndexOfSignature: function (e) {
                }, readAndCheckSignature: function (e) {
                }, readDate: function () {
                    var e = this.readInt(4);
                    return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1))
                }
            }, t.exports = n
        }, {"../utils": 29}], 16: [function (e, t, i) {
            "use strict";

            function n(e) {
                r.call(this, e)
            }

            var r = e("./Uint8ArrayReader");
            e("../utils").inherits(n, r), n.prototype.readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t
            }, t.exports = n
        }, {"../utils": 29, "./Uint8ArrayReader": 18}], 17: [function (e, t, i) {
            "use strict";

            function n(e) {
                r.call(this, e)
            }

            var r = e("./DataReader");
            e("../utils").inherits(n, r), n.prototype.byteAt = function (e) {
                return this.data.charCodeAt(this.zero + e)
            }, n.prototype.lastIndexOfSignature = function (e) {
                return this.data.lastIndexOf(e) - this.zero
            }, n.prototype.readAndCheckSignature = function (e) {
                return e === this.readData(4)
            }, n.prototype.readData = function (e) {
                this.checkOffset(e);
                var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t
            }, t.exports = n
        }, {"../utils": 29, "./DataReader": 15}], 18: [function (e, t, i) {
            "use strict";

            function n(e) {
                r.call(this, e)
            }

            var r = e("./ArrayReader");
            e("../utils").inherits(n, r), n.prototype.readData = function (e) {
                if (this.checkOffset(e), 0 === e) return new Uint8Array(0);
                var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
                return this.index += e, t
            }, t.exports = n
        }, {"../utils": 29, "./ArrayReader": 14}], 19: [function (e, t, i) {
            "use strict";
            var n = e("../utils"), r = e("../support"), a = e("./ArrayReader"), s = e("./StringReader"), o = e("./NodeBufferReader"), l = e("./Uint8ArrayReader");
            t.exports = function (e) {
                var t = n.getTypeOf(e);
                return n.checkSupport(t), "string" !== t || r.uint8array ? "nodebuffer" === t ? new o(e) : r.uint8array ? new l(n.transformTo("uint8array", e)) : new a(n.transformTo("array", e)) : new s(e)
            }
        }, {"../support": 27, "../utils": 29, "./ArrayReader": 14, "./NodeBufferReader": 16, "./StringReader": 17, "./Uint8ArrayReader": 18}], 20: [function (e, t, i) {
            "use strict";
            i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\b"
        }, {}], 21: [function (e, t, i) {
            "use strict";

            function n(e) {
                r.call(this, "ConvertWorker to " + e), this.destType = e
            }

            var r = e("./GenericWorker"), a = e("../utils");
            a.inherits(n, r), n.prototype.processChunk = function (e) {
                this.push({data: a.transformTo(this.destType, e.data), meta: e.meta})
            }, t.exports = n
        }, {"../utils": 29, "./GenericWorker": 25}], 22: [function (e, t, i) {
            "use strict";

            function n() {
                r.call(this, "Crc32Probe")
            }

            var r = e("./GenericWorker"), a = e("../crc32");
            e("../utils").inherits(n, r), n.prototype.processChunk = function (e) {
                this.streamInfo.crc32 = a(e.data, this.streamInfo.crc32 || 0), this.push(e)
            }, t.exports = n
        }, {"../crc32": 4, "../utils": 29, "./GenericWorker": 25}], 23: [function (e, t, i) {
            "use strict";

            function n(e) {
                a.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0)
            }

            var r = e("../utils"), a = e("./GenericWorker");
            r.inherits(n, a), n.prototype.processChunk = function (e) {
                if (e) {
                    var t = this.streamInfo[this.propName] || 0;
                    this.streamInfo[this.propName] = t + e.data.length
                }
                a.prototype.processChunk.call(this, e)
            }, t.exports = n
        }, {"../utils": 29, "./GenericWorker": 25}], 24: [function (e, t, i) {
            "use strict";

            function n(e) {
                a.call(this, "DataWorker");
                var t = this;
                this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function (e) {
                    t.dataIsReady = !0, t.data = e, t.max = e && e.length || 0, t.type = r.getTypeOf(e), t.isPaused || t._tickAndRepeat()
                }, function (e) {
                    t.error(e)
                })
            }

            var r = e("../utils"), a = e("./GenericWorker");
            r.inherits(n, a), n.prototype.cleanUp = function () {
                a.prototype.cleanUp.call(this), this.data = null
            }, n.prototype.resume = function () {
                return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, r.delay(this._tickAndRepeat, [], this)), !0)
            }, n.prototype._tickAndRepeat = function () {
                this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (r.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0))
            }, n.prototype._tick = function () {
                if (this.isPaused || this.isFinished) return !1;
                var e = null, t = Math.min(this.max, this.index + 16384);
                if (this.index >= this.max) return this.end();
                switch (this.type) {
                    case"string":
                        e = this.data.substring(this.index, t);
                        break;
                    case"uint8array":
                        e = this.data.subarray(this.index, t);
                        break;
                    case"array":
                    case"nodebuffer":
                        e = this.data.slice(this.index, t)
                }
                return this.index = t, this.push({data: e, meta: {percent: this.max ? this.index / this.max * 100 : 0}})
            }, t.exports = n
        }, {"../utils": 29, "./GenericWorker": 25}], 25: [function (e, t, i) {
            "use strict";

            function n(e) {
                this.name = e || "default", this.streamInfo = {},
                    this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
                    data: [],
                    end: [],
                    error: []
                }, this.previous = null
            }

            n.prototype = {
                push: function (e) {
                    this.emit("data", e)
                }, end: function () {
                    if (this.isFinished) return !1;
                    this.flush();
                    try {
                        this.emit("end"), this.cleanUp(), this.isFinished = !0
                    } catch (e) {
                        this.emit("error", e)
                    }
                    return !0
                }, error: function (e) {
                    return !this.isFinished && (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0)
                }, on: function (e, t) {
                    return this._listeners[e].push(t), this
                }, cleanUp: function () {
                    this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = []
                }, emit: function (e, t) {
                    if (this._listeners[e]) for (var i = 0; i < this._listeners[e].length; i++) this._listeners[e][i].call(this, t)
                }, pipe: function (e) {
                    return e.registerPrevious(this)
                }, registerPrevious: function (e) {
                    if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                    this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
                    var t = this;
                    return e.on("data", function (e) {
                        t.processChunk(e)
                    }), e.on("end", function () {
                        t.end()
                    }), e.on("error", function (e) {
                        t.error(e)
                    }), this
                }, pause: function () {
                    return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0)
                }, resume: function () {
                    if (!this.isPaused || this.isFinished) return !1;
                    this.isPaused = !1;
                    var e = !1;
                    return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e
                }, flush: function () {
                }, processChunk: function (e) {
                    this.push(e)
                }, withStreamInfo: function (e, t) {
                    return this.extraStreamInfo[e] = t, this.mergeStreamInfo(), this
                }, mergeStreamInfo: function () {
                    for (var e in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(e) && (this.streamInfo[e] = this.extraStreamInfo[e])
                }, lock: function () {
                    if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                    this.isLocked = !0, this.previous && this.previous.lock()
                }, toString: function () {
                    var e = "Worker " + this.name;
                    return this.previous ? this.previous + " -> " + e : e
                }
            }, t.exports = n
        }, {}], 26: [function (e, t, i) {
            (function (i) {
                "use strict";

                function n(e, t, i) {
                    switch (e) {
                        case"blob":
                            return o.newBlob(o.transformTo("arraybuffer", t), i);
                        case"base64":
                            return d.encode(t);
                        default:
                            return o.transformTo(e, t)
                    }
                }

                function r(e, t) {
                    var n, r = 0, a = null, s = 0;
                    for (n = 0; n < t.length; n++) s += t[n].length;
                    switch (e) {
                        case"string":
                            return t.join("");
                        case"array":
                            return Array.prototype.concat.apply([], t);
                        case"uint8array":
                            for (a = new Uint8Array(s), n = 0; n < t.length; n++) a.set(t[n], r), r += t[n].length;
                            return a;
                        case"nodebuffer":
                            return i.concat(t);
                        default:
                            throw new Error("concat : unsupported type '" + e + "'")
                    }
                }

                function a(e, t) {
                    return new m.Promise(function (i, a) {
                        var s = [], o = e._internalType, l = e._outputType, u = e._mimeType;
                        e.on("data", function (e, i) {
                            s.push(e), t && t(i)
                        }).on("error", function (e) {
                            s = [], a(e)
                        }).on("end", function () {
                            try {
                                var e = n(l, r(o, s), u);
                                i(e)
                            } catch (e) {
                                a(e)
                            }
                            s = []
                        }).resume()
                    })
                }

                function s(e, t, i) {
                    var n = t;
                    switch (t) {
                        case"blob":
                        case"arraybuffer":
                            n = "uint8array";
                            break;
                        case"base64":
                            n = "string"
                    }
                    try {
                        this._internalType = n, this._outputType = t, this._mimeType = i, o.checkSupport(n), this._worker = e.pipe(new l(n)), e.lock()
                    } catch (e) {
                        this._worker = new u("error"), this._worker.error(e)
                    }
                }

                var o = e("../utils"), l = e("./ConvertWorker"), u = e("./GenericWorker"), d = e("../base64"), c = e("../nodejs/NodejsStreamOutputAdapter"), m = e("../external");
                s.prototype = {
                    accumulate: function (e) {
                        return a(this, e)
                    }, on: function (e, t) {
                        var i = this;
                        return "data" === e ? this._worker.on(e, function (e) {
                            t.call(i, e.data, e.meta)
                        }) : this._worker.on(e, function () {
                            o.delay(t, arguments, i)
                        }), this
                    }, resume: function () {
                        return o.delay(this._worker.resume, [], this._worker), this
                    }, pause: function () {
                        return this._worker.pause(), this
                    }, toNodejsStream: function (e) {
                        if (o.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
                        return new c(this, {objectMode: "nodebuffer" !== this._outputType}, e)
                    }
                }, t.exports = s
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0)
        }, {"../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 35, "../utils": 29, "./ConvertWorker": 21, "./GenericWorker": 25}], 27: [function (e, t, i) {
            (function (t) {
                "use strict";
                if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, i.nodebuffer = void 0 !== t, i.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) i.blob = !1; else {
                    var n = new ArrayBuffer(0);
                    try {
                        i.blob = 0 === new Blob([n], {type: "application/zip"}).size
                    } catch (e) {
                        try {
                            var r = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, a = new r;
                            a.append(n), i.blob = 0 === a.getBlob("application/zip").size
                        } catch (e) {
                            i.blob = !1
                        }
                    }
                }
                i.nodestream = !!e("./nodejs/NodejsStreamOutputAdapter").prototype
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0)
        }, {"./nodejs/NodejsStreamOutputAdapter": 35}], 28: [function (e, t, i) {
            "use strict";

            function n() {
                l.call(this, "utf-8 decode"), this.leftOver = null
            }

            function r() {
                l.call(this, "utf-8 encode")
            }

            for (var a = e("./utils"), s = e("./support"), o = e("./nodejsUtils"), l = e("./stream/GenericWorker"), u = new Array(256), d = 0; d < 256; d++) u[d] = d >= 252 ? 6 : d >= 248 ? 5 : d >= 240 ? 4 : d >= 224 ? 3 : d >= 192 ? 2 : 1;
            u[254] = u[254] = 1;
            var c = function (e) {
                var t, i, n, r, a, o = e.length, l = 0;
                for (r = 0; r < o; r++) i = e.charCodeAt(r), 55296 == (64512 & i) && r + 1 < o && 56320 == (64512 & (n = e.charCodeAt(r + 1))) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++), l += i < 128 ? 1 : i < 2048 ? 2 : i < 65536 ? 3 : 4;
                for (t = s.uint8array ? new Uint8Array(l) : new Array(l), a = 0, r = 0; a < l; r++) i = e.charCodeAt(r), 55296 == (64512 & i) && r + 1 < o && 56320 == (64512 & (n = e.charCodeAt(r + 1))) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++), i < 128 ? t[a++] = i : i < 2048 ? (t[a++] = 192 | i >>> 6, t[a++] = 128 | 63 & i) : i < 65536 ? (t[a++] = 224 | i >>> 12, t[a++] = 128 | i >>> 6 & 63, t[a++] = 128 | 63 & i) : (t[a++] = 240 | i >>> 18, t[a++] = 128 | i >>> 12 & 63, t[a++] = 128 | i >>> 6 & 63, t[a++] = 128 | 63 & i);
                return t
            }, m = function (e, t) {
                var i;
                for (t = t || e.length, t > e.length && (t = e.length), i = t - 1; i >= 0 && 128 == (192 & e[i]);) i--;
                return i < 0 ? t : 0 === i ? t : i + u[e[i]] > t ? i : t
            }, h = function (e) {
                var t, i, n, r, s = e.length, o = new Array(2 * s);
                for (i = 0, t = 0; t < s;) if ((n = e[t++]) < 128) o[i++] = n; else if ((r = u[n]) > 4) o[i++] = 65533, t += r - 1; else {
                    for (n &= 2 === r ? 31 : 3 === r ? 15 : 7; r > 1 && t < s;) n = n << 6 | 63 & e[t++], r--;
                    r > 1 ? o[i++] = 65533 : n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | 1023 & n)
                }
                return o.length !== i && (o.subarray ? o = o.subarray(0, i) : o.length = i), a.applyFromCharCode(o)
            };
            i.utf8encode = function (e) {
                return s.nodebuffer ? o.newBuffer(e, "utf-8") : c(e)
            }, i.utf8decode = function (e) {
                return s.nodebuffer ? a.transformTo("nodebuffer", e).toString("utf-8") : (e = a.transformTo(s.uint8array ? "uint8array" : "array", e), h(e))
            }, a.inherits(n, l), n.prototype.processChunk = function (e) {
                var t = a.transformTo(s.uint8array ? "uint8array" : "array", e.data);
                if (this.leftOver && this.leftOver.length) {
                    if (s.uint8array) {
                        var n = t;
                        t = new Uint8Array(n.length + this.leftOver.length), t.set(this.leftOver, 0), t.set(n, this.leftOver.length)
                    } else t = this.leftOver.concat(t);
                    this.leftOver = null
                }
                var r = m(t), o = t;
                r !== t.length && (s.uint8array ? (o = t.subarray(0, r), this.leftOver = t.subarray(r, t.length)) : (o = t.slice(0, r), this.leftOver = t.slice(r, t.length))), this.push({
                    data: i.utf8decode(o),
                    meta: e.meta
                })
            }, n.prototype.flush = function () {
                this.leftOver && this.leftOver.length && (this.push({data: i.utf8decode(this.leftOver), meta: {}}), this.leftOver = null)
            }, i.Utf8DecodeWorker = n, a.inherits(r, l), r.prototype.processChunk = function (e) {
                this.push({data: i.utf8encode(e.data), meta: e.meta})
            }, i.Utf8EncodeWorker = r
        }, {"./nodejsUtils": 12, "./stream/GenericWorker": 25, "./support": 27, "./utils": 29}], 29: [function (e, t, i) {
            "use strict";

            function n(e) {
                var t = null;
                return t = l.uint8array ? new Uint8Array(e.length) : new Array(e.length), a(e, t)
            }

            function r(e) {
                return e
            }

            function a(e, t) {
                for (var i = 0; i < e.length; ++i) t[i] = 255 & e.charCodeAt(i);
                return t
            }

            function s(e) {
                var t = 65536, n = i.getTypeOf(e), r = !0;
                if ("uint8array" === n ? r = h.applyCanBeUsed.uint8array : "nodebuffer" === n && (r = h.applyCanBeUsed.nodebuffer), r) for (; t > 1;) try {
                    return h.stringifyByChunk(e, n, t)
                } catch (e) {
                    t = Math.floor(t / 2)
                }
                return h.stringifyByChar(e)
            }

            function o(e, t) {
                for (var i = 0; i < e.length; i++) t[i] = e[i];
                return t
            }

            var l = e("./support"), u = e("./base64"), d = e("./nodejsUtils"), c = e("asap"), m = e("./external");
            i.newBlob = function (e, t) {
                i.checkSupport("blob");
                try {
                    return new Blob([e], {type: t})
                } catch (i) {
                    try {
                        var n = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, r = new n;
                        return r.append(e), r.getBlob(t)
                    } catch (e) {
                        throw new Error("Bug : can't construct the Blob.")
                    }
                }
            };
            var h = {
                stringifyByChunk: function (e, t, i) {
                    var n = [], r = 0, a = e.length;
                    if (a <= i) return String.fromCharCode.apply(null, e);
                    for (; r < a;) "array" === t || "nodebuffer" === t ? n.push(String.fromCharCode.apply(null, e.slice(r, Math.min(r + i, a)))) : n.push(String.fromCharCode.apply(null, e.subarray(r, Math.min(r + i, a)))), r += i;
                    return n.join("")
                }, stringifyByChar: function (e) {
                    for (var t = "", i = 0; i < e.length; i++) t += String.fromCharCode(e[i]);
                    return t
                }, applyCanBeUsed: {
                    uint8array: function () {
                        try {
                            return l.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length
                        } catch (e) {
                            return !1
                        }
                    }(), nodebuffer: function () {
                        try {
                            return l.nodebuffer && 1 === String.fromCharCode.apply(null, d.newBuffer(1)).length
                        } catch (e) {
                            return !1
                        }
                    }()
                }
            };
            i.applyFromCharCode = s;
            var p = {};
            p.string = {
                string: r, array: function (e) {
                    return a(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return p.string.uint8array(e).buffer
                }, uint8array: function (e) {
                    return a(e, new Uint8Array(e.length))
                }, nodebuffer: function (e) {
                    return a(e, d.newBuffer(e.length))
                }
            }, p.array = {
                string: s, array: r, arraybuffer: function (e) {
                    return new Uint8Array(e).buffer
                }, uint8array: function (e) {
                    return new Uint8Array(e)
                }, nodebuffer: function (e) {
                    return d.newBuffer(e)
                }
            }, p.arraybuffer = {
                string: function (e) {
                    return s(new Uint8Array(e))
                }, array: function (e) {
                    return o(new Uint8Array(e), new Array(e.byteLength))
                }, arraybuffer: r, uint8array: function (e) {
                    return new Uint8Array(e)
                }, nodebuffer: function (e) {
                    return d.newBuffer(new Uint8Array(e))
                }
            }, p.uint8array = {
                string: s, array: function (e) {
                    return o(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return e.buffer
                }, uint8array: r, nodebuffer: function (e) {
                    return d.newBuffer(e)
                }
            }, p.nodebuffer = {
                string: s, array: function (e) {
                    return o(e, new Array(e.length))
                }, arraybuffer: function (e) {
                    return p.nodebuffer.uint8array(e).buffer
                }, uint8array: function (e) {
                    return o(e, new Uint8Array(e.length))
                }, nodebuffer: r
            }, i.transformTo = function (e, t) {
                if (t || (t = ""), !e) return t;
                i.checkSupport(e);
                var n = i.getTypeOf(t);
                return p[n][e](t)
            }, i.getTypeOf = function (e) {
                return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : l.nodebuffer && d.isBuffer(e) ? "nodebuffer" : l.uint8array && e instanceof Uint8Array ? "uint8array" : l.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0
            }, i.checkSupport = function (e) {
                if (!l[e.toLowerCase()]) throw new Error(e + " is not supported by this platform")
            }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function (e) {
                var t, i, n = "";
                for (i = 0; i < (e || "").length; i++) t = e.charCodeAt(i), n += "\\x" + (t < 16 ? "0" : "") + t.toString(16).toUpperCase();
                return n
            }, i.delay = function (e, t, i) {
                c(function () {
                    e.apply(i || null, t || [])
                })
            }, i.inherits = function (e, t) {
                var i = function () {
                };
                i.prototype = t.prototype, e.prototype = new i
            }, i.extend = function () {
                var e, t, i = {};
                for (e = 0; e < arguments.length; e++) for (t in arguments[e]) arguments[e].hasOwnProperty(t) && void 0 === i[t] && (i[t] = arguments[e][t]);
                return i
            }, i.prepareContent = function (e, t, r, a, s) {
                var o = null;
                return o = l.blob && t instanceof Blob && "undefined" != typeof FileReader ? new m.Promise(function (e, i) {
                    var n = new FileReader;
                    n.onload = function (t) {
                        e(t.target.result)
                    }, n.onerror = function (e) {
                        i(e.target.error)
                    }, n.readAsArrayBuffer(t)
                }) : m.Promise.resolve(t), o.then(function (t) {
                    var o = i.getTypeOf(t);
                    return o ? ("arraybuffer" === o ? t = i.transformTo("uint8array", t) : "string" === o && (s ? t = u.decode(t) : r && !0 !== a && (t = n(t))), t) : m.Promise.reject(new Error("The data of '" + e + "' is in an unsupported format !"))
                })
            }
        }, {"./base64": 1, "./external": 6, "./nodejsUtils": 12, "./support": 27, asap: 33}], 30: [function (e, t, i) {
            "use strict";

            function n(e) {
                this.files = [], this.loadOptions = e
            }

            var r = e("./reader/readerFor"), a = e("./utils"), s = e("./signature"), o = e("./zipEntry"), l = (e("./utf8"), e("./support"));
            n.prototype = {
                checkSignature: function (e) {
                    if (!this.reader.readAndCheckSignature(e)) {
                        this.reader.index -= 4;
                        var t = this.reader.readString(4);
                        throw new Error("Corrupted zip or bug : unexpected signature (" + a.pretty(t) + ", expected " + a.pretty(e) + ")")
                    }
                }, isSignature: function (e, t) {
                    var i = this.reader.index;
                    this.reader.setIndex(e);
                    var n = this.reader.readString(4), r = n === t;
                    return this.reader.setIndex(i), r
                }, readBlockEndOfCentral: function () {
                    this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                    var e = this.reader.readData(this.zipCommentLength), t = l.uint8array ? "uint8array" : "array", i = a.transformTo(t, e);
                    this.zipComment = this.loadOptions.decodeFileName(i)
                }, readBlockZip64EndOfCentral: function () {
                    this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                    for (var e, t, i, n = this.zip64EndOfCentralSize - 44; 0 < n;) e = this.reader.readInt(2), t = this.reader.readInt(4), i = this.reader.readData(t), this.zip64ExtensibleData[e] = {
                        id: e,
                        length: t,
                        value: i
                    }
                }, readBlockZip64EndOfCentralLocator: function () {
                    if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1) throw new Error("Multi-volumes zip are not supported")
                }, readLocalFiles: function () {
                    var e, t;
                    for (e = 0; e < this.files.length; e++) t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes()
                }, readCentralDir: function () {
                    var e;
                    for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);) e = new o({zip64: this.zip64}, this.loadOptions), e.readCentralPart(this.reader), this.files.push(e);
                    if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length)
                }, readEndOfCentral: function () {
                    var e = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
                    if (e < 0) {
                        throw!this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip : can't find end of central directory")
                    }
                    this.reader.setIndex(e);
                    var t = e;
                    if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
                        if (this.zip64 = !0, (e = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
                        if (this.reader.setIndex(e), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
                        this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral()
                    }
                    var i = this.centralDirOffset + this.centralDirSize;
                    this.zip64 && (i += 20, i += 12 + this.zip64EndOfCentralSize);
                    var n = t - i;
                    if (n > 0) this.isSignature(t, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n); else if (n < 0) throw new Error("Corrupted zip: missing " + Math.abs(n) + " bytes.")
                }, prepareReader: function (e) {
                    this.reader = r(e)
                }, load: function (e) {
                    this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles()
                }
            }, t.exports = n
        }, {"./reader/readerFor": 19, "./signature": 20, "./support": 27, "./utf8": 28, "./utils": 29, "./zipEntry": 31}], 31: [function (e, t, i) {
            "use strict";

            function n(e, t) {
                this.options = e, this.loadOptions = t
            }

            var r = e("./reader/readerFor"), a = e("./utils"), s = e("./compressedObject"), o = e("./crc32"), l = e("./utf8"), u = e("./compressions"), d = e("./support"), c = function (e) {
                for (var t in u) if (u.hasOwnProperty(t) && u[t].magic === e) return u[t];
                return null
            };
            n.prototype = {
                isEncrypted: function () {
                    return 1 == (1 & this.bitFlag)
                }, useUTF8: function () {
                    return 2048 == (2048 & this.bitFlag)
                }, readLocalPart: function (e) {
                    var t, i;
                    if (e.skip(22), this.fileNameLength = e.readInt(2), i = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(i), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                    if (null === (t = c(this.compressionMethod))) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
                    this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize))
                }, readCentralPart: function (e) {
                    this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
                    var t = e.readInt(2);
                    if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                    e.skip(t), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength)
                }, processAttributes: function () {
                    this.unixPermissions = null, this.dosPermissions = null;
                    var e = this.versionMadeBy >> 8;
                    this.dir = !!(16 & this.externalFileAttributes), 0 === e && (this.dosPermissions = 63 & this.externalFileAttributes), 3 === e && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0)
                }, parseZIP64ExtraField: function (e) {
                    if (this.extraFields[1]) {
                        var t = r(this.extraFields[1].value);
                        this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = t.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = t.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = t.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = t.readInt(4))
                    }
                }, readExtraFields: function (e) {
                    var t, i, n, r = e.index + this.extraFieldsLength;
                    for (this.extraFields || (this.extraFields = {}); e.index < r;) t = e.readInt(2), i = e.readInt(2), n = e.readData(i), this.extraFields[t] = {id: t, length: i, value: n}
                }, handleUTF8: function () {
                    var e = d.uint8array ? "uint8array" : "array";
                    if (this.useUTF8()) this.fileNameStr = l.utf8decode(this.fileName), this.fileCommentStr = l.utf8decode(this.fileComment); else {
                        var t = this.findExtraFieldUnicodePath();
                        if (null !== t) this.fileNameStr = t; else {
                            var i = a.transformTo(e, this.fileName);
                            this.fileNameStr = this.loadOptions.decodeFileName(i)
                        }
                        var n = this.findExtraFieldUnicodeComment();
                        if (null !== n) this.fileCommentStr = n; else {
                            var r = a.transformTo(e, this.fileComment);
                            this.fileCommentStr = this.loadOptions.decodeFileName(r)
                        }
                    }
                }, findExtraFieldUnicodePath: function () {
                    var e = this.extraFields[28789];
                    if (e) {
                        var t = r(e.value);
                        return 1 !== t.readInt(1) ? null : o(this.fileName) !== t.readInt(4) ? null : l.utf8decode(t.readData(e.length - 5))
                    }
                    return null
                }, findExtraFieldUnicodeComment: function () {
                    var e = this.extraFields[25461];
                    if (e) {
                        var t = r(e.value);
                        return 1 !== t.readInt(1) ? null : o(this.fileComment) !== t.readInt(4) ? null : l.utf8decode(t.readData(e.length - 5))
                    }
                    return null
                }
            }, t.exports = n
        }, {"./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 19, "./support": 27, "./utf8": 28, "./utils": 29}], 32: [function (e, t, i) {
            "use strict";
            var n = e("./stream/StreamHelper"), r = e("./stream/DataWorker"), a = e("./utf8"), s = e("./compressedObject"), o = e("./stream/GenericWorker"), l = function (e, t, i) {
                this.name = e, this.dir = i.dir, this.date = i.date, this.comment = i.comment, this.unixPermissions = i.unixPermissions, this.dosPermissions = i.dosPermissions, this._data = t, this._dataBinary = i.binary, this.options = {
                    compression: i.compression,
                    compressionOptions: i.compressionOptions
                }
            };
            l.prototype = {
                internalStream: function (e) {
                    var t = e.toLowerCase(), i = "string" === t || "text" === t;
                    "binarystring" !== t && "text" !== t || (t = "string");
                    var r = this._decompressWorker(), s = !this._dataBinary;
                    return s && !i && (r = r.pipe(new a.Utf8EncodeWorker)), !s && i && (r = r.pipe(new a.Utf8DecodeWorker)), new n(r, t, "")
                }, async: function (e, t) {
                    return this.internalStream(e).accumulate(t)
                }, nodeStream: function (e, t) {
                    return this.internalStream(e || "nodebuffer").toNodejsStream(t)
                }, _compressWorker: function (e, t) {
                    if (this._data instanceof s && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
                    var i = this._decompressWorker();
                    return this._dataBinary || (i = i.pipe(new a.Utf8EncodeWorker)), s.createWorkerFrom(i, e, t)
                }, _decompressWorker: function () {
                    return this._data instanceof s ? this._data.getContentWorker() : this._data instanceof o ? this._data : new r(this._data)
                }
            };
            for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], d = function () {
                throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
            }, c = 0; c < u.length; c++) l.prototype[u[c]] = d;
            t.exports = l
        }, {"./compressedObject": 2, "./stream/DataWorker": 24, "./stream/GenericWorker": 25, "./stream/StreamHelper": 26, "./utf8": 28}], 33: [function (e, t, i) {
            "use strict";

            function n() {
                if (l.length) throw l.shift()
            }

            function r(e) {
                var t;
                t = o.length ? o.pop() : new a, t.task = e, s(t)
            }

            function a() {
                this.task = null
            }

            var s = e("./raw"), o = [], l = [], u = s.makeRequestCallFromTimer(n);
            t.exports = r, a.prototype.call = function () {
                try {
                    this.task.call()
                } catch (e) {
                    r.onerror ? r.onerror(e) : (l.push(e), u())
                } finally {
                    this.task = null, o[o.length] = this
                }
            }
        }, {"./raw": 34}], 34: [function (e, t, i) {
            (function (e) {
                "use strict";

                function i(e) {
                    s.length || (a(), o = !0), s[s.length] = e
                }

                function n() {
                    for (; l < s.length;) {
                        var e = l;
                        if (l += 1, s[e].call(), l > u) {
                            for (var t = 0, i = s.length - l; t < i; t++) s[t] = s[t + l];
                            s.length -= l, l = 0
                        }
                    }
                    s.length = 0, l = 0, o = !1
                }

                function r(e) {
                    return function () {
                        function t() {
                            clearTimeout(i), clearInterval(n), e()
                        }

                        var i = setTimeout(t, 0), n = setInterval(t, 50)
                    }
                }

                t.exports = i;
                var a, s = [], o = !1, l = 0, u = 1024, d = e.MutationObserver || e.WebKitMutationObserver;
                a = "function" == typeof d ? function (e) {
                    var t = 1, i = new d(e), n = document.createTextNode("");
                    return i.observe(n, {characterData: !0}), function () {
                        t = -t, n.data = t
                    }
                }(n) : r(n), i.requestFlush = a, i.makeRequestCallFromTimer = r
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}], 35: [function (e, t, i) {
        }, {}], 36: [function (e, t, i) {
            function n() {
                d = !1, o.length ? u = o.concat(u) : c = -1, u.length && r()
            }

            function r() {
                if (!d) {
                    var e = setTimeout(n);
                    d = !0;
                    for (var t = u.length; t;) {
                        for (o = u, u = []; ++c < t;) o && o[c].run();
                        c = -1, t = u.length
                    }
                    o = null, d = !1, clearTimeout(e)
                }
            }

            function a(e, t) {
                this.fun = e, this.array = t
            }

            function s() {
            }

            var o, l = t.exports = {}, u = [], d = !1, c = -1;
            l.nextTick = function (e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
                u.push(new a(e, t)), 1 !== u.length || d || setTimeout(r, 0)
            }, a.prototype.run = function () {
                this.fun.apply(null, this.array)
            }, l.title = "browser", l.browser = !0, l.env = {}, l.argv = [], l.version = "", l.versions = {}, l.on = s, l.addListener = s, l.once = s, l.off = s, l.removeListener = s, l.removeAllListeners = s, l.emit = s, l.binding = function (e) {
                throw new Error("process.binding is not supported")
            }, l.cwd = function () {
                return "/"
            }, l.chdir = function (e) {
                throw new Error("process.chdir is not supported")
            }, l.umask = function () {
                return 0
            }
        }, {}], 37: [function (t, i, n) {
            (function (n, r) {
                (function () {
                    "use strict";

                    function a(e) {
                        return "function" == typeof e || "object" == typeof e && null !== e
                    }

                    function s(e) {
                        return "function" == typeof e
                    }

                    function o(e) {
                        return "object" == typeof e && null !== e
                    }

                    function l(e) {
                        U = e
                    }

                    function u(e) {
                        K = e
                    }

                    function d() {
                        return function () {
                            B(m)
                        }
                    }

                    function c() {
                        return function () {
                            setTimeout(m, 1)
                        }
                    }

                    function m() {
                        for (var e = 0; e < R; e += 2) {
                            (0, Q[e])(Q[e + 1]), Q[e] = void 0, Q[e + 1] = void 0
                        }
                        R = 0
                    }

                    function h() {
                    }

                    function p() {
                        return new TypeError("You cannot resolve a promise with itself")
                    }

                    function f() {
                        return new TypeError("A promises callback cannot return that same promise.")
                    }

                    function _(e) {
                        try {
                            return e.then
                        } catch (e) {
                            return ie.error = e, ie
                        }
                    }

                    function g(e, t, i, n) {
                        try {
                            e.call(t, i, n)
                        } catch (e) {
                            return e
                        }
                    }

                    function y(e, t, i) {
                        K(function (e) {
                            var n = !1, r = g(i, t, function (i) {
                                n || (n = !0, t !== i ? w(e, i) : b(e, i))
                            }, function (t) {
                                n || (n = !0, M(e, t))
                            }, "Settle: " + (e._label || " unknown promise"));
                            !n && r && (n = !0, M(e, r))
                        }, e)
                    }

                    function v(e, t) {
                        t._state === ee ? b(e, t._result) : t._state === te ? M(e, t._result) : D(t, void 0, function (t) {
                            w(e, t)
                        }, function (t) {
                            M(e, t)
                        })
                    }

                    function k(e, t) {
                        if (t.constructor === e.constructor) v(e, t); else {
                            var i = _(t);
                            i === ie ? M(e, ie.error) : void 0 === i ? b(e, t) : s(i) ? y(e, t, i) : b(e, t)
                        }
                    }

                    function w(e, t) {
                        e === t ? M(e, p()) : a(t) ? k(e, t) : b(e, t)
                    }

                    function T(e) {
                        e._onerror && e._onerror(e._result), L(e)
                    }

                    function b(e, t) {
                        e._state === X && (e._result = t, e._state = ee, 0 !== e._subscribers.length && K(L, e))
                    }

                    function M(e, t) {
                        e._state === X && (e._state = te, e._result = t, K(T, e))
                    }

                    function D(e, t, i, n) {
                        var r = e._subscribers, a = r.length;
                        e._onerror = null, r[a] = t, r[a + ee] = i, r[a + te] = n, 0 === a && e._state && K(L, e)
                    }

                    function L(e) {
                        var t = e._subscribers, i = e._state;
                        if (0 !== t.length) {
                            for (var n, r, a = e._result, s = 0; s < t.length; s += 3) n = t[s], r = t[s + i], n ? Y(i, n, r, a) : r(a);
                            e._subscribers.length = 0
                        }
                    }

                    function A() {
                        this.error = null
                    }

                    function S(e, t) {
                        try {
                            return e(t)
                        } catch (e) {
                            return ne.error = e, ne
                        }
                    }

                    function Y(e, t, i, n) {
                        var r, a, o, l, u = s(i);
                        if (u) {
                            if (r = S(i, n), r === ne ? (l = !0, a = r.error, r = null) : o = !0, t === r) return void M(t, f())
                        } else r = n, o = !0;
                        t._state !== X || (u && o ? w(t, r) : l ? M(t, a) : e === ee ? b(t, r) : e === te && M(t, r))
                    }

                    function x(e, t) {
                        try {
                            t(function (t) {
                                w(e, t)
                            }, function (t) {
                                M(e, t)
                            })
                        } catch (t) {
                            M(e, t)
                        }
                    }

                    function E(e, t) {
                        var i = this;
                        i._instanceConstructor = e, i.promise = new e(h), i._validateInput(t) ? (i._input = t, i.length = t.length, i._remaining = t.length, i._init(), 0 === i.length ? b(i.promise, i._result) : (i.length = i.length || 0, i._enumerate(), 0 === i._remaining && b(i.promise, i._result))) : M(i.promise, i._validationError())
                    }

                    function C(e) {
                        return new re(this, e).promise
                    }

                    function O(e) {
                        function t(e) {
                            w(r, e)
                        }

                        function i(e) {
                            M(r, e)
                        }

                        var n = this, r = new n(h);
                        if (!N(e)) return M(r, new TypeError("You must pass an array to race.")), r;
                        for (var a = e.length, s = 0; r._state === X && s < a; s++) D(n.resolve(e[s]), void 0, t, i);
                        return r
                    }

                    function P(e) {
                        var t = this;
                        if (e && "object" == typeof e && e.constructor === t) return e;
                        var i = new t(h);
                        return w(i, e), i
                    }

                    function I(e) {
                        var t = this, i = new t(h);
                        return M(i, e), i
                    }

                    function j() {
                        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                    }

                    function W() {
                        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                    }

                    function F(e) {
                        this._id = ue++, this._state = void 0, this._result = void 0, this._subscribers = [], h !== e && (s(e) || j(), this instanceof F || W(), x(this, e))
                    }

                    function z() {
                        var e;
                        if (void 0 !== r) e = r; else if ("undefined" != typeof self) e = self; else try {
                            e = Function("return this")()
                        } catch (e) {
                            throw new Error("polyfill failed because global object is unavailable in this environment")
                        }
                        var t = e.Promise;
                        t && "[object Promise]" === Object.prototype.toString.call(t.resolve()) && !t.cast || (e.Promise = de)
                    }

                    var H;
                    H = Array.isArray ? Array.isArray : function (e) {
                        return "[object Array]" === Object.prototype.toString.call(e)
                    };
                    var B, U, $, N = H, R = 0, K = function (e, t) {
                            Q[R] = e, Q[R + 1] = t, 2 === (R += 2) && (U ? U(m) : $())
                        }, G = "undefined" != typeof window ? window : void 0, q = G || {}, V = q.MutationObserver || q.WebKitMutationObserver,
                        J = void 0 !== n && "[object process]" === {}.toString.call(n),
                        Z = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, Q = new Array(1e3);
                    $ = J ? function () {
                        return function () {
                            n.nextTick(m)
                        }
                    }() : V ? function () {
                        var e = 0, t = new V(m), i = document.createTextNode("");
                        return t.observe(i, {characterData: !0}), function () {
                            i.data = e = ++e % 2
                        }
                    }() : Z ? function () {
                        var e = new MessageChannel;
                        return e.port1.onmessage = m, function () {
                            e.port2.postMessage(0)
                        }
                    }() : void 0 === G && "function" == typeof t ? function () {
                        try {
                            var e = t, i = e("vertx");
                            return B = i.runOnLoop || i.runOnContext, d()
                        } catch (e) {
                            return c()
                        }
                    }() : c();
                    var X = void 0, ee = 1, te = 2, ie = new A, ne = new A;
                    E.prototype._validateInput = function (e) {
                        return N(e)
                    }, E.prototype._validationError = function () {
                        return new Error("Array Methods must be provided an Array")
                    }, E.prototype._init = function () {
                        this._result = new Array(this.length)
                    };
                    var re = E;
                    E.prototype._enumerate = function () {
                        for (var e = this, t = e.length, i = e.promise, n = e._input, r = 0; i._state === X && r < t; r++) e._eachEntry(n[r], r)
                    }, E.prototype._eachEntry = function (e, t) {
                        var i = this, n = i._instanceConstructor;
                        o(e) ? e.constructor === n && e._state !== X ? (e._onerror = null, i._settledAt(e._state, t, e._result)) : i._willSettleAt(n.resolve(e), t) : (i._remaining--, i._result[t] = e)
                    }, E.prototype._settledAt = function (e, t, i) {
                        var n = this, r = n.promise;
                        r._state === X && (n._remaining--, e === te ? M(r, i) : n._result[t] = i), 0 === n._remaining && b(r, n._result)
                    }, E.prototype._willSettleAt = function (e, t) {
                        var i = this;
                        D(e, void 0, function (e) {
                            i._settledAt(ee, t, e)
                        }, function (e) {
                            i._settledAt(te, t, e)
                        })
                    };
                    var ae = C, se = O, oe = P, le = I, ue = 0, de = F;
                    F.all = ae, F.race = se, F.resolve = oe, F.reject = le, F._setScheduler = l, F._setAsap = u, F._asap = K, F.prototype = {
                        constructor: F, then: function (e, t) {
                            var i = this, n = i._state;
                            if (n === ee && !e || n === te && !t) return this;
                            var r = new this.constructor(h), a = i._result;
                            if (n) {
                                var s = arguments[n - 1];
                                K(function () {
                                    Y(n, r, s, a)
                                })
                            } else D(i, r, e, t);
                            return r
                        }, catch: function (e) {
                            return this.then(null, e)
                        }
                    };
                    var ce = z, me = {Promise: de, polyfill: ce};
                    "function" == typeof e && e.amd ? e(function () {
                        return me
                    }) : void 0 !== i && i.exports ? i.exports = me : void 0 !== this && (this.ES6Promise = me), ce()
                }).call(this)
            }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {_process: 36}], 38: [function (e, t, i) {
            "use strict";
            var n = e("./lib/utils/common").assign, r = e("./lib/deflate"), a = e("./lib/inflate"), s = e("./lib/zlib/constants"), o = {};
            n(o, r, a, s), t.exports = o
        }, {"./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44}], 39: [function (e, t, i) {
            "use strict";

            function n(e) {
                if (!(this instanceof n)) return new n(e);
                this.options = l.assign({level: p, method: _, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: f, to: ""}, e || {});
                var t = this.options;
                t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new c, this.strm.avail_out = 0;
                var i = o.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
                if (i !== h) throw new Error(d[i]);
                if (t.header && o.deflateSetHeader(this.strm, t.header), t.dictionary) {
                    var r;
                    if (r = "string" == typeof t.dictionary ? u.string2buf(t.dictionary) : "[object ArrayBuffer]" === m.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, (i = o.deflateSetDictionary(this.strm, r)) !== h) throw new Error(d[i]);
                    this._dict_set = !0
                }
            }

            function r(e, t) {
                var i = new n(t);
                if (i.push(e, !0), i.err) throw i.msg;
                return i.result
            }

            function a(e, t) {
                return t = t || {}, t.raw = !0, r(e, t)
            }

            function s(e, t) {
                return t = t || {}, t.gzip = !0, r(e, t)
            }

            var o = e("./zlib/deflate"), l = e("./utils/common"), u = e("./utils/strings"), d = e("./zlib/messages"), c = e("./zlib/zstream"), m = Object.prototype.toString, h = 0, p = -1, f = 0,
                _ = 8;
            n.prototype.push = function (e, t) {
                var i, n, r = this.strm, a = this.options.chunkSize;
                if (this.ended) return !1;
                n = t === ~~t ? t : !0 === t ? 4 : 0, "string" == typeof e ? r.input = u.string2buf(e) : "[object ArrayBuffer]" === m.call(e) ? r.input = new Uint8Array(e) : r.input = e, r.next_in = 0, r.avail_in = r.input.length;
                do {
                    if (0 === r.avail_out && (r.output = new l.Buf8(a), r.next_out = 0, r.avail_out = a), 1 !== (i = o.deflate(r, n)) && i !== h) return this.onEnd(i), this.ended = !0, !1
                        ;
                    0 !== r.avail_out && (0 !== r.avail_in || 4 !== n && 2 !== n) || ("string" === this.options.to ? this.onData(u.buf2binstring(l.shrinkBuf(r.output, r.next_out))) : this.onData(l.shrinkBuf(r.output, r.next_out)))
                } while ((r.avail_in > 0 || 0 === r.avail_out) && 1 !== i);
                return 4 === n ? (i = o.deflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === h) : 2 !== n || (this.onEnd(h), r.avail_out = 0, !0)
            }, n.prototype.onData = function (e) {
                this.chunks.push(e)
            }, n.prototype.onEnd = function (e) {
                e === h && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = l.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
            }, i.Deflate = n, i.deflate = r, i.deflateRaw = a, i.gzip = s
        }, {"./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53}], 40: [function (e, t, i) {
            "use strict";

            function n(e) {
                if (!(this instanceof n)) return new n(e);
                this.options = o.assign({chunkSize: 16384, windowBits: 0, to: ""}, e || {});
                var t = this.options;
                t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new c, this.strm.avail_out = 0;
                var i = s.inflateInit2(this.strm, t.windowBits);
                if (i !== u.Z_OK) throw new Error(d[i]);
                this.header = new m, s.inflateGetHeader(this.strm, this.header)
            }

            function r(e, t) {
                var i = new n(t);
                if (i.push(e, !0), i.err) throw i.msg;
                return i.result
            }

            function a(e, t) {
                return t = t || {}, t.raw = !0, r(e, t)
            }

            var s = e("./zlib/inflate"), o = e("./utils/common"), l = e("./utils/strings"), u = e("./zlib/constants"), d = e("./zlib/messages"), c = e("./zlib/zstream"), m = e("./zlib/gzheader"),
                h = Object.prototype.toString;
            n.prototype.push = function (e, t) {
                var i, n, r, a, d, c, m = this.strm, p = this.options.chunkSize, f = this.options.dictionary, _ = !1;
                if (this.ended) return !1;
                n = t === ~~t ? t : !0 === t ? u.Z_FINISH : u.Z_NO_FLUSH, "string" == typeof e ? m.input = l.binstring2buf(e) : "[object ArrayBuffer]" === h.call(e) ? m.input = new Uint8Array(e) : m.input = e, m.next_in = 0, m.avail_in = m.input.length;
                do {
                    if (0 === m.avail_out && (m.output = new o.Buf8(p), m.next_out = 0, m.avail_out = p), i = s.inflate(m, u.Z_NO_FLUSH), i === u.Z_NEED_DICT && f && (c = "string" == typeof f ? l.string2buf(f) : "[object ArrayBuffer]" === h.call(f) ? new Uint8Array(f) : f, i = s.inflateSetDictionary(this.strm, c)), i === u.Z_BUF_ERROR && !0 === _ && (i = u.Z_OK, _ = !1), i !== u.Z_STREAM_END && i !== u.Z_OK) return this.onEnd(i), this.ended = !0, !1;
                    m.next_out && (0 !== m.avail_out && i !== u.Z_STREAM_END && (0 !== m.avail_in || n !== u.Z_FINISH && n !== u.Z_SYNC_FLUSH) || ("string" === this.options.to ? (r = l.utf8border(m.output, m.next_out), a = m.next_out - r, d = l.buf2string(m.output, r), m.next_out = a, m.avail_out = p - a, a && o.arraySet(m.output, m.output, r, a, 0), this.onData(d)) : this.onData(o.shrinkBuf(m.output, m.next_out)))), 0 === m.avail_in && 0 === m.avail_out && (_ = !0)
                } while ((m.avail_in > 0 || 0 === m.avail_out) && i !== u.Z_STREAM_END);
                return i === u.Z_STREAM_END && (n = u.Z_FINISH), n === u.Z_FINISH ? (i = s.inflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === u.Z_OK) : n !== u.Z_SYNC_FLUSH || (this.onEnd(u.Z_OK), m.avail_out = 0, !0)
            }, n.prototype.onData = function (e) {
                this.chunks.push(e)
            }, n.prototype.onEnd = function (e) {
                e === u.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
            }, i.Inflate = n, i.inflate = r, i.inflateRaw = a, i.ungzip = r
        }, {"./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53}], 41: [function (e, t, i) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            i.assign = function (e) {
                for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                    var i = t.shift();
                    if (i) {
                        if ("object" != typeof i) throw new TypeError(i + "must be non-object");
                        for (var n in i) i.hasOwnProperty(n) && (e[n] = i[n])
                    }
                }
                return e
            }, i.shrinkBuf = function (e, t) {
                return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e)
            };
            var r = {
                arraySet: function (e, t, i, n, r) {
                    if (t.subarray && e.subarray) return void e.set(t.subarray(i, i + n), r);
                    for (var a = 0; a < n; a++) e[r + a] = t[i + a]
                }, flattenChunks: function (e) {
                    var t, i, n, r, a, s;
                    for (n = 0, t = 0, i = e.length; t < i; t++) n += e[t].length;
                    for (s = new Uint8Array(n), r = 0, t = 0, i = e.length; t < i; t++) a = e[t], s.set(a, r), r += a.length;
                    return s
                }
            }, a = {
                arraySet: function (e, t, i, n, r) {
                    for (var a = 0; a < n; a++) e[r + a] = t[i + a]
                }, flattenChunks: function (e) {
                    return [].concat.apply([], e)
                }
            };
            i.setTyped = function (e) {
                e ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, r)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, a))
            }, i.setTyped(n)
        }, {}], 42: [function (e, t, i) {
            "use strict";

            function n(e, t) {
                if (t < 65537 && (e.subarray && s || !e.subarray && a)) return String.fromCharCode.apply(null, r.shrinkBuf(e, t));
                for (var i = "", n = 0; n < t; n++) i += String.fromCharCode(e[n]);
                return i
            }

            var r = e("./common"), a = !0, s = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (e) {
                a = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (e) {
                s = !1
            }
            for (var o = new r.Buf8(256), l = 0; l < 256; l++) o[l] = l >= 252 ? 6 : l >= 248 ? 5 : l >= 240 ? 4 : l >= 224 ? 3 : l >= 192 ? 2 : 1;
            o[254] = o[254] = 1, i.string2buf = function (e) {
                var t, i, n, a, s, o = e.length, l = 0;
                for (a = 0; a < o; a++) i = e.charCodeAt(a), 55296 == (64512 & i) && a + 1 < o && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (i = 65536 + (i - 55296 << 10) + (n - 56320), a++), l += i < 128 ? 1 : i < 2048 ? 2 : i < 65536 ? 3 : 4;
                for (t = new r.Buf8(l), s = 0, a = 0; s < l; a++) i = e.charCodeAt(a), 55296 == (64512 & i) && a + 1 < o && 56320 == (64512 & (n = e.charCodeAt(a + 1))) && (i = 65536 + (i - 55296 << 10) + (n - 56320), a++), i < 128 ? t[s++] = i : i < 2048 ? (t[s++] = 192 | i >>> 6, t[s++] = 128 | 63 & i) : i < 65536 ? (t[s++] = 224 | i >>> 12, t[s++] = 128 | i >>> 6 & 63, t[s++] = 128 | 63 & i) : (t[s++] = 240 | i >>> 18, t[s++] = 128 | i >>> 12 & 63, t[s++] = 128 | i >>> 6 & 63, t[s++] = 128 | 63 & i);
                return t
            }, i.buf2binstring = function (e) {
                return n(e, e.length)
            }, i.binstring2buf = function (e) {
                for (var t = new r.Buf8(e.length), i = 0, n = t.length; i < n; i++) t[i] = e.charCodeAt(i);
                return t
            }, i.buf2string = function (e, t) {
                var i, r, a, s, l = t || e.length, u = new Array(2 * l);
                for (r = 0, i = 0; i < l;) if ((a = e[i++]) < 128) u[r++] = a; else if ((s = o[a]) > 4) u[r++] = 65533, i += s - 1; else {
                    for (a &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && i < l;) a = a << 6 | 63 & e[i++], s--;
                    s > 1 ? u[r++] = 65533 : a < 65536 ? u[r++] = a : (a -= 65536, u[r++] = 55296 | a >> 10 & 1023, u[r++] = 56320 | 1023 & a)
                }
                return n(u, r)
            }, i.utf8border = function (e, t) {
                var i;
                for (t = t || e.length, t > e.length && (t = e.length), i = t - 1; i >= 0 && 128 == (192 & e[i]);) i--;
                return i < 0 ? t : 0 === i ? t : i + o[e[i]] > t ? i : t
            }
        }, {"./common": 41}], 43: [function (e, t, i) {
            "use strict";

            function n(e, t, i, n) {
                for (var r = 65535 & e | 0, a = e >>> 16 & 65535 | 0, s = 0; 0 !== i;) {
                    s = i > 2e3 ? 2e3 : i, i -= s;
                    do {
                        r = r + t[n++] | 0, a = a + r | 0
                    } while (--s);
                    r %= 65521, a %= 65521
                }
                return r | a << 16 | 0
            }

            t.exports = n
        }, {}], 44: [function (e, t, i) {
            "use strict";
            t.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }, {}], 45: [function (e, t, i) {
            "use strict";

            function n(e, t, i, n) {
                var a = r, s = n + i;
                e ^= -1;
                for (var o = n; o < s; o++) e = e >>> 8 ^ a[255 & (e ^ t[o])];
                return -1 ^ e
            }

            var r = function () {
                for (var e, t = [], i = 0; i < 256; i++) {
                    e = i;
                    for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                    t[i] = e
                }
                return t
            }();
            t.exports = n
        }, {}], 46: [function (e, t, i) {
            "use strict";

            function n(e, t) {
                return e.msg = P[t], t
            }

            function r(e) {
                return (e << 1) - (e > 4 ? 9 : 0)
            }

            function a(e) {
                for (var t = e.length; --t >= 0;) e[t] = 0
            }

            function s(e) {
                var t = e.state, i = t.pending;
                i > e.avail_out && (i = e.avail_out), 0 !== i && (x.arraySet(e.output, t.pending_buf, t.pending_out, i, e.next_out), e.next_out += i, t.pending_out += i, e.total_out += i, e.avail_out -= i, t.pending -= i, 0 === t.pending && (t.pending_out = 0))
            }

            function o(e, t) {
                E._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, s(e.strm)
            }

            function l(e, t) {
                e.pending_buf[e.pending++] = t
            }

            function u(e, t) {
                e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t
            }

            function d(e, t, i, n) {
                var r = e.avail_in;
                return r > n && (r = n), 0 === r ? 0 : (e.avail_in -= r, x.arraySet(t, e.input, e.next_in, r, i), 1 === e.state.wrap ? e.adler = C(e.adler, t, r, i) : 2 === e.state.wrap && (e.adler = O(e.adler, t, r, i)), e.next_in += r, e.total_in += r, r)
            }

            function c(e, t) {
                var i, n, r = e.max_chain_length, a = e.strstart, s = e.prev_length, o = e.nice_match, l = e.strstart > e.w_size - ue ? e.strstart - (e.w_size - ue) : 0, u = e.window, d = e.w_mask,
                    c = e.prev, m = e.strstart + le, h = u[a + s - 1], p = u[a + s];
                e.prev_length >= e.good_match && (r >>= 2), o > e.lookahead && (o = e.lookahead);
                do {
                    if (i = t, u[i + s] === p && u[i + s - 1] === h && u[i] === u[a] && u[++i] === u[a + 1]) {
                        a += 2, i++;
                        do {
                        } while (u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && u[++a] === u[++i] && a < m);
                        if (n = le - (m - a), a = m - le, n > s) {
                            if (e.match_start = t, s = n, n >= o) break;
                            h = u[a + s - 1], p = u[a + s]
                        }
                    }
                } while ((t = c[t & d]) > l && 0 != --r);
                return s <= e.lookahead ? s : e.lookahead
            }

            function m(e) {
                var t, i, n, r, a, s = e.w_size;
                do {
                    if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= s + (s - ue)) {
                        x.arraySet(e.window, e.window, s, s, 0), e.match_start -= s, e.strstart -= s, e.block_start -= s, i = e.hash_size, t = i;
                        do {
                            n = e.head[--t], e.head[t] = n >= s ? n - s : 0
                        } while (--i);
                        i = s, t = i;
                        do {
                            n = e.prev[--t], e.prev[t] = n >= s ? n - s : 0
                        } while (--i);
                        r += s
                    }
                    if (0 === e.strm.avail_in) break;
                    if (i = d(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += i, e.lookahead + e.insert >= oe) for (a = e.strstart - e.insert, e.ins_h = e.window[a], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[a + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[a + oe - 1]) & e.hash_mask, e.prev[a & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = a, a++, e.insert--, !(e.lookahead + e.insert < oe));) ;
                } while (e.lookahead < ue && 0 !== e.strm.avail_in)
            }

            function h(e, t) {
                var i = 65535;
                for (i > e.pending_buf_size - 5 && (i = e.pending_buf_size - 5); ;) {
                    if (e.lookahead <= 1) {
                        if (m(e), 0 === e.lookahead && t === I) return ye;
                        if (0 === e.lookahead) break
                    }
                    e.strstart += e.lookahead, e.lookahead = 0;
                    var n = e.block_start + i;
                    if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, o(e, !1), 0 === e.strm.avail_out)) return ye;
                    if (e.strstart - e.block_start >= e.w_size - ue && (o(e, !1), 0 === e.strm.avail_out)) return ye
                }
                return e.insert = 0, t === F ? (o(e, !0), 0 === e.strm.avail_out ? ke : we) : (e.strstart > e.block_start && (o(e, !1), e.strm.avail_out), ye)
            }

            function p(e, t) {
                for (var i, n; ;) {
                    if (e.lookahead < ue) {
                        if (m(e), e.lookahead < ue && t === I) return ye;
                        if (0 === e.lookahead) break
                    }
                    if (i = 0, e.lookahead >= oe && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + oe - 1]) & e.hash_mask, i = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== i && e.strstart - i <= e.w_size - ue && (e.match_length = c(e, i)), e.match_length >= oe) if (n = E._tr_tally(e, e.strstart - e.match_start, e.match_length - oe), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= oe) {
                        e.match_length--;
                        do {
                            e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + oe - 1]) & e.hash_mask, i = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart
                        } while (0 != --e.match_length);
                        e.strstart++
                    } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask; else n = E._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
                    if (n && (o(e, !1), 0 === e.strm.avail_out)) return ye
                }
                return e.insert = e.strstart < oe - 1 ? e.strstart : oe - 1, t === F ? (o(e, !0), 0 === e.strm.avail_out ? ke : we) : e.last_lit && (o(e, !1), 0 === e.strm.avail_out) ? ye : ve
            }

            function f(e, t) {
                for (var i, n, r; ;) {
                    if (e.lookahead < ue) {
                        if (m(e), e.lookahead < ue && t === I) return ye;
                        if (0 === e.lookahead) break
                    }
                    if (i = 0, e.lookahead >= oe && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + oe - 1]) & e.hash_mask, i = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = oe - 1, 0 !== i && e.prev_length < e.max_lazy_match && e.strstart - i <= e.w_size - ue && (e.match_length = c(e, i), e.match_length <= 5 && (e.strategy === K || e.match_length === oe && e.strstart - e.match_start > 4096) && (e.match_length = oe - 1)), e.prev_length >= oe && e.match_length <= e.prev_length) {
                        r = e.strstart + e.lookahead - oe, n = E._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - oe), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
                        do {
                            ++e.strstart <= r && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + oe - 1]) & e.hash_mask, i = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart)
                        } while (0 != --e.prev_length);
                        if (e.match_available = 0, e.match_length = oe - 1, e.strstart++, n && (o(e, !1), 0 === e.strm.avail_out)) return ye
                    } else if (e.match_available) {
                        if (n = E._tr_tally(e, 0, e.window[e.strstart - 1]), n && o(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return ye
                    } else e.match_available = 1, e.strstart++, e.lookahead--
                }
                return e.match_available && (n = E._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < oe - 1 ? e.strstart : oe - 1, t === F ? (o(e, !0), 0 === e.strm.avail_out ? ke : we) : e.last_lit && (o(e, !1), 0 === e.strm.avail_out) ? ye : ve
            }

            function _(e, t) {
                for (var i, n, r, a, s = e.window; ;) {
                    if (e.lookahead <= le) {
                        if (m(e), e.lookahead <= le && t === I) return ye;
                        if (0 === e.lookahead) break
                    }
                    if (e.match_length = 0, e.lookahead >= oe && e.strstart > 0 && (r = e.strstart - 1, (n = s[r]) === s[++r] && n === s[++r] && n === s[++r])) {
                        a = e.strstart + le;
                        do {
                        } while (n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && r < a);
                        e.match_length = le - (a - r), e.match_length > e.lookahead && (e.match_length = e.lookahead)
                    }
                    if (e.match_length >= oe ? (i = E._tr_tally(e, 1, e.match_length - oe), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (i = E._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), i && (o(e, !1), 0 === e.strm.avail_out)) return ye
                }
                return e.insert = 0, t === F ? (o(e, !0), 0 === e.strm.avail_out ? ke : we) : e.last_lit && (o(e, !1), 0 === e.strm.avail_out) ? ye : ve
            }

            function g(e, t) {
                for (var i; ;) {
                    if (0 === e.lookahead && (m(e), 0 === e.lookahead)) {
                        if (t === I) return ye;
                        break
                    }
                    if (e.match_length = 0, i = E._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, i && (o(e, !1), 0 === e.strm.avail_out)) return ye
                }
                return e.insert = 0, t === F ? (o(e, !0), 0 === e.strm.avail_out ? ke : we) : e.last_lit && (o(e, !1), 0 === e.strm.avail_out) ? ye : ve
            }

            function y(e, t, i, n, r) {
                this.good_length = e, this.max_lazy = t, this.nice_length = i, this.max_chain = n, this.func = r
            }

            function v(e) {
                e.window_size = 2 * e.w_size, a(e.head), e.max_lazy_match = Y[e.level].max_lazy, e.good_match = Y[e.level].good_length, e.nice_match = Y[e.level].nice_length, e.max_chain_length = Y[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = oe - 1, e.match_available = 0, e.ins_h = 0
            }

            function k() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Q, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new x.Buf16(2 * ae), this.dyn_dtree = new x.Buf16(2 * (2 * ne + 1)), this.bl_tree = new x.Buf16(2 * (2 * re + 1)), a(this.dyn_ltree), a(this.dyn_dtree), a(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new x.Buf16(se + 1), this.heap = new x.Buf16(2 * ie + 1), a(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new x.Buf16(2 * ie + 1), a(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
            }

            function w(e) {
                var t;
                return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = Z, t = e.state, t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? ce : _e, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = I, E._tr_init(t), H) : n(e, U)
            }

            function T(e) {
                var t = w(e);
                return t === H && v(e.state), t
            }

            function b(e, t) {
                return e && e.state ? 2 !== e.state.wrap ? U : (e.state.gzhead = t, H) : U
            }

            function M(e, t, i, r, a, s) {
                if (!e) return U;
                var o = 1;
                if (t === R && (t = 6), r < 0 ? (o = 0, r = -r) : r > 15 && (o = 2, r -= 16), a < 1 || a > X || i !== Q || r < 8 || r > 15 || t < 0 || t > 9 || s < 0 || s > V) return n(e, U);
                8 === r && (r = 9);
                var l = new k;
                return e.state = l, l.strm = e, l.wrap = o, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = a + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + oe - 1) / oe), l.window = new x.Buf8(2 * l.w_size), l.head = new x.Buf16(l.hash_size), l.prev = new x.Buf16(l.w_size), l.lit_bufsize = 1 << a + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new x.Buf8(l.pending_buf_size), l.d_buf = l.lit_bufsize >> 1, l.l_buf = 3 * l.lit_bufsize, l.level = t, l.strategy = s, l.method = i, T(e)
            }

            function D(e, t) {
                return M(e, t, Q, ee, te, J)
            }

            function L(e, t) {
                var i, o, d, c;
                if (!e || !e.state || t > z || t < 0) return e ? n(e, U) : U;
                if (o = e.state, !e.output || !e.input && 0 !== e.avail_in || o.status === ge && t !== F) return n(e, 0 === e.avail_out ? N : U);
                if (o.strm = e, i = o.last_flush, o.last_flush = t, o.status === ce) if (2 === o.wrap) e.adler = 0, l(o, 31), l(o, 139), l(o, 8), o.gzhead ? (l(o, (o.gzhead.text ? 1 : 0) + (o.gzhead.hcrc ? 2 : 0) + (o.gzhead.extra ? 4 : 0) + (o.gzhead.name ? 8 : 0) + (o.gzhead.comment ? 16 : 0)), l(o, 255 & o.gzhead.time), l(o, o.gzhead.time >> 8 & 255), l(o, o.gzhead.time >> 16 & 255), l(o, o.gzhead.time >> 24 & 255), l(o, 9 === o.level ? 2 : o.strategy >= G || o.level < 2 ? 4 : 0), l(o, 255 & o.gzhead.os), o.gzhead.extra && o.gzhead.extra.length && (l(o, 255 & o.gzhead.extra.length), l(o, o.gzhead.extra.length >> 8 & 255)), o.gzhead.hcrc && (e.adler = O(e.adler, o.pending_buf, o.pending, 0)), o.gzindex = 0, o.status = me) : (l(o, 0), l(o, 0), l(o, 0), l(o, 0), l(o, 0), l(o, 9 === o.level ? 2 : o.strategy >= G || o.level < 2 ? 4 : 0), l(o, Te), o.status = _e); else {
                    var m = Q + (o.w_bits - 8 << 4) << 8, h = -1;
                    h = o.strategy >= G || o.level < 2 ? 0 : o.level < 6 ? 1 : 6 === o.level ? 2 : 3, m |= h << 6, 0 !== o.strstart && (m |= de), m += 31 - m % 31, o.status = _e, u(o, m), 0 !== o.strstart && (u(o, e.adler >>> 16), u(o, 65535 & e.adler)), e.adler = 1
                }
                if (o.status === me) if (o.gzhead.extra) {
                    for (d = o.pending; o.gzindex < (65535 & o.gzhead.extra.length) && (o.pending !== o.pending_buf_size || (o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), s(e), d = o.pending, o.pending !== o.pending_buf_size));) l(o, 255 & o.gzhead.extra[o.gzindex]), o.gzindex++;
                    o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), o.gzindex === o.gzhead.extra.length && (o.gzindex = 0, o.status = he)
                } else o.status = he;
                if (o.status === he) if (o.gzhead.name) {
                    d = o.pending;
                    do {
                        if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), s(e), d = o.pending, o.pending === o.pending_buf_size)) {
                            c = 1;
                            break
                        }
                        c = o.gzindex < o.gzhead.name.length ? 255 & o.gzhead.name.charCodeAt(o.gzindex++) : 0, l(o, c)
                    } while (0 !== c);
                    o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), 0 === c && (o.gzindex = 0, o.status = pe)
                } else o.status = pe;
                if (o.status === pe) if (o.gzhead.comment) {
                    d = o.pending;
                    do {
                        if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), s(e), d = o.pending, o.pending === o.pending_buf_size)) {
                            c = 1;
                            break
                        }
                        c = o.gzindex < o.gzhead.comment.length ? 255 & o.gzhead.comment.charCodeAt(o.gzindex++) : 0, l(o, c)
                    } while (0 !== c);
                    o.gzhead.hcrc && o.pending > d && (e.adler = O(e.adler, o.pending_buf, o.pending - d, d)), 0 === c && (o.status = fe)
                } else o.status = fe;
                if (o.status === fe && (o.gzhead.hcrc ? (o.pending + 2 > o.pending_buf_size && s(e), o.pending + 2 <= o.pending_buf_size && (l(o, 255 & e.adler), l(o, e.adler >> 8 & 255), e.adler = 0, o.status = _e)) : o.status = _e), 0 !== o.pending) {
                    if (s(e), 0 === e.avail_out) return o.last_flush = -1, H
                } else if (0 === e.avail_in && r(t) <= r(i) && t !== F) return n(e, N);
                if (o.status === ge && 0 !== e.avail_in) return n(e, N);
                if (0 !== e.avail_in || 0 !== o.lookahead || t !== I && o.status !== ge) {
                    var p = o.strategy === G ? g(o, t) : o.strategy === q ? _(o, t) : Y[o.level].func(o, t);
                    if (p !== ke && p !== we || (o.status = ge), p === ye || p === ke) return 0 === e.avail_out && (o.last_flush = -1), H;
                    if (p === ve && (t === j ? E._tr_align(o) : t !== z && (E._tr_stored_block(o, 0, 0, !1), t === W && (a(o.head), 0 === o.lookahead && (o.strstart = 0, o.block_start = 0, o.insert = 0))), s(e), 0 === e.avail_out)) return o.last_flush = -1, H
                }
                return t !== F ? H : o.wrap <= 0 ? B : (2 === o.wrap ? (l(o, 255 & e.adler), l(o, e.adler >> 8 & 255), l(o, e.adler >> 16 & 255), l(o, e.adler >> 24 & 255), l(o, 255 & e.total_in), l(o, e.total_in >> 8 & 255), l(o, e.total_in >> 16 & 255), l(o, e.total_in >> 24 & 255)) : (u(o, e.adler >>> 16), u(o, 65535 & e.adler)), s(e), o.wrap > 0 && (o.wrap = -o.wrap), 0 !== o.pending ? H : B)
            }

            function A(e) {
                var t;
                return e && e.state ? (t = e.state.status) !== ce && t !== me && t !== he && t !== pe && t !== fe && t !== _e && t !== ge ? n(e, U) : (e.state = null, t === _e ? n(e, $) : H) : U
            }

            function S(e, t) {
                var i, n, r, s, o, l, u, d, c = t.length;
                if (!e || !e.state) return U;
                if (i = e.state, 2 === (s = i.wrap) || 1 === s && i.status !== ce || i.lookahead) return U;
                for (1 === s && (e.adler = C(e.adler, t, c, 0)), i.wrap = 0, c >= i.w_size && (0 === s && (a(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0), d = new x.Buf8(i.w_size), x.arraySet(d, t, c - i.w_size, i.w_size, 0), t = d, c = i.w_size), o = e.avail_in, l = e.next_in, u = e.input, e.avail_in = c, e.next_in = 0, e.input = t, m(i); i.lookahead >= oe;) {
                    n = i.strstart, r = i.lookahead - (oe - 1);
                    do {
                        i.ins_h = (i.ins_h << i.hash_shift ^ i.window[n + oe - 1]) & i.hash_mask, i.prev[n & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = n, n++
                    } while (--r);
                    i.strstart = n, i.lookahead = oe - 1, m(i)
                }
                return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = oe - 1, i.match_available = 0, e.next_in = l, e.input = u, e.avail_in = o, i.wrap = s, H
            }

            var Y, x = e("../utils/common"), E = e("./trees"), C = e("./adler32"), O = e("./crc32"), P = e("./messages"), I = 0, j = 1, W = 3, F = 4, z = 5, H = 0, B = 1, U = -2, $ = -3, N = -5,
                R = -1, K = 1, G = 2, q = 3, V = 4, J = 0, Z = 2, Q = 8, X = 9, ee = 15, te = 8, ie = 286, ne = 30, re = 19, ae = 2 * ie + 1, se = 15, oe = 3, le = 258, ue = le + oe + 1, de = 32,
                ce = 42, me = 69, he = 73, pe = 91, fe = 103, _e = 113, ge = 666, ye = 1, ve = 2, ke = 3, we = 4, Te = 3;
            Y = [new y(0, 0, 0, 0, h), new y(4, 4, 8, 4, p), new y(4, 5, 16, 8, p), new y(4, 6, 32, 32, p), new y(4, 4, 16, 16, f), new y(8, 16, 32, 32, f), new y(8, 16, 128, 128, f), new y(8, 32, 128, 256, f), new y(32, 128, 258, 1024, f), new y(32, 258, 258, 4096, f)], i.deflateInit = D, i.deflateInit2 = M, i.deflateReset = T, i.deflateResetKeep = w, i.deflateSetHeader = b, i.deflate = L, i.deflateEnd = A, i.deflateSetDictionary = S, i.deflateInfo = "pako deflate (from Nodeca project)"
        }, {"../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52}], 47: [function (e, t, i) {
            "use strict";

            function n() {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
            }

            t.exports = n
        }, {}], 48: [function (e, t, i) {
            "use strict";
            t.exports = function (e, t) {
                var i, n, r, a, s, o, l, u, d, c, m, h, p, f, _, g, y, v, k, w, T, b, M, D, L;
                i = e.state, n = e.next_in, D = e.input, r = n + (e.avail_in - 5), a = e.next_out, L = e.output, s = a - (t - e.avail_out), o = a + (e.avail_out - 257), l = i.dmax, u = i.wsize, d = i.whave, c = i.wnext, m = i.window, h = i.hold, p = i.bits, f = i.lencode, _ = i.distcode, g = (1 << i.lenbits) - 1, y = (1 << i.distbits) - 1;
                e:do {
                    p < 15 && (h += D[n++] << p, p += 8, h += D[n++] << p, p += 8), v = f[h & g];
                    t:for (; ;) {
                        if (k = v >>> 24, h >>>= k, p -= k, 0 === (k = v >>> 16 & 255)) L[a++] = 65535 & v; else {
                            if (!(16 & k)) {
                                if (0 == (64 & k)) {
                                    v = f[(65535 & v) + (h & (1 << k) - 1)];
                                    continue t
                                }
                                if (32 & k) {
                                    i.mode = 12;
                                    break e
                                }
                                e.msg = "invalid literal/length code", i.mode = 30;
                                break e
                            }
                            w = 65535 & v, k &= 15, k && (p < k && (h += D[n++] << p, p += 8), w += h & (1 << k) - 1, h >>>= k, p -= k), p < 15 && (h += D[n++] << p, p += 8, h += D[n++] << p, p += 8), v = _[h & y];
                            i:for (; ;) {
                                if (k = v >>> 24, h >>>= k, p -= k, !(16 & (k = v >>> 16 & 255))) {
                                    if (0 == (64 & k)) {
                                        v = _[(65535 & v) + (h & (1 << k) - 1)];
                                        continue i
                                    }
                                    e.msg = "invalid distance code", i.mode = 30;
                                    break e
                                }
                                if (T = 65535 & v, k &= 15, p < k && (h += D[n++] << p, (p += 8) < k && (h += D[n++] << p, p += 8)), (T += h & (1 << k) - 1) > l) {
                                    e.msg = "invalid distance too far back", i.mode = 30;
                                    break e
                                }
                                if (h >>>= k, p -= k, k = a - s, T > k) {
                                    if ((k = T - k) > d && i.sane) {
                                        e.msg = "invalid distance too far back", i.mode = 30;
                                        break e
                                    }
                                    if (b = 0, M = m, 0 === c) {
                                        if (b += u - k, k < w) {
                                            w -= k;
                                            do {
                                                L[a++] = m[b++]
                                            } while (--k);
                                            b = a - T, M = L
                                        }
                                    } else if (c < k) {
                                        if (b += u + c - k, (k -= c) < w) {
                                            w -= k;
                                            do {
                                                L[a++] = m[b++]
                                            } while (--k);
                                            if (b = 0, c < w) {
                                                k = c, w -= k;
                                                do {
                                                    L[a++] = m[b++]
                                                } while (--k);
                                                b = a - T, M = L
                                            }
                                        }
                                    } else if (b += c - k, k < w) {
                                        w -= k;
                                        do {
                                            L[a++] = m[b++]
                                        } while (--k);
                                        b = a - T, M = L
                                    }
                                    for (; w > 2;) L[a++] = M[b++], L[a++] = M[b++], L[a++] = M[b++], w -= 3;
                                    w && (L[a++] = M[b++], w > 1 && (L[a++] = M[b++]))
                                } else {
                                    b = a - T;
                                    do {
                                        L[a++] = L[b++], L[a++] = L[b++], L[a++] = L[b++], w -= 3
                                    } while (w > 2);
                                    w && (L[a++] = L[b++], w > 1 && (L[a++] = L[b++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (n < r && a < o);
                w = p >> 3, n -= w, p -= w << 3, h &= (1 << p) - 1, e.next_in = n, e.next_out = a, e.avail_in = n < r ? r - n + 5 : 5 - (n - r), e.avail_out = a < o ? o - a + 257 : 257 - (a - o), i.hold = h, i.bits = p
            }
        }, {}], 49: [function (e, t, i) {
            "use strict";

            function n(e) {
                return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24)
            }

            function r() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new y.Buf16(320), this.work = new y.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
            }

            function a(e) {
                var t;
                return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = W, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new y.Buf32(fe), t.distcode = t.distdyn = new y.Buf32(_e), t.sane = 1, t.back = -1, Y) : C
            }

            function s(e) {
                var t;
                return e && e.state ? (t = e.state, t.wsize = 0, t.whave = 0, t.wnext = 0, a(e)) : C
            }

            function o(e, t) {
                var i, n;
                return e && e.state ? (n = e.state, t < 0 ? (i = 0, t = -t) : (i = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? C : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = i, n.wbits = t, s(e))) : C
            }

            function l(e, t) {
                var i, n;
                return e ? (n = new r, e.state = n, n.window = null, i = o(e, t), i !== Y && (e.state = null), i) : C
            }

            function u(e) {
                return l(e, ge)
            }

            function d(e) {
                if (ye) {
                    var t;
                    for (_ = new y.Buf32(512), g = new y.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
                    for (; t < 256;) e.lens[t++] = 9;
                    for (; t < 280;) e.lens[t++] = 7;
                    for (; t < 288;) e.lens[t++] = 8;
                    for (T(M, e.lens, 0, 288, _, 0, e.work, {bits: 9}), t = 0; t < 32;) e.lens[t++] = 5;
                    T(D, e.lens, 0, 32, g, 0, e.work, {bits: 5}), ye = !1
                }
                e.lencode = _, e.lenbits = 9, e.distcode = g, e.distbits = 5
            }

            function c(e, t, i, n) {
                var r, a = e.state;
                return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new y.Buf8(a.wsize)), n >= a.wsize ? (y.arraySet(a.window, t, i - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) : (r = a.wsize - a.wnext, r > n && (r = n), y.arraySet(a.window, t, i - n, r, a.wnext), n -= r, n ? (y.arraySet(a.window, t, i - n, n, 0), a.wnext = n, a.whave = a.wsize) : (a.wnext += r, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += r))), 0
            }

            function m(e, t) {
                var i, r, a, s, o, l, u, m, h, p, f, _, g, fe, _e, ge, ye, ve, ke, we, Te, be, Me, De, Le = 0, Ae = new y.Buf8(4),
                    Se = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return C;
                i = e.state, i.mode === q && (i.mode = V), o = e.next_out, a = e.output, u = e.avail_out, s = e.next_in, r = e.input, l = e.avail_in, m = i.hold, h = i.bits, p = l, f = u, be = Y;
                e:for (; ;) switch (i.mode) {
                    case W:
                        if (0 === i.wrap) {
                            i.mode = V;
                            break
                        }
                        for (; h < 16;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if (2 & i.wrap && 35615 === m) {
                            i.check = 0, Ae[0] = 255 & m, Ae[1] = m >>> 8 & 255, i.check = k(i.check, Ae, 2, 0), m = 0, h = 0, i.mode = F;
                            break
                        }
                        if (i.flags = 0, i.head && (i.head.done = !1), !(1 & i.wrap) || (((255 & m) << 8) + (m >> 8)) % 31) {
                            e.msg = "incorrect header check", i.mode = me;
                            break
                        }
                        if ((15 & m) !== j) {
                            e.msg = "unknown compression method", i.mode = me;
                            break
                        }
                        if (m >>>= 4, h -= 4, Te = 8 + (15 & m), 0 === i.wbits) i.wbits = Te; else if (Te > i.wbits) {
                            e.msg = "invalid window size", i.mode = me;
                            break
                        }
                        i.dmax = 1 << Te, e.adler = i.check = 1, i.mode = 512 & m ? K : q, m = 0, h = 0;
                        break;
                    case F:
                        for (; h < 16;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if (i.flags = m, (255 & i.flags) !== j) {
                            e.msg = "unknown compression method", i.mode = me;
                            break
                        }
                        if (57344 & i.flags) {
                            e.msg = "unknown header flags set", i.mode = me;
                            break
                        }
                        i.head && (i.head.text = m >> 8 & 1), 512 & i.flags && (Ae[0] = 255 & m, Ae[1] = m >>> 8 & 255, i.check = k(i.check, Ae, 2, 0)), m = 0, h = 0, i.mode = z;
                    case z:
                        for (; h < 32;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        i.head && (i.head.time = m), 512 & i.flags && (Ae[0] = 255 & m, Ae[1] = m >>> 8 & 255, Ae[2] = m >>> 16 & 255, Ae[3] = m >>> 24 & 255, i.check = k(i.check, Ae, 4, 0)), m = 0, h = 0, i.mode = H;
                    case H:
                        for (; h < 16;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        i.head && (i.head.xflags = 255 & m, i.head.os = m >> 8), 512 & i.flags && (Ae[0] = 255 & m, Ae[1] = m >>> 8 & 255, i.check = k(i.check, Ae, 2, 0)), m = 0, h = 0, i.mode = B;
                    case B:
                        if (1024 & i.flags) {
                            for (; h < 16;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            i.length = m, i.head && (i.head.extra_len = m), 512 & i.flags && (Ae[0] = 255 & m, Ae[1] = m >>> 8 & 255, i.check = k(i.check, Ae, 2, 0)), m = 0, h = 0
                        } else i.head && (i.head.extra = null);
                        i.mode = U;
                    case U:
                        if (1024 & i.flags && (_ = i.length, _ > l && (_ = l), _ && (i.head && (Te = i.head.extra_len - i.length, i.head.extra || (i.head.extra = new Array(i.head.extra_len)), y.arraySet(i.head.extra, r, s, _, Te)), 512 & i.flags && (i.check = k(i.check, r, _, s)), l -= _, s += _, i.length -= _), i.length)) break e;
                        i.length = 0, i.mode = $;
                    case $:
                        if (2048 & i.flags) {
                            if (0 === l) break e;
                            _ = 0;
                            do {
                                Te = r[s + _++], i.head && Te && i.length < 65536 && (i.head.name += String.fromCharCode(Te))
                            } while (Te && _ < l);
                            if (512 & i.flags && (i.check = k(i.check, r, _, s)), l -= _, s += _, Te) break e
                        } else i.head && (i.head.name = null);
                        i.length = 0, i.mode = N;
                    case N:
                        if (4096 & i.flags) {
                            if (0 === l) break e;
                            _ = 0;
                            do {
                                Te = r[s + _++], i.head && Te && i.length < 65536 && (i.head.comment += String.fromCharCode(Te))
                            } while (Te && _ < l);
                            if (512 & i.flags && (i.check = k(i.check, r, _, s)), l -= _, s += _, Te) break e
                        } else i.head && (i.head.comment = null);
                        i.mode = R;
                    case R:
                        if (512 & i.flags) {
                            for (; h < 16;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            if (m !== (65535 & i.check)) {
                                e.msg = "header crc mismatch", i.mode = me;
                                break
                            }
                            m = 0, h = 0
                        }
                        i.head && (i.head.hcrc = i.flags >> 9 & 1, i.head.done = !0), e.adler = i.check = 0, i.mode = q;
                        break;
                    case K:
                        for (; h < 32;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        e.adler = i.check = n(m), m = 0, h = 0, i.mode = G;
                    case G:
                        if (0 === i.havedict) return e.next_out = o, e.avail_out = u, e.next_in = s, e.avail_in = l, i.hold = m, i.bits = h, E;
                        e.adler = i.check = 1, i.mode = q;
                    case q:
                        if (t === A || t === S) break e;
                    case V:
                        if (i.last) {
                            m >>>= 7 & h, h -= 7 & h, i.mode = ue;
                            break
                        }
                        for (; h < 3;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        switch (i.last = 1 & m, m >>>= 1, h -= 1, 3 & m) {
                            case 0:
                                i.mode = J;
                                break;
                            case 1:
                                if (d(i), i.mode = ie, t === S) {
                                    m >>>= 2, h -= 2;
                                    break e
                                }
                                break;
                            case 2:
                                i.mode = X;
                                break;
                            case 3:
                                e.msg = "invalid block type", i.mode = me
                        }
                        m >>>= 2, h -= 2;
                        break;
                    case J:
                        for (m >>>= 7 & h, h -= 7 & h; h < 32;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if ((65535 & m) != (m >>> 16 ^ 65535)) {
                            e.msg = "invalid stored block lengths", i.mode = me;
                            break
                        }
                        if (i.length = 65535 & m, m = 0, h = 0, i.mode = Z, t === S) break e;
                    case Z:
                        i.mode = Q;
                    case Q:
                        if (_ = i.length) {
                            if (_ > l && (_ = l), _ > u && (_ = u), 0 === _) break e;
                            y.arraySet(a, r, s, _, o), l -= _, s += _, u -= _, o += _, i.length -= _;
                            break
                        }
                        i.mode = q;
                        break;
                    case X:
                        for (; h < 14;) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if (i.nlen = 257 + (31 & m), m >>>= 5, h -= 5, i.ndist = 1 + (31 & m), m >>>= 5, h -= 5, i.ncode = 4 + (15 & m), m >>>= 4, h -= 4, i.nlen > 286 || i.ndist > 30) {
                            e.msg = "too many length or distance symbols", i.mode = me;
                            break
                        }
                        i.have = 0, i.mode = ee;
                    case ee:
                        for (; i.have < i.ncode;) {
                            for (; h < 3;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            i.lens[Se[i.have++]] = 7 & m, m >>>= 3, h -= 3
                        }
                        for (; i.have < 19;) i.lens[Se[i.have++]] = 0;
                        if (i.lencode = i.lendyn, i.lenbits = 7, Me = {bits: i.lenbits}, be = T(b, i.lens, 0, 19, i.lencode, 0, i.work, Me), i.lenbits = Me.bits, be) {
                            e.msg = "invalid code lengths set", i.mode = me;
                            break
                        }
                        i.have = 0, i.mode = te;
                    case te:
                        for (; i.have < i.nlen + i.ndist;) {
                            for (; Le = i.lencode[m & (1 << i.lenbits) - 1], _e = Le >>> 24, ge = Le >>> 16 & 255, ye = 65535 & Le, !(_e <= h);) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            if (ye < 16) m >>>= _e, h -= _e, i.lens[i.have++] = ye; else {
                                if (16 === ye) {
                                    for (De = _e + 2; h < De;) {
                                        if (0 === l) break e;
                                        l--, m += r[s++] << h, h += 8
                                    }
                                    if (m >>>= _e, h -= _e, 0 === i.have) {
                                        e.msg = "invalid bit length repeat", i.mode = me;
                                        break
                                    }
                                    Te = i.lens[i.have - 1], _ = 3 + (3 & m), m >>>= 2, h -= 2
                                } else if (17 === ye) {
                                    for (De = _e + 3; h < De;) {
                                        if (0 === l) break e;
                                        l--, m += r[s++] << h, h += 8
                                    }
                                    m >>>= _e, h -= _e, Te = 0, _ = 3 + (7 & m), m >>>= 3, h -= 3
                                } else {
                                    for (De = _e + 7; h < De;) {
                                        if (0 === l) break e;
                                        l--, m += r[s++] << h, h += 8
                                    }
                                    m >>>= _e, h -= _e, Te = 0, _ = 11 + (127 & m), m >>>= 7, h -= 7
                                }
                                if (i.have + _ > i.nlen + i.ndist) {
                                    e.msg = "invalid bit length repeat", i.mode = me;
                                    break
                                }
                                for (; _--;) i.lens[i.have++] = Te
                            }
                        }
                        if (i.mode === me) break;
                        if (0 === i.lens[256]) {
                            e.msg = "invalid code -- missing end-of-block", i.mode = me;
                            break
                        }
                        if (i.lenbits = 9, Me = {bits: i.lenbits}, be = T(M, i.lens, 0, i.nlen, i.lencode, 0, i.work, Me), i.lenbits = Me.bits, be) {
                            e.msg = "invalid literal/lengths set", i.mode = me;
                            break
                        }
                        if (i.distbits = 6, i.distcode = i.distdyn, Me = {bits: i.distbits}, be = T(D, i.lens, i.nlen, i.ndist, i.distcode, 0, i.work, Me), i.distbits = Me.bits, be) {
                            e.msg = "invalid distances set", i.mode = me;
                            break
                        }
                        if (i.mode = ie, t === S) break e;
                    case ie:
                        i.mode = ne;
                    case ne:
                        if (l >= 6 && u >= 258) {
                            e.next_out = o, e.avail_out = u, e.next_in = s, e.avail_in = l, i.hold = m, i.bits = h, w(e, f), o = e.next_out, a = e.output, u = e.avail_out, s = e.next_in, r = e.input, l = e.avail_in, m = i.hold, h = i.bits, i.mode === q && (i.back = -1);
                            break
                        }
                        for (i.back = 0; Le = i.lencode[m & (1 << i.lenbits) - 1], _e = Le >>> 24, ge = Le >>> 16 & 255, ye = 65535 & Le, !(_e <= h);) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if (ge && 0 == (240 & ge)) {
                            for (ve = _e, ke = ge, we = ye; Le = i.lencode[we + ((m & (1 << ve + ke) - 1) >> ve)], _e = Le >>> 24, ge = Le >>> 16 & 255, ye = 65535 & Le, !(ve + _e <= h);) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            m >>>= ve, h -= ve, i.back += ve
                        }
                        if (m >>>= _e, h -= _e,
                                i.back += _e, i.length = ye, 0 === ge) {
                            i.mode = le;
                            break
                        }
                        if (32 & ge) {
                            i.back = -1, i.mode = q;
                            break
                        }
                        if (64 & ge) {
                            e.msg = "invalid literal/length code", i.mode = me;
                            break
                        }
                        i.extra = 15 & ge, i.mode = re;
                    case re:
                        if (i.extra) {
                            for (De = i.extra; h < De;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            i.length += m & (1 << i.extra) - 1, m >>>= i.extra, h -= i.extra, i.back += i.extra
                        }
                        i.was = i.length, i.mode = ae;
                    case ae:
                        for (; Le = i.distcode[m & (1 << i.distbits) - 1], _e = Le >>> 24, ge = Le >>> 16 & 255, ye = 65535 & Le, !(_e <= h);) {
                            if (0 === l) break e;
                            l--, m += r[s++] << h, h += 8
                        }
                        if (0 == (240 & ge)) {
                            for (ve = _e, ke = ge, we = ye; Le = i.distcode[we + ((m & (1 << ve + ke) - 1) >> ve)], _e = Le >>> 24, ge = Le >>> 16 & 255, ye = 65535 & Le, !(ve + _e <= h);) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            m >>>= ve, h -= ve, i.back += ve
                        }
                        if (m >>>= _e, h -= _e, i.back += _e, 64 & ge) {
                            e.msg = "invalid distance code", i.mode = me;
                            break
                        }
                        i.offset = ye, i.extra = 15 & ge, i.mode = se;
                    case se:
                        if (i.extra) {
                            for (De = i.extra; h < De;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            i.offset += m & (1 << i.extra) - 1, m >>>= i.extra, h -= i.extra, i.back += i.extra
                        }
                        if (i.offset > i.dmax) {
                            e.msg = "invalid distance too far back", i.mode = me;
                            break
                        }
                        i.mode = oe;
                    case oe:
                        if (0 === u) break e;
                        if (_ = f - u, i.offset > _) {
                            if ((_ = i.offset - _) > i.whave && i.sane) {
                                e.msg = "invalid distance too far back", i.mode = me;
                                break
                            }
                            _ > i.wnext ? (_ -= i.wnext, g = i.wsize - _) : g = i.wnext - _, _ > i.length && (_ = i.length), fe = i.window
                        } else fe = a, g = o - i.offset, _ = i.length;
                        _ > u && (_ = u), u -= _, i.length -= _;
                        do {
                            a[o++] = fe[g++]
                        } while (--_);
                        0 === i.length && (i.mode = ne);
                        break;
                    case le:
                        if (0 === u) break e;
                        a[o++] = i.length, u--, i.mode = ne;
                        break;
                    case ue:
                        if (i.wrap) {
                            for (; h < 32;) {
                                if (0 === l) break e;
                                l--, m |= r[s++] << h, h += 8
                            }
                            if (f -= u, e.total_out += f, i.total += f, f && (e.adler = i.check = i.flags ? k(i.check, a, f, o - f) : v(i.check, a, f, o - f)), f = u, (i.flags ? m : n(m)) !== i.check) {
                                e.msg = "incorrect data check", i.mode = me;
                                break
                            }
                            m = 0, h = 0
                        }
                        i.mode = de;
                    case de:
                        if (i.wrap && i.flags) {
                            for (; h < 32;) {
                                if (0 === l) break e;
                                l--, m += r[s++] << h, h += 8
                            }
                            if (m !== (4294967295 & i.total)) {
                                e.msg = "incorrect length check", i.mode = me;
                                break
                            }
                            m = 0, h = 0
                        }
                        i.mode = ce;
                    case ce:
                        be = x;
                        break e;
                    case me:
                        be = O;
                        break e;
                    case he:
                        return P;
                    case pe:
                    default:
                        return C
                }
                return e.next_out = o, e.avail_out = u, e.next_in = s, e.avail_in = l, i.hold = m, i.bits = h, (i.wsize || f !== e.avail_out && i.mode < me && (i.mode < ue || t !== L)) && c(e, e.output, e.next_out, f - e.avail_out) ? (i.mode = he, P) : (p -= e.avail_in, f -= e.avail_out, e.total_in += p, e.total_out += f, i.total += f, i.wrap && f && (e.adler = i.check = i.flags ? k(i.check, a, f, e.next_out - f) : v(i.check, a, f, e.next_out - f)), e.data_type = i.bits + (i.last ? 64 : 0) + (i.mode === q ? 128 : 0) + (i.mode === ie || i.mode === Z ? 256 : 0), (0 === p && 0 === f || t === L) && be === Y && (be = I), be)
            }

            function h(e) {
                if (!e || !e.state) return C;
                var t = e.state;
                return t.window && (t.window = null), e.state = null, Y
            }

            function p(e, t) {
                var i;
                return e && e.state ? (i = e.state, 0 == (2 & i.wrap) ? C : (i.head = t, t.done = !1, Y)) : C
            }

            function f(e, t) {
                var i, n, r = t.length;
                return e && e.state ? (i = e.state, 0 !== i.wrap && i.mode !== G ? C : i.mode === G && (n = 1, (n = v(n, t, r, 0)) !== i.check) ? O : c(e, t, r, r) ? (i.mode = he, P) : (i.havedict = 1, Y)) : C
            }

            var _, g, y = e("../utils/common"), v = e("./adler32"), k = e("./crc32"), w = e("./inffast"), T = e("./inftrees"), b = 0, M = 1, D = 2, L = 4, A = 5, S = 6, Y = 0, x = 1, E = 2, C = -2,
                O = -3, P = -4, I = -5, j = 8, W = 1, F = 2, z = 3, H = 4, B = 5, U = 6, $ = 7, N = 8, R = 9, K = 10, G = 11, q = 12, V = 13, J = 14, Z = 15, Q = 16, X = 17, ee = 18, te = 19, ie = 20,
                ne = 21, re = 22, ae = 23, se = 24, oe = 25, le = 26, ue = 27, de = 28, ce = 29, me = 30, he = 31, pe = 32, fe = 852, _e = 592, ge = 15, ye = !0;
            i.inflateReset = s, i.inflateReset2 = o, i.inflateResetKeep = a, i.inflateInit = u, i.inflateInit2 = l, i.inflate = m, i.inflateEnd = h, i.inflateGetHeader = p, i.inflateSetDictionary = f, i.inflateInfo = "pako inflate (from Nodeca project)"
        }, {"../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50}], 50: [function (e, t, i) {
            "use strict";
            var n = e("../utils/common"), r = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                s = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                o = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            t.exports = function (e, t, i, l, u, d, c, m) {
                var h, p, f, _, g, y, v, k, w, T = m.bits, b = 0, M = 0, D = 0, L = 0, A = 0, S = 0, Y = 0, x = 0, E = 0, C = 0, O = null, P = 0, I = new n.Buf16(16), j = new n.Buf16(16), W = null,
                    F = 0;
                for (b = 0; b <= 15; b++) I[b] = 0;
                for (M = 0; M < l; M++) I[t[i + M]]++;
                for (A = T, L = 15; L >= 1 && 0 === I[L]; L--) ;
                if (A > L && (A = L), 0 === L) return u[d++] = 20971520, u[d++] = 20971520, m.bits = 1, 0;
                for (D = 1; D < L && 0 === I[D]; D++) ;
                for (A < D && (A = D), x = 1, b = 1; b <= 15; b++) if (x <<= 1, (x -= I[b]) < 0) return -1;
                if (x > 0 && (0 === e || 1 !== L)) return -1;
                for (j[1] = 0, b = 1; b < 15; b++) j[b + 1] = j[b] + I[b];
                for (M = 0; M < l; M++) 0 !== t[i + M] && (c[j[t[i + M]]++] = M);
                if (0 === e ? (O = W = c, y = 19) : 1 === e ? (O = r, P -= 257, W = a, F -= 257, y = 256) : (O = s, W = o, y = -1), C = 0, M = 0, b = D, g = d, S = A, Y = 0, f = -1, E = 1 << A, _ = E - 1, 1 === e && E > 852 || 2 === e && E > 592) return 1;
                for (var z = 0; ;) {
                    z++, v = b - Y, c[M] < y ? (k = 0, w = c[M]) : c[M] > y ? (k = W[F + c[M]], w = O[P + c[M]]) : (k = 96, w = 0), h = 1 << b - Y, p = 1 << S, D = p;
                    do {
                        p -= h, u[g + (C >> Y) + p] = v << 24 | k << 16 | w | 0
                    } while (0 !== p);
                    for (h = 1 << b - 1; C & h;) h >>= 1;
                    if (0 !== h ? (C &= h - 1, C += h) : C = 0, M++, 0 == --I[b]) {
                        if (b === L) break;
                        b = t[i + c[M]]
                    }
                    if (b > A && (C & _) !== f) {
                        for (0 === Y && (Y = A), g += D, S = b - Y, x = 1 << S; S + Y < L && !((x -= I[S + Y]) <= 0);) S++, x <<= 1;
                        if (E += 1 << S, 1 === e && E > 852 || 2 === e && E > 592) return 1;
                        f = C & _, u[f] = A << 24 | S << 16 | g - d | 0
                    }
                }
                return 0 !== C && (u[g + C] = b - Y << 24 | 64 << 16 | 0), m.bits = A, 0
            }
        }, {"../utils/common": 41}], 51: [function (e, t, i) {
            "use strict";
            t.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }, {}], 52: [function (e, t, i) {
            "use strict";

            function n(e) {
                for (var t = e.length; --t >= 0;) e[t] = 0
            }

            function r(e, t, i, n, r) {
                this.static_tree = e, this.extra_bits = t, this.extra_base = i, this.elems = n, this.max_length = r, this.has_stree = e && e.length
            }

            function a(e, t) {
                this.dyn_tree = e, this.max_code = 0, this.stat_desc = t
            }

            function s(e) {
                return e < 256 ? ae[e] : ae[256 + (e >>> 7)]
            }

            function o(e, t) {
                e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255
            }

            function l(e, t, i) {
                e.bi_valid > G - i ? (e.bi_buf |= t << e.bi_valid & 65535, o(e, e.bi_buf), e.bi_buf = t >> G - e.bi_valid, e.bi_valid += i - G) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += i)
            }

            function u(e, t, i) {
                l(e, i[2 * t], i[2 * t + 1])
            }

            function d(e, t) {
                var i = 0;
                do {
                    i |= 1 & e, e >>>= 1, i <<= 1
                } while (--t > 0);
                return i >>> 1
            }

            function c(e) {
                16 === e.bi_valid ? (o(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8)
            }

            function m(e, t) {
                var i, n, r, a, s, o, l = t.dyn_tree, u = t.max_code, d = t.stat_desc.static_tree, c = t.stat_desc.has_stree, m = t.stat_desc.extra_bits, h = t.stat_desc.extra_base,
                    p = t.stat_desc.max_length, f = 0;
                for (a = 0; a <= K; a++) e.bl_count[a] = 0;
                for (l[2 * e.heap[e.heap_max] + 1] = 0, i = e.heap_max + 1; i < R; i++) n = e.heap[i], a = l[2 * l[2 * n + 1] + 1] + 1, a > p && (a = p, f++), l[2 * n + 1] = a, n > u || (e.bl_count[a]++, s = 0, n >= h && (s = m[n - h]), o = l[2 * n], e.opt_len += o * (a + s), c && (e.static_len += o * (d[2 * n + 1] + s)));
                if (0 !== f) {
                    do {
                        for (a = p - 1; 0 === e.bl_count[a];) a--;
                        e.bl_count[a]--, e.bl_count[a + 1] += 2, e.bl_count[p]--, f -= 2
                    } while (f > 0);
                    for (a = p; 0 !== a; a--) for (n = e.bl_count[a]; 0 !== n;) (r = e.heap[--i]) > u || (l[2 * r + 1] !== a && (e.opt_len += (a - l[2 * r + 1]) * l[2 * r], l[2 * r + 1] = a), n--)
                }
            }

            function h(e, t, i) {
                var n, r, a = new Array(K + 1), s = 0;
                for (n = 1; n <= K; n++) a[n] = s = s + i[n - 1] << 1;
                for (r = 0; r <= t; r++) {
                    var o = e[2 * r + 1];
                    0 !== o && (e[2 * r] = d(a[o]++, o))
                }
            }

            function p() {
                var e, t, i, n, a, s = new Array(K + 1);
                for (i = 0, n = 0; n < H - 1; n++) for (oe[n] = i, e = 0; e < 1 << X[n]; e++) se[i++] = n;
                for (se[i - 1] = n, a = 0, n = 0; n < 16; n++) for (le[n] = a, e = 0; e < 1 << ee[n]; e++) ae[a++] = n;
                for (a >>= 7; n < $; n++) for (le[n] = a << 7, e = 0; e < 1 << ee[n] - 7; e++) ae[256 + a++] = n;
                for (t = 0; t <= K; t++) s[t] = 0;
                for (e = 0; e <= 143;) ne[2 * e + 1] = 8, e++, s[8]++;
                for (; e <= 255;) ne[2 * e + 1] = 9, e++, s[9]++;
                for (; e <= 279;) ne[2 * e + 1] = 7, e++, s[7]++;
                for (; e <= 287;) ne[2 * e + 1] = 8, e++, s[8]++;
                for (h(ne, U + 1, s), e = 0; e < $; e++) re[2 * e + 1] = 5, re[2 * e] = d(e, 5);
                ue = new r(ne, X, B + 1, U, K), de = new r(re, ee, 0, $, K), ce = new r(new Array(0), te, 0, N, q)
            }

            function f(e) {
                var t;
                for (t = 0; t < U; t++) e.dyn_ltree[2 * t] = 0;
                for (t = 0; t < $; t++) e.dyn_dtree[2 * t] = 0;
                for (t = 0; t < N; t++) e.bl_tree[2 * t] = 0;
                e.dyn_ltree[2 * V] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0
            }

            function _(e) {
                e.bi_valid > 8 ? o(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0
            }

            function g(e, t, i, n) {
                _(e), n && (o(e, i), o(e, ~i)), C.arraySet(e.pending_buf, e.window, t, i, e.pending), e.pending += i
            }

            function y(e, t, i, n) {
                var r = 2 * t, a = 2 * i;
                return e[r] < e[a] || e[r] === e[a] && n[t] <= n[i]
            }

            function v(e, t, i) {
                for (var n = e.heap[i], r = i << 1; r <= e.heap_len && (r < e.heap_len && y(t, e.heap[r + 1], e.heap[r], e.depth) && r++, !y(t, n, e.heap[r], e.depth));) e.heap[i] = e.heap[r], i = r, r <<= 1;
                e.heap[i] = n
            }

            function k(e, t, i) {
                var n, r, a, o, d = 0;
                if (0 !== e.last_lit) do {
                    n = e.pending_buf[e.d_buf + 2 * d] << 8 | e.pending_buf[e.d_buf + 2 * d + 1], r = e.pending_buf[e.l_buf + d], d++, 0 === n ? u(e, r, t) : (a = se[r], u(e, a + B + 1, t), o = X[a], 0 !== o && (r -= oe[a], l(e, r, o)), n--, a = s(n), u(e, a, i), 0 !== (o = ee[a]) && (n -= le[a], l(e, n, o)))
                } while (d < e.last_lit);
                u(e, V, t)
            }

            function w(e, t) {
                var i, n, r, a = t.dyn_tree, s = t.stat_desc.static_tree, o = t.stat_desc.has_stree, l = t.stat_desc.elems, u = -1;
                for (e.heap_len = 0, e.heap_max = R, i = 0; i < l; i++) 0 !== a[2 * i] ? (e.heap[++e.heap_len] = u = i, e.depth[i] = 0) : a[2 * i + 1] = 0;
                for (; e.heap_len < 2;) r = e.heap[++e.heap_len] = u < 2 ? ++u : 0, a[2 * r] = 1, e.depth[r] = 0, e.opt_len--, o && (e.static_len -= s[2 * r + 1]);
                for (t.max_code = u, i = e.heap_len >> 1; i >= 1; i--) v(e, a, i);
                r = l;
                do {
                    i = e.heap[1], e.heap[1] = e.heap[e.heap_len--], v(e, a, 1), n = e.heap[1], e.heap[--e.heap_max] = i, e.heap[--e.heap_max] = n, a[2 * r] = a[2 * i] + a[2 * n], e.depth[r] = (e.depth[i] >= e.depth[n] ? e.depth[i] : e.depth[n]) + 1, a[2 * i + 1] = a[2 * n + 1] = r, e.heap[1] = r++, v(e, a, 1)
                } while (e.heap_len >= 2);
                e.heap[--e.heap_max] = e.heap[1], m(e, t), h(a, u, e.bl_count)
            }

            function T(e, t, i) {
                var n, r, a = -1, s = t[1], o = 0, l = 7, u = 4;
                for (0 === s && (l = 138, u = 3), t[2 * (i + 1) + 1] = 65535, n = 0; n <= i; n++) r = s, s = t[2 * (n + 1) + 1], ++o < l && r === s || (o < u ? e.bl_tree[2 * r] += o : 0 !== r ? (r !== a && e.bl_tree[2 * r]++, e.bl_tree[2 * J]++) : o <= 10 ? e.bl_tree[2 * Z]++ : e.bl_tree[2 * Q]++, o = 0, a = r, 0 === s ? (l = 138, u = 3) : r === s ? (l = 6, u = 3) : (l = 7, u = 4))
            }

            function b(e, t, i) {
                var n, r, a = -1, s = t[1], o = 0, d = 7, c = 4;
                for (0 === s && (d = 138, c = 3), n = 0; n <= i; n++) if (r = s, s = t[2 * (n + 1) + 1], !(++o < d && r === s)) {
                    if (o < c) do {
                        u(e, r, e.bl_tree)
                    } while (0 != --o); else 0 !== r ? (r !== a && (u(e, r, e.bl_tree), o--), u(e, J, e.bl_tree), l(e, o - 3, 2)) : o <= 10 ? (u(e, Z, e.bl_tree), l(e, o - 3, 3)) : (u(e, Q, e.bl_tree), l(e, o - 11, 7));
                    o = 0, a = r, 0 === s ? (d = 138, c = 3) : r === s ? (d = 6, c = 3) : (d = 7, c = 4)
                }
            }

            function M(e) {
                var t;
                for (T(e, e.dyn_ltree, e.l_desc.max_code), T(e, e.dyn_dtree, e.d_desc.max_code), w(e, e.bl_desc), t = N - 1; t >= 3 && 0 === e.bl_tree[2 * ie[t] + 1]; t--) ;
                return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
            }

            function D(e, t, i, n) {
                var r;
                for (l(e, t - 257, 5), l(e, i - 1, 5), l(e, n - 4, 4), r = 0; r < n; r++) l(e, e.bl_tree[2 * ie[r] + 1], 3);
                b(e, e.dyn_ltree, t - 1), b(e, e.dyn_dtree, i - 1)
            }

            function L(e) {
                var t, i = 4093624447;
                for (t = 0; t <= 31; t++, i >>>= 1) if (1 & i && 0 !== e.dyn_ltree[2 * t]) return P;
                if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return I;
                for (t = 32; t < B; t++) if (0 !== e.dyn_ltree[2 * t]) return I;
                return P
            }

            function A(e) {
                me || (p(), me = !0), e.l_desc = new a(e.dyn_ltree, ue), e.d_desc = new a(e.dyn_dtree, de), e.bl_desc = new a(e.bl_tree, ce), e.bi_buf = 0, e.bi_valid = 0, f(e)
            }

            function S(e, t, i, n) {
                l(e, (W << 1) + (n ? 1 : 0), 3), g(e, t, i, !0)
            }

            function Y(e) {
                l(e, F << 1, 3), u(e, V, ne), c(e)
            }

            function x(e, t, i, n) {
                var r, a, s = 0;
                e.level > 0 ? (e.strm.data_type === j && (e.strm.data_type = L(e)), w(e, e.l_desc), w(e, e.d_desc), s = M(e), r = e.opt_len + 3 + 7 >>> 3, (a = e.static_len + 3 + 7 >>> 3) <= r && (r = a)) : r = a = i + 5, i + 4 <= r && -1 !== t ? S(e, t, i, n) : e.strategy === O || a === r ? (l(e, (F << 1) + (n ? 1 : 0), 3), k(e, ne, re)) : (l(e, (z << 1) + (n ? 1 : 0), 3), D(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, s + 1), k(e, e.dyn_ltree, e.dyn_dtree)), f(e), n && _(e)
            }

            function E(e, t, i) {
                return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & i, e.last_lit++, 0 === t ? e.dyn_ltree[2 * i]++ : (e.matches++, t--, e.dyn_ltree[2 * (se[i] + B + 1)]++, e.dyn_dtree[2 * s(t)]++), e.last_lit === e.lit_bufsize - 1
            }

            var C = e("../utils/common"), O = 4, P = 0, I = 1, j = 2, W = 0, F = 1, z = 2, H = 29, B = 256, U = B + 1 + H, $ = 30, N = 19, R = 2 * U + 1, K = 15, G = 16, q = 7, V = 256, J = 16,
                Z = 17, Q = 18, X = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                ee = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], te = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                ie = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], ne = new Array(2 * (U + 2));
            n(ne);
            var re = new Array(2 * $);
            n(re);
            var ae = new Array(512);
            n(ae);
            var se = new Array(256);
            n(se);
            var oe = new Array(H);
            n(oe);
            var le = new Array($);
            n(le);
            var ue, de, ce, me = !1;
            i._tr_init = A, i._tr_stored_block = S, i._tr_flush_block = x, i._tr_tally = E, i._tr_align = Y
        }, {"../utils/common": 41}], 53: [function (e, t, i) {
            "use strict";

            function n() {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
            }

            t.exports = n
        }, {}]
    }, {}, [10])(10)
});
var saveAs = saveAs || function (e) {
    "use strict";
    if (!(void 0 === e || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var t = e.document, i = function () {
            return e.URL || e.webkitURL || e
        }, n = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), r = "download" in n, a = function (e) {
            var t = new MouseEvent("click");
            e.dispatchEvent(t)
        }, s = /constructor/i.test(e.HTMLElement) || e.safari, o = /CriOS\/[\d]+/.test(navigator.userAgent), l = function (t) {
            (e.setImmediate || e.setTimeout)(function () {
                throw t
            }, 0)
        }, u = function (e) {
            var t = function () {
                "string" == typeof e ? i().revokeObjectURL(e) : e.remove()
            };
            setTimeout(t, 4e4)
        }, d = function (e, t, i) {
            t = [].concat(t);
            for (var n = t.length; n--;) {
                var r = e["on" + t[n]];
                if ("function" == typeof r) try {
                    r.call(e, i || e)
                } catch (e) {
                    l(e)
                }
            }
        }, c = function (e) {
            return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], {type: e.type}) : e
        }, m = function (t, l, m) {
            m || (t = c(t));
            var h, p = this, f = t.type, _ = "application/octet-stream" === f, g = function () {
                d(p, "writestart progress write writeend".split(" "))
            };
            if (p.readyState = p.INIT, r) return h = i().createObjectURL(t), void setTimeout(function () {
                n.href = h, n.download = l, a(n), g(), u(h), p.readyState = p.DONE
            });
            !function () {
                if ((o || _ && s) && e.FileReader) {
                    var n = new FileReader;
                    return n.onloadend = function () {
                        var t = o ? n.result : n.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                        e.open(t, "_blank") || (e.location.href = t), t = void 0, p.readyState = p.DONE, g()
                    }, n.readAsDataURL(t), void(p.readyState = p.INIT)
                }
                if (h || (h = i().createObjectURL(t)), _) e.location.href = h; else {
                    e.open(h, "_blank") || (e.location.href = h)
                }
                p.readyState = p.DONE, g(), u(h)
            }()
        }, h = m.prototype, p = function (e, t, i) {
            return new m(e, t || e.name || "download", i)
        };
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (e, t, i) {
            return t = t || e.name || "download", i || (e = c(e)), navigator.msSaveOrOpenBlob(e, t)
        } : (h.abort = function () {
        }, h.readyState = h.INIT = 0, h.WRITING = 1, h.DONE = 2, h.error = h.onwritestart = h.onprogress = h.onwrite = h.onabort = h.onerror = h.onwriteend = null, p)
    }
}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
if ("undefined" != typeof module && module.exports ? module.exports.saveAs = saveAs : "undefined" != typeof define && null !== define && null !== define.amd && define("FileSaver.js", function () {
        return saveAs
    }), angular.module("localization", []).factory("localize", ["$http", "$rootScope", "$window", function (e, t, i) {
        var n = {
            path: "i18n/", language: i.navigator.userLanguage || i.navigator.language, dictionary: void 0, resourceFileLoaded: !1, successCallback: function (e) {
                n.dictionary = e, n.resourceFileLoaded = !0, t.$broadcast("localizeResourcesUpdates")
            }, initLocalizedResources: function () {
                var t = n.path + n.language + ".json";
                e({method: "GET", url: t, cache: !1}).success(n.successCallback).error(function () {
                    var t = n.path + "default.json";
                    e({method: "GET", url: t, cache: !1}).success(n.successCallback)
                })
            }, getLocalizedString: function (e) {
                var t = "!" + e + "!";
                if (!n.resourceFileLoaded) return n.initLocalizedResources(), n.resourceFileLoaded = !0, t;
                if ("object" == typeof n.dictionary) {
                    for (var i = [], r = 1; r < arguments.length; r++) i.push(arguments[r]);
                    var a = function (e, t) {
                        var t = t || null, i = n.dictionary[e];
                        return void 0 === i ? sprintf(e, t) : sprintf(i, t)
                    }(e, i);
                    null !== t && void 0 != t && (t = a)
                }
                return t
            }, replace: function (e, t) {
                var i = n.getLocalizedString(t);
                null !== i && void 0 !== i && "" !== i && e.html(i)
            }
        };
        return n
    }]).filter("i18n", ["localize", function (e) {
        return function () {
            return e.getLocalizedString.apply(null, arguments)
        }
    }]).directive("i18n", ["localize", function (e) {
        return {
            restrict: "EAC", link: function (t, i, n) {
                var r = n.i18n ? n.i18n : i.html();
                e.resourceFileLoaded ? e.replace(i, r) : deregister = t.$on("localizeResourcesUpdates", function () {
                    deregister(), e.replace(i, r)
                })
            }
        }
    }]), function (e) {
        "use strict";
        if (e.URL = e.URL || e.webkitURL, e.Blob && e.URL) try {
            return void new Blob
        } catch (e) {
        }
        var t = e.BlobBuilder || e.WebKitBlobBuilder || e.MozBlobBuilder || function (e) {
            var t = function (e) {
                    return Object.prototype.toString.call(e).match(/^\[object\s(.*)\]$/)[1]
                }, i = function () {
                    this.data = []
                }, n = function (e, t, i) {
                    this.data = e, this.size = e.length, this.type = t, this.encoding = i
                }, r = i.prototype, a = n.prototype, s = e.FileReaderSync, o = function (e) {
                    this.code = this[this.name = e]
                }, l = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "), u = l.length,
                d = e.URL || e.webkitURL || e, c = d.createObjectURL, m = d.revokeObjectURL, h = d, p = e.btoa, f = e.atob, _ = e.ArrayBuffer, g = e.Uint8Array,
                y = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
            for (n.fake = a.fake = !0; u--;) o.prototype[l[u]] = u + 1;
            return d.createObjectURL || (h = e.URL = function (e) {
                var t, i = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                return i.href = e, "origin" in i || ("data:" === i.protocol.toLowerCase() ? i.origin = null : (t = e.match(y), i.origin = t && t[1])), i
            }), h.createObjectURL = function (e) {
                var t, i = e.type;
                return null === i && (i = "application/octet-stream"), e instanceof n ? (t = "data:" + i, "base64" === e.encoding ? t + ";base64," + e.data : "URI" === e.encoding ? t + "," + decodeURIComponent(e.data) : p ? t + ";base64," + p(e.data) : t + "," + encodeURIComponent(e.data)) : c ? c.call(d, e) : void 0
            }, h.revokeObjectURL = function (e) {
                "data:" !== e.substring(0, 5) && m && m.call(d, e)
            }, r.append = function (e) {
                var i = this.data;
                if (g && (e instanceof _ || e instanceof g)) {
                    for (var r = "", a = new g(e), l = 0, u = a.length; l < u; l++) r += String.fromCharCode(a[l]);
                    i.push(r)
                } else if ("Blob" === t(e) || "File" === t(e)) {
                    if (!s) throw new o("NOT_READABLE_ERR");
                    var d = new s;
                    i.push(d.readAsBinaryString(e))
                } else e instanceof n ? "base64" === e.encoding && f ? i.push(f(e.data)) : "URI" === e.encoding ? i.push(decodeURIComponent(e.data)) : "raw" === e.encoding && i.push(e.data) : ("string" != typeof e && (e += ""), i.push(unescape(encodeURIComponent(e))))
            }, r.getBlob = function (e) {
                return arguments.length || (e = null), new n(this.data.join(""), e, "raw")
            }, r.toString = function () {
                return "[object BlobBuilder]"
            }, a.slice = function (e, t, i) {
                var r = arguments.length;
                return r < 3 && (i = null), new n(this.data.slice(e, r > 1 ? t : this.data.length), i, this.encoding)
            }, a.toString = function () {
                return "[object Blob]"
            }, a.close = function () {
                this.size = 0, delete this.data
            }, i
        }(e);
        e.Blob = function (e, i) {
            var n = i ? i.type || "" : "", r = new t;
            if (e) for (var a = 0, s = e.length; a < s; a++) Uint8Array && e[a] instanceof Uint8Array ? r.append(e[a].buffer) : r.append(e[a]);
            var o = r.getBlob(n);
            return !o.slice && o.webkitSlice && (o.slice = o.webkitSlice), o
        };
        var i = Object.getPrototypeOf || function (e) {
            return e.__proto__
        };
        e.Blob.prototype = i(new e.Blob)
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this), jQuery.base64 = function (e) {
        function t(e) {
            e = e.replace(/\r\n/g, "\n");
            for (var t = "", i = 0; i < e.length; i++) {
                var n = e.charCodeAt(i);
                n < 128 ? t += String.fromCharCode(n) : n > 127 && n < 2048 ? (t += String.fromCharCode(n >> 6 | 192), t += String.fromCharCode(63 & n | 128)) : (t += String.fromCharCode(n >> 12 | 224), t += String.fromCharCode(n >> 6 & 63 | 128), t += String.fromCharCode(63 & n | 128))
            }
            return t
        }

        function i(e) {
            var i, r, a, s, o, l, u, d = "", c = 0;
            for (e = t(e); c < e.length;) i = e.charCodeAt(c++), r = e.charCodeAt(c++), a = e.charCodeAt(c++), s = i >> 2, o = (3 & i) << 4 | r >> 4, l = (15 & r) << 2 | a >> 6, u = 63 & a, isNaN(r) ? l = u = 64 : isNaN(a) && (u = 64), d = d + n.charAt(s) + n.charAt(o) + n.charAt(l) + n.charAt(u);
            return d
        }

        var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        return {
            encode: function (e) {
                return i(e)
            }
        }
    }(jQuery), "undefined" == typeof jQuery) throw new Error("jQuery.textcomplete requires jQuery");
+function (e) {
    "use strict";
    var t = function (e) {
        console.warn && console.warn(e)
    }, i = 1;
    e.fn.textcomplete = function (n, r) {
        var a = Array.prototype.slice.call(arguments);
        return this.each(function () {
            var s = this, o = e(this), l = o.data("textComplete");
            if (l || (r || (r = {}), r._oid = i++, l = new e.fn.textcomplete.Completer(this, r), o.data("textComplete", l)), "string" == typeof n) {
                if (!l) return;
                a.shift(), l[n].apply(l, a), "destroy" === n && o.removeData("textComplete")
            } else e.each(n, function (i) {
                e.each(["header", "footer", "placement", "maxCount"], function (e) {
                    i[e] && (l.option[e] = i[e], t(e + "as a strategy param is deprecated. Use option."), delete i[e])
                })
            }), l.register(e.fn.textcomplete.Strategy.parse(n, {el: s, $el: o}))
        })
    }
}(jQuery), function (e) {
    "use strict";

    function t(i, r) {
        if (this.$el = e(i), this.id = "textcomplete" + n++, this.strategies = [], this.views = [], this.option = e.extend({}, t.defaults, r), !(this.$el.is("input[type=text]") || this.$el.is("input[type=search]") || this.$el.is("textarea") || i.isContentEditable || "true" == i.contentEditable)) throw new Error("textcomplete must be called on a Textarea or a ContentEditable.");
        if (i === i.ownerDocument.activeElement) this.initialize(); else {
            var a = this;
            this.$el.one("focus." + this.id, function () {
                a.initialize()
            }), this.option.adapter && "CKEditor" != this.option.adapter || "undefined" == typeof CKEDITOR || !this.$el.is("textarea") || CKEDITOR.on("instanceReady", function (t) {
                t.editor.once("focus", function (i) {
                    a.$el = e(t.editor.editable().$), a.option.adapter || (a.option.adapter = e.fn.textcomplete.CKEditor, a.option.ckeditor_instance = t.editor), a.initialize()
                })
            })
        }
    }

    var i = function (e) {
        return "[object String]" === Object.prototype.toString.call(e)
    }, n = 0;
    t.defaults = {appendTo: "body", className: "", dropdownClassName: "dropdown-menu textcomplete-dropdown", maxCount: 10, zIndex: "100", rightEdgeOffset: 30}, e.extend(t.prototype, {
        id: null,
        option: null,
        strategies: null,
        adapter: null,
        dropdown: null,
        $el: null,
        $iframe: null,
        initialize: function () {
            var t = this.$el.get(0);
            if (this.$el.prop("ownerDocument") !== document && window.frames.length) for (var i = 0; i < window.frames.length; i++) if (this.$el.prop("ownerDocument") === window.frames[i].document) {
                this.$iframe = e(window.frames[i].frameElement);
                break
            }
            this.dropdown = new e.fn.textcomplete.Dropdown(t, this, this.option);
            var n, r;
            this.option.adapter ? n = this.option.adapter : (r = this.$el.is("textarea") || this.$el.is("input[type=text]") || this.$el.is("input[type=search]") ? "number" == typeof t.selectionEnd ? "Textarea" : "IETextarea" : "ContentEditable", n = e.fn.textcomplete[r]), this.adapter = new n(t, this, this.option)
        },
        destroy: function () {
            this.$el.off("." + this.id), this.adapter && this.adapter.destroy(), this.dropdown && this.dropdown.destroy(), this.$el = this.adapter = this.dropdown = null
        },
        deactivate: function () {
            this.dropdown && this.dropdown.deactivate()
        },
        trigger: function (e, t) {
            this.dropdown || this.initialize(), null != e || (e = this.adapter.getTextFromHeadToCaret());
            var i = this._extractSearchQuery(e);
            if (i.length) {
                var n = i[1];
                if (t && this._term === n && "" !== n) return;
                this._term = n, this._search.apply(this, i)
            } else this._term = null, this.dropdown.deactivate()
        },
        fire: function (e) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this.$el.trigger(e, t), this
        },
        register: function (e) {
            Array.prototype.push.apply(this.strategies, e)
        },
        select: function (e, t, i) {
            this._term = null, this.adapter.select(e, t, i), this.fire("change").fire("textComplete:select", e, t), this.adapter.focus()
        },
        _clearAtNext: !0,
        _term: null,
        _extractSearchQuery: function (t) {
            for (var n = 0; n < this.strategies.length; n++) {
                var r = this.strategies[n], a = r.context(t);
                if (a || "" === a) {
                    var s = e.isFunction(r.match) ? r.match(t) : r.match;
                    i(a) && (t = a);
                    var o = t.match(s);
                    if (o) return [r, o[r.index], o]
                }
            }
            return []
        },
        _search: function (e) {
            var t, i;
            return function () {
                var n = Array.prototype.slice.call(arguments);
                if (t) return void(i = n);
                t = !0;
                var r = this;
                n.unshift(function n() {
                    if (i) {
                        var a = i;
                        i = void 0, a.unshift(n), e.apply(r, a)
                    } else t = !1
                }), e.apply(this, n)
            }
        }(function (e, t, i, n) {
            var r = this;
            t.search(i, function (n, a) {
                r.dropdown.shown || r.dropdown.activate(), r._clearAtNext && (r.dropdown.clear(), r._clearAtNext = !1), r.dropdown.setPosition(r.adapter.getCaretPosition()), r.dropdown.render(r._zip(n, t, i)), a || (e(), r._clearAtNext = !0)
            }, n)
        }),
        _zip: function (t, i, n) {
            return e.map(t, function (e) {
                return {value: e, strategy: i, term: n}
            })
        }
    }), e.fn.textcomplete.Completer = t
}(jQuery), function (e) {
    "use strict";

    function t(i, n, a) {
        this.$el = t.createElement(a), this.completer = n, this.id = n.id + "dropdown", this._data = [], this.$inputEl = e(i), this.option = a, a.listPosition && (this.setPosition = a.listPosition), a.height && this.$el.height(a.height);
        var s = this;
        e.each(["maxCount", "placement", "footer", "header", "noResultsMessage", "className"], function (e, t) {
            null != a[t] && (s[t] = a[t])
        }), this._bindEvents(i), r[this.id] = this
    }

    var i = e(window), n = function (e, t) {
        var i, n, r = t.strategy.idProperty;
        for (i = 0; i < e.length; i++) if (n = e[i], n.strategy === t.strategy) if (r) {
            if (n.value[r] === t.value[r]) return !0
        } else if (n.value === t.value) return !0;
        return !1
    }, r = {};
    e(document).on("click", function (t) {
        var i = t.originalEvent && t.originalEvent.keepTextCompleteDropdown;
        e.each(r, function (e, t) {
            e !== i && t.deactivate()
        })
    });
    var a = {SKIP_DEFAULT: 0, KEY_UP: 1, KEY_DOWN: 2, KEY_ENTER: 3, KEY_PAGEUP: 4, KEY_PAGEDOWN: 5, KEY_ESCAPE: 6};
    e.extend(t, {
        createElement: function (t) {
            var i = t.appendTo;
            return i instanceof e || (i = e(i)), e("<ul></ul>").addClass(t.dropdownClassName).attr("id", "textcomplete-dropdown-" + t._oid).css({
                display: "none",
                left: 0,
                position: "absolute",
                zIndex: t.zIndex
            }).appendTo(i)
        }
    }), e.extend(t.prototype, {
        $el: null,
        $inputEl: null,
        completer: null,
        footer: null,
        header: null,
        id: null,
        maxCount: null,
        placement: "",
        shown: !1,
        data: [],
        className: "",
        destroy: function () {
            this.deactivate(), this.$el.off("." + this.id), this.$inputEl.off("." + this.id), this.clear(), this.$el.remove(), this.$el = this.$inputEl = this.completer = null, delete r[this.id]
        },
        render: function (t) {
            var i = this._buildContents(t), n = e.map(t, function (e) {
                return e.value
            });
            if (t.length) {
                var r = t[0].strategy;
                r.id ? this.$el.attr("data-strategy", r.id) : this.$el.removeAttr("data-strategy"), this._renderHeader(n), this._renderFooter(n), i && (this._renderContents(i), this._fitToBottom(), this._fitToRight(), this._activateIndexedItem()), this._setScroll()
            } else this.noResultsMessage ? this._renderNoResultsMessage(n) : this.shown && this.deactivate()
        },
        setPosition: function (t) {
            var n = "absolute";
            return this.$inputEl.add(this.$inputEl.parents()).each(function () {
                return "absolute" !== e(this).css("position") && ("fixed" === e(this).css("position") ? (t.top -= i.scrollTop(), t.left -= i.scrollLeft(), n = "fixed", !1) : void 0)
            }), this.$el.css(this._applyPlacement(t)), this.$el.css({position: n}), this
        },
        clear: function () {
            this.$el.html(""), this.data = [], this._index = 0, this._$header = this._$footer = this._$noResultsMessage = null
        },
        activate: function () {
            return this.shown || (this.clear(), this.$el.show(), this.className && this.$el.addClass(this.className), this.completer.fire("textComplete:show"), this.shown = !0), this
        },
        deactivate: function () {
            return this.shown && (this.$el.hide(), this.className && this.$el.removeClass(this.className), this.completer.fire("textComplete:hide"), this.shown = !1), this
        },
        isUp: function (e) {
            return 38 === e.keyCode || e.ctrlKey && 80 === e.keyCode
        },
        isDown: function (e) {
            return 40 === e.keyCode || e.ctrlKey && 78 === e.keyCode
        },
        isEnter: function (e) {
            return !(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) && (13 === e.keyCode || 9 === e.keyCode || !0 === this.option.completeOnSpace && 32 === e.keyCode)
        },
        isPageup: function (e) {
            return 33 === e.keyCode
        },
        isPagedown: function (e) {
            return 34 === e.keyCode
        },
        isEscape: function (e) {
            return 27 === e.keyCode
        },
        _data: null,
        _index: null,
        _$header: null,
        _$noResultsMessage: null,
        _$footer: null,
        _bindEvents: function () {
            this.$el.on("mousedown." + this.id, ".textcomplete-item", e.proxy(this._onClick, this)), this.$el.on("touchstart." + this.id, ".textcomplete-item", e.proxy(this._onClick, this)), this.$el.on("mouseover." + this.id, ".textcomplete-item", e.proxy(this._onMouseover, this)), this.$inputEl.on("keydown." + this.id, e.proxy(this._onKeydown, this))
        },
        _onClick: function (t) {
            var i = e(t.target);
            t.preventDefault(), t.originalEvent.keepTextCompleteDropdown = this.id, i.hasClass("textcomplete-item") || (i = i.closest(".textcomplete-item"));
            var n = this.data[parseInt(i.data("index"), 10)];
            this.completer.select(n.value, n.strategy, t);
            var r = this;
            setTimeout(function () {
                r.deactivate(), "touchstart" === t.type && r.$inputEl.focus()
            }, 0)
        },
        _onMouseover: function (t) {
            var i = e(t.target);
            t.preventDefault(), i.hasClass("textcomplete-item") || (i = i.closest(".textcomplete-item")), this._index = parseInt(i.data("index"), 10), this._activateIndexedItem()
        },
        _onKeydown: function (t) {
            if (this.shown) {
                var i;
                switch (e.isFunction(this.option.onKeydown) && (i = this.option.onKeydown(t, a)), null == i && (i = this._defaultKeydown(t)), i) {
                    case a.KEY_UP:
                        t.preventDefault(), this._up();
                        break;
                    case a.KEY_DOWN:
                        t.preventDefault(), this._down();
                        break;
                    case a.KEY_ENTER:
                        t.preventDefault(), this._enter(t);
                        break;
                    case a.KEY_PAGEUP:
                        t.preventDefault(), this._pageup();
                        break;
                    case a.KEY_PAGEDOWN:
                        t.preventDefault(), this._pagedown();
                        break;
                    case a.KEY_ESCAPE:
                        t.preventDefault(), this.deactivate()
                }
            }
        },
        _defaultKeydown: function (e) {
            return this.isUp(e) ? a.KEY_UP : this.isDown(e) ? a.KEY_DOWN : this.isEnter(e) ? a.KEY_ENTER : this.isPageup(e) ? a.KEY_PAGEUP : this.isPagedown(e) ? a.KEY_PAGEDOWN : this.isEscape(e) ? a.KEY_ESCAPE : void 0
        },
        _up: function () {
            0 === this._index ? this._index = this.data.length - 1 : this._index -= 1, this._activateIndexedItem(), this._setScroll()
        },
        _down: function () {
            this._index === this.data.length - 1 ? this._index = 0 : this._index += 1, this._activateIndexedItem(), this._setScroll()
        },
        _enter: function (e) {
            var t = this.data[parseInt(this._getActiveElement().data("index"), 10)];
            this.completer.select(t.value, t.strategy, e), this.deactivate()
        },
        _pageup: function () {
            var t = 0, i = this._getActiveElement().position().top - this.$el.innerHeight();
            this.$el.children().each(function (n) {
                if (e(this).position().top + e(this).outerHeight() > i) return t = n, !1
            }), this._index = t, this._activateIndexedItem(), this._setScroll()
        },
        _pagedown: function () {
            var t = this.data.length - 1, i = this._getActiveElement().position().top + this.$el.innerHeight();
            this.$el.children().each(function (n) {
                if (e(this).position().top > i) return t = n, !1
            }), this._index = t, this._activateIndexedItem(), this._setScroll()
        },
        _activateIndexedItem: function () {
            this.$el.find(".textcomplete-item.active").removeClass("active"), this._getActiveElement().addClass("active")
        },
        _getActiveElement: function () {
            return this.$el.children(".textcomplete-item:nth(" + this._index + ")")
        },
        _setScroll: function () {
            var e = this._getActiveElement(), t = e.position().top, i = e.outerHeight(), n = this.$el.innerHeight(), r = this.$el.scrollTop();
            0 === this._index || this._index == this.data.length - 1 || t < 0 ? this.$el.scrollTop(t + r) : t + i > n && this.$el.scrollTop(t + i + r - n)
        },
        _buildContents: function (e) {
            var t, i, r, a = "";
            for (i = 0; i < e.length && this.data.length !== this.maxCount; i++) t = e[i], n(this.data, t) || (r = this.data.length, this.data.push(t), a += '<li class="textcomplete-item" data-index="' + r + '"><a>', a += t.strategy.template(t.value, t.term), a += "</a></li>");
            return a
        },
        _renderHeader: function (t) {
            if (this.header) {
                this._$header || (this._$header = e('<li class="textcomplete-header"></li>').prependTo(this.$el));
                var i = e.isFunction(this.header) ? this.header(t) : this.header;
                this._$header.html(i)
            }
        },
        _renderFooter: function (t) {
            if (this.footer) {
                this._$footer || (this._$footer = e('<li class="textcomplete-footer"></li>').appendTo(this.$el));
                var i = e.isFunction(this.footer) ? this.footer(t) : this.footer;
                this._$footer.html(i)
            }
        },
        _renderNoResultsMessage: function (t) {
            if (this.noResultsMessage) {
                this._$noResultsMessage || (this._$noResultsMessage = e('<li class="textcomplete-no-results-message"></li>').appendTo(this.$el));
                var i = e.isFunction(this.noResultsMessage) ? this.noResultsMessage(t) : this.noResultsMessage;
                this._$noResultsMessage.html(i)
            }
        },
        _renderContents: function (e) {
            this._$footer ? this._$footer.before(e) : this.$el.append(e)
        },
        _fitToBottom: function () {
            var e = i.scrollTop() + i.height(), t = this.$el.height();
            this.$el.position().top + t > e && (this.completer.$iframe || this.$el.offset({top: e - t}))
        },
        _fitToRight: function () {
            for (var e, t = this.option.rightEdgeOffset, n = this.$el.offset().left, r = this.$el.width(), a = i.width() - t; n + r > a && (this.$el.offset({left: n - t}), !((e = this.$el.offset().left) >= n));) n = e
        },
        _applyPlacement: function (e) {
            return -1 !== this.placement.indexOf("top") ? e = {
                top: "auto",
                bottom: this.$el.parent().height() - e.top + e.lineHeight,
                left: e.left
            } : (e.bottom = "auto", delete e.lineHeight), -1 !== this.placement.indexOf("absleft") ? e.left = 0 : -1 !== this.placement.indexOf("absright") && (e.right = 0, e.left = "auto"), e
        }
    }), e.fn.textcomplete.Dropdown = t, e.extend(e.fn.textcomplete, a)
}(jQuery), function (e) {
    "use strict";

    function t(t) {
        e.extend(this, t), this.cache && (this.search = i(this.search))
    }

    var i = function (e) {
        var t = {};
        return function (i, n) {
            t[i] ? n(t[i]) : e.call(this, i, function (e) {
                t[i] = (t[i] || []).concat(e), n.apply(null, arguments)
            })
        }
    };
    t.parse = function (i, n) {
        return e.map(i, function (e) {
            var i = new t(e);
            return i.el = n.el, i.$el = n.$el, i
        })
    }, e.extend(t.prototype, {
        match: null, replace: null, search: null, id: null, cache: !1, context: function () {
            return !0
        }, index: 2, template: function (e) {
            return e
        }, idProperty: null
    }), e.fn.textcomplete.Strategy = t
}(jQuery), function (e) {
    "use strict";

    function t() {
    }

    var i = Date.now || function () {
        return (new Date).getTime()
    }, n = function (e, t) {
        var n, r, a, s, o, l = function () {
            var u = i() - s;
            u < t ? n = setTimeout(l, t - u) : (n = null, o = e.apply(a, r), a = r = null)
        };
        return function () {
            return a = this, r = arguments, s = i(), n || (n = setTimeout(l, t)), o
        }
    };
    e.extend(t.prototype, {
        id: null, completer: null, el: null, $el: null, option: null, initialize: function (t, i, r) {
            this.el = t, this.$el = e(t), this.id = i.id + this.constructor.name, this.completer = i, this.option = r, this.option.debounce && (this._onKeyup = n(this._onKeyup, this.option.debounce)), this._bindEvents()
        }, destroy: function () {
            this.$el.off("." + this.id), this.$el = this.el = this.completer = null
        }, select: function () {
            throw new Error("Not implemented")
        }, getCaretPosition: function () {
            var t = this._getCaretRelativePosition(), i = this.$el.offset(), n = this.option.appendTo;
            if (n) {
                n instanceof e || (n = e(n));
                var r = n.offsetParent().offset();
                i.top -= r.top, i.left -= r.left
            }
            return t.top += i.top, t.left += i.left, t
        }, focus: function () {
            this.$el.focus()
        }, _bindEvents: function () {
            this.$el.on("keyup." + this.id, e.proxy(this._onKeyup, this))
        }, _onKeyup: function (e) {
            this._skipSearch(e) || this.completer.trigger(this.getTextFromHeadToCaret(), !0)
        }, _skipSearch: function (e) {
            switch (e.keyCode) {
                case 9:
                case 13:
                case 40:
                case 38:
                case 27:
                    return !0
            }
            if (e.ctrlKey) switch (e.keyCode) {
                case 78:
                case 80:
                    return !0
            }
        }
    }), e.fn.textcomplete.Adapter = t
}(jQuery), function (e) {
    "use strict";

    function t(e, t, i) {
        this.initialize(e, t, i)
    }

    e.extend(t.prototype, e.fn.textcomplete.Adapter.prototype, {
        select: function (t, i, n) {
            var r, a = this.getTextFromHeadToCaret(), s = this.el.value.substring(this.el.selectionEnd), o = i.replace(t, n);
            void 0 !== o && (e.isArray(o) && (s = o[1] + s, o = o[0]), r = e.isFunction(i.match) ? i.match(a) : i.match, a = a.replace(r, o), this.$el.val(a + s), this.el.selectionStart = this.el.selectionEnd = a.length)
        }, getTextFromHeadToCaret: function () {
            return this.el.value.substring(0, this.el.selectionEnd)
        }, _getCaretRelativePosition: function () {
            var t = e.fn.textcomplete.getCaretCoordinates(this.el, this.el.selectionStart);
            return {top: t.top + this._calculateLineHeight() - this.$el.scrollTop(), left: t.left - this.$el.scrollLeft(), lineHeight: this._calculateLineHeight()}
        }, _calculateLineHeight: function () {
            var e = parseInt(this.$el.css("line-height"), 10);
            if (isNaN(e)) {
                var t = this.el.parentNode, i = document.createElement(this.el.nodeName), n = this.el.style;
                i.setAttribute("style", "margin:0px;padding:0px;font-family:" + n.fontFamily + ";font-size:" + n.fontSize), i.innerHTML = "test", t.appendChild(i), e = i.clientHeight, t.removeChild(i)
            }
            return e
        }
    }), e.fn.textcomplete.Textarea = t
}(jQuery), function (e) {
    "use strict";

    function t(t, n, r) {
        this.initialize(t, n, r), e("<span>" + i + "</span>").css({position: "absolute", top: -9999, left: -9999}).insertBefore(t)
    }

    var i = "吶";
    e.extend(t.prototype, e.fn.textcomplete.Textarea.prototype, {
        select: function (t, i, n) {
            var r, a = this.getTextFromHeadToCaret(), s = this.el.value.substring(a.length), o = i.replace(t, n);
            if (void 0 !== o) {
                e.isArray(o) && (s = o[1] + s, o = o[0]), r = e.isFunction(i.match) ? i.match(a) : i.match, a = a.replace(r, o), this.$el.val(a + s), this.el.focus();
                var l = this.el.createTextRange();
                l.collapse(!0), l.moveEnd("character", a.length), l.moveStart("character", a.length), l.select()
            }
        }, getTextFromHeadToCaret: function () {
            this.el.focus();
            var e = document.selection.createRange();
            e.moveStart("character", -this.el.value.length);
            var t = e.text.split(i);
            return 1 === t.length ? t[0] : t[1]
        }
    }), e.fn.textcomplete.IETextarea = t
}(jQuery), function (e) {
    "use strict";

    function t(e, t, i) {
        this.initialize(e, t, i)
    }

    e.extend(t.prototype, e.fn.textcomplete.Adapter.prototype, {
        select: function (t, i, n) {
            var r = this.getTextFromHeadToCaret(), a = this.el.ownerDocument.getSelection(), s = a.getRangeAt(0), o = s.cloneRange();
            o.selectNodeContents(s.startContainer);
            var l, u = o.toString(), d = u.substring(s.startOffset), c = i.replace(t, n);
            if (void 0 !== c) {
                e.isArray(c) && (d = c[1] + d, c = c[0]), l = e.isFunction(i.match) ? i.match(r) : i.match, r = r.replace(l, c).replace(/ $/, "&nbsp"), s.selectNodeContents(s.startContainer), s.deleteContents();
                var m = this.el.ownerDocument.createElement("div");
                m.innerHTML = r;
                var h = this.el.ownerDocument.createElement("div");
                h.innerHTML = d;
                for (var p, f, _ = this.el.ownerDocument.createDocumentFragment(); p = m.firstChild;) f = _.appendChild(p);
                for (; p = h.firstChild;) _.appendChild(p);
                s.insertNode(_), s.setStartAfter(f), s.collapse(!0), a.removeAllRanges(), a.addRange(s)
            }
        }, _getCaretRelativePosition: function () {
            var t = this.el.ownerDocument.getSelection().getRangeAt(0).cloneRange(), i = this.el.ownerDocument.createElement("span");
            t.insertNode(i), t.selectNodeContents(i), t.deleteContents();
            var n = e(i), r = n.offset();
            if (r.left -= this.$el.offset().left, r.top += n.height() - this.$el.offset().top, r.lineHeight = n.height(), this.completer.$iframe) {
                var a = this.completer.$iframe.offset();
                r.top += a.top, r.left += a.left, r.top -= this.$el.scrollTop()
            }
            return n.remove(), r
        }, getTextFromHeadToCaret: function () {
            var e = this.el.ownerDocument.getSelection().getRangeAt(0), t = e.cloneRange();
            return t.selectNodeContents(e.startContainer), t.toString().substring(0, e.startOffset)
        }
    }), e.fn.textcomplete.ContentEditable = t
}(jQuery), function (e) {
    "use strict";

    function t(e, t, i) {
        this.initialize(e, t, i)
    }

    e.extend(t.prototype, e.fn.textcomplete.ContentEditable.prototype, {
        _bindEvents: function () {
            var t = this;
            this.option.ckeditor_instance.on("key", function (e) {
                var i = e.data;
                if (t._onKeyup(i), t.completer.dropdown.shown && t._skipSearch(i)) return !1
            }, null, null, 1), this.$el.on("keyup." + this.id, e.proxy(this._onKeyup, this))
        }
    }), e.fn.textcomplete.CKEditor = t
}(jQuery), function (e) {
    function t(e, t, a) {
        if (!n) throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
        var s = a && a.debug || !1;
        if (s) {
            var o = document.querySelector("#input-textarea-caret-position-mirror-div");
            o && o.parentNode.removeChild(o)
        }
        var l = document.createElement("div");
        l.id = "input-textarea-caret-position-mirror-div", document.body.appendChild(l);
        var u = l.style, d = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle;
        u.whiteSpace = "pre-wrap", "INPUT" !== e.nodeName && (u.wordWrap = "break-word"), u.position = "absolute", s || (u.visibility = "hidden"), i.forEach(function (e) {
            u[e] = d[e]
        }), r ? e.scrollHeight > parseInt(d.height) && (u.overflowY = "scroll") : u.overflow = "hidden", l.textContent = e.value.substring(0, t), "INPUT" === e.nodeName && (l.textContent = l.textContent.replace(/\s/g, " "));
        var c = document.createElement("span");
        c.textContent = e.value.substring(t) || ".", l.appendChild(c);
        var m = {top: c.offsetTop + parseInt(d.borderTopWidth), left: c.offsetLeft + parseInt(d.borderLeftWidth)};
        return s ? c.style.backgroundColor = "#aaa" : document.body.removeChild(l), m
    }

    var i = ["direction", "boxSizing", "width", "height", "overflowX", "overflowY", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderStyle", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize", "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform", "textIndent", "textDecoration", "letterSpacing", "wordSpacing", "tabSize", "MozTabSize"],
        n = "undefined" != typeof window, r = n && null != window.mozInnerScreenX;
    e.fn.textcomplete.getCaretCoordinates = t
}(jQuery), setTimeout(function () {
    var e = function (e, t) {
        var i = new RegExp("\\W" + e + "=([^&]+)").exec(window.location.search), n = i ? i[1] : t || "";
        return decodeURIComponent(n)
    }, t = e("xdm_e") + e("cp");
    if (t || window._loggerUrl) {
        if (window.AP) return void $(function () {
            angular.bootstrap(document, ["timesheetApp"])
        });
        var i = function () {
            for (var e = document.getElementsByTagName("script"), t = 0; t < e.length; t += 1) {
                var i, n = e[t], r = n.getAttribute("src");
                if (r && (i = r.match(/\/(all|app)\.js\?([0-9a-f]+)/))) return i[2]
            }
            return 1
        }(), n = e("configuration"), r = e("welcome"), a = e("dashboard"), s = e("issue.key"), o = e("issue.id"), l = !!a || !!s, u = e("dialog");
        "1" == e("v", 1) && (mailerUrl = void 0);
        var d = {isGadget: l, dashboardId: a, dashboardItemId: e("dashboardItem"), issueKey: s, issueId: o, license: e("lic"), hostBaseUrl: t};
        if (r) window.mainController = "WelcomeController", window.mainTemplate = "/templates/mainShort.html?_=" + i, d.templates = {welcome: "/templates/welcome.html?_=" + i}, d.isWelcome = !0; else if (n) window.mainController = "ConfigurationController", window.mainTemplate = "/templates/mainShort.html?_=" + i, d.templates = {
            menu: "/templates/configMenu.html?_=" + i,
            configure: "/templates/configure.html?_=" + i
        }; else if (u) switch (["deleteworklog", "updateworklog", "createworklog", "addworklog"].indexOf(u) >= 0 && (window.mainController = "WorklogController", window.mainTemplate = "/templates/dialog.html?_=" + i, d.templates = {}), u) {
            case"deleteworklog":
                d.dialogType = "delete", d.templates.dialog = "/templates/dialogs/deleteWorklog.html?_=" + i;
                break;
            case"updateworklog":
                d.dialogType = "update", d.templates.dialog = "/templates/dialogs/updateWorklog.html?_=" + i;
                break;
            case"createworklog":
                d.dialogType = "create", d.templates.dialog = "/templates/dialogs/updateWorklog.html?_=" + i;
                break;
            case"addworklog":
                d.dialogType = "add", d.templates.dialog = "/templates/dialogs/updateWorklog.html?_=" + i;
                break;
            case"timereports":
                window.mainController = "TimesheetController", window.mainTemplate = "/templates/main.html?_=" + i, d.isGadget = !0, d.reportDialog = !0, d.templates = {menu: "/templates/menu.html?_=" + i};
                break;
            case"bitbucket":
                window.mainController = "BitbucketController", window.mainTemplate = "/templates/dialogs/bitbucket.html?_=" + i
        } else window.mainController = "TimesheetController", window.mainTemplate = "/templates/main.html?_=" + i, d.templates = {
            header: "/templates/header.html?_=" + i,
            menu: "/templates/menu.html?_=" + i,
            pivottable: "/templates/pivottable.html?_=" + i,
            piechart: "/templates/pieChart.html?_=" + i,
            timesheet: "/templates/timesheet.html?_=" + i,
            issuetime: "/templates/issuetime.html?_=" + i,
            editWorklog: "/templates/popups/editWorklog.html?_=" + i,
            gadgetConfig: "/templates/gadgetConfig.html?_=" + i
        };
        window.i18nDefault = "/i18n/default.json?_=" + i;
        var c = t ? t + "/atlassian-connect/all.js" : "/timedata.js";
        $.getScript(c, function () {
            u && AP.dialog.getButton("submit").disable(), $(function () {
                AP.requestBak = AP.request, AP.request = function (e) {
                    var t = e.success;
                    e.success = function (i, n, r) {
                        !i && r && 0 === r.status ? (e.success = t, AP.request(e)) : t(i)
                    }, AP.requestBak(e)
                }, l || u ? ($("body").css("background", "#fff"), $("body").addClass("is-gadget")) : $("body").addClass("is-not-gadget"), $("#content").html("<context items='" + JSON.stringify(d) + "' />"), angular.bootstrap(document, ["timesheetApp"])
            })
        })
    }
});
var TimesheetUtils = {};
TimesheetUtils.getLastMondayDate = function (e) {
    return TimesheetUtils.getPrevMonday(new Date, e)
}, TimesheetUtils.getPrevMonday = function (e, t) {
    return TimesheetUtils.getNearestDayOfTheWeek(e, t, -1)
}, TimesheetUtils.getNextSunday = function (e, t) {
    return TimesheetUtils.getNearestDayOfTheWeek(e, (t + 6) % 7, 1)
}, TimesheetUtils.getNearestDayOfTheWeek = function (e, t, i) {
    for (t = t || 0; e.getDay() != t;) e = TimesheetUtils.addDays(e, i);
    return TimesheetUtils.truncateTime(e)
}, TimesheetUtils.getFirstDayOfTheMonth = function (e) {
    return null == e && (e = new Date), TimesheetUtils.truncateTime(moment(e).startOf("month").toDate())
}, TimesheetUtils.getLastDayOfTheMonth = function (e) {
    return null == e && (e = new Date), TimesheetUtils.truncateTime(moment(e).endOf("month").toDate())
}, TimesheetUtils.truncateTime = function (e) {
    return new Date(e.getFullYear(), e.getMonth(), e.getDate())
}, TimesheetUtils.truncateMinutes = function (e) {
    return new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours())
}, TimesheetUtils.convertDate = function (e, t) {
    if (t) {
        var i = moment.tz(e, t).format().replace(/[+-]\d\d:?\d\d$/, "");
        return moment(i).toDate()
    }
    return moment(e).toDate()
}, TimesheetUtils.getTimezoneOffsetBak = function (e) {
    function t(e, t) {
        for (var i = "" + e; i.length < t;) i = "0" + i;
        return i
    }

    var i = moment(e).toDate(), n = i.getTime();
    if (void 0 == TimesheetUtils.timezoneOffset) TimesheetUtils.timezoneOffset = {}; else if (void 0 !== TimesheetUtils.timezoneOffset[n]) return TimesheetUtils.timezoneOffset[n];
    var r = i.getTimezoneOffset();
    return TimesheetUtils.timezoneOffset[n] = (r < 0 ? "+" : "-") + t(parseInt(Math.abs(r / 60)), 2) + t(Math.abs(r % 60), 2), TimesheetUtils.timezoneOffset[n]
}, TimesheetUtils.addTime = function (e, t, i) {
    return moment(e).add(t, i).toDate()
}, TimesheetUtils.addDays = function (e, t) {
    return TimesheetUtils.addTime(e, t, "days")
}, TimesheetUtils.addWeeks = function (e, t) {
    return TimesheetUtils.addTime(e, t, "weeks")
}, TimesheetUtils.addMonths = function (e, t, i) {
    var n = moment(e), r = i && moment(n).endOf("month").isSame(n, "day");
    return n.add(t, "months"), r && n.endOf("month"), n.toDate()
}, TimesheetUtils.addHours = function (e, t) {
    return TimesheetUtils.addTime(e, t, "hours")
}, TimesheetUtils.sameDay = function (e, t) {
    return e.getDate() == t.getDate() && e.getFullYear() == t.getFullYear() && e.getMonth() == t.getMonth()
};
var isoDateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:?[0-5]\d)|Z/;
TimesheetUtils.isDate = function (e) {
    return angular.isString(e) && null != e.match(isoDateRegex)
}, TimesheetUtils.isAfterDate = function (e, t) {
    return e.getTime() > t.getTime()
}, TimesheetUtils.colspan = function (e) {
    if (null != e) {
        var t = e.rows, i = Object.keys(t);
        if (i.length > 0) {
            var n = t[i[0]].rowKey;
            if (n.issue || n.field) return 5
        }
    }
    return 1
}, TimesheetUtils.getWeekNumber = function (e) {
    return moment(e).week()
}, TimesheetUtils.getMonthKey = function (e) {
    return moment(e).format("YYYY-MM")
}, TimesheetUtils.getNormalizedWeekNumber = function (e) {
    var t = TimesheetUtils.getWeekNumber(e);
    return TimesheetUtils.normalizeNumber(t)
}, TimesheetUtils.normalizeNumber = function (e) {
    return (e < 10 ? "0" : "") + e
}, TimesheetUtils.formatDate = function (e) {
    return moment(e).toJSON().replace("Z", "+0000")
}, TimesheetUtils.getHoursForDay = function (e) {
    var t = [], i = e.startDate, n = e.endDate;
    if (i.getTime() <= n.getTime()) for (var r = new Date; i.getHours() != n.getHours();) {
        var a = i.getHours() == r.getHours();
        t.push({date: i, isToday: a}), i = TimesheetUtils.addHours(i, 1)
    }
    return t
}, TimesheetUtils.isWeekend = function (e, t) {
    return -1 != (t && t.weekendType ? t.weekendType : "60").indexOf(e.getDay().toString())
}, TimesheetUtils.getDatesForWeek = function (e, t) {
    var i = [], n = e.startDate, r = e.endDate;
    if (n.getTime() <= r.getTime()) for (r = TimesheetUtils.addDays(r, 1); !TimesheetUtils.sameDay(n, r);) {
        var a = TimesheetUtils.sameDay(n, TimesheetUtils.truncateTime(new Date)), s = TimesheetUtils.isWeekend(n, t);
        i.push({date: n, isToday: a, isWeekend: s}), n = TimesheetUtils.addDays(n, 1)
    }
    return i
}, TimesheetUtils.getWeeksForMonth = function (e) {
    for (var t = [], i = TimesheetUtils.getPrevMonday(e.startDate, e.reportingDay), n = TimesheetUtils.getNextSunday(e.endDate, e.reportingDay), r = TimesheetUtils.getWeekNumber(new Date), a = i; a.getTime() <= n.getTime();) {
        var s = TimesheetUtils.getWeekNumber(a);
        t.push({week: "Week " + s, date: a, isToday: s == r}), a = TimesheetUtils.addDays(a, 7)
    }
    return t
}, TimesheetUtils.getMonthForYear = function (e) {
    for (var t = [], i = TimesheetUtils.getFirstDayOfTheMonth(e.startDate), n = TimesheetUtils.getLastDayOfTheMonth(e.endDate), r = TimesheetUtils.getMonthKey(new Date), a = i; a.getTime() <= n.getTime();) {
        var s = TimesheetUtils.getMonthKey(a);
        t.push({month: moment.months()[s], date: a, isToday: s == r}), a = TimesheetUtils.addMonths(a, 1)
    }
    return t
}, TimesheetUtils.changeDate = function (e, t, i, n, r) {
    return i && null == e ? null : (null == e && (e = n ? TimesheetUtils.getFirstDayOfTheMonth() : TimesheetUtils.getLastMondayDate(r)), e = n ? TimesheetUtils.addMonths(e, t, n) : TimesheetUtils.addDays(e, t), TimesheetUtils.formatDateForSearch(e))
}, TimesheetUtils.formatDateForSearch = function (e) {
    return e.getFullYear() + "-" + TimesheetUtils.normalizeNumber(e.getMonth() + 1) + "-" + TimesheetUtils.normalizeNumber(e.getDate())
};
var schemaTypes = ["number", "string", "project", "issuetype", "securitylevel", "resolution", "user", "priority", "status", "datetime", "date", "option", "option-with-child", "account", "component", "version", "issuelinks", "sd-customerorganization"];
TimesheetUtils.filterFields = function (e) {
    for (var t = [], i = 0; i < e.length; i++) {
        var n = e[i];
        null != n.schema && (schemaTypes.indexOf(n.schema.type) >= 0 || "array" == n.schema.type && schemaTypes.indexOf(n.schema.items) >= 0 || "com.pyxis.greenhopper.jira:gh-epic-link" == n.schema.custom) && t.push(n)
    }
    return t
}, TimesheetUtils.sortByProperty = function (e, t, i, n) {
    var r = !i || -1;
    return e.sort(function (e, i) {
        return n ? r * n(e[t], i[t]) : angular.isString(e[t]) ? r * e[t].localeCompare(i[t]) : r * (e[t] - i[t])
    })
}, TimesheetUtils.getJson = function (e) {
    return angular.isString(e) && (e = "" != e ? JSON.parse(e) : {}), e
}, TimesheetUtils.makeUISelectList = function (e, t) {
    var i = function (e) {
        return {id: e, label: e}
    }, n = [];
    t && n.push(i(""));
    for (var r = 0; r < e.length; r++) n.push(i(e[r]));
    return n
}, TimesheetUtils.convertHoursToFormat24 = function (e, t) {
    return t ? (e + 12) % 24 : e
}, TimesheetUtils.convertHoursToFormat12 = function (e) {
    return e > 12 || 0 == e ? {hour: Math.abs(e - 12), pm: !0} : {hour: e, pm: !1}
}, TimesheetUtils.getCurrentTimeMs = function () {
    var e = new Date;
    return 1e3 * (60 * e.getHours() * 60 + 60 * e.getMinutes())
}, TimesheetUtils.getTimeSpentMs = function (e, t) {
    if (!e) return 0;
    for (var i = e.split(" "), n = 0, r = 0; r < i.length; r++) n += function (e) {
        var i = t.defaultUnit, n = 0;
        if (isNaN(e)) {
            var r = e.match(/(\d*\.?\d+)([a-zA-Z]*)/);
            r && (n = parseFloat(r[1]), i = r[2])
        } else n = parseFloat(e);
        var a = 36e5 * t.workingHoursPerDay, s = t.workingDaysPerWeek * a;
        switch (i) {
            case"w":
            case"week":
                return n * s;
            case"d":
            case"day":
                return n * a;
            case"h":
            case"hour":
                return 36e5 * n;
            case"m":
            case"minute":
                return 6e4 * n;
            case"s":
                return 1e3 * n
        }
    }(i[r]);
    return n
}, TimesheetUtils.getSearchQueryBuilder = function (e) {
    var t = function (e, t) {
        var i = null;
        if (e.filterOrProjectId) {
            var n = angular.isArray(e.filterOrProjectId) ? e.filterOrProjectId : e.filterOrProjectId.split(",");
            i = [];
            for (var r = 0; r < n.length; r++) 0 == n[r].indexOf(t) && i.push(n[r].split(t)[1])
        }
        return i
    }, i = function (e, t) {
        for (var i = new TimesheetUtils.queryBuilder(" or "), n = 0; n < t.length; n++) i.addQuery(e, '"' + t[n] + '"');
        return i
    }, n = t(e, "filter_"), r = t(e, "project_"), a = angular.isDefined(e.jql);
    n || r || a || !e.projectKey || (r = [e.projectKey]), e.projectKeys = r, e.filterIds = n;
    var s = new TimesheetUtils.queryBuilder(" and ");
    return e.jql && s.addStatement(e.jql), n && n.length > 0 && (1 == n.length ? s.addQuery("filter", n[0]) : s.addQueryBuilder(i("filter", n))), r && r.length > 0 && (1 == r.length ? s.addQuery("project", '"' + r[0] + '"') : s.addQueryBuilder(i("project", r))), s
}, TimesheetUtils.queryBuilder = function (e) {
    var t = [];
    e = e || "&", this.addStatement = function (e) {
        return t.push(e), this
    }, this.addQuery = function (e, t, i) {
        return i = i || "=", null != t && "" != t && this.addStatement(e + i + t), this
    }, this.addQueryWithFunc = function (e, t, i, n) {
        this.addQuery(e, n + "(" + t + ")", i)
    }, this.addQueryBuilder = function (e) {
        this.addStatement("(" + e.build() + ")")
    }, this.build = function () {
        return this.isEmpty() ? "" : t.join(e)
    }, this.isEmpty = function () {
        return null == t || 0 == t.length
    }
}, TimesheetUtils.closeDialogFunctions = {
    submit: function () {
        AP.Dialog.close("submit")
    }, cancel: function () {
        AP.Dialog.close("cancel")
    }
}, TimesheetUtils.normalizeObject = function (e, t) {
    return TimesheetUtils.doWithObject(e, function (i, n) {
        (null == n || t && ("" === n || n === [] || !1 === n)) && delete e[i]
    })
}, TimesheetUtils.unwrapBoolObjects = function (e) {
    return TimesheetUtils.doWithObject(e, function (t, i) {
        angular.isObject(i) && 1 == Object.keys(i).length && i.hasOwnProperty("enabled") && (e[t] = i.enabled)
    })
}, TimesheetUtils.doWithObject = function (e, t) {
    for (var i = Object.keys(e), n = 0; n < i.length; n++) {
        var r = i[n];
        t(r, e[r])
    }
    return e
}, TimesheetUtils.getPerformance = function () {
    var e = window.performance || Date;
    return e.now || (e.now = Date.now), e
}, TimesheetUtils.parseParams = function (e) {
    var t = {}, i = e.split("&");
    if (i) for (var n = 0; n < i.length; n++) if (i[n]) {
        var r = i[n].split("=");
        if (2 == r.length) {
            var a = r[0], s = function (e) {
                return -1 != ["true", "false"].indexOf(e) ? "true" == e : $.isNumeric(e) ? parseFloat(e) : decodeURIComponent(e.replace(/\+/g, " "))
            }(r[1]);
            if (-1 != Object.keys(t).indexOf(a)) if (angular.isArray(t[a])) t[a].push(s); else {
                var o = t[a];
                t[a] = [o, s]
            } else t[a] = s
        }
    }
    return t
}, TimesheetUtils.wrapIntoArray = function (e) {
    return e && !angular.isArray(e) ? [e] : e
}, TimesheetUtils.findOne = function (e, t) {
    return t.some(function (t) {
        return e.indexOf(t) >= 0
    })
}, TimesheetUtils.replaceAll = function (e, t, i) {
    return e.split(t).join(i)
}, TimesheetUtils.uniqueArray = function (e) {
    for (var t = e.concat(), i = 0; i < t.length; i++) for (var n = i + 1; n < t.length; n++) t[i] === t[n] && t.splice(n--, 1);
    return t
}, TimesheetUtils.getTags = function (e) {
    var t = [];
    if (e) {
        var i = (" " + e).match(/\s#\S*/g);
        i && i.length > 0 && angular.forEach(i, function (e) {
            t.push(e.substring(2))
        })
    }
    return t
};
//# sourceMappingURL=app.js.map
