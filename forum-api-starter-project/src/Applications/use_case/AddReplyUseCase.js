const NewComment = require('../../Domains/comments/entities/NewComment');

class AddReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      content,
      threadId,
      commentId,
      owner,
    } = useCasePayload;
    const newComment = new NewComment({ content });
    return this._commentRepository
      .addReply(newComment, threadId, commentId, owner);
  }
}

module.exports = AddReplyUseCase;
