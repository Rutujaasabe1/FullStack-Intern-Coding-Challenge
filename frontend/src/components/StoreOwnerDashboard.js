const StoreOwnerDashboard = () => {
    const [ratings, setRatings] = React.useState([]);
    const [averageRating, setAverageRating] = React.useState(0);
    const [newPassword, setNewPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/ratings/store-owner', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRatings(response.data.ratings);
                setAverageRating(response.data.averageRating);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

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
            <h2 className="text-3xl font-bold mb-6">Store Owner Dashboard</h2>

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

            <h3 className="text-xl font-bold mb-4">Store Ratings</h3>
            <div className="mb-6">
                <p className="text-lg">Average Rating: {averageRating.toFixed(1)}</p>
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">User Name</th>
                        <th className="border p-2">User Email</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {ratings.map(rating => (
                        <tr key={rating.id} className="border">
                            <td className="border p-2">{rating.name}</td>
                            <td className="border p-2">{rating.email}</td>
                            <td className="border p-2">{rating.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};