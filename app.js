(function () {
  'use strict'

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;
  ctrl.searchTerm = "";
  ctrl.searchResult = ""; //Set to empty string if all OK
  ctrl.found = [];

  ctrl.search = function() {
    if(ctrl.searchTerm ) {
      ctrl.searchResult = "";
      var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

      promise.then(function(result) {
        ctrl.found = result;
        if(ctrl.found.length == 0) {
          ctrl.searchResult = "Nothing found (matching \"" + ctrl.searchTerm + "\")";
        }
      });
    }
    else
    {
      ctrl.searchResult = "Nothing found";
    }
  };

  ctrl.dontWant = function(index) {
    console.log("Index: ", index);
    ctrl.found.splice(index, 1);
  };
}


MenuSearchService.$inject = ["$http", "ApiBasePath"];
function MenuSearchService($http, ApiBasePath) {
var service = this;
   service.getMatchedMenuItems = function(searchTerm) {
     return $http({
       method: "GET",
       url: (ApiBasePath + "/menu_items.json")
     })
       .then(function(response){
         var menuItems = response.data;
         var foundItems = filterOnDescription(menuItems.menu_items, searchTerm);

         return foundItems;
       });
   };

   function filterOnDescription(list, searchTerm) {
     var newList = [];

     for(var i = 0; i < list.length; i++) {
       if(list[i].description.indexOf(searchTerm) > 0) {
         newList.push(list[i]);
       }
     }

     return newList;
   }
 }

 function FoundItemsDirective() {
   var ddo = {
     templateUrl: "foundItems.html",
     scope: {
       list: "<",
       title: "@title",
       result: "@result",
       dontWant: "&"
     },
     // controller: FoundItemsDirectiveController,
     // controllerAs: "list",
     // bindToController: true
   };

   return ddo;
 }
})();
