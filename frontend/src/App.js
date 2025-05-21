const App = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const renderRoute = () => {
        const path = window.location.pathname;
        if (!token && path !== '/signup') return <Login />;
        if (path === '/signup') return <Signup />;
        if (path === '/admin-dashboard' && role === 'admin') return <AdminDashboard />;
        if (path === '/user-dashboard' && role === 'user') return <UserDashboard />;
        if (path === '/store-owner-dashboard' && role === 'store_owner') return <StoreOwnerDashboard />;
        return <Login />;
    };

    return (
        <div>
            <Navbar />
            {renderRoute()}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));