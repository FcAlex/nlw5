// SPA (Single Page Application)
// SSR (Server-side render)
// SSG (Static site generation)

//import { useEffect } from "react"
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { api } from '../services/api'
import ptBR from 'date-fns/locale/pt-BR'
import {format, parseISO} from 'date-fns'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'

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
    return (
        <div className={styles.homepage}>
            <section className={styles.lastestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {lastestEpisodes.map(episode => {
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
                                    <a href="">{episode.title}</a>
                                    <p>{episode.members}</p>
                                    <span>{episode.publishedAt}</span>
                                    <span>{episode.durationAsString}</span>
                                </div>

                                <button type="button">
                                    <img src="/play-green.svg" alt="Tocar episódio" />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section className={styles.allEpisodes}></section>
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
            member: episode.thumbnail,
            publishedAt: format(parseISO(episode.published_at), 'd MM yy', {locale: ptBR}),
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
