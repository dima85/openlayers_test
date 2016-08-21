// http://gis.stackexchange.com/questions/159201/how-to-arrange-own-tiles-without-projection-in-openlayers-3

// http://jsfiddle.net/vb53xz20/2/


var tileSize = 512;
var maxZoolLevel = 2;

var minX = 0;
var minY = 0;
var maxX = 2048;
var maxY = 2048;

var projection = new ol.proj.Projection({
    code: 'ZOOMIFY',
    units: 'pixels',
    extent: [minX, minY, maxX, maxY]
});

var projectionExtent = projection.getExtent();

var maxResolution = ol.extent.getWidth(projectionExtent) / tileSize;
var resolutions = [];
for (var z = 0; z <= maxZoolLevel; z++) {
    //resolutions[z] = maxResolution / Math.pow(2, z+1);
    resolutions.push((maxResolution / Math.pow(2, z+1)) ) ;
}
console.log(resolutions);
var urlTemplate = '/tile/{z}/{y}/{x}';

var source = new ol.source.TileImage({
    tileUrlFunction: function(tileCoord, pixelRatio, projection) {
        var tileCoordGlobal = tileCoord;

        return urlTemplate
            .replace('{z}', (tileCoord[0]).toString())
            .replace('{x}', (tileCoord[1]).toString())
            .replace('{y}', (((-tileCoord[2])-1)).toString())
        ;
    },
    wrapX: true,
    projection: projection,
    tileGrid: new ol.tilegrid.TileGrid({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        tileSize: tileSize
    }),
});

tileLayer = new ol.layer.Tile({
    source: source,
    extent: projectionExtent
});

view = new ol.View ({
    projection: projection,
    center: [maxX/2, maxY/2],
    extent: projectionExtent,
    zoom: 0,
    //rotation: Math.PI / 6,
    resolutions: resolutions
});

var overviewMapControl = new ol.control.OverviewMap({
  // see in overviewmap-custom.html to see the custom CSS used
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
    // new ol.layer.Tile({
    //   source: source
    // })
    tileLayer
  ],
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false
});

var scaleLineControl = new ol.control.ScaleLine({units: 'metric'});
scaleLineControl.setUnits('metric');
//map.addControl(new ol.control.ScaleLine({units: 'us'}));

var map = new ol.Map({
    layers: [tileLayer],
    target: 'map',
    view: view,
    controls:
      // ol.control.defaults().extend([
      //   overviewMapControl
      // ])
      ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */
        {
          collapsible: false
        }
      })
      .extend([
        //new ol.control.OverviewMap({collapsed: false}),
        overviewMapControl,
        scaleLineControl,
        new ol.control.ZoomSlider()
      ])

      //ol.control.defaults({
      //  attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      //    collapsible: false
      //  })
      //})
    ,
});

var mousePositionControl = new ol.control.MousePosition({});

map.addControl(mousePositionControl);

var features = new ol.Collection();

setupDrawing(map);


function setupDrawing(mapArg) {

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
  console.log(features);
}


