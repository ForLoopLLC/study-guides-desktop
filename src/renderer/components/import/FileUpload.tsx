import { useEffect } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserType } from '../../../enums';

interface FileUploadProps {
  parserType: ParserType;
}

const FileUpload: React.FC<FileUploadProps> = ({ parserType }) => {
  const { feedback, handleFileChange } = useFileUpload(parserType);
  const { files, listFiles, deleteFile } = useManageFiles(parserType);

  useEffect(() => {
    listFiles();
  }, [feedback]);

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
        {files.length > 0 ? (
          <div>
            <h2>Files</h2>
            <ul>
              {files.map((file) => (
                <li key={file.path}>
                  <span>{file.name}</span>
                  <button onClick={() => deleteFile(file.path)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>No files</div>
        )}
      </section>
    </main>
  );
};

export default FileUpload;
