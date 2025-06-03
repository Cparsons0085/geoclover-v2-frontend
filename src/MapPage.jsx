import React, { useEffect, useRef } from "react";
import Header from "./Header";

function MapPage() {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;
    let hoverHighlight;
    let clickHighlight;

    import("@arcgis/core/views/MapView").then(({ default: MapView }) => {
      import("@arcgis/core/WebMap").then(({ default: WebMap }) => {
        const webmap = new WebMap({
          portalItem: {
            id: "15d03b522d84442686b21e18e7c71c1d",
          },
        });

        view = new MapView({
          container: mapRef.current,
          map: webmap,
          highlightOptions: {
            color: [255, 255, 255],
            haloOpacity: 1,
            fillOpacity: 0.1,
          },
        });

        view.when(() => {
          const pinLayer = webmap.layers.find(
            (layer) => layer.title === "GeoCloverPins_4view"
          );

          view.on("pointer-move", (event) => {
            view.hitTest(event).then((response) => {
              const results = response.results.filter(
                (result) => result.graphic.layer === pinLayer
              );

              if (hoverHighlight) {
                hoverHighlight.remove();
                hoverHighlight = null;
              }

              if (results.length > 0) {
                hoverHighlight = pinLayer.highlight(
                  results.map((r) => r.graphic)
                );
              }
            });
          });

          view.on("click", (event) => {
            view.hitTest(event).then((response) => {
              const results = response.results.filter(
                (result) => result.graphic.layer === pinLayer
              );

              if (clickHighlight) {
                clickHighlight.remove();
                clickHighlight = null;
              }

              if (results.length > 0) {
                clickHighlight = pinLayer.highlight(
                  results.map((r) => r.graphic)
                );
              }
            });
          });
        });
      });
    });

    return () => {
      if (view) {
        view.destroy();
        view = null;
      }
    };
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          height: "90vh",
          width: "100%",
        }}
        ref={mapRef}
      ></div>
    </>
  );
}

export default MapPage;
