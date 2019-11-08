import Axios, { CancelTokenSource } from 'axios';
import React from 'react';
import { Backend } from '../../Data/Backend';
import { readTokenPayload, registerEscHandler, unregisterEscHandler } from '../../Helpers';
import { Organization } from '../../Models/Organization';
import { User } from '../../Models/User';
import MagicSearch from '../MagicSearch';

interface Props {
  backend: Backend;
  close: () => void;
  success: (organization: Organization) => void;
  token: string;
}

interface State {
  admins: User[];
  disabled: boolean;
  errorMessage: string | null;
  magicSearchErrorMessage?: string;
}

export default class CreateOrganizationPrompt extends React.Component<Props, State> {
  nameRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      admins: [],
      disabled: false,
      errorMessage: null,
    };
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  componentDidMount() {
    registerEscHandler(this.props.close);

    if (this.nameRef.current) {
      this.nameRef.current.focus();
    }
  }

  componentWillUnmount() {
    unregisterEscHandler();
  }

  render() {
    return (<div className="modal is-active has-overflow">
      <div className="modal-background" onClick={this.props.close}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create New Organization</p>
          <button className="delete" aria-label="close" onClick={this.props.close}></button>
        </header>

        <section className="modal-card-body">
          <div className="field">
            <label className="label">Organization Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Organization Name"
                ref={this.nameRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Description"
                ref={this.descriptionRef}
                disabled={this.state.disabled} />
            </div>
          </div>

          <label className="label">Organization Administrators</label>

          {
            this.state.admins.length === 0 ?
              <span className="has-text-danger">Please select at least one admin for the organization.</span>
              :
              <ul>
                {
                  this.state.admins.map((user, i) =>
                    <li key={i}>
                      {user.email}
                      <button className="delete is-small" onClick={() => this.removeAdmin(user)} />
                    </li>
                  )
                }
              </ul>
          }

          <br />

          <div>
            <MagicSearch
              errorMessage={this.state.magicSearchErrorMessage}
              inputPlaceholder="Search by Email"
              suggestionProvider={this.getUserSuggestions}
            />

            {!this.adminsContainSelf() &&
              <button
                className="button"
                onClick={() => this.addAdmin(readTokenPayload(this.props.token))}
                style={{ marginLeft: '1rem' }}
              >
                Add Yourself
            </button>
            }
          </div>
        </section>

        <footer className="modal-card-foot">
          <button
            className={this.state.disabled ? "button is-success is-loading" : "button is-success"}
            disabled={this.state.disabled}
            onClick={this.submitNewOrganization}>
            Create
          </button>

          <button className="button" onClick={this.props.close}>Cancel</button>

          {this.state.errorMessage &&
            <p className="help is-danger">{this.state.errorMessage}</p>
          }
        </footer>
      </div>
    </div>);
  }

  submitNewOrganization = async () => {
    if (this.nameRef.current === null || this.descriptionRef.current === null || this.state.admins.length === 0) {
      return;
    }

    try {
      this.setState({
        disabled: true,
      });

      const name = this.nameRef.current.value;
      const description = this.descriptionRef.current.value;
      const admins = this.state.admins.map((user) => user.userID);

      const newOrganization = await this.props.backend.createOrganization(this.props.token, name, description, admins);
      this.props.success(newOrganization);
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to create organization',
        disabled: false,
      });
    }
  }

  getUserSuggestions = async (source: CancelTokenSource, search: string) => {
    this.setState({
      magicSearchErrorMessage: undefined,
    });

    if (search.trim() === '') {
      return [];
    }

    try {
      return (await this.props.backend.getUserSuggestions(this.props.token, search, source))
        .map((user) => ({ suggestion: user.email, select: () => this.addAdmin(user) }));
    } catch (err) {
      if (!Axios.isCancel(err)) {
        console.log(err);
        this.setState({
          magicSearchErrorMessage: 'Error loading users from server.',
        });
      }
      return [];
    }
  }

  addAdmin = (user: User) => {
    this.setState((oldState) => {
      if (oldState.admins.findIndex((admin) => admin.userID === user.userID) >= 0) {
        return {
          admins: oldState.admins,
        };
      } else {
        return {
          admins: [...oldState.admins, user],
        };
      }
    });
  }

  removeAdmin = (user: User) => {
    this.setState((oldState) => ({
      admins: oldState.admins.filter((admin) => admin.userID !== user.userID),
    }));
  }

  adminsContainSelf = () => {
    const self = readTokenPayload(this.props.token);
    for (const admin of this.state.admins) {
      if (admin.userID === self.userID) {
        return true;
      }
    }
    return false;
  }
}
