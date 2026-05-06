const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  );
};

export default StatCard;
