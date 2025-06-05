const Navbar = () => {
    return (
      <nav className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-xl font-bold">BharatBazaar</h1>
        <div className="space-x-4">
          <a href="#" className="hover:underline">Men</a>
          <a href="#" className="hover:underline">Women</a>
          <a href="#" className="hover:underline">Kids</a>
          <a href="#" className="hover:underline">Electronics</a>
        </div>
      </nav>
    );
  };
  
  export default Navbar;