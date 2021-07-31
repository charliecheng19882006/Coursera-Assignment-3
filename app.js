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
  ctrl.search = function() {
      if (ctrl.searchTerm === "" || ctrl.searchTerm === undefined) {
        ctrl.found = [];
      } else {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function(result) {
          ctrl.found = result;
        });
      }
    }
  ctrl.removeItem = function(itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ["$http", "ApiBasePath"];
function MenuSearchService($http, ApiBasePath) {
var service = this;
var foundItems = [];
   service.getMatchedMenuItems = function(searchTerm) {
     var response = $http({
       method: "GET",
       url: (ApiBasePath + "/menu_items.json")
     });
     return response.then(function(result) {
       var itemsArray = result.data.menu_items;
       foundItems = [];
       for (var i = 0; i < itemsArray.length; i++) {
         if (itemsArray[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
           foundItems.push(itemsArray[i]);
         }
       }
       return foundItems;
   });
  }
  service.removeItem = function(itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
}

 function FoundItemsDirective() {
   var ddo = {
     templateUrl: 'foundItems.html',
     scope: {
       items: '<',
       remove: '&'
     },
     controller: FoundItemsDirectiveController,
     controllerAs: 'list',
     bindToController: true
   };
   return ddo;
 }

 function FoundItemsDirectiveController() {
   var list = this;
   list.nothingFound = function() {
     return list.items != undefined && list.items.length === 0;
   }
 }
})();
