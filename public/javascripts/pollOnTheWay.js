main()

function main() {
   
   console.log("I AM RUNNING"); 
   
   // Get current passenger name from cookie 
   var currentPassengerName = getPassengerCookie(); 
   
   // Perform the initial request 
   var request = new Request('/api/rides/', {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow', 
      headers: new Headers({
         'Content-Type': 'text/plain'
      })
   }); 
   
   fetch(request).then(function(response) {
      return response.json(); 
   }).then(function(jsonResponse) {
      for (var i = 0; i < jsonResponse.length; i++) {
         var ridePassName = jsonResponse[i].passenger_name;
         var pickup_status = jsonResponse[i].pickup_ready; 
         console.log("curPassName: " + currentPassengerName + ", ridePassName: " + ridePassName + ", pickup_status: " + pickup_status); 
         if (ridePassName == currentPassengerName && 
             pickup_status == true) {
            console.log("PICKUP IS READY"); 
         }             
      }
      setInterval(function() {pollForPickup(currentPassengerName)}, 5000);
   }); 
}

function pollForPickup(currentPassengerName) {
   var request = new Request('/api/rides/', {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow', 
      headers: new Headers({
         'Content-Type': 'text/plain'
      })
   }); 
   
   fetch(request).then(function(response) {
      return response.json();
   }).then(function(jsonResponse) {
      for (var i = 0; i < jsonResponse.length; i++) {
         var ridePassName = jsonResponse[i].passenger_name;
         var pickup_status = jsonResponse[i].pickup_ready; 
         if (ridePassName == currentPassengerName && 
             pickup_status == true) {
            console.log("PICKUP IS READY"); 
            window.location.replace("/offyougo"); 
         }             
      } 
   }); 
}

function getPassengerCookie() {
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

