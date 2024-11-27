import { Link } from "@tanstack/react-router";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-screen flex min-h-screen flex-col justify-between border-t-2 border-purple-600 bg-gray-950 text-white antialiased">
    <header className="px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline">
          <Link to="/" className="text-3xl font-bold">
            round<span className="text-purple-600">est</span>
            <span className="pl-2 text-2xl font-extralight text-gray-400">
              (Convex Stack)
            </span>
          </Link>
        </div>
        <nav className="flex flex-row items-center gap-8">
          <Link to="/results" className="text-lg hover:underline">
            Results
          </Link>
        </nav>
      </div>
    </header>

    <main className="flex-1">{children}</main>

    <footer className="py-3 text-center font-light text-gray-500">
      <a
        href="https://github.com/jamwt/fastest-roundest"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  </div>
);
export default RootLayout;
