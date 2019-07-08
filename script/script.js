var tagsSet = []
$(document).ready(function () {
  $("#test").hide()
  $("#loader").hide()
  $("#save").click(callAPI);
})

function callAPI() {
  sDate = document.getElementById("startDate").value;
  eDate = document.getElementById("endDate").value;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  if (sDate > today || eDate > today) {
    alert("You have entered dates greater than today. Kindly input correct date");
    return;
  }

  if (sDate == "" || eDate == "") {
    alert("blank date not allowed");
    return;
  }
  if (sDate > eDate) {
    alert("First date is greater than second date, kindly input correct dates");
    return;
  }


  $("#loader").show();
  $(".form").hide();
  tags = ['14/15 Card Issue', 'Tournament Waitlist', 'Kerala Restriction', 'Loyalty Points', 'Media Threat', 'Legal Threat', 'Life Threat', 'Table Removed', '10 Card Point Rummy', 'Incomplete Info', 'Mobile-Unable to play games', 'RG Limit Increase', 'Responsible Gaming Policy', 'Telangana Restriction', 'Unable to place withdrawal', 'Currency Lock', 'No Response From Player', 'Tables Not Visible', '2 Decks', 'Winnings not credited', 'Non VIP Username Change', 'VIP Username Change', 'Withdrawal Pending_Complaint', 'RAF Suspicious', 'VIP User', 'Santa Promotion', 'RAF Fraud', 'Deposits', 'VIP Reactivation', 'VIP Call Back', 'NewUser_deposit_issues', 'Legality', 'Tournament table stuck', 'table stuck', 'Withdrawal Fulfilled', 'Others', 'Website Issue', 'Tournament Cancelled', '21 card rummy', 'Upload Pan Card', 'Suggestions', 'Point Calculation- 21 card rummy', 'Point Calculation- Deal Rummy', 'Point calculation- Point Rummy', 'Point calculation- Pool Rummy', 'Pool Rummy', 'Point Rummy', 'Deal Rummy', 'Cash Back', 'Address Change', 'Unsubscribe Emails', 'Unsubscribe SMS', 'TDS query', 'Practice games', 'Sign up bonus not received', 'How to Withdraw', 'Mobile Verification', 'Emails verification', 'How to play', 'Testing', 'Multiple Accounts', 'DOB -Change', 'Mobile application', 'Player Left Chat( after chatting with us)', 'Mobile Change', 'Email Change', 'Name Change', 'Status of Email sent to Desk', 'Feedback - Negative', 'Feedback - Positive', 'Balance or transactional Queries', 'Bad Declare', 'Deposit-Withdrawing', 'Withdrawal Denied', 'Withdrawal - Under Verification', 'Withdrawal - Cancellation', 'Withdrawal Processed', 'Withdrawal Pending - General', 'Withdrawal Pending - Fraud', 'KYC Verification', 'Promo-Code Bonus Disbursment', 'Non-VIP - RNG', 'Non-VIP - Deactivate Account', 'Non-VIP- Loosing Games', 'Non-VIP - Bonus Request', 'VIP - RNG', 'VIP - Deactivate Account', 'VIP - Loosing Games 1,463 chats 1 ticket', 'VIP - Bonus Request', 'Fraud - Complaint Against User(s)', 'Tournament - Round not Started', 'Tournament Crash', 'Tournament - Unable to Join', 'Tournament Queries', 'Deposit - Unable to Deposit', 'Deposit - To Be Confirmed', 'Deposit Failed', 'Deposit Success', 'Friend Referral - Leaderboard', 'Extra RAF', 'Friend Referal', 'How to make a deposit', 'Disconnection', 'Password Reset', 'Game Not Loading', 'Promotions', 'Bonus Code', 'Abandoned'];
  for (let tag of tags) {
    $.ajax({
      type: 'GET',
      crossOrigin: true,
      dataType: 'jsonp',
      
      url: 'https://api.livechatinc.com/v2/reports/chats/total_chats?date_from=' + sDate + '&date_to=' + eDate + '&group_by=month&tag[]=' + tag,
      success: function (data) {
        let entriesWithDates = [];
        for (let d in data) {
          if (data[d].chats > 0) {
            entriesWithDates.push({
              [d]: data[d]
            });
          }
        } // end of inner for       
        tagsSet.push({
          [tag]: entriesWithDates
        });
        if (tag == 'Abandoned') {
          printTagsSet();
        }
      }
    });
  }

}

function printTagsSet() {
  for (let tagDetails of tagsSet) {
    for (let insideEntry in tagDetails) {
      if (tagDetails[insideEntry].length != 0) {
        for (let doubleEntry of tagDetails[insideEntry]) {
          for (let thirdEntry in doubleEntry) {
            makeHtml(insideEntry, doubleEntry[thirdEntry].chats, doubleEntry[thirdEntry].missed_chats)
          }
        }
      }
    }
  }
}

function makeHtml(firstCol, secondCol, ThirdCol) {
  $("#loader").hide()
  $(".form").show()
  $("#test").show();
  $("#entry-list").append("<tr><td>" + firstCol + "</td><td> " + secondCol + "</td><td>" + ThirdCol + "</td></tr>")
  $("#save").prop("disabled", true);
  sortTable();
}

$("#startDate").focus(function () {
  $("#startDate").datepicker({
    dateFormat: 'yy-mm-dd'
  });
  $("#startDate").datepicker("show");
});

$("#endDate").focus(function () {
  $("#endDate").datepicker({
    dateFormat: 'yy-mm-dd'
  });
  $("#endDate").datepicker("show");
});


function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;
  csvFile = new Blob([csv], {
    type: "text/csv"
  });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function export_table_to_csv(html, filename) {
  var csv = [];
  var rows = $("#entry-list tr");
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length; j++)
      row.push(cols[j].innerText);
    csv.push(row.join(","));
  }
  // Download CSV
  download_csv(csv.join("\n"), filename);
}

$("#CSV").click(function () {
  sDate = document.getElementById("startDate").value;
  eDate = document.getElementById("endDate").value;
  var html = document.querySelector("table").outerHTML;
  export_table_to_csv(html, sDate + "-" + eDate + "-Chat.csv");
})


// Sorting

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("entry-list");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}



