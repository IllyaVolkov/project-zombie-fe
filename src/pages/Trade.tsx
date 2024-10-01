import {Survivor} from "../interfaces/survivor";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import {
    Form,
    redirect,
    useLoaderData,
    useActionData,
    useNavigation
} from "react-router-dom";
import {useEffect, useState} from "react";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {InventoryItem} from "../interfaces/inventory-item";
import FormHelperText from "@mui/material/FormHelperText";


function TradePage() {
    const {survivors, resources} = useLoaderData() as {
        survivors: Array<Survivor>,
        resources: Array<{ id: number, name: string, price: string }>
    };
    const [traderId, setTraderId] = useState<string>(survivors[0]?.id.toString() || "");
    const [traderInventory, setTraderInventory] = useState<{[key: string]: InventoryItem}>({});
    const [partnerId, setPartnerId] = useState<string>(survivors[1]?.id.toString() || "");
    const [partnerInventory, setPartnerInventory] = useState<{[key: string]: InventoryItem}>({});
    const formSubmitData: any = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    async function fetchInventory(survivorId: string) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors/${survivorId}/inventory-items`);
        const inventory = await response.json();
        const inventoryObj: {[key: string]: InventoryItem} = {};
        inventory.forEach((value: InventoryItem) => {
            inventoryObj[value.resource] = value;
        })
        return inventoryObj;
    }

    useEffect(() => {
        if (traderId) {
            fetchInventory(traderId).then((inventoryObj) => setTraderInventory(inventoryObj));
        }
        if (partnerId) {
            fetchInventory(partnerId).then((inventoryObj) => setPartnerInventory(inventoryObj));
        }
    }, []);

    function handleTraderChange(event: SelectChangeEvent<string>) {
        const newTraderId = event.target.value;
        setTraderId(newTraderId);
        fetchInventory(newTraderId).then((inventoryObj) => setTraderInventory(inventoryObj));
        if (newTraderId === partnerId) {
            setPartnerId("");
            setPartnerInventory({});
        }
    }

    function handlePartnerChange(event: SelectChangeEvent<string>) {
        const newPartnerId = event.target.value;
        setPartnerId(newPartnerId);
        fetchInventory(newPartnerId).then((inventoryObj) => setPartnerInventory(inventoryObj));
        if (newPartnerId === traderId) {
            setTraderId("");
            setTraderInventory({});
        }
    }

    return (
        <Box sx={{ p: 2 }} className="flex flex-col items-center">
            {
                survivors.length < 2 &&
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>No survivors to trade with!</Typography>
            }
            {
                survivors.length >= 2 &&
                <>
                    <Typography variant="h5" component="div" sx={{flexGrow: 1}}>Trade items between
                        survivors</Typography>
                    <br/>
                    <Form method="post" className="flex flex-col justify-center">
                        <FormControl fullWidth style={{margin: "5px"}}>
                            <InputLabel id="select-label">
                                Who trades?
                                <span className="MuiFormLabel-asterisk"> *</span>
                            </InputLabel>
                            <Select
                                labelId="select-label"
                                style={{width: "300px"}}
                                label="Who trades?"
                                name="survivor"
                                value={traderId}
                                onChange={handleTraderChange}
                                variant="outlined"
                                required
                                error={!!formSubmitData?.survivor_id}
                            >
                                {survivors.map(({id, name}) => (
                                    <MenuItem value={id.toString()} key={id}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth>
                            <InputLabel>Offered resources</InputLabel>
                            <br/>
                            <br/>
                            {
                                resources.map(({id, name, price}) => (
                                    <Box className="flex flex-row space-between items-center" key={id}>
                                        <TextField
                                            style={{width: "300px", margin: "5px"}}
                                            type="number"
                                            label={name}
                                            name={`offered_items.${id}`}
                                            defaultValue={0}
                                            variant="outlined"
                                            slotProps={{
                                                input: {
                                                    notched: true,
                                                },
                                                htmlInput: {min: 0, max: traderInventory[name]?.quantity || 0}
                                            }}
                                            required
                                        />
                                        <span className="ml-1">available: {traderInventory[name]?.quantity || 0}, price: {price}</span>
                                    </Box>
                                ))
                            }
                            {formSubmitData?.offered_items && <FormHelperText error={true}>{formSubmitData.offered_items[0]}</FormHelperText>}
                        </FormControl>
                        <br/>
                        <FormControl fullWidth style={{margin: "5px"}}>
                        <InputLabel id="select-partner-label">
                                Who do you trade with?
                                <span className="MuiFormLabel-asterisk"> *</span>
                            </InputLabel>
                            <Select
                                labelId="select-partner-label"
                                style={{width: "300px"}}
                                label="Who do you trade with?"
                                name="partner"
                                value={partnerId}
                                onChange={handlePartnerChange}
                                variant="outlined"
                                required
                                error={!!formSubmitData?.partner_id}
                            >
                                {survivors.map(({id, name}) => (
                                    <MenuItem value={id.toString()} key={id}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth>
                            <InputLabel>Requested resources</InputLabel>
                            <br/>
                            <br/>
                            {
                                resources.map(({id, name, price}) => (
                                    <Box className="flex flex-row space-between items-center" key={id}>
                                        <TextField
                                            style={{width: "300px", margin: "5px"}}
                                            type="number"
                                            label={name}
                                            name={`requested_items.${id}`}
                                            defaultValue={0}
                                            variant="outlined"
                                            slotProps={{
                                                input: {
                                                    notched: true,
                                                },
                                                htmlInput: { min: 0, max: partnerInventory[name]?.quantity || 0 }
                                            }}
                                            required
                                        />
                                        <span className="ml-1">available: {partnerInventory[name]?.quantity || 0}, price: {price}</span>
                                    </Box>
                                ))
                            }
                            {formSubmitData?.requested_items && <FormHelperText error={true}>{formSubmitData.requested_items[0]}</FormHelperText>}
                        </FormControl>
                        <br/>
                        <Button
                            type="submit"
                            style={{width: "100px", margin: "5px"}}
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            save
                        </Button>
                    </Form>
                </>
            }
        </Box>
    );
}

export default TradePage;

export async function loader() {
    const survivorsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors`);
    const resourcesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/resources`);
    return {
        survivors: (await survivorsResponse.json()).filter((s: Survivor) => !s.is_infected),
        resources: await resourcesResponse.json()
    };
}

export async function action({ request }: any) {
    const formData = await request.formData();

    const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/survivors/${formData.get("survivor")}/trade/`,
        {
            method: 'POST',
            body: JSON.stringify({
                partner_id: formData.get("partner"),
                offered_items: Array.from(formData, ([controlName, value]) => ({controlName, value}))
                    .filter(({controlName, value}) => controlName.startsWith("offered_items.") && value > 0)
                    .map(({controlName, value}) => ({
                        resource_id: parseInt(controlName.replace("offered_items.", "")),
                        quantity: value
                    })),
                requested_items: Array.from(formData, ([controlName, value]) => ({controlName, value}))
                    .filter(({controlName, value}) => controlName.startsWith("requested_items.") && value > 0)
                    .map(({controlName, value}) => ({
                        resource_id: parseInt(controlName.replace("requested_items.", "")),
                        quantity: value
                    })),
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (response.status === 400) {
        return response;
    }

    return redirect('/');
}
