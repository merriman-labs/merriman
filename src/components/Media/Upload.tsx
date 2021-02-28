import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatSize } from '../../util/formatSize';
import MediaManager from '../../managers/MediaManager';

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
      <div className="d-inline-flex align-items-start flex-column w-75">
        {file.name}

        <small>{formatSize(file.size)}</small>

        <small>{file.type}</small>
      </div>
      <div className="d-inline-flex align-items-end flex-column w-25">
        <button
          className="btn btn-outline-danger mr-2"
          onClick={() => removePending(file)}
        >
          <FaTrash />
        </button>
      </div>

      <div className="progress position-relative mt-3 mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <small className="justify-content-center d-flex position-absolute w-100">
            {progress + '%'}
          </small>
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

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {files.length ? (
          <div className="mx-auto w-50 mt-5">
            <div className="list-group">
              {files.map(({ file, progress }) => (
                <FileListItem
                  file={file}
                  removePending={removePending}
                  progress={progress}
                />
              ))}
            </div>

            <div className="btn-group d-flex">
              <button
                className="btn btn-outline-success"
                onClick={handleUploadall}
              >
                Upload All
              </button>
              <button className="btn btn-outline-success" onClick={clearFiles}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-5">
            <div className="form-group">
              <label className="btn btn-outline-success btn-file">
                <input
                  type="file"
                  className="form-control-file"
                  name="files"
                  id="files"
                  multiple
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                Upload Media
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
