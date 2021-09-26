import React from 'react';
import { Switch, Route } from 'react-router';
import AdminPanel from './admin/AdminPanel';
import { RegisterMedia } from './admin/RegisterMedia';
import Home from './components/Home/Home';
import { MediaEdit } from './components/Media/Edit';
import { MediaByTag } from './components/Media/MediaByTag';
import Navigation from './components/Navigation/Navigation';
import { Random } from './components/Media/Random';
import { StandaloneMedia } from './components/Media/StandaloneMedia';
import { Logout } from './Logout';
import AdminNavigation from './admin/AdminNavigation';
import { RequestLogs } from './admin/RequestLogs';
import { Results } from './components/Results';
import { SideNavigation } from './components/Navigation/SideNavigation';
import { RecentlyAddedPage } from './components/Media/RecentlyAddedPage';
import { MobileNavbar } from './components/Navigation/MobileNavbar';
import { Library } from './components/Library/Library';
import { Libraries } from './components/Libraries';
import { EditLibrary } from './components/Library/EditLibrary';
import { UserAdmin } from './admin/UserAdmin';
import { RecentlyViewedPage } from './components/Media/RecentlyViewedPage';
import { TagsPage } from './components/Media/TagsPage';
import { About } from './components/About/About';
import { MultiUpload } from './components/Media/Upload/MultiUpload';

export const AuthenticatedApp = () => {
  return (
    <>
      <Switch>
        <Route path="/admin">
          <AdminNavigation />
          <Route exact path="/admin" component={AdminPanel} />
          <Route path="/admin/register-media" component={RegisterMedia} />
          <Route path="/admin/request-logs" component={RequestLogs} />
          <Route path="/admin/users" component={UserAdmin} />
        </Route>
        <Route path="/">
          <MobileNavbar />
          <Navigation />
          <div className="main d-flex">
            <SideNavigation />
            <div className="main-content flex-grow-1">
              <Switch>
                <Route path="/about" component={About} />
                <Route path="/random" component={Random} />
                <Route path="/results" component={Results} />
                <Route
                  path="/media/recent"
                  component={RecentlyAddedPage}
                  exact
                />
                <Route path="/media/edit/:id" component={MediaEdit} exact />
                <Route path="/media/tags" component={TagsPage} exact />
                <Route path="/media/tag/:tag" component={MediaByTag} exact />
                <Route path="/media/upload" component={MultiUpload} exact />
                <Route
                  path="/media/recently-viewed"
                  component={RecentlyViewedPage}
                  exact
                />
                <Route path="/media/:media" component={StandaloneMedia} exact />
                <Route
                  path="/library/edit/:library"
                  component={EditLibrary}
                  exact
                />
                <Route
                  path="/library/:library/:media?"
                  component={Library}
                  exact
                />
                <Route path="/libraries" component={Libraries} exact />
                <Route path="/logout" component={Logout} />
                <Route exact path="/" component={Home} />
              </Switch>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
};
