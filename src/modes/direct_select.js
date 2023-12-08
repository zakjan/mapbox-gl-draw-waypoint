
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '../constants.js';

function patchDirectSelect(DirectSelect, preventFunction = () => true, onPreventDragging = () => undefined) {
  const DirectSelectPatched = { ...DirectSelect };

  DirectSelectPatched.clickInactive = function(state, e) {
    if (e.featureTarget.geometry.type !== Constants.geojsonTypes.POINT) {
      // switch to direct_select mode for polygon/line features
      this.changeMode(Constants.modes.DIRECT_SELECT, {
        featureId: e.featureTarget.properties.id
      });
    } else {
      // switch to simple_select mode for point features
      this.changeMode(Constants.modes.SIMPLE_SELECT, {
        featureIds: [e.featureTarget.properties.id]
      });
    }
  };

  DirectSelectPatched.dragFeature = function(state, e, delta) {
    const geojson = state.feature.toGeoJSON();
    if (preventFunction(geojson, e, delta)) {
      onPreventDragging();
      // prevent dragging polygon/line features
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
    if (preventFunction(geojson, e, delta)) {
      // show pointer cursor on inactive features, move cursor on active feature vertices
      const isFeature = MapboxDraw.lib.CommonSelectors.isInactiveFeature(e);
      const onVertex = MapboxDraw.lib.CommonSelectors.isOfMetaType(Constants.meta.VERTEX)(e);
      const onMidpoint = MapboxDraw.lib.CommonSelectors.isOfMetaType(Constants.meta.MIDPOINT)(e);
      if (isFeature || onMidpoint) this.updateUIClasses({ mouse: Constants.cursors.POINTER });
      else if (onVertex) this.updateUIClasses({ mouse: Constants.cursors.MOVE });
      else this.updateUIClasses({ mouse: Constants.cursors.NONE });
    }

    return result;
  };

  return DirectSelectPatched;
}

export default patchDirectSelect;
