import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import AdminPanel from './admin/AdminPanel';
import { RegisterMedia } from './admin/RegisterMedia';
import Home from './Home';
import { MediaEdit } from './Media/Edit';
import { MediaByTag } from './Media/MediaByTag';
import Navigation from './Navigation';
import NewVideosPage from './NewVideos';
import RandomVideo from './RandomVideo';
import StandaloneMedia from './StandaloneMedia';
import VideoLibrariesPage from './VideoLibrariesPage';
import { Logout } from './Logout';
import AdminNavigation from './admin/AdminNavigation';
import { RequestLogs } from './admin/RequestLogs';

export const AuthenticatedApp = () => {
  return (
    <>
      <Switch>
        <Route path="/admin">
          <AdminNavigation />
          <Route exact path="/admin" component={AdminPanel} />
          <Route path="/admin/register-media" component={RegisterMedia} />
          <Route path="/admin/request-logs" component={RequestLogs} />
        </Route>
        <Route path="/">
          <Navigation />
          <Switch>
            <Route path="/random" component={RandomVideo} />
            <Route path="/media/new" component={NewVideosPage} exact />
            <Route path="/media/edit/:id" component={MediaEdit} exact />
            <Route path="/media/tag/:tag" component={MediaByTag} exact />
            <Route path="/media/:media" component={StandaloneMedia} exact />
            <Route
              path="/videos/:library?/:video?"
              component={VideoLibrariesPage}
            />
            <Route path="/logout" component={Logout} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Route>
      </Switch>
    </>
  );
};
