// http://stackoverflow.com/questions/20222885/custom-tiles-in-local-crs-without-projection
var mapEdge = 1024;
var tileSize = 512;
var projection = new ol.proj.Projection({
    code: 'ZOOMIFY',
    units: 'pixels',
    extent: [0, 0, mapEdge, mapEdge]
});
var projectionExtent = projection.getExtent();

var maxResolution = ol.extent.getWidth(projectionExtent) / tileSize;
var resolutions = [];
for (var z = 2; z <= 4; z++) {
    resolutions[z] = maxResolution / Math.pow(2, z);
}

var map = new ol.Map({
    target: 'map',
    layers: [new ol.layer.Tile({
        source: new ol.source.TileImage({
            tileUrlFunction: function(tileCoord, pixelRatio, projection) {
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = -tileCoord[2] - 1;
                return '/tile/' + z + '/' + x + '/' + y;
            },
            projection: projection,
            tileGrid: new ol.tilegrid.TileGrid({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                tileSize: tileSize
            }),
        }),
        extent: projectionExtent
    })],
    view: new ol.View({
        projection: projection,
        center: [mapEdge / 2, mapEdge / 2],
        zoom: 2,
        minZoom: 2,
        maxZoom: 4,
        extent: projectionExtent
    })
});
