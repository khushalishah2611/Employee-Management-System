import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-16 text-[#121212]">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8F4FFB]">
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Page not found</h1>
        <p className="mb-8 text-base text-[#4B5563] md:text-lg">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-[#8F4FFB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7B3EF0]"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
};
