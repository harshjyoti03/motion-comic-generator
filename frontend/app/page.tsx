import Navbar from "@/components/Navbar";
import UploadPanel from "@/components/UploadPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="flex flex-col items-center justify-center py-20">

        <h1 className="text-6xl font-bold mb-6 text-center">
          AI Motion Comic Generator
        </h1>

        <p className="text-gray-400 text-xl text-center max-w-2xl mb-12">
          Upload comic panels and transform them into cinematic motion comics using AI.
        </p>

        <UploadPanel />

      </section>

    </main>
  );
}