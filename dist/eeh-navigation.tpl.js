angular.module('eehNavigation').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/eeh-navigation/menu-item-content/eeh-navigation-menu-item-content.html',
    "<span ng-if=\"menuItem.isIconVisible\"\n" +
    "      class=\"menu-item-icon icon-fw {{ iconBaseClass() }} {{ menuItem.iconClass}}\"></span>\n" +
    "<span ng-if=\"menuItem.text\"\n" +
    "      class=\"menu-item-text\" translate=\"{{ menuItem.text }}\"></span>\n" +
    "<span ng-if=\"menuItem._ngBindHtml()\" ng-bind-html=\"menuItem._ngBindHtml()\"></span>\n"
  );


  $templateCache.put('template/eeh-navigation/menu/eeh-navigation-menu.html',
    "<nav ng-class=\"navClass\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"item in menuItems | orderBy:'weight'\"\n" +
    "            ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-menu-' + item.menuItemName}}\"\n" +
    "            ng-include=\"'template/eeh-navigation/list-menu-item.html'\"\n" +
    "            ng-class=\"{ 'leaf': !item.hasChildren() }\"\n" +
    "            ng-if=\"item._isVisible()\"\n" +
    "            eeh-navigation-active-menu-item=\"item\"></li>\n" +
    "    </ul>\n" +
    "</nav>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/list-menu-item.html\">\n" +
    "    <p ng-if=\"item.isReadOnly\" class=\"read-only-menu-item\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </p>\n" +
    "    <span ng-if=\"item.ngInclude\" ng-include=\"item.ngInclude\"></span>\n" +
    "    <a ng-if=\"item.state\" ui-sref=\"{{item.state}}\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"item.click\" ng-click=\"item.click()\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"item.href\" ng-href=\"{{item.href}}\" target=\"{{item.target ? item.target : '_self'}}\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"!item.state && item.hasChildren()\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "        <span class=\"float-right icon-fw {{ iconBaseClass() }}\"\n" +
    "              ng-class=\"item.isCollapsed ? menuItemCollapsedIconClass : menuItemExpandedIconClass\"></span>\n" +
    "    </a>\n" +
    "    <ul ng-if=\"!item.state && item.hasChildren()\">\n" +
    "        <li ng-repeat=\"item in item.children()\"\n" +
    "            ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-menu-' + item.menuItemName}}\"\n" +
    "            ng-include=\"'template/eeh-navigation/list-menu-item.html'\"\n" +
    "            ng-if=\"item._isVisible()\"\n" +
    "            eeh-navigation-active-menu-item=\"item\"></li>\n" +
    "    </ul>\n" +
    "</script>\n"
  );


  $templateCache.put('template/eeh-navigation/navbar/eeh-navigation-navbar-brand.html',
    "<a ng-if=\"state && !href && (text || src)\"\n" +
    "   class=\"navbar-brand\"\n" +
    "   ng-click=\"click()\"\n" +
    "   ui-sref=\"{{ state }}\">\n" +
    "    <span ng-include=\"'template/eeh-navigation/navbar-brand-content.html'\"></span>\n" +
    "</a>\n" +
    "\n" +
    "<a ng-if=\"!state && href && (text || src)\"\n" +
    "   class=\"navbar-brand\"\n" +
    "   ng-click=\"click()\"\n" +
    "   ng-href=\"{{ href }}\"\n" +
    "   target=\"{{ target ? target : '_self'}}\">\n" +
    "    <span ng-include=\"'template/eeh-navigation/navbar-brand-content.html'\"></span>\n" +
    "</a>\n" +
    "\n" +
    "<span ng-if=\"!state && !href && (text || src)\"\n" +
    "      ng-click=\"click()\"\n" +
    "      class=\"navbar-brand\">\n" +
    "    <span ng-include=\"'template/eeh-navigation/navbar-brand-content.html'\"></span>\n" +
    "</span>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/navbar-brand-content.html\">\n" +
    "    <img ng-if=\"src\" ng-src=\"{{ src }}\">\n" +
    "    <span ng-if=\"text\">{{ text|translate }}</span>\n" +
    "</script>\n" +
    "\n"
  );


  $templateCache.put('template/eeh-navigation/navbar/eeh-navigation-navbar.html',
    "<nav class=\"navbar eeh-navigation eeh-navigation-navbar\"\n" +
    "     ng-class=\"navClass\"\n" +
    "     role=\"navigation\">\n" +
    "    <div ng-class=\"containerClass\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <button type=\"button\" class=\"navbar-toggle\" ng-click=\"toggleState()\">\n" +
    "                <!-- changed the ng-click to a toggle state function -->\n" +
    "                <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "            </button>\n" +
    "            <eeh-navigation-navbar-brand text=\"brandText\"\n" +
    "                                         state=\"brandState\"\n" +
    "                                         href=\"brandHref\"\n" +
    "                                         target=\"brandTarget\"\n" +
    "                                         src=\"brandSrc\"\n" +
    "                                         click=\"brandClick\"></eeh-navigation-navbar-brand>\n" +
    "        </div>\n" +
    "        <div uib-collapse=\"isNavbarCollapsed\" class=\"navbar-collapse\">\n" +
    "            <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                <li ng-repeat=\"item in leftNavbarMenuItems | orderBy:'weight'\"\n" +
    "                    ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-navbar-' + item.menuItemName}}\"\n" +
    "                    ng-include=\"'template/eeh-navigation/navbar-menu-item.html'\"\n" +
    "                    ng-if=\"item._isVisible()\"\n" +
    "                    uib-dropdown\n" +
    "                    ui-sref-active-eq=\"active\"\n" +
    "                    eeh-navigation-active-menu-item=\"item\">\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\n" +
    "                <li ng-repeat=\"item in rightNavbarMenuItems | orderBy:'weight'\"\n" +
    "                    ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-navbar-' + item.menuItemName}}\"\n" +
    "                    ng-include=\"'template/eeh-navigation/navbar-menu-item.html'\"\n" +
    "                    ng-if=\"item._isVisible()\"\n" +
    "                    uib-dropdown\n" +
    "                    ui-sref-active-eq=\"active\"\n" +
    "                    eeh-navigation-active-menu-item=\"item\"></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/navbar-menu-item.html\">\n" +
    "    <p ng-if=\"item.isReadOnly\" class=\"navbar-text\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </p>\n" +
    "    <span ng-if=\"item.ngInclude\" ng-include=\"item.ngInclude\"></span>\n" +
    "    <a ng-if=\"!item.isDivider && item.state\" ui-sref=\"{{ item.state }}\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"item.click\" ng-click=\"item.click()\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"item.href\" ng-href=\"{{item.href}}\" target=\"{{item.target ? item.target : '_self'}}\">\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\n" +
    "    </a>\n" +
    "    <a ng-if=\"item.hasChildren()\" uib-dropdown-toggle=\"\">\n" +
    "        <span class=\"icon-fw {{ iconBaseClass() }} {{ item.iconClass }}\"></span>\n" +
    "        <span translate=\"{{ item.text }}\"></span>\n" +
    "        <span class=\"caret\"></span>\n" +
    "    </a>\n" +
    "    <ul ng-if=\"item.hasChildren()\" class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"item in item.children()|orderBy:'weight'\"\n" +
    "            ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-navbar-' + item.menuItemName}}\"\n" +
    "            ng-class=\"{'divider': item.isDivider}\"\n" +
    "            ng-include=\"'template/eeh-navigation/navbar-menu-item.html'\"\n" +
    "            ng-if=\"item._isVisible()\"\n" +
    "            ui-sref-active-eq=\"active\"></li>\n" +
    "    </ul>\n" +
    "</script>\n"
  );


  $templateCache.put('template/eeh-navigation/search-input/eeh-navigation-search-input.html',
    "<div ng-include=\"'template/eeh-navigation/search-input.html'\"\n" +
    "     ng-if=\"!isCollapsed\"\n" +
    "     class=\"eeh-navigation-search-input\"></div>\n" +
    "\n" +
    "<a class=\"eeh-navigation-search-input\" ng-href=\"\" ng-if=\"isCollapsed\"\n" +
    "   popover-placement=\"right\"\n" +
    "   popover-append-to-body=\"'true'\"\n" +
    "   uib-popover-template=\"'template/eeh-navigation/search-input-popover.html'\">\n" +
    "    <span class=\"menu-item-icon icon-fw {{ iconBaseClass() }} {{ iconClass }}\"></span>\n" +
    "</a>\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/search-input-popover.html\">\n" +
    "    <div class=\"row search-input-popover\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <div ng-include=\"'template/eeh-navigation/search-input.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/search-input.html\">\n" +
    "    <form ng-submit=\"submit(model.query)\" class=\"navbar-form\" ng-class=\"classes\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"form-control\"\n" +
    "                   placeholder=\"{{'Search'|translate}}\"\n" +
    "                   ng-model=\"model.query\">\n" +
    "        <span class=\"input-group-btn\" ng-if=\"!isCollapsed\">\n" +
    "            <button class=\"btn btn-default\">\n" +
    "                <span class=\"icon-fw {{ iconBaseClass() }} {{ iconClass }}\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</script>\n"
  );


  $templateCache.put('template/eeh-navigation/sidebar/eeh-navigation-sidebar.html',
    "<nav class=\"navbar navbar-collapse navbar-default eeh-navigation eeh-navigation-sidebar eeh-padding\" role=\"navigation\"\r" +
    "\n" +
    "    ng-class=\"navClass\" uib-collapse=\"checkButtonState\">\r" +
    "\n" +
    "    <!-- is set to collapse the parent container -->\r" +
    "\n" +
    "    <div class=\"navbar-collapse\" >\r" +
    "\n" +
    "        <ul class=\"nav sidebar-nav\">\r" +
    "\n" +
    "            <li class=\"sidebar-search\" ng-if=\"searchInputIsVisible\">\r" +
    "\n" +
    "                <eeh-navigation-search-input class=\"sidebar-search-input\"\r" +
    "\n" +
    "                                             icon-class=\"searchInputIconClass\"\r" +
    "\n" +
    "                                             submit=\"searchInputSubmit\"\r" +
    "\n" +
    "                                             is-collapsed=\"sidebarIsCollapsed\"></eeh-navigation-search-input>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "            <!-- duplicate the toggle-sidebar-btn -->\r" +
    "\n" +
    "            <li ng-if=\"sidebarCollapsedButtonIsVisible && isSidebarVisible()\">\r" +
    "\n" +
    "                <a>\r" +
    "\n" +
    "                    <span ng-click=\"toggleSidebarTextCollapse()\" class=\"icon-fw {{ iconBaseClass() }}\" ng-class=\"sidebarIsCollapsed ? sidebarCollapsedIconClass : sidebarExpandedIconClass\"></span>\r" +
    "\n" +
    "                    <span ng-hide=\"sidebarIsCollapsed\" ng-click=\"minimizeFn()\" class=\"minimize pull-right\" ng-class=\"returnClass()\"></span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "            <li ng-repeat=\"item in sidebarMenuItems | orderBy:'weight'\"\r" +
    "\n" +
    "                ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-sidebar-' + item.menuItemName}}\"\r" +
    "\n" +
    "                ng-include=\"'template/eeh-navigation/sidebar-menu-item.html'\"\r" +
    "\n" +
    "                ng-class=\"{ 'leaf': !item.hasChildren() }\"\r" +
    "\n" +
    "                ng-if=\"item._isVisible()\"\r" +
    "\n" +
    "                ng-click=\"topLevelMenuItemClickHandler(item)\"\r" +
    "\n" +
    "                ui-sref-active=\"active\"\r" +
    "\n" +
    "                ng-attr-title=\"{{item.description ? item.description : item.text | translate}}\"\r" +
    "\n" +
    "                eeh-navigation-active-menu-item=\"item\"></li>\r" +
    "\n" +
    "            <li ng-click=\"toggleSidebarTextCollapse()\" ng-if=\"sidebarCollapsedButtonIsVisible && isSidebarVisible()\">\r" +
    "\n" +
    "                <a>\r" +
    "\n" +
    "                    <span class=\"icon-fw {{ iconBaseClass() }}\" ng-class=\"sidebarIsCollapsed ? sidebarCollapsedIconClass : sidebarExpandedIconClass\"></span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</nav>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"eeh-navigation-page-wrapper\" ng-class=\"{ 'sidebar-invisible': !isSidebarVisible() }\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-lg-12\">\r" +
    "\n" +
    "            <div ng-transclude></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"template/eeh-navigation/sidebar-menu-item.html\">\r" +
    "\n" +
    "    <p ng-if=\"item.isReadOnly\" class=\"navbar-text\">\r" +
    "\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <span ng-if=\"item.ngInclude\" ng-include=\"item.ngInclude\"></span>\r" +
    "\n" +
    "    <a ng-if=\"item.state\" ui-sref=\"{{item.state}}\"  ui-sref-opts=\"{inherit: false}\">\r" +
    "\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <a ng-if=\"item.click\" ng-click=\"item.click()\">\r" +
    "\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <a ng-if=\"item.href\" ng-href=\"{{item.href}}\" target=\"{{item.target ? item.target : '_self'}}\">\r" +
    "\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <!-- aici trebuie de schimbat la ng-click dupa modelul: se cheama functia ng-click=\"collapseSidebar(item)\" -->\r" +
    "\n" +
    "    <!-- checks whether there is a description or not and puts it in the title -->\r" +
    "\n" +
    "    <a ng-if=\"!item.state && item.hasChildren()\"\r" +
    "\n" +
    "       ng-click=\"collapseSidebar(item)\"\r" +
    "\n" +
    "       ng-class=\"item.className\"\r" +
    "\n" +
    "       ng-attr-title=\"{{item.description ? item.description : item.text | translate}}\">\r" +
    "\n" +
    "        <span eeh-navigation-menu-item-content=\"item\"></span>\r" +
    "\n" +
    "        <span class=\"navbar-right sidebar-arrow icon-fw {{ iconBaseClass() }}\"\r" +
    "\n" +
    "              ng-class=\"item.isCollapsed ? menuItemCollapsedIconClass : menuItemExpandedIconClass\"></span>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <!-- checks whether there is a description or not and puts it in the title -->\r" +
    "\n" +
    "    <ul ng-if=\"!item.state && item.hasChildren()\" uib-collapse=\"item.isCollapsed\"\r" +
    "\n" +
    "        ng-class=\"{ 'text-collapsed': sidebarIsCollapsed }\"\r" +
    "\n" +
    "        class=\"nav sidebar-nav sidebar-nav-nested\">\r" +
    "\n" +
    "        <li ng-repeat=\"item in item.children() | orderBy:'weight'\"\r" +
    "\n" +
    "            ng-attr-id=\"{{item.id ? item.id : 'eeh-navigation-sidebar-' + item.menuItemName}}\"\r" +
    "\n" +
    "            ng-include=\"'template/eeh-navigation/sidebar-menu-item.html'\"\r" +
    "\n" +
    "            ng-attr-title=\"{{item.description ? item.description : item.text | translate}}\"\r" +
    "\n" +
    "            ng-click=\"changeTitle(item)\"\r" +
    "\n" +
    "            ng-class=\"{ 'leaf': !item.hasChildren() }\"\r" +
    "\n" +
    "            ng-if=\"item._isVisible()\"\r" +
    "\n" +
    "            ui-sref-active=\"active\"\r" +
    "\n" +
    "            eeh-navigation-active-menu-item=\"item\"></li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</script>\r" +
    "\n"
  );

}]);
