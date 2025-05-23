import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 dark:from-purple-700 dark:via-purple-600 dark:to-purple-500 transition-colors duration-500">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg text-center animate-fade-in">
          ¡Bienvenido a <span className="text-white">Soluciones CGT</span>!
        </h1>
        <p className="text-lg sm:text-xl text-white text-center max-w-xl animate-fade-in delay-100">
          Ensambla tu PC ideal con ayuda de la inteligencia artificial. Elige los mejores componentes y ajusta tu presupuesto fácilmente.
        </p>
        <Link href="/armar-pc" passHref legacyBehavior>
          <a className="relative inline-block px-8 py-4 rounded-full bg-white text-purple-600 font-semibold text-xl shadow-lg hover:scale-105 hover:bg-purple-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white animate-bounce">
            Armar mi PC
            <span className="absolute -right-4 -top-4 animate-ping w-4 h-4 bg-white rounded-full opacity-75"></span>
          </a>
        </Link>
      </main>
      <footer className="mt-auto mb-4 text-white text-sm text-center animate-fade-in delay-200">
        © {new Date().getFullYear()} Soluciones CGT. Todos los derechos reservados.
      </footer>
    </div>
  );
}
