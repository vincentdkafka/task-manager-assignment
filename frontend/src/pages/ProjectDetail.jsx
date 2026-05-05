import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import API from '../api/axios.js';

import { Separator } from '@/components/ui/separator';
import TaskForm from '../components/TaskForm.jsx';
import MemberModal from '../components/MemberModal.jsx';
import ProjectHeader from '../components/ProjectHeader.jsx';
import TaskColumn from '../components/TaskColumn.jsx';
import MembersSidebar from '../components/MembersSidebar.jsx';

export default function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState('MEMBER');
  const [loading, setLoading] = useState(true);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
   
      const [projectRes, tasksRes] = await Promise.all([
        API.get('/projects'),
        API.get(`/projects/${id}/tasks`),
      ]);

      
      const found = projectRes.data.find((p) => p.id === parseInt(id));
      if (found) {
        setProject(found);
        setMembers(found.members);

        
        const me = found.members.find((m) => m.user.id === user.id);
        setMyRole(me?.role || 'MEMBER');
      }

      setTasks(tasksRes.data.tasks);
    } catch (err) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await API.delete(`/projects/${id}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      const res = await API.put(`/projects/${id}/tasks/${taskId}`, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  }

  async function handleRemoveMember(userId) {
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      setMembers(members.filter((m) => m.user.id !== userId));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  }

  function handleTaskSaved(savedTask, isEdit) {
    if (isEdit) {
      setTasks(tasks.map((t) => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks([...tasks, savedTask]);
    }
    setTaskFormOpen(false);
    setEditingTask(null);
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setTaskFormOpen(true);
  }

  function handleMemberAdded(newMember) {
    setMembers([...members, newMember]);
    setMemberModalOpen(false);
  }

 
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Project not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ProjectHeader
        project={project}
        myRole={myRole}
        onManageMembers={() => setMemberModalOpen(true)}
        onAddTask={() => {
          setEditingTask(null);
          setTaskFormOpen(true);
        }}
      />

      <Separator className="mb-6" />

      
      <div className="flex gap-6">

        
        <div className="flex-1">
          <div className="grid md:grid-cols-3 gap-4">
            <TaskColumn
              title="TO DO"
              colorClass="bg-slate-400"
              tasks={todoTasks}
              myRole={myRole}
              userId={user.id}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
            />
            <TaskColumn
              title="IN PROGRESS"
              colorClass="bg-blue-400"
              tasks={inProgressTasks}
              myRole={myRole}
              userId={user.id}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
            />
            <TaskColumn
              title="DONE"
              colorClass="bg-green-400"
              tasks={doneTasks}
              myRole={myRole}
              userId={user.id}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
            />
          </div>
        </div>

        <MembersSidebar
          members={members}
          myRole={myRole}
          userId={user.id}
          onRemoveMember={handleRemoveMember}
        />
      </div>

      
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSaved={handleTaskSaved}
        projectId={id}
        members={members}
        editingTask={editingTask}
      />


      {myRole === 'ADMIN' && (
        <MemberModal
          open={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          projectId={id}
          onMemberAdded={handleMemberAdded}
        />
      )}

    </div>
  );
}