// AINNNNNNNNNNN ELE TA USANDO UMA BAZZOKA PRA MATAR UMA MOOOOOOOOOOOOSCA

var app = angular.module('StopProcrastinatingSettings', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    // eu gosto assim.
    $locationProvider.hashPrefix("!");
    $routeProvider.
    when('/', {
      templateUrl: 'templates/settings.html',
      controller: 'IndexCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);

app.directive('editor', function() {
  return {
    scope: {
      text: '=ngModel'
    },
    template: '<div class="summernote-editor"></div>',
    link: function(scope, elem, attrs) {
      // that's nasty
      var editing = false;
      var note = $(elem).find('.summernote-editor').summernote({
        toolbar: [
          ['style', ['style']],
          ['frufru', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['code', ['codeview']]
        ],
        onChange: function(contents, $editable) {
           // that's nasty
          editing = true;
          scope.$apply(function(){
            scope.text = contents;
          })
        }
      });
      scope.$watch('text', function() {
        if(editing) {
           // that's nasty
          editing = false
          return
        }
        note.code(scope.text.toString());
      });
    }
  }
})

app.controller('IndexCtrl', ['$scope', '$rootScope', '$route',
  function($scope, $rootScope, $route) {
    $scope.urls = [];
    $scope.wasteMessage = "";
    $scope.message = null;
    $scope.wasteMessageAlert = "";

    $scope.moreUrl = function() {
      $scope.urls.push({
        url: ''
      });
    }

    $scope.removeUrl = function(url) {
      $scope.urls.splice($scope.urls.indexOf(url), 1)
    }

    $scope.saveUrls = function() {
      var urlsToSave = angular.copy($scope.urls).filter(function(v) {
        return v.url.trim().length > 0;
      });
      chrome.storage.sync.set({
        urls: urlsToSave
      }, function() {
        // Eu sei que tem outro jeito de fazer isso,
        // pode fazer pra mim se quiser, bjos
        chrome.extension.getBackgroundPage().window.updateListener();
        $scope.$apply(function() {
          $scope.message = $rootScope.getMessage("urls_saved");
        });
      })
    }

    $scope.saveMessage = function () {
      chrome.storage.sync.set({
        wasteMessage: $scope.wasteMessage.toString()
      }, function() {
        $scope.$apply(function() {
          // vocês qualquer coisa é nosssaaaaaaaaaa
          $scope.wasteMessageAlert = $rootScope.getMessage('waste_message_saved');
        });
      });
    }

    $scope.hideMessage = function() {
      $scope.message = null;
    }

    $scope.cleanSettings = function() {
      // oldschool
      if(confirm($rootScope.getMessage("clean_settings_sure").toString())){
        // it's a callback pyramid of doom
        chrome.storage.sync.clear(function(){
          chrome.extension.getBackgroundPage().window.updateListener(function(){
            $scope.$apply(function() {
              $route.reload();  
            });
          });
        });
      }
    }

    chrome.storage.sync.get(['urls', 'wasteMessage'], function(data) {
      // ok, confesso que isso foi feio.
      $scope.$apply(function() {
        $scope.wasteMessage = data.wasteMessage || $rootScope.getMessage('default_waste_message')
        $scope.urls = data.urls || [];
      });
    });
  }
]);

app.run(['$rootScope', '$sce',
  function($rootScope, $sce) {
    // isso também
    $rootScope.getMessage = function() {
      return $sce.trustAsHtml(chrome.i18n.getMessage.apply(null, arguments));
    }
  }
]);