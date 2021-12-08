import React, { useEffect, useState } from 'react';
import { FaFile } from 'react-icons/fa';
import { MediaItem } from '../../server/models';
import AdminManager from '../managers/AdminManager';

export const MigrationDashboard = () => {
  const [items, setItems] = useState<
    Array<MediaItem & { migrating?: boolean }>
  >([]);

  useEffect(loadItems, []);

  function migrateItem(mediaId: string) {
    setItems((media) =>
      media.map((item) =>
        item._id === mediaId ? { ...item, migrating: true } : item
      )
    );
    AdminManager.migrateItem(mediaId).then((_) => {
      loadItems();
    });
  }

  function loadItems() {
    AdminManager.getFSItems().then(setItems);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {items.map((item) => (
              <li className="list-group-item d-flex justify-content-between">
                <span className="d-block filelist-item">
                  <FaFile /> {item.name}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => migrateItem(item._id.toString())}
                >
                  Migrate
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
