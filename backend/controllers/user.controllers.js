const User = require("../models/User");

module.exports.createUser = async (req, res) => {
  const user = new User({
    ...req.body,
  });
  user
    .save()
    .then((user) => res.status(201).json({ user }))
    .catch((e) => res.status(400).json(e));
};
