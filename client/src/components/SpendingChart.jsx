import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percentage < 5) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {percentage}%
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-name">{data.name}</p>
        <p className="tooltip-amount">₦{data.amount?.toLocaleString()}</p>
        <p className="tooltip-pct">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ categories, onCategoryClick }) {
  if (!categories || categories.length === 0) return null;

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={110}
              paddingAngle={3}
              dataKey="amount"
              label={renderCustomLabel}
              labelLine={false}
              animationBegin={300}
              animationDuration={1200}
              onClick={(data) => onCategoryClick && onCategoryClick(data.name)}
            >
              {categories.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="legend-item"
            onClick={() => onCategoryClick && onCategoryClick(cat.name)}
          >
            <span className="legend-dot" style={{ backgroundColor: cat.color }} />
            <span className="legend-name">{cat.name}</span>
            <span className="legend-amount">₦{cat.amount?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
