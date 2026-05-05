import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function ProjectHeader({ project, myRole, onManageMembers, onAddTask }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <Badge variant={myRole === 'ADMIN' ? 'default' : 'secondary'}>
            {myRole}
          </Badge>
        </div>
        <p className="text-gray-500 mt-1">
          {project.description || 'No description provided'}
        </p>
      </div>

      
      {myRole === 'ADMIN' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onManageMembers}
          >
            <Users size={15} />
            Manage Members
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={onAddTask}
          >
            <Plus size={15} />
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
}
