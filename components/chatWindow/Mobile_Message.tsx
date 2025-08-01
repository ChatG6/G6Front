"use client";
import { Modal } from 'antd';
import classNames from 'classnames';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import eventEmitter from '../../app/utils/eventEmitter';
import Loading from './Loading';
import { Book, MessageSquare, User } from 'lucide-react';

interface MessageProps extends PropsWithChildren {
  isQuestion?: boolean;
  loading?: boolean;
  references?: { id: number; content: string; page_num: number }[];
  text: string;
}

const Message: FC<MessageProps> = ({ text = '', isQuestion, references = [], loading }) => {
  const [words, setWords] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Only split the text for AI responses to apply the animation
    if (!isQuestion) {
      setWords(text.split(' '));
    }
  }, [text, isQuestion]);

  if (loading) {
    return (
        <div className="flex items-center gap-3 self-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
            <Loading />
        </div>
    );
  }

  const onPageNumClick = (num: number) => {
    eventEmitter.emit('scrollToPage', num);
    setIsModalVisible(false); // Close modal after clicking a page number
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={classNames('flex w-full items-start gap-3', isQuestion ? 'justify-end' : 'justify-start')}>
        {/* Avatar for AI response */}
        {!isQuestion && (
             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <MessageSquare className="h-5 w-5 text-gray-900" />
            </div>
        )}

      <div 
      style={{backgroundColor:isQuestion ?"#545CEB":"#eaecf0"}}
      className={classNames('flex max-w-[85%] flex-col rounded-lg px-3 py-2', isQuestion ? 'rounded-br-none text-white' : 'rounded-bl-none  text-gray-900 border border-gray-200')}>
        
        {/* Text content area */}
        {/* MODIFIED: Added text-gray-900 for visibility */}
        <div className="pb-2 text-base text-left">
            {isQuestion ? (
                <span className="text-white">{text}</span>
            ) : (
                // Animated text for AI response
                words.map((word, index) => (
                <span
                    key={index}
                    className="text-gray-900 animate-fade-in"
                    style={{ animationDelay: `${index * 0.01}s` }}
                >
                    {word}{' '}
                </span>
                ))
            )}
        </div>

        {/* References button and modal */}
        {references.length > 0 && (
          <div className="mt-2 border-t border-gray-200/80 pt-2 text-right">
            <button onClick={showModal} className="text-xs font-medium text-gray-500 hover:text-gray-800">
              {references.length} References
            </button>
            <Modal
              title="References"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              style={{ maxHeight: '60vh', overflow: 'auto' }}
              centered
            >
                {/* MODIFIED: Wrapped content in a div with scrolling classes for robust scrolling */}
                <div className="max-h-[60vh] overflow-auto pr-2">
                    {references.map((item, index) => (
                      <div key={index} className="mb-3 rounded-md border p-3 transition-colors hover:bg-gray-50">
                        <a onClick={() => onPageNumClick(item.page_num)} className="flex cursor-pointer items-center gap-2 text-blue-600 hover:underline">
                          <Book className="h-4 w-4" />
                          <span className="font-semibold">Page {item.page_num}</span>
                        </a>
                        <p className="mt-1.5 text-xs text-gray-600">{item.content}</p>
                      </div>
                    ))}
                </div>
            </Modal>
          </div>
        )}
      </div>

        {/* Avatar for user question */}
        {isQuestion && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{backgroundColor:isQuestion ?"#545CEB":"#eaecf0"}}
            >
                <User className="h-5 w-5 text-white" />
            </div>
        )}
    </div>
  );
};

export default Message;
