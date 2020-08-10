import { modes as ConstantsModes } from '@mapbox/mapbox-gl-draw/src/constants';
import patchSimpleSelect from './modes/simple_select';
import patchDirectSelect from './modes/direct_select';

export function enable(modes, preventFunction = () => true) {
  return {
    ...modes,
    [ConstantsModes.SIMPLE_SELECT]: patchSimpleSelect(modes[ConstantsModes.SIMPLE_SELECT], preventFunction),
    [ConstantsModes.DIRECT_SELECT]: patchDirectSelect(modes[ConstantsModes.DIRECT_SELECT], preventFunction)
  };
}