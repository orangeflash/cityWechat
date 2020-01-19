import "../lib/geolocation.min.js"
import {showDialog, showText} from "./index";
import {defaultLatLng} from "../project-config/base";

export const cityLocations = function (MapJson) {
  return new Promise(function (resolve, reject) {
    if (!localStorage.mapKey) {
      localStorage.mapKey = MapJson.key || "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77";
    }

    var geolocation = new qq.maps.Geolocation(localStorage.mapKey, "myapp");
    var positionNum = 0;
    var options = {timeout: 10000, debug: false};

    function showPosition(position) {
      // showDialog(position,'position')
      if (position) {
        localStorage.setItem("adcode", JSON.stringify(position.adcode))
      } else {
        return;
      }
      resolve('getSuccess')
    };

    function showErr(err) {
      reject('getFail')
      // showDialog(err,'showErr')
    };
    geolocation.getLocation(showPosition, showErr, options);
  })
}


export function getLocationByTXMap() {

  return new Promise((resolve, reject) => {


    const geolocation = new qq.maps.Geolocation(localStorage.mapKey || "OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "myapp"),
      options = {timeout: 10000, debug: false};

    geolocation.getLocation((position) => {
      // console.log('%c getLocationByTXMap resolve',
      //   'color: white; background-color: #f44444',
      //   position);
      resolve(position)
    }, (error) => {
      resolve({
        ...defaultLatLng,
        lat: defaultLatLng.latitude,
        lng: defaultLatLng.longitude
      })
    }, options)
  })
}
