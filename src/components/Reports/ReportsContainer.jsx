/* eslint-disable react/prop-types */
export default function ReportsContainer({ children, closeReports }) {
  return (
    <div className="modalview" onClick={closeReports}>
      <div className="reports-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
