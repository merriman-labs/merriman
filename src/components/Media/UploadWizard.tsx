import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatSize } from '../../util/formatSize';
import MediaManager from '../../managers/MediaManager';
import { Link } from 'react-router-dom';

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

export const UploadWizard = () => {
  const [files, setFiles] = useState<Array<FileUpload>>([]);
  const removePending = (file: File) => {
    setFiles(files.filter((f) => f.file.name !== file.name));
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
          <div className="mt-3 ml-4">
            <h2>What kind of file(s) do you want to upload?</h2>
            <div className="d-grid gap-2">
              <Link
                to="/media/upload/single"
                className="btn btn-outline-light btn-block"
              >
                One file
              </Link>
              <Link
                to="/media/upload/multi"
                className="btn btn-outline-light btn-block"
              >
                Multiple unrelated files
              </Link>
              <Link
                to="/media/upload/library"
                className="btn btn-outline-light btn-block"
              >
                Multiple related files (library)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
