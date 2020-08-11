import * as Constants from '../constants';
import patchSimpleSelect from './simple_select';
import patchDirectSelect from './direct_select';

export function enable(modes, preventFunction = () => true) {
  return {
    ...modes,
    [Constants.modes.SIMPLE_SELECT]: patchSimpleSelect(modes[Constants.modes.SIMPLE_SELECT], preventFunction),
    [Constants.modes.DIRECT_SELECT]: patchDirectSelect(modes[Constants.modes.DIRECT_SELECT])
  };
}