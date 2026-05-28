import Navbar from "@/components/Navbar";
import UploadPanel from "@/components/UploadPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 py-20 flex flex-col items-center">

        <h1 className="text-6xl md:text-7xl font-bold text-center mb-6">
          AI Motion Comic Generator
        </h1>

        <p className="text-gray-400 text-center text-xl max-w-3xl mb-16">
          Transform manga and manhwa panels into cinematic motion comics using AI-powered narration, animation, and storytelling.
        </p>

        <UploadPanel />

      </section>

    </main>
  );
}