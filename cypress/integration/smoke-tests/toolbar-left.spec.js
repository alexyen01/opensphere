/// <reference types="Cypress" />
var os = require('../../support/selectors.js');

describe('Toolbar left', function() {
  before('Login', function() {
    cy.login();
  });

  describe('Add data buttons', function() {
    it('Add data dialog (via button)', function() {
      // Setup
      cy.get(os.addDataDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.BUTTON).click();
      cy.get(os.addDataDialog.DIALOG).should('be.visible');
      cy.get(os.addDataDialog.DIALOG_HEADER).should('contain', 'Add Data');

      // Clean up
      cy.get(os.addDataDialog.DIALOG_CLOSE).click();
      cy.get(os.addDataDialog.DIALOG).should('not.exist');
    });

    it('Import file (via button)', function() {
      // Setup
      cy.get(os.importDataDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.OPEN_FILE_BUTTON).click();
      cy.get(os.importDataDialog.DIALOG).should('be.visible');
      cy.get(os.importDataDialog.DIALOG_HEADER).should('contain', 'Import Data');

      // Clean up
      cy.get(os.importDataDialog.DIALOG_CLOSE).click();
      cy.get(os.importDataDialog.DIALOG).should('not.exist');
    });
  });

  describe('Add data dropdown', function() {
    it('Menu options', function() {
      // Setup
      cy.get(os.Toolbar.addData.Dropdown.MENU).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.MENU).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.ADD_DATA).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.OPEN_FILE_OR_URL).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.ADD_CESIUM_ION_ASSET).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.RECENT_WORLD_IMAGERY).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.RECENT_STREET_MAP).should('be.visible');

      // Clean up
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.MENU).should('not.exist');
    });

    it('Add data dialog (via dropdown)', function() {
      // Setup
      cy.get(os.addDataDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.ADD_DATA).click();
      cy.get(os.addDataDialog.DIALOG).should('be.visible');

      // Clean up
      cy.get(os.addDataDialog.CLOSE_BUTTON).click();
      cy.get(os.addDataDialog.DIALOG).should('not.exist');
    });

    it('Import file (via dropdown)', function() {
      // Setup
      cy.get(os.importDataDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.OPEN_FILE_OR_URL).click();
      cy.get(os.importDataDialog.DIALOG).should('be.visible');

      // Clean up
      cy.get(os.importDataDialog.CANCEL_BUTTON).click();
      cy.get(os.importDataDialog.DIALOG).should('not.exist');
    });

    it('Cesium ion asset', function() {
      // Setup
      cy.get(os.importCesiumIonAssetDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.ADD_CESIUM_ION_ASSET).click();
      cy.get(os.importCesiumIonAssetDialog.DIALOG).should('be.visible');

      // Clean up
      cy.get(os.importCesiumIonAssetDialog.CANCEL_BUTTON).click();
      cy.get(os.importCesiumIonAssetDialog.DIALOG).should('not.exist');
    });

    it('Recently used layers', function() {
      // Setup
      cy.get(os.layersDialog.DIALOG).should('be.visible');
      cy.get(os.layersDialog.ACTIVE_TAB).should('contain', 'Layers');
      cy.get(os.layersDialog.Layers.Tree.STREET_MAP_TILES).should('be.visible');
      cy.get(os.layersDialog.Layers.Tree.WORLD_IMAGERY_TILES).should('be.visible');
      cy.get(os.layersDialog.Layers.Tree.STREET_MAP_TILES)
          .find(os.layersDialog.Layers.Tree.LAYER_TOGGLE)
          .should('have.class', os.layersDialog.Layers.Tree.LAYER_IS_ACTIVE);
      cy.get(os.layersDialog.Layers.Tree.WORLD_IMAGERY_TILES)
          .find(os.layersDialog.Layers.Tree.LAYER_TOGGLE)
          .should('have.class', os.layersDialog.Layers.Tree.LAYER_IS_ACTIVE);

      // Test
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.RECENT_STREET_MAP).click();
      cy.get(os.layersDialog.Layers.Tree.STREET_MAP_TILES).should('not.exist');
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.RECENT_WORLD_IMAGERY).click();
      cy.get(os.layersDialog.Layers.Tree.WORLD_IMAGERY_TILES).should('not.exist');

      // Clean up
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.RECENT_STREET_MAP).click();
      cy.get(os.layersDialog.Layers.Tree.STREET_MAP_TILES).should('be.visible');
      cy.get(os.Toolbar.addData.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.addData.Dropdown.RECENT_WORLD_IMAGERY).click();
      cy.get(os.layersDialog.Layers.Tree.WORLD_IMAGERY_TILES).should('be.visible');
      cy.get(os.layersDialog.Layers.Tree.STREET_MAP_TILES)
          .find(os.layersDialog.Layers.Tree.LAYER_TOGGLE)
          .should('have.class', os.layersDialog.Layers.Tree.LAYER_IS_ACTIVE);
      cy.get(os.layersDialog.Layers.Tree.WORLD_IMAGERY_TILES)
          .find(os.layersDialog.Layers.Tree.LAYER_TOGGLE)
          .should('have.class', os.layersDialog.Layers.Tree.LAYER_IS_ACTIVE);
    });
  });

  it('Layers button', function() {
    // Setup
    cy.get(os.layersDialog.DIALOG).should('be.visible');

    // Test
    cy.get(os.layersDialog.DIALOG_CLOSE).click();
    cy.get(os.layersDialog.DIALOG).should('not.exist');
    cy.get(os.Toolbar.LAYERS_BUTTON).click();
    cy.get(os.layersDialog.DIALOG).should('be.visible');

    // Clean up
    // none - not needed
  });

  it('Drawing tool', function() {
    // Setup
    cy.get(os.Application.PAGE).type('+++++++++++++++++++++++++'); // zoom in
    cy.get(os.Toolbar.Drawing.BUTTON)
        .should('not.have.class', os.Toolbar.Drawing.BUTTON_IS_ACTIVE);

    // Test
    cy.get(os.Toolbar.Drawing.BUTTON).click();
    cy.get(os.Toolbar.Drawing.BUTTON).should('have.class', os.Toolbar.Drawing.BUTTON_IS_ACTIVE);

    // TODO: The rest of this test needs to be completed.
    // There were problems getting the map to respond to mouse inputs.
    // https://github.com/cypress-io/cypress/issues/2768

    // draw an area
    // drawing tool context menu appears
    // query the area
    // an area was created

    // Clean up
    cy.get(os.Toolbar.Drawing.BUTTON).click();
    cy.get(os.Toolbar.Drawing.BUTTON)
        .should('not.have.class', os.Toolbar.Drawing.BUTTON_IS_ACTIVE);
  });

  describe('Drawing tool menu', function() {
    it('Menu options', function() {
      // Setup
      cy.get(os.Toolbar.Drawing.Dropdown.MENU).should('not.exist');

      // Test
      cy.get(os.Toolbar.Drawing.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.Drawing.Dropdown.MENU).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.BOX).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.CIRCLE).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.POLYGON).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.LINE).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.CHOOSE_AREA).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.ENTER_COORDINATES).should('be.visible');
      cy.get(os.Toolbar.Drawing.Dropdown.WHOLE_WORLD).should('be.visible');

      // Clean up
      cy.get(os.Toolbar.Drawing.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.Drawing.Dropdown.MENU).should('not.exist');
    });

    it('Choose area', function() {
      // Setup
      cy.get(os.chooseAreaDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.Drawing.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.Drawing.Dropdown.CHOOSE_AREA).click();
      cy.get(os.chooseAreaDialog.DIALOG).should('be.visible');

      // Clean up
      cy.get(os.chooseAreaDialog.CANCEL_BUTTON).click();
      cy.get(os.chooseAreaDialog.DIALOG).should('not.exist');
    });

    it('Enter coordinates', function() {
      // Setup
      cy.get(os.enterAreaCoordinatesDialog.DIALOG).should('not.exist');

      // Test
      cy.get(os.Toolbar.Drawing.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.Drawing.Dropdown.ENTER_COORDINATES).click();
      cy.get(os.enterAreaCoordinatesDialog.DIALOG).should('be.visible');

      // Clean up
      cy.get(os.enterAreaCoordinatesDialog.DIALOG_CLOSE).click();
      cy.get(os.enterAreaCoordinatesDialog.DIALOG).should('not.exist');
    });

    it('Whole world query', function() {
      // Setup
      cy.get(os.layersDialog.DIALOG).should('be.visible');
      cy.get(os.layersDialog.AREAS_TAB).click();
      cy.get(os.layersDialog.ACTIVE_TAB).should('contain', 'Areas');
      cy.get(os.layersDialog.Areas.Tree.WHOLE_WORLD_AREA).should('not.exist');

      // Test
      cy.get(os.Toolbar.Drawing.Dropdown.BUTTON).click();
      cy.get(os.Toolbar.Drawing.Dropdown.WHOLE_WORLD).click();
      cy.get(os.layersDialog.Areas.Tree.WHOLE_WORLD_AREA).should('be.visible');

      // Clean up
      cy.get(os.layersDialog.Areas.Tree.WHOLE_WORLD_AREA).click();
      cy.get(os.layersDialog.Areas.Tree.WHOLE_WORLD_AREA)
          .find(os.layersDialog.Areas.Tree.REMOVE_AREA).click();
      cy.get(os.layersDialog.Areas.Tree.WHOLE_WORLD_AREA).should('not.exist');
      cy.get(os.layersDialog.LAYERS_TAB).click();
      cy.get(os.layersDialog.ACTIVE_TAB).should('contain', 'Layers');
    });
  });

  it('Measure tool', function() {
    // Setup
    cy.get(os.Toolbar.Measure.BUTTON)
        .should('not.have.class', os.Toolbar.Measure.BUTTON_IS_ACTIVE);

    // Test
    cy.get(os.Toolbar.Measure.BUTTON).click();
    cy.get(os.Toolbar.Measure.BUTTON).should('have.class', os.Toolbar.Measure.BUTTON_IS_ACTIVE);

    // TODO: The rest of this test needs to be completed.
    // There were problems getting the map to respond to mouse inputs.
    // https://github.com/cypress-io/cypress/issues/2768

    // click a point
    // move the mouse
    // click another point
    // measurement was taken

    // Clean up
    cy.get(os.Toolbar.Measure.BUTTON).click();
    cy.get(os.Toolbar.Measure.BUTTON)
        .should('not.have.class', os.Toolbar.Measure.BUTTON_IS_ACTIVE);
  });

  it('Interpolation', function() {
    // Setup
    cy.get(os.Toolbar.Measure.Dropdown.MENU).should('not.exist');

    // Test
    cy.get(os.Toolbar.Measure.Dropdown.BUTTON).click();
    cy.get(os.Toolbar.Measure.Dropdown.MENU).should('be.visible');
    cy.get(os.Toolbar.Measure.Dropdown.MEASURE_GEODESIC).should('be.visible');
    cy.get(os.Toolbar.Measure.Dropdown.MEASURE_RHUMB_LINE).should('be.visible');

    // Clean up
    cy.get(os.Toolbar.Measure.Dropdown.BUTTON).click();
    cy.get(os.Toolbar.Measure.Dropdown.MENU).should('not.exist');
  });

  it('Clear', function() {
    // Setup
    cy.get(os.clearDialog.DIALOG).should('not.exist');

    // Test
    cy.get(os.Toolbar.CLEAR_BUTTON).click();
    cy.get(os.clearDialog.DIALOG).should('be.visible');
    cy.get(os.clearDialog.List.ALL).should('be.visible');
    cy.get(os.clearDialog.List.STATES).should('be.visible');
    cy.get(os.clearDialog.OK_BUTTON).should('be.visible');
    cy.get(os.clearDialog.CANCEL_BUTTON).should('be.visible');

    // Clean up
    cy.get(os.clearDialog.CANCEL_BUTTON).click();
    cy.get(os.clearDialog.DIALOG).should('not.exist');
  });
});
