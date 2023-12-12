"use server"

import {z} from "zod";
import {createSafeActionClient} from "next-safe-action";
import {authOptions} from "@/common/authOptions";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {dimipayService} from "@/common/di";

const authAction = createSafeActionClient({
    async middleware() {
        const session = await getServerSession(authOptions)

        if (!session) {
            redirect("/api/auth/signin")
        }
    }
})

const watchTransactionSchema = z.any().optional()

export const actionWatchTransaction = authAction(watchTransactionSchema, async () => {
    return await dimipayService().watchTransaction()
})
