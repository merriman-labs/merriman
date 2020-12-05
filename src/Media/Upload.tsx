import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatSize } from '../util/formatSize';
import * as axios from 'axios';
import MediaManager from '../managers/MediaManager';

type FileUpload = {
  progress: number;
  file: File;
};

const FileListItem = ({
  file,
  removePending,
  progress
}: {
  file: File;
  removePending: (file: File) => void;
  progress: number;
}) => {
  return (
    <div className="list-group-item">
      <button
        className="btn btn-outline-danger mr-2"
        onClick={() => removePending(file)}
      >
        <FaTrash />
      </button>
      {file.name} {formatSize(file.size)} {file.type}
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {progress + '%'}
        </div>
      </div>
    </div>
  );
};

export const Upload = () => {
  const [files, setFiles] = useState<Array<FileUpload>>([]);
  const removePending = (file: File) => {
    setFiles(files.filter((f) => f.file.name !== file.name));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (!event.target.files) return;
    const fs = [...event.target.files];
    const items = fs.map((file) => ({ file, progress: 0 }));
    setFiles(items);
  };

  const handleProgressUpdate = (file: File) => (progress: number) => {
    setFiles((files) =>
      files.map((f) => (f.file.name === file.name ? { ...f, progress } : f))
    );
  };

  const handleUploadall = () => {
    files.forEach(async (file) => {
      const data = new FormData();
      data.append('file', file.file);
      await MediaManager.upload(data, handleProgressUpdate(file.file));
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="files">Select file(s)</label>
            <input
              type="file"
              className="form-control-file"
              name="files"
              id="files"
              multiple
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="list-group">
            {files.map(({ file, progress }) => (
              <FileListItem
                file={file}
                removePending={removePending}
                progress={progress}
              />
            ))}
          </div>
          {files.length ? (
            <button
              className="btn btn-outline-success btn-block"
              onClick={handleUploadall}
            >
              Upload All
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
