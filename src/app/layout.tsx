import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from "react";
import ThemeRegistry from "@/presentation/component/themeRegistry";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: "개인 디미페이",
    icons: "/favicon.png"
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeRegistry>
            {children}
        </ThemeRegistry>
        </body>
        </html>
    )
}
