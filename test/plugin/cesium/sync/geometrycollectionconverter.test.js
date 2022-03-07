goog.require('os.layer.Vector');
goog.require('os.map');
goog.require('os.proj');
goog.require('os.webgl.AltitudeMode');
goog.require('plugin.cesium.VectorContext');
goog.require('plugin.cesium.sync.GeometryCollectionConverter');
goog.require('test.plugin.cesium.scene');

describe('plugin.cesium.sync.GeometryCollectionConverter', () => {
  const Feature = require('ol/src/Feature');
  const GeometryCollection = require('ol/src/geom/GeometryCollection');
  const Point = require('ol/src/geom/Point');
  const {fromExtent} = require('ol/src/geom/Polygon');
  const {get} = require('ol/src/proj');
  const Style = require('ol/src/style/Style');

  const {default: VectorLayer} = goog.module.get('os.layer.Vector');
  const osProj = goog.module.get('os.proj');
  const {getFakeScene} = goog.module.get('test.plugin.cesium.scene');
  const {default: VectorContext} = goog.module.get('plugin.cesium.VectorContext');
  const {default: GeometryCollectionConverter} = goog.module.get('plugin.cesium.sync.GeometryCollectionConverter');
  const converter = new GeometryCollectionConverter();

  let feature;
  let geometry;
  let style;
  let layer;
  let scene;
  let context;

  const mockConvert = (feature, geometry) => {
    geometry.processed = true;
  };

  beforeEach(() => {
    geometry = new GeometryCollection();
    feature = new Feature(geometry);
    style = new Style();
    layer = new VectorLayer();
    scene = getFakeScene();
    context = new VectorContext(scene, layer, get(osProj.EPSG4326));
  });

  describe('create', () => {
    it('should not run without a convert function', () => {
      expect(converter.create(feature, geometry, style, context)).toBe(false);
    });

    it('should not run without geometries', () => {
      const result = converter.create(feature, geometry, style, context);
      expect(result).toBe(false);
      expect(geometry.processed).toBe(undefined);
    });

    it('should recursively create geometries', () => {
      const point = new Point([0, 0]);
      const poly = new fromExtent([-5, -5, 5, 5]);
      const geoms = [point, poly];
      geometry.setGeometriesArray(geoms);

      GeometryCollectionConverter.setConvertFunction(mockConvert);

      const result = converter.create(feature, geometry, style, context);
      expect(result).toBe(true);
      expect(point.processed).toBe(true);
      expect(poly.processed).toBe(true);
    });
  });

  describe('update', () => {
    it('should not run without a convert function', () => {
      expect(converter.update(feature, geometry, style, context)).toBe(false);
    });

    it('should recursively update geometries', () => {
      const point = new Point([0, 0]);
      const poly = new fromExtent([-5, -5, 5, 5]);
      const geoms = [point, poly];
      geometry.setGeometriesArray(geoms);
      GeometryCollectionConverter.setConvertFunction(mockConvert);

      const result = converter.update(feature, geometry, style, context);
      expect(result).toBe(true);
      expect(point.processed).toBe(true);
      expect(poly.processed).toBe(true);
    });
  });
});
