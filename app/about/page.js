export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Story</h1>
      <div className="bg-amber-100 p-6 rounded-lg">
        <p className="mb-3">
          Grandma started baking cookies in 1985 using secret family recipes.
        </p>
        <p>
          Today we use the same love and ingredients in every batch!
        </p>
      </div>
      <img 
        src="/grandma.jpeg"  // Put grandma.jpg in public/ 
        alt="Grandma baking" 
        className="mt-6 rounded-lg shadow-lg"
      />
    </div>
  );
}