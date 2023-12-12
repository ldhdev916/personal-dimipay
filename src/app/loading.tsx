import {DimipayTemplate} from "@/presentation/component/dimipayTemplate";
import Skeleton from "@mui/material/Skeleton";
import {QR_CODE_SIZE} from "@/common/consts";

export default function Loading() {
    return <DimipayTemplate
        qr={
            <Skeleton variant="rounded" width={QR_CODE_SIZE} height={QR_CODE_SIZE}/>
        }
    />
}