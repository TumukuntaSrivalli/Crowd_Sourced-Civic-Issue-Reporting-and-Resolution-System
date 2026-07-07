"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


interface ComplaintMapProps {
  complaints:any[];
}


const markerIcon = new L.Icon({

  iconUrl:
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconSize:[
    25,
    41
  ],

  iconAnchor:[
    12,
    41
  ]

});


export default function ComplaintMap({
  complaints
}:ComplaintMapProps){


return(

<MapContainer

center={[
17.3850,
78.4867
]}

zoom={12}

style={{
height:"500px",
width:"100%"
}}

>


<TileLayer

url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/>



{
complaints.map((complaint)=>{


if(
!complaint.location?.latitude ||
!complaint.location?.longitude
)
return null;


return(

<Marker

key={complaint.id}

position={[
complaint.location.latitude,
complaint.location.longitude
]}

icon={markerIcon}

>


<Popup>

<h3>

{complaint.title}

</h3>


<p>

Severity:

{complaint.severity}

</p>


<p>

Status:

{complaint.status}

</p>


</Popup>


</Marker>


)


})


}


</MapContainer>


)

}