(function(exports, global) {
    "use strict";
    ActiveMenuItemDirective.$inject = [ "$state" ];
    MenuItemContentDirective.$inject = [ "eehNavigation" ];
    MenuDirective.$inject = [ "eehNavigation" ];
    SearchInputDirective.$inject = [ "eehNavigation" ];
    SidebarDirective.$inject = [ "$window", "eehNavigation", "$filter", "$rootScope", "$timeout" ];
    angular.module("eehNavigation", [ "pascalprecht.translate" ]);
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationActiveMenuItem", ActiveMenuItemDirective).directive("eehNavigationAltParent", AltParentDirective);
    function isMenuItemActive(menuItem, $state) {
        if (!menuItem.hasChildren()) {
            return false;
        }
        var children = menuItem.children();
        for (var i = 0; i < children.length; i++) {
            if (angular.isDefined(children[i].state) && $state.includes(children[i].state)) {
                return true;
            }
            if (isMenuItemActive(children[i], $state)) {
                return true;
            }
        }
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
    function ActiveMenuItemDirective($state) {
        return {
            restrict: "A",
            scope: {
                menuItem: "=eehNavigationActiveMenuItem"
            },
            link: function(scope, element) {
                var checkIsActive = function() {
                    var isActive = isMenuItemActive(scope.menuItem, $state);
                    element.toggleClass("active", isActive);
                };
                scope.$on("$stateChangeSuccess", checkIsActive);
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
                scope.$on("menuStateChanged", function($event, isCollapsed) {
                    checkActiveChild($event, isCollapsed);
                });
                scope.$on("menuSidebarChanged", function($event, isCollapsed) {
                    checkActiveChild($event, isCollapsed);
                });
            }
        };
    }
    "use strict";
    var MenuItem = function(config) {
        this.weight = 0;
        this.isIconVisible = true;
        this.isDivider = false;
        this.isReadOnly = false;
        this.ngBindHtml = "";
        angular.extend(this, config);
    };
    MenuItem.prototype.children = function() {
        var children = [];
        angular.forEach(this, function(property) {
            if (angular.isObject(property) && property instanceof MenuItem) {
                children.push(property);
            }
        });
        return children;
    };
    MenuItem.prototype.hasChildren = function() {
        return this.children().length > 0;
    };
    MenuItem.prototype._isVisible = function() {
        var hasVisibleChildren = this.children().filter(function(child) {
            return child._isVisible() !== false;
        }).length > 0;
        if (!hasVisibleChildren && !this.isDivider && angular.isUndefined(this.state) && angular.isUndefined(this.href) && angular.isUndefined(this.click) && angular.isUndefined(this.ngInclude) && angular.isUndefined(this.altDirective) && !this.isReadOnly) {
            return false;
        }
        if (angular.isFunction(this.isVisible)) {
            return this.isVisible();
        }
        if (angular.isDefined(this.isVisible)) {
            return this.isVisible;
        }
        return true;
    };
    MenuItem.prototype.isVisible = function() {
        return true;
    };
    MenuItem.prototype.isHeavy = function() {
        if (this.hasOwnProperty("weight")) {
            return this.weight >= 0;
        }
    };
    MenuItem.prototype._ngBindHtml = function() {
        return angular.isFunction(this.ngBindHtml) ? this.ngBindHtml() : this.ngBindHtml;
    };
    "use strict";
    angular.module("eehNavigation").provider("eehNavigation", NavigationService);
    function NavigationService() {
        this._iconBaseClass = "glyphicon";
        this._defaultIconClassPrefix = "glyphicon";
        this._menuItems = {};
        this._toArray = function(items) {
            var arr = [];
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    arr.push(items[key]);
                }
            }
            return arr;
        };
    }
    NavigationService.prototype.$get = function() {
        return this;
    };
    NavigationService.prototype.iconBaseClass = function(value) {
        if (angular.isUndefined(value)) {
            return this._iconBaseClass;
        }
        this._iconBaseClass = value;
        return this;
    };
    NavigationService.prototype.defaultIconClassPrefix = function(value) {
        if (angular.isUndefined(value)) {
            return this._defaultIconClassPrefix;
        }
        this._defaultIconClassPrefix = value;
        return this;
    };
    NavigationService.prototype.buildAncestorChain = function(name, items, config) {
        var keys = name.split(".");
        if (name.length === 0 || keys.length === 0) {
            return;
        }
        var key = keys.shift();
        if (angular.isUndefined(items[key])) {
            items[key] = keys.length === 0 ? config : {};
            if (keys.length === 0) {
                items[key] = config;
            }
        }
        this.buildAncestorChain(keys.join("."), items[key], config);
    };
    NavigationService.prototype.menuItemTree = function(menuName) {
        var items = {};
        var self = this;
        var menuItemsToTransform = {};
        if (angular.isDefined(menuName)) {
            var menuNameRegex = new RegExp("^" + menuName + ".");
            angular.forEach(this._menuItems, function(menuItem, menuItemName) {
                if (menuItemName.match(menuNameRegex) !== null) {
                    menuItemsToTransform[menuItemName.replace(menuNameRegex, "")] = menuItem;
                }
            });
        } else {
            menuItemsToTransform = this._menuItems;
        }
        angular.forEach(menuItemsToTransform, function(config, name) {
            self.buildAncestorChain(name, items, config);
        });
        return this._toArray(items);
    };
    NavigationService.prototype.menuItem = function(name, config) {
        if (angular.isUndefined(config)) {
            if (angular.isUndefined(this._menuItems[name])) {
                throw name + " is not a menu item";
            }
            return this._menuItems[name];
        }
        config.menuItemName = name;
        this._menuItems[name] = new MenuItem(config);
        return this;
    };
    NavigationService.prototype.menuItems = function() {
        return angular.isDefined(this) ? this._menuItems : {};
    };
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationMenuItemContent", MenuItemContentDirective);
    function MenuItemContentDirective(eehNavigation) {
        return {
            restrict: "A",
            scope: {
                menuItem: "=eehNavigationMenuItemContent"
            },
            templateUrl: "template/eeh-navigation/menu-item-content/eeh-navigation-menu-item-content.html",
            link: function(scope) {
                scope.iconBaseClass = function() {
                    return eehNavigation.iconBaseClass();
                };
            }
        };
    }
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationMenu", MenuDirective);
    function MenuDirective(eehNavigation) {
        return {
            restrict: "AE",
            templateUrl: "template/eeh-navigation/menu/eeh-navigation-menu.html",
            scope: {
                menuName: "=",
                navClass: "=?",
                menuItemCollapsedIconClass: "=?",
                menuItemExpandedIconClass: "=?",
                refresh: "=?"
            },
            link: function(scope) {
                scope.iconBaseClass = function() {
                    return eehNavigation.iconBaseClass();
                };
                scope.defaultIconClassPrefix = function() {
                    return eehNavigation.defaultIconClassPrefix();
                };
                scope.navClass = scope.navClass || "navigation-menu";
                scope.menuItemCollapsedIconClass = scope.menuItemCollapsedIconClass || scope.defaultIconClassPrefix() + "-chevron-left";
                scope.menuItemExpandedIconClass = scope.menuItemExpandedIconClass || scope.defaultIconClassPrefix() + "-chevron-down";
                scope.refresh = function() {
                    if (angular.isUndefined(scope.menuName)) {
                        return;
                    }
                    scope.menuItems = eehNavigation.menuItemTree(scope.menuName);
                };
                scope.$watch(eehNavigation.menuItems, scope.refresh, true);
            }
        };
    }
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationNavbarBrand", NavbarBrandDirective);
    function NavbarBrandDirective() {
        return {
            restrict: "AE",
            templateUrl: "template/eeh-navigation/navbar/eeh-navigation-navbar-brand.html",
            scope: {
                text: "=",
                state: "=",
                href: "=",
                target: "=",
                src: "=",
                click: "="
            }
        };
    }
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationAltDynamicDirective", [ "$compile", function($compile) {
        return {
            restrict: "AE",
            template: "",
            scope: true,
            link: function(scope, element, attr, ctrl) {
                var attrs = JSON.parse(attr.eehNavigationAltDynamicDirective);
                var templ = "<div " + attrs.altDirective + '  iconClass=" ' + attrs.iconClass + '"  text=" ' + attrs.text + ' " ></div>';
                var template = angular.element(templ);
                element.append(template);
                $compile(template)(scope);
            }
        };
    } ]);
    var NavbarDirective = function($window, $rootScope, eehNavigation) {
        return {
            restrict: "AE",
            templateUrl: "template/eeh-navigation/navbar/eeh-navigation-navbar.html",
            scope: {
                menuName: "=",
                navClass: "=?",
                containerClass: "=?",
                brandText: "=",
                brandState: "=",
                brandHref: "=",
                brandTarget: "=",
                brandSrc: "=",
                brandClick: "=",
                refresh: "=?"
            },
            link: function(scope) {
                scope.iconBaseClass = function() {
                    return eehNavigation.iconBaseClass();
                };
                scope.navClass = scope.navClass || "navbar-default navbar-static-top";
                scope.isNavbarCollapsed = true;
                scope.refresh = function() {
                    if (angular.isUndefined(scope.menuName)) {
                        return;
                    }
                    var menuItems = eehNavigation.menuItemTree(scope.menuName);
                    scope.leftNavbarMenuItems = menuItems.filter(function(item) {
                        return !item.isHeavy();
                    });
                    scope.rightNavbarMenuItems = menuItems.filter(function(item) {
                        return item.isHeavy();
                    });
                };
                scope.$watch(eehNavigation.menuItems, scope.refresh, true);
                scope.$on("eehNavItemsRefresh", scope.refresh);
                scope.menuClick = function(menuItem) {
                    if (window.innerWidth <= 800 && !menuItem.hasChildren()) {
                        $rootScope.$broadcast("menuCollapseStatus", true);
                    }
                };
                var windowElement = angular.element($window);
                windowElement.bind("resize", function() {
                    scope.$apply();
                });
                var getWindowDimensions = function() {
                    return {
                        innerHeight: windowElement[0].innerHeight,
                        innerWidth: windowElement[0].innerWidth
                    };
                };
                scope.$watch(getWindowDimensions, function(newValue) {
                    if (angular.isUndefined(newValue)) {
                        return;
                    }
                    var width = newValue.innerWidth > 0 ? newValue.innerWidth : $window.screen.width;
                    if (width >= 768) {
                        scope.isNavbarCollapsed = true;
                    }
                }, true);
                scope.toggleState = function() {
                    $rootScope.$broadcast("menuCollapseStatus", !scope.isNavbarCollapsed);
                };
                scope.$on("menuCollapseStatus", listenCollapse);
                function listenCollapse($event, message) {
                    scope.isNavbarCollapsed = message;
                }
            }
        };
    };
    angular.module("eehNavigation").directive("eehNavigationNavbar", [ "$window", "$rootScope", "eehNavigation", NavbarDirective ]);
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationSearchInput", SearchInputDirective);
    function SearchInputDirective(eehNavigation) {
        return {
            restrict: "AE",
            transclude: true,
            templateUrl: "template/eeh-navigation/search-input/eeh-navigation-search-input.html",
            scope: {
                iconClass: "=",
                submit: "=",
                classes: "=",
                isCollapsed: "="
            },
            link: function(scope) {
                scope.model = {
                    query: ""
                };
                scope.iconBaseClass = function() {
                    return eehNavigation.iconBaseClass();
                };
            }
        };
    }
    "use strict";
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
    }
    "use strict";
    angular.module("eehNavigation").directive("eehNavigationSidebar", [ "$window", "eehNavigation", "$filter", "$rootScope", "$timeout", SidebarDirective ]);
    function SidebarDirective($window, eehNavigation, $filter, $rootScope, $timeout) {
        return {
            restrict: "AE",
            transclude: true,
            templateUrl: "template/eeh-navigation/sidebar/eeh-navigation-sidebar.html",
            scope: {
                menuName: "=",
                navClass: "=?",
                topOffset: "=?",
                menuItemCollapsedIconClass: "=?",
                menuItemExpandedIconClass: "=?",
                sidebarCollapsedIconClass: "=?",
                sidebarExpandedIconClass: "=?",
                searchInputIconClass: "=?",
                searchInputIsVisible: "=?",
                searchInputSubmit: "=",
                sidebarCollapsedButtonIsVisible: "=?",
                sidebarIsCollapsed: "=?",
                refresh: "=?"
            },
            link: function(scope) {
                scope.compact = true;
                scope.notCollapsed = [];
                scope.changeTitle = function(elem) {
                    if (window.innerWidth <= 800 && !elem.hasChildren()) {
                        $rootScope.$broadcast("menuCollapseStatus", true);
                    }
                    angular.forEach(menuItems(), function(menuItem) {
                        menuItem.activeNod = false;
                    });
                    elem.activeNod = true;
                    $rootScope.$broadcast("menuStateChanged", scope.sidebarIsCollapsed);
                    if (scope.sidebarIsCollapsed) {
                        if (scope.compact) scope.notCollapsed = [];
                        angular.forEach(menuItems(), function(menuItem) {
                            if (!menuItem.isCollapsed) scope.notCollapsed.push(menuItem);
                            menuItem.isCollapsed = true;
                        });
                    }
                };
                scope.collapseSidebar = function(elem) {
                    var isCol = elem.isCollapsed, parent = null;
                    if (scope.compact) angular.forEach(menuItems(), function(menuItem) {
                        if (menuItem.hasChildren()) {
                            Object.keys(menuItem).map(function(key) {
                                if (angular.isObject(menuItem[key]) && menuItem[key] instanceof MenuItem && menuItem[key].menuItemName === elem.menuItemName) {
                                    parent = menuItem;
                                }
                            });
                        }
                        menuItem.isCollapsed = true;
                    });
                    if (parent) parent.isCollapsed = false;
                    elem.isCollapsed = !isCol;
                };
                scope.minimized = true;
                scope.minimizeFn = function() {
                    scope.minimized = !scope.minimized;
                    angular.forEach(menuItems(), function(menuItem) {
                        if (!scope.minimized) if (menuItem.isCollapsed === false) scope.notCollapsed.push(menuItem);
                        menuItem.isCollapsed = scope.minimized;
                    });
                    if (scope.minimized) {
                        scope.notCollapsed.map(function(item) {
                            item.isCollapsed = false;
                        });
                        scope.notCollapsed = [];
                    }
                };
                scope.returnClass = function() {
                    if (scope.minimized) {
                        return "glyphicon glyphicon-option-horizontal";
                    } else {
                        return "glyphicon glyphicon-option-vertical";
                    }
                };
                scope.iconBaseClass = function() {
                    return eehNavigation.iconBaseClass();
                };
                scope.defaultIconClassPrefix = function() {
                    return eehNavigation.defaultIconClassPrefix();
                };
                scope.topOffset = scope.topOffset || 51;
                scope.navClass = scope.navClass || "navbar-default";
                scope.menuItemCollapsedIconClass = scope.menuItemCollapsedIconClass || scope.defaultIconClassPrefix() + "-chevron-left";
                scope.menuItemExpandedIconClass = scope.menuItemExpandedIconClass || scope.defaultIconClassPrefix() + "-chevron-down";
                scope.sidebarCollapsedIconClass = scope.sidebarCollapsedIconClass || scope.defaultIconClassPrefix() + "-arrow-right";
                scope.sidebarExpandedIconClass = scope.sidebarExpandedIconClass || scope.defaultIconClassPrefix() + "-arrow-left";
                scope.searchInputIconClass = scope.searchInputIconClass || scope.defaultIconClassPrefix() + "-search";
                if (scope.sidebarCollapsedButtonIsVisible !== false) {
                    scope.sidebarCollapsedButtonIsVisible = true;
                }
                scope.sidebarIsCollapsed = scope.sidebarIsCollapsed || false;
                if (scope.searchInputIsVisible !== false) {
                    scope.searchInputIsVisible = true;
                }
                var menuItems = function() {
                    return eehNavigation.menuItems();
                };
                scope.refresh = function() {
                    if (angular.isUndefined(scope.menuName)) {
                        return;
                    }
                    scope.sidebarMenuItems = eehNavigation.menuItemTree(scope.menuName);
                };
                scope.$watch(menuItems, scope.refresh, true);
                var windowElement = angular.element($window);
                windowElement.bind("resize", function() {
                    scope.$apply();
                });
                scope.checkButtonState = true;
                scope.$on("menuCollapseStatus", listenCollapse);
                function listenCollapse($event, message) {
                    scope.checkButtonState = message;
                }
                var getWindowDimensions = function() {
                    return {
                        innerHeight: windowElement[0].innerHeight,
                        innerWidth: windowElement[0].innerWidth
                    };
                };
                var transcludedWrapper = angular.element(document.querySelectorAll("#eeh-navigation-page-wrapper"));
                scope.$watch(getWindowDimensions, function(newValue) {
                    if (angular.isUndefined(newValue)) {
                        return;
                    }
                    var height = newValue.innerHeight > 0 ? newValue.innerHeight : $window.screen.height;
                    height = height - scope.topOffset;
                    if (height < 1) {
                        height = 1;
                    }
                    if (height > scope.topOffset) {
                        transcludedWrapper.css("min-height", height + "px");
                    }
                }, true);
                scope.toggleSidebarTextCollapse = function(status) {
                    if (status) scope.sidebarIsCollapsed = status; else scope.sidebarIsCollapsed = !scope.sidebarIsCollapsed;
                    $rootScope.$broadcast("menuSidebarChanged", scope.sidebarIsCollapsed);
                    if (scope.sidebarIsCollapsed) {
                        angular.forEach(menuItems(), function(menuItem) {
                            if (!menuItem.isCollapsed) {
                                scope.notCollapsed.push(menuItem);
                            }
                        });
                    } else {
                        scope.notCollapsed.map(function(item) {
                            item.isCollapsed = false;
                        });
                        scope.notCollapsed = [];
                    }
                    setTextCollapseState();
                };
                scope.$on("setSidebarCollapsed", function(event, status) {
                    scope.toggleSidebarTextCollapse(status);
                });
                function setTextCollapseState() {
                    var sidebarMenuItems = angular.element(document.querySelectorAll("ul.sidebar-nav:not(.sidebar-nav-nested) > li > a > span"));
                    var sidebarMenuItemText = sidebarMenuItems.find("span");
                    var allMenuItemTextElements = Array.prototype.filter.call(sidebarMenuItemText, function(item) {
                        return item.matches(".menu-item-text");
                    });
                    var arrowIconElements = Array.prototype.filter.call(sidebarMenuItems, function(item) {
                        return item.matches(".sidebar-arrow");
                    });
                    var sidebarElement = angular.element(document.querySelectorAll(".eeh-navigation-sidebar"));
                    if (scope.sidebarIsCollapsed) {
                        transcludedWrapper.addClass("sidebar-text-collapsed");
                        sidebarElement.addClass("sidebar-text-collapsed");
                        allMenuItemTextElements.forEach(function(menuItem) {
                            angular.element(menuItem).addClass("hidden");
                        });
                        arrowIconElements.forEach(function(menuItem) {
                            angular.element(menuItem).addClass("hidden");
                        });
                        angular.forEach(menuItems(), function(menuItem) {
                            menuItem.isCollapsed = true;
                        });
                    } else {
                        transcludedWrapper.removeClass("sidebar-text-collapsed");
                        sidebarElement.removeClass("sidebar-text-collapsed");
                        allMenuItemTextElements.forEach(function(menuItem) {
                            angular.element(menuItem).removeClass("hidden");
                        });
                        arrowIconElements.forEach(function(menuItem) {
                            angular.element(menuItem).removeClass("hidden");
                        });
                    }
                }
                scope.$on("$includeContentLoaded", function() {
                    setTextCollapseState();
                });
                scope.isSidebarVisible = function() {
                    return scope.searchInputIsVisible || angular.isArray(scope.sidebarMenuItems) && scope.sidebarMenuItems.filter(function(item) {
                        return item._isVisible();
                    }).length > 0;
                };
                scope.topLevelMenuItemClickHandler = function(clickedMenuItem) {
                    if (!scope.sidebarIsCollapsed || !clickedMenuItem.hasChildren()) {
                        return;
                    }
                    scope.sidebarMenuItems.filter(function(menuItem) {
                        return menuItem.hasChildren() && clickedMenuItem !== menuItem;
                    }).forEach(function(menuItem) {
                        menuItem.isCollapsed = true;
                    });
                };
            }
        };
    }
    global["eeh-navigation"] = exports;
})({}, function() {
    return this;
}());