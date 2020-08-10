
import { isOfMetaType } from '@mapbox/mapbox-gl-draw/src/lib/common_selectors';
import * as Constants from '../constants';

function patchDirectSelect(DirectSelect, preventFunction = () => true) {
  const DirectSelectPatched = { ...DirectSelect };

  DirectSelectPatched.dragFeature = function(state, e, delta) {
    const geojson = state.feature.toGeoJSON();
    if (preventFunction(geojson)) {
      // prevent dragging features for polygons and lines
      // noop
    } else {
      // call parent
      DirectSelect.dragFeature.call(this, state, e, delta);
    }
  };

  DirectSelectPatched.onMouseMove = function(state, e) {
    // call parent
    const result = DirectSelect.onMouseMove.call(this, state, e);

    const geojson = state.feature.toGeoJSON();
    if (preventFunction(geojson)) {
      // prevent move cursor on features for polygons and lines
      const onVertex = isOfMetaType(Constants.meta.VERTEX)(e);
      if (onVertex) this.updateUIClasses({ mouse: Constants.cursors.MOVE });
      else this.updateUIClasses({ mouse: Constants.cursors.NONE });
    }

    return result;
  };

  return DirectSelectPatched;
}

export default patchDirectSelect;