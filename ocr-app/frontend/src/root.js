import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useMount, useLocalStorage } from 'react-use';
import Home from './views/home';

export default function Root() {
  const [uid, setUuid] = useLocalStorage('uuid');
  useMount(() => {
    if (!uid) {
      setUuid(uuidv4());
    }
  });
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
