import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Student } from '../types';
import { Phone, Search, Loader2, CheckCircle2, User, Sparkles, X, Users } from 'lucide-react';

export const ParentView: React.FC = () => {
  const [mobileInput, setMobileInput] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileInput.trim()) return;

    setLoading(true);
    setError('');
    setStudents([]);
    setShowResultsModal(false);

    try {
      const { data, error } = await supabase.rpc('match_parent_mobile', {
        search_number: mobileInput.trim(),
      });

      if (error) throw error;

      if (data) {
        setStudents(data as Student[]);
        if (data.length === 0) {
          setError('No students found linked to this number.');
        } else {
          setShowResultsModal(true);
        }
      }
    } catch (err: any) {
      console.error('Error searching students:', err);
      setError(err.message || 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCallAll = async () => {
    if (students.length === 0) return;
    setCalling(true);
    
    try {
      const now = new Date().toISOString();
      const ids = students.map(s => s.id);

      // Batch update all students found
      const { error } = await supabase
        .from('students')
        .update({ last_called_at: now })
        .in('id', ids);

      if (error) throw error;

      // Optimistic update
      setStudents((prev) =>
        prev.map((s) => ({ ...s, last_called_at: now }))
      );
    } catch (err: any) {
      console.error('Error calling students:', err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setCalling(false);
    }
  };

  const isCallRecent = (lastCalledAt: string | null) => {
    if (!lastCalledAt) return false;
    const diff = new Date().getTime() - new Date(lastCalledAt).getTime();
    return diff < 3 * 60 * 60 * 1000;
  };

  const allCalledRecently = students.length > 0 && students.every(s => isCallRecent(s.last_called_at));

  return (
    <div className="flex flex-col items-center">
      {/* Search Card */}
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 shadow-2xl shadow-indigo-900/10 mb-8 border border-white/60 relative overflow-hidden">
        {/* Decorative gradient inside card */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-5 shadow-lg shadow-blue-500/30 transform rotate-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">School Pickup System</h1>
          <p className="text-gray-500 font-medium">Enter the registered father mobile number</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-6 w-6 text-gray-600 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="number"
              className="block w-full pl-14 pr-4 py-4 bg-white/70 border border-gray-200 rounded-2xl text-lg placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none backdrop-blur-sm shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder=""
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !mobileInput}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            Find Students
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-xl text-center text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/50">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
              <button 
                onClick={() => setShowResultsModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-full shadow-md mb-3">
                   <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome Parent</h2>
                <p className="text-gray-500 text-sm mt-1">{students.length} Student{students.length > 1 ? 's' : ''} Found</p>
              </div>
            </div>

            {/* Students List */}
            <div className="p-6 space-y-3 max-h-[40vh] overflow-y-auto">
               {students.map((student) => {
                 const called = isCallRecent(student.last_called_at);
                 return (
                   <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${called ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <User className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-gray-800">{student.student_name}</h3>
                            <p className="text-xs text-gray-500 font-semibold bg-white px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">
                               {student.class_name}
                            </p>
                         </div>
                      </div>
                      {called && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                   </div>
                 )
               })}
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handleCallAll}
                disabled={allCalledRecently || calling}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                   allCalledRecently
                   ? 'bg-green-500 text-white cursor-default shadow-green-500/30'
                   : 'bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-gray-900/30'
                }`}
              >
                {calling ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : allCalledRecently ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Teachers Notified
                  </>
                ) : (
                  <>
                    <Phone className="w-6 h-6" />
                    Call All Students
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};