import { useEffect } from "react";
import { useUser } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Dashboard</h2>
            {user ? <p>Welcome, {user.username}!</p> : <p>No user data available</p>}
            <br />
            <Link to="/decks">
                <button>View Your Decks</button>
            </Link>
        </div>
    );
};

export default Dashboard;
