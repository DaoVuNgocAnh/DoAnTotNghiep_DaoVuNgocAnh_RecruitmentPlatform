import { useMemo, useState } from 'react';
import { Bot, Headphones, Send, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/modules/user/hooks/useUser';
import { cn } from '@/lib/utils';
import { getSupportRole, supportTopics } from './supportKnowledge';

type Message = {
  id: number;
  from: 'bot' | 'user';
  content: string;
};

export const SupportChatWidget = () => {
  const { data: user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'bot',
      content:
        'Xin chào, tôi là trợ lý SmartCV. Bạn chọn nhanh một chủ đề bên dưới hoặc nhập câu hỏi ngắn.',
    },
  ]);
  const [input, setInput] = useState('');
  const role = getSupportRole(user);
  const topics = useMemo(
    () => supportTopics.filter((topic) => topic.roles.includes(role)),
    [role],
  );

  const addTopicAnswer = (topicId: string) => {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), from: 'user', content: topic.label },
      { id: Date.now() + 1, from: 'bot', content: topic.answer(user) },
    ]);
  };

  const handleAsk = () => {
    const question = input.trim();
    if (!question) return;

    const normalized = question.toLowerCase();
    const matched = topics.find((topic) =>
      normalized
        .split(/\s+/)
        .some((word) => topic.label.toLowerCase().includes(word)),
    );

    setMessages((current) => [
      ...current,
      { id: Date.now(), from: 'user', content: question },
      {
        id: Date.now() + 1,
        from: 'bot',
        content: matched
          ? matched.answer(user)
          : 'Tôi chưa có câu trả lời chính xác cho câu hỏi này. Bạn có thể gửi góp ý hoặc liên hệ hotline 1900 123 456 để được hỗ trợ trực tiếp.',
      },
    ]);
    setInput('');
  };

  return (
    <div className="flex h-[520px] max-h-[70vh] flex-col overflow-hidden rounded-3xl bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-5 py-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
          <Headphones size={20} />
        </div>
        <div>
          <p className="text-sm font-black uppercase">Hỗ trợ SmartCV</p>
          <p className="text-[11px] font-medium text-slate-300">
            Ngữ cảnh: {role === 'EMPLOYER' ? 'Nhà tuyển dụng' : role === 'CANDIDATE' ? 'Ứng viên' : 'Khách'}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-2',
              message.from === 'user' && 'justify-end',
            )}
          >
            {message.from === 'bot' && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={15} />
              </div>
            )}
            <div
              className={cn(
                'max-w-[82%] rounded-2xl px-3 py-2 text-sm font-medium leading-6 shadow-sm',
                message.from === 'bot'
                  ? 'bg-white text-slate-600'
                  : 'bg-primary text-white',
              )}
            >
              {message.content}
            </div>
            {message.from === 'user' && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <UserRound size={15} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {topics.slice(0, 5).map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => addTopicAnswer(topic.id)}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-600 transition-colors hover:bg-primary hover:text-white"
            >
              {topic.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleAsk()}
            placeholder="Nhập câu hỏi..."
            className="h-11 rounded-2xl bg-slate-50 font-medium"
          />
          <Button onClick={handleAsk} className="h-11 rounded-2xl px-4">
            <Send size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
};
