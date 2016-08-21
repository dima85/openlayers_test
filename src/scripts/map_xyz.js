// http://jsfiddle.net/jonataswalker/6f233kLy/
// http://stackoverflow.com/questions/35928163/openlayers-3-static-tiles-and-xyz-coordinates

var maxZoolLevel = 2;
var sizeX = 4096;
var sizeY = 4096;
var tileSize = 512;
var tilesCountX = sizeX / tileSize;
var drawingFeatures = new ol.Collection();

function initMap() {

  var pixelProj = new ol.proj.Projection({
    code: 'pixel',
    units: 'pixels',
    extent: [0, 0, sizeX, sizeY]
  });

  var projectionExtent = pixelProj.getExtent();

  var maxResolution = ol.extent.getWidth(projectionExtent) / tileSize;
  var resolutions = [];
  for (var z = 0; z <= maxZoolLevel; z++) {
      //resolutions[z] = maxResolution / Math.pow(2, z+1);
      resolutions.push((maxResolution / Math.pow(2, z+1)) ) ;
  }
  console.log(resolutions);
  /*var resolutions = [
    tilesCountX/4,
    tilesCountX/4/2,
    tilesCountX/4/4
  ];*/

  var tileGrid = new ol.tilegrid.TileGrid({
    origin: ol.extent.getTopLeft(projectionExtent),
    resolutions: resolutions,
    tileSize: tileSize
  });

  var url = '/tile/{z}/{x}/{y}';

  // Reverse coordinate
  var source = new ol.source.XYZ({
    projection: pixelProj,
    wrapX: false,
    url: url,
    tileGrid: tileGrid
  });

  // Normal coordinat
  // var source = new ol.source.TileImage({
  //     tileUrlFunction: function(tileCoord, pixelRatio, projection) {
  //         var tileCoordGlobal = tileCoord;

  //         return url
  //             .replace('{z}', (tileCoord[0]).toString())
  //             .replace('{x}', (tileCoord[1]).toString())
  //             .replace('{y}', (((-tileCoord[2])-1)).toString())
  //         ;
  //     },
  //     wrapX: true,
  //     projection: pixelProj,
  //     tileGrid: tileGrid
  // });

  var tileLayer = new ol.layer.Tile({
    source: source,
    extent: projectionExtent
  });

  var view = new ol.View({
    zoom: 0,
    minZoom: 0,
    maxZoom: maxZoolLevel + 2,
    renderer: 'canvas',
    center: [sizeX/2, sizeY/2],
    projection: pixelProj,
    extent: projectionExtent, // restrict image going outside screen
    //resolutions: resolutions // restrict zoomout level

  });

  var map = new ol.Map({
    target: 'map',
    layers: [tileLayer],
    view: view,
    // controls: ol.control.defaults({
    //   attributionOptions:
    //   {
    //     collapsible: false
    //   }
    // })
    // .extend([
    //   //new ol.control.OverviewMap({collapsed: false}),
    //   initOverviewMap(1),
    //   new ol.control.ZoomSlider()
    // ])
  });

  var mousePositionControl = new ol.control.MousePosition({});

  var scaleLineControl = new ol.control.ScaleLine('metric');
  scaleLineControl.setUnits('metric');

  map.addControl(mousePositionControl);
  map.addControl(initOverviewMap(1));
  map.addControl(new ol.control.ZoomSlider());
  map.addControl(scaleLineControl);

  setupDrawing(map, drawingFeatures);
}

function initOverviewMap(maxZoomLevel) {

  var overviewPixelProj = new ol.proj.Projection({
    code: 'pixel',
    units: 'pixels',
    extent: [0, 0, sizeX, sizeY]
  });

  var overviewProjectionExtent = overviewPixelProj.getExtent();

  var overviewMaxResolution = ol.extent.getWidth(overviewProjectionExtent) / tileSize;
  var overviewResolutions = [];
  for (var z = 0; z <= maxZoomLevel; z++) {
      //resolutions[z] = maxResolution / Math.pow(2, z+1);
      overviewResolutions.push((overviewMaxResolution / Math.pow(2, z+1)) ) ;
  }
  console.log(overviewResolutions);
  /*var resolutions = [
    tilesCountX/4,
    tilesCountX/4/2,
    tilesCountX/4/4
  ];*/

  var overviewTileGrid = new ol.tilegrid.TileGrid({
    origin: ol.extent.getTopLeft(overviewProjectionExtent),
    resolutions: overviewResolutions,
    tileSize: tileSize
  });

  var overviewSource = new ol.source.XYZ({
    projection: overviewPixelProj,
    wrapX: false,
    url: '/tile/{z}/{x}/{y}',
    tileGrid: overviewTileGrid
  });

  var overviewTileLayer = new ol.layer.Tile({
    source: overviewSource,
    extent: overviewProjectionExtent
  });

  var overviewMapControl = new ol.control.OverviewMap({
    collapsible: false,
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
      overviewTileLayer
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false
  });
  return overviewMapControl;
}


function setupDrawing(mapArg, features) {

  var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector({features: features}),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  featureOverlay.setMap(mapArg);

  var modify = new ol.interaction.Modify({
    features: features,
    // the SHIFT key must be pressed to delete vertices, so
    // that new vertices can be drawn at the same position
    // of existing vertices
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event);
    }
  });
  mapArg.addInteraction(modify);

  var draw; // global so we can remove it later
  var typeSelect = document.getElementById('type');

  function addInteraction() {
    draw = new ol.interaction.Draw({
      features: features,
      type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
    });
    mapArg.addInteraction(draw);
  }

  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    mapArg.removeInteraction(draw);
    addInteraction();
  };

  addInteraction();
}

function readData(event) {
  event.preventDefault();
  console.log(drawingFeatures);
}
