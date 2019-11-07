import React from 'react';
import { Backend } from '../../Data/Backend';
import { registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { Organization } from '../../Models/Organization';
import { User } from '../../Models/User';

interface Props {
  backend: Backend;
  close: () => void;
  organization: Organization;
  success: (kickedUser: User) => void;
  token: string;
  user: User;
}

interface State {
  disabled: boolean;
  errorMessage: string | null;
}

export default class UserRemovePrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      errorMessage: null,
    };
  }

  componentDidMount() {
    registerEscHandler(this.props.close);
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

  render() {
    return (<div className="modal is-active">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Remove User</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          Are you sure you want to remove <strong>{this.props.user.email}</strong> from <strong>{this.props.organization.name}</strong>?
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-danger is-loading" : "button is-danger"}
            disabled={this.state.disabled}
            onClick={this.deleteArticle}
          >
            Remove User
          </button>
          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage !== null &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  deleteArticle = async () => {
    this.setState({
      disabled: true,
    });

    try {
      await this.props.backend.kickUserFromOrganization(this.props.token, this.props.organization, this.props.user);
      this.props.success(this.props.user);
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to delete article.',
      });
    }

    this.setState({
      disabled: false,
    });
  }
}
