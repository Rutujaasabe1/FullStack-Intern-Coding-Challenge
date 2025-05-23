const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            if (response.data.role === 'admin') window.location.href = '/admin-dashboard';
            else if (response.data.role === 'user') window.location.href = '/user-dashboard';
            else if (response.data.role === 'store_owner') window.location.href = '/store-owner-dashboard';
        } catch (err) {
            setError(err.response?.data.error || 'Error logging in');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
            </form>
            <p className="mt-4">Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
        </div>
    );
};