const UserDashboard = () => {
    const [stores, setStores] = React.useState([]);
    const [filters, setFilters] = React.useState({ name: '', address: '' });
    const [sort, setSort] = React.useState({ sortBy: 'name', order: 'ASC' });
    const [newPassword, setNewPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fetchStores = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/stores/user-stores', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { ...filters, ...sort },
                });
                setStores(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStores();
    }, [filters, sort]);

    const handleRatingSubmit = async (storeId, rating) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/ratings/${storeId}`, { rating }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload();
        } catch (err) {
            alert(err.response?.data.error || 'Error submitting rating');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/update-password', { newPassword }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Password updated successfully');
            setNewPassword('');
        } catch (err) {
            setMessage(err.response?.data.error || 'Error updating password');
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6">
            <h2 className="text-3xl font-bold mb-6">User Dashboard</h2>

            <h3 className="text-xl font-bold mb-4">Update Password</h3>
            <form onSubmit={handleUpdatePassword} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update Password</button>
                </div>
                {message && <p className={message.includes('successfully') ? 'text-green-500' : 'text-red-500'}>{message}</p>}
            </form>

            <h3 className="text-xl font-bold mb-4">Stores</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
                <input
                    placeholder="Search by Name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Search by Address"
                    value={filters.address}
                    onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                    className="p-2 border rounded"
                />
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2 cursor-pointer" onClick={() => setSort({ sortBy: 'name', order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}>Name</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2">Overall Rating</th>
                        <th className="border p-2">Your Rating</th>
                        <th className="border p-2">Submit Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.id} className="border">
                            <td className="border p-2">{store.name}</td>
                            <td className="border p-2">{store.address}</td>
                            <td className="border p-2">{store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : 'N/A'}</td>
                            <td className="border p-2">{store.user_rating || 'Not rated'}</td>
                            <td className="border p-2">
                                <select
                                    onChange={(e) => handleRatingSubmit(store.id, parseInt(e.target.value))}
                                    defaultValue=""
                                    className="p-1 border rounded"
                                >
                                    <option value="" disabled>Rate</option>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};