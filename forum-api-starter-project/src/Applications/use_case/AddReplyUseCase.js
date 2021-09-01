const NewComment = require('../../Domains/comments/entities/NewComment');

class AddReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      content,
      commentId,
      threadId,
      owner,
    } = useCasePayload;
    const newComment = new NewComment({ content });
    return this._commentRepository
      .addReply(newComment, commentId, threadId, owner);
  }
}

module.exports = AddReplyUseCase;
