const InvariantError = require('../../Commons/exceptions/InvariantError');
const { mapDBToDetailThread, mapDBToDetailComment, mapDBToDetailReply } = require('../../Commons/utils/mapdb');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, owner) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const now = new Date();
    const date = now.toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread tidak ditemukan');
    }

    // get comments in thread
    const commentsQuery = {
      text: 'SELECT * FROM comments where thread_id = $1',
      values: [threadId],
    };
    const resComments = await this._pool.query(commentsQuery);

    // get replies in thread
    const repliesQuery = {
      text: 'SELECT * FROM replies where thread_id = $1',
      values: [threadId],
    };
    const resReplies = await this._pool.query(repliesQuery);

    const replies = (commentId) => resReplies.rows.filter((i) => i.comment_id === commentId)
      .map(mapDBToDetailReply);
    const comments = resComments.rows.map((i) => ({ ...i, replies: replies(i.comment_id) }))
      .map(mapDBToDetailComment);
    return result.rows.map(mapDBToDetailThread)
      .map((i) => ({ ...i, comments }))[0];
  }
}

module.exports = ThreadRepositoryPostgres;
