/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/ErrorBoundary.tsx":
/*!**************************************!*\
  !*** ./components/ErrorBoundary.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass ErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_1__.Component {\n    constructor(props){\n        super(props);\n        this.state = {\n            hasError: false\n        };\n    }\n    static getDerivedStateFromError(error) {\n        return {\n            hasError: true,\n            error\n        };\n    }\n    componentDidCatch(error, errorInfo) {\n        console.error(\"ErrorBoundary caught an error:\", error, errorInfo);\n    }\n    render() {\n        if (this.state.hasError) {\n            if (this.props.fallback) {\n                return this.props.fallback;\n            }\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"min-h-screen flex items-center justify-center bg-gray-900 text-white\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                            className: \"text-4xl font-bold text-red-500 mb-4\",\n                            children: \"Что-то пошло не так\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\components\\\\ErrorBoundary.tsx\",\n                            lineNumber: 36,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"text-lg text-gray-300 mb-6\",\n                            children: \"Произошла неожиданная ошибка в приложении\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\components\\\\ErrorBoundary.tsx\",\n                            lineNumber: 39,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: ()=>window.location.reload(),\n                            className: \"px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors\",\n                            children: \"Обновить страницу\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\components\\\\ErrorBoundary.tsx\",\n                            lineNumber: 42,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\components\\\\ErrorBoundary.tsx\",\n                    lineNumber: 35,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\components\\\\ErrorBoundary.tsx\",\n                lineNumber: 34,\n                columnNumber: 9\n            }, this);\n        }\n        return this.props.children;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorBoundary);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnkudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE4RDtBQVk5RCxNQUFNRSxzQkFBc0JELDRDQUFTQTtJQUNuQ0UsWUFBWUMsS0FBWSxDQUFFO1FBQ3hCLEtBQUssQ0FBQ0E7UUFDTixJQUFJLENBQUNDLEtBQUssR0FBRztZQUFFQyxVQUFVO1FBQU07SUFDakM7SUFFQSxPQUFPQyx5QkFBeUJDLEtBQVksRUFBUztRQUNuRCxPQUFPO1lBQUVGLFVBQVU7WUFBTUU7UUFBTTtJQUNqQztJQUVBQyxrQkFBa0JELEtBQVksRUFBRUUsU0FBb0IsRUFBRTtRQUNwREMsUUFBUUgsS0FBSyxDQUFDLGtDQUFrQ0EsT0FBT0U7SUFDekQ7SUFFQUUsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDUCxLQUFLLENBQUNDLFFBQVEsRUFBRTtZQUN2QixJQUFJLElBQUksQ0FBQ0YsS0FBSyxDQUFDUyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDVCxLQUFLLENBQUNTLFFBQVE7WUFDNUI7WUFFQSxxQkFDRSw4REFBQ0M7Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUNEO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQ0M7NEJBQUdELFdBQVU7c0NBQXVDOzs7Ozs7c0NBR3JELDhEQUFDRTs0QkFBRUYsV0FBVTtzQ0FBNkI7Ozs7OztzQ0FHMUMsOERBQUNHOzRCQUNDQyxTQUFTLElBQU1DLE9BQU9DLFFBQVEsQ0FBQ0MsTUFBTTs0QkFDckNQLFdBQVU7c0NBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBTVQ7UUFFQSxPQUFPLElBQUksQ0FBQ1gsS0FBSyxDQUFDbUIsUUFBUTtJQUM1QjtBQUNGO0FBRUEsaUVBQWVyQixhQUFhQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2VjcmV0dm9pY2VyLy4vY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LnRzeD9lMzBlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIEVycm9ySW5mbywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXHJcblxyXG5pbnRlcmZhY2UgUHJvcHMge1xyXG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcclxuICBmYWxsYmFjaz86IFJlYWN0Tm9kZVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RhdGUge1xyXG4gIGhhc0Vycm9yOiBib29sZWFuXHJcbiAgZXJyb3I/OiBFcnJvclxyXG59XHJcblxyXG5jbGFzcyBFcnJvckJvdW5kYXJ5IGV4dGVuZHMgQ29tcG9uZW50PFByb3BzLCBTdGF0ZT4ge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcbiAgICB0aGlzLnN0YXRlID0geyBoYXNFcnJvcjogZmFsc2UgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnJvcjogRXJyb3IpOiBTdGF0ZSB7XHJcbiAgICByZXR1cm4geyBoYXNFcnJvcjogdHJ1ZSwgZXJyb3IgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkQ2F0Y2goZXJyb3I6IEVycm9yLCBlcnJvckluZm86IEVycm9ySW5mbykge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3JCb3VuZGFyeSBjYXVnaHQgYW4gZXJyb3I6JywgZXJyb3IsIGVycm9ySW5mbylcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yKSB7XHJcbiAgICAgIGlmICh0aGlzLnByb3BzLmZhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZmFsbGJhY2tcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1ncmF5LTkwMCB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTR4bCBmb250LWJvbGQgdGV4dC1yZWQtNTAwIG1iLTRcIj5cclxuICAgICAgICAgICAgICDQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6XHJcbiAgICAgICAgICAgIDwvaDE+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbGcgdGV4dC1ncmF5LTMwMCBtYi02XCI+XHJcbiAgICAgICAgICAgICAg0J/RgNC+0LjQt9C+0YjQu9CwINC90LXQvtC20LjQtNCw0L3QvdCw0Y8g0L7RiNC40LHQutCwINCyINC/0YDQuNC70L7QttC10L3QuNC4XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKX1cclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC02IHB5LTMgYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS03MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uLWNvbG9yc1wiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICDQntCx0L3QvtCy0LjRgtGMINGB0YLRgNCw0L3QuNGG0YNcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFcnJvckJvdW5kYXJ5XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIkVycm9yQm91bmRhcnkiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJoYXNFcnJvciIsImdldERlcml2ZWRTdGF0ZUZyb21FcnJvciIsImVycm9yIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJlcnJvckluZm8iLCJjb25zb2xlIiwicmVuZGVyIiwiZmFsbGJhY2siLCJkaXYiLCJjbGFzc05hbWUiLCJoMSIsInAiLCJidXR0b24iLCJvbkNsaWNrIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjaGlsZHJlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/ErrorBoundary.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/ErrorBoundary */ \"./components/ErrorBoundary.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Mustafa\\\\Documents\\\\secretvoicer\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQzhCO0FBQ3lCO0FBRXhDLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILGlFQUFhQTtrQkFDWiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL3NlY3JldHZvaWNlci8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcclxuaW1wb3J0IEVycm9yQm91bmRhcnkgZnJvbSAnLi4vY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEVycm9yQm91bmRhcnk+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvRXJyb3JCb3VuZGFyeT5cclxuICApXHJcbn0gIl0sIm5hbWVzIjpbIkVycm9yQm91bmRhcnkiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();