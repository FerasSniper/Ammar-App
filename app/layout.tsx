// app/layout.js
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="bg-amber-800 p-4">
          <div className="container mx-auto flex gap-4">
            <a href="/" className="text-white font-bold">Home</a>
            <a href="/about" className="text-white">About</a>
          </div>
        </nav>
        
        {/* Page Content */}
        <main>{children}</main>
        
        {/* Footer */}
        <footer className="bg-gray-200 p-4 text-center">
          <p>© Cookie Shop 2023</p>
        </footer>
      </body>
    </html>
  );
}