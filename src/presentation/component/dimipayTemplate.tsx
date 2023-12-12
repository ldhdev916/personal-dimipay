import {ReactNode} from "react";
import {Box} from "@mui/material";

export function DimipayTemplate({qr}: { qr: ReactNode }) {

    return <Box sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Box pb="10.3rem">
            {qr}
        </Box>
    </Box>
}