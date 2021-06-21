(function (){
'use strict';
angular.module('ControllerAsApp', [])
.controller('ToBuyItemsController', ToBuyItemsController)
.controller('BoughtItemsController', BoughtItemsController)
.service('ShoppingListService', ShoppingListService);

ToBuyItemsController.$inject = ['ShoppingListService'];
function ToBuyItemsController(ShoppingListService){
  var list1 = this;
  //var shopping = ShoppingListFactory();
  // Use factory to create new shopping list service
  list1.ToBuyList =
  [     {name:"cookies",quantity:10},
        {name:"bananas",quantity:10},
        {name:"fries",quantity:10},
        {name:"noodles",quantity:10},
        {name:"peppers",quantity:10},
    ];

  list1.check = function (number) {
    if (number == 0) {
      return true;
    } else {
      return false;
    }
  };

  list1.removeItem = function (itemIndex) {
    ShoppingListService.addItems(list1.ToBuyList[itemIndex].name, list1.ToBuyList[itemIndex].quantity);
    list1.ToBuyList.splice(itemIndex, 1);
  };

}

BoughtItemsController.$inject = ['ShoppingListService'];
function BoughtItemsController(ShoppingListService){
  var list2 = this;

  list2.items = ShoppingListService.getItems();
  list2.check = function (number) {
    if (number == 0) {
      return true;
    } else {
      return false;
    }
  };
}

function ShoppingListService() {
  var service = this;
  var serviceItems = [];

  service.addItems = function(itemName, quantity) {
    var item = {
      name: itemName,
      quantity: quantity
    };
    serviceItems.push(item);
  };

  service.getItems = function(){
    return serviceItems;
  }
}


})();
