import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import TextFieldGroup from '../common/TextFieldGroupDisplay';
import { logoutUser } from '../../actions/authActions';
import SelectListGroupDisplay from '../common/SelectListGroupDisplay';
import isEmpty from '../../validations/is-empty';
class Dashboard extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    // Redirect to login
    window.location.href = '/login';
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    // If profile field doesnt exist, make empty string
    let dashboardContent;
    // Select options for status
    const designationoptions = [
      { label: '* Select Designation', value: 0 },
      { label: 'CEO', value: 'CEO' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Web Developer', value: 'Web Developer' },
      { label: 'Software Testing', value: 'Software Testing' },
    ];
    // Select options for status
    const departmentoptions = [
      { label: '* Select Department', value: 0 },
      { label: 'Management', value: 'Management' },
      { label: 'HR Department', value: 'HR Department' },
      { label: 'Development', value: 'Development' },
    ];

    // Check if logged in user has profile data
    if (Object.keys(profile).length > 0) {
      // If profile field doesnt exist, make empty string
      profile.designation = !isEmpty(profile.designation)
        ? profile.designation
        : '';
      profile.department = !isEmpty(profile.department)
        ? profile.department
        : '';
      profile.dateofjoining = !isEmpty(profile.dateofjoining)
        ? profile.dateofjoining
        : '';
      const formatDate = (date) => {
        var MyDate = new Date(date);
        var MyDateString;

        //debug
        //MyDate.setDate(MyDate.getDate() - 60);

        MyDateString =
          MyDate.getFullYear() +
          '-' +
          ('0' + (MyDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + MyDate.getDate()).slice(-2);
        return MyDateString;
      };

      dashboardContent = (
        <div>
          <div className='row'>
            <div className='col'>
              <TextFieldGroup
                placeholder='email'
                name='email'
                value={`${user.email}`}
                onChange={this.onChange}
                info='email of employee'
                disabled='disabled'
              />
              <TextFieldGroup
                placeholder='Name'
                name='name'
                value={`${user.name}`}
                onChange={this.onChange}
                info='Name of Employee'
                disabled='disabled'
              />
              <SelectListGroupDisplay
                placeholder='department'
                name='department'
                value={profile.department}
                onChange={this.onChange}
                options={departmentoptions}
                info='select Employee department'
                disabled='disabled'
              />
              <SelectListGroupDisplay
                placeholder='designation'
                name='designation'
                value={profile.designation}
                onChange={this.onChange}
                options={designationoptions}
                info='select Employee designation'
                disabled='disabled'
              />
              <p>Date of Joining</p>
              <input
                type='date'
                name='dateofjoining'
                value={formatDate(profile.dateofjoining)}
                onChange={this.onChange}
                disabled='disabled'
              />
              <br />
              <br />
            </div>
          </div>
        </div>
      );
    } else {
      // User is logged in but has no profile
      dashboardContent = (
        <div>
          <p className='lead text-muted'>Welcome {user.name}</p>
          <p>
            Admin has not yet setup a profile. please contact admin to update
            profile
          </p>

          <Link
            to='/login'
            className='btn btn-lg btn-info'
            onClick={this.onLogoutClick.bind(this)}
          >
            Logout
          </Link>
        </div>
      );
    }

    return (
      <div className='dashboard'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='display-4'>Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, logoutUser }
)(Dashboard);
