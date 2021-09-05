const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const {
  mapDBToDetailThread,
  mapDBToDetailComment,
  mapDBToDetailReply,
} = require('../../Commons/utils/mapdb');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
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
      text: `SELECT threads.*, users.username 
      FROM threads LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    // get comments in thread
    const commentsQuery = {
      text: `SELECT comments.*, users.username 
      FROM comments LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1 
      ORDER BY date ASC`,
      values: [threadId],
    };
    const resComments = await this._pool.query(commentsQuery);

    // get replies in thread
    const repliesQuery = {
      text: `SELECT replies.*, users.username 
      FROM replies LEFT JOIN users ON users.id = replies.owner
      WHERE replies.thread_id = $1 
      ORDER BY date ASC`,
      values: [threadId],
    };
    const resReplies = await this._pool.query(repliesQuery);

    const replies = (commentId) => resReplies.rows.filter((i) => i.comment_id === commentId)
      .map((j) => ({ ...j, content: j.is_delete ? '**balasan telah dihapus**' : j.content }))
      .map(mapDBToDetailReply);
    const comments = resComments.rows.map((i) => ({
      ...i,
      content: i.is_delete ? '**komentar telah dihapus**' : i.content,
      replies: replies(i.id),
    }))
      .map(mapDBToDetailComment);
    const thread = result.rows.map(mapDBToDetailThread)
      .map((i) => ({ ...i, comments }))[0];

    return new DetailThread({ ...thread });
  }
}

module.exports = ThreadRepositoryPostgres;
