import {useState} from "react";
import {useLoaderData} from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {Survivor} from "../interfaces/survivor";
import LogLocation from "../components/LogLocation";
import Inventory from "../components/Inventory";
import Report from "../components/Report";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function SurvivorCard({ survivor, survivors }: { survivor: Survivor, survivors: Survivor[] }) {
    const [modal, setModal] = useState<"location" | "inventory" | "report" | null>(null);
    const handleModalOpen = (modal:  "location" | "inventory" | "report") => setModal(modal);
    const handleModalClose = () => setModal(null);

    return (
        <>
            <Card className="m-5" sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography gutterBottom sx={{ color: survivor.is_infected ? 'error.main' : 'text.secondary', fontSize: 14, textTransform: 'uppercase' }}>
                        {survivor.is_infected ? "infected" : "survived"}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {survivor.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{survivor.gender}, {survivor.age} years</Typography>
                </CardContent>
                <CardActions>
                    <ButtonGroup variant="outlined">
                        <Button size="small" onClick={handleModalOpen.bind(null, "location")}>Update location</Button>
                        <Button size="small" onClick={handleModalOpen.bind(null, "inventory")} sx={{ color: 'green', borderColor: 'green' }}>Inventory</Button>
                        <Button size="small" onClick={handleModalOpen.bind(null, "report")} sx={{ color: 'red', borderColor: 'red' }}>Report as infected</Button>
                    </ButtonGroup>
                </CardActions>
            </Card>
            <Modal
                open={!!modal}
                onClose={handleModalClose}
            >
                <Box sx={modalStyle}>
                    {
                        modal === "location" &&
                        <LogLocation survivor={survivor} onSubmit={handleModalClose}/>
                    }
                    {
                        modal === "inventory" &&
                        <Inventory survivor={survivor}/>
                    }
                    {
                        modal === "report" &&
                        <Report survivor={survivor}
                                reporters={survivors.filter((s) => s !== survivor && !s.is_infected)}
                                onSubmit={handleModalClose}
                        />
                    }
                </Box>
            </Modal>
        </>
    )
}


function HomePage() {
    const survivors = useLoaderData() as Array<Survivor>;

    return (
        <Box sx={{ p: 2 }} className="flex flex-row flex-wrap">
            {
                survivors.map((survivor) => <SurvivorCard survivor={survivor} survivors={survivors} key={survivor.id}/>)
            }
        </Box>
    );
}


export default HomePage;


export async function loader() {
    return await fetch(`${process.env.REACT_APP_BACKEND_URL}/survivors`);
}
