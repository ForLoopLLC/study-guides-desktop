import { useEffect } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserType } from '../../../enums';
import FileList from './FileList';
import { ImportFile } from '../../../types';

interface FileUploadProps {
  parserType: ParserType;
}

const FileUpload: React.FC<FileUploadProps> = ({ parserType }) => {
  const { feedback, handleFileChange } = useFileUpload(parserType);
  const { files, listFiles, deleteFile } = useManageFiles(parserType);

  useEffect(() => {
    listFiles();
  }, [feedback]);

  const handleDeleteFile = (file: ImportFile) => {
    deleteFile(file.path);
  };

  return (
    <main>
      <h2>Select your file</h2>
      <input type="file" onChange={handleFileChange} />
      <section className="p-4">
        {feedback && feedback.success && (
          <p className="text-lg text-green-500">{feedback.message}</p>
        )}
        {feedback && !feedback.success && (
          <p className="text-lg text-red-500">{feedback.message}</p>
        )}
      </section>
      <section>
        <FileList files={files} onDelete={handleDeleteFile} />
      </section>
    </main>
  );
};

export default FileUpload;
