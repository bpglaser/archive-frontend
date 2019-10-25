import * as React from 'react';
import Loader from '../Components/Loader';
import OrganizationCard from '../Components/OrganizationCard';
import CreateOrganizationPrompt from '../Components/Prompts/CreateOrganizationPrompt';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';

interface Props {
  backend: Backend;
  token: string;
}

interface State {
  createOrganizationPromptVisible: boolean;
  errorMessage: string | null;
  loading: boolean;
  organizations: Organization[];
}

export default class Organizations extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      createOrganizationPromptVisible: false,
      errorMessage: null,
      loading: false,
      organizations: [],
    };
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: true,
      });

      const organizations = await this.props.backend.listOrganizations(this.props.token);

      this.setState({
        organizations: organizations,
        loading: false,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'Error loading organizations',
        loading: false,
      });
    }
  }

  render() {
    return (<div>
      <div className="level">
        <div className="level-item">
          <h1 className="title">My Organizations</h1>
        </div>
      </div>

      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <button className="button" onClick={this.showCreateOrganizationPrompt}>

              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>

              <span>
                Create New Organization
              </span>

            </button>
          </div>
        </div>
      </div>


      {this.state.loading &&
        <Loader />
      }

      {!this.state.loading &&
        this.renderOrganizations()
      }

      {this.state.createOrganizationPromptVisible &&
        <CreateOrganizationPrompt
          backend={this.props.backend}
          close={this.hideCreateOrganizationPrompt}
          success={this.newOrganizationCreated}
          token={this.props.token} />
      }
    </div>);
  }

  renderOrganizations = () => {
    if (this.state.organizations.length === 0) {
      return (<span>You don't belong to any organizations.</span>);
    } else {
      return (<div className="organization-cards">
        {
          this.state.organizations.map((organization, i) =>
            <OrganizationCard organization={organization} key={i} />)
        }
      </div>);
    }
  }

  hideCreateOrganizationPrompt = () => {
    this.setState({
      createOrganizationPromptVisible: false,
    });
  }

  showCreateOrganizationPrompt = () => {
    this.setState({
      createOrganizationPromptVisible: true,
    });
  }

  newOrganizationCreated = () => {
    // TODO handle reloading data or redirect
    this.hideCreateOrganizationPrompt();
  }
}
