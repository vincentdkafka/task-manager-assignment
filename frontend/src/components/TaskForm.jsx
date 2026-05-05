import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import API from '../api/axios.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const defaultForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'MEDIUM',
  assigneeId: '',
  status: 'TODO',
};

export default function TaskForm({ open, onClose, onSaved, projectId, members, editingTask }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.split('T')[0]
          : '',
        priority: editingTask.priority || 'MEDIUM',
        assigneeId: editingTask.assignee?.id?.toString() || '',
        status: editingTask.status || 'TODO',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTask, open]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelect(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

   
    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || null,
      priority: form.priority,
      status: form.status,
      assigneeId: form.assigneeId ? parseInt(form.assigneeId) : null,
    };

    try {
      let res;
      if (editingTask) {
        
        res = await API.put(`/projects/${projectId}/tasks/${editingTask.id}`, payload);
        toast.success('Task updated!');
      } else {
        
        res = await API.post(`/projects/${projectId}/tasks`, payload);
        toast.success('Task created!');
      }
      onSaved(res.data, !!editingTask);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

          {/* title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What needs to be done?"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          
          <div className="space-y-1">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

         
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(val) => handleSelect('priority', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleSelect('status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          
          <div className="space-y-1">
            <Label>Assign To</Label>
            <Select
              value={form.assigneeId}
              onValueChange={(val) => handleSelect('assigneeId', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem
                    key={member.user.id}
                    value={member.user.id.toString()}
                  >
                    {member.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}