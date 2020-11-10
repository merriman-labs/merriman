import React, { useEffect, useState } from 'react';
import { FaFile, FaFolder } from 'react-icons/fa';
import {
  DirectoryItem,
  ListDirectoryResult
} from '../../server/models/ListDirectoryResult';
import ServerManager from '../managers/ServerManager';

export const RegisterMedia = () => {
  const [result, setResult] = useState<ListDirectoryResult | null>(null);
  const [selected, setSelected] = useState<Array<DirectoryItem>>([]);

  useEffect(
    () => {
      const effect = async () => {
        const response = await ServerManager.listDirectory();
        setResult(response);
      };
      effect();
    }
  );

  const isInSelected = (file: DirectoryItem) =>
    selected.some(item => item.fullPath === file.fullPath);

  const handlePathClick = async (path: string) => {
    const result = await ServerManager.listDirectory(encodeURIComponent(path));
    setResult(result);
  };

  const handleFileClick = async (file: DirectoryItem) => {
    const exists = isInSelected(file);
    if (exists) {
      const items = selected.filter(item => item.fullPath !== file.fullPath);
      return setSelected(items);
    } else {
      return setSelected(selected.concat(file));
    }
  };

  return result === null ? (
    <h2>No directory selected</h2>
  ) : (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h4>{result.path}</h4>
          {result.files.map(item =>
            item.isDirectory ? (
              <span
                className="d-block"
                onClick={() => handlePathClick(item.fullPath)}
              >
                <FaFolder /> {item.name}
              </span>
            ) : (
              <span className="d-block" onClick={() => handleFileClick(item)}>
                <FaFile /> {item.name}
              </span>
            )
          )}
        </div>
        <div className="col-md-6">
          <h4>Selected</h4>
          {selected.map(item => (
            <span className="d-block" onClick={() => handleFileClick(item)}>
              <FaFile /> {item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
