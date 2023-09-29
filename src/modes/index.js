import * as Constants from '../constants.js';
import patchSimpleSelect from './simple_select.js';
import patchDirectSelect from './direct_select.js';

export function enable(modes, preventFunction = () => true) {
  return {
    ...modes,
    [Constants.modes.SIMPLE_SELECT]: patchSimpleSelect(modes[Constants.modes.SIMPLE_SELECT]),
    [Constants.modes.DIRECT_SELECT]: patchDirectSelect(modes[Constants.modes.DIRECT_SELECT], preventFunction)
  };
}