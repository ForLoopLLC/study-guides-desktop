import { useEffect } from 'react';
import { useFileUpload, useManageFiles } from '../../hooks';
import { ParserOperationMode, ParserType } from '../../../enums';
import FileList from './FileList';
import { ImportFile, PreParserFeedback } from '../../../types';

interface FileUploadProps {
  parserType: ParserType;
}

const FileUpload: React.FC<FileUploadProps> = ({ parserType }) => {
  const { feedback, handleFileChange } = useFileUpload(parserType);
  const {
    feedback: fileManagementFeedback,
    files,
    listFiles,
    deleteFile,
    preParseFile,
  } = useManageFiles(parserType);

  useEffect(() => {
    listFiles();
  }, [feedback]);

  const handleDeleteFile = (file: ImportFile) => {
    deleteFile(file.path);
  };

  const handlePreParse = (file: ImportFile) => {
    preParseFile(file.path, parserType, ParserOperationMode.PreParse);
  };

  const isPreParserFeedback = (
    feedback: any,
  ): feedback is PreParserFeedback => {
    return feedback && Array.isArray(feedback.blocks);
  };

  useEffect(() => {
    if (isPreParserFeedback(fileManagementFeedback)) {
      console.log(
        JSON.stringify(fileManagementFeedback.result.blocks, null, 2),
      );
    }
  }, [fileManagementFeedback]);

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
      <section className="p-4">
        {fileManagementFeedback && fileManagementFeedback.success && (
          <p className="text-lg text-green-500">
            {fileManagementFeedback.message}
          </p>
        )}
        {fileManagementFeedback && !fileManagementFeedback.success && (
          <p className="text-lg text-red-500">
            {fileManagementFeedback.message}
          </p>
        )}
      </section>
      <section>
        <FileList
          files={files}
          onDelete={handleDeleteFile}
          onPreParse={handlePreParse}
        />
      </section>
    </main>
  );
};

export default FileUpload;
