import { CanvasBaseRenderer } from './canvasBaseRenderer'
import { BrowserNotSupportError } from '../../browserNotSupportError'

/**
 * Canvas 渲染器类
 */
class CanvasRenderer extends CanvasBaseRenderer {
    /**
     * 实例化一个 Canvas 渲染器类
     * @param {object} element - Element 元素
     * @param {openBSE~Options} options - 全局选项
     * @param {object} elementSize - 元素大小
     * @param {Event} eventTrigger - 事件引发方法
     * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
     */
    constructor(element, options, elementSize, eventTrigger) {
        supportCheck(); //浏览器支持检测
        super(element, options, elementSize, eventTrigger);

        /**
         * 屏幕上的弹幕
         * @private @type {LinkedList}
         */
        let _bulletScreensOnScreen = this.getBulletScreensOnScreen();

        let _cleanScreen = this.cleanScreen;
        /**
         * 清除屏幕内容
         * @override
         */
        this.cleanScreen = function () {
            _cleanScreen();
            let canvas = this.getCanvas();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }

        /**
         * 绘制函数
         * @override
         */
        this.draw = function () {
            let canvas = this.getCanvas();
            let devicePixelRatio = this.getDevicePixelRatio();
            //离屏渲染
            let hideCanvas = document.createElement('canvas');
            hideCanvas.width = canvas.width;
            hideCanvas.height = canvas.height;
            let hideCanvasContext = hideCanvas.getContext('2d');
            _bulletScreensOnScreen.forEach((bulletScreenOnScreen) => {
                if (this.checkWhetherHide(bulletScreenOnScreen)) return;
                hideCanvasContext.drawImage(bulletScreenOnScreen.hideCanvas, (bulletScreenOnScreen.x - 4) * devicePixelRatio, (bulletScreenOnScreen.actualY - 4) * devicePixelRatio, (bulletScreenOnScreen.width + 8) * devicePixelRatio, (bulletScreenOnScreen.height + 8) * devicePixelRatio);
            }, true);
            let canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(hideCanvas, 0, 0);
        }

        /**
         * 浏览器支持检测
         * @private
         * @throws {openBSE.BrowserNotSupportError} 浏览器不支持特定渲染模式时引发错误
         */
        function supportCheck() {
            let canvas = document.createElement('canvas'); //canvas对象
            if (typeof canvas.getContext != 'function') throw new BrowserNotSupportError('Canvas');
            let context = canvas.getContext('2d');
            if (context === null) throw new BrowserNotSupportError('Canvas 2D');
            if (typeof context.fillText != 'function') throw new BrowserNotSupportError('Canvas 2D fillText Function');
        }
    }
}

export { CanvasRenderer };