// AINNNNNNNNNNN ELE TA USANDO UMA BAZZOKA PRA MATAR UMA MOOOOOOOOOOOOSCA
// olha aqui, queridinha, ᶠᵒᵈᵃ⁻ˢᵉ, olha eu me importando com você:

var app = angular.module('StopProcrastinating', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider){
  // eu gosto assim.
  $locationProvider.hashPrefix("!");
  $routeProvider.
    when('/', {
      templateUrl: 'templates/index.html',
      controller: 'IndexCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

app.controller('IndexCtrl', ['$scope', function($scope){
  $scope.urls = [];
  $scope.message = null;
  
  $scope.moreUrl = function() {
    $scope.urls.push({ url: '' });
  }
  
  $scope.removeUrl = function(url) {
    $scope.urls.splice($scope.urls.indexOf(url), 1)
  }

  $scope.saveUrls = function() {
    var urlsToSave = angular.copy($scope.urls).filter(function(v){ return v.url.trim().length > 0; });
    chrome.storage.sync.set({ urls: urlsToSave }, function(){
      // Eu sei que tem outro jeito de fazer isso,
      // pode fazer pra mim se quiser, bjos
      chrome.extension.getBackgroundPage().window.updateListener();
      $scope.$apply(function(){
        $scope.message = $rootScope.getMessage("urls_saved");
      });  
    })
  }

  $scope.hideMessage = function() {
    $scope.message = null;
  }

  chrome.storage.sync.get('urls', function(data){
    // ok, confesso que isso foi feio.
    $scope.$apply(function(){
      $scope.urls = data.urls || [];
    });
  });
}]);

app.run(['$rootScope', '$sce', function($rootScope, $sce){
  // isso também
  $rootScope.getMessage = function(){
    return $sce.trustAsHtml(chrome.i18n.getMessage.apply(null, arguments));
  }
}]);