import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles.length > 0) {
      let a = 0;
      profileItems = profiles.map((profile) => (
        <ProfileItem serial={(a = a + 1)} key={profile._id} profile={profile} />
      ));
    } else {
      profileItems = <h4>No profiles found...</h4>;
    }

    return (
      <div className='profiles'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='display-4 text-center'>Employees Profiles</h1>
              <p className='lead text-center'>List of employee details</p>
              <table className='table'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>S.No</th>
                    <th scope='col'>E-Mail</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Designation</th>
                    <th scope='col' />
                    <th scope='col' />
                  </tr>
                </thead>
                <tbody>{profileItems}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
