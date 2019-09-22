import 'bulma';
import Cookies from 'js-cookie';
import React from 'react';
import Browser from '../Components/Browser';
import Preview from '../Components/Preview';
import TabSwitcher from '../Components/TabSwitcher';
import { createMany } from '../Data/helpers';
import { ArchiveEntry } from '../Models/ArchiveEntry';

interface State {
  activeEntry: ArchiveEntry;
  activeTabID: number;
  entries: ArchiveEntry[];
  loading: boolean;
  welcomeDisplayed: boolean;
}

export default class Primary extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    let welcome = JSON.parse(Cookies.get('welcome') || "false")
    let entries = createMany(10)
    this.state = {
      activeEntry: entries[0],
      activeTabID: 0,
      entries: entries,
      loading: false,
      welcomeDisplayed: welcome
    }
  }

  render() {
    return (
      <div className="container">
        <TabSwitcher tabNames={['Public', 'Robinson Observatory', 'Team Astromaintenance']} selected={0} selectedCallback={this.tabSelected} />

        <div className="columns">
          <Browser
            activeEntry={this.state.activeEntry}
            entries={this.state.entries!}
            loading={this.state.loading}
            maxPages={12}
            rowClickedCallback={this.rowClicked} />

          <Preview activeEntry={this.state.activeEntry} />
        </div>
      </div>
    );
  }

  hideWelcome = () => {
    Cookies.set('welcome', 'true')
    this.setState({
      welcomeDisplayed: true
    })
  }

  tabSelected = (i: number) => {
    console.log('tab selected: ' + i)
  }

  rowClicked = (entry: ArchiveEntry) => {
    this.setState({
      activeEntry: entry
    })
  }
}
