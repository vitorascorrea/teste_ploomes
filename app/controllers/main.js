app.controller('MainCtrl', function($scope, $http){
  $scope.lists = [
    {"ID_Lista": 2, "Lista": "Lista 1", "Ordem_Lista": 0, "Cards": [
      {"ID_Card": 2, "Card": "Card 1", "Cor_Card": "#fff", "Img_Card": "imgs/img.svg", "Lista": 2}
    ] ,"slide": true}
  ];

  $scope.listModal = false;
  $scope.cardModal = false;
  $scope.insertListModal = false;
  $scope.removeListModal = false;
  $scope.insertCardModal = false;
  $scope.removeCardModal = false;
  $scope.editCardModal = false;
  $scope.actualList = null;
  $scope.actualCard = null;

  function toggleListModal(mode, list_id) {
    $scope.actualList = $scope.lists.find(function (l) {
                          return l.ID_Lista === list_id;
                        });
    $scope.listModal = !$scope.listModal;
    if(mode === "insert"){
      $scope.insertListModal = true;
      $scope.removeListModal = false;
    } else if(mode === "remove"){
      $scope.removeListModal = true;
      $scope.insertListModal = false;
    } else{
      $scope.insertListModal = false;
      $scope.removeListModal = false;
    }
  }

  function toggleCardModal(mode, list_id, card_id) {
    $scope.cardModal = !$scope.cardModal;
    $scope.actualList = $scope.lists.find(function (l) {
                          return l.ID_Lista === list_id;
                        });
    $scope.actualCard = $scope.actualList.Cards.find(function (c) {
                          return c.ID_Card === card_id;
                        });
    if(mode === "insert"){
      $scope.insertCardModal = true;
      $scope.removeCardModal = false;
      $scope.editCardModal = false;
    } else if(mode === "remove"){
      $scope.removeCardModal = true;
      $scope.insertCardModal = false;
      $scope.editCardModal = false;
    } else if(mode === "edit"){
      $scope.removeCardModal = false;
      $scope.insertCardModal = false;
      $scope.editCardModal = true;
      $scope.cardCopy = angular.copy($scope.actualCard);
    } else{
      $scope.insertCardModal = false;
      $scope.removeCardModal = false;
      $scope.editCardModal = false;
    }
  }

  function slideToggle(list){
    list.slide = !list.slide;
  }

  function createList(list){
    if($scope.lists.length > 0){
      var id = $scope.lists[0].ID_Lista + 1;
    }else{
      var id = 0;
    }
    var list = {"ID_Lista": id, "Lista": list.Lista, "Ordem_Lista": list.Ordem_Lista, "Cards": [], "slide": true}
    $scope.lists.unshift(list);
    $scope.insertListModal = false;
    toggleListModal("none", null);
  }

  function removeList(list){
    var index = $scope.lists.indexOf(list);
    if(index != -1) $scope.lists.splice(index, 1);
    $scope.actualList = null;
    $scope.removeListModal = false;
    toggleListModal("none", null);
  }

  function createCard(card){
    if($scope.actualList.Cards.length > 0){
      var id = $scope.actualList.Cards[0].ID_Card + 1;
    }else{
      var id = 0;
    }
    var card = {"ID_Card": id, "Card": card.Card, "Cor_Card": card.Cor_Card, "Img_Card": card.Img_Card, "Lista":$scope.actualList.ID_Lista}
    $scope.actualList.cards.unshift(card);
    toggleCardModal("none", null, null);
  }

  function editCard(card){
    card.ID_Card = $scope.actualCard.ID_Card;
    card.Lista = $scope.actualCard.Lista;
    for(var i = 0; i < $scope.actualList.Cards.length; i++){
      if($scope.actualList.Cards[i].ID_Card === card.ID_Card) {
        $scope.actualList.Cards[i] = card;
        break;
      }
    }
    toggleCardModal("none", null, null);
  }

  function removeCard(card){
    var index = $scope.actualList.Cards.indexOf(card);
    if(index != -1) $scope.actualList.Cards.splice(index, 1);
    toggleCardModal("none", null, null);
  }

  //Public methods
  $scope.toggleListModal = toggleListModal;
  $scope.toggleCardModal = toggleCardModal;
  $scope.createList = createList;
  $scope.removeList = removeList;
  $scope.createCard = createCard;
  $scope.removeCard = removeCard;
  $scope.editCard = editCard;
  $scope.slideToggle = slideToggle;

  //API section
  $http.get("http://www.ploomes.com/fun/listas").then(function(response) {
      $scope.apiData = response.data;
  });
});
