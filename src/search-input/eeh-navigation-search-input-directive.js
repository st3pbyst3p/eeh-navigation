'use strict';
angular.module('eehNavigation').directive('eehNavigationSearchInput', ['eehNavigation', '$timeout', SearchInputDirective]);

/** @ngInject */
function SearchInputDirective(eehNavigation, $timeout) {
    return {
        restrict: 'AE',
        transclude: true,
        templateUrl: 'template/eeh-navigation/search-input/eeh-navigation-search-input.html',
        scope: {
            iconClass: '=',
            submit: '=',
            classes: '=',
            isCollapsed: '='
        },
        link: function (scope) {
            scope.model = {
                query: ''
            };
            scope.iconBaseClass = function () {
                return eehNavigation.iconBaseClass();
            };
            // altChanges ----------------------------------------------------------------------
            var dly = null;
            // catching search bar query changes
            scope.$watch(function () {return scope.model.query;}, function (newValue, oldValue) {
                if(newValue !== oldValue) {
                    $timeout.cancel(dly);
                    dly = $timeout(function () {
                        scope.$emit('altEehSearchContainerChanged', { query: newValue });
                    }, 200);
                }
            });
            // endlink
        }
    };
}
