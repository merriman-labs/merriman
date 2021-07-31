/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatSize } from '../../../util/formatSize';
import MediaManager from '../../../managers/MediaManager';
import * as R from 'ramda';
import { withRouter } from 'react-router';
import { MediaItem } from '../../../../server/models';
import { useEffect } from 'react';

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

export const SingleUpload = withRouter((props) => {
  const [file, setFile] = useState<FileUpload | null>(null);
  const [uploadResult, setUploadResult] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (uploadResult) {
      props.history.push(`/media/edit/${uploadResult._id}`);
    }
  }, [uploadResult]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (!event.target.files) return;
    const [file] = [...event.target.files];
    setFile({ file, progress: 0 });
  };

  const handleProgressUpdate = (progress: number) => {
    setFile(R.assoc('progress', progress));
  };

  const handleUploadall = async () => {
    if (!file) return;
    const data = new FormData();
    data.append('file', file.file);
    const result = await MediaManager.upload(data, handleProgressUpdate);
    setUploadResult(result);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {file ? (
          <div className="mx-auto w-50 mt-5">
            <div className="list-group">
              <FileListItem
                file={file.file}
                removePending={() => setFile(null)}
                progress={file.progress}
              />
            </div>

            <div className="btn-group d-flex">
              <button
                className="btn btn-outline-success"
                onClick={handleUploadall}
              >
                Upload
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
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                Select media to upload
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
