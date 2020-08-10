import * as Constants from '../constants';

function patchSimpleSelect(SimpleSelect, preventFunction) {
  const SimpleSelectPatched = { ...SimpleSelect };

  SimpleSelectPatched.clickOnFeature = function(state, e) {
    if (e.featureTarget.geometry.type !== Constants.geojsonTypes.POINT) {
      // switch to direct_select mode for polygons and lines
      this.changeMode(Constants.modes.DIRECT_SELECT, {
        featureId: e.featureTarget.properties.id
      });
    } else {
      // call parent
      SimpleSelect.clickOnFeature.call(this, state, e);

      // prevent multi-selection for consistency with direct_select mode
      this.setSelected(e.featureTarget.properties.id);
    }
  };

  return SimpleSelectPatched;
}

export default patchSimpleSelect;