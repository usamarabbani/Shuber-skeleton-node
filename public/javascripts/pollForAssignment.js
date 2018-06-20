getCurrentDriver()

function main(currentDriverName) {
   // Check your browser console
   console.log("pollForAssignment.js working"); 
   
   // Create request that says we want to get the list of rides
   // as text
   var request = new Request('/api/rides/', {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow', 
      headers: new Headers({
         'Content-Type': 'text/plain'
      })
   }); 
   
   // Send the request (fetch), then convert the fetched text to JSON
   // then do something with the JSON data
   fetch(request).then(function(response) {
      return response.json(); 
   }).then(function(jsonResponse) {
      // With the JSON data (actually the rides table) we just retrieved, 
      // we want to check if there are rides in the table that have the same
      // rider ID as the rider whose page is making this request.
      
      // Get current driver info      
      // iterate through rides table and look for a match with
      // the current driver in the current driver object            
      console.log("current driver: " + currentDriverName); 
      for (var i = 0; i < jsonResponse.length; i++) {
         var rideDriverName = jsonResponse[i].driver_name;
         console.log("rideDriverName: " + rideDriverName); 
         if (rideDriverName == currentDriverName) {
            console.log("FOUND A MATCH"); 
         }         
      }  
      setInterval(function() {askForAss(currentDriverName)}, 5000); 
   });
}

function askForAss(currentDriverName) {
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
         var rideDriverName = jsonResponse[i].driver_name;
         console.log("rideDriverName: " + rideDriverName); 
         if (rideDriverName == currentDriverName) {
            console.log("FOUND A MATCH"); 
            window.location.replace("/assignment");
         }         
      }        
   });
   
}

// gets current driver by cookie
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

function getCurrentDriver() {
   var currentDriverName = getCookie(); 
   main(currentDriverName); 
}