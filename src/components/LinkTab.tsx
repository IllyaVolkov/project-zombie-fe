import * as React from 'react';
import Tab from '@mui/material/Tab';
import {Link} from "react-router-dom";

interface LinkTabProps {
    label: string;
    to: string;
    value: string;
    selected?: boolean;
}

function LinkTab(props: LinkTabProps) {
    return (
        <Tab
            component={Link}
            aria-current={props.selected && 'page'}
            {...props}
        />
    );
}

export default LinkTab;
