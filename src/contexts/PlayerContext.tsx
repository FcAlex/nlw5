import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Array<Episode>
    currentEpisodeIndex: number
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    play: (episode: Episode) => void
    setPlayingState: (state: boolean) => void
    tooglePlay: () => void
    clearPlayerState: () => void
    toogleShuffle: () => void
    toogleLoop: () => void
    playNext: () => void
    playPrevious: () => void
    playList: (list: Array<Episode>, index: number) => void
    hasNext: boolean
    hasPrevious: boolean
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode // qualquer coisa q o react aceitaria
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Array<Episode>, index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function tooglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toogleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function toogleLoop() {
        setIsLooping(!isLooping)
    }

    function setPlayingState(state: boolean) {
         setIsPlaying(state)
    }

    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

    function playNext() {
        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }

    }

    function playPrevious() {
        if(hasPrevious)
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)

    }

    return (
        <PlayerContext.Provider value={{
            episodeList, 
            currentEpisodeIndex, 
            play, 
            isPlaying,
            playNext,
            playPrevious,
            tooglePlay, 
            setPlayingState,
            playList,
            hasNext, 
            hasPrevious,
            isLooping, 
            toogleLoop,
            toogleShuffle,
            isShuffling,
            clearPlayerState
        }}>

            {children}

        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    return useContext(PlayerContext)
}