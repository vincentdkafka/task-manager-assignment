import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo, TrendingUp } from 'lucide-react';
import API from '../api/axios.js';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await API.get('/dashboard');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  
  const statusChartData = [
    { name: 'To Do', value: data.todo, color: '#94a3b8' },
    { name: 'In Progress', value: data.inProgress, color: '#3b82f6' },
    { name: 'Done', value: data.done, color: '#22c55e' },
  ];


  const userChartData = Object.entries(data.tasksPerUser).map(([name, value]) => ({
    name,
    value,
  }));

 
  const completionRate = data.total > 0
    ? Math.round((data.done / data.total) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.name} 👋</p>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{data.total}</p>
              </div>
              <ListTodo className="text-slate-400" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{data.inProgress}</p>
              </div>
              <TrendingUp className="text-blue-400" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{data.done}</p>
              </div>
              <CheckCircle className="text-green-400" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{data.overdue}</p>
              </div>
              <AlertCircle className="text-red-400" size={28} />
            </div>
          </CardContent>
        </Card>

      </div>

    
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Overall Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={completionRate} className="flex-1 h-3" />
            <span className="text-sm font-semibold text-slate-700 w-12">
              {completionRate}%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {data.done} out of {data.total} tasks completed
          </p>
        </CardContent>
      </Card>

      
      <div className="grid md:grid-cols-2 gap-6">

        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.total === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No tasks yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusChartData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks per User</CardTitle>
          </CardHeader>
          <CardContent>
            {userChartData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No assigned tasks yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userChartData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>

      
      {data.overdue > 0 && (
        <div className="mt-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-sm text-red-600">
            You have <span className="font-semibold">{data.overdue}</span> overdue task(s). Go to your projects to review them.
          </p>
          <Badge variant="destructive" className="ml-auto">{data.overdue} Overdue</Badge>
        </div>
      )}

    </div>
  );
}