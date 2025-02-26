import { useEffect } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return <p>Loading......</p>;
    }

    return (
        <div>
            <h2>Dashboard</h2>
            {user && user.username ? (
                <p>Welcome, {user.username}!</p> 
            ) : (
                <p>No user data available</p> 
            )}
        </div>
    );
};

export default Dashboard;
