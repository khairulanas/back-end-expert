const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'kana',
          body: 'hanazawa',
        });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread, 'user-123');

        // Assert
        const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          title: 'kana',
          owner: 'user-123',
        }));
        expect(thread).toHaveLength(1);
      });
    });

    describe('getThreadById', () => {
      it('should throw InvariantError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.getThreadById('thread-1234'))
          .rejects
          .toThrowError(InvariantError);
      });

      it('should return detail thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-321' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-321',
          title: 'kanaha',
          body: 'magical mode',
          owner: 'user-321',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const detailThread = await threadRepositoryPostgres.getThreadById('thread-321');

        // Assert
        expect(detailThread.title).toEqual('kanaha');
        expect(detailThread.body).toEqual('magical mode');
        expect(detailThread.username).toEqual('user-321');
      });
    });
  });
});
