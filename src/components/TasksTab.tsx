import React, { useState } from 'react';
import { TaskItem } from '../types';
import { pad2 } from '../utils/time';
import { Trash2, Plus } from 'lucide-react';

interface TasksTabProps {
  tasks: TaskItem[];
  onAdd: (title: string) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  toast: (msg: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  toast,
}) => {
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast('请输入任务内容');
      return;
    }
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle('');
      toast('已添加任务');
    } catch (err: any) {
      toast(err.message || '添加失败');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredList = tasks.filter(t => {
    if (filter === 'todo') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.done).length;

  return (
    <div className="space-y-4 pb-6">
      {/* Title */}
      <div className="flex items-end justify-between border-b-[2.5px] border-[#e9e4d8] pb-2">
        <div>
          <div className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-wide text-[#e9e4d8]">
            个人任务
          </div>
          <div className="text-[9.5px] font-mono tracking-[3px] text-[#8f8b80] mt-0.5">
            TASKS & TODOS
          </div>
        </div>
        <div className="font-editorial italic text-xs text-[#8f8b80]">
          {pendingCount} 项待办
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-[#24262c] p-3 border border-[#33363d] rounded flex gap-2">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="要做的事，如：去操场跑步 3 公里"
          className="flex-1 bg-transparent border-b-2 border-[#e9e4d8] text-sm text-[#e9e4d8] py-1 px-1 outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 bg-[#e9e4d8] hover:bg-[#6b7cff] text-[#1d1f24] hover:text-white font-bold text-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Filters */}
      <div className="flex border-b-2 border-[#e9e4d8] text-xs font-semibold">
        {(['all', 'todo', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-2 px-4 transition-colors relative cursor-pointer ${
              filter === f ? 'text-[#e9e4d8] font-bold' : 'text-[#8f8b80]'
            }`}
          >
            {f === 'all' ? '全部' : f === 'todo' ? '未完成' : '已完成'}
            {filter === f && (
              <span className="absolute left-2 right-2 -bottom-0.5 h-0.5 bg-[#6b7cff]" />
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredList.length === 0 ? (
        <div className="py-12 text-center text-[#63605a] font-editorial italic text-sm">
          — 暂无待办任务，添加一个吧 —
        </div>
      ) : (
        <div className="divide-y divide-[#2a2d34]">
          {filteredList.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-3 transition-opacity ${
                item.done ? 'opacity-40' : ''
              }`}
            >
              <span className="font-editorial italic text-xs text-[#63605a] w-5 pt-1 text-right shrink-0">
                {pad2(idx + 1)}
              </span>

              <button
                onClick={() => onToggle(item.id)}
                className={`w-5 h-5 border-2 border-[#e9e4d8] mt-0.5 flex items-center justify-center shrink-0 text-xs font-bold transition-colors cursor-pointer ${
                  item.done ? 'bg-[#e9e4d8] text-[#1d1f24]' : 'bg-transparent text-transparent'
                }`}
              >
                ✓
              </button>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold ${
                    item.done ? 'line-through text-[#8f8b80]' : 'text-[#e9e4d8]'
                  }`}
                >
                  {item.title}
                </div>
                <div className="mt-1">
                  {item.done ? (
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#e9e4d8] text-[#1d1f24] font-bold">
                      已完成
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 border border-[#6b7cff] text-[#6b7cff] font-bold">
                      进行中
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-[#63605a] hover:text-[#ff6b57] transition-colors cursor-pointer shrink-0"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
