angular.module('cap-meteor',['angular-meteor', 'ui.router', 'ngMaterial']);

// Icon configuration
var themeIcons = function ($mdIconProvider) {
  $mdIconProvider
    .iconSet("social",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
    .iconSet("action",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
    .iconSet("communication",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
    .iconSet("content",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
    .iconSet("toggle",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
    .iconSet("navigation",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
    .iconSet("image",
             "/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg")
     .iconSet("file",
              "/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg");
};

// Icon configuration
angular.module('cap-meteor').config(themeIcons);

// theme configuration
angular.module('cap-meteor').config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink');
});

// Module configuration for Cordova compatibility
function onReady() {
  angular.bootstrap(document, ['cap-meteor'], [{strictDi:true}]);
}

if (Meteor.isCordova) {
  angular.element(document).on("deviceready", onReady);
} else {
  angular.element(document).ready(onReady);
}

// Authentication Checking
angular.module("cap-meteor").run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $state.go('sign');
    }
  });

}]);

angular.module("cap-meteor").controller('AppCtrl', ['$scope', '$mdToast', '$animate',
                                        '$mdSidenav', '$meteor', '$state', '$stateParams',
  function($scope, $mdToast, $animate, $mdSidenav, $meteor, $state, $stateParams) {

    $scope.toastPosition = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };

    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    $scope.addChannel = function(newChannel){
      Meteor.call("addChannel", newChannel, function(error, result) {
        if (error) {
          console.log('Channel creation error - ', err);
          $mdToast.show($mdToast.simple()
            .content('Error while Channel creation.')
            .position($scope.getToastPosition())
            .hideDelay(3000));
        } else {
          $mdToast.show($mdToast.simple()
            .content('Channel '+newChannel.label+' created!')
            .position($scope.getToastPosition())
            .hideDelay(3000));
        }
      })
    };

    $scope.deleteChannel = function(channelId){
      Meteor.call("deleteChannel", channelId, function(error, result) {
        if (error) {
          $mdToast.show($mdToast.simple()
            .content(err.reason)
            .position($scope.getToastPosition())
            .hideDelay(3000));
          console.log('Error while Channel deletion. Error - ', err);
        } else {
          $mdToast.show($mdToast.simple()
            .content('Channel deleted!')
            .position($scope.getToastPosition())
            .hideDelay(3000));
          }
        })
    };

    $scope.toogleLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

}]);
