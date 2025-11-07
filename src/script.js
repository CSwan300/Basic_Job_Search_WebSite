//This was my first time ever properly using javascript i apologise for everything :)
// Global Variables
let title = "N/A";
// Changed how the arrays were decalred and set to 10 (since it only shows the top 10 listings)
const arrayLength = 10;
const detailsArray = new Array(arrayLength).fill("");
const tasksArray = new Array(arrayLength).fill("");
const locArray = new Array(arrayLength).fill("");

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
    document.getElementById("dtitle").innerHTML += " - £" + title;
    document.getElementById("dtimef").innerHTML += " - £" + time;
    document.getElementById("dhour").innerHTML += " - £" + hours;
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
    //sets absolute to remove negatives
    let ghp = Math.abs(hourpay - NI2 - taxed);

    document.getElementById("dtitlef").innerHTML += " - " + title;
    document.getElementById("dhourp").innerHTML += " - £" + ghp.toFixed(2);
    document.getElementById("ddayp").innerHTML +=
        " - £" + ((ghp * hours) / daysw).toFixed(2);
    document.getElementById("dweekp").innerHTML +=
        " - £" + (ghp * hours).toFixed(2);
    // added as some jobs pay in 2 week increments
    document.getElementById("dfortp").innerHTML +=
        " - £" + (ghp * hours * 2).toFixed(2);
    // used 30.41 as thats the average off all months added together / 12
    document.getElementById("monthpay").innerHTML +=
        " - £" + (ghp * hours * 30.41).toFixed(2);

    document.getElementById("dyearp").innerHTML +=
        " - £" + (ghp * hours * 356).toFixed(2);
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


async function userapi() {
    localStorage.setItem("jsearch", "");
    let userapi = vacURL;
    let keyword = document.getElementById("keyword").value;
    let location = document.getElementById("location").value;

    if (location !== "" && keyword !== "") {
        let key = keyword.split(" ").join("%20");

        if (location === "N/A") {
            userapi = userapi + "?keywords=" + key;
            fetchuserapi(userapi);
        } else {
            let loc = location.split(" ").join("%20");
            userapi = userapi + "?location=" + loc + "&keywords=" + key;
            fetchuserapi(userapi);
        }
    }
}

async function fetchapi() {
    let titles = localStorage.getItem("jsearch");

    if (!titles) {
        let response = await fetch(vacURL);
        let responseJSON = await response.json();

        if (responseJSON.length === 0) {
            alert("no items found");
            return;
        }
        await calljobfirst(responseJSON);

        displayPosts(responseJSON);
    } else {
        let userapi = vacURL;
        let key = titles.split(" ").join("%20");
        userapi = userapi + "?keywords=" + key;

        let response = await fetch(userapi);
        let responseJSON = await response.json();

        if (responseJSON.length === 0) {
            alert("no items found");
            return;
        }
        await calljobfirst(responseJSON);

        displayPosts(responseJSON);
    }
}

async function fetchuserapi(userapi) {
    let response = await fetch(userapi);
    let responseJSON = await response.json();

    if (responseJSON.length === 0) {
        alert("no items found");
        return;
    }
    await calljobfirst(responseJSON);

    displayPosts(responseJSON);
}

async function calljobfirst(response) {
    let j = 0;

    for (let i = 0; i < 10; ) {
        let postItem = response[i];
        let postTitle = postItem.title;

        locArray[i] = i;
        let key = postTitle.split(" ").join("%20");
        let jobinfourl = jobURL + "?q=" + key;
        await getjobdetails(jobinfourl, i);
        i++;
        j++;

        if (i === 10) {
            return;
        }
    }

    if (j === 0) {
        alert("No Listings Found");
        return;
    }
}

async function getjobdetails(url, i) {
    let response = await fetch(url);
    let responseJSON = await response.json();

    if (responseJSON.length === 0) {
        return;
    }
    filljob(responseJSON, i);
}

function filljob(response, i) {
    let postItem = response[i];

    let details = checkundefined(postItem.description);
    let task = checkundefined(postItem.tasks);

    detailsArray[i] = details;
    tasksArray[i] = task;
}

function checkundefined(check) {
    return check === undefined ? "" : check;
}

function displayUser(evt) {
    let btn = evt.currentTarget;
    let post = btn.parentElement;

    let userDetails = post.querySelector("div.user_details");

    if (userDetails.style.display === "") {
        userDetails.style.display = "block";
        btn.innerHTML = "Details &#9650;";
    } else if (userDetails.style.display === "block") {
        userDetails.style.display = "";
        btn.innerHTML = "Details &#9660;";
    }
}

function displayPosts(response) {
    let postListSection = document.getElementById("postlist");
    postListSection.innerHTML = "";

    let template = document.getElementsByTagName("template")[0];

    for (let i = 0; i < 10; i++) {
        let postItem = response[i];
        let post = template.content.cloneNode(true);

        let postTitle = postItem.title;
        let postBody = postItem.summary;
        let postlink = postItem.link;
        let postCompany = postItem.company;
        let postLocation = postItem.location.location;

        let details = detailsArray[i] || "No details given";
        let task = tasksArray[i] || "No task given";

        let postHeader = post.querySelector("span.post_header");
        let postContent = post.querySelector("p.post_content");
        let jobtask = post.querySelector("p.task");
        let jobdetails = post.querySelector("p.job_details");
        let postlinkp = post.querySelector("p.postlink");

        postHeader.innerText = "Title: " + postTitle;
        postContent.innerText = postBody + "\n location: \n" + postLocation;
        jobtask.innerText = details;
        jobdetails.innerText = task;
        postlinkp.innerHTML = postCompany.link(postlink);
        postlinkp.style.textAlign = "center";

        let postButton = post.querySelector("button.show_details");
        postButton.addEventListener("click", displayUser);

        postListSection.appendChild(post);
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



