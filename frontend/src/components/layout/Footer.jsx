export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Recipe Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 