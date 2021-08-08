import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaFile, FaFolder } from 'react-icons/fa';
import { Library, MediaItem } from '../../server/models';
import {
  DirectoryItem,
  ListDirectoryResult
} from '../../server/models/ListDirectoryResult';
import { LibrarySelector } from '../components/LibrarySelector';
import { TagInput } from '../components/TagInput';
import MediaManager from '../managers/MediaManager';
import ServerManager from '../managers/ServerManager';

export const RegisterMedia = () => {
  const [result, setResult] = useState<ListDirectoryResult | null>(null);
  const [selected, setSelected] = useState<Array<DirectoryItem>>([]);
  const [tags, updateTags] = useState<Array<string>>([]);
  const [libraries, setLibraries] = useState<Array<Library>>([]);
  const [completed, setCompleted] = useState<Array<MediaItem>>([]);
  const handleRegisterAllClick = async () => {
    for (let item of selected) {
      const result = await MediaManager.registerLocal(
        { filename: item.name, path: item.directoryPath },
        libraries,
        tags
      );
      setCompleted((items) => items.concat(result));
    }
  };

  useEffect(() => {
    const effect = async () => {
      const response = await ServerManager.listDirectory();
      setResult(response);
    };
    effect();
  }, []);

  const isInSelected = (file: DirectoryItem) =>
    selected.some((item) => item.fullPath === file.fullPath);

  const isInCompleted = (file: DirectoryItem) =>
    completed.some(
      (item) => item.filename === file.name && item.path === file.directoryPath
    );

  const handlePathClick = async (path: string) => {
    const result = await ServerManager.listDirectory(encodeURIComponent(path));
    setResult(result);
  };

  const handleFileClick = async (file: DirectoryItem) => {
    const exists = isInSelected(file);
    if (exists) {
      const items = selected.filter((item) => item.fullPath !== file.fullPath);
      return setSelected(items);
    } else {
      return setSelected(selected.concat(file));
    }
  };

  const showDriveLetterSelector = () => {
    return /^[A-Z]:\\$/.test(result?.path ?? '');
  };

  const selectAll = () => {
    if (result?.files) {
      setSelected(
        selected.concat(result.files.filter((item) => !item.isDirectory))
      );
    }
  };
  const unselectAll = () => {
    if (result?.files) {
      setSelected(
        R.differenceWith((a, b) => a.fullPath === b.fullPath, selected)
      );
    }
  };

  return result === null ? (
    <h2>No directory selected</h2>
  ) : (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h4>
            {showDriveLetterSelector() ? (
              <div className="form-group">
                <label htmlFor="drive-selector">Drive</label>
                <select
                  className="form-control"
                  id="drive-selector"
                  value={result.path}
                  onChange={(evt) => handlePathClick(evt.target.value)}
                >
                  <option value="C:\">C:\</option>
                  <option value="D:\">D:\</option>
                  <option value="E:\">E:\</option>
                  <option value="F:\">F:\</option>
                  <option value="G:\">G:\</option>
                </select>
              </div>
            ) : (
              result.path
            )}
          </h4>
          <div>
            <button className="btn btn-outline-info" onClick={selectAll}>
              Select All
            </button>
            <button className="btn btn-outline-warning" onClick={unselectAll}>
              Unselect All
            </button>
          </div>
          {result.files.map((item) =>
            item.isDirectory ? (
              <span
                className="d-block filelist-item"
                onClick={() => handlePathClick(item.fullPath)}
              >
                <FaFolder /> {item.name}
              </span>
            ) : (
              <span
                className={
                  'd-block filelist-item' +
                  (isInSelected(item) ? ' selected' : '')
                }
                onClick={() => handleFileClick(item)}
              >
                <FaFile /> {item.name}
              </span>
            )
          )}
        </div>
        <div className="col-md-6">
          <h4>Selected</h4>
          {selected.map((item) => (
            <span
              className="d-block filelist-item"
              onClick={() => handleFileClick(item)}
            >
              {isInCompleted(item) ? <FaCheckCircle /> : <FaFile />} {item.name}
            </span>
          ))}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <h4>Set tags</h4>
          <TagInput updateTags={updateTags} tags={tags} />
        </div>
        <div className="col-md-6">
          <h4>Add to libraries</h4>
          <LibrarySelector
            selectedLibraries={libraries}
            setSelectedLibraries={setLibraries}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <button
            className="btn btn-outline-success btn-block"
            onClick={handleRegisterAllClick}
          >
            Register All
          </button>
        </div>
      </div>
    </div>
  );
};
