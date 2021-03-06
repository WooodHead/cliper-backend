import Comment from '../services/comment';

const newComment = async (ctx, next) => {
  const requestData = ctx.request.body;
  const cliperId = requestData.cliperId;
  const userId = ctx.session.userId;
  const content = requestData.content;
  const commentObj = {
    userId,
    cliperId,
    content
  };
  const result = await Comment.addComment(commentObj);
  ctx.body = {
    data: result,
    success: true
  };
};

const getComments = async (ctx, next) => {
  const cliperId = ctx.params.id;
  const userId = ctx.session.userId;
  const comments = await Comment.getComments(cliperId, userId);
  ctx.body = {
    success: true,
    data: comments
  };
};

const deleteComment = async (ctx, next) => {
  const commentId = ctx.params.id;
  const result = await Comment.deleteComment(commentId);
  ctx.body = {
    data: result,
    success: true
  };
};

const updateComment = async (ctx, next) => {
  const commentId = ctx.params.id;
  const requestData = ctx.request.body;
  const content = requestData.content;
  const result = await Comment.updateComment({
    objectId: commentId,
    content
  });
  ctx.body = {
    data: result,
    success: true
  };
};

export default {
  newComment,
  getComments,
  deleteComment,
  updateComment
}
