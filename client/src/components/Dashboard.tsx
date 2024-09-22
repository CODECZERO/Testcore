// Dashboard.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './DashB.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Sample data for the pie chart
  const pieData = {
    labels: ['Exams Passed', 'Exams Failed'],
    datasets: [
      {
        label: '# of Exams',
        data: [10, 5], // Dummy data for passed and failed exams
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="cards-container">
        {/* Card 1 */}
        <div className="card">
          <h3>No Previews</h3>
          <p>There are currently no previews available.</p>
        </div>

        {/* Card 2 */}
        <div className="card">
          <h3>Give Exam</h3>
          <button className="card-button">Give Exam</button>
          <button className="card-button">Result</button>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h3>Exam Statistics</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
