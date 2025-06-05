import Navbar from "../../components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="p-10">
        <h1 className="text-3xl font-bold">Welcome to GOGREEN nursery</h1>
        <p className="text-gray-600 mt-4">Your plant-loving e-commerce site 🌿</p>
      </main>
    </>
  );
}