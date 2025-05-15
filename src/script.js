// Global Variables
let title = "N/A";
var detailsArray = ["", "", "", "", "", "", "", "", "", ""];
var tasksArray = ["", "", "", "", "", "", "", "", "", ""];
var locArray = ["", "", "", "", "", "", "", "", "", ""];
// Global APIs

let vacURL = "https:///api.lmiforall.org.uk/api/v1/vacancies/search";
let jobURL = "http://api.lmiforall.org.uk/api/v1/soc/search";

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}


function openPage(pageName, elmnt, color) {
  console.log(pageName);
  // Hide all elements with class="tabcontent" by default */
  if (pageName == "Results" && title == "N/A") {
    alert("Please Fill Out The Form");
    return;
  }
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}


function calchourpay(time, timepay) {
  if (time == "hour") {
    //  block of code to be executed if condition is true
    return timepay;
  } else if (time == "week") {
    // executes if true
    return timepay / 7 / 24;
  } else if (time == "month") {
    // executes if true
    return timepay / 30.41 / 24;
  } else if (time == "year") {
    // executes if true
    return timepay / 365 / 24;
  }
}


function outputnormal(title, time, hours, tax, NI, gov, daysw) {
  // display the unedited values
  document.getElementById("dtitle").innerHTML += " - " + title;
  document.getElementById("dtimef").innerHTML += " - " + time;
  document.getElementById("dhour").innerHTML += " - " + hours;
  document.getElementById("ddw").innerHTML += " " + daysw;
  document.getElementById("dpay").innerHTML += " - £" + timepay.value;
  document.getElementById("dtax").innerHTML += " - " + tax + "%";
  document.getElementById("dni").innerHTML += " - " + NI + "%";
  document.getElementById("dtt").innerHTML += " - " + gov + "%";
}


function outputcalc(hours, tax, NI, hourpay, daysw) {
  // does the calculations and displays

  // all further calucations are done off that
  // hours / daysw calculates how many hours were worked each day
  // calculates gross hourly pay
  let taxed = hourpay - tax / 100;
  let NI2 = hourpay - NI / 100;
  ghp = hourpay - NI2 - taxed;

  document.getElementById("dtitlef").innerHTML += " - " + title;
  document.getElementById("dhourp").innerHTML += " - " + ghp.toFixed(2);
  document.getElementById("ddayp").innerHTML +=
    " - " + ((ghp * hours) / daysw).toFixed(2);
  document.getElementById("dweekp").innerHTML +=
    " - " + (ghp * hours).toFixed(2);
  // added as some jobs pay in 2 week increments
  document.getElementById("dfortp").innerHTML +=
    " - " + (ghp * hours * 2).toFixed(2);
  // used 30.41 as thats the average off all months added together / 12
  document.getElementById("monthpay").innerHTML +=
    " - " + (ghp * hours * 30.41).toFixed(2);

  document.getElementById("dyearp").innerHTML +=
    " - " + (ghp * hours * 356).toFixed(2);
}


// takes the title and sends it to the vacancies list
function displayjob() {
  // checks if the user has entered a job title
  if (title == "N/A") {
    alert("no job title has been entered");
    // terminates
    return false;
  }
  //  sends user to the vacancies page and executes a search for the job title
  location.href = "vacancies.html";
}


function userapi() {
//  creates the api when the form is submitted 
// clears the localStorage
localStorage.setItem("jsearch", "");
  let userapi = vacURL;
  let keyword,
  location = "";
  //  optains inputs from form
  keyword = document.getElementById("keyword").value;
  location = document.getElementById("location").value;

  console.log(keyword);
  console.log(location);

  if (location != "" && keyword != "") {
    // keyword search
    // creates and builds link 
    let key = ""
    key = keyword.split(" ");
    key = key.join("%20");

    let loc = ""
    if (location == "N/A"){
    userapi = userapi  + "?keywords=" + key;
    console.log(userapi)
    fetchuserapi(userapi);
      console.log("Running")
   
    }else{
      console.log("Not Running")
      loc = location.split(" ")
      loc = loc.join("%20")
      userapi = userapi + "?location=" + loc + "&keywords=" + key
    }

    fetchuserapi(userapi);
    
  }
}



// fetch api functions called on load
function fetchapi() {
   // checks if a title was entered on takehome.html using localstorage placeholders
  let titles = localStorage.getItem("jsearch");
  console.log("Title = " + titles);
  // sets a placeholder for location to be used in multiple functions
  // checks if a title has been entered
  if (titles == null || titles == undefined || titles == "") {
    fetch(vacURL)
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.length === 0){
          // if nothing matches search alert and end 
          alert("no items found")
          return
        }
        calljobfirst(responseJSON);
              // sets a timeout so that the details and task are prestored
        setTimeout(function () {
          displayPosts(responseJSON);
        },1000);
      });
  } else {
    // if a title was entered search for it
    let userapi = vacURL;
    let key = "";
    // sets the url
    // if it is 2 worded i.e Software Dev it removes the second for more results on specific niches
    key = titles.split(" ");
    key = key.join("%20");
    userapi = userapi + "?keywords=" + key;

    console.log(userapi);
    // fetchs api
    fetch(userapi)
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.length === 0){
          // if nothing matches search alert and end 

          alert("no items found")
          return
        }
        calljobfirst(responseJSON);
        // timer ensures task and details are filled 
        setTimeout(function () {
          displayPosts(responseJSON
          );
        }, 1000);
      });
  }
}
// fetches the updated with input api 
function fetchuserapi(userapi) {
  fetch(userapi)
    .then((response) => response.json())
    .then((responseJSON) => {
      console.log(responseJSON);
      if (responseJSON.length === 0){
        alert("no items found")
        return
      }
      calljobfirst(responseJSON);
      // sets a timeout so that the details and task are prestored 
      setTimeout(function () {
        displayPosts(responseJSON);
      }, 1000);
    });
}


// calls the job api first
function calljobfirst(response) {
  var j = 0
// checks if location is the placeholder (on load)
  
    // runs 10x taking the first 10 values 
    for (let i = 0 ; i < 10; ){
      let postItem = response[i]; 
        let postTitle = postItem.title
        // sets the url
 
        locArray[i] = i
        console.log(locArray[i])
        key = postTitle.split(" ");
        key = key.join("%20");
        let jobinfourl = jobURL + "?q=" + key;
        getjobdetails(jobinfourl, i);
        i++; 
        j = j++
      if (i == 10){
      // ends function when it has 10 
      return 
    }
  }
  // runs until j = 10 or it runs out of values to pull from 
    if (j == 0){

      alert("No Listings Found")
      // terminates if j is 0 
      return
    }
}

// gets the details of the jobdetails api soc
function getjobdetails(url, i) {
  // fetchs the url 
  fetch(url)
    .then((response) => response.json())
    .then((responseJSON) => {
      console.log(responseJSON);
      if (responseJSON.length === 0){
        console.log("blank")
        return
      }
      // passes the json response and the number it is on 
      filljob(responseJSON, i);
    });
}


// fills the detials from the api to an array
function filljob(response, i) {
  // sets post items from the response
  let postItem = response[i];
  // declares variables 
  var details,
    task = "";
    // checks if the value is undefined and sets a placemark
    try {a = checkundefined(postItem.description)}
    catch(e){if (e === undefined);
    a = ""}

    
  details = a;
      // checks if the value is undefined and sets a placemark
  try {b = checkundefined(postItem.tasks)}
  catch(e){if (e === undefined);
  b = ""}
  task = b;
  // sends it to the array 
  detailsArray[i] = details;
  tasksArray[i] = task;
  console.log(detailsArray[i]);
    }


function checkundefined(check){
      // checks if the value is undefined and sets a placemark

  if (check ==undefined){
    return("")
  }
  else{
    return(check)
  }

}


// does the clickable button in each post
function displayUser(evt) {
  //  currentTarget property gives you the element to which the event was attached
  let btn = evt.currentTarget;
  console.log(btn);
  //navigate to other elements, in this case the parents element
  let post = btn.parentElement;
  console.log(post);

  // dynamic display button

  if (post.querySelector("div.user_details").style.display == "") {
    post.querySelector("div.user_details").style.display = "block";
    btn.innerHTML = "Details &#9650;";
  } else if (post.querySelector("div.user_details").style.display == "block") {
    post.querySelector("div.user_details").style.display = "";
    btn.innerHTML = "Details &#9660;";
  }
}


function displayPosts(response) {
  // creates a new post for each vacancy
  console.log(response);
  

  let postListSection = document.getElementById("postlist");
  postListSection.innerHTML = ""; // Clear old posts

  let template = document.getElementsByTagName("template")[0];
  // sets template 

      //declares j 
      //  skips if no location filtered aka on load
          // runs 10x taking the first 10 values 
       for (let i = 0; i < 10; ) {
        //select the post item from the array that the API returned
        
     
        let postItem = response[i];
        console.log(postItem);
          let post = template.content.cloneNode(true);
      
          // add the data from the post
          let postTitle = postItem.title;
          let postBody = postItem.summary;
          let postlink = postItem.link;
          let postCompany = postItem.company;
          let postLocation = postItem.location.location;
      
          // details = localStorage.getItem("details" + i);
          // task = localStorage.getItem("task" + i);
          details = detailsArray[i];
          task = tasksArray[i];
  
            // uses the placeholders if no details were given 

          if (details == null || details == "") {
            details = "No details given";
          }
          console.log(2);
          // uses the placeholders if no details were given 
          if (task == null || task == "") {
            task = "No task given";
          }
          
          // sets the details and the task 
          let postDetails = details;
          let postTask = task;
      
          // querySelector returns the FIRST element that matches
          let postHeader = post.querySelector("span.post_header");
          let postContent = post.querySelector("p.post_content");
          let jobtask = post.querySelector("p.task");
          let jobdetails = post.querySelector("p.job_details");
          let postlinkp = post.querySelector("p.postlink");
      
          //  assign values
          postHeader.innerText = "Title: " + postTitle;
          postContent.innerText = postBody + "\n location: \n" + postLocation;
          jobtask.innerText = postDetails;
          jobdetails.innerText = postTask;
          postlinkp.innerHTML = postCompany.link(postlink);
      
          //  Select the button within the post and add an event listener
          let postButton = post.querySelector("button.show_details");
          postButton.addEventListener("click", displayUser);
      
          let postListSection = document.getElementById("postlist");
      
          postListSection.appendChild(post);
      
          // increases i and j by 1 
          i++
          // ends at 10 values 
          if (i == 10){
            return
          }
        }
       
      }
    

// Event Listeners
// Code For Pay Calculator Page
document.getElementById("PayForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // Declarations of varibles

  let time = 0;
  let hours = "";
  let timepay = 0;
  let tax = 0;
  let NI = 0;
  let hourpay = 0;

  // gets the value from the form
  title = document.getElementById("title").value;
  localStorage.setItem("jsearch", title);
  time = document.getElementById("time").value;
  hours = document.getElementById("hours").value;
  timepay = document.getElementById("timepay").value;
  daysw = document.getElementById("daysw").value;
  tax = document.getElementById("tax").value;
  NI = document.getElementById("NI").value;

  //  will send an alert if the users taxs are more than they earn
  let gov = Number(NI) + Number(tax);

  if (gov > 100) {
    alert("Your Being Taxed to much");
  }

  hourpay = calchourpay(time, timepay, NI, tax);
  console.log(hourpay + "1");
  out1 = outputnormal(title, time, hours, tax, NI, gov, daysw);
  out2 = outputcalc(hours, tax, NI, hourpay, daysw);
});



  