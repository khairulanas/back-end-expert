class ThreadHandler {
  constructor({ addThreadUseCase, getDetailThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase;
    this._getDetailThreadUseCase = getDetailThreadUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id,
    };
    const addedThread = await this._addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadHandler;
