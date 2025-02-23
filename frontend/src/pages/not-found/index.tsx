export function NotFound() {
    return (
        <section className="bg-zinc-200 w-full h-dvh flex justify-center items-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-supernova-400">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-zinc-900 md:text-4xl">
                        Página não encontrada
                    </p>
                    <p className="mb-4 text-lg font-light text-zinc-600">Desculpa, mas a pagina que você está procurando não existe.</p>
                    <a href="/login" className="inline-flex text-zinc-900 bg-supernova-400 hover:bg-supernova-300 focus:ring-4 focus:outline-none focus:ring-supernova-600 font-medium rounded-lg text-sm px-6 py-3 text-center my-4 transition-colors">Voltar para o login</a>
                </div>
            </div>
        </section>
    )
}