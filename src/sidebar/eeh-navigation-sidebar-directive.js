'use strict';
// +injected: $filter
angular.module('eehNavigation').directive('eehNavigationSidebar', ['$window', 'eehNavigation', '$filter', '$rootScope', '$timeout', SidebarDirective]);

/**
 * @ngInject
 * @ngdoc directive
 * @name eeh-navigation-sidebar
 * @restrict AE
 *
 * @description
 * This directive adds a sidebar, based on the Twitter Bootstrap navbar component, to the template.
 * If Angular UI Router is used (which is recommended), then the sidebar directive should wrap a __ui-view__ element.
 * It should also be in a template that is at or near the top of the state hierarchy.
 *
 * @param {string=} menuName Sets the name of the menu that the directive will render.
 * @param {string=} [navClass=navbar-default] Sets the ng-class attribute of the top-level nav element.
 * @param {number=} [topOffset=51]
 * This attribute offsets the top position of the sidebar.
 * It should equal the height of the navbar, or 0 if there is no navbar.
 * This attribute should be used if the navbar's height is something different or if the navbar is not used.
 * @param {string=} [menuItemCollapsedIconClass="glyphicon-chevron-left"]
 * This attribute sets the icon used to indicate that a parent of a nested menu item is collapsed.
 * @param {string=} [menuItemExpandedIconClass="glyphicon-chevron-down"]
 * This attribute sets the icon used to indicate that a parent of a nested menu item is expanded.
 * @param {string=} [sidebarCollapsedIconClass="glyphicon-arrow-right"]
 * This attribute sets the icon used to indicate that the sidebar is collapsed.
 * @param {string=} [sidebarExpandedIconClass="glyphicon-arrow-left"]
 * This attribute sets the icon used to indicate that the search input is use for searching.
 * @param {string=} [searchInputIconClass="glyphicon-search"]
 * This attribute sets the icon used to indicate that the sidebar is collapsed.
 * @param {boolean=} [searchInputIsVisible=true]
 * This attribute causes the search input to be shown or hidden.
 * @param {boolean=} [sidebarCollapsedButtonIsVisible=true]
 * This attribute causes the text collapse toggle button to be shown or hidden.
 * @param {boolean=} [sidebarIsCollapsed=false]
 * This attribute sets the state of the text collapse button.
 * @param {function=} refresh
 * This attribute provides a function for refreshing the directive.
 */

// +injected: $filter
function SidebarDirective($window, eehNavigation, $filter, $rootScope, $timeout) {
    return {
        restrict: 'AE',
        transclude: true,
        templateUrl: 'template/eeh-navigation/sidebar/eeh-navigation-sidebar.html',
        scope: {
            menuName: '=',
            navClass: '=?',
            topOffset: '=?',
            menuItemCollapsedIconClass: '=?',
            menuItemExpandedIconClass: '=?',
            sidebarCollapsedIconClass: '=?',
            sidebarExpandedIconClass: '=?',
            searchInputIconClass: '=?',
            searchInputIsVisible: '=?',
            searchInputSubmit: '=',
            sidebarCollapsedButtonIsVisible: '=?',
            sidebarIsCollapsed: '=?',
            refresh: '=?'
        },
        link: function (scope) {

            // SERP fixes ---------------------------------------------------------------------------
            // changes the title of page, based on current pressed item
            scope.compact = true; // param if the sidebar collapses after press or not
            scope.notCollapsed = []; // the opened elements
            scope.changeTitle = function(elem){
                // document.title = $filter("translate")(elem.text) + " : " + $rootScope.CompanyName; // gets company name from settings
                // collapses menu on click, if it-s a mobile device + if no children
                if(window.innerWidth <= 800 && !elem.hasChildren()) {
                    $rootScope.$broadcast("menuCollapseStatus", true);
                }
                // removes active class of elements
                // var v = document.getElementsByClassName("sidebar-active-collapsed");
                // var v2 = document.getElementsByClassName("sidebar-active-parent");                   
                // if (v.length > 0) v[0].className = "";
                // if (v2.length > 0 && v2[0].tagName === "A") v2[0].className = "";

                angular.forEach(menuItems(), function(menuItem) {
                    menuItem.activeNod = false;
                });
                elem.activeNod = true;
                $rootScope.$broadcast("menuStateChanged", scope.sidebarIsCollapsed);
                    
                // if collapsed, collapses side-panel after press + sets class to active element
                if(scope.sidebarIsCollapsed) {
                    if(scope.compact) scope.notCollapsed = []; //works only if "compact" is true
                    // $timeout(function() { // needs timeout to set current active element class
                    //     var t = document.getElementsByClassName('leaf active');
                    //     if(t.length>0) t[0].parentElement.parentElement.className = "sidebar-active-collapsed";
                    // }, 100);
                    // to memorize the non-collapsed elements, and to collapse after press
                    angular.forEach(menuItems(), function(menuItem) {
                        if(!menuItem.isCollapsed) scope.notCollapsed.push(menuItem);
                        menuItem.isCollapsed = true;
                    });    
                }
                // else {
                //     $timeout(function() {
                //         var t = document.getElementsByClassName("leaf active"); // setting black font for parent element
                //         if (t.length > 0 && t[0].parentElement.parentElement.children[0].tagName === "A") 
                //                 t[0].parentElement.parentElement.children[0].className = "sidebar-active-parent";
                //     }, 100);
                // }
            };

            // for leaving only 1 menu point opened, while rest are closed
            scope.collapseSidebar = function(elem) {
                // var v2 = document.getElementsByClassName("sidebar-active-parent");
                // if (v2.length > 0 && v2[0].tagName === "A") v2[0].className = "";
                var isCol = elem.isCollapsed, parent = null;

                // added catching parent - for 3-level menu
                if (scope.compact) angular.forEach(menuItems(), function(menuItem) {
                    if(menuItem.hasChildren()) {
                        Object.keys(menuItem).map(function(key){
                            if (angular.isObject(menuItem[key]) && menuItem[key] instanceof MenuItem && menuItem[key].menuItemName === elem.menuItemName) {
                                parent = menuItem;
                            }
                        });
                    }
                    menuItem.isCollapsed = true;
                });
                if(parent) parent.isCollapsed = false;
                elem.isCollapsed = !isCol;
            };

            // function to expand all elements from menu - linked to btn on sidebar
            scope.minimized = true;
            scope.minimizeFn = function() {
                scope.minimized = !scope.minimized;
                angular.forEach(menuItems(), function(menuItem) {
                    if(!scope.minimized) if(menuItem.isCollapsed === false) scope.notCollapsed.push(menuItem);
                    menuItem.isCollapsed = scope.minimized;
                });
                if(scope.minimized) { // expands back the originally opened elements
                    scope.notCollapsed.map(function(item) {
                        item.isCollapsed = false;
                    });
                    scope.notCollapsed = [];
                }
            };
            scope.returnClass = function() { // returns different icons whether the menu is expanded or not
                if(scope.minimized) { return "glyphicon glyphicon-option-horizontal"; }
                    else { return "glyphicon glyphicon-option-vertical"; }
            };

            // -----------------------------------------------------------------------------------------

            scope.iconBaseClass = function () {
                return eehNavigation.iconBaseClass();
            };
            scope.defaultIconClassPrefix = function () {
                return eehNavigation.defaultIconClassPrefix();
            };
            scope.topOffset = scope.topOffset || 51; // 51 is the default height of the navbar component
            scope.navClass = scope.navClass || 'navbar-default';
            scope.menuItemCollapsedIconClass = scope.menuItemCollapsedIconClass || scope.defaultIconClassPrefix() + '-chevron-left';
            scope.menuItemExpandedIconClass = scope.menuItemExpandedIconClass || scope.defaultIconClassPrefix() + '-chevron-down';
            scope.sidebarCollapsedIconClass = scope.sidebarCollapsedIconClass || scope.defaultIconClassPrefix() + '-arrow-right';
            scope.sidebarExpandedIconClass = scope.sidebarExpandedIconClass || scope.defaultIconClassPrefix() + '-arrow-left';
            scope.searchInputIconClass = scope.searchInputIconClass || scope.defaultIconClassPrefix() + '-search';
            if (scope.sidebarCollapsedButtonIsVisible !== false) {
                scope.sidebarCollapsedButtonIsVisible = true;
            }
            scope.sidebarIsCollapsed = scope.sidebarIsCollapsed || false;
            if (scope.searchInputIsVisible !== false) {
                scope.searchInputIsVisible = true;
            }

            var menuItems = function () {
                return eehNavigation.menuItems();
            };

            scope.refresh = function () {
                if (angular.isUndefined(scope.menuName)) {
                    return;
                }
                scope.sidebarMenuItems = eehNavigation.menuItemTree(scope.menuName);
            };
            scope.$watch(menuItems, scope.refresh, true);
            var windowElement = angular.element($window);
            windowElement.bind('resize', function () {
                scope.$apply();
            });

            //checker that handles the changes
            scope.checkButtonState = true; //initializarea
            scope.$on('menuCollapseStatus', listenCollapse);

            function listenCollapse($event, message){
                scope.checkButtonState = message;
            };

            var getWindowDimensions = function () {
                return {
                    innerHeight: windowElement[0].innerHeight,
                    innerWidth: windowElement[0].innerWidth
                };
            };

            var transcludedWrapper = angular.element(document.querySelectorAll('#eeh-navigation-page-wrapper'));
            scope.$watch(getWindowDimensions, function (newValue) {
                if (angular.isUndefined(newValue)) {
                    return;
                }
                var height = (newValue.innerHeight > 0) ? newValue.innerHeight : $window.screen.height;
                height = height - scope.topOffset;
                if (height < 1) {
                    height = 1;
                }
                if (height > scope.topOffset) {
                    transcludedWrapper.css('min-height', (height) + 'px');
                }  
            }, true);

            scope.toggleSidebarTextCollapse = function(status) {
                if(status) scope.sidebarIsCollapsed = status;
                else scope.sidebarIsCollapsed = !scope.sidebarIsCollapsed;
                $rootScope.$broadcast("menuSidebarChanged", scope.sidebarIsCollapsed);
                // when collapsing the sidebar..
                if(scope.sidebarIsCollapsed) {
                    // sets the active element
                    // var t = document.getElementsByClassName('leaf active');
                    // if(t.length>0) t[0].parentElement.parentElement.className = "sidebar-active-collapsed";
                    // saves the opened one(s)
                    angular.forEach(menuItems(), function(menuItem) {
                        if(!menuItem.isCollapsed){
                            scope.notCollapsed.push(menuItem);
                        }
                    });
                }
                // when opening the sidebar
                else {
                    // removes active elements
                    // var t = document.getElementsByClassName('sidebar-active-collapsed');
                    // if(t.length>0) t[0].className = "";
                    // angular.forEach(menuItems(), function(menuItem) {
                    //     menuItem.className = '';
                    // });
                    // uncollapses the opened elements
                    scope.notCollapsed.map(function(item){
                        item.isCollapsed = false;
                    });
                    scope.notCollapsed = [];
                }
                setTextCollapseState();
            };
            scope.$on("setSidebarCollapsed", function(event, status){
                scope.toggleSidebarTextCollapse(status);
            });

            function setTextCollapseState() {
                var sidebarMenuItems = angular.element(document.querySelectorAll('ul.sidebar-nav:not(.sidebar-nav-nested) > li > a > span'));
                var sidebarMenuItemText = sidebarMenuItems.find('span');
                var allMenuItemTextElements = Array.prototype.filter.call(sidebarMenuItemText, function (item) {
                    return item.matches('.menu-item-text');
                });
                var arrowIconElements = Array.prototype.filter.call(sidebarMenuItems, function (item) {
                    return item.matches('.sidebar-arrow');
                });
                var sidebarElement = angular.element(document.querySelectorAll('.eeh-navigation-sidebar'));
                if (scope.sidebarIsCollapsed) {
                    transcludedWrapper.addClass('sidebar-text-collapsed');
                    sidebarElement.addClass('sidebar-text-collapsed');
                    allMenuItemTextElements.forEach(function (menuItem) {
                        angular.element(menuItem).addClass('hidden');
                    });
                    arrowIconElements.forEach(function (menuItem) {
                        angular.element(menuItem).addClass('hidden');
                    });
                    angular.forEach(menuItems(), function (menuItem) {
                        menuItem.isCollapsed = true;
                    });
                } else {
                    transcludedWrapper.removeClass('sidebar-text-collapsed');
                    sidebarElement.removeClass('sidebar-text-collapsed');
                    allMenuItemTextElements.forEach(function (menuItem) {
                        angular.element(menuItem).removeClass('hidden');
                    });
                    arrowIconElements.forEach(function (menuItem) {
                        angular.element(menuItem).removeClass('hidden');
                    });
                }
            }


            /**
             * $includeContentLoaded is emitted when ng-include templates are finished loading.
             * The text collapse state needs to be evaluated after the sidebar menu templates (which are loaded via
             * ng-include) are loaded. If not, the sidebar menu item will not be hidden if the initial state of the
             * sidebar text is collapsed as the menu items will not exist when the state is initially evaluated.
             */
            scope.$on('$includeContentLoaded', function () {
                setTextCollapseState();
            });

            scope.isSidebarVisible = function () {
                return scope.searchInputIsVisible || (angular.isArray(scope.sidebarMenuItems) && scope.sidebarMenuItems
                    .filter(function (item) {
                        return item._isVisible();
                    })
                        .length > 0);
            };


            scope.topLevelMenuItemClickHandler = function (clickedMenuItem) {
                if (!scope.sidebarIsCollapsed || !clickedMenuItem.hasChildren()) {
                    return;
                }
                scope.sidebarMenuItems
                .filter(function (menuItem) {
                    return menuItem.hasChildren() && clickedMenuItem !== menuItem;
                })
                .forEach(function (menuItem) {
                    menuItem.isCollapsed = true;
                });
            };
        }
    };
}
