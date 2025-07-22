import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}