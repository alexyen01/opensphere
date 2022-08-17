goog.declareModuleId('os.ui.config.BetaToggleSettings');

import {directiveTag} from './betatogglesettingsui.js';
import SettingPlugin from './settingplugin.js';


/**
 */
export default class BetaToggleSettings extends SettingPlugin {
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
