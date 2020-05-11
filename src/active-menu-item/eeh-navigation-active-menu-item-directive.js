'use strict';
angular.module('eehNavigation')
    .directive('eehNavigationActiveMenuItem', ActiveMenuItemDirective)
    .directive('eehNavigationAltParent', AltParentDirective);

function isMenuItemActive(menuItem, $state) {
    if (!menuItem.hasChildren()) {
        // Return whether or not the leaf is active.
        // return angular.isDefined(menuItem.state) && $state.includes(menuItem.state);
        return false;
    }
    var children = menuItem.children();
    for (var i = 0; i < children.length; i++) {
        if (angular.isDefined(children[i].state) && $state.includes(children[i].state)) {
            // Return true if the child menu item is active.
            return true;
        }
        if (isMenuItemActive(children[i], $state)) {
            // Return true if the child has at least one active child of its own.
            return true;
        }
    }
    // Return false if the menu item has no active children.
    return false;
}

function hasActiveChildren(menuItem) {
    if (!menuItem.hasChildren()) {
        return false;
    }
    var children = menuItem.children();
    for (var i = 0; i < children.length; i++) {
        if (children[i].activeNod) {
            return true;
        }
        if (hasActiveChildren(children[i])) {
            return true;
        }
    }
    return false;
}

/** @ngInject */
function ActiveMenuItemDirective($state) {
    return {
        restrict: 'A',
        scope: {
            menuItem: '=eehNavigationActiveMenuItem'
        },
        link: function (scope, element) {
            var checkIsActive = function () {
                var isActive = isMenuItemActive(scope.menuItem, $state);
                element.toggleClass('active', isActive);
            };
            scope.$on('$stateChangeSuccess', checkIsActive);
            checkIsActive();
        }
    };
}

function AltParentDirective() {
    return {
        restrict: "A",
        scope: {
            menuItem: "=eehNavigationAltParent"
        },
        link: function(scope) {
            function checkActiveChild($event, isCollapsed) {
                scope.menuItem.className = "";
                var setClass = "sidebar-active-parent";
                if (isCollapsed) setClass = "sidebar-active-collapsed";
                
                if (hasActiveChildren(scope.menuItem)) {
                    scope.menuItem.className = setClass;
                } else scope.menuItem.className = "";
            }
            scope.$on("menuStateChanged", function($event, isCollapsed){
                checkActiveChild($event, isCollapsed)
            });
            scope.$on("menuSidebarChanged", function($event, isCollapsed){
                checkActiveChild($event, isCollapsed)
            });
        }
    };
}