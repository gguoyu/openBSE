"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _specialBaseRenderer = _interopRequireDefault(require("./specialBaseRenderer"));

var _browserNotSupportError = _interopRequireDefault(require("../errors/browserNotSupportError"));

var _linkedList = _interopRequireDefault(require("../lib/linkedList"));

var _helper = _interopRequireDefault(require("../lib/helper"));

var _transformFunctionsInterpreter2 = _interopRequireDefault(require("../lib/transformFunctionsInterpreter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Canvas 渲染器类
 */
var SpecialCanvasRenderer = function (_SpecialBaseRenderer) {
  _inherits(SpecialCanvasRenderer, _SpecialBaseRenderer);

  /**
   * 实例化一个 Canvas 渲染器类
   * @param {object} element - Element 元素
   * @param {openBSE~Options} options - 全局选项
   * @param {object} elementSize - 元素大小
   * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
   */
  function SpecialCanvasRenderer(element, options, elementSize) {
    var _this;

    _classCallCheck(this, SpecialCanvasRenderer);

    /**
     * 屏幕上的弹幕
     * @private @type {LinkedList}
     */
    var _bulletScreensOnScreen = new _linkedList["default"]();
    /**
     * transform-functions 解释器
     */


    var _transformFunctionsInterpreter = new _transformFunctionsInterpreter2["default"]();
    /**
     * DPI 缩放比例（倍数）
     * @private @type {number}
     */


    var _devicePixelRatio = _helper["default"].getDevicePixelRatio(true);

    _devicePixelRatio *= options.scaling;
    supportCheck();
    /**
     * 画布元素
     * @private @type {Element}
     */

    var _canvas = init();

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpecialCanvasRenderer).call(this, _canvas, options, elementSize));
    /**
     * 清除屏幕内容
     * @function
     * @override
     */

    _this.cleanScreen = function () {
      _bulletScreensOnScreen.clean();

      _canvas.getContext('2d').clearRect(0, 0, _canvas.width, _canvas.height);
    };
    /**
     * 绘制函数
     * @override
     */


    _this.draw = function () {
      var canvasContext = _canvas.getContext('2d');

      canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);

      _bulletScreensOnScreen.forEach(function (node) {
        var realTimeBulletScreen = node.element;
        canvasContext.drawImage(realTimeBulletScreen.hideCanvas, 0, 0);
      }, true);
    };
    /**
     * 刷新弹幕样式 
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
    */


    _this.refresh = function (oldStyle, realTimeBulletScreen) {
      if (oldStyle === null || oldStyle.text != realTimeBulletScreen.style.text || oldStyle.shadowBlur != realTimeBulletScreen.style.shadowBlur || oldStyle.fontWeight != realTimeBulletScreen.style.fontWeight || oldStyle.fontFamily != realTimeBulletScreen.style.fontFamily || oldStyle.size != realTimeBulletScreen.style.size || oldStyle.boxColor != realTimeBulletScreen.style.boxColor || oldStyle.color != realTimeBulletScreen.style.color || oldStyle.borderColor != realTimeBulletScreen.style.borderColor) drawHideTextCanvas(realTimeBulletScreen);

      if (oldStyle === null || oldStyle.transform != realTimeBulletScreen.style.transform) {
        var hideCanvas = document.createElement('canvas');
        var hideCanvasContext = hideCanvas.getContext('2d');
        hideCanvas.width = _canvas.width;
        hideCanvas.height = _canvas.height;
        setTransform(_transformFunctionsInterpreter.toObject(realTimeBulletScreen.style.transform), hideCanvasContext, realTimeBulletScreen.hideTextCanvas);
        realTimeBulletScreen.hideCanvas = hideCanvas;
      }
    };
    /**
     * 创建弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this.creat = function (realTimeBulletScreen) {
      this.refresh(null, realTimeBulletScreen);
      realTimeBulletScreen.linkedListNode = new _linkedList["default"].node(realTimeBulletScreen);

      _bulletScreensOnScreen.push(realTimeBulletScreen.linkedListNode, false);
    };
    /**
     * 删除弹幕元素
     * @override
     * @param {object} realTimeBulletScreen - 实时弹幕对象
     */


    _this["delete"] = function (realTimeBulletScreen) {
      return realTimeBulletScreen.linkedListNode.remove();
    };

    var _setSize = _this.setSize;
    /**
     * 设置尺寸
     * @override
     */

    _this.setSize = function () {
      _setSize();

      _devicePixelRatio = _helper["default"].getDevicePixelRatio();
      _devicePixelRatio *= options.scaling;
      _canvas.width = elementSize.width * _devicePixelRatio;
      _canvas.height = elementSize.height * _devicePixelRatio;
    };

    function drawHideTextCanvas(realTimeBulletScreen) {
      var hideTextCanvas = document.createElement('canvas');
      var hideTextCanvasContext = hideTextCanvas.getContext('2d');
      hideTextCanvasContext.font = "".concat(realTimeBulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.style.size * _devicePixelRatio, "px ").concat(realTimeBulletScreen.style.fontFamily);
      realTimeBulletScreen.width = hideTextCanvasContext.measureText(realTimeBulletScreen.style.text).width;
      hideTextCanvas.width = realTimeBulletScreen.width + 8 * _devicePixelRatio;
      hideTextCanvas.height = (realTimeBulletScreen.style.size + 8) * _devicePixelRatio;
      hideTextCanvasContext.shadowColor = 'black';
      hideTextCanvasContext.font = "".concat(realTimeBulletScreen.style.fontWeight, " ").concat(realTimeBulletScreen.style.size * _devicePixelRatio, "px ").concat(realTimeBulletScreen.style.fontFamily);
      var textX = 4 * _devicePixelRatio;
      var textY = (4 + realTimeBulletScreen.style.size * 0.8) * _devicePixelRatio;

      if (realTimeBulletScreen.style.color != null) {
        hideTextCanvasContext.shadowBlur = (realTimeBulletScreen.style.shadowBlur + 0.5) * _devicePixelRatio;
        hideTextCanvasContext.fillStyle = realTimeBulletScreen.style.color;
        hideTextCanvasContext.fillText(realTimeBulletScreen.style.text, textX, textY);
      }

      if (realTimeBulletScreen.style.borderColor != null) {
        hideTextCanvasContext.shadowBlur = 0;
        hideTextCanvasContext.lineWidth = 0.5 * _devicePixelRatio;
        hideTextCanvasContext.strokeStyle = realTimeBulletScreen.style.borderColor;
        hideTextCanvasContext.strokeText(realTimeBulletScreen.style.text, textX, textY);
      }

      if (realTimeBulletScreen.style.boxColor != null) {
        hideTextCanvasContext.shadowBlur = 0;
        hideTextCanvasContext.lineWidth = _devicePixelRatio;
        hideTextCanvasContext.strokeStyle = realTimeBulletScreen.style.boxColor;
        hideTextCanvasContext.strokeRect(_devicePixelRatio, _devicePixelRatio, hideTextCanvas.width - _devicePixelRatio, hideTextCanvas.height - _devicePixelRatio);
      }

      realTimeBulletScreen.hideTextCanvas = hideTextCanvas;
    }

    function setTransform(transformObject, canvasContext, textCanvas) {
      var width = textCanvas.width,
          height = textCanvas.height;
      var tx = 0,
          ty = 0;

      if (transformObject.translate) {
        tx = transformObject.translate.tx.value;
        ty = transformObject.translate.ty.value;
      }

      if (transformObject.translateX) tx = transformObject.translate.t.value;
      if (transformObject.translateY) ty = transformObject.translate.t.value;

      if (transformObject.rotate) {
        var halfWidth = width / 2,
            halfHeight = height / 2;
        canvasContext.translate(tx + halfWidth, ty + halfHeight);
        tx = -halfWidth;
        ty = -halfHeight;
        canvasContext.rotate(_transformFunctionsInterpreter2["default"].getAngleValue(transformObject.rotate.a));
      }

      if (transformObject.matrix) {
        canvasContext.transform(transformObject.matrix.a.value, transformObject.matrix.b.value, transformObject.matrix.c.value, transformObject.matrix.d.value, transformObject.matrix.tx.value, transformObject.matrix.ty.value);
      }

      canvasContext.drawImage(textCanvas, tx, ty, width, height);
    }
    /**
     * 添加Canvas
     * @private
     * @returns {Element} 画布对象
     */


    function init() {
      var canvas = document.createElement('canvas');

      _helper["default"].cleanElement(element);

      element.appendChild(canvas);
      canvas.width = elementSize.width * _devicePixelRatio;
      canvas.height = elementSize.height * _devicePixelRatio;
      return canvas;
    }
    /**
     * 浏览器支持检测
     * @private
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */


    function supportCheck() {
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext != 'function') throw new _browserNotSupportError["default"]('Canvas');
      var context = canvas.getContext('2d');
      if (context === null) throw new _browserNotSupportError["default"]('Canvas 2D');
      if (typeof context.fillText != 'function') throw new _browserNotSupportError["default"]('Canvas 2D fillText Function');
    }

    return _this;
  }

  return SpecialCanvasRenderer;
}(_specialBaseRenderer["default"]);

exports["default"] = SpecialCanvasRenderer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlcmVycy9zcGVjaWFsQ2FudmFzUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiU3BlY2lhbENhbnZhc1JlbmRlcmVyIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJlbGVtZW50U2l6ZSIsIl9idWxsZXRTY3JlZW5zT25TY3JlZW4iLCJMaW5rZWRMaXN0IiwiX3RyYW5zZm9ybUZ1bmN0aW9uc0ludGVycHJldGVyIiwiVHJhbnNmb3JtRnVuY3Rpb25zSW50ZXJwcmV0ZXIiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsIkhlbHBlciIsImdldERldmljZVBpeGVsUmF0aW8iLCJzY2FsaW5nIiwic3VwcG9ydENoZWNrIiwiX2NhbnZhcyIsImluaXQiLCJjbGVhblNjcmVlbiIsImNsZWFuIiwiZ2V0Q29udGV4dCIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImNhbnZhc0NvbnRleHQiLCJmb3JFYWNoIiwibm9kZSIsInJlYWxUaW1lQnVsbGV0U2NyZWVuIiwiZHJhd0ltYWdlIiwiaGlkZUNhbnZhcyIsInJlZnJlc2giLCJvbGRTdHlsZSIsInRleHQiLCJzdHlsZSIsInNoYWRvd0JsdXIiLCJmb250V2VpZ2h0IiwiZm9udEZhbWlseSIsInNpemUiLCJib3hDb2xvciIsImNvbG9yIiwiYm9yZGVyQ29sb3IiLCJkcmF3SGlkZVRleHRDYW52YXMiLCJ0cmFuc2Zvcm0iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJoaWRlQ2FudmFzQ29udGV4dCIsInNldFRyYW5zZm9ybSIsInRvT2JqZWN0IiwiaGlkZVRleHRDYW52YXMiLCJjcmVhdCIsImxpbmtlZExpc3ROb2RlIiwicHVzaCIsInJlbW92ZSIsIl9zZXRTaXplIiwic2V0U2l6ZSIsImhpZGVUZXh0Q2FudmFzQ29udGV4dCIsImZvbnQiLCJtZWFzdXJlVGV4dCIsInNoYWRvd0NvbG9yIiwidGV4dFgiLCJ0ZXh0WSIsImZpbGxTdHlsZSIsImZpbGxUZXh0IiwibGluZVdpZHRoIiwic3Ryb2tlU3R5bGUiLCJzdHJva2VUZXh0Iiwic3Ryb2tlUmVjdCIsInRyYW5zZm9ybU9iamVjdCIsInRleHRDYW52YXMiLCJ0eCIsInR5IiwidHJhbnNsYXRlIiwidmFsdWUiLCJ0cmFuc2xhdGVYIiwidCIsInRyYW5zbGF0ZVkiLCJyb3RhdGUiLCJoYWxmV2lkdGgiLCJoYWxmSGVpZ2h0IiwiZ2V0QW5nbGVWYWx1ZSIsImEiLCJtYXRyaXgiLCJiIiwiYyIsImQiLCJjYW52YXMiLCJjbGVhbkVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsIkJyb3dzZXJOb3RTdXBwb3J0RXJyb3IiLCJjb250ZXh0IiwiU3BlY2lhbEJhc2VSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQkEscUI7OztBQUNqQjs7Ozs7OztBQU9BLGlDQUFZQyxPQUFaLEVBQXFCQyxPQUFyQixFQUE4QkMsV0FBOUIsRUFBMkM7QUFBQTs7QUFBQTs7QUFDdkM7Ozs7QUFJQSxRQUFJQyxzQkFBc0IsR0FBRyxJQUFJQyxzQkFBSixFQUE3QjtBQUNBOzs7OztBQUdBLFFBQUlDLDhCQUE4QixHQUFHLElBQUlDLDBDQUFKLEVBQXJDO0FBQ0E7Ozs7OztBQUlBLFFBQUlDLGlCQUFpQixHQUFHQyxtQkFBT0MsbUJBQVAsQ0FBMkIsSUFBM0IsQ0FBeEI7O0FBQ0FGLElBQUFBLGlCQUFpQixJQUFJTixPQUFPLENBQUNTLE9BQTdCO0FBRUFDLElBQUFBLFlBQVk7QUFDWjs7Ozs7QUFJQSxRQUFJQyxPQUFPLEdBQUdDLElBQUksRUFBbEI7O0FBQ0EsK0ZBQU1ELE9BQU4sRUFBZVgsT0FBZixFQUF3QkMsV0FBeEI7QUFFQTs7Ozs7O0FBS0EsVUFBS1ksV0FBTCxHQUFtQixZQUFXO0FBQzFCWCxNQUFBQSxzQkFBc0IsQ0FBQ1ksS0FBdkI7O0FBQ0FILE1BQUFBLE9BQU8sQ0FBQ0ksVUFBUixDQUFtQixJQUFuQixFQUF5QkMs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T0FBTyxLQUFLLElBQWhCLEVBQXNCLE1BQU0sSUFBSUQsa0NBQUosQ0FBMkIsV0FBM0IsQ0FBTjtBQUN0QixVQUFJLE9BQU9DLE9BQU8sQ0FBQzNCLFFBQWYsSUFBMkIsVUFBL0IsRUFBMkMsTUFBTSxJQUFJMEIsa0NBQUosQ0FBMkIsNkJBQTNCLENBQU47QUFDOUM7O0FBek1zQztBQTBNMUM7OztFQWxOOENFLCtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNwZWNpYWxCYXNlUmVuZGVyZXIgZnJvbSAnLi9zcGVjaWFsQmFzZVJlbmRlcmVyJ1xuaW1wb3J0IEJyb3dzZXJOb3RTdXBwb3J0RXJyb3IgZnJvbSAnLi4vZXJyb3JzL2Jyb3dzZXJOb3RTdXBwb3J0RXJyb3InXG5pbXBvcnQgTGlua2VkTGlzdCBmcm9tICcuLi9saWIvbGlua2VkTGlzdCdcbmltcG9ydCBIZWxwZXIgZnJvbSAnLi4vbGliL2hlbHBlcic7XG5pbXBvcnQgVHJhbnNmb3JtRnVuY3Rpb25zSW50ZXJwcmV0ZXIgZnJvbSAnLi4vbGliL3RyYW5zZm9ybUZ1bmN0aW9uc0ludGVycHJldGVyJ1xuXG4vKipcbiAqIENhbnZhcyDmuLLmn5PlmajnsbtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY2lhbENhbnZhc1JlbmRlcmVyIGV4dGVuZHMgU3BlY2lhbEJhc2VSZW5kZXJlciB7XG4gICAgLyoqXG4gICAgICog5a6e5L6L5YyW5LiA5LiqIENhbnZhcyDmuLLmn5PlmajnsbtcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIEVsZW1lbnQg5YWD57SgXG4gICAgICogQHBhcmFtIHtvcGVuQlNFfk9wdGlvbnN9IG9wdGlvbnMgLSDlhajlsYDpgInpoblcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFNpemUgLSDlhYPntKDlpKflsI9cbiAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMsIGVsZW1lbnRTaXplKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlsY/luZXkuIrnmoTlvLnluZVcbiAgICAgICAgICogQHByaXZhdGUgQHR5cGUge0xpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgX2J1bGxldFNjcmVlbnNPblNjcmVlbiA9IG5ldyBMaW5rZWRMaXN0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0cmFuc2Zvcm0tZnVuY3Rpb25zIOino+mHiuWZqFxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF90cmFuc2Zvcm1GdW5jdGlvbnNJbnRlcnByZXRlciA9IG5ldyBUcmFuc2Zvcm1GdW5jdGlvbnNJbnRlcnByZXRlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogRFBJIOe8qeaUvuavlOS+i++8iOWAjeaVsO+8iVxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IF9kZXZpY2VQaXhlbFJhdGlvID0gSGVscGVyLmdldERldmljZVBpeGVsUmF0aW8odHJ1ZSk7XG4gICAgICAgIF9kZXZpY2VQaXhlbFJhdGlvICo9IG9wdGlvbnMuc2NhbGluZztcblxuICAgICAgICBzdXBwb3J0Q2hlY2soKTsgLy/mtY/op4jlmajmlK/mjIHmo4DmtYtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOeUu+W4g+WFg+e0oFxuICAgICAgICAgKiBAcHJpdmF0ZSBAdHlwZSB7RWxlbWVudH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBfY2FudmFzID0gaW5pdCgpO1xuICAgICAgICBzdXBlcihfY2FudmFzLCBvcHRpb25zLCBlbGVtZW50U2l6ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4hemZpOWxj+W5leWGheWuuVxuICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNsZWFuU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLmNsZWFuKCk7XG4gICAgICAgICAgICBfY2FudmFzLmdldENvbnRleHQoJzJkJykuY2xlYXJSZWN0KDAsIDAsIF9jYW52YXMud2lkdGgsIF9jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5jliLblh73mlbBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY2FudmFzQ29udGV4dCA9IF9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGNhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIF9jYW52YXMud2lkdGgsIF9jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIF9idWxsZXRTY3JlZW5zT25TY3JlZW4uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWFsVGltZUJ1bGxldFNjcmVlbiA9IG5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBjYW52YXNDb250ZXh0LmRyYXdJbWFnZShyZWFsVGltZUJ1bGxldFNjcmVlbi5oaWRlQ2FudmFzLCAwLCAwKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIt+aWsOW8ueW5leagt+W8jyBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAob2xkU3R5bGUsIHJlYWxUaW1lQnVsbGV0U2NyZWVuKSB7XG4gICAgICAgICAgICBpZiAob2xkU3R5bGUgPT09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAvLyDlvLnluZXmlofmnKxcbiAgICAgICAgICAgICAgICBvbGRTdHlsZS50ZXh0ICE9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnRleHQgfHxcbiAgICAgICAgICAgICAgICAvLyDpmLTlvbHnmoTmqKHns4rnuqfliKvvvIww5Li65LiN5pi+56S66Zi05b2xXG4gICAgICAgICAgICAgICAgb2xkU3R5bGUuc2hhZG93Qmx1ciAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaGFkb3dCbHVyIHx8XG4gICAgICAgICAgICAgICAgLy8g5a2X5L2T57KX57uGXG4gICAgICAgICAgICAgICAgb2xkU3R5bGUuZm9udFdlaWdodCAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5mb250V2VpZ2h0IHx8XG4gICAgICAgICAgICAgICAgLy8g5a2X5L2T57O75YiXXG4gICAgICAgICAgICAgICAgb2xkU3R5bGUuZm9udEZhbWlseSAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5IHx8XG4gICAgICAgICAgICAgICAgLy8g5a2X5L2T5aSn5bCP77yI5Y2V5L2N77ya5YOP57Sg77yJXG4gICAgICAgICAgICAgICAgb2xkU3R5bGUuc2l6ZSAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaXplIHx8XG4gICAgICAgICAgICAgICAgLy8g5aSW5qGG6aKc6ImyXG4gICAgICAgICAgICAgICAgb2xkU3R5bGUuYm94Q29sb3IgIT0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IgfHxcbiAgICAgICAgICAgICAgICAvLyDlrZfkvZPpopzoibJcbiAgICAgICAgICAgICAgICBvbGRTdHlsZS5jb2xvciAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5jb2xvciB8fFxuICAgICAgICAgICAgICAgIC8vIOaPj+i+ueminOiJslxuICAgICAgICAgICAgICAgIG9sZFN0eWxlLmJvcmRlckNvbG9yICE9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yKSBkcmF3SGlkZVRleHRDYW52YXMocmVhbFRpbWVCdWxsZXRTY3JlZW4pO1xuICAgICAgICAgICAgaWYgKG9sZFN0eWxlID09PSBudWxsIHx8IG9sZFN0eWxlLnRyYW5zZm9ybSAhPSByZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS50cmFuc2Zvcm0pIHtcbiAgICAgICAgICAgICAgICBsZXQgaGlkZUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIGxldCBoaWRlQ2FudmFzQ29udGV4dCA9IGhpZGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzLndpZHRoID0gX2NhbnZhcy53aWR0aDtcbiAgICAgICAgICAgICAgICBoaWRlQ2FudmFzLmhlaWdodCA9IF9jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNldFRyYW5zZm9ybShfdHJhbnNmb3JtRnVuY3Rpb25zSW50ZXJwcmV0ZXIudG9PYmplY3QocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUudHJhbnNmb3JtKSwgaGlkZUNhbnZhc0NvbnRleHQsIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhpZGVUZXh0Q2FudmFzKTtcbiAgICAgICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi5oaWRlQ2FudmFzID0gaGlkZUNhbnZhcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdCA9IGZ1bmN0aW9uIChyZWFsVGltZUJ1bGxldFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKG51bGwsIHJlYWxUaW1lQnVsbGV0U2NyZWVuKTtcbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmxpbmtlZExpc3ROb2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShyZWFsVGltZUJ1bGxldFNjcmVlbik7XG4gICAgICAgICAgICBfYnVsbGV0U2NyZWVuc09uU2NyZWVuLnB1c2gocmVhbFRpbWVCdWxsZXRTY3JlZW4ubGlua2VkTGlzdE5vZGUsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKDpmaTlvLnluZXlhYPntKBcbiAgICAgICAgICogQG92ZXJyaWRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWFsVGltZUJ1bGxldFNjcmVlbiAtIOWunuaXtuW8ueW5leWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWxldGUgPSAocmVhbFRpbWVCdWxsZXRTY3JlZW4pID0+IHJlYWxUaW1lQnVsbGV0U2NyZWVuLmxpbmtlZExpc3ROb2RlLnJlbW92ZSgpO1xuXG4gICAgICAgIGxldCBfc2V0U2l6ZSA9IHRoaXMuc2V0U2l6ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruWwuuWvuFxuICAgICAgICAgKiBAb3ZlcnJpZGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zZXRTaXplKCk7XG4gICAgICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyA9IEhlbHBlci5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG4gICAgICAgICAgICBfZGV2aWNlUGl4ZWxSYXRpbyAqPSBvcHRpb25zLnNjYWxpbmc7XG4gICAgICAgICAgICBfY2FudmFzLndpZHRoID0gZWxlbWVudFNpemUud2lkdGggKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIF9jYW52YXMuaGVpZ2h0ID0gZWxlbWVudFNpemUuaGVpZ2h0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3SGlkZVRleHRDYW52YXMocmVhbFRpbWVCdWxsZXRTY3JlZW4pIHtcbiAgICAgICAgICAgIGxldCBoaWRlVGV4dENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgbGV0IGhpZGVUZXh0Q2FudmFzQ29udGV4dCA9IGhpZGVUZXh0Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5mb250ID0gYCR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaXplICogX2RldmljZVBpeGVsUmF0aW99cHggJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5fWA7XG4gICAgICAgICAgICByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCA9IGhpZGVUZXh0Q2FudmFzQ29udGV4dC5tZWFzdXJlVGV4dChyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS50ZXh0KS53aWR0aDsgLy/lvLnluZXnmoTlrr3luqbvvJrlg4/ntKBcblxuICAgICAgICAgICAgaGlkZVRleHRDYW52YXMud2lkdGggPSByZWFsVGltZUJ1bGxldFNjcmVlbi53aWR0aCArIDggKiBfZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzLmhlaWdodCA9IChyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaXplICsgOCkgKiBfZGV2aWNlUGl4ZWxSYXRpbztcblxuICAgICAgICAgICAgaGlkZVRleHRDYW52YXNDb250ZXh0LnNoYWRvd0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5mb250ID0gYCR7cmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuZm9udFdlaWdodH0gJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5zaXplICogX2RldmljZVBpeGVsUmF0aW99cHggJHtyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS5mb250RmFtaWx5fWA7XG4gICAgICAgICAgICBsZXQgdGV4dFggPSA0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBsZXQgdGV4dFkgPSAoNCArIHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnNpemUgKiAwLjgpICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuY29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnNoYWRvd0JsdXIgKyAwLjUpICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgaGlkZVRleHRDYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmNvbG9yO1xuICAgICAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5maWxsVGV4dChyZWFsVGltZUJ1bGxldFNjcmVlbi5zdHlsZS50ZXh0LCB0ZXh0WCwgdGV4dFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWRlVGV4dENhbnZhc0NvbnRleHQuc2hhZG93Qmx1ciA9IDA7XG4gICAgICAgICAgICAgICAgaGlkZVRleHRDYW52YXNDb250ZXh0LmxpbmVXaWR0aCA9IDAuNSAqIF9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5zdHJva2VUZXh0KHJlYWxUaW1lQnVsbGV0U2NyZWVuLnN0eWxlLnRleHQsIHRleHRYLCB0ZXh0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhpZGVUZXh0Q2FudmFzQ29udGV4dC5zaGFkb3dCbHVyID0gMDtcbiAgICAgICAgICAgICAgICBoaWRlVGV4dENhbnZhc0NvbnRleHQubGluZVdpZHRoID0gX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgaGlkZVRleHRDYW52YXNDb250ZXh0LnN0cm9rZVN0eWxlID0gcmVhbFRpbWVCdWxsZXRTY3JlZW4uc3R5bGUuYm94Q29sb3I7XG4gICAgICAgICAgICAgICAgaGlkZVRleHRDYW52YXNDb250ZXh0LnN0cm9rZVJlY3QoX2RldmljZVBpeGVsUmF0aW8sIF9kZXZpY2VQaXhlbFJhdGlvLCBoaWRlVGV4dENhbnZhcy53aWR0aCAtIF9kZXZpY2VQaXhlbFJhdGlvLCBoaWRlVGV4dENhbnZhcy5oZWlnaHQgLSBfZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlYWxUaW1lQnVsbGV0U2NyZWVuLmhpZGVUZXh0Q2FudmFzID0gaGlkZVRleHRDYW52YXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRUcmFuc2Zvcm0odHJhbnNmb3JtT2JqZWN0LCBjYW52YXNDb250ZXh0LCB0ZXh0Q2FudmFzKSB7XG4gICAgICAgICAgICBsZXQgd2lkdGggPSB0ZXh0Q2FudmFzLndpZHRoLCBoZWlnaHQgPSB0ZXh0Q2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGxldCB0eCA9IDAsIHR5ID0gMDtcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1PYmplY3QudHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgdHggPSB0cmFuc2Zvcm1PYmplY3QudHJhbnNsYXRlLnR4LnZhbHVlO1xuICAgICAgICAgICAgICAgIHR5ID0gdHJhbnNmb3JtT2JqZWN0LnRyYW5zbGF0ZS50eS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1PYmplY3QudHJhbnNsYXRlWCkgdHggPSB0cmFuc2Zvcm1PYmplY3QudHJhbnNsYXRlLnQudmFsdWU7XG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtT2JqZWN0LnRyYW5zbGF0ZVkpIHR5ID0gdHJhbnNmb3JtT2JqZWN0LnRyYW5zbGF0ZS50LnZhbHVlO1xuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybU9iamVjdC5yb3RhdGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgaGFsZldpZHRoID0gd2lkdGggLyAyLCBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICBjYW52YXNDb250ZXh0LnRyYW5zbGF0ZSh0eCArIGhhbGZXaWR0aCwgdHkgKyBoYWxmSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0eCA9IC0gaGFsZldpZHRoO1xuICAgICAgICAgICAgICAgIHR5ID0gLSBoYWxmSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQucm90YXRlKFRyYW5zZm9ybUZ1bmN0aW9uc0ludGVycHJldGVyLmdldEFuZ2xlVmFsdWUodHJhbnNmb3JtT2JqZWN0LnJvdGF0ZS5hKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtT2JqZWN0Lm1hdHJpeCkge1xuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQudHJhbnNmb3JtKFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PYmplY3QubWF0cml4LmEudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU9iamVjdC5tYXRyaXguYi52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtT2JqZWN0Lm1hdHJpeC5jLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PYmplY3QubWF0cml4LmQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU9iamVjdC5tYXRyaXgudHgudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU9iamVjdC5tYXRyaXgudHkudmFsdWVcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYW52YXNDb250ZXh0LmRyYXdJbWFnZSh0ZXh0Q2FudmFzLCB0eCwgdHksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoENhbnZhc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0g55S75biD5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOyAvL2NhbnZhc+WvueixoVxuICAgICAgICAgICAgSGVscGVyLmNsZWFuRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGVsZW1lbnRTaXplLndpZHRoICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudFNpemUuaGVpZ2h0ICogX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa1j+iniOWZqOaUr+aMgeajgOa1i1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAdGhyb3dzIHtvcGVuQlNFLkJyb3dzZXJOb3RTdXBwb3J0RXJyb3J9IOa1j+iniOWZqOS4jeaUr+aMgeeJueWumua4suafk+aooeW8j+aXtuW8leWPkemUmeivr1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc3VwcG9ydENoZWNrKCkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOyAvL2NhbnZhc+WvueixoVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYW52YXMuZ2V0Q29udGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzJyk7XG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgPT09IG51bGwpIHRocm93IG5ldyBCcm93c2VyTm90U3VwcG9ydEVycm9yKCdDYW52YXMgMkQnKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dC5maWxsVGV4dCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgQnJvd3Nlck5vdFN1cHBvcnRFcnJvcignQ2FudmFzIDJEIGZpbGxUZXh0IEZ1bmN0aW9uJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJmaWxlIjoicmVuZGVyZXJzL3NwZWNpYWxDYW52YXNSZW5kZXJlci5qcyJ9
