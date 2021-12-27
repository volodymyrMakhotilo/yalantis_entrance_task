const server = "http://localhost:8080/";
const xhttp = new XMLHttpRequest();
const nameField = document.getElementById("name")
const emailField = document.getElementById("e-mail")
const emailHint = document.getElementById("email_hint")
const nameHint = document.getElementById("name_hint")

document.addEventListener("DOMContentLoaded", getData);

function Member(name, email, registration_date) {
    this.name = name
    this.email = email
    this.registration_date = registration_date;
}

function sendRequest(method, endpoint) {
    xhttp.open(method, server + endpoint, true);

}

function validate() {
    let nameExp = /.[A-Z]*[a-z]\s[.A-Z]*[a-z]/
    if (!emailField.checkValidity()) {
        email_hint.innerHTML = "Wrong inpit"
        return
    } else {
        email_hint.innerHTML = ""
    }
    if (!nameExp.test(nameField.value)) {
        nameHint.innerHTML = "Wrong inpit"
        return
    } else {
        nameHint.innerHTML = ""
    }
    sendData()
}

function getMember() {
    const d = new Date();
    const member = new Member(
        nameField.value,
        emailField.value,
        d.toUTCString()
    )
    return member
}

function addRow(name, email, registration_date) {
    const table = document.getElementById("table")
    table.innerHTML += `<tr><td>${name}</td><td > ${email}</td><td>${registration_date}</td></tr>`
}

function sendData() {
    console.log("Prepering data")
    member = getMember()
    xhttp.onload = function() {
        if (this.status == 200) {
            var member = JSON.parse(this.responseText)
            addRow(member.name, member.email, member.registration_date)
        } else {
            console.log(this)
            email_hint.innerHTML = xhttp.responseText
        }
        console.log("Data recieved")
    }

    sendRequest("POST", "member");
    xhttp.send(JSON.stringify(member));
    console.log("Data sent")
}

function getData() {
    xhttp.onload = function() {
        members = JSON.parse(this.responseText);
        if (members != null) {
            members.forEach(member => addRow(member.name, member.email, member.registration_date))
        }
    }
    sendRequest("GET", "members");
    xhttp.send();
}