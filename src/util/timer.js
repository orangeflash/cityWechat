"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTimer = /** @class */ (function () {
    function BaseTimer(initCount, callback, timeout) {
        if (timeout === void 0) { timeout = 1000; }
        this.count = 0;
        this.count = initCount;
        this.TIMER_ID = this.run(callback, timeout);
    }
    BaseTimer.prototype.clearTimer = function () {
        clearInterval(this.TIMER_ID);
    };
    BaseTimer.prototype.run = function (callback, timeout) {
        var _this = this;
        return setInterval(function () {
            _this.count--;
            callback(_this);
            if (_this.count === 0) {
                _this.clearTimer();
            }
        }, timeout);
    };
    return BaseTimer;
}());
exports.BaseTimer = BaseTimer;
//默认验证码倒计时
exports.DEFAULT_VERIFICATION_TIME_OUT = 60;
