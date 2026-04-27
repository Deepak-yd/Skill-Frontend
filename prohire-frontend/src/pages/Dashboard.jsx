import { useAuth } from "../context/useAuth";
import UserDashboard from "./UserDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role?.toUpperCase()) {
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "PROFESSIONAL":
        return <ProfessionalDashboard user={user} />;
      case "USER":
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderDashboard()}
    </div>
  );
}

export default Dashboard;
