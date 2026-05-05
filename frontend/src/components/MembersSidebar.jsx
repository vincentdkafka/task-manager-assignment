import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserMinus } from 'lucide-react';

export default function MembersSidebar({ members, myRole, userId, onRemoveMember }) {
  return (
    <div className="w-64 shrink-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {member.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.user.name}</p>
                <p className="text-xs text-gray-400">{member.role}</p>
              </div>
              {myRole === 'ADMIN' && member.user.id !== userId && (
                <button
                  onClick={() => onRemoveMember(member.user.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <UserMinus size={14} />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
