import {getServerSession} from "next-auth";
import {authOptions} from "@/common/authOptions";
import {redirect} from "next/navigation";
import {dimipayService} from "@/common/di";
import {DimipayTemplate} from "@/presentation/component/dimipayTemplate";
import {DimipayQRCode} from "@/presentation/component/dimipayQRCode";

export default async function Home() {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/api/auth/signin")
    }

    const {value, expiresAt} = await dimipayService().getQRData()

    return <DimipayTemplate
        qr={<DimipayQRCode value={value} expiresAtJson={expiresAt.toISOString()}/>}
    />
}