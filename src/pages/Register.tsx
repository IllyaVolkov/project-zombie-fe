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


function RegisterPage() {
    const {genders, resources} = useLoaderData() as {
        genders: Array<{ id: number, name: string }>,
        resources: Array<{ id: number, name: string }>
    };
    const formSubmitData: any = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <Box sx={{ p: 2 }} className="flex flex-col items-center">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Register new survivor</Typography>
            <Form method="post" className="flex flex-col justify-center">
                <TextField
                    style={{width: "200px", margin: "5px"}}
                    type="text"
                    label="Name"
                    name="name"
                    variant="outlined"
                    required
                    error={!!formSubmitData?.name}
                    helperText={formSubmitData?.name && formSubmitData?.name[0]}
                />
                <br/>
                <TextField
                    style={{width: "200px", margin: "5px"}}
                    type="number"
                    label="Age"
                    name="age"
                    variant="outlined"
                    slotProps={{
                        htmlInput: { min: 0 }
                    }}
                    required
                    error={!!formSubmitData?.age}
                    helperText={formSubmitData?.age && formSubmitData?.age[0]}
                />
                <br/>
                <FormControl fullWidth style={{margin: "5px"}}>
                    <InputLabel id="demo-simple-select-label">
                        Gender
                        <span className="MuiFormLabel-asterisk"> *</span>
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        style={{width: "200px"}}
                        label="Gender"
                        name="gender"
                        defaultValue={genders[0].id}
                        variant="outlined"
                        required
                    >
                        {genders.map(({id, name}) => (
                            <MenuItem value={id} key={id}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br/>
                <FormControl fullWidth>
                    <InputLabel>Resources</InputLabel>
                    <br/>
                    <br/>
                    {
                        resources.map(({id, name}) => (
                            <TextField
                                style={{width: "200px", margin: "5px"}}
                                type="number"
                                label={name}
                                key={id}
                                name={`inventory_items.${id}`}
                                defaultValue={0}
                                variant="outlined"
                                slotProps={{
                                    input: {
                                        notched: true,
                                    },
                                    htmlInput: { min: 0 }
                                }}
                                required
                            />
                        ))
                    }
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
        </Box>
    );
}

export default RegisterPage;

export async function loader() {
    const gendersResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors/genders`);
    const resourcesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/resources`);
    return {genders: await gendersResponse.json(), resources: await resourcesResponse.json()};
}

export async function action({ request }: any) {
    const formData = await request.formData();

    const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/survivors/`,
        {
            method: 'POST',
            body: JSON.stringify({
                name: formData.get("name"),
                age: formData.get("age"),
                gender_id: formData.get("gender"),
                inventory_items: Array.from(formData, ([controlName, value]) => ({controlName, value}))
                    .filter(({controlName, value}) => controlName.startsWith("inventory_items."))
                    .filter(({controlName, value}) => value > 0)
                    .map(({controlName, value}) => ({
                        resource_id: parseInt(controlName.replace("inventory_items.", "")),
                        quantity: value
                    }))
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