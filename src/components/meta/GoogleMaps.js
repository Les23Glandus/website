import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
    lat: 48.84572535130427,
    lng: 2.594608950818975
};

function GoogleMaps(props) {

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    //const bounds = new window.google.maps.LatLngBounds();
    //map.fitBounds(bounds);
    setMap(map);
    var bounds = new window.google.maps.LatLngBounds();
    const geocoder = new window.google.maps.Geocoder();
    
    props.address.forEach(info => {
        geocoder.geocode({ address: info.address }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
                //const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                let image = null;
                if( info.icone ) {
                    image = {
                        url:info.icone,
                        // This marker is 20 pixels wide by 32 pixels high.
                        size: new window.google.maps.Size(40, 40),
                        // The origin for this image is (0, 0).
                        origin: new window.google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at (0, 32).
                        anchor: new window.google.maps.Point(20, 20),
                      };
                }
                let marker = new window.google.maps.Marker({
                    map: map,
                    title: info.name,
                    //label: info.name,
                    //icon: image,
                    html: `<div style='bacground:red'>Test</div>`,
                    position: results[0].geometry.location
                });
                const infowindow = new window.google.maps.InfoWindow({
                    content: `<h3 style='color:black'>${info.name}</h3>`,
                  });
                marker.addListener("click", () => {
                    infowindow.open(map, marker);
                  });
                
                if( props.address.length >= 2 ) {
                    bounds.extend(marker.position);
                    map.fitBounds(bounds);
                } else {
                    map.setCenter(marker.getPosition());  
                }

                setMap(map);
            }
        });
    });
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDRMkMjhI1GHn-v-e6Y6oB8u6VezAaooTU"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(GoogleMaps)

