'use strict';
angular.module('eehNavigation').factory('buttonState', function(){
    
          var btnStateVar = true; //initial - true for hidden
          return {
            "changeState": function(){ //toggle the visibility
              btnStateVar = !btnStateVar;
              return btnStateVar;
            },
            "btnState": function(){ //check the current visibility
              return btnStateVar;
            }
          } 
      
});