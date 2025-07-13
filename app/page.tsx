export default function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold my-4">Welcome to Cookie Heaven!</h1>
      <img 
        src="/cookies.png"  // Put cookie.jpg in public/ folder
        alt="Chocolate chip cookie" 
        className="mx-auto rounded-full w-48 h-48 object-cover"
      />
      <p className="my-4">We bake the best cookies in town! 🍪</p>
      <button className="bg-amber-500 text-white px-6 py-2 rounded-full">
        Order Now
      </button>
    </div>
  );
}