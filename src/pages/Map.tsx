import {useLoaderData} from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

function MapPage() {
    const centerPosition = {lat: 51.505, lng: -0.09}; // Coordinates for London
    const locationLogs = useLoaderData() as Array<{
        "id": number,
        "latitude": number,
        "longitude": number,
        "created_at": string,
        survivor: {
            id: number,
            name: string,
            age: number,
            gender: string,
            is_infected: boolean,
        }
    }>

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="div">Survivors locations</Typography>
            <br/>
            <MapContainer center={centerPosition} zoom={10} style={{height: "80vh", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                {
                    locationLogs.map((locationLog) => (
                        <Marker position={{lat: locationLog.latitude, lng: locationLog.longitude}}>
                            <Popup>
                                Name: {locationLog.survivor.name}
                                <br/>
                                {locationLog.survivor.is_infected ? "Infected" : "Healthy"}
                            </Popup>
                        </Marker>
                    ))
                }
            </MapContainer>
        </Box>
    );
}

export default MapPage;

export async function loader() {
    return await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors/location-logs`);
}
