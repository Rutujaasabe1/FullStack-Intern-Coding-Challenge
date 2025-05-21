const Navbar = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Store Ratings</h1>
                {token && (
                    <div className="space-x-4">
                        {role === 'admin' && <a href="/admin-dashboard" className="hover:underline">Admin Dashboard</a>}
                        {role === 'user' && <a href="/user-dashboard" className="hover:underline">User Dashboard</a>}
                        {role === 'store_owner' && <a href="/store-owner-dashboard" className="hover:underline">Store Owner Dashboard</a>}
                        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};