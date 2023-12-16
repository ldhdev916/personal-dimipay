import {getServerSession} from "next-auth";
import {authOptions} from "@/common/authOptions";
import {redirect} from "next/navigation";
import {dimipayService} from "@/common/di";
import {DimipayTemplate} from "@/presentation/component/dimipayTemplate";
import {DimipayQRCode} from "@/presentation/component/dimipayQRCode";

async function measureAndLogExecutionTime<T>(name: string, callback: () => Promise<T>) {
    const startTime = performance.now();

    const result = await callback();

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const formattedTime = formatTime(executionTime);

    console.log(`${name} Execution time: ${formattedTime}`);

    return result
}

function formatTime(milliseconds: number): string {
    const seconds = (milliseconds / 1000).toFixed(2);
    return `${seconds} seconds`;
}

export default async function Home() {

    const session = await measureAndLogExecutionTime("getServerSession", () => getServerSession(authOptions))

    if (!session) {
        redirect("/api/auth/signin")
    }

    const {value, expiresAt} = await measureAndLogExecutionTime("getQRData", () => dimipayService().getQRData())

    return <DimipayTemplate
        qr={<DimipayQRCode value={value} expiresAtJson={expiresAt.toISOString()}/>}
    />
}