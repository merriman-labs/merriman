import React, { useEffect, useState } from 'react';
import { RequestLogResponse } from '../../server/models';
import AdminManager from '../managers/AdminManager';
import moment from 'moment';
import * as R from 'ramda';
import { useLocation } from 'react-router';
import { parseQueryString } from '../util/parseQueryString';
import { Link } from 'react-router-dom';
import { c } from '../util/classList';

export const RequestLogs = () => {
  const params = useLocation();
  const query = parseQueryString<'page'>(params.search);
  const [logs, setLogs] = useState<Array<RequestLogResponse>>([]);
  const [page, setPage] = useState<number>(+query.page || 0);
  useEffect(() => {
    const query = parseQueryString<'page'>(params.search);
    const newPageNum = +query.page || 0;
    setPage(newPageNum);
    const getLogs = async () => {
      const requestLogs = await AdminManager.getRequestLogs(
        newPageNum * 25,
        25
      );
      setLogs(requestLogs);
    };
    getLogs();
  }, [params.search]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <table className="table table-dark table-hover table-sm">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Method</th>
                <th scope="col">URL</th>
                <th scope="col">Remote Address</th>
                <th scope="col">Status</th>
                <th scope="col">Username</th>
                <th scope="col">Response Time (ms)</th>
                <th scope="col">Content Length</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(
                ({
                  _id,
                  date,
                  method,
                  url,
                  remoteAddr,
                  status,
                  user,
                  responseTimeMs,
                  contentLength
                }) => (
                  <tr key={_id}>
                    <th scope="row">{moment(date).format('MM/DD HH:mm:ss')}</th>
                    <td>{method}</td>
                    <td>{url}</td>
                    <td>{remoteAddr}</td>
                    <td>{status}</td>
                    <td>{user?.username ?? '--'}</td>
                    <td>{responseTimeMs.toFixed(1)}</td>
                    <td>{contentLength}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={c({ 'page-item': true, disabled: page === 0 })}>
                <Link
                  className="page-link"
                  to={`/admin/request-logs?page=${page - 1}`}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </Link>
              </li>
              {R.range(R.clamp(0, page, page - 3), R.clamp(0, page, page - 3) + 8).map(
                (pageNumber) => (
                  <li className={c({ 'page-item': true, active: pageNumber === page })}>
                    <Link
                      className="page-link"
                      to={`/admin/request-logs?page=${pageNumber}`}
                    >
                      {pageNumber}
                    </Link>
                  </li>
                )
              )}
              <li className="page-item">
                <Link
                  className="page-link"
                  to={`/admin/request-logs?page=${page + 1}`}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
