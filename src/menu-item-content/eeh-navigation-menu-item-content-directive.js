'use strict';
angular.module('eehNavigation').directive('eehNavigationMenuItemContent', ['eehNavigation', '$rootScope', MenuItemContentDirective]);

/** @ngInject */
function MenuItemContentDirective(eehNavigation, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            menuItem: '=eehNavigationMenuItemContent'
        },
        templateUrl: 'template/eeh-navigation/menu-item-content/eeh-navigation-menu-item-content.html',
        link: function (scope) {
            scope.iconBaseClass = function () {
                return eehNavigation.iconBaseClass();
            };

            // function to detect whether a menuItem can be added to favorites or not
            scope.altCanBeFavorites = function(menuItem) {
                return !menuItem.hasChildren() && menuItem.menuItemName.search('sb.') === 0;
            }

            // function to manage add/remove to favorites
            scope.altManageFavorites = function(menuItem) {
                if(!menuItem.isFavorite) menuItem.isFavorite = true;
                else menuItem.isFavorite = !menuItem.isFavorite;

                $rootScope.$broadcast("altMenuItemFavoritesAction", menuItem);
            }

        }
    };
}
