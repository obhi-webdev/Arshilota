import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-brand-700">404</p>

        <h1 className="mt-4 text-3xl font-bold">Page পাওয়া যায়নি</h1>

        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl bg-brand-700 px-7 py-3 font-semibold text-white"
        >
          Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
