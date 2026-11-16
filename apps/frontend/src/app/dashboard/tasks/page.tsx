'use client';

import React, { useState } from 'react';
import {
  Plus,
  Clock,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'MEXT Japan' | 'Australia Awards' | 'Documents' | 'Tests & Exams' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  priorityColor: string;
  deadline: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Finalize Field of Study & Research Plan for MEXT Japan',
    category: 'MEXT Japan',
    priority: 'High',
    priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
    deadline: 'May 10, 2026',
    completed: false,
  },
  {
    id: 't-2',
    title: 'Collect Dean’s Letter of Recommendation from Tribhuvan University',
    category: 'Documents',
    priority: 'High',
    priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
    deadline: 'May 12, 2026',
    completed: true,
  },
  {
    id: 't-3',
    title: 'Medical Health Examination at Sukraraj Tropical Hospital',
    category: 'MEXT Japan',
    priority: 'High',
    priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
    deadline: 'May 13, 2026',
    completed: false,
  },
  {
    id: 't-4',
    title: 'Submit physical dossier to Embassy of Japan in Panipokhari',
    category: 'MEXT Japan',
    priority: 'High',
    priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
    deadline: 'May 15, 2026',
    completed: false,
  },
  {
    id: 't-5',
    title: 'Complete Australia Awards OASIS Online Portal Submission',
    category: 'Australia Awards',
    priority: 'Medium',
    priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
    deadline: 'Apr 30, 2026',
    completed: true,
  },
  {
    id: 't-6',
    title: 'Get academic transcript verification stamp from Ministry of Education (Sanothimi)',
    category: 'Documents',
    priority: 'Medium',
    priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
    deadline: 'May 18, 2026',
    completed: false,
  },
];

export default function TasksAndChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: 'General',
      priority: 'Medium',
      priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
      deadline: 'May 25, 2026',
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
            Milestone Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Tasks & Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track document preparations, embassy visits, and application requirements without missing deadlines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress & Quick Filters */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-900">
            Checklist Progress: {completedCount} of {tasks.length} Completed
          </p>
          <p className="text-[11px] text-slate-500">
            {tasks.length - completedCount} tasks remaining for upcoming embassy & portal deadlines.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Pending ({tasks.length - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Add Task Quick Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task description (e.g. Request recommendation from Department Head)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-purple-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#4b37df]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 cursor-pointer transition-all ${
              task.completed
                ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="w-4 h-4 rounded-md border-slate-300 text-[#4b37df] focus:ring-[#4b37df] cursor-pointer"
              />
              <div className="min-w-0 flex-1">
                <p className={`font-medium text-xs sm:text-sm truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600">{task.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    Due {task.deadline}
                  </span>
                </div>
              </div>
            </div>

            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border shrink-0 ${task.priorityColor}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
