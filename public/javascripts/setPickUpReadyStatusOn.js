console.log("You are now in pickUpReadyStatusOn.js"); 

// The job of this file is to update a row in the rides table such that 
// the pickup status becomes true. This means that the driver has arrived at 
// the pickup location, and is ready to pick up the customer. 

// Which row are we updating? We are updating the row that has the current
// driver's name/id in it. 
function main() {
   // Get name of current driver using cookies
   var currentDriverName = getCookie(); 
   console.log("pk currentDriverName: " + currentDriverName); 
   
   // Use the name to edit the right tuple's pickup_ready value to true
   requestString = '/api/rides/' + currentDriverName + '/pickup_ready/true'; 
   var request = new Request(requestString, {
      method: 'PUT',
      headers: new Headers({
         'Content-Type': 'text/plain'
      })
   }); 
   
   fetch(request);   
}

function getCookie() {
   var cookiename = "username" + "="; 
   var ca = document.cookie.split(';'); // ca stands for cookie array
   for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
         c = c.substring(1);
      }
      if (c.indexOf(cookiename) == 0) {
         return c.substring(cookiename.length, c.length); 
      }
   }
   return ""; 
}

main()