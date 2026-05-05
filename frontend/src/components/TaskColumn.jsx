import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard.jsx';

export default function TaskColumn({ title, colorClass, tasks, myRole, userId, onDelete, onStatusChange, onEdit }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
        <h2 className="font-semibold text-sm text-slate-600">{title}</h2>
        <Badge variant="outline" className="ml-auto">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No tasks</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            myRole={myRole}
            userId={userId}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
