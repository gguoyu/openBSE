/**
 * 弹幕类型枚举
 * @alias openBSE.BulletScreenType
 * @readonly
 * @enum {number}
 */
const BulletScreenType = {
    /** 
     * 从右到左弹幕
     * @readonly
     */
    rightToLeft: 1,
    /** 
     * 从左到右弹幕（逆向弹幕）
     * @readonly
     */
    leftToRight: 2,
    /** 
     * 顶部弹幕
     * @readonly
     */
    top: 4,
    /** 
     * 底部弹幕
     * @readonly
     */
    bottom: 8
}

export { BulletScreenType }