import {useLoaderData} from "react-router-dom";

function TradePage() {
    const survivors = useLoaderData() as Array<{
        id: number,
        name: string,
        age: number,
        gender: string,
        is_infected: boolean,
    }>

    return <h1>Trade Page</h1>;
}

export default TradePage;

export async function loader() {
    return await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors`);
}
