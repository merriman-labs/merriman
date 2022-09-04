import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatSize } from '../../../util/formatSize';
import MediaManager from '../../../managers/MediaManager';
import * as R from 'ramda';
import { TagInput } from '../../TagInput';
import { LibrarySelector } from '../../LibrarySelector';
import { Library } from '../../../../server/models';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd';

type FileUpload = {
  progress: number;
  file: File;
  name: string;
  tags: Array<string>;
};

const FileListItem = ({
  upload,
  removePending,
  setMetadata
}: {
  upload: FileUpload;
  removePending: (file: File) => void;
  setMetadata: (file: FileUpload) => void;
}) => {
  return (
    <div className="list-group-item">
      <div className="d-inline-flex align-items-start flex-column w-50">
        <div className="input-group">
          <input
            value={upload.name}
            onChange={(e) => {
              setMetadata(R.assoc('name', e.target.value, upload));
            }}
            className="form-control upload-title"
          />
        </div>

        <small>{formatSize(upload.file.size)}</small>

        <small>{upload.file.type}</small>
        <TagInput
          tags={upload.tags}
          updateTags={(tags) => setMetadata(R.assoc('tags', tags, upload))}
        />
      </div>
      <div className="d-inline-flex align-items-end flex-column w-50">
        <button
          className="btn btn-outline-danger mr-2"
          onClick={() => removePending(upload.file)}
          disabled={upload.progress > 0}
        >
          <FaTrash />
        </button>
      </div>

      <div className="progress position-relative mt-3 mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${upload.progress}%` }}
          aria-valuenow={upload.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <small className="justify-content-center d-flex position-absolute w-100">
            {upload.progress + '%'}
          </small>
        </div>
      </div>
    </div>
  );
};

export const MultiUpload = () => {
  const [files, setFiles] = useState<Array<FileUpload>>([]);
  const [isBulkTagging, setIsBulkTagging] = useState(false);
  const [bulkTags, setBulkTags] = useState<Array<string>>([]);
  const [selectedLibraries, setSelectedLibraries] = useState<Array<Library>>(
    []
  );

  const removePending = (file: File) => {
    setFiles(files.filter((f) => f.file.name !== file.name));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (!event.target.files) return;
    const fs = [...event.target.files];
    const items = fs.map((file) => ({
      file,
      progress: 0,
      name: file.name,
      tags: []
    }));
    setFiles(items);
  };

  const handleProgressUpdate = (file: File) => (progress: number) => {
    setFiles((files) =>
      files.map((f) => (f.file.name === file.name ? { ...f, progress } : f))
    );
  };

  const handleUploadall = async () => {
    for (let file of files) {
      const data = new FormData();
      data.append('file', file.file);
      data.append(
        'info',
        JSON.stringify({
          name: file.name,
          tags: file.tags,
          libraryIds: selectedLibraries.map(R.prop('_id'))
        })
      );
      await MediaManager.upload(data, handleProgressUpdate(file.file));
    }
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const setAllTags = (tags: Array<string>) => {
    setFiles(R.map(R.assoc('tags', tags)));
    setBulkTags(tags);
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }
    setFiles(R.move(result.source.index, result.destination?.index));
  };
  return (
    <div className="container-fluid">
      <div className="row">
        {files.length ? (
          <div className="col-6 col-sm-12 mt-5">
            <div className="list-group">
              <div className="list-group-item">
                <h3 className="h5">Add to library</h3>
                <LibrarySelector
                  selectedLibraries={selectedLibraries}
                  setSelectedLibraries={setSelectedLibraries}
                />
              </div>
              <div className="list-group-item">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sync-tags"
                    checked={isBulkTagging}
                    onChange={(e) => setIsBulkTagging(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="sync-tags">
                    Bulk tag
                  </label>
                </div>
                {isBulkTagging && (
                  <TagInput tags={bulkTags} updateTags={setAllTags} />
                )}
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="upload-queue">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {files.map((upload, index) => (
                        <Draggable
                          key={upload.file.name}
                          draggableId={upload.file.name}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <FileListItem
                                upload={upload}
                                removePending={removePending}
                                setMetadata={(file) => {
                                  setFiles(R.update(index, file));
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
          <div className="col-6 col-sm-12 mx-auto mt-5">
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
                Select media to upload
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
