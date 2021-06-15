goog.module('os.webgl.AbstractWebGLSynchronizer');
goog.module.declareLegacyNamespace();

const Disposable = goog.require('goog.Disposable');
const fn = goog.require('os.fn');


/**
 * Abstract class to synchronize an OpenLayers layer to a WebGL renderer.
 *
 * @abstract
 * @template T
 */
class AbstractWebGLSynchronizer extends Disposable {
  /**
   * Constructor.
   * @param {!T} layer The OpenLayers layer.
   * @param {!ol.PluggableMap} map The OpenLayers map.
   */
  constructor(layer, map) {
    super();

    /**
     * If the synchronizer is active (WebGL enabled).
     * @type {boolean}
     * @protected
     */
    this.active = false;

    /**
     * The OpenLayers layer.
     * @type {T}
     * @protected
     */
    this.layer = layer;

    /**
     * The OpenLayers map.
     * @type {!ol.PluggableMap}
     * @protected
     */
    this.map = map;

    /**
     * The OpenLayers view.
     * @type {ol.View}
     * @protected
     */
    this.view = map.getView();

    /**
     * The timeline controller instance.
     * @type {os.time.TimelineController}
     * @protected
     */
    this.tlc = os.time.TimelineController.getInstance();
  }

  /**
   * Performs complete synchronization of the layer.
   *
   * @abstract
   */
  synchronize() {}

  /**
   * Resets the synchronizer to a clean state.
   *
   * @abstract
   */
  reset() {}

  /**
   * Set if the synchronizer should be actively used.
   *
   * @param {boolean} value If the synchronizer is active.
   */
  setActive(value) {
    this.active = value;
  }

  /**
   * Repositions all layers, starting from the provided position.
   *
   * @param {number} start The start index in the layers array.
   * @param {number} end The last index in the layers array.
   * @return {number} The next available index in the layers array.
   */
  reposition(start, end) {
    return ++start;
  }
}


/**
 * Called after the WebGL camera finishes changing. Useful for synchronizers that need to perform actions once the
 * camera move is done and the render is finished.
 */
AbstractWebGLSynchronizer.prototype.updateFromCamera = fn.noop;
exports = AbstractWebGLSynchronizer;
