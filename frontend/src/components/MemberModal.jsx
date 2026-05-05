import { useState } from 'react';
import { toast } from 'sonner';
import API from '../api/axios.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function MemberModal({ open, onClose, projectId, onMemberAdded }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await API.post(`/projects/${projectId}/members`, {
        email,
        role,
      });
      toast.success('Member added successfully!');
      onMemberAdded(res.data);
      setEmail('');
      setRole('MEMBER');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

         
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400">
              User must already have an account
            </p>
          </div>

     
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={adding}>
              {adding ? 'Adding...' : 'Add Member'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}