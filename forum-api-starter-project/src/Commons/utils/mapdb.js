/* eslint-disable camelcase */
const mapDBToDetailThread = ({
  id,
  title,
  body,
  date,
  owner,
}) => ({
  id,
  title,
  body,
  date,
  username: owner,
});

module.exports = { mapDBToDetailThread };
