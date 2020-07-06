const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/Users');

// @route   POST api/profile
// @desc    Create or edit current user profile
// @access  Private
router.post(
  '/id/:user_id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    if (req.params.user_id) profileFields.user = req.params.user_id;
    if (req.body.department) profileFields.department = req.body.department;
    if (req.body.designation) profileFields.designation = req.body.designation;
    if (req.body.dateofjoining)
      profileFields.dateofjoining = req.body.dateofjoining;

    Profile.findOne({
      user: req.params.user_id,
    }).then((profile) => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          {
            user: req.params.user_id,
          },
          {
            $set: profileFields,
          },
          {
            new: true,
          }
        ).then((profile) => res.json(profile));
      } else {
        // Create
        new Profile(profileFields).save().then((profile) => res.json(profile));
      }
    });
  }
);

// @route   GET api/profile/current
// @desc    Get current users profile
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({
      user: req.user.id,
    })
      .populate('user', ['name', 'email'])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'email', '_id'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) =>
      res.status(404).json({
        profile: 'There are no profiles',
      })
    );
});

// @route   GET api/profile/id/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/id/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({
    user: req.params.user_id,
  })
    .populate('user', ['name', 'email'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    Delete current user and profile
// @access  Private
router.delete(
  '/id/:user_id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    Profile.findOneAndRemove({
      user: req.params.user_id,
    }).then(() => {
      User.findOneAndRemove({
        _id: req.params.user_id,
      }).then(() =>
        res.json({
          success: true,
        })
      );
    });
  }
);

module.exports = router;
