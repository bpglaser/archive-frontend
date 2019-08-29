import React from 'react';
import 'bulma';
import './App.css';
import Browser from './Browser';
import Preview from './Preview';
import { createMany, ArchiveEntry } from './helpers';
import Cookies from 'js-cookie';
import TabSwitcher from './TabSwitcher';

type State = {
  activeEntry: ArchiveEntry,
  activeTabID: number,
  entries: ArchiveEntry[],
  loading: boolean,
  welcomeDisplayed: boolean,
}

class Primary extends React.Component<any, State> {
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

        <div className="app-content">
          <Browser activeEntry={this.state.activeEntry} entries={this.state.entries!} loading={this.state.loading} rowClickedCallback={this.rowClicked} />
          <Preview activeEntry={this.state.activeEntry} />
        </div>

        {!this.state.welcomeDisplayed &&
          <div className="welcome">
            <h1>Welcome!</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas maecenas pharetra convallis posuere. Vulputate dignissim suspendisse in est ante in nibh. Scelerisque mauris pellentesque pulvinar pellentesque habitant. Feugiat in fermentum posuere urna nec tincidunt praesent semper. Nulla aliquet enim tortor at auctor. Vel quam elementum pulvinar etiam non. Odio pellentesque diam volutpat commodo. Arcu vitae elementum curabitur vitae nunc. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Nibh tortor id aliquet lectus proin nibh. Nibh tellus molestie nunc non blandit massa. Bibendum neque egestas congue quisque egestas diam in. Facilisi morbi tempus iaculis urna id volutpat. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Ullamcorper morbi tincidunt ornare massa eget. Nunc sed id semper risus in hendrerit gravida rutrum. Mattis ullamcorper velit sed ullamcorper morbi tincidunt.</p>
            <p>Erat nam at lectus urna duis convallis convallis tellus. Quam vulputate dignissim suspendisse in est ante. Ullamcorper a lacus vestibulum sed arcu non. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Tristique magna sit amet purus gravida quis blandit turpis cursus. Aliquam id diam maecenas ultricies mi eget. Egestas sed tempus urna et pharetra pharetra massa massa ultricies. Cursus mattis molestie a iaculis at erat pellentesque adipiscing. Sed arcu non odio euismod. Sodales neque sodales ut etiam sit amet nisl purus in. Eleifend donec pretium vulputate sapien nec sagittis. Adipiscing elit ut aliquam purus sit amet. Convallis convallis tellus id interdum. In hac habitasse platea dictumst quisque sagittis purus sit. Et molestie ac feugiat sed. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam.</p>
            <p>Urna condimentum mattis pellentesque id nibh tortor id. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Ornare arcu odio ut sem nulla pharetra. A erat nam at lectus urna duis convallis convallis. Arcu dui vivamus arcu felis bibendum. In fermentum et sollicitudin ac orci phasellus. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Turpis egestas sed tempus urna. Urna molestie at elementum eu facilisis sed. Ipsum a arcu cursus vitae congue mauris rhoncus aenean vel. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Morbi non arcu risus quis. Elit at imperdiet dui accumsan sit. Aliquam purus sit amet luctus venenatis lectus. Sit amet aliquam id diam maecenas.</p>
            <div style={{ textAlign: "center" }}>
              <button onClick={this.hideWelcome}>Okay</button>
            </div>
          </div>
        }
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

export default Primary
