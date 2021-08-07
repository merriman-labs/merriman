import React from 'react';
import { Link } from 'react-router-dom';

export type FileUpload = {
  progress: number;
  file: File;
  name: string;
  tags: Array<string>;
};

export const UploadWizard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
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
      </div>
    </div>
  );
};
