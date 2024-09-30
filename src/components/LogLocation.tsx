import { useState } from 'react';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Box from "@mui/material/Box";
import 'leaflet/dist/leaflet.css';

import { Survivor } from "../interfaces/survivor";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


function LogLocationComponent({ survivor, onSubmit }:{ survivor: Survivor, onSubmit?: () => void }) {
    const [position, setPosition] = useState({lat: 51.505, lng: -0.09}); // Coordinates for London
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ClickDetectionComponent = () => {
        useMapEvents({
            click: (e) => {
                setPosition(e.latlng);
            },
        });

        return null;
    };

    function handleLocationSubmit() {
        setIsSubmitting(true);
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/survivors/${survivor.id}/location-logs/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    latitude: position.lat,
                    longitude: position.lng,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(() => {
            setIsSubmitting(false);
            onSubmit && onSubmit();
        });
    }

    return (
        <Box className="flex flex-col" style={{width: 400}}>
            <Typography variant="h5" component="div">Pick location</Typography>
            <br/>
            <MapContainer center={position} zoom={13} style={{height: "50vh", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <ClickDetectionComponent/>
                <Marker position={position}/>
            </MapContainer>
            <br/>
            <Typography sx={{color: 'text.secondary', fontSize: 14}}>Selected
                location: {position.lat}, {position.lng}</Typography>
            <br/>
            <Button
                style={{width: "100px", margin: "5px"}}
                variant="contained"
                color="primary"
                onClick={handleLocationSubmit}
                disabled={isSubmitting}
            >
                save
            </Button>
        </Box>
    );
}

export default LogLocationComponent;