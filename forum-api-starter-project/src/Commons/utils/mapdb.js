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

const mapDBToDetailComment = ({
  id,
  owner,
  date,
  content,
  replies,
}) => ({
  id,
  username: owner,
  date,
  content,
  replies,
});
const mapDBToDetailReply = ({
  id,
  owner,
  date,
  content,
}) => ({
  id,
  username: owner,
  date,
  content,
});

module.exports = { mapDBToDetailThread, mapDBToDetailComment, mapDBToDetailReply };
