app.controller('MainCtrl', function($scope, $http){

  $scope.lists = [];

  function loadData(){
    //Load data from API
    $http.get("http://www.ploomes.com/fun/listas").then(function(response) {
        for(var x = 0; x < response.data.length; x++){
          list = {"ID_Lista": response.data[x].ID_Lista, "Lista": response.data[x].Lista, "Ordem_Lista": response.data[x].Ordem_Lista, "Cards": [], "slide": true};
          $scope.lists.push(list);
          for(var c = 0; c < response.data[x].Cards.length; c++){
            card = {"ID_Card": response.data[x].Cards[c].ID_Card, "Card": response.data[x].Cards[c].Card, "Cor_Card": response.data[x].Cards[c].Cor_Card, "Ordem_Card": response.data[x].Cards[c].Ordem_Card, "Lista": response.data[x].ID_Lista};
            $scope.lists[x].Cards.push(card);
          }
          $scope.lists[x].Cards.sort(function(a, b) {
                                    return b.Ordem_Card < a.Ordem_Card ?  1 // if b should come earlier, push a to end
                                         : b.Ordem_Card > a.Ordem_Card ? -1 // if b should come later, push a to begin
                                         : 0;                   // a and b are equal
                                });
        }
    });

  }

  function postList(list){
    $http.post('http://www.ploomes.com/fun/listas', { "Lista": list.Lista, "Ordem_Lista": list.Ordem_Lista });
  }

  function deleteList(list){
    $http.delete('http://www.ploomes.com/fun/listas/'+list.ID_Lista);
  }

  function postCard(card){
    $http.post('http://www.ploomes.com/fun/cards', {"Card": card.Card, "Cor_Card": card.Cor_Card, "Ordem_Card": card.Ordem_Card, "Lista": {"ID_Lista": card.Lista}});
  }

  function updateCard(card){
    $http.put('http://www.ploomes.com/fun/cards/'+card.ID_Card, {"Card": card.Card, "Cor_Card": card.Cor_Card, "Ordem_Card": card.Ordem_Card, "Lista": {"ID_Lista": card.Lista}});
  }

  function deleteCard(card){
    $http.delete('http://www.ploomes.com/fun/cards/'+card.ID_Card);
  }

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
    if(list_id == null && card_id == null) return;
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
      var ordem = $scope.lists[0].Ordem_Lista + 1;
    }else{
      var ordem = 0;
    }
    var list = {"Lista": list.Lista, "Ordem_Lista": ordem, "Cards": [], "slide": true}
    $scope.lists.push(list);
    postList(list);
    $scope.insertListModal = false;
    toggleListModal("none", null);
  }

  function removeList(list){
    var index = $scope.lists.indexOf(list);
    if(index != -1) $scope.lists.splice(index, 1);
    deleteList(list);
    $scope.actualList = null;
    $scope.removeListModal = false;
    toggleListModal("none", null);
  }

  function createCard(card){
    if($scope.actualList.Cards.length > 0){
      var ordem = $scope.actualList.Cards[$scope.actualList.Cards.length-1].Ordem_Card + 1;
    }else{
      var ordem = 0;
    }
    var card = {"Card": card.Card, "Cor_Card": card.Cor_Card, "Ordem_Card": ordem, "Lista":$scope.actualList.ID_Lista}
    $scope.actualList.Cards.push(card);
    postCard(card);
    toggleCardModal("none", null, null);
    updateCardOrder($scope.actualList.Cards);
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
    updateCard(card);
    toggleCardModal("none", null, null);
  }

  function removeCard(card){
    var index = $scope.actualList.Cards.indexOf(card);
    if(index != -1) $scope.actualList.Cards.splice(index, 1);
    deleteCard(card);
    toggleCardModal("none", null, null);
    updateCardOrder($scope.actualList.Cards);
  }

  function cardMoving(card, list){
    index = list.Cards.indexOf(card);
    list.Cards.splice(index, 1);
    for(var i = 0; i < $scope.lists.length; i++){
      for(var j = 0; j < $scope.lists[i].Cards.length; j++){
        if($scope.lists[i].Cards[j].ID_Card === card.ID_Card) {
          $scope.lists[i].Cards[j].Lista = $scope.lists[i].ID_Lista;
          updateCardOrder($scope.lists[i]);
          updateCard($scope.lists[i].Cards[j]);
          break;
        }
      }
    }
  }

  function updateCardOrder(list){
    for(var i = 0; i < list.Cards.length; i++){
      if(list.Cards[i].Ordem_Card !== i){
        list.Cards[i].Ordem_Card = i;
        updateCard(list.Cards[i]);
      }
    }
  }

  //Public methods
  $scope.loadData = loadData;
  $scope.toggleListModal = toggleListModal;
  $scope.toggleCardModal = toggleCardModal;
  $scope.createList = createList;
  $scope.removeList = removeList;
  $scope.createCard = createCard;
  $scope.removeCard = removeCard;
  $scope.editCard = editCard;
  $scope.slideToggle = slideToggle;
  $scope.cardMoving = cardMoving;


});
