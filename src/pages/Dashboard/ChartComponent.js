import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartComponent = ({
  type = "line",
  title = "",
  data,
  height = 300,
  options = {}
}) => {
  // Disable built-in legend
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,  
      title: { display: !!title, text: title }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={wrapper}>
      <div style={chartBox(height)}>
        {type === "line" && <Line data={data} options={mergedOptions} />}
        {type === "pie" && <Pie data={data} options={mergedOptions} />}
      </div>

      {/* CUSTOM LEGEND RIGHT SIDE */}
      {type === "pie" && (
        <div style={legendBox}>
          {data.labels.map((label, index) => (
            <div key={index} style={legendItem}>
              <span
                style={{
                  ...legendColor,
                  backgroundColor: data.datasets[0].backgroundColor[index]
                }}
              ></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartComponent;


// ---------------- STYLES ----------------

const wrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const chartBox = (height) => ({
  height,
  width: "70%",    // chart takes left space
  padding: "20px",
});

const legendBox = {
  width: "30%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
};

const legendColor = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  display: "inline-block",
};
