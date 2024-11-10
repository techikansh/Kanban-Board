import { useState, useEffect, useRef } from 'react';
import { UserPlus, X, Check, Shield } from 'lucide-react';

export default function ProjectMembers({ project, onUpdate }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async (query) => {
    if (query.length >= 3) {
      try {
        setIsSearching(true);
        const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const emails = await response.json();
          setSuggestions(emails);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewMemberEmail(value);
    searchUsers(value);
  };

  const handleSelectEmail = (email) => {
    setNewMemberEmail(email);
    setShowSuggestions(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/projects/${project._id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add member');
      }

      const updatedProject = await response.json();
      onUpdate(updatedProject);
      setShowAddMember(false);
      setNewMemberEmail('');
      setNewMemberRole('viewer');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(`/api/projects/${project._id}/members?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove member');

      const updatedProject = await response.json();
      onUpdate(updatedProject);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Members</h2>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {showAddMember && (
        <form onSubmit={handleAddMember} className="space-y-4 p-4 border rounded-lg">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={newMemberEmail}
              onChange={handleEmailChange}
              className="w-full rounded-md border p-2"
              required
            />
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full bg-background border rounded-md mt-1 shadow-lg"
              >
                {isSearching ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((email) => (
                    <div
                      key={email}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => handleSelectEmail(email)}
                    >
                      {email}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No matching users found
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="w-full rounded-md border p-2"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddMember(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 border hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
            >
              Add Member
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {project.members?.map((member) => (
          <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${member.role === 'editor' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>{member.email}</span>
              <span className="text-xs text-muted-foreground">({member.role})</span>
            </div>
            <button
              onClick={() => handleRemoveMember(member.userId)}
              className="p-2 hover:bg-destructive/10 rounded-full text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 