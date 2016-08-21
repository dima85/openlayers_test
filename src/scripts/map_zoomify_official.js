// http://openlayers.org/en/v3.1.1/examples/zoomify.html

var imgWidth = 4096;
var imgHeight = 4096;
var tileSize = 512;

var url = '/tileZoomify/';
var crossOrigin = 'anonymous';

var imgCenter = [imgWidth / 2, - imgHeight / 2];

// Maps always need a projection, but Zoomify layers are not geo-referenced, and
// are only measured in pixels.  So, we create a fake projection that the map
// can use to properly display the layer.
var proj = new ol.proj.Projection({
  code: 'ZOOMIFY',
  units: 'pixels',
  extent: [0, 0, imgWidth, imgHeight]
});

var source = new ol.source.Zoomify({
  url: url,
  size: [imgWidth, imgHeight],
  crossOrigin: crossOrigin,
  tileSize: tileSize
});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: source
    })
  ],
  constrols: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */
    {
      collapsible: false
    }
  })
  .extend([
    new ol.control.OverviewMap({collapsed: false}),
    new ol.control.ZoomSlider()
  ]),
  //renderer: exampleNS.getRendererFromQueryString(),
  target: 'map',
  view: new ol.View({
    projection: proj,
    center: imgCenter,
    zoom: 0,
    // constrain the center: center cannot be set outside
    // this extent
    extent: [0, -imgHeight, imgWidth, 0]
  })
});
