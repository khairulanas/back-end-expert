const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      credentialId: 'user-123',
    };
    const expectedDeletedReply = {
      status: 'success',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteReplyByReplyId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedReply));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedReply = await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(deletedReply).toStrictEqual(expectedDeletedReply);
    expect(mockCommentRepository.verifyReplyAccess).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.credentialId,
    );
    expect(mockCommentRepository.deleteReplyByReplyId).toBeCalledWith(
      useCasePayload.replyId,
    );
  });
});
