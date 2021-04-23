// SPA (Single Page Application)
// SSR (Server-side render)
// SSG (Static site generation)

//import { useEffect } from "react"
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { api } from '../services/api'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'
import Head from 'next/head'

type Episode = {
    id: string
    title: string
    thumbnail: string
    description: string
    members: string
    duration: number
    durationAsString: string
    url: string
    publishedAt: string
}

type HomeProps = {
    lastestEpisodes: Array<Episode>,
    allEpisodes: Array<Episode>,
}

export default function Home({lastestEpisodes, allEpisodes}: HomeProps) {
    const { playList } = usePlayer()

    const episodeList = [...lastestEpisodes, ...allEpisodes]

    return (
        <div className={styles.homepage}>
            <Head>
                <title>Home | Podcastr</title>
            </Head>

            <section className={styles.lastestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {lastestEpisodes.map((episode, index) => {
                        return (
                            <li key={episode.id}>
                                <Image 
                                    width={192}
                                    height={192}
                                    src={episode.thumbnail} 
                                    alt={episode.title}
                                    objectFit="cover"
                                />

                                <div className={styles.episodeDetails}>
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                    <p>{episode.members}</p>
                                    <span>{episode.publishedAt}</span>
                                    <span>{episode.durationAsString}</span>
                                </div>

                                <button type="button" onClick={() => playList(episodeList, index)}>
                                    <img src="/play-green.svg" alt="Tocar episódio" />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section className={styles.allEpisodes}>
                <h2>Todos episódios</h2>

                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Podcast</th>
                            <th>Integrantes</th>
                            <th>Data</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEpisodes.map((episode, index) => {
                            return (
                                <tr key={episode.id}>
                                    <td style={{width: 72}}>
                                        <Image 
                                            width={120}
                                            height={120}
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                            objectFit="cover"
                                        />
                                    </td>
                                    <td>
                                        <Link href={`/episodes/${episode.id}`}>
                                            <a>{episode.title}</a>
                                        </Link>
                                    </td>
                                    <td>{episode.members}</td>
                                    <td style={{width: 100}}>{episode.publishedAt}</td>
                                    <td>{episode.durationAsString}</td>
                                    <td>
                                        <button type="button" onClick={() => playList(episodeList, index+lastestEpisodes.length)}>
                                            <img src="/play-green.svg" alt="Tocar episódio"/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const {data} = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
            description: episode.description,
            url: episode.file.url
        }
    })

    const lastestEpisodes = episodes.slice(0, 2)
    const allEpisodes = episodes.slice(2, episodes.length)

    return {
        props: {
            lastestEpisodes,
            allEpisodes
        },
        revalidate: 60 * 60 * 8
    }
}

/******************SPA******************
 * Chamada de dentro do componente
        useEffect(() => {
            fetch('https://3000-silver-boa-f0cu85wm.ws-us03.gitpod.io/episodes')
                .then(response => response.json())
                .then(data => console.log(data))
        }, [])
/******************SPA******************/

/******************SSR******************
 * Nao precisa chamar dentro do componente
export async function getServerSideProps() {
    const response = await fetch('http://localhost:3333/episodes')
    const data = await response.json()

    return {
        props: { // com esse nome (getServerSideProps) o que for passado no objeto props será repassado para o componente
            episodes: data
        }
    }

}
/******************SSR******************/

/******************SSG******************
* Nao precisa chamar dentro do componente
export async function getStaticProps() {
    const response = await fetch('http://localhost:3333/episodes')
    const data = await response.json()

    return {
        props: { // com esse nome (getServerSideProps) o que for passado no objeto props será repassado para o componente
            episodes: data
        },
        revalidate: 60 * 60 * 8// define o tempo em que é feito o novo carregamento da página estática (a cada 8 horas é gerada uma nova chamada na API)
    }

}
/******************SSR******************/
