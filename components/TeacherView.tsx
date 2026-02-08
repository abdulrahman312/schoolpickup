import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Student } from '../types';
import { LogOut, RefreshCw, AlertCircle, Volume2, School, Bus } from 'lucide-react';

interface TeacherViewProps {
  onLogout: () => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ onLogout }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-logout effect: Automatically logout after 1 hour to save resources
  useEffect(() => {
    const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
    
    const timer = setTimeout(() => {
      onLogout();
    }, SESSION_DURATION);

    return () => clearTimeout(timer);
  }, [onLogout]);

  const isActive = (student: Student) => {
    if (!student.last_called_at) return false;
    const diff = new Date().getTime() - new Date(student.last_called_at).getTime();
    return diff < 3 * 60 * 60 * 1000;
  };

  const isBusStudent = (student: Student) => {
    return student.bus_status && student.bus_status.toUpperCase() !== 'NO';
  };

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMsg('');
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('class_name', { ascending: true })
      .order('student_name', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      setErrorMsg(error.message);
    } else if (data) {
      setStudents(data as Student[]);
      if (!activeTab && data.length > 0) {
        setActiveTab((data[0] as Student).class_name);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();

    const channel = supabase
      .channel('public:students')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'students' },
        (payload) => {
          const updatedStudent = payload.new as Student;
          setStudents((prev) =>
            prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const classes = Array.from(new Set(students.map((s) => s.class_name))).sort();
  const filteredStudents = students.filter((s) => s.class_name === activeTab);

  return (
    <div className="flex flex-col h-screen bg-gray-50/50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Dashboard Header */}
      <header className="glass-panel sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-white/50">
        <div className="flex justify-between items-center w-full px-2">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/bgFrgXkW/meis.png" className="h-10 w-auto drop-shadow-md" alt="Logo" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Teacher Dashboard</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Real-time Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
               onClick={fetchStudents}
               className="p-2 bg-white/50 hover:bg-white text-gray-600 hover:text-indigo-600 rounded-lg transition-all border border-transparent hover:border-indigo-100 shadow-sm"
               title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-4 py-2 rounded-lg shadow-lg shadow-red-500/20 transition-all hover:scale-105"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full px-2">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setActiveTab(cls)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === cls
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-white/70 text-gray-600 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100 backdrop-blur-sm'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="relative">
                 <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 font-medium text-sm">Loading class data...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col justify-center items-center h-64 text-red-500 gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="font-medium text-base">System Error</p>
              <p className="text-xs text-gray-600 bg-white px-3 py-1.5 rounded border border-red-100">{errorMsg}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-400 gap-4">
              <div className="p-4 bg-white/50 rounded-full border border-dashed border-gray-300">
                <School className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-base font-medium">No students found in Class {activeTab}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 pb-20">
              {filteredStudents.map((student) => {
                const active = isActive(student);
                const isBus = isBusStudent(student);
                
                // Card styling based on state
                let cardStyle = 'bg-white/80 border-white/50 text-gray-800 hover:bg-white hover:shadow-lg hover:shadow-indigo-900/5 hover:-translate-y-0.5 backdrop-blur-sm';
                if (active) {
                  cardStyle = 'bg-gradient-to-br from-green-500 to-emerald-600 border-transparent text-white shadow-lg shadow-green-500/30 z-10';
                } else if (isBus) {
                  cardStyle = 'bg-gradient-to-br from-blue-500 to-cyan-600 border-transparent text-white shadow-lg shadow-blue-500/30';
                }

                return (
                  <div
                    key={student.id}
                    className={`relative p-4 rounded-xl border transition-all duration-500 group flex flex-col justify-between h-full min-h-[100px] ${cardStyle}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-sm font-bold leading-tight break-words w-full ${active || isBus ? 'text-white' : 'text-gray-900'}`}>
                        {student.student_name}
                      </h3>
                      {active && (
                         <div className="ml-2 p-1 bg-white/20 rounded backdrop-blur-md animate-pulse shrink-0">
                           <Volume2 className="w-3 h-3 text-white" />
                         </div>
                      )}
                      {!active && isBus && (
                        <div className="ml-2 p-1 bg-white/20 rounded backdrop-blur-md shrink-0">
                          <Bus className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        active || isBus
                          ? 'bg-white/20 text-white backdrop-blur-sm' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {active ? 'Waiting' : isBus ? 'Bus Student' : 'In Class'}
                      </div>
                      
                      {active && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};