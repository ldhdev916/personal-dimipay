"use client"

import QRCode from "react-qr-code";
import {QR_CODE_SIZE} from "@/common/consts";
import {ComponentType, useEffect} from "react";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useAction} from "next-safe-action/hook";
import {actionWatchTransaction} from "@/presentation/actions";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {Stack, SvgIconProps, Typography} from "@mui/material";

export function DimipayQRCode({value, expiresAtJson}: { value: string, expiresAtJson: string }) {

    const router = useRouter()
    const expiresAt = dayjs(expiresAtJson)

    const {execute: watchTransaction, result} = useAction(actionWatchTransaction)

    useEffect(() => {
        setTimeout(() => {
            router.refresh()
        }, expiresAt.subtract(1.5, "seconds").diff(dayjs()))
    }, [expiresAt, router]);

    useEffect(() => {
        watchTransaction()
    }, [watchTransaction]);

    switch (result.data) {
        case true:
            return <StatusMessage
                IconComponent={CheckCircle}
                color="success"
                message="성공"
            />
        case false:
            return <StatusMessage
                IconComponent={Cancel}
                color="error"
                message="실패"
            />
        default:
            return <QRCode value={value} size={QR_CODE_SIZE}/>
    }

}

function StatusMessage({IconComponent, color, message}: {
    IconComponent: ComponentType<SvgIconProps>,
    color: SvgIconProps["color"],
    message: string
}) {
    return <Stack gap={2} alignItems="center">
        <IconComponent
            color={color}
            sx={{
                fontSize: 100
            }}
        />

        <Typography fontSize={24} fontWeight="bold" color={color}>결제에 {message} 했습니다</Typography>
    </Stack>
}