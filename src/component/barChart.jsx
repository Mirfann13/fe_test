import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";

export default function BarChart({ data, options }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance.destroy();
    }
  }, [data, options]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}
