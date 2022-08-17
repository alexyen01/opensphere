goog.declareModuleId('os.file.BetaToggleUI');

import Settings from '../../config/settings.js';
import {ROOT} from '../../os.js';
import Module from '../module.js';



/**
 * The column mapping settings UI directive
 * @return {angular.Directive}
 */
export const directive = () => ({
  restrict: 'E',
  replace: true,
  templateUrl: ROOT + 'views/file/betatoggle.html',
  controller: Controller,
  controllerAs: 'ctrl'
});

/**
 * The element tag for the directive.
 * @type {string}
 */
export const directiveTag = 'betatoggle';


Module.directive(directiveTag, [directive]);


/**
 * Controller for beta features settings.
 * @unrestricted
 */
export class Controller {
  /**
   * Constructor.
   * @param {!angular.Scope} $scope
   * @ngInject
   */
  constructor($scope) {
    /**
     * @type {?angular.Scope}
     * @protected
     */
    this.scope = $scope;
    this.Settings = Settings.getInstance();
    // set up an array to store all beta features
    this['betaFeatureNames'] = [];
    // iterate through all beta features in the settings.json
    for (const key in this.Settings.get('betaFeatures')) {
      // get values for the beta feature
      const path = this.Settings.get('betaFeatures.' + key);
      var checkValue = this.Settings.get(path);
      // store all the beta feature values
      const betaFeature = new betaFeatureValues(key, path, checkValue);
      // store the class that holds those values into the array
      this['betaFeatureNames'].push(betaFeature);
    }
  }

  /**
   * Clean up.
   */
  $onDestroy() {
    this.scope = null;
  }

  /**
   * Toggles a beta feature.
   * @param {betaFeatureValues} feature
   * @export
   */
  toggle(feature) {
    // check the current setting then set the opposite of it
    if (feature.checkValue == true) {
      feature.checkValue = false;
      this.Settings.set(feature.path, false);
    } else {
      feature.checkValue = true;
      this.Settings.set(feature.path, true);
    }
  }
}

/**
 * Class for storing values related to a beta feature
 */
class betaFeatureValues {
  /**
   * Constructor
   * @param {string} name
   * @param {string} path
   * @param {boolean} checkValue
   */
  constructor(name, path, checkValue) {
    this.name = name;
    this.path = path;
    this.checkValue = checkValue;
  }
}
