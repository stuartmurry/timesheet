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
      getEmployees : function() {
        return this.database.ref('Employees');
      },
      submit: function() {
        var employee = {
          Employee: $("#EmployeeName").val(),
          Role: $("#Role").val(),
          StartDate: moment($("#StartDate").val()).unix(),
          MonthlyRate: $("#MonthlyRate").val()
        };

        console.log('inserting employee');
        console.log(employee);

        this.getEmployees()
          .push(employee)
          .then(
            function(data) {
              // Clear Forms
              $("#EmployeeName").val("");
              $("#Role").val("");
              $("#StartDate").val("");
              $("#MonthlyRate").val("");
            },
            function(error) {
              alert("Unable to save");
            }
          );

        // console.log(employee);
      },
      insert: function(ts) {
        
        console.log(ts);
        var arr = [];
        arr.push('<tr>');
        arr.push('<td>' + ts.Employee + '</td>');
        arr.push('<td>' + ts.Role + '</td>');
        arr.push('<td>' + moment.unix(ts.StartDate).format('MM/DD/YYYY') + '</td>');
        arr.push('<td>' + ts.MonthlyRate + '</td>');

        arr.push('</tr>');
        
        $("#tbody").append(arr.join(''));
        
        // $("#EmployeeName").val(ts.EmployeeBane);
        // $("#Role").val();
        // $("#StartDate").val();
        // $("#MonthlyRate").val();
      }
    };
  }

  var timesheet = new Timesheet(firebase.database());

  timesheet.getEmployees().on("child_added", function(snapshot) {
    timesheet.insert(snapshot.val());
  });

  $("#submit").on("click", function(evt) {
    timesheet.submit();
  });

  $("#StartDate").datepicker({});

  // TriviaGame().start();

  console.log("App Initialized");
});
