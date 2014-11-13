'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('core')
.controller('MemberCtrl', function($scope,ENV,$firebase,$state,$famous,Composite,Memorial, User, MyStory, Member){
  $scope.hostUrl = ENV.HOST;

  var EventHandler = $famous['famous/core/EventHandler'];
  $scope.eventHandler = new EventHandler();

  // inviteUrl 처리
  $scope.$watch( function(){ return Memorial.getInviteUrl();}, function(newValue){
    $scope.inviteUrl = newValue;
  });

  $scope.$watch( function(){ return Memorial.getLeader();}, function(newValue){
    $scope.leader = newValue;
  });

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.currentUser = User.getCurrentUser();
  $scope.users = User.getUsersObject();

  $scope.members = Member.getMembers();
  $scope.waitings = Member.getWaitings();
  $scope.watingsCnt = Member.getWaitingsCnt();

  // remove member from member list
  $scope.removeMember = function(uid, role) {
    var index = _members.$indexFor(uid);
    _members.$remove(index);

    var userMembersRef =  new Firebase(ENV.FIREBASE_URI + '/users/' + uid + '/memorials/members');
    $firebase(userMembersRef).$remove(ENV.MEMORIAL_KEY).then(function(value){
      if(role == 'member') $state.go('memorials');          
    }, function(error) {
      console.log(error);

    });
  };

  // from waiting list to member list
  $scope.moveMember = function(uid) {
    var params = { memorialId: ENV.MEMORIAL_KEY, inviteeId: uid} ;
      Composite.addMember(params).then(function(){
      var removeParams = {
          memorialId: ENV.MEMORIAL_KEY,
          requesterId: uid
      };
      Composite.removeWaiting(removeParams).then(function(value){
      })
    }, function(error){
      console.log(error);
    })
  };

  // for scroll view test
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

});