import { format } from 'date-fns';
import { Pencil, Trash2, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const priorityColors = {
  LOW: 'secondary',
  MEDIUM: 'outline',
  HIGH: 'destructive',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export default function TaskCard({ task, myRole, userId, onDelete, onStatusChange, onEdit }) {

  
  const isMyTask = task.assignee?.id === userId;

  
  const canEdit = myRole === 'ADMIN' || isMyTask;


  const isOverdue = task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE';

  return (
    <div className={`bg-white rounded-lg border p-3 shadow-sm space-y-2 ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>

      
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 leading-snug flex-1">
          {task.title}
        </p>
        {canEdit && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Pencil size={13} />
            </button>
            {myRole === 'ADMIN' && (
              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2">
        <Badge variant={priorityColors[task.priority]} className="text-xs">
          {priorityLabels[task.priority]}
        </Badge>
        {isOverdue && (
          <Badge variant="destructive" className="text-xs">
            Overdue
          </Badge>
        )}
      </div>

      
      {task.dueDate && (
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
          <Calendar size={11} />
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        </div>
      )}

      
      {task.assignee && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <User size={11} />
          <span>{task.assignee.name}</span>
        </div>
      )}

      {canEdit && (
        <Select
          value={task.status}
          onValueChange={(val) => onStatusChange(task.id, val)}
        >
          <SelectTrigger className="h-7 text-xs mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      )}

    </div>
  );
}