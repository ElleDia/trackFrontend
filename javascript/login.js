document.addEventListener('DOMContentLoaded', (event) => {
    baseUrl = 'http://localhost:3000';

    // var greeting = document.querySelector('.greeting');
    // var h1Tag = document.createElement('H1');
    // h1Tag.innerHTML = "Welcome, " + "User";
    // greeting.prepend(h1Tag);
    // //BeTableClick);

    document.getElementById("logIn").addEventListener("click", userLogin);
});

function userLogin() {
    var user = document.getElementById("signInUsername").value;
    var password = document.getElementById("signInPassword").value;
    if (user == "admin" && password == "admin") {
        //Set the authentication state to authenticated.
        sessionStorage.setItem("AuthenticationState", "Authenticated");


        const expiry = new Date();
        expiry.addHours(1);
        //This authentication key will expire in 1 hour.
        sessionStorage.setItem("AuthenticationExpires", expiry.getTime);

        //Push the user over to the next page.
        window.open('dashboard.html', '_self');
    }
    else{
        alert("Invalid username or password.");
    }
}

Date.prototype.addHours = function(h) {    
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this;   
 }