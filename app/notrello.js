angular.module("NoTrello", [])
.controller('MainCtrl', function($scope){
  $scope.lists = [
    {"id": 0, "title": "Lista 1"},
    {"id": 1, "title": "Lista 2"},
    {"id": 2, "title": "Lista 3"}
  ];

  $scope.cards = [
    {"id": 0, "title": "Card 1", "color": "#fff", "img": "img.svg", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0},
    {"id": 1, "title": "Card 2", "color": "#fff", "img": "", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0},
    {"id": 2, "title": "Card 3", "color": "#fff", "img": "", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0}
  ];

  function getCurrentListCards(id_list){
    var currentListCards = [];
    for(var i = 0; i < $scope.cards.length; i++){
      if($scope.cards[i].id_list === id_list){
        currentListCards.push($scope.cards[i]);
      }
    }
    return currentListCards;
  }

  function insertList(){
    if($scope.lists.length > 0){
      var id = $scope.lists[$scope.lists.length-1].id + 1;
    }else{
      var id = 0;
    }
    var list = {"id": id, "title": "Título"}
    $scope.lists.unshift(list);
  }

  function removeList(list){
    var index = $scope.lists.indexOf(list);
    var cardList = getCurrentListCards(list.id);
    for(var i = 0; i < cardList.length; i++){
      if (cardList[i].id_list === list.id){
        removeCard(cardList[i]);
      }
    }
    if(index != -1) $scope.lists.splice(index, 1);
  }

  function insertCard(id_list){
    if($scope.cards.length > 0){
      var id = $scope.cards[$scope.cards.length-1].id + 1;
    }else{
      var id = 0;
    }
    var card = {"id": id, "title": "Título", "color": "#fff", "img":"", "desc":"Teste", "id_list":id_list}
    $scope.cards.unshift(card);
  }

  function removeCard(card){
    var index = $scope.cards.indexOf(card);
    if(index != -1) $scope.cards.splice(index, 1);
  }

  //Public methods
  $scope.getCurrentListCards = getCurrentListCards;
  $scope.insertList = insertList;
  $scope.removeList = removeList;
  $scope.insertCard = insertCard;
  $scope.removeCard = removeCard;

});
