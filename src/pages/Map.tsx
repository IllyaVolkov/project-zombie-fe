import {useLoaderData} from "react-router-dom";

function MapPage() {
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

    return <h1>Map Page</h1>;
}

export default MapPage;

export async function loader() {
    return await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors/location-logs`);
}
