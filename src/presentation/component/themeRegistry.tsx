'use client';
import {ReactNode} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {theme} from "@/presentation/theme";
import NextAppDirEmotionCacheProvider from "@/presentation/component/emotionCache";

export default function ThemeRegistry({children}: { children: ReactNode }) {
    return (
        <NextAppDirEmotionCacheProvider options={{key: 'mui'}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}