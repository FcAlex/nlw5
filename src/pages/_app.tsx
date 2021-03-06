import '../styles/global.scss'
import styles from '../styles/app.module.scss';
import { Header } from '../components/Header';
import {Player} from '../components/Player';
import { useState } from 'react';
import { PlayerContextProvider } from '../contexts/PlayerContext';

function App({ Component, pageProps }) {
    return (
        <PlayerContextProvider>
            <div className={styles.wrapper}>
                <main>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <Player />
            </div>
        </PlayerContextProvider>
    );
}

export default App
