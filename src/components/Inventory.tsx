import {useEffect, useState} from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {Survivor} from "../interfaces/survivor";
import {InventoryItem} from "../interfaces/inventory-item";
import Box from "@mui/material/Box";


function InventoryCard({ inventoryItem }: { inventoryItem: InventoryItem }) {
    return (
        <>
            <Card className="m-5" sx={{ minWidth: 250 }}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textTransform: 'uppercase' }}>
                        quantity: {inventoryItem.quantity}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {inventoryItem.resource}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Item Price: {inventoryItem.resource_price}</Typography>
                </CardContent>
            </Card>
        </>
    )
}


function InventoryComponent({ survivor }:{ survivor: Survivor }) {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<Array<InventoryItem>>([]);

    useEffect(() => {
        async function fetchInventory() {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors/${survivor.id}/inventory-items`);
            const inventory = await response.json();
            setInventory(inventory);
            setLoading(false);
        }

        fetchInventory();
    }, []);

    return (
        <Box className="flex flex-col" style={{width: 400}}>
            {
                inventory.map((inventoryItem) => <InventoryCard inventoryItem={inventoryItem} key={inventoryItem.id}/>)
            }
            {
                !loading && !inventory.length && (
                    <Typography variant="h5" component="div">
                        Inventory is empty.
                    </Typography>
                )
            }
        </Box>
    );
}

export default InventoryComponent;
