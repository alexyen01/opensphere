goog.provide('plugin.cesium.tiles.Layer');

goog.require('os.config.DisplaySetting');
goog.require('os.events.PropertyChangeEvent');
goog.require('os.layer.PropertyChange');
goog.require('plugin.cesium');
goog.require('plugin.cesium.PrimitiveLayer');
goog.require('plugin.cesium.tiles.cesium3DTileLayerUIDirective');

/**
 * @extends {plugin.cesium.PrimitiveLayer}
 * @constructor
 */
plugin.cesium.tiles.Layer = function() {
  plugin.cesium.tiles.Layer.base(this, 'constructor');

  /**
   * Cesium Ion asset id.
   * @type {number}
   * @protected
   */
  this.assetId = NaN;

  /**
   * Cesium Ion access token.
   * @type {string}
   * @protected
   */
  this.accessToken = '';

  /**
   * Error message for access token issues
   * @type {string}
   * @private
   */
  this.tokenError_ = '';

  /**
   * @type {Cesium.Resource|Object|string}
   * @protected
   */
  this.tileStyle = null;

  /**
   * @type {string}
   * @protected
   */
  this.url = '';

  this.setOSType(plugin.cesium.CESIUM_ONLY_LAYER);
  this.setIcons(plugin.cesium.tiles.ICON);
  this.setExplicitType(plugin.cesium.tiles.TYPE);
  this.setLayerUI('cesium3dtilelayerui');
};
goog.inherits(plugin.cesium.tiles.Layer, plugin.cesium.PrimitiveLayer);


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.removePrimitive = function() {
  var tileset = /** @type {Cesium.Cesium3DTileset} */ (this.getPrimitive());

  if (tileset) {
    tileset.loadProgress.removeEventListener(this.onTileProgress, this);
  }

  plugin.cesium.tiles.Layer.base(this, 'removePrimitive');
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.synchronize = function() {
  plugin.cesium.tiles.Layer.base(this, 'synchronize');

  if (!this.hasError()) {
    var tilesetUrl = '';
    if (!isNaN(this.assetId) && this.accessToken) {
      tilesetUrl = Cesium.IonResource.fromAssetId(this.assetId, {
        accessToken: this.accessToken
      }).then(() => {
        // We don't care to note that it resolves, we just want a response if it doesn't
      }, () => {
        // Clear the saved access token because it was rejected
        const layerId = this.getId();
        os.settings.set(`plugin.cesium.SettingsKey.ACCESS_TOKEN.${layerId}`, '');

        var errorMsg = 'The provided access token was rejected. ' +
        'Turn the layer off and back on to provide another access token.';
        this.setTokenError_(errorMsg);
        this.updateError();
        this.getIcons();
      });
    } else {
      tilesetUrl = this.url;
    }

    if (tilesetUrl) {
      var tileset = new Cesium.Cesium3DTileset({
        url: tilesetUrl
      });

      if (this.tileStyle != null) {
        tileset.style = new Cesium.Cesium3DTileStyle(this.tileStyle);
      } else {
        tileset.style = new Cesium.Cesium3DTileStyle({
          'color': {
            'evaluateColor': this.getFeatureColor.bind(this)
          }
        });
      }

      this.setPrimitive(tileset);
      tileset.loadProgress.addEventListener(this.onTileProgress, this);
    }
  }
};


/**
 * Get the color for a 3D tile feature.
 *
 * @param {Cesium.Cesium3DTileFeature} feature The feature.
 * @param {Cesium.Color} result The object to store the result.
 * @return {Cesium.Color} The color.
 */
plugin.cesium.tiles.Layer.prototype.getFeatureColor = function(feature, result) {
  var cssColor = this.getColor() || os.style.DEFAULT_LAYER_COLOR;
  var cesiumColor = Cesium.Color.fromCssColorString(cssColor, result);
  cesiumColor.alpha = this.getOpacity();

  return cesiumColor;
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.setColor = function(value) {
  plugin.cesium.tiles.Layer.base(this, 'setColor', value);

  var tileset = /** @type {Cesium.Cesium3DTileset} */ (this.getPrimitive());
  if (tileset) {
    tileset.makeStyleDirty();
    os.dispatcher.dispatchEvent(os.MapEvent.GL_REPAINT);
  }
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.setOpacity = function(value) {
  plugin.cesium.tiles.Layer.base(this, 'setOpacity', value);

  var tileset = /** @type {Cesium.Cesium3DTileset} */ (this.getPrimitive());
  if (tileset) {
    tileset.makeStyleDirty();
    os.dispatcher.dispatchEvent(os.MapEvent.GL_REPAINT);
  }
};

/**
 * @param {string} errorMsg The message of the error
 * @protected
 */
plugin.cesium.tiles.Layer.prototype.setTokenError_ = function(errorMsg) {
  this.tokenError_ = errorMsg;
};


/**
 * @param {number} pendingRequests The number of pending requests
 * @param {number} tilesProcessing The number of tiles currently being processed
 * @protected
 */
plugin.cesium.tiles.Layer.prototype.onTileProgress = function(pendingRequests, tilesProcessing) {
  this.setLoading(pendingRequests > 0);
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.restore = function(config) {
  plugin.cesium.tiles.Layer.base(this, 'restore', config);

  const layerId = this.getId();
  const accessToken = os.settings.get(`plugin.cesium.SettingsKey.ACCESS_TOKEN.${layerId}`);

  if (typeof config['assetId'] == 'number') {
    this.assetId = /** @type {number} */ (config['assetId']);
  }

  if (config['accessToken']) {
    this.accessToken = /** @type {string} */ (config['accessToken']);
  } else {
    this.accessToken = /** @type {string} */ (accessToken);
  }

  if (config['tileStyle']) {
    this.tileStyle = /** @type {Object|string} */ (config['tileStyle']);
  }

  if (config['url']) {
    this.url = /** @type {string} */ (config['url']);
  }

  this.synchronize();

  // Save the current layer so that we can run synchronize() on it asynchronously
  const layerRef = this;
  if (!this.accessToken) {
    os.ui.window.launchConfirmText(/** @type {!osx.window.ConfirmTextOptions} */ ({
      confirm: function(accessTokenInput) {
        os.settings.set(`plugin.cesium.SettingsKey.ACCESS_TOKEN.${layerId}`, accessTokenInput);
        layerRef.accessToken = accessTokenInput;
        layerRef.synchronize();
      },
      cancel: function() {
        var errorMsg = 'An access token is required to enable this layer, but one was not provided.';
        layerRef.setTokenError_(errorMsg);
        layerRef.updateError();
        layerRef.getIcons();
      },
      defaultValue: '',
      select: true,
      prompt: 'Please provide an access token. If you do not have an access token, create an account at https://cesium.com/ion/. Once you log in, click on Access Tokens > Default Token. Copy the token and paste it below:',
      windowOptions: /** @type {!osx.window.WindowOptions} */ ({
        label: 'Access Token',
        modal: true
      })
    }));
  }
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.getErrorMessage = function() {
  var error = plugin.cesium.tiles.Layer.base(this, 'getErrorMessage');
  if (!error) {
    error = this.tokenError_;
  }

  return error;
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.getExtent = function() {
  var tileset = /** @type {Cesium.Cesium3DTileset} */ (this.primitive);
  if (tileset && tileset.root && tileset.root.contentBoundingVolume) {
    var extent = plugin.cesium.rectangleToExtent(tileset.root.contentBoundingVolume.rectangle);
    if (extent) {
      return ol.proj.transformExtent(extent, os.proj.EPSG4326, os.map.PROJECTION);
    }
  }

  return plugin.cesium.tiles.Layer.base(this, 'getExtent');
};


/**
 * @inheritDoc
 */
plugin.cesium.tiles.Layer.prototype.supportsAction = function(type, opt_actionArgs) {
  if (os.action) {
    switch (type) {
      case os.action.EventType.GOTO:
        return this.getExtent() != null;
      default:
        break;
    }
  }
  return plugin.cesium.tiles.Layer.base(this, 'supportsAction', type, opt_actionArgs);
};
