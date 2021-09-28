goog.declareModuleId('os.command.VectorLayerBearingError');

import {Layer as LayerKeys} from '../metrics/metricskeys.js';
import * as osStyle from '../style/style.js';
import StyleField from '../style/stylefield.js';
import StyleManager from '../style/stylemanager_shim.js';
import AbstractVectorLayerLOB from './abstractvectorlayerlob.js';


/**
 * Changes the lob length
 *
 * @extends {AbstractVectorLayerLOB<number>}
 */
export default class VectorLayerBearingError extends AbstractVectorLayerLOB {
  /**
   * Constructor.
   * @param {string} layerId
   * @param {number} value
   * @param {number=} opt_oldValue
   */
  constructor(layerId, value, opt_oldValue) {
    super(layerId, value, opt_oldValue);
    this.title = 'Change Line of Bearing error multiplier';
    this.value = value;
    this.metricKey = LayerKeys.VECTOR_LOB_BEARING_ERROR;
  }

  /**
   * @inheritDoc
   */
  getOldValue() {
    var config = StyleManager.getInstance().getLayerConfig(this.layerId);
    return config ? config[StyleField.LOB_BEARING_ERROR] : osStyle.DEFAULT_LOB_BEARING_ERROR;
  }

  /**
   * @inheritDoc
   */
  applyValue(config, value) {
    config[StyleField.LOB_BEARING_ERROR] = value;
    super.applyValue(config, value);
  }
}
