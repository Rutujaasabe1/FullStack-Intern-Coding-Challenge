const AdminDashboard = () => {
    const [stats, setStats] = React.useState({});
    const [users, setUsers] = React.useState([]);
    const [stores, setStores] = React.useState([]);
    const [filters, setFilters] = React.useState({ name: '', email: '', address: '', role: '' });
    const [sort, setSort] = React.useState({ sortBy: 'name', order: 'ASC' });

    React.useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const statsRes = await axios.get('http://localhost:5000/api/users/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(statsRes.data);

                const usersRes = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { ...filters, ...sort },
                });
                setUsers(usersRes.data);

                const storesRes = await axios.get('http://localhost:5000/api/stores', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { ...filters, ...sort },
                });
                setStores(storesRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [filters, sort]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/users/add', Object.fromEntries(formData), {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload();
        } catch (err) {
            alert(err.response?.data.error || 'Error adding user');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/stores/add', Object.fromEntries(formData), {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload();
        } catch (err) {
            alert(err.response?.data.error || 'Error adding store');
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6">
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-2xl">{stats.totalUsers || 0}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Stores</h3>
                    <p className="text-2xl">{stats.totalStores || 0}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Ratings</h3>
                    <p className="text-2xl">{stats.totalRatings || 0}</p>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input name="name" placeholder="Name" className="p-2 border rounded" required />
                    <input name="email" type="email" placeholder="Email" className="p-2 border rounded" required />
                    <input name="password" type="password" placeholder="Password" className="p-2 border rounded" required />
                    <textarea name="address" placeholder="Address" className="p-2 border rounded" required></textarea>
                    <select name="role" className="p-2 border rounded">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="store_owner">Store Owner</option>
                    </select>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add User</button>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Add New Store</h3>
            <form onSubmit={handleAddStore} className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input name="name" placeholder="Store Name" className="p-2 border rounded" required />
                    <input name="email" type="email" placeholder="Store Email" className="p-2 border rounded" required />
                    <textarea name="address" placeholder="Store Address" className="p-2 border rounded" required></textarea>
                    <input name="owner_id" type="number" placeholder="Owner ID" className="p-2 border rounded" required />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Store</button>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Users</h3>
            <div className="mb-4 grid grid-cols-4 gap-4">
                <input
                    placeholder="Filter by Name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Filter by Email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Filter by Address"
                    value={filters.address}
                    onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                    className="p-2 border rounded"
                />
                <select
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                </select>
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'name', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Name</th>
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'email', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Email</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'role', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Role</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.address}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">{user.storeRating || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="text-xl font-bold mt-6 mb-4">Stores</h3>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'name', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Name</th>
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'email', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Email</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.id} className="border">
                            <td className="border p-2">{store.name}</td>
                            <td className="border p-2">{store.email}</td>
                            <td className="border p-2">{store.address}</td>
                            <td className="border p-2">{store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};