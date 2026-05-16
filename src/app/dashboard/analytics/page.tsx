'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AnalyticsPage() {
  const { subscriptions, loading } = useStore();

  // Data processing for charts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach(sub => {
      counts[sub.category] = (counts[sub.category] || 0) + sub.price;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [subscriptions]);

  const monthlyTrendData = [
    { name: 'Jan', amount: 45 },
    { name: 'Feb', amount: 52 },
    { name: 'Mar', amount: 48 },
    { name: 'Apr', amount: 61 },
    { name: 'May', amount: 55 },
    { name: 'Jun', amount: 67 },
  ];

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  const totalYearly = totalMonthly * 12;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Insights</h1>
        <p className="text-muted-foreground">Deep dive into your subscription spending and habits.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Monthly Average"
          value={`$${totalMonthly.toFixed(2)}`}
          trend="+5.2%"
          isUp={true}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <StatsCard 
          title="Annual Projection"
          value={`$${totalYearly.toFixed(0)}`}
          trend="-2.1%"
          isUp={false}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard 
          title="Top Category"
          value={categoryData[0]?.name || 'N/A'}
          trend="Entertainment"
          isUp={true}
          icon={<PieChartIcon className="w-5 h-5 text-amber-500" />}
        />
        <StatsCard 
          title="Savings Potential"
          value="$124"
          trend="Optimization"
          isUp={true}
          icon={<ArrowDownRight className="w-5 h-5 text-cyan-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trend Chart */}
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Spending Trend
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-amber-500" />
              Category Breakdown
            </h3>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'None', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Projection */}
        <div className="lg:col-span-2 glass-dark p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-500" />
              Monthly Projected Costs
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend, isUp, icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-dark p-6 rounded-3xl border border-white/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <h4 className="text-muted-foreground text-sm font-medium mb-1">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
