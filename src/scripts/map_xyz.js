

var sizeX = 4096;
var sizeY = 4096;
var tileSize = 512;
var tilesCountX = sizeX / tileSize;

var pixelProj = new ol.proj.Projection({
  code: 'pixel',
  units: 'pixels',
  extent: [0, 0, sizeX, sizeY]
});

var projectionExtent = pixelProj.getExtent();

var resolutions = [
  tilesCountX/4,
  tilesCountX/4/2,
  tilesCountX/4/4
];

var tileGrid = new ol.tilegrid.TileGrid({
  origin: ol.extent.getTopLeft(projectionExtent),
  resolutions: resolutions,
  tileSize: tileSize
});

var source = new ol.source.XYZ({
  projection: pixelProj,
  wrapX: false,
  url: '/tile/{z}/{x}/{y}',
  tileGrid: tileGrid
});

var layer = new ol.layer.Tile({
  source: source
});

var view = new ol.View({
  zoom: 0,
  center: [sizeX/2, sizeY/2],
  projection: pixelProj
});

var map = new ol.Map({
  target: 'map',
  layers: [layer],
  view: view,
  controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */
    {
      collapsible: false
    }
  })
  .extend([
    new ol.control.OverviewMap({collapsed: false}),
    new ol.control.ZoomSlider()
  ])
});


// var projectionExtent = pixelProj.getExtent();

// var resolutions = [
//   tilesCountX/4,
//   tilesCountX/4/2,
//   tilesCountX/4/4
// ];

// var tileGrid = new ol.tilegrid.TileGrid({
//   origin: ol.extent.getTopLeft(projectionExtent),
//   resolutions: resolutions,
//   tileSize: tileSize
// });


// var tileSource = new ol.source.XYZ({
//   projection: pixelProj,
//   wrapX: false,
//   url: '/tile/{z}/{x}/{y}',
//   tileGrid: tileGrid
// });

// var layer = new ol.layer.Tile({
//   source: tileSource,
//   extent: projectionExtent
// });

// var view = new ol.View({
//   zoom: 0,
//   center: [sizeX/2, sizeY/2],
//   projection: pixelProj,
//   extent: projectionExtent,
//   resolutions: resolutions
// });

// var map = new ol.Map({
//   target: 'map',
//   layers: [layer],
//   view: view,
//   controls: ol.control.defaults({
//     attributionOptions: /** @type {olx.control.AttributionOptions} */
//     {
//       collapsible: false
//     }
//   })
//   .extend([
//     //new ol.control.OverviewMap({collapsed: false}),
//     new ol.control.ZoomSlider()
//   ])
// });

var mousePositionControl = new ol.control.MousePosition({});

map.addControl(mousePositionControl);
