$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDqP9A54-t7HcE5OKz4VE6-fQYJzpfqxsM",
    authDomain: "timesheet-28016.firebaseapp.com",
    databaseURL: "https://timesheet-28016.firebaseio.com",
    projectId: "timesheet-28016",
    storageBucket: "timesheet-28016.appspot.com",
    messagingSenderId: "356592783894"
  };

  firebase.initializeApp(config);

  function Timesheet(database) {
    return {
      database: database,
      getEmployees: function() {
        return this.database.ref("Employees");
      },
      computeMonthsWorked: function(rate) {
        var startDate = moment.unix(rate);
        var dateNow = moment();

        var m = dateNow.diff(startDate, "months");
        console.log("Months Worked");
        console.log(m);

        return m;
      },
      computeMonthlyBilled: function(rate) {
        console.log("Months Worked");
        console.log(rate);
      },
      submit: function() {
        var _this = this;
        var employee = {
          Employee: $("#EmployeeName").val(),
          Role: $("#Role").val(),
          StartDate: moment($("#StartDate").val()).unix(),
          MonthlyRate: $("#MonthlyRate").val()
        };
        if ($("#ID").val()) {
          // Has ID VAL
        } else {
          // Create New
          this.getEmployees()
            .push(employee)
            .then(
              function(data) {
                _this.clear();
              },
              function(error) {
                alert("Unable to save");
              }
            );
        }

        // console.log(employee);
      },
      remove: function(id) {
        console.log("removing id");
        // Removes from list
        $("#" + id).remove();
      },
      delete: function(id) {
        // removes from database
        var _this = this;
        console.log(this.getEmployees());
        _this.database
          .ref("/Employees/" + id)
          .remove()
          .then(
            function(d) {
              _this.clear();
            },
            function(err) {
              alert(err);
            }
          );
      },
      create: function() {
        this.clear();
        $("#Employee").removeClass("hidden");
      },
      clear: function() {
        // Clear Forms
        $("#ID").val("");
        $("#EmployeeName").val("");
        $("#Role").val("");
        $("#StartDate").val("");
        $("#MonthlyRate").val("");
        $("#Employee").addClass("hidden");
      },
      insert: function(key, ts) {
        var empl = {
          id: key.trim(),
          Employee: ts.Employee,
          Role: ts.Role,
          StartDate: moment.unix(ts.StartDate).format("MM/DD/YYYY"),
          MonthlyRate: ts.MonthlyRate,
          MonthsWorked: this.computeMonthsWorked(ts.StartDate),
          MonthlyBilled: this.computeMonthlyBilled(ts.StartDate)
        };

        console.log(ts);
        var arr = [];
        arr.push('<tr id="' + empl.id + '">');
        arr.push("<td>" + empl.Employee + "</td>");
        arr.push("<td>" + empl.Role + "</td>");
        arr.push("<td>" + empl.StartDate + "</td>");
        arr.push("<td>" + empl.MonthsWorked + "</td>");
        arr.push("<td>" + empl.MonthlyRate + "</td>");
        arr.push("<td>" + empl.MonthlyBilled + "</td>");
        arr.push(
          '<td><button id="delete' +
            empl.id +
            '" type="button" class="btn btn-danger">Delete</button></td>'
        );

        arr.push("</tr>");

        $("#tbody").append(arr.join(""));
        $("#" + empl.id).on("click", function(e) {
          $("#Id").val(empl.id);
          $("#EmployeeName").val(empl.Employee);
          $("#Role").val(empl.Role);
          $("#StartDate").val(empl.StartDate);
          $("#MonthlyRate").val(empl.MonthlyRate);
          $("#Employee").removeClass("hidden");
        });

        $("#delete" + empl.id).on("click", function(e) {
          timesheet.delete(empl.id);
        });
      }
    };
  }

  timesheet = new Timesheet(firebase.database());

  timesheet.getEmployees().on("child_added", function(snapshot) {
    timesheet.insert(snapshot.key, snapshot.val());
  });

  timesheet.getEmployees().on("child_removed", function(snapshot) {
    timesheet.remove(snapshot.key);
  });

  $("#submit").on("click", function(evt) {
    timesheet.submit();
  });

  $("#AddEmployee").on("click", function(evt) {
    timesheet.create();
  });

  $("#StartDate").datepicker({});

  // TriviaGame().start();

  console.log("App Initialized");
});
