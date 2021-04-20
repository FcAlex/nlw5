// SPA (Single Page Application)
// SSR (Server-side render)
// SSG (Static site generation)

//import { useEffect } from "react"

export default function Home(props) {

/******************SPA******************
    useEffect(() => {
        fetch('https://3000-silver-boa-f0cu85wm.ws-us03.gitpod.io/episodes')
            .then(response => response.json())
            .then(data => console.log(data))
    }, [])
/******************SPA******************/

  return (
    <h1>Index</h1>
  )
}

/******************SSR******************
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

/******************SSG******************/
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
