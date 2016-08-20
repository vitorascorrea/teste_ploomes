app.controller('MainCtrl', function($scope){
  $scope.lists = [
    {"id": 2, "title": "Lista 1", "cards": [
      {"id": 2, "title": "Card 1", "color": "#fff", "img": "imgs/img.svg", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0},
      {"id": 1, "title": "Card 2", "color": "#fff", "img": "", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0},
      {"id": 0, "title": "Card 3", "color": "#fff", "img": "", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor", "id_list": 0}
    ] ,"slide": true},
    {"id": 1, "title": "Lista 2", "cards": [], "slide": true},
    {"id": 0, "title": "Lista 3", "cards": [], "slide": true}
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
                          return l.id === list_id;
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
                          return l.id === list_id;
                        });
    $scope.actualCard = $scope.actualList.cards.find(function (c) {
                          return c.id === card_id;
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
      var id = $scope.lists[0].id + 1;
    }else{
      var id = 0;
    }
    var list = {"id": id, "title": list.title, "cards": [], "slide": true}
    $scope.lists.unshift(list);
    $scope.insertListModal = false;
    toggleListModal("none", null);
  }

  function removeList(list){
    var index = $scope.lists.indexOf(list);
    var cardList = list.cards;
    if(index != -1) $scope.lists.splice(index, 1);
    $scope.actualList = null;
    $scope.removeListModal = false;
    toggleListModal("none", null);
  }

  function createCard(card){
    if($scope.actualList.cards.length > 0){
      var id = $scope.actualList.cards[0].id + 1;
    }else{
      var id = 0;
    }
    var card = {"id": id, "title": card.title, "color": card.color, "img": card.img, "desc": card.desc, "id_list":$scope.actualList.id}
    $scope.actualList.cards.unshift(card);
    toggleCardModal("none", null, null);
  }

  function editCard(card){
    card.id = $scope.actualCard.id;
    card.id_list = $scope.actualCard.id_list;
    for(var i = 0; i < $scope.actualList.cards.length; i++){
      if($scope.actualList.cards[i].id === card.id) {
        $scope.actualList.cards[i] = card;
        break;
      }
    }
    toggleCardModal("none", null, null);
  }

  function removeCard(card){
    var index = $scope.actualList.cards.indexOf(card);
    if(index != -1) $scope.actualList.cards.splice(index, 1);
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
});
