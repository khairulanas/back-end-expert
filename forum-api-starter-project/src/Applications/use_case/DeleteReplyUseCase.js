class DeleteReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      replyId,
      credentialId,
    } = useCasePayload;
    await this._commentRepository.verifyReplyAccess(replyId, credentialId);
    return this._commentRepository
      .deleteReplyByReplyId(replyId);
  }
}

module.exports = DeleteReplyUseCase;
