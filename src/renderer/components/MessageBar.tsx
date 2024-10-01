import { useEffect, useState } from 'react';

interface MessageBarProps {
  totalPublished: number;
  totalAssisted: number;
  publishProcessing: boolean;
  assistProcessing: boolean;
  publishComplete: boolean;
  assistComplete: boolean;
  publishError: string;
  assistError: string;
  entityType: 'tags' | 'questions' | 'users';
}

const MessageBar: React.FC<MessageBarProps> = ({
  totalPublished,
  totalAssisted = 0,
  publishProcessing,
  assistProcessing = false,
  publishComplete,
  assistComplete = false,
  publishError = '',
  assistError = '',
  entityType,
}) => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Handle errors first (they are most critical)
    if (publishError) {
      setMessage(`Error: ${publishError}`);
    } else if (assistError) {
      setMessage(`Error: ${assistError}`);
    } 
    // Then handle processing states
    else if (publishProcessing) {
      setMessage(`Indexing in progress: (${totalPublished} ${entityType} published)`);
    } else if (assistProcessing) {
      setMessage(`Assisting in progress: (${totalAssisted} ${entityType} assisted)`);
    } 
    // Then handle completion
    else if (publishComplete) {
      setMessage(`Indexing complete! ${totalPublished} ${entityType} published.`);
    } else if (assistComplete) {
      setMessage(`Assist complete! ${totalAssisted} ${entityType} assisted.`);
    }
  }, [
    publishProcessing,
    assistProcessing,
    publishComplete,
    assistComplete,
    publishError,
    assistError,
    totalPublished,
    totalAssisted,
    entityType,
  ]);

  return (
    <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
      {message && <p className={message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}>{message}</p>}
    </section>
  );
};

export default MessageBar;
