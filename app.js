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
  ctrl.Result = ""; //Set to empty string if all OK
  ctrl.found = [];

  ctrl.search = function() {
    if(ctrl.searchTerm) {
      ctrl.Result = "";
      var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

      promise.then(function(response) {
        var list = response.data;
        ctrl.found = MenuSearchService.filterOnDescription(list, ctrl.searchTerm);
        if(ctrl.found.length === 0) {
          ctrl.Result = "Nothing found (matching \"" + ctrl.searchTerm + "\")";
        }
      });
    }
    else
    {
      ctrl.Result = "Nothing found";
    }
  };

    ctrl.removeItem = function(index) {
      console.log("Index: ", index);
      ctrl.found.splice(index, 1);
    };
  }


MenuSearchService.$inject = ["$http", "ApiBasePath"];
function MenuSearchService($http, ApiBasePath) {
var service = this;
   service.getMatchedMenuItems = function(searchTerm) {
     var response = $http({
       method: "GET",
       url: (ApiBasePath + "/menu_items.json")
     })
   };

   function filterOnDescription(list, searchTerm) {
     var array = [];

    for(var i = 0; i < list.length; i++) {
       if(list[i].description.indexOf(searchTerm) !== -1) {
         array.push(list[i]);
        }
      }
      return array;
    }
}

 function FoundItemsDirective() {
   var ddo = {
     templateUrl: 'foundItems.html',
     scope: {
       list: "=foundItems",
       title: "@title",
       result: "@result",
       remove: "&remove"
     },
     // controller: FoundItemsDirectiveController,
     // controllerAs: "list",
     // bindToController: true
   };
   return ddo;
 }
})();
