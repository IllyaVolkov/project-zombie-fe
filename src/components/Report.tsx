import {Survivor} from "../interfaces/survivor";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormHelperText from '@mui/material/FormHelperText';
import {useState, FormEvent} from "react";

function ReportComponent({ survivor, reporters, onSubmit }:{ survivor: Survivor, reporters: Survivor[], onSubmit?: () => void }) {
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleReportSubmit(event: FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        setIsSubmitting(true);
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/survivors/${survivor.id}/infection-reports/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    author_id: formData.get("author"),
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response: Response) => {
            setIsSubmitting(false);
            if (response.ok) {
                onSubmit && onSubmit();
            } else {
                return response.json();
            }
        }).then((errors) => {
            if (errors) {
                setError(errors.author_id && errors.author_id[0]);
            }
        });
    }

    return (
        <Box className="flex flex-col" style={{width: 400}}>
            {
                reporters.length > 0 && (
                    <form className="flex flex-col justify-center" onSubmit={handleReportSubmit}>
                        <FormControl fullWidth style={{margin: "5px"}}>
                            <InputLabel id="demo-simple-select-label">
                                Who reports?
                                <span className="MuiFormLabel-asterisk"> *</span>
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                style={{width: "200px"}}
                                label="Who reports?"
                                name="author"
                                defaultValue={reporters[0].id}
                                variant="outlined"
                                required
                            >
                                {reporters.map(({id, name}) => (
                                    <MenuItem value={id} key={id}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {error && <FormHelperText error={true}>{error}</FormHelperText>}
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
                    </form>
                )
            }
            {
                !reporters.length && (
                    <Typography variant="h5" component="div">
                        No healthy people left!
                    </Typography>
                )
            }
        </Box>
    );
}

export default ReportComponent;