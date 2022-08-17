goog.declareModuleId('os.file.BetaToggle');

import {directiveTag} from './betatoggleui.js';
import SettingPlugin from './settingplugin.js';


/**
 */
export default class BetaToggle extends SettingPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();

    this.setLabel('Toggle Beta Features');
    this.setDescription('Toggle on or off beta features.');
    this.setTags(['beta-toggle']);
    this.setIcon('fa fa-sun-o');
    this.setUI(directiveTag);
  }
}
