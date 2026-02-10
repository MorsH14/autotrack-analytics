
export default function Home() {
  return (
    console.log("Mongo URI exists:", !!process.env.MONGODB_URI)

  );
}
