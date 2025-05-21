const Signup = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', { name, email, password, address });
            setSuccess('Registration successful! Please log in.');
            setError('');
            setTimeout(() => (window.location.href = '/'), 2000);
        } catch (err) {
            setError(err.response?.data.errors?.map(e => e.msg).join(', ') || 'Error signing up');
            setSuccess('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
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
                <div className="mb-4">
                    <label className="block mb-1">Address</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
            </form>
        </div>
    );
};