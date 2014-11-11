'use strict';

angular
.module('core')
.controller('LetterCtrl', function($scope,ENV,$firebase,$famous,Composite, Memorial, User, Comment, Story, Util, Letter){
  $scope.hostUrl = ENV.HOST;

  var EventHandler = $famous['famous/core/EventHandler'];
  $scope.eventHandler = new EventHandler();
  
  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();

  $scope.storyKeysArray = Letter.getStoryKeysArray();
  $scope.storiesArray = Letter.getStoriesArray();
  $scope.storiesObject = Letter.getStoriesObject();
  $scope.commentsObject = Letter.getCommentsObject();
  $scope.users = User.getUsersObject();

  $scope.memorial.$loaded().then(function(value){
    if($scope.user && $scope.user.uid === $scope.memorial.ref_user ) {
      Memorial.setMyRole('owner');
    } else {
      // no member 
      if($scope.memorial.members === undefined) {
        Memorial.setMyRole('guest');
      } else {
        // member
        if($scope.user && $scope.memorial.members[$scope.user.uid]) {
          Memorial.setMyRole('member');
        } else {
          Memorial.setMyRole('guest');
        }
      }
    }

    $scope.isOwner = Memorial.isOwner();
    $scope.isMember = Memorial.isMember();
    $scope.isGuest = Memorial.isGuest();
  });

  $scope.scrollContentHeight = {};

  $scope.$on('$viewContentLoaded', function(){
    $famous.find('fa-scroll-view')[0].renderNode.sync.on('start', function(event) {
      var scrollContent = angular.element('[id^=scroll-content]');

      angular.forEach(scrollContent, function(value, key) {
        $scope.scrollContentHeight[value.id] = value.clientHeight;
      });

    });
  });

  $scope.getScrollContentHeight = function(id) {
    return $scope.scrollContentHeight[id];
  }

  $scope.commentSize = function(storyId){
    return Util.objectSize($scope.commentsObject[storyId]);
  }
  
});