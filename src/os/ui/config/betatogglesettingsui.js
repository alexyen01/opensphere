goog.declareModuleId('os.ui.config.BetaToggleSettingsUI');

import AlertEventSeverity from '../../alert/alerteventseverity.js';
import AlertManager from '../../alert/alertmanager.js';
import Settings from '../../config/settings.js';
import {ROOT} from '../../os.js';
import Module from '../module.js';

/**
 * The path to beta features in the settings.json
 * @type string
 */
export const BETA_FEATURES_PATH = 'betaFeatures';

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

    /**
     * Settings instance for this class
     * @type {Settings}
     */
    this.Settings = Settings.getInstance();

    /**
     * Array to hold all beta features
     * @type {Array<betaFeatureValues>}
     */
    this['betaFeatureNames'] = [];
    // iterate through all beta features in the settings.json
    for (const key in this.Settings.get(BETA_FEATURES_PATH)) {
      // get values for the beta feature
      const path = this.Settings.get(BETA_FEATURES_PATH + '.' + key);
      var checkValue = this.Settings.get(path);
      // store all the beta feature values
      const betaFeature = /** @type {betaFeatureValues} */ ({
        'name': key,
        'path': path,
        'checkValue': checkValue
      });
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
    const newValue = !feature.checkValue;

    feature.checkValue = newValue;
    this.Settings.set(feature.path, newValue);
    this.betaToggleAlert(feature);
  }
  /**
   * Alerts that a feature has been turned on or off
   * @param {betaFeatureValues} feature
   * @export
   */
  betaToggleAlert(feature) {
    const enabled = feature.checkValue;
    const message = `Beta feature ${feature.name} is now 
        ${enabled ? 'on' : 'off' }
          , please refresh.`;
    AlertManager.getInstance().sendAlert(message, AlertEventSeverity.INFO);
  }
}

/**
 * Stores the values related to a beta feature
 *  @typedef {{
 *  name: string,
 *  path: string,
 *  checkValue: boolean
 * }}
 */
export let betaFeatureValues;
