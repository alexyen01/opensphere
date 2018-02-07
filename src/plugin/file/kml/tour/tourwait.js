goog.provide('plugin.file.kml.tour.Wait');

goog.require('goog.Promise');
goog.require('plugin.file.kml.tour.ITourPrimitive');


/**
 * Holds the camera still for a specified amount of time.
 * @param {number} duration How long to wait, in milliseconds.
 * @implements {plugin.file.kml.tour.ITourPrimitive}
 * @constructor
 */
plugin.file.kml.tour.Wait = function(duration) {
  /**
   * The wait duration, in milliseconds.
   * @type {number}
   * @private
   */
  this.duration_ = Math.max(duration, 0);

  /**
   * Remaining duration on the wait.
   * @type {number|undefined}
   * @private
   */
  this.remaining_ = undefined;

  /**
   * The last time the wait was started.
   * @type {number}
   * @private
   */
  this.start_ = 0;

  /**
   * The active timeout id.
   * @type {number|undefined}
   * @private
   */
  this.timeoutId_ = undefined;
};


/**
 * @inheritDoc
 */
plugin.file.kml.tour.Wait.prototype.execute = function() {
  return new goog.Promise(function(resolve, reject) {
    var interval = this.getInterval();
    if (interval > 0) {
      this.timeoutId_ = setTimeout(this.onComplete.bind(this, resolve), interval);
      this.start_ = Date.now();
    } else {
      this.onComplete(resolve);
    }
  }, this);
};


/**
 * @inheritDoc
 */
plugin.file.kml.tour.Wait.prototype.pause = function() {
  if (this.timeoutId_ !== undefined) {
    // cancel the timeout
    clearTimeout(this.timeoutId_);
    this.timeoutId_ = undefined;

    // save how much time is remaining to wait for the next execute call
    var elapsed = Date.now() - this.start_;
    var interval = this.getInterval();
    this.remaining_ = Math.max(interval - elapsed, 0);
  }
};


/**
 * @inheritDoc
 */
plugin.file.kml.tour.Wait.prototype.reset = function() {
  // cancel the timeout (no-op if already completed)
  if (this.timeoutId_ !== undefined) {
    clearTimeout(this.timeoutId_);
    this.timeoutId_ = undefined;
  }

  // reset the wait status
  this.remaining_ = undefined;
  this.start_ = 0;
};


/**
 * Get the remaining time on the wait operation.
 * @return {number} The remaining wait interval, in milliseconds.
 * @protected
 */
plugin.file.kml.tour.Wait.prototype.getInterval = function() {
  return this.remaining_ !== undefined ? this.remaining_ : this.duration_;
};


/**
 * If the wait is currently active.
 * @return {boolean}
 * @protected
 */
plugin.file.kml.tour.Wait.prototype.isTimeoutActive = function() {
  return this.timeoutId_ !== undefined;
};


/**
 * Handle wait completion.
 * @param {function()} resolve The promise resolve function to call when done.
 * @protected
 */
plugin.file.kml.tour.Wait.prototype.onComplete = function(resolve) {
  // reset everything and resolve the promise
  this.reset();
  resolve();
};
