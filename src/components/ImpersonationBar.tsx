import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

const ImpersonationBar = () => {
  const { hasOriginalAdminSession, returnToAdminSession, user } = useAuth();

  // Only show if we have an admin session stored (meaning we're impersonating)
  if (!hasOriginalAdminSession) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Vous êtes connecté en tant que: <strong>{user?.email}</strong>
          </span>
        </div>
        
        <Button
          onClick={returnToAdminSession}
          size="sm"
          variant="secondary"
          className="gap-2 bg-white text-orange-600 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4" />
          Retour à mon compte admin
        </Button>
      </div>
    </div>
  );
};

export default ImpersonationBar;
