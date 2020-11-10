import React from 'react';
import { Switch, Route } from 'react-router';
import AdminPanel from './admin/AdminPanel';
import { RegisterMedia } from './admin/RegisterMedia';
import SelectMedia from './admin/SelectMedia';
import Home from './Home';
import { MediaEdit } from './Media/Edit';
import { MediaByTag } from './Media/MediaByTag';
import Navigation from './Navigation';
import NewVideosPage from './NewVideos';
import RandomVideo from './RandomVideo';
import StandaloneMedia from './StandaloneMedia';
import VideoLibrariesPage from './VideoLibrariesPage';
import { UserInfo } from '../server/models/User/UserInfo';
import { Logout } from './Logout';
import { AuthProvider } from './context/UserContext';

export const AuthenticatedApp = () => {
  return (
    <>
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
        <Route exact path="/admin" component={AdminPanel} />
        <Route
          exact
          path="/admin/select-media/:library"
          component={SelectMedia}
        />
        <Route path="/admin/register-media" component={RegisterMedia} />
      </Switch>
    </>
  );
};
